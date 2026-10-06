export interface HandoffAlert {
    merchantId: string;
    conversationId: string;
    customerName: string | null;
    customerPhone: string;
    reason: string;
    recent: string[];
}
export declare abstract class OwnerNotifier {
    abstract notifyHandoff(alert: HandoffAlert): Promise<void>;
    abstract notifyMessageWhileHuman(merchantId: string, customerPhone: string, text: string): Promise<void>;
    abstract notifyPayment(merchantId: string, info: {
        orderNumber: string;
        totalKobo: number;
        customerName: string | null;
        oversold: boolean;
    }): Promise<void>;
}
export declare class LogOwnerNotifier extends OwnerNotifier {
    readonly alerts: unknown[];
    notifyHandoff(alert: HandoffAlert): Promise<void>;
    notifyMessageWhileHuman(merchantId: string, customerPhone: string, text: string): Promise<void>;
    notifyPayment(merchantId: string, info: {
        orderNumber: string;
        totalKobo: number;
        customerName: string | null;
        oversold: boolean;
    }): Promise<void>;
}
