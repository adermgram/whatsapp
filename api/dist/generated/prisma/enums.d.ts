export declare const ProductCategory: {
    readonly CLOTHES: "CLOTHES";
    readonly SHOES: "SHOES";
    readonly JERSEY: "JERSEY";
    readonly ACCESSORIES: "ACCESSORIES";
};
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];
export declare const ConversationMode: {
    readonly AI: "AI";
    readonly HUMAN: "HUMAN";
};
export type ConversationMode = (typeof ConversationMode)[keyof typeof ConversationMode];
export declare const MessageDirection: {
    readonly INBOUND: "INBOUND";
    readonly OUTBOUND: "OUTBOUND";
};
export type MessageDirection = (typeof MessageDirection)[keyof typeof MessageDirection];
export declare const MessageSender: {
    readonly CUSTOMER: "CUSTOMER";
    readonly AI: "AI";
    readonly OWNER: "OWNER";
};
export type MessageSender = (typeof MessageSender)[keyof typeof MessageSender];
export declare const OrderStatus: {
    readonly DRAFT: "DRAFT";
    readonly AWAITING_PAYMENT: "AWAITING_PAYMENT";
    readonly PAID: "PAID";
    readonly FULFILLED: "FULFILLED";
    readonly CANCELLED: "CANCELLED";
    readonly EXPIRED: "EXPIRED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly SUCCESS: "SUCCESS";
    readonly FAILED: "FAILED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const NegotiationStatus: {
    readonly OPEN: "OPEN";
    readonly AGREED: "AGREED";
    readonly DECLINED: "DECLINED";
};
export type NegotiationStatus = (typeof NegotiationStatus)[keyof typeof NegotiationStatus];
export declare const SessionStatus: {
    readonly DISCONNECTED: "DISCONNECTED";
    readonly QR_PENDING: "QR_PENDING";
    readonly CONNECTED: "CONNECTED";
};
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];
