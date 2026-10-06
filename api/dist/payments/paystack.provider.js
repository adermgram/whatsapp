var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PaymentProvider, } from './payment.provider.js';
const BASE = 'https://api.paystack.co';
let PaystackProvider = class PaystackProvider extends PaymentProvider {
    async call(secretKey, path, init) {
        if (!secretKey)
            throw new Error('Merchant has not added a Paystack secret key');
        const res = await fetch(`${BASE}${path}`, {
            ...init,
            headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
        });
        const body = (await res.json());
        if (!res.ok || !body.status) {
            throw new Error(`Paystack ${path} failed: ${body.message ?? res.status}`);
        }
        return body.data;
    }
    async initialize(input) {
        const data = await this.call(input.secretKey, '/transaction/initialize', {
            method: 'POST',
            body: JSON.stringify({
                email: input.email,
                amount: input.amountKobo,
                currency: 'NGN',
                reference: input.reference,
                callback_url: input.callbackUrl,
                metadata: input.metadata,
            }),
        });
        return { checkoutUrl: data.authorization_url };
    }
    async verify(secretKey, reference) {
        const data = await this.call(secretKey, `/transaction/verify/${encodeURIComponent(reference)}`);
        return { paid: data.status === 'success', amountKobo: data.amount, currency: data.currency };
    }
    isValidSignature(secretKey, rawBody, signature) {
        if (!secretKey || !signature)
            return false;
        const expected = createHmac('sha512', secretKey).update(rawBody).digest('hex');
        const a = Buffer.from(expected);
        const b = Buffer.from(signature);
        return a.length === b.length && timingSafeEqual(a, b);
    }
};
PaystackProvider = __decorate([
    Injectable()
], PaystackProvider);
export { PaystackProvider };
//# sourceMappingURL=paystack.provider.js.map