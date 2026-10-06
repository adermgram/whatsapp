var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { MessagingGateway, } from './messaging.types.js';
let SimulatorGateway = class SimulatorGateway extends MessagingGateway {
    handlers = [];
    sent = [];
    listeners = [];
    media = new Map();
    onInbound(handler) {
        this.handlers.push(handler);
    }
    onSend(listener) {
        this.listeners.push(listener);
    }
    record(item) {
        this.sent.push(item);
        for (const l of this.listeners)
            l(item);
    }
    async sendText(merchantId, chatId, text) {
        this.record({ merchantId, chatId, kind: 'text', text });
    }
    async sendImage(merchantId, chatId, url, caption) {
        this.record({ merchantId, chatId, kind: 'image', url, text: caption });
    }
    async sendDocument(merchantId, chatId, data, fileName, _mimeType, caption) {
        this.record({ merchantId, chatId, kind: 'document', fileName, size: data.length, text: caption });
    }
    async downloadMedia(_merchantId, mediaRef) {
        const buf = this.media.get(mediaRef);
        if (!buf)
            throw new Error(`No media for ref ${mediaRef}`);
        return buf;
    }
    async setTyping() { }
    sessionState() {
        return 'CONNECTED';
    }
    async simulateInbound(msg) {
        const full = { fromMe: false, timestamp: new Date(), ...msg };
        for (const h of this.handlers)
            await h(full);
    }
    registerMedia(ref, data) {
        this.media.set(ref, data);
    }
};
SimulatorGateway = __decorate([
    Injectable()
], SimulatorGateway);
export { SimulatorGateway };
//# sourceMappingURL=simulator.gateway.js.map