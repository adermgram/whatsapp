import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OrderModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderPayload>;
export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
};
export type OrderAvgAggregateOutputType = {
    subtotalKobo: number | null;
    deliveryFeeKobo: number | null;
    totalKobo: number | null;
};
export type OrderSumAggregateOutputType = {
    subtotalKobo: number | null;
    deliveryFeeKobo: number | null;
    totalKobo: number | null;
};
export type OrderMinAggregateOutputType = {
    id: string | null;
    merchantId: string | null;
    customerId: string | null;
    conversationId: string | null;
    orderNumber: string | null;
    status: $Enums.OrderStatus | null;
    subtotalKobo: number | null;
    deliveryFeeKobo: number | null;
    totalKobo: number | null;
    deliveryAddress: string | null;
    expiresAt: Date | null;
    paidAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrderMaxAggregateOutputType = {
    id: string | null;
    merchantId: string | null;
    customerId: string | null;
    conversationId: string | null;
    orderNumber: string | null;
    status: $Enums.OrderStatus | null;
    subtotalKobo: number | null;
    deliveryFeeKobo: number | null;
    totalKobo: number | null;
    deliveryAddress: string | null;
    expiresAt: Date | null;
    paidAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrderCountAggregateOutputType = {
    id: number;
    merchantId: number;
    customerId: number;
    conversationId: number;
    orderNumber: number;
    status: number;
    subtotalKobo: number;
    deliveryFeeKobo: number;
    totalKobo: number;
    deliveryAddress: number;
    expiresAt: number;
    paidAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OrderAvgAggregateInputType = {
    subtotalKobo?: true;
    deliveryFeeKobo?: true;
    totalKobo?: true;
};
export type OrderSumAggregateInputType = {
    subtotalKobo?: true;
    deliveryFeeKobo?: true;
    totalKobo?: true;
};
export type OrderMinAggregateInputType = {
    id?: true;
    merchantId?: true;
    customerId?: true;
    conversationId?: true;
    orderNumber?: true;
    status?: true;
    subtotalKobo?: true;
    deliveryFeeKobo?: true;
    totalKobo?: true;
    deliveryAddress?: true;
    expiresAt?: true;
    paidAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrderMaxAggregateInputType = {
    id?: true;
    merchantId?: true;
    customerId?: true;
    conversationId?: true;
    orderNumber?: true;
    status?: true;
    subtotalKobo?: true;
    deliveryFeeKobo?: true;
    totalKobo?: true;
    deliveryAddress?: true;
    expiresAt?: true;
    paidAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrderCountAggregateInputType = {
    id?: true;
    merchantId?: true;
    customerId?: true;
    conversationId?: true;
    orderNumber?: true;
    status?: true;
    subtotalKobo?: true;
    deliveryFeeKobo?: true;
    totalKobo?: true;
    deliveryAddress?: true;
    expiresAt?: true;
    paidAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OrderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrderCountAggregateInputType;
    _avg?: OrderAvgAggregateInputType;
    _sum?: OrderSumAggregateInputType;
    _min?: OrderMinAggregateInputType;
    _max?: OrderMaxAggregateInputType;
};
export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
    [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrder[P]> : Prisma.GetScalarType<T[P], AggregateOrder[P]>;
};
export type OrderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithAggregationInput | Prisma.OrderOrderByWithAggregationInput[];
    by: Prisma.OrderScalarFieldEnum[] | Prisma.OrderScalarFieldEnum;
    having?: Prisma.OrderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderCountAggregateInputType | true;
    _avg?: OrderAvgAggregateInputType;
    _sum?: OrderSumAggregateInputType;
    _min?: OrderMinAggregateInputType;
    _max?: OrderMaxAggregateInputType;
};
export type OrderGroupByOutputType = {
    id: string;
    merchantId: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status: $Enums.OrderStatus;
    subtotalKobo: number;
    deliveryFeeKobo: number;
    totalKobo: number;
    deliveryAddress: string | null;
    expiresAt: Date | null;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
};
export type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderGroupByOutputType[P]>;
}>>;
export type OrderWhereInput = {
    AND?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    OR?: Prisma.OrderWhereInput[];
    NOT?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    id?: Prisma.StringFilter<"Order"> | string;
    merchantId?: Prisma.StringFilter<"Order"> | string;
    customerId?: Prisma.StringFilter<"Order"> | string;
    conversationId?: Prisma.StringFilter<"Order"> | string;
    orderNumber?: Prisma.StringFilter<"Order"> | string;
    status?: Prisma.EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFilter<"Order"> | number;
    deliveryFeeKobo?: Prisma.IntFilter<"Order"> | number;
    totalKobo?: Prisma.IntFilter<"Order"> | number;
    deliveryAddress?: Prisma.StringNullableFilter<"Order"> | string | null;
    expiresAt?: Prisma.DateTimeNullableFilter<"Order"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableFilter<"Order"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    conversation?: Prisma.XOR<Prisma.ConversationScalarRelationFilter, Prisma.ConversationWhereInput>;
    items?: Prisma.OrderItemListRelationFilter;
    payment?: Prisma.XOR<Prisma.PaymentNullableScalarRelationFilter, Prisma.PaymentWhereInput> | null;
    receipt?: Prisma.XOR<Prisma.ReceiptNullableScalarRelationFilter, Prisma.ReceiptWhereInput> | null;
};
export type OrderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    merchant?: Prisma.MerchantOrderByWithRelationInput;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    conversation?: Prisma.ConversationOrderByWithRelationInput;
    items?: Prisma.OrderItemOrderByRelationAggregateInput;
    payment?: Prisma.PaymentOrderByWithRelationInput;
    receipt?: Prisma.ReceiptOrderByWithRelationInput;
};
export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    merchantId_orderNumber?: Prisma.OrderMerchantIdOrderNumberCompoundUniqueInput;
    AND?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    OR?: Prisma.OrderWhereInput[];
    NOT?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    merchantId?: Prisma.StringFilter<"Order"> | string;
    customerId?: Prisma.StringFilter<"Order"> | string;
    conversationId?: Prisma.StringFilter<"Order"> | string;
    orderNumber?: Prisma.StringFilter<"Order"> | string;
    status?: Prisma.EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFilter<"Order"> | number;
    deliveryFeeKobo?: Prisma.IntFilter<"Order"> | number;
    totalKobo?: Prisma.IntFilter<"Order"> | number;
    deliveryAddress?: Prisma.StringNullableFilter<"Order"> | string | null;
    expiresAt?: Prisma.DateTimeNullableFilter<"Order"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableFilter<"Order"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    conversation?: Prisma.XOR<Prisma.ConversationScalarRelationFilter, Prisma.ConversationWhereInput>;
    items?: Prisma.OrderItemListRelationFilter;
    payment?: Prisma.XOR<Prisma.PaymentNullableScalarRelationFilter, Prisma.PaymentWhereInput> | null;
    receipt?: Prisma.XOR<Prisma.ReceiptNullableScalarRelationFilter, Prisma.ReceiptWhereInput> | null;
}, "id" | "merchantId_orderNumber">;
export type OrderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    paidAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OrderCountOrderByAggregateInput;
    _avg?: Prisma.OrderAvgOrderByAggregateInput;
    _max?: Prisma.OrderMaxOrderByAggregateInput;
    _min?: Prisma.OrderMinOrderByAggregateInput;
    _sum?: Prisma.OrderSumOrderByAggregateInput;
};
export type OrderScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderScalarWhereWithAggregatesInput | Prisma.OrderScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderScalarWhereWithAggregatesInput | Prisma.OrderScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    merchantId?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    conversationId?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    orderNumber?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    status?: Prisma.EnumOrderStatusWithAggregatesFilter<"Order"> | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntWithAggregatesFilter<"Order"> | number;
    deliveryFeeKobo?: Prisma.IntWithAggregatesFilter<"Order"> | number;
    totalKobo?: Prisma.IntWithAggregatesFilter<"Order"> | number;
    deliveryAddress?: Prisma.StringNullableWithAggregatesFilter<"Order"> | string | null;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Order"> | Date | string;
};
export type OrderCreateInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutOrdersInput;
    customer: Prisma.CustomerCreateNestedOneWithoutOrdersInput;
    conversation: Prisma.ConversationCreateNestedOneWithoutOrdersInput;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutOrdersNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutOrdersNestedInput;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutOrdersNestedInput;
    items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderCreateManyInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderListRelationFilter = {
    every?: Prisma.OrderWhereInput;
    some?: Prisma.OrderWhereInput;
    none?: Prisma.OrderWhereInput;
};
export type OrderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderMerchantIdOrderNumberCompoundUniqueInput = {
    merchantId: string;
    orderNumber: string;
};
export type OrderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrderAvgOrderByAggregateInput = {
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
};
export type OrderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    orderNumber?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
    deliveryAddress?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    paidAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrderSumOrderByAggregateInput = {
    subtotalKobo?: Prisma.SortOrder;
    deliveryFeeKobo?: Prisma.SortOrder;
    totalKobo?: Prisma.SortOrder;
};
export type OrderScalarRelationFilter = {
    is?: Prisma.OrderWhereInput;
    isNot?: Prisma.OrderWhereInput;
};
export type OrderCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutMerchantInput, Prisma.OrderUncheckedCreateWithoutMerchantInput> | Prisma.OrderCreateWithoutMerchantInput[] | Prisma.OrderUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutMerchantInput | Prisma.OrderCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.OrderCreateManyMerchantInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutMerchantInput, Prisma.OrderUncheckedCreateWithoutMerchantInput> | Prisma.OrderCreateWithoutMerchantInput[] | Prisma.OrderUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutMerchantInput | Prisma.OrderCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.OrderCreateManyMerchantInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutMerchantInput, Prisma.OrderUncheckedCreateWithoutMerchantInput> | Prisma.OrderCreateWithoutMerchantInput[] | Prisma.OrderUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutMerchantInput | Prisma.OrderCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutMerchantInput | Prisma.OrderUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.OrderCreateManyMerchantInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutMerchantInput | Prisma.OrderUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutMerchantInput | Prisma.OrderUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type OrderUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutMerchantInput, Prisma.OrderUncheckedCreateWithoutMerchantInput> | Prisma.OrderCreateWithoutMerchantInput[] | Prisma.OrderUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutMerchantInput | Prisma.OrderCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutMerchantInput | Prisma.OrderUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.OrderCreateManyMerchantInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutMerchantInput | Prisma.OrderUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutMerchantInput | Prisma.OrderUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type OrderCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutCustomerInput, Prisma.OrderUncheckedCreateWithoutCustomerInput> | Prisma.OrderCreateWithoutCustomerInput[] | Prisma.OrderUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutCustomerInput | Prisma.OrderCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.OrderCreateManyCustomerInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutCustomerInput, Prisma.OrderUncheckedCreateWithoutCustomerInput> | Prisma.OrderCreateWithoutCustomerInput[] | Prisma.OrderUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutCustomerInput | Prisma.OrderCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.OrderCreateManyCustomerInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutCustomerInput, Prisma.OrderUncheckedCreateWithoutCustomerInput> | Prisma.OrderCreateWithoutCustomerInput[] | Prisma.OrderUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutCustomerInput | Prisma.OrderCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutCustomerInput | Prisma.OrderUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.OrderCreateManyCustomerInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutCustomerInput | Prisma.OrderUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutCustomerInput | Prisma.OrderUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type OrderUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutCustomerInput, Prisma.OrderUncheckedCreateWithoutCustomerInput> | Prisma.OrderCreateWithoutCustomerInput[] | Prisma.OrderUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutCustomerInput | Prisma.OrderCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutCustomerInput | Prisma.OrderUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.OrderCreateManyCustomerInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutCustomerInput | Prisma.OrderUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutCustomerInput | Prisma.OrderUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type OrderCreateNestedManyWithoutConversationInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutConversationInput, Prisma.OrderUncheckedCreateWithoutConversationInput> | Prisma.OrderCreateWithoutConversationInput[] | Prisma.OrderUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutConversationInput | Prisma.OrderCreateOrConnectWithoutConversationInput[];
    createMany?: Prisma.OrderCreateManyConversationInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUncheckedCreateNestedManyWithoutConversationInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutConversationInput, Prisma.OrderUncheckedCreateWithoutConversationInput> | Prisma.OrderCreateWithoutConversationInput[] | Prisma.OrderUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutConversationInput | Prisma.OrderCreateOrConnectWithoutConversationInput[];
    createMany?: Prisma.OrderCreateManyConversationInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUpdateManyWithoutConversationNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutConversationInput, Prisma.OrderUncheckedCreateWithoutConversationInput> | Prisma.OrderCreateWithoutConversationInput[] | Prisma.OrderUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutConversationInput | Prisma.OrderCreateOrConnectWithoutConversationInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutConversationInput | Prisma.OrderUpsertWithWhereUniqueWithoutConversationInput[];
    createMany?: Prisma.OrderCreateManyConversationInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutConversationInput | Prisma.OrderUpdateWithWhereUniqueWithoutConversationInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutConversationInput | Prisma.OrderUpdateManyWithWhereWithoutConversationInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type OrderUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutConversationInput, Prisma.OrderUncheckedCreateWithoutConversationInput> | Prisma.OrderCreateWithoutConversationInput[] | Prisma.OrderUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutConversationInput | Prisma.OrderCreateOrConnectWithoutConversationInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutConversationInput | Prisma.OrderUpsertWithWhereUniqueWithoutConversationInput[];
    createMany?: Prisma.OrderCreateManyConversationInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutConversationInput | Prisma.OrderUpdateWithWhereUniqueWithoutConversationInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutConversationInput | Prisma.OrderUpdateManyWithWhereWithoutConversationInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus;
};
export type OrderCreateNestedOneWithoutItemsInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutItemsInput, Prisma.OrderUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutItemsInput;
    connect?: Prisma.OrderWhereUniqueInput;
};
export type OrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutItemsInput, Prisma.OrderUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutItemsInput;
    upsert?: Prisma.OrderUpsertWithoutItemsInput;
    connect?: Prisma.OrderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrderUpdateToOneWithWhereWithoutItemsInput, Prisma.OrderUpdateWithoutItemsInput>, Prisma.OrderUncheckedUpdateWithoutItemsInput>;
};
export type OrderCreateNestedOneWithoutPaymentInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutPaymentInput, Prisma.OrderUncheckedCreateWithoutPaymentInput>;
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutPaymentInput;
    connect?: Prisma.OrderWhereUniqueInput;
};
export type OrderUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutPaymentInput, Prisma.OrderUncheckedCreateWithoutPaymentInput>;
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutPaymentInput;
    upsert?: Prisma.OrderUpsertWithoutPaymentInput;
    connect?: Prisma.OrderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrderUpdateToOneWithWhereWithoutPaymentInput, Prisma.OrderUpdateWithoutPaymentInput>, Prisma.OrderUncheckedUpdateWithoutPaymentInput>;
};
export type OrderCreateNestedOneWithoutReceiptInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutReceiptInput, Prisma.OrderUncheckedCreateWithoutReceiptInput>;
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutReceiptInput;
    connect?: Prisma.OrderWhereUniqueInput;
};
export type OrderUpdateOneRequiredWithoutReceiptNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutReceiptInput, Prisma.OrderUncheckedCreateWithoutReceiptInput>;
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutReceiptInput;
    upsert?: Prisma.OrderUpsertWithoutReceiptInput;
    connect?: Prisma.OrderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrderUpdateToOneWithWhereWithoutReceiptInput, Prisma.OrderUpdateWithoutReceiptInput>, Prisma.OrderUncheckedUpdateWithoutReceiptInput>;
};
export type OrderCreateWithoutMerchantInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutOrdersInput;
    conversation: Prisma.ConversationCreateNestedOneWithoutOrdersInput;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateWithoutMerchantInput = {
    id?: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderCreateOrConnectWithoutMerchantInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutMerchantInput, Prisma.OrderUncheckedCreateWithoutMerchantInput>;
};
export type OrderCreateManyMerchantInputEnvelope = {
    data: Prisma.OrderCreateManyMerchantInput | Prisma.OrderCreateManyMerchantInput[];
    skipDuplicates?: boolean;
};
export type OrderUpsertWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.OrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderUpdateWithoutMerchantInput, Prisma.OrderUncheckedUpdateWithoutMerchantInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutMerchantInput, Prisma.OrderUncheckedCreateWithoutMerchantInput>;
};
export type OrderUpdateWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutMerchantInput, Prisma.OrderUncheckedUpdateWithoutMerchantInput>;
};
export type OrderUpdateManyWithWhereWithoutMerchantInput = {
    where: Prisma.OrderScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyWithoutMerchantInput>;
};
export type OrderScalarWhereInput = {
    AND?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
    OR?: Prisma.OrderScalarWhereInput[];
    NOT?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
    id?: Prisma.StringFilter<"Order"> | string;
    merchantId?: Prisma.StringFilter<"Order"> | string;
    customerId?: Prisma.StringFilter<"Order"> | string;
    conversationId?: Prisma.StringFilter<"Order"> | string;
    orderNumber?: Prisma.StringFilter<"Order"> | string;
    status?: Prisma.EnumOrderStatusFilter<"Order"> | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFilter<"Order"> | number;
    deliveryFeeKobo?: Prisma.IntFilter<"Order"> | number;
    totalKobo?: Prisma.IntFilter<"Order"> | number;
    deliveryAddress?: Prisma.StringNullableFilter<"Order"> | string | null;
    expiresAt?: Prisma.DateTimeNullableFilter<"Order"> | Date | string | null;
    paidAt?: Prisma.DateTimeNullableFilter<"Order"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
};
export type OrderCreateWithoutCustomerInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutOrdersInput;
    conversation: Prisma.ConversationCreateNestedOneWithoutOrdersInput;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateWithoutCustomerInput = {
    id?: string;
    merchantId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderCreateOrConnectWithoutCustomerInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutCustomerInput, Prisma.OrderUncheckedCreateWithoutCustomerInput>;
};
export type OrderCreateManyCustomerInputEnvelope = {
    data: Prisma.OrderCreateManyCustomerInput | Prisma.OrderCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type OrderUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.OrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderUpdateWithoutCustomerInput, Prisma.OrderUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutCustomerInput, Prisma.OrderUncheckedCreateWithoutCustomerInput>;
};
export type OrderUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutCustomerInput, Prisma.OrderUncheckedUpdateWithoutCustomerInput>;
};
export type OrderUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.OrderScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyWithoutCustomerInput>;
};
export type OrderCreateWithoutConversationInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutOrdersInput;
    customer: Prisma.CustomerCreateNestedOneWithoutOrdersInput;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateWithoutConversationInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderCreateOrConnectWithoutConversationInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutConversationInput, Prisma.OrderUncheckedCreateWithoutConversationInput>;
};
export type OrderCreateManyConversationInputEnvelope = {
    data: Prisma.OrderCreateManyConversationInput | Prisma.OrderCreateManyConversationInput[];
    skipDuplicates?: boolean;
};
export type OrderUpsertWithWhereUniqueWithoutConversationInput = {
    where: Prisma.OrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderUpdateWithoutConversationInput, Prisma.OrderUncheckedUpdateWithoutConversationInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutConversationInput, Prisma.OrderUncheckedCreateWithoutConversationInput>;
};
export type OrderUpdateWithWhereUniqueWithoutConversationInput = {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutConversationInput, Prisma.OrderUncheckedUpdateWithoutConversationInput>;
};
export type OrderUpdateManyWithWhereWithoutConversationInput = {
    where: Prisma.OrderScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyWithoutConversationInput>;
};
export type OrderCreateWithoutItemsInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutOrdersInput;
    customer: Prisma.CustomerCreateNestedOneWithoutOrdersInput;
    conversation: Prisma.ConversationCreateNestedOneWithoutOrdersInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateWithoutItemsInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput;
    receipt?: Prisma.ReceiptUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderCreateOrConnectWithoutItemsInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutItemsInput, Prisma.OrderUncheckedCreateWithoutItemsInput>;
};
export type OrderUpsertWithoutItemsInput = {
    update: Prisma.XOR<Prisma.OrderUpdateWithoutItemsInput, Prisma.OrderUncheckedUpdateWithoutItemsInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutItemsInput, Prisma.OrderUncheckedCreateWithoutItemsInput>;
    where?: Prisma.OrderWhereInput;
};
export type OrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: Prisma.OrderWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutItemsInput, Prisma.OrderUncheckedUpdateWithoutItemsInput>;
};
export type OrderUpdateWithoutItemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutOrdersNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutOrdersNestedInput;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutOrdersNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateWithoutItemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderCreateWithoutPaymentInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutOrdersInput;
    customer: Prisma.CustomerCreateNestedOneWithoutOrdersInput;
    conversation: Prisma.ConversationCreateNestedOneWithoutOrdersInput;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    receipt?: Prisma.ReceiptCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateWithoutPaymentInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    receipt?: Prisma.ReceiptUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderCreateOrConnectWithoutPaymentInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutPaymentInput, Prisma.OrderUncheckedCreateWithoutPaymentInput>;
};
export type OrderUpsertWithoutPaymentInput = {
    update: Prisma.XOR<Prisma.OrderUpdateWithoutPaymentInput, Prisma.OrderUncheckedUpdateWithoutPaymentInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutPaymentInput, Prisma.OrderUncheckedCreateWithoutPaymentInput>;
    where?: Prisma.OrderWhereInput;
};
export type OrderUpdateToOneWithWhereWithoutPaymentInput = {
    where?: Prisma.OrderWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutPaymentInput, Prisma.OrderUncheckedUpdateWithoutPaymentInput>;
};
export type OrderUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutOrdersNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutOrdersNestedInput;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutOrdersNestedInput;
    items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderCreateWithoutReceiptInput = {
    id?: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutOrdersInput;
    customer: Prisma.CustomerCreateNestedOneWithoutOrdersInput;
    conversation: Prisma.ConversationCreateNestedOneWithoutOrdersInput;
    items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutOrderInput;
};
export type OrderUncheckedCreateWithoutReceiptInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    payment?: Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput;
};
export type OrderCreateOrConnectWithoutReceiptInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutReceiptInput, Prisma.OrderUncheckedCreateWithoutReceiptInput>;
};
export type OrderUpsertWithoutReceiptInput = {
    update: Prisma.XOR<Prisma.OrderUpdateWithoutReceiptInput, Prisma.OrderUncheckedUpdateWithoutReceiptInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutReceiptInput, Prisma.OrderUncheckedCreateWithoutReceiptInput>;
    where?: Prisma.OrderWhereInput;
};
export type OrderUpdateToOneWithWhereWithoutReceiptInput = {
    where?: Prisma.OrderWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutReceiptInput, Prisma.OrderUncheckedUpdateWithoutReceiptInput>;
};
export type OrderUpdateWithoutReceiptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutOrdersNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutOrdersNestedInput;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutOrdersNestedInput;
    items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateWithoutReceiptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderCreateManyMerchantInput = {
    id?: string;
    customerId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutOrdersNestedInput;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutOrdersNestedInput;
    items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateManyWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderCreateManyCustomerInput = {
    id?: string;
    merchantId: string;
    conversationId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutOrdersNestedInput;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutOrdersNestedInput;
    items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderCreateManyConversationInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    orderNumber: string;
    status?: $Enums.OrderStatus;
    subtotalKobo?: number;
    deliveryFeeKobo?: number;
    totalKobo?: number;
    deliveryAddress?: string | null;
    expiresAt?: Date | string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutOrdersNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutOrdersNestedInput;
    items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    payment?: Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput;
    receipt?: Prisma.ReceiptUncheckedUpdateOneWithoutOrderNestedInput;
};
export type OrderUncheckedUpdateManyWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    orderNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryFeeKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    totalKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    deliveryAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paidAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderCountOutputType = {
    items: number;
};
export type OrderCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    items?: boolean | OrderCountOutputTypeCountItemsArgs;
};
export type OrderCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderCountOutputTypeSelect<ExtArgs> | null;
};
export type OrderCountOutputTypeCountItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemWhereInput;
};
export type OrderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    conversationId?: boolean;
    orderNumber?: boolean;
    status?: boolean;
    subtotalKobo?: boolean;
    deliveryFeeKobo?: boolean;
    totalKobo?: boolean;
    deliveryAddress?: boolean;
    expiresAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    items?: boolean | Prisma.Order$itemsArgs<ExtArgs>;
    payment?: boolean | Prisma.Order$paymentArgs<ExtArgs>;
    receipt?: boolean | Prisma.Order$receiptArgs<ExtArgs>;
    _count?: boolean | Prisma.OrderCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type OrderSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    conversationId?: boolean;
    orderNumber?: boolean;
    status?: boolean;
    subtotalKobo?: boolean;
    deliveryFeeKobo?: boolean;
    totalKobo?: boolean;
    deliveryAddress?: boolean;
    expiresAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type OrderSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    conversationId?: boolean;
    orderNumber?: boolean;
    status?: boolean;
    subtotalKobo?: boolean;
    deliveryFeeKobo?: boolean;
    totalKobo?: boolean;
    deliveryAddress?: boolean;
    expiresAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type OrderSelectScalar = {
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    conversationId?: boolean;
    orderNumber?: boolean;
    status?: boolean;
    subtotalKobo?: boolean;
    deliveryFeeKobo?: boolean;
    totalKobo?: boolean;
    deliveryAddress?: boolean;
    expiresAt?: boolean;
    paidAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OrderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "merchantId" | "customerId" | "conversationId" | "orderNumber" | "status" | "subtotalKobo" | "deliveryFeeKobo" | "totalKobo" | "deliveryAddress" | "expiresAt" | "paidAt" | "createdAt" | "updatedAt", ExtArgs["result"]["order"]>;
export type OrderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    items?: boolean | Prisma.Order$itemsArgs<ExtArgs>;
    payment?: boolean | Prisma.Order$paymentArgs<ExtArgs>;
    receipt?: boolean | Prisma.Order$receiptArgs<ExtArgs>;
    _count?: boolean | Prisma.OrderCountOutputTypeDefaultArgs<ExtArgs>;
};
export type OrderIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
};
export type OrderIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
};
export type $OrderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Order";
    objects: {
        merchant: Prisma.$MerchantPayload<ExtArgs>;
        customer: Prisma.$CustomerPayload<ExtArgs>;
        conversation: Prisma.$ConversationPayload<ExtArgs>;
        items: Prisma.$OrderItemPayload<ExtArgs>[];
        payment: Prisma.$PaymentPayload<ExtArgs> | null;
        receipt: Prisma.$ReceiptPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        merchantId: string;
        customerId: string;
        conversationId: string;
        orderNumber: string;
        status: $Enums.OrderStatus;
        subtotalKobo: number;
        deliveryFeeKobo: number;
        totalKobo: number;
        deliveryAddress: string | null;
        expiresAt: Date | null;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["order"]>;
    composites: {};
};
export type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderPayload, S>;
export type OrderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderCountAggregateInputType | true;
};
export interface OrderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Order'];
        meta: {
            name: 'Order';
        };
    };
    findUnique<T extends OrderFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrderFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrderFindManyArgs>(args?: Prisma.SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrderCreateArgs>(args: Prisma.SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrderCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrderDeleteArgs>(args: Prisma.SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrderUpdateArgs>(args: Prisma.SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrderDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrderUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrderUpsertArgs>(args: Prisma.SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrderCountArgs>(args?: Prisma.Subset<T, OrderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderCountAggregateOutputType> : number>;
    aggregate<T extends OrderAggregateArgs>(args: Prisma.Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>;
    groupBy<T extends OrderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrderFieldRefs;
}
export interface Prisma__OrderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    merchant<T extends Prisma.MerchantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MerchantDefaultArgs<ExtArgs>>): Prisma.Prisma__MerchantClient<runtime.Types.Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    conversation<T extends Prisma.ConversationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ConversationDefaultArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    items<T extends Prisma.Order$itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Order$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payment<T extends Prisma.Order$paymentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Order$paymentArgs<ExtArgs>>): Prisma.Prisma__PaymentClient<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    receipt<T extends Prisma.Order$receiptArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Order$receiptArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrderFieldRefs {
    readonly id: Prisma.FieldRef<"Order", 'String'>;
    readonly merchantId: Prisma.FieldRef<"Order", 'String'>;
    readonly customerId: Prisma.FieldRef<"Order", 'String'>;
    readonly conversationId: Prisma.FieldRef<"Order", 'String'>;
    readonly orderNumber: Prisma.FieldRef<"Order", 'String'>;
    readonly status: Prisma.FieldRef<"Order", 'OrderStatus'>;
    readonly subtotalKobo: Prisma.FieldRef<"Order", 'Int'>;
    readonly deliveryFeeKobo: Prisma.FieldRef<"Order", 'Int'>;
    readonly totalKobo: Prisma.FieldRef<"Order", 'Int'>;
    readonly deliveryAddress: Prisma.FieldRef<"Order", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"Order", 'DateTime'>;
    readonly paidAt: Prisma.FieldRef<"Order", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Order", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Order", 'DateTime'>;
}
export type OrderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where: Prisma.OrderWhereUniqueInput;
};
export type OrderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where: Prisma.OrderWhereUniqueInput;
};
export type OrderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
export type OrderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
export type OrderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
export type OrderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput>;
};
export type OrderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrderCreateManyInput | Prisma.OrderCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrderCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    data: Prisma.OrderCreateManyInput | Prisma.OrderCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OrderIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OrderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderUpdateInput, Prisma.OrderUncheckedUpdateInput>;
    where: Prisma.OrderWhereUniqueInput;
};
export type OrderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyInput>;
    where?: Prisma.OrderWhereInput;
    limit?: number;
};
export type OrderUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyInput>;
    where?: Prisma.OrderWhereInput;
    limit?: number;
    include?: Prisma.OrderIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OrderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrderUpdateInput, Prisma.OrderUncheckedUpdateInput>;
};
export type OrderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where: Prisma.OrderWhereUniqueInput;
};
export type OrderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
    limit?: number;
};
export type Order$itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput | Prisma.OrderItemOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemScalarFieldEnum | Prisma.OrderItemScalarFieldEnum[];
};
export type Order$paymentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
};
export type Order$receiptArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where?: Prisma.ReceiptWhereInput;
};
export type OrderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
};
