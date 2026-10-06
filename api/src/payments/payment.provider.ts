export interface InitializePaymentInput {
  /** Merchant's own secret key (money goes straight to their account). Null in dev/fake mode. */
  secretKey: string | null;
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface VerifiedPayment {
  paid: boolean;
  amountKobo: number;
  currency: string;
}

/** Port. Adapters: PaystackProvider, FakePaymentProvider (dev/tests). */
export abstract class PaymentProvider {
  abstract initialize(input: InitializePaymentInput): Promise<{ checkoutUrl: string }>;
  /** Always re-check with the provider; never trust a webhook body or a customer's word. */
  abstract verify(secretKey: string | null, reference: string): Promise<VerifiedPayment>;
  abstract isValidSignature(secretKey: string | null, rawBody: Buffer, signature: string | undefined): boolean;
}
