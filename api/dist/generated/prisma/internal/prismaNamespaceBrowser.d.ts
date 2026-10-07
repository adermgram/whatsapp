import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Merchant: "Merchant";
    readonly WhatsAppSession: "WhatsAppSession";
    readonly WaAuthItem: "WaAuthItem";
    readonly Product: "Product";
    readonly Variant: "Variant";
    readonly Customer: "Customer";
    readonly Conversation: "Conversation";
    readonly Message: "Message";
    readonly Negotiation: "Negotiation";
    readonly Order: "Order";
    readonly OrderItem: "OrderItem";
    readonly Payment: "Payment";
    readonly Receipt: "Receipt";
    readonly ProcessedEvent: "ProcessedEvent";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const MerchantScalarFieldEnum: {
    readonly id: "id";
    readonly businessName: "businessName";
    readonly ownerName: "ownerName";
    readonly ownerPhone: "ownerPhone";
    readonly ownerEmail: "ownerEmail";
    readonly alertEmail: "alertEmail";
    readonly passwordHash: "passwordHash";
    readonly maxDiscountPercent: "maxDiscountPercent";
    readonly aiEnabled: "aiEnabled";
    readonly paystackSecretEnc: "paystackSecretEnc";
    readonly receiptCounter: "receiptCounter";
    readonly orderCounter: "orderCounter";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MerchantScalarFieldEnum = (typeof MerchantScalarFieldEnum)[keyof typeof MerchantScalarFieldEnum];
export declare const WhatsAppSessionScalarFieldEnum: {
    readonly merchantId: "merchantId";
    readonly status: "status";
    readonly phone: "phone";
    readonly qr: "qr";
    readonly updatedAt: "updatedAt";
};
export type WhatsAppSessionScalarFieldEnum = (typeof WhatsAppSessionScalarFieldEnum)[keyof typeof WhatsAppSessionScalarFieldEnum];
export declare const WaAuthItemScalarFieldEnum: {
    readonly merchantId: "merchantId";
    readonly key: "key";
    readonly value: "value";
};
export type WaAuthItemScalarFieldEnum = (typeof WaAuthItemScalarFieldEnum)[keyof typeof WaAuthItemScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly name: "name";
    readonly description: "description";
    readonly category: "category";
    readonly attributes: "attributes";
    readonly imageKeys: "imageKeys";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const VariantScalarFieldEnum: {
    readonly id: "id";
    readonly productId: "productId";
    readonly merchantId: "merchantId";
    readonly sku: "sku";
    readonly size: "size";
    readonly color: "color";
    readonly priceKobo: "priceKobo";
    readonly minPriceKobo: "minPriceKobo";
    readonly stock: "stock";
    readonly reserved: "reserved";
    readonly createdAt: "createdAt";
};
export type VariantScalarFieldEnum = (typeof VariantScalarFieldEnum)[keyof typeof VariantScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly phone: "phone";
    readonly name: "name";
    readonly address: "address";
    readonly createdAt: "createdAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const ConversationScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly customerId: "customerId";
    readonly chatId: "chatId";
    readonly mode: "mode";
    readonly handoffReason: "handoffReason";
    readonly handoffBy: "handoffBy";
    readonly humanSince: "humanSince";
    readonly lastMessageAt: "lastMessageAt";
    readonly createdAt: "createdAt";
};
export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum];
export declare const MessageScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly conversationId: "conversationId";
    readonly externalId: "externalId";
    readonly direction: "direction";
    readonly sender: "sender";
    readonly type: "type";
    readonly text: "text";
    readonly meta: "meta";
    readonly createdAt: "createdAt";
};
export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];
export declare const NegotiationScalarFieldEnum: {
    readonly id: "id";
    readonly conversationId: "conversationId";
    readonly variantId: "variantId";
    readonly rounds: "rounds";
    readonly lastOfferKobo: "lastOfferKobo";
    readonly quotedKobo: "quotedKobo";
    readonly agreedKobo: "agreedKobo";
    readonly status: "status";
    readonly updatedAt: "updatedAt";
};
export type NegotiationScalarFieldEnum = (typeof NegotiationScalarFieldEnum)[keyof typeof NegotiationScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly customerId: "customerId";
    readonly conversationId: "conversationId";
    readonly orderNumber: "orderNumber";
    readonly status: "status";
    readonly subtotalKobo: "subtotalKobo";
    readonly deliveryFeeKobo: "deliveryFeeKobo";
    readonly totalKobo: "totalKobo";
    readonly deliveryAddress: "deliveryAddress";
    readonly expiresAt: "expiresAt";
    readonly paidAt: "paidAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly variantId: "variantId";
    readonly quantity: "quantity";
    readonly listPriceKobo: "listPriceKobo";
    readonly unitPriceKobo: "unitPriceKobo";
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly reference: "reference";
    readonly status: "status";
    readonly amountKobo: "amountKobo";
    readonly checkoutUrl: "checkoutUrl";
    readonly rawEvent: "rawEvent";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const ReceiptScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly number: "number";
    readonly fileKey: "fileKey";
    readonly sentAt: "sentAt";
    readonly createdAt: "createdAt";
};
export type ReceiptScalarFieldEnum = (typeof ReceiptScalarFieldEnum)[keyof typeof ReceiptScalarFieldEnum];
export declare const ProcessedEventScalarFieldEnum: {
    readonly id: "id";
    readonly createdAt: "createdAt";
};
export type ProcessedEventScalarFieldEnum = (typeof ProcessedEventScalarFieldEnum)[keyof typeof ProcessedEventScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
