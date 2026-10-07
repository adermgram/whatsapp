import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ConversationModel = runtime.Types.Result.DefaultSelection<Prisma.$ConversationPayload>;
export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null;
    _min: ConversationMinAggregateOutputType | null;
    _max: ConversationMaxAggregateOutputType | null;
};
export type ConversationMinAggregateOutputType = {
    id: string | null;
    merchantId: string | null;
    customerId: string | null;
    chatId: string | null;
    mode: $Enums.ConversationMode | null;
    handoffReason: string | null;
    handoffBy: $Enums.HandoffSource | null;
    humanSince: Date | null;
    lastMessageAt: Date | null;
    createdAt: Date | null;
};
export type ConversationMaxAggregateOutputType = {
    id: string | null;
    merchantId: string | null;
    customerId: string | null;
    chatId: string | null;
    mode: $Enums.ConversationMode | null;
    handoffReason: string | null;
    handoffBy: $Enums.HandoffSource | null;
    humanSince: Date | null;
    lastMessageAt: Date | null;
    createdAt: Date | null;
};
export type ConversationCountAggregateOutputType = {
    id: number;
    merchantId: number;
    customerId: number;
    chatId: number;
    mode: number;
    handoffReason: number;
    handoffBy: number;
    humanSince: number;
    lastMessageAt: number;
    createdAt: number;
    _all: number;
};
export type ConversationMinAggregateInputType = {
    id?: true;
    merchantId?: true;
    customerId?: true;
    chatId?: true;
    mode?: true;
    handoffReason?: true;
    handoffBy?: true;
    humanSince?: true;
    lastMessageAt?: true;
    createdAt?: true;
};
export type ConversationMaxAggregateInputType = {
    id?: true;
    merchantId?: true;
    customerId?: true;
    chatId?: true;
    mode?: true;
    handoffReason?: true;
    handoffBy?: true;
    humanSince?: true;
    lastMessageAt?: true;
    createdAt?: true;
};
export type ConversationCountAggregateInputType = {
    id?: true;
    merchantId?: true;
    customerId?: true;
    chatId?: true;
    mode?: true;
    handoffReason?: true;
    handoffBy?: true;
    humanSince?: true;
    lastMessageAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ConversationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ConversationCountAggregateInputType;
    _min?: ConversationMinAggregateInputType;
    _max?: ConversationMaxAggregateInputType;
};
export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
    [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateConversation[P]> : Prisma.GetScalarType<T[P], AggregateConversation[P]>;
};
export type ConversationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithAggregationInput | Prisma.ConversationOrderByWithAggregationInput[];
    by: Prisma.ConversationScalarFieldEnum[] | Prisma.ConversationScalarFieldEnum;
    having?: Prisma.ConversationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ConversationCountAggregateInputType | true;
    _min?: ConversationMinAggregateInputType;
    _max?: ConversationMaxAggregateInputType;
};
export type ConversationGroupByOutputType = {
    id: string;
    merchantId: string;
    customerId: string;
    chatId: string;
    mode: $Enums.ConversationMode;
    handoffReason: string | null;
    handoffBy: $Enums.HandoffSource | null;
    humanSince: Date | null;
    lastMessageAt: Date;
    createdAt: Date;
    _count: ConversationCountAggregateOutputType | null;
    _min: ConversationMinAggregateOutputType | null;
    _max: ConversationMaxAggregateOutputType | null;
};
export type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ConversationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ConversationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ConversationGroupByOutputType[P]>;
}>>;
export type ConversationWhereInput = {
    AND?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    OR?: Prisma.ConversationWhereInput[];
    NOT?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    id?: Prisma.StringFilter<"Conversation"> | string;
    merchantId?: Prisma.StringFilter<"Conversation"> | string;
    customerId?: Prisma.StringFilter<"Conversation"> | string;
    chatId?: Prisma.StringFilter<"Conversation"> | string;
    mode?: Prisma.EnumConversationModeFilter<"Conversation"> | $Enums.ConversationMode;
    handoffReason?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    handoffBy?: Prisma.EnumHandoffSourceNullableFilter<"Conversation"> | $Enums.HandoffSource | null;
    humanSince?: Prisma.DateTimeNullableFilter<"Conversation"> | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    messages?: Prisma.MessageListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
    negotiations?: Prisma.NegotiationListRelationFilter;
};
export type ConversationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    chatId?: Prisma.SortOrder;
    mode?: Prisma.SortOrder;
    handoffReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    handoffBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    humanSince?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastMessageAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    merchant?: Prisma.MerchantOrderByWithRelationInput;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    messages?: Prisma.MessageOrderByRelationAggregateInput;
    orders?: Prisma.OrderOrderByRelationAggregateInput;
    negotiations?: Prisma.NegotiationOrderByRelationAggregateInput;
};
export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    merchantId_chatId?: Prisma.ConversationMerchantIdChatIdCompoundUniqueInput;
    AND?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    OR?: Prisma.ConversationWhereInput[];
    NOT?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    merchantId?: Prisma.StringFilter<"Conversation"> | string;
    customerId?: Prisma.StringFilter<"Conversation"> | string;
    chatId?: Prisma.StringFilter<"Conversation"> | string;
    mode?: Prisma.EnumConversationModeFilter<"Conversation"> | $Enums.ConversationMode;
    handoffReason?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    handoffBy?: Prisma.EnumHandoffSourceNullableFilter<"Conversation"> | $Enums.HandoffSource | null;
    humanSince?: Prisma.DateTimeNullableFilter<"Conversation"> | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    messages?: Prisma.MessageListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
    negotiations?: Prisma.NegotiationListRelationFilter;
}, "id" | "merchantId_chatId">;
export type ConversationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    chatId?: Prisma.SortOrder;
    mode?: Prisma.SortOrder;
    handoffReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    handoffBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    humanSince?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastMessageAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ConversationCountOrderByAggregateInput;
    _max?: Prisma.ConversationMaxOrderByAggregateInput;
    _min?: Prisma.ConversationMinOrderByAggregateInput;
};
export type ConversationScalarWhereWithAggregatesInput = {
    AND?: Prisma.ConversationScalarWhereWithAggregatesInput | Prisma.ConversationScalarWhereWithAggregatesInput[];
    OR?: Prisma.ConversationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ConversationScalarWhereWithAggregatesInput | Prisma.ConversationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    merchantId?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    chatId?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    mode?: Prisma.EnumConversationModeWithAggregatesFilter<"Conversation"> | $Enums.ConversationMode;
    handoffReason?: Prisma.StringNullableWithAggregatesFilter<"Conversation"> | string | null;
    handoffBy?: Prisma.EnumHandoffSourceNullableWithAggregatesFilter<"Conversation"> | $Enums.HandoffSource | null;
    humanSince?: Prisma.DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null;
    lastMessageAt?: Prisma.DateTimeWithAggregatesFilter<"Conversation"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Conversation"> | Date | string;
};
export type ConversationCreateInput = {
    id?: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutConversationsInput;
    customer: Prisma.CustomerCreateNestedOneWithoutConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutConversationsNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationCreateManyInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
};
export type ConversationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConversationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConversationListRelationFilter = {
    every?: Prisma.ConversationWhereInput;
    some?: Prisma.ConversationWhereInput;
    none?: Prisma.ConversationWhereInput;
};
export type ConversationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ConversationMerchantIdChatIdCompoundUniqueInput = {
    merchantId: string;
    chatId: string;
};
export type ConversationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    chatId?: Prisma.SortOrder;
    mode?: Prisma.SortOrder;
    handoffReason?: Prisma.SortOrder;
    handoffBy?: Prisma.SortOrder;
    humanSince?: Prisma.SortOrder;
    lastMessageAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ConversationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    chatId?: Prisma.SortOrder;
    mode?: Prisma.SortOrder;
    handoffReason?: Prisma.SortOrder;
    handoffBy?: Prisma.SortOrder;
    humanSince?: Prisma.SortOrder;
    lastMessageAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ConversationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    chatId?: Prisma.SortOrder;
    mode?: Prisma.SortOrder;
    handoffReason?: Prisma.SortOrder;
    handoffBy?: Prisma.SortOrder;
    humanSince?: Prisma.SortOrder;
    lastMessageAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ConversationScalarRelationFilter = {
    is?: Prisma.ConversationWhereInput;
    isNot?: Prisma.ConversationWhereInput;
};
export type ConversationCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMerchantInput, Prisma.ConversationUncheckedCreateWithoutMerchantInput> | Prisma.ConversationCreateWithoutMerchantInput[] | Prisma.ConversationUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMerchantInput | Prisma.ConversationCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.ConversationCreateManyMerchantInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMerchantInput, Prisma.ConversationUncheckedCreateWithoutMerchantInput> | Prisma.ConversationCreateWithoutMerchantInput[] | Prisma.ConversationUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMerchantInput | Prisma.ConversationCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.ConversationCreateManyMerchantInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMerchantInput, Prisma.ConversationUncheckedCreateWithoutMerchantInput> | Prisma.ConversationCreateWithoutMerchantInput[] | Prisma.ConversationUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMerchantInput | Prisma.ConversationCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutMerchantInput | Prisma.ConversationUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.ConversationCreateManyMerchantInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutMerchantInput | Prisma.ConversationUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutMerchantInput | Prisma.ConversationUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type ConversationUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMerchantInput, Prisma.ConversationUncheckedCreateWithoutMerchantInput> | Prisma.ConversationCreateWithoutMerchantInput[] | Prisma.ConversationUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMerchantInput | Prisma.ConversationCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutMerchantInput | Prisma.ConversationUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.ConversationCreateManyMerchantInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutMerchantInput | Prisma.ConversationUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutMerchantInput | Prisma.ConversationUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type ConversationCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput | Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type ConversationUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput | Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type EnumConversationModeFieldUpdateOperationsInput = {
    set?: $Enums.ConversationMode;
};
export type NullableEnumHandoffSourceFieldUpdateOperationsInput = {
    set?: $Enums.HandoffSource | null;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMessagesInput;
    connect?: Prisma.ConversationWhereUniqueInput;
};
export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMessagesInput;
    upsert?: Prisma.ConversationUpsertWithoutMessagesInput;
    connect?: Prisma.ConversationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ConversationUpdateToOneWithWhereWithoutMessagesInput, Prisma.ConversationUpdateWithoutMessagesInput>, Prisma.ConversationUncheckedUpdateWithoutMessagesInput>;
};
export type ConversationCreateNestedOneWithoutNegotiationsInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutNegotiationsInput, Prisma.ConversationUncheckedCreateWithoutNegotiationsInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutNegotiationsInput;
    connect?: Prisma.ConversationWhereUniqueInput;
};
export type ConversationUpdateOneRequiredWithoutNegotiationsNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutNegotiationsInput, Prisma.ConversationUncheckedCreateWithoutNegotiationsInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutNegotiationsInput;
    upsert?: Prisma.ConversationUpsertWithoutNegotiationsInput;
    connect?: Prisma.ConversationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ConversationUpdateToOneWithWhereWithoutNegotiationsInput, Prisma.ConversationUpdateWithoutNegotiationsInput>, Prisma.ConversationUncheckedUpdateWithoutNegotiationsInput>;
};
export type ConversationCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutOrdersInput, Prisma.ConversationUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.ConversationWhereUniqueInput;
};
export type ConversationUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutOrdersInput, Prisma.ConversationUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.ConversationUpsertWithoutOrdersInput;
    connect?: Prisma.ConversationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ConversationUpdateToOneWithWhereWithoutOrdersInput, Prisma.ConversationUpdateWithoutOrdersInput>, Prisma.ConversationUncheckedUpdateWithoutOrdersInput>;
};
export type ConversationCreateWithoutMerchantInput = {
    id?: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutMerchantInput = {
    id?: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutMerchantInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutMerchantInput, Prisma.ConversationUncheckedCreateWithoutMerchantInput>;
};
export type ConversationCreateManyMerchantInputEnvelope = {
    data: Prisma.ConversationCreateManyMerchantInput | Prisma.ConversationCreateManyMerchantInput[];
    skipDuplicates?: boolean;
};
export type ConversationUpsertWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.ConversationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutMerchantInput, Prisma.ConversationUncheckedUpdateWithoutMerchantInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutMerchantInput, Prisma.ConversationUncheckedCreateWithoutMerchantInput>;
};
export type ConversationUpdateWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.ConversationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutMerchantInput, Prisma.ConversationUncheckedUpdateWithoutMerchantInput>;
};
export type ConversationUpdateManyWithWhereWithoutMerchantInput = {
    where: Prisma.ConversationScalarWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyWithoutMerchantInput>;
};
export type ConversationScalarWhereInput = {
    AND?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
    OR?: Prisma.ConversationScalarWhereInput[];
    NOT?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
    id?: Prisma.StringFilter<"Conversation"> | string;
    merchantId?: Prisma.StringFilter<"Conversation"> | string;
    customerId?: Prisma.StringFilter<"Conversation"> | string;
    chatId?: Prisma.StringFilter<"Conversation"> | string;
    mode?: Prisma.EnumConversationModeFilter<"Conversation"> | $Enums.ConversationMode;
    handoffReason?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    handoffBy?: Prisma.EnumHandoffSourceNullableFilter<"Conversation"> | $Enums.HandoffSource | null;
    humanSince?: Prisma.DateTimeNullableFilter<"Conversation"> | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
};
export type ConversationCreateWithoutCustomerInput = {
    id?: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutCustomerInput = {
    id?: string;
    merchantId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutCustomerInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput>;
};
export type ConversationCreateManyCustomerInputEnvelope = {
    data: Prisma.ConversationCreateManyCustomerInput | Prisma.ConversationCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type ConversationUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ConversationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutCustomerInput, Prisma.ConversationUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput>;
};
export type ConversationUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ConversationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutCustomerInput, Prisma.ConversationUncheckedUpdateWithoutCustomerInput>;
};
export type ConversationUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.ConversationScalarWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyWithoutCustomerInput>;
};
export type ConversationCreateWithoutMessagesInput = {
    id?: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutConversationsInput;
    customer: Prisma.CustomerCreateNestedOneWithoutConversationsInput;
    orders?: Prisma.OrderCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
};
export type ConversationUpsertWithoutMessagesInput = {
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutMessagesInput, Prisma.ConversationUncheckedUpdateWithoutMessagesInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
    where?: Prisma.ConversationWhereInput;
};
export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: Prisma.ConversationWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutMessagesInput, Prisma.ConversationUncheckedUpdateWithoutMessagesInput>;
};
export type ConversationUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutConversationsNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutConversationsNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationCreateWithoutNegotiationsInput = {
    id?: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutConversationsInput;
    customer: Prisma.CustomerCreateNestedOneWithoutConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutNegotiationsInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutNegotiationsInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutNegotiationsInput, Prisma.ConversationUncheckedCreateWithoutNegotiationsInput>;
};
export type ConversationUpsertWithoutNegotiationsInput = {
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutNegotiationsInput, Prisma.ConversationUncheckedUpdateWithoutNegotiationsInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutNegotiationsInput, Prisma.ConversationUncheckedCreateWithoutNegotiationsInput>;
    where?: Prisma.ConversationWhereInput;
};
export type ConversationUpdateToOneWithWhereWithoutNegotiationsInput = {
    where?: Prisma.ConversationWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutNegotiationsInput, Prisma.ConversationUncheckedUpdateWithoutNegotiationsInput>;
};
export type ConversationUpdateWithoutNegotiationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutConversationsNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutNegotiationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationCreateWithoutOrdersInput = {
    id?: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutConversationsInput;
    customer: Prisma.CustomerCreateNestedOneWithoutConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutOrdersInput = {
    id?: string;
    merchantId: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutOrdersInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutOrdersInput, Prisma.ConversationUncheckedCreateWithoutOrdersInput>;
};
export type ConversationUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutOrdersInput, Prisma.ConversationUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutOrdersInput, Prisma.ConversationUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.ConversationWhereInput;
};
export type ConversationUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.ConversationWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutOrdersInput, Prisma.ConversationUncheckedUpdateWithoutOrdersInput>;
};
export type ConversationUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutConversationsNestedInput;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationCreateManyMerchantInput = {
    id?: string;
    customerId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
};
export type ConversationUpdateWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateManyWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConversationCreateManyCustomerInput = {
    id?: string;
    merchantId: string;
    chatId: string;
    mode?: $Enums.ConversationMode;
    handoffReason?: string | null;
    handoffBy?: $Enums.HandoffSource | null;
    humanSince?: Date | string | null;
    lastMessageAt?: Date | string;
    createdAt?: Date | string;
};
export type ConversationUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutConversationNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    chatId?: Prisma.StringFieldUpdateOperationsInput | string;
    mode?: Prisma.EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode;
    handoffReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    handoffBy?: Prisma.NullableEnumHandoffSourceFieldUpdateOperationsInput | $Enums.HandoffSource | null;
    humanSince?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastMessageAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ConversationCountOutputType = {
    messages: number;
    orders: number;
    negotiations: number;
};
export type ConversationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs;
    orders?: boolean | ConversationCountOutputTypeCountOrdersArgs;
    negotiations?: boolean | ConversationCountOutputTypeCountNegotiationsArgs;
};
export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationCountOutputTypeSelect<ExtArgs> | null;
};
export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
};
export type ConversationCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
export type ConversationCountOutputTypeCountNegotiationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NegotiationWhereInput;
};
export type ConversationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    chatId?: boolean;
    mode?: boolean;
    handoffReason?: boolean;
    handoffBy?: boolean;
    humanSince?: boolean;
    lastMessageAt?: boolean;
    createdAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    messages?: boolean | Prisma.Conversation$messagesArgs<ExtArgs>;
    orders?: boolean | Prisma.Conversation$ordersArgs<ExtArgs>;
    negotiations?: boolean | Prisma.Conversation$negotiationsArgs<ExtArgs>;
    _count?: boolean | Prisma.ConversationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["conversation"]>;
