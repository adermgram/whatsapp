import { Injectable } from '@nestjs/common';
import {
  InitializePaymentInput,
  PaymentProvider,
  VerifiedPayment,
} from './payment.provider.js';

/** Dev/test provider: no network. Tests mark references as paid via markPaid(). */
@Injectable()
export class FakePaymentProvider extends PaymentProvider {
  private paid = new Map<string, number>();

  async initialize(input: InitializePaymentInput) {
    return { checkoutUrl: `https://fake-pay.local/pay/${input.reference}` };
  }

  markPaid(reference: string, amountKobo: number) {
    this.paid.set(reference, amountKobo);
  }

  async verify(_secretKey: string | null, reference: string): Promise<VerifiedPayment> {
    const amount = this.paid.get(reference);
    return { paid: amount !== undefined, amountKobo: amount ?? 0, currency: 'NGN' };
  }

  isValidSignature() {
    return true;
  }
}
