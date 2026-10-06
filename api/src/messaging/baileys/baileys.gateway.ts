import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import makeWASocket, {
  Browsers,
  DisconnectReason,
  downloadMediaMessage,
  fetchLatestBaileysVersion,
  jidDecode,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys';
import type { AnyMessageContent, WAMessage, WASocket } from '@whiskeysockets/baileys';
import pino from 'pino';
import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaService } from '../../prisma/prisma.service.js';
import { env } from '../../config/env.js';
import { InboundHandler, MessagingGateway, SessionState } from '../messaging.types.js';
import { isChatAllowed, normalizePhone, parseAllowlist } from '../reply-policy.js';
import { chatIdFromKey, extractContent, jidFromChatId } from './wa-messages.js';
import { hasStoredLogin, useDbAuthState } from './db-auth-state.js';

const MIN_SEND_GAP_MS = 1200; // never fire messages back to back: reads as a bot to WhatsApp
const MAX_BACKLOG_AGE_S = 30 * 60; // answer a customer who wrote while we were briefly offline, but not old history
const MAX_OWNER_EVENT_AGE_S = 2 * 60;
const SENT_ID_MEMORY = 1000;
const MEDIA_MEMORY = 50;

interface Session {
  sock: WASocket;
  state: SessionState;
  ownPhone?: string;
  attempts: number;
  closing?: boolean;
  pairingRequested?: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const tsSeconds = (ts: unknown): number => {
  if (typeof ts === 'number') return ts;
  const long = ts as { toNumber?: () => number } | null | undefined;
  return long?.toNumber ? long.toNumber() : Number(ts ?? 0);
};

/**
 * WhatsApp through the unofficial Baileys library. Everything Baileys-specific lives in this folder;
 * the rest of the app only sees the MessagingGateway port, so the official Cloud API can replace this file.
 */
@Injectable()
export class BaileysGateway extends MessagingGateway implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly log = new Logger(BaileysGateway.name);
  private readonly baileysLog = pino({ level: process.env.BAILEYS_LOG ?? 'warn' });
  private readonly sessions = new Map<string, Session>();
  private handlers: InboundHandler[] = [];
  private readonly policy = {
    allowlist: parseAllowlist(env.WHATSAPP_ALLOWLIST),
    replyToAll: env.WHATSAPP_REPLY_TO_ALL === 'true',
  };
  private readonly warnedChats = new Set<string>();
  /** Ids of messages WE sent, so a copy echoed back by WhatsApp is not mistaken for the owner typing. */
  private readonly sentIds = new Set<string>();
  private readonly mediaCache = new Map<string, WAMessage>();
  private readonly sendChain = new Map<string, Promise<unknown>>();
  private readonly lastSendAt = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // ---- lifecycle ---------------------------------------------------------------------------------

  async onApplicationBootstrap() {
    if (!this.policy.replyToAll && this.policy.allowlist.size === 0) {
      this.log.warn(
        'SAFE MODE: WHATSAPP_ALLOWLIST is empty and WHATSAPP_REPLY_TO_ALL is not true, so the bot will answer NOBODY. ' +
          'Add the numbers you want to test with to WHATSAPP_ALLOWLIST in .env.',
      );
    }
    void this.connectKnownMerchants();
  }

  async onApplicationShutdown() {
    for (const [, s] of this.sessions) {
      s.closing = true;
      this.endSocket(s.sock);
    }
  }

  /** Closes a socket without ever throwing or leaving a rejected promise behind (it may already be closed). */
  private endSocket(sock: WASocket) {
    try {
      void Promise.resolve(sock.end(undefined)).catch(() => undefined);
    } catch {
      /* already closed */
    }
  }