export type ConversationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    chatId?: boolean;
    mode?: boolean;
    handoffReason?: boolean;
    handoffBy?: boolean;
    humanSince?: boolean;
    lastMessageAt?: boolean;
    createdAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["conversation"]>;
export type ConversationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    chatId?: boolean;
    mode?: boolean;
    handoffReason?: boolean;
    handoffBy?: boolean;
    humanSince?: boolean;
    lastMessageAt?: boolean;
    createdAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["conversation"]>;
export type ConversationSelectScalar = {
    id?: boolean;
    merchantId?: boolean;
    customerId?: boolean;
    chatId?: boolean;
    mode?: boolean;
    handoffReason?: boolean;
    handoffBy?: boolean;
    humanSince?: boolean;
    lastMessageAt?: boolean;
    createdAt?: boolean;
};
export type ConversationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "merchantId" | "customerId" | "chatId" | "mode" | "handoffReason" | "handoffBy" | "humanSince" | "lastMessageAt" | "createdAt", ExtArgs["result"]["conversation"]>;
export type ConversationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    messages?: boolean | Prisma.Conversation$messagesArgs<ExtArgs>;
    orders?: boolean | Prisma.Conversation$ordersArgs<ExtArgs>;
    negotiations?: boolean | Prisma.Conversation$negotiationsArgs<ExtArgs>;
    _count?: boolean | Prisma.ConversationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ConversationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
};
export type ConversationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
};
export type $ConversationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Conversation";
    objects: {
        merchant: Prisma.$MerchantPayload<ExtArgs>;
        customer: Prisma.$CustomerPayload<ExtArgs>;
        messages: Prisma.$MessagePayload<ExtArgs>[];
        orders: Prisma.$OrderPayload<ExtArgs>[];
        negotiations: Prisma.$NegotiationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        merchantId: string;
        customerId: string;
        chatId: string;
        mode: $Enums.ConversationMode;
        handoffReason: string | null;
        handoffBy: $Enums.HandoffSource | null;
        humanSince: Date | null;
        lastMessageAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["conversation"]>;
    composites: {};
};
export type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ConversationPayload, S>;
export type ConversationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ConversationCountAggregateInputType | true;
};
export interface ConversationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Conversation'];
        meta: {
            name: 'Conversation';
        };
    };
    findUnique<T extends ConversationFindUniqueArgs>(args: Prisma.SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ConversationFindFirstArgs>(args?: Prisma.SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ConversationFindManyArgs>(args?: Prisma.SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ConversationCreateArgs>(args: Prisma.SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ConversationCreateManyArgs>(args?: Prisma.SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ConversationDeleteArgs>(args: Prisma.SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ConversationUpdateArgs>(args: Prisma.SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ConversationDeleteManyArgs>(args?: Prisma.SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ConversationUpdateManyArgs>(args: Prisma.SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ConversationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ConversationUpsertArgs>(args: Prisma.SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ConversationCountArgs>(args?: Prisma.Subset<T, ConversationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ConversationCountAggregateOutputType> : number>;
    aggregate<T extends ConversationAggregateArgs>(args: Prisma.Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>;
    groupBy<T extends ConversationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ConversationGroupByArgs['orderBy'];
    } : {
        orderBy?: ConversationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ConversationFieldRefs;
}
export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    merchant<T extends Prisma.MerchantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MerchantDefaultArgs<ExtArgs>>): Prisma.Prisma__MerchantClient<runtime.Types.Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    messages<T extends Prisma.Conversation$messagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orders<T extends Prisma.Conversation$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Conversation$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    negotiations<T extends Prisma.Conversation$negotiationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Conversation$negotiationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ConversationFieldRefs {
    readonly id: Prisma.FieldRef<"Conversation", 'String'>;
    readonly merchantId: Prisma.FieldRef<"Conversation", 'String'>;
    readonly customerId: Prisma.FieldRef<"Conversation", 'String'>;
    readonly chatId: Prisma.FieldRef<"Conversation", 'String'>;
    readonly mode: Prisma.FieldRef<"Conversation", 'ConversationMode'>;
    readonly handoffReason: Prisma.FieldRef<"Conversation", 'String'>;
    readonly handoffBy: Prisma.FieldRef<"Conversation", 'HandoffSource'>;
    readonly humanSince: Prisma.FieldRef<"Conversation", 'DateTime'>;
    readonly lastMessageAt: Prisma.FieldRef<"Conversation", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Conversation", 'DateTime'>;
}
export type ConversationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConversationScalarFieldEnum | Prisma.ConversationScalarFieldEnum[];
};
export type ConversationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConversationScalarFieldEnum | Prisma.ConversationScalarFieldEnum[];
};
export type ConversationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConversationScalarFieldEnum | Prisma.ConversationScalarFieldEnum[];
};
export type ConversationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConversationCreateInput, Prisma.ConversationUncheckedCreateInput>;
};
export type ConversationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ConversationCreateManyInput | Prisma.ConversationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ConversationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    data: Prisma.ConversationCreateManyInput | Prisma.ConversationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ConversationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ConversationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConversationUpdateInput, Prisma.ConversationUncheckedUpdateInput>;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyInput>;
    where?: Prisma.ConversationWhereInput;
    limit?: number;
};
export type ConversationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyInput>;
    where?: Prisma.ConversationWhereInput;
    limit?: number;
    include?: Prisma.ConversationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ConversationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateInput, Prisma.ConversationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ConversationUpdateInput, Prisma.ConversationUncheckedUpdateInput>;
};
export type ConversationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConversationWhereInput;
    limit?: number;
};
export type Conversation$messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[];
    cursor?: Prisma.MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageScalarFieldEnum | Prisma.MessageScalarFieldEnum[];
};
export type Conversation$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Conversation$negotiationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    where?: Prisma.NegotiationWhereInput;
    orderBy?: Prisma.NegotiationOrderByWithRelationInput | Prisma.NegotiationOrderByWithRelationInput[];
    cursor?: Prisma.NegotiationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NegotiationScalarFieldEnum | Prisma.NegotiationScalarFieldEnum[];
};
export type ConversationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
};
