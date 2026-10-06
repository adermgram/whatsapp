import { InitializePaymentInput, PaymentProvider, VerifiedPayment } from './payment.provider.js';
export declare class PaystackProvider extends PaymentProvider {
    private call;
    initialize(input: InitializePaymentInput): Promise<{
        checkoutUrl: string;
    }>;
    verify(secretKey: string | null, reference: string): Promise<VerifiedPayment>;
    isValidSignature(secretKey: string | null, rawBody: Buffer, signature: string | undefined): boolean;
}
