import { InitializePaymentInput, PaymentProvider, VerifiedPayment } from './payment.provider.js';
export declare class FakePaymentProvider extends PaymentProvider {
    private paid;
    initialize(input: InitializePaymentInput): Promise<{
        checkoutUrl: string;
    }>;
    markPaid(reference: string, amountKobo: number): void;
    verify(_secretKey: string | null, reference: string): Promise<VerifiedPayment>;
    isValidSignature(): boolean;
}
