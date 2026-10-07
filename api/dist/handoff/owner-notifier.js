var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
export class OwnerNotifier {
}
let LogOwnerNotifier = class LogOwnerNotifier extends OwnerNotifier {
    alerts = [];
    async notifyHandoff(alert) {
        this.alerts.push({ type: 'handoff', ...alert });
    }
    async notifyMessageWhileHuman(merchantId, customerPhone, text) {
        this.alerts.push({ type: 'human-message', merchantId, customerPhone, text });
    }
    forwardWorks = true;
    async notifyPaymentProof(merchantId, alert) {
        const { file, ...rest } = alert;
        this.alerts.push({
            type: 'payment-proof',
            merchantId,
            ...rest,
            file: file ? { kind: file.kind, mimeType: file.mimeType, fileName: file.fileName, size: file.data.length } : undefined,
        });
        return this.forwardWorks && !!file;
    }
    async notifyPayment(merchantId, info) {
        this.alerts.push({ type: 'payment', merchantId, ...info });
    }
};
LogOwnerNotifier = __decorate([
    Injectable()
], LogOwnerNotifier);
export { LogOwnerNotifier };
//# sourceMappingURL=owner-notifier.js.map