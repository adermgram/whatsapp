import { Injectable } from '@nestjs/common';
import {
  InboundHandler,
  InboundMessage,
  MessagingGateway,
  SessionState,
} from './messaging.types.js';

export interface SentItem {
  merchantId: string;
  chatId: string;
  kind: 'text' | 'image' | 'document';
  text?: string;
  url?: string;
  fileName?: string;
  size?: number;
}

/** In-memory gateway for tests and the terminal chat. Records everything it "sends". */
@Injectable()
export class SimulatorGateway extends MessagingGateway {
  private handlers: InboundHandler[] = [];
  readonly sent: SentItem[] = [];
  private media = new Map<string, Buffer>();

  onInbound(handler: InboundHandler) {
    this.handlers.push(handler);
  }

  async sendText(merchantId: string, chatId: string, text: string) {
    this.sent.push({ merchantId, chatId, kind: 'text', text });
  }

  async sendImage(merchantId: string, chatId: string, url: string, caption?: string) {
    this.sent.push({ merchantId, chatId, kind: 'image', url, text: caption });
  }

  async sendDocument(
    merchantId: string,
    chatId: string,
    data: Buffer,
    fileName: string,
    _mimeType: string,
    caption?: string,
  ) {
    this.sent.push({ merchantId, chatId, kind: 'document', fileName, size: data.length, text: caption });
  }

  async downloadMedia(_merchantId: string, mediaRef: string) {
    const buf = this.media.get(mediaRef);
    if (!buf) throw new Error(`No media for ref ${mediaRef}`);
    return buf;
  }

  async setTyping() {}

  sessionState(): SessionState {
    return 'CONNECTED';
  }

  /** Test/CLI helper: pretend a customer sent a message. */
  async simulateInbound(msg: Omit<InboundMessage, 'timestamp' | 'fromMe'> & Partial<InboundMessage>) {
    const full: InboundMessage = { fromMe: false, timestamp: new Date(), ...msg };
    for (const h of this.handlers) await h(full);
  }

  registerMedia(ref: string, data: Buffer) {
    this.media.set(ref, data);
  }
}
