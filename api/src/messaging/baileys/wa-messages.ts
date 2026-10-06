/**
 * Pure helpers that turn raw WhatsApp (Baileys) message shapes into our neutral ones.
 * No Baileys import on purpose: this file stays easy to unit test and the domain never sees Baileys types.
 */

export interface RawKey {
  remoteJid?: string | null;
  remoteJidAlt?: string | null;
}

const userPart = (jid: string) => jid.split('@')[0]!.split(':')[0]!;

/**
 * The chat id we store: the phone number when we can see it ("2348012345678"), otherwise WhatsApp's
 * privacy id ("lid:1234..."). Groups, broadcasts/status and channels return null (we never answer those).
 * WhatsApp v7 may address a person by LID and put their phone-number JID in remoteJidAlt.
 */
export function chatIdFromKey(key: RawKey): string | null {
  const jids = [key.remoteJidAlt, key.remoteJid].filter((j): j is string => !!j);
  if (jids.length === 0) return null;
  if (jids.some((j) => /@(g\.us|broadcast|newsletter)$/.test(j))) return null;
  const pn = jids.find((j) => j.endsWith('@s.whatsapp.net'));
  if (pn) return userPart(pn);
  const lid = jids.find((j) => j.endsWith('@lid'));
  return lid ? `lid:${userPart(lid)}` : null;
}

export function jidFromChatId(chatId: string): string {
  return chatId.startsWith('lid:') ? `${chatId.slice(4)}@lid` : `${chatId}@s.whatsapp.net`;
}

export interface Content {
  type: 'text' | 'audio' | 'image';
  text?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Msg = Record<string, any>;

const WRAPPERS = [
  'ephemeralMessage',
  'viewOnceMessage',
  'viewOnceMessageV2',
  'viewOnceMessageV2Extension',
  'documentWithCaptionMessage',
  'deviceSentMessage',
];

/** Peels the wrappers WhatsApp puts around a message (disappearing chats, view-once, ...). */
function unwrap(message: Msg | null | undefined): Msg | undefined {
  let m = message ?? undefined;
  for (let i = 0; i < 5 && m; i++) {
    const current: Msg = m;
    const inner = WRAPPERS.map((w) => current[w]?.message).find(Boolean);
    if (!inner) break;
    m = inner;
  }
  return m;
}

/** What the customer actually sent. Returns null for things we ignore (reactions, receipts, stickers, ...). */
export function extractContent(message: Msg | null | undefined): Content | null {
  const m = unwrap(message);
  if (!m) return null;
  if (typeof m.conversation === 'string' && m.conversation) return { type: 'text', text: m.conversation };
  if (m.extendedTextMessage?.text) return { type: 'text', text: m.extendedTextMessage.text };
  if (m.imageMessage) return { type: 'image', text: m.imageMessage.caption || undefined };
  if (m.audioMessage) return { type: 'audio' };
  return null;
}
