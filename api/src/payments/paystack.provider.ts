import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  InitializePaymentInput,
  PaymentProvider,
  VerifiedPayment,
} from './payment.provider.js';

const BASE = 'https://api.paystack.co';

interface PaystackEnvelope<T> {
  status: boolean;
  message: string;
  data: T;
}

@Injectable()
export class PaystackProvider extends PaymentProvider {
  private async call<T>(secretKey: string | null, path: string, init?: RequestInit): Promise<T> {
    if (!secretKey) throw new Error('Merchant has not added a Paystack secret key');
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
    });
    const body = (await res.json()) as PaystackEnvelope<T>;
    if (!res.ok || !body.status) {
      throw new Error(`Paystack ${path} failed: ${body.message ?? res.status}`);
    }
    return body.data;
  }

  async initialize(input: InitializePaymentInput) {
    const data = await this.call<{ authorization_url: string }>(input.secretKey, '/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        amount: input.amountKobo, // kobo, integer
        currency: 'NGN',
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });
    return { checkoutUrl: data.authorization_url };
  }

  async verify(secretKey: string | null, reference: string): Promise<VerifiedPayment> {
    try {
      const data = await this.call<{ status: string; amount: number; currency: string }>(
        secretKey,
        `/transaction/verify/${encodeURIComponent(reference)}`,
      );
      return { paid: data.status === 'success', amountKobo: data.amount, currency: data.currency };
    } catch (err) {
      // Paystack answers "reference not found" for a link nobody has opened yet. That just means "not paid".
      if (err instanceof Error && /reference not found/i.test(err.message)) {
        return { paid: false, amountKobo: 0, currency: 'NGN' };
      }
      throw err;
    }
  }

  /** HMAC-SHA512 of the RAW body with the merchant's secret key, hex, compared in constant time. */
  isValidSignature(secretKey: string | null, rawBody: Buffer, signature: string | undefined): boolean {
    if (!secretKey || !signature) return false;
    const expected = createHmac('sha512', secretKey).update(rawBody).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
