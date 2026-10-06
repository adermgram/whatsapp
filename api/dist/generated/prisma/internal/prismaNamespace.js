import * as runtime from "@prisma/client/runtime/client";
export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export const PrismaClientValidationError = runtime.PrismaClientValidationError;
export const sql = runtime.sqltag;
export const empty = runtime.empty;
export const join = runtime.join;
export const raw = runtime.raw;
export const Sql = runtime.Sql;
export const Decimal = runtime.Decimal;
export const getExtensionContext = runtime.Extensions.getExtensionContext;
export const prismaVersion = {
    client: "7.10.0",
    engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    Merchant: 'Merchant',
    WhatsAppSession: 'WhatsAppSession',
    WaAuthItem: 'WaAuthItem',
    Product: 'Product',
    Variant: 'Variant',
    Customer: 'Customer',
    Conversation: 'Conversation',
    Message: 'Message',
    Negotiation: 'Negotiation',
    Order: 'Order',
    OrderItem: 'OrderItem',
    Payment: 'Payment',
    Receipt: 'Receipt',
    ProcessedEvent: 'ProcessedEvent'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const MerchantScalarFieldEnum = {
    id: 'id',
    businessName: 'businessName',
    ownerName: 'ownerName',
    ownerPhone: 'ownerPhone',
    ownerEmail: 'ownerEmail',
    passwordHash: 'passwordHash',
    maxDiscountPercent: 'maxDiscountPercent',
    aiEnabled: 'aiEnabled',
    paystackSecretEnc: 'paystackSecretEnc',
    receiptCounter: 'receiptCounter',
    orderCounter: 'orderCounter',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const WhatsAppSessionScalarFieldEnum = {
    merchantId: 'merchantId',
    status: 'status',
    phone: 'phone',
    qr: 'qr',
    updatedAt: 'updatedAt'
};
export const WaAuthItemScalarFieldEnum = {
    merchantId: 'merchantId',
    key: 'key',
    value: 'value'
};
export const ProductScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    name: 'name',
    description: 'description',
    category: 'category',
    attributes: 'attributes',
    imageKeys: 'imageKeys',
    active: 'active',
    createdAt: 'createdAt'
};
export const VariantScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    merchantId: 'merchantId',
    sku: 'sku',
    size: 'size',
    color: 'color',
    priceKobo: 'priceKobo',
    minPriceKobo: 'minPriceKobo',
    stock: 'stock',
    reserved: 'reserved',
    createdAt: 'createdAt'
};
export const CustomerScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    phone: 'phone',
    name: 'name',
    address: 'address',
    createdAt: 'createdAt'
};
export const ConversationScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    customerId: 'customerId',
    chatId: 'chatId',
    mode: 'mode',
    handoffReason: 'handoffReason',
    humanSince: 'humanSince',
    lastMessageAt: 'lastMessageAt',
    createdAt: 'createdAt'
};
export const MessageScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    conversationId: 'conversationId',
    externalId: 'externalId',
    direction: 'direction',
    sender: 'sender',
    type: 'type',
    text: 'text',
    meta: 'meta',
    createdAt: 'createdAt'
};
export const NegotiationScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    variantId: 'variantId',
    rounds: 'rounds',
    lastOfferKobo: 'lastOfferKobo',
    quotedKobo: 'quotedKobo',
    agreedKobo: 'agreedKobo',
    status: 'status',
    updatedAt: 'updatedAt'
};
export const OrderScalarFieldEnum = {
    id: 'id',
    merchantId: 'merchantId',
    customerId: 'customerId',
    conversationId: 'conversationId',
    orderNumber: 'orderNumber',
    status: 'status',
    subtotalKobo: 'subtotalKobo',
    deliveryFeeKobo: 'deliveryFeeKobo',
    totalKobo: 'totalKobo',
    deliveryAddress: 'deliveryAddress',
    expiresAt: 'expiresAt',
    paidAt: 'paidAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderItemScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    variantId: 'variantId',
    quantity: 'quantity',
    listPriceKobo: 'listPriceKobo',
    unitPriceKobo: 'unitPriceKobo'
};
export const PaymentScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    reference: 'reference',
    status: 'status',
    amountKobo: 'amountKobo',
    checkoutUrl: 'checkoutUrl',
    rawEvent: 'rawEvent',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ReceiptScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    number: 'number',
    fileKey: 'fileKey',
    sentAt: 'sentAt',
    createdAt: 'createdAt'
};
export const ProcessedEventScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const JsonNullValueInput = {
    JsonNull: JsonNull
};
export const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
export const defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map