export type InboundType = 'text' | 'audio' | 'image' | 'document';
export interface InboundMessage {
    merchantId: string;
    chatId: string;
    messageId: string;
    type: InboundType;
    text?: string;
    mediaRef?: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
    fromMe: boolean;
    pushName?: string;
    timestamp: Date;
}
export type InboundHandler = (msg: InboundMessage) => Promise<void>;
export type SessionState = 'DISCONNECTED' | 'QR_PENDING' | 'CONNECTED';
export declare class MediaTooLargeError extends Error {
    readonly maxBytes: number;
    constructor(maxBytes: number);
}
export declare abstract class MessagingGateway {
    abstract onInbound(handler: InboundHandler): void;
    abstract sendText(merchantId: string, chatId: string, text: string): Promise<void>;
    abstract sendImage(merchantId: string, chatId: string, url: string, caption?: string): Promise<void>;
    abstract sendImageBuffer(merchantId: string, chatId: string, data: Buffer, mimeType: string, caption?: string): Promise<void>;
    abstract sendDocument(merchantId: string, chatId: string, data: Buffer, fileName: string, mimeType: string, caption?: string): Promise<void>;
    abstract downloadMedia(merchantId: string, mediaRef: string, maxBytes?: number): Promise<Buffer>;
    abstract setTyping(merchantId: string, chatId: string, typing: boolean): Promise<void>;
    abstract sessionState(merchantId: string): SessionState;
}
