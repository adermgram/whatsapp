var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { PaymentProvider, } from './payment.provider.js';
let FakePaymentProvider = class FakePaymentProvider extends PaymentProvider {
    paid = new Map();
    async initialize(input) {
        return { checkoutUrl: `https://fake-pay.local/pay/${input.reference}` };
    }
    markPaid(reference, amountKobo) {
        this.paid.set(reference, amountKobo);
    }
    async verify(_secretKey, reference) {
        const amount = this.paid.get(reference);
        return { paid: amount !== undefined, amountKobo: amount ?? 0, currency: 'NGN' };
    }
    isValidSignature() {
        return true;
    }
};
FakePaymentProvider = __decorate([
    Injectable()
], FakePaymentProvider);
export { FakePaymentProvider };
//# sourceMappingURL=fake-payment.provider.js.map