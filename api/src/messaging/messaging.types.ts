export type InboundType = 'text' | 'audio' | 'image';

/** Gateway-neutral inbound message. Domain code must never see Baileys / Cloud API types. */
export interface InboundMessage {
  merchantId: string;
  chatId: string; // customer phone digits, e.g. 2348012345678
  messageId: string; // provider message id, used for dedupe
  type: InboundType;
  text?: string;
  /** Opaque handle the gateway can resolve to bytes via downloadMedia(). */
  mediaRef?: string;
  /** True when the business owner typed this from their own phone (triggers AI pause). */
  fromMe: boolean;
  pushName?: string;
  timestamp: Date;
}

export type InboundHandler = (msg: InboundMessage) => Promise<void>;

export type SessionState = 'DISCONNECTED' | 'QR_PENDING' | 'CONNECTED';

/** Port. Adapters: SimulatorGateway (dev/tests), BaileysGateway, later CloudApiGateway. */
export abstract class MessagingGateway {
  abstract onInbound(handler: InboundHandler): void;
  abstract sendText(merchantId: string, chatId: string, text: string): Promise<void>;
  abstract sendImage(merchantId: string, chatId: string, url: string, caption?: string): Promise<void>;
  abstract sendDocument(
    merchantId: string,
    chatId: string,
    data: Buffer,
    fileName: string,
    mimeType: string,
    caption?: string,
  ): Promise<void>;
  abstract downloadMedia(merchantId: string, mediaRef: string): Promise<Buffer>;
  /** Shows "typing..." so replies look human and are less bot-like for anti-ban. */
  abstract setTyping(merchantId: string, chatId: string, typing: boolean): Promise<void>;
  abstract sessionState(merchantId: string): SessionState;
}
