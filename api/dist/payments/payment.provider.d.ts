export interface InitializePaymentInput {
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
export declare abstract class PaymentProvider {
    abstract initialize(input: InitializePaymentInput): Promise<{
        checkoutUrl: string;
    }>;
    abstract verify(secretKey: string | null, reference: string): Promise<VerifiedPayment>;
    abstract isValidSignature(secretKey: string | null, rawBody: Buffer, signature: string | undefined): boolean;
}