  private async connectKnownMerchants() {
    const merchants = await this.prisma.merchant.findMany({ select: { id: true, ownerEmail: true } });
    for (const m of merchants) {
      try {
        if ((await hasStoredLogin(this.prisma, m.id)) || m.ownerEmail === env.WHATSAPP_CONNECT_EMAIL) {
          await this.connect(m.id);
        }
      } catch (err) {
        this.log.error(`Could not start WhatsApp for merchant ${m.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // ---- connection --------------------------------------------------------------------------------

  /** Opens (or re-opens) a merchant's WhatsApp connection. Shows a QR in the terminal if not linked yet. */
  async connect(merchantId: string): Promise<void> {
    const previous = this.sessions.get(merchantId);
    if (previous) {
      previous.closing = true;
      this.endSocket(previous.sock);
    }

    const { state, saveCreds, clear } = await useDbAuthState(this.prisma, merchantId);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, this.baileysLog) },
      logger: this.baileysLog,
      browser: Browsers.macOS('Chrome'),
      markOnlineOnConnect: false, // keep the owner's phone notifications working
      syncFullHistory: false,
      getMessage: async () => undefined,
    });
    const session: Session = { sock, state: 'DISCONNECTED', attempts: previous?.attempts ?? 0 };
    this.sessions.set(merchantId, session);

    sock.ev.on('creds.update', () => void saveCreds().catch((e) => this.log.error(`saveCreds failed: ${String(e)}`)));

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) void this.onQr(merchantId, session, qr);

      if (connection === 'open') {
        session.state = 'CONNECTED';
        session.attempts = 0;
        session.ownPhone = jidDecode(sock.user?.id)?.user;
        this.log.log(`WhatsApp connected for merchant ${merchantId} as +${session.ownPhone ?? '?'}`);
        void this.saveSession(merchantId, { status: 'CONNECTED', phone: session.ownPhone ?? null, qr: null });
      }

      if (connection === 'close') {
        if (session.closing) return; // we closed it ourselves (reconnect or shutdown)
        const code = (lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)?.output?.statusCode;
        session.state = 'DISCONNECTED';

        if (code === DisconnectReason.loggedOut) {
          this.log.warn(`Merchant ${merchantId} was logged out from the phone. Run the bot again and scan a new QR.`);
          void clear().then(() => this.saveSession(merchantId, { status: 'DISCONNECTED', phone: null, qr: null }));
          return;
        }
        if (code === DisconnectReason.connectionReplaced) {
          this.log.error(
            `Merchant ${merchantId}: this WhatsApp login is open somewhere else (a second copy of the bot?). Not reconnecting.`,
          );
          return;
        }
        // 515 "restart required" is normal right after scanning the QR; anything else gets a backoff.
        const delay = code === DisconnectReason.restartRequired ? 500 : Math.min(30_000, 1000 * 2 ** session.attempts++);
        this.log.warn(`WhatsApp closed (code ${code ?? 'unknown'}) for merchant ${merchantId}; reconnecting in ${delay}ms`);
        setTimeout(() => void this.connect(merchantId).catch((e) => this.log.error(`Reconnect failed: ${String(e)}`)), delay);
      }
    });

    sock.ev.on('messages.upsert', ({ messages, type }) => {
      for (const msg of messages) void this.onMessage(merchantId, session, msg, type).catch((e) => this.log.error(`Inbound failed: ${String(e)}`));
    });
  }

  private async onQr(merchantId: string, session: Session, qr: string) {
    session.state = 'QR_PENDING';
    await this.saveSession(merchantId, { status: 'QR_PENDING', qr });

    // Linking by code is easier when WhatsApp is on the same phone you are working at.
    if (env.WHATSAPP_PAIRING_PHONE && !session.pairingRequested && !session.sock.authState.creds.registered) {
      session.pairingRequested = true;
      const code = await session.sock.requestPairingCode(normalizePhone(env.WHATSAPP_PAIRING_PHONE));
      this.log.log(`\nLink with code: ${code}\nWhatsApp > Settings > Linked devices > Link a device > "Link with phone number instead"\n`);
      return;
    }

    const png = resolve(env.STORAGE_DIR, `whatsapp-qr-${merchantId}.png`);
    await mkdir(resolve(env.STORAGE_DIR), { recursive: true });
    await QRCode.toFile(png, qr, { width: 420, margin: 2 });
    console.log(await QRCode.toString(qr, { type: 'terminal', small: true }));
    this.log.log(`Scan this QR: WhatsApp > Settings > Linked devices > Link a device.\nIf the terminal QR is hard to scan, open the picture: ${png}`);
  }

  private saveSession(merchantId: string, data: { status: SessionState; phone?: string | null; qr?: string | null }) {
    return this.prisma.whatsAppSession
      .upsert({ where: { merchantId }, create: { merchantId, ...data }, update: data })
      .catch((e) => this.log.error(`Could not save session state: ${String(e)}`));
  }

  // ---- inbound -----------------------------------------------------------------------------------

  private async onMessage(merchantId: string, session: Session, msg: WAMessage, type: string) {
    if (!msg.message || !msg.key.id) return;

    const fromMe = !!msg.key.fromMe;
    if (fromMe && this.sentIds.has(msg.key.id)) return; // an echo of something the bot sent

    const chatId = chatIdFromKey(msg.key);
    if (!chatId) return; // groups, status, channels
    if (chatId === session.ownPhone) return; // the owner's "message yourself" chat (our own alerts live there)

    const age = Date.now() / 1000 - tsSeconds(msg.messageTimestamp);
    if (fromMe ? age > MAX_OWNER_EVENT_AGE_S : type !== 'notify' || age > MAX_BACKLOG_AGE_S) return;

    const content = extractContent(msg.message);
    if (!content) return;

    if (!isChatAllowed(chatId, this.policy)) {
      if (!this.warnedChats.has(chatId)) {
        this.warnedChats.add(chatId);
        this.log.warn(`Ignoring ${chatId}: not on WHATSAPP_ALLOWLIST. To let the bot answer this chat, add "${chatId}" to WHATSAPP_ALLOWLIST.`);
      }
      return;
    }

    if (content.type === 'audio') this.remember(this.mediaCache, msg.key.id, msg, MEDIA_MEMORY);
    if (!fromMe) void session.sock.readMessages([msg.key]).catch(() => undefined); // blue ticks, like a person

    const inbound = {
      merchantId,
      chatId,
      messageId: msg.key.id,
      type: content.type,
      text: content.text,
      mediaRef: content.type === 'audio' ? msg.key.id : undefined,
      fromMe,
      pushName: msg.pushName ?? undefined,
      timestamp: new Date(tsSeconds(msg.messageTimestamp) * 1000),
    };
    for (const h of this.handlers) await h(inbound);
  }

  onInbound(handler: InboundHandler) {
    this.handlers.push(handler);
  }

  // ---- outbound ----------------------------------------------------------------------------------

  async sendText(merchantId: string, chatId: string, text: string) {
    await this.send(merchantId, chatId, { text });
  }

  async sendImage(merchantId: string, chatId: string, url: string, caption?: string) {
    await this.send(merchantId, chatId, { image: { url }, caption });
  }

  async sendDocument(merchantId: string, chatId: string, data: Buffer, fileName: string, mimeType: string, caption?: string) {
    await this.send(merchantId, chatId, { document: data, fileName, mimetype: mimeType, caption });
  }

  async setTyping(merchantId: string, chatId: string, typing: boolean) {
    const s = this.connected(merchantId);
    const jid = jidFromChatId(chatId);
    try {
      if (typing) await s.sock.presenceSubscribe(jid);
      await s.sock.sendPresenceUpdate(typing ? 'composing' : 'paused', jid);
    } catch {
      /* presence is cosmetic */
    }
  }

  async downloadMedia(merchantId: string, mediaRef: string): Promise<Buffer> {
    const s = this.connected(merchantId);
    const msg = this.mediaCache.get(mediaRef);
    if (!msg) throw new Error(`Media ${mediaRef} is no longer available`);
    return (await downloadMediaMessage(msg, 'buffer', {}, { logger: this.baileysLog, reuploadRequest: s.sock.updateMediaMessage })) as Buffer;
  }

  sessionState(merchantId: string): SessionState {
    return this.sessions.get(merchantId)?.state ?? 'DISCONNECTED';
  }

  // ---- internals ---------------------------------------------------------------------------------

  private connected(merchantId: string): Session {
    const s = this.sessions.get(merchantId);
    if (!s || s.state !== 'CONNECTED') throw new Error(`WhatsApp is not connected for merchant ${merchantId}`);
    return s;
  }

  /** One send at a time per merchant, spaced out with a little randomness. */
  private send(merchantId: string, chatId: string, content: AnyMessageContent): Promise<void> {
    const prev = this.sendChain.get(merchantId) ?? Promise.resolve();
    const run = prev
      .catch(() => undefined)
      .then(async () => {
        const s = this.connected(merchantId);
        const wait = (this.lastSendAt.get(merchantId) ?? 0) + MIN_SEND_GAP_MS + Math.random() * 800 - Date.now();
        if (wait > 0) await sleep(wait);
        try {
          const res = await s.sock.sendMessage(jidFromChatId(chatId), content);
          if (res?.key.id) this.remember(this.sentIds, res.key.id, undefined, SENT_ID_MEMORY);
        } finally {
          this.lastSendAt.set(merchantId, Date.now());
        }
      });
    this.sendChain.set(merchantId, run.catch(() => undefined));
    return run;
  }

  /** Bounded in-memory set/map: forget the oldest entries. */
  private remember<V>(store: Set<string> | Map<string, V>, key: string, value: V | undefined, max: number) {
    if (store instanceof Set) store.add(key);
    else store.set(key, value as V);
    while (store.size > max) store.delete(store.keys().next().value as string);
  }
}
