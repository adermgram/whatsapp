import { InboundHandler, InboundMessage, MessagingGateway, SessionState } from './messaging.types.js';
export interface SentItem {
    merchantId: string;
    chatId: string;
    kind: 'text' | 'image' | 'document';
    text?: string;
    url?: string;
    fileName?: string;
    size?: number;
}
export declare class SimulatorGateway extends MessagingGateway {
    private handlers;
    readonly sent: SentItem[];
    private listeners;
    private media;
    onInbound(handler: InboundHandler): void;
    onSend(listener: (item: SentItem) => void): void;
    private record;
    sendText(merchantId: string, chatId: string, text: string): Promise<void>;
    sendImage(merchantId: string, chatId: string, url: string, caption?: string): Promise<void>;
    sendImageBuffer(merchantId: string, chatId: string, data: Buffer, _mimeType: string, caption?: string): Promise<void>;
    sendDocument(merchantId: string, chatId: string, data: Buffer, fileName: string, _mimeType: string, caption?: string): Promise<void>;
    downloadMedia(_merchantId: string, mediaRef: string, maxBytes?: number): Promise<Buffer<ArrayBufferLike>>;
    setTyping(): Promise<void>;
    sessionState(): SessionState;
    simulateInbound(msg: Omit<InboundMessage, 'timestamp' | 'fromMe'> & Partial<InboundMessage>): Promise<void>;
    registerMedia(ref: string, data: Buffer): void;
}
