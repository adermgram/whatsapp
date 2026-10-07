export interface PaymentAlert {
    orderNumber: string;
    totalKobo: number;
    customerName: string | null;
    problem?: string;
}
export interface ProofFile {
    data: Buffer;
    mimeType: string;
    fileName: string;
    kind: 'image' | 'pdf';
}
export interface PaymentProofAlert {
    orderNumber: string;
    totalKobo: number;
    customerName: string | null;
    customerPhone: string;
    caption?: string;
    file?: ProofFile;
}
export interface HandoffAlert {
    merchantId: string;
    conversationId: string;
    customerName: string | null;
    customerPhone: string;
    reason: string;
    kind?: 'handoff' | 'attention';
    recent: string[];
}
export declare abstract class OwnerNotifier {
    abstract notifyHandoff(alert: HandoffAlert): Promise<void>;
    abstract notifyMessageWhileHuman(merchantId: string, customerPhone: string, text: string): Promise<void>;
    abstract notifyPaymentProof(merchantId: string, alert: PaymentProofAlert): Promise<boolean>;
    abstract notifyPayment(merchantId: string, info: PaymentAlert): Promise<void>;
}
export declare class LogOwnerNotifier extends OwnerNotifier {
    readonly alerts: unknown[];
    notifyHandoff(alert: HandoffAlert): Promise<void>;
    notifyMessageWhileHuman(merchantId: string, customerPhone: string, text: string): Promise<void>;
    forwardWorks: boolean;
    notifyPaymentProof(merchantId: string, alert: PaymentProofAlert): Promise<boolean>;
    notifyPayment(merchantId: string, info: PaymentAlert): Promise<void>;
}
