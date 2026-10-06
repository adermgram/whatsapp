import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type NegotiationModel = runtime.Types.Result.DefaultSelection<Prisma.$NegotiationPayload>;
export type AggregateNegotiation = {
    _count: NegotiationCountAggregateOutputType | null;
    _avg: NegotiationAvgAggregateOutputType | null;
    _sum: NegotiationSumAggregateOutputType | null;
    _min: NegotiationMinAggregateOutputType | null;
    _max: NegotiationMaxAggregateOutputType | null;
};
export type NegotiationAvgAggregateOutputType = {
    rounds: number | null;
    lastOfferKobo: number | null;
    quotedKobo: number | null;
    agreedKobo: number | null;
};
export type NegotiationSumAggregateOutputType = {
    rounds: number | null;
    lastOfferKobo: number | null;
    quotedKobo: number | null;
    agreedKobo: number | null;
};
export type NegotiationMinAggregateOutputType = {
    id: string | null;
    conversationId: string | null;
    variantId: string | null;
    rounds: number | null;
    lastOfferKobo: number | null;
    quotedKobo: number | null;
    agreedKobo: number | null;
    status: $Enums.NegotiationStatus | null;
    updatedAt: Date | null;
};
export type NegotiationMaxAggregateOutputType = {
    id: string | null;
    conversationId: string | null;
    variantId: string | null;
    rounds: number | null;
    lastOfferKobo: number | null;
    quotedKobo: number | null;
    agreedKobo: number | null;
    status: $Enums.NegotiationStatus | null;
    updatedAt: Date | null;
};
export type NegotiationCountAggregateOutputType = {
    id: number;
    conversationId: number;
    variantId: number;
    rounds: number;
    lastOfferKobo: number;
    quotedKobo: number;
    agreedKobo: number;
    status: number;
    updatedAt: number;
    _all: number;
};
export type NegotiationAvgAggregateInputType = {
    rounds?: true;
    lastOfferKobo?: true;
    quotedKobo?: true;
    agreedKobo?: true;
};
export type NegotiationSumAggregateInputType = {
    rounds?: true;
    lastOfferKobo?: true;
    quotedKobo?: true;
    agreedKobo?: true;
};
export type NegotiationMinAggregateInputType = {
    id?: true;
    conversationId?: true;
    variantId?: true;
    rounds?: true;
    lastOfferKobo?: true;
    quotedKobo?: true;
    agreedKobo?: true;
    status?: true;
    updatedAt?: true;
};
export type NegotiationMaxAggregateInputType = {
    id?: true;
    conversationId?: true;
    variantId?: true;
    rounds?: true;
    lastOfferKobo?: true;
    quotedKobo?: true;
    agreedKobo?: true;
    status?: true;
    updatedAt?: true;
};
export type NegotiationCountAggregateInputType = {
    id?: true;
    conversationId?: true;
    variantId?: true;
    rounds?: true;
    lastOfferKobo?: true;
    quotedKobo?: true;
    agreedKobo?: true;
    status?: true;
    updatedAt?: true;
    _all?: true;
};
export type NegotiationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NegotiationWhereInput;
    orderBy?: Prisma.NegotiationOrderByWithRelationInput | Prisma.NegotiationOrderByWithRelationInput[];
    cursor?: Prisma.NegotiationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | NegotiationCountAggregateInputType;
    _avg?: NegotiationAvgAggregateInputType;
    _sum?: NegotiationSumAggregateInputType;
    _min?: NegotiationMinAggregateInputType;
    _max?: NegotiationMaxAggregateInputType;
};
export type GetNegotiationAggregateType<T extends NegotiationAggregateArgs> = {
    [P in keyof T & keyof AggregateNegotiation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateNegotiation[P]> : Prisma.GetScalarType<T[P], AggregateNegotiation[P]>;
};
export type NegotiationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NegotiationWhereInput;
    orderBy?: Prisma.NegotiationOrderByWithAggregationInput | Prisma.NegotiationOrderByWithAggregationInput[];
    by: Prisma.NegotiationScalarFieldEnum[] | Prisma.NegotiationScalarFieldEnum;
    having?: Prisma.NegotiationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NegotiationCountAggregateInputType | true;
    _avg?: NegotiationAvgAggregateInputType;
    _sum?: NegotiationSumAggregateInputType;
    _min?: NegotiationMinAggregateInputType;
    _max?: NegotiationMaxAggregateInputType;
};
export type NegotiationGroupByOutputType = {
    id: string;
    conversationId: string;
    variantId: string;
    rounds: number;
    lastOfferKobo: number | null;
    quotedKobo: number | null;
    agreedKobo: number | null;
    status: $Enums.NegotiationStatus;
    updatedAt: Date;
    _count: NegotiationCountAggregateOutputType | null;
    _avg: NegotiationAvgAggregateOutputType | null;
    _sum: NegotiationSumAggregateOutputType | null;
    _min: NegotiationMinAggregateOutputType | null;
    _max: NegotiationMaxAggregateOutputType | null;
};
export type GetNegotiationGroupByPayload<T extends NegotiationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<NegotiationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof NegotiationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], NegotiationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], NegotiationGroupByOutputType[P]>;
}>>;
export type NegotiationWhereInput = {
    AND?: Prisma.NegotiationWhereInput | Prisma.NegotiationWhereInput[];
    OR?: Prisma.NegotiationWhereInput[];
    NOT?: Prisma.NegotiationWhereInput | Prisma.NegotiationWhereInput[];
    id?: Prisma.StringFilter<"Negotiation"> | string;
    conversationId?: Prisma.StringFilter<"Negotiation"> | string;
    variantId?: Prisma.StringFilter<"Negotiation"> | string;
    rounds?: Prisma.IntFilter<"Negotiation"> | number;
    lastOfferKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    quotedKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    agreedKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    status?: Prisma.EnumNegotiationStatusFilter<"Negotiation"> | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFilter<"Negotiation"> | Date | string;
    conversation?: Prisma.XOR<Prisma.ConversationScalarRelationFilter, Prisma.ConversationWhereInput>;
    variant?: Prisma.XOR<Prisma.VariantScalarRelationFilter, Prisma.VariantWhereInput>;
};
export type NegotiationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    variantId?: Prisma.SortOrder;
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrderInput | Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrderInput | Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    conversation?: Prisma.ConversationOrderByWithRelationInput;
    variant?: Prisma.VariantOrderByWithRelationInput;
};
export type NegotiationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    conversationId_variantId?: Prisma.NegotiationConversationIdVariantIdCompoundUniqueInput;
    AND?: Prisma.NegotiationWhereInput | Prisma.NegotiationWhereInput[];
    OR?: Prisma.NegotiationWhereInput[];
    NOT?: Prisma.NegotiationWhereInput | Prisma.NegotiationWhereInput[];
    conversationId?: Prisma.StringFilter<"Negotiation"> | string;
    variantId?: Prisma.StringFilter<"Negotiation"> | string;
    rounds?: Prisma.IntFilter<"Negotiation"> | number;
    lastOfferKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    quotedKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    agreedKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    status?: Prisma.EnumNegotiationStatusFilter<"Negotiation"> | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFilter<"Negotiation"> | Date | string;
    conversation?: Prisma.XOR<Prisma.ConversationScalarRelationFilter, Prisma.ConversationWhereInput>;
    variant?: Prisma.XOR<Prisma.VariantScalarRelationFilter, Prisma.VariantWhereInput>;
}, "id" | "conversationId_variantId">;
export type NegotiationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    variantId?: Prisma.SortOrder;
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrderInput | Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrderInput | Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.NegotiationCountOrderByAggregateInput;
    _avg?: Prisma.NegotiationAvgOrderByAggregateInput;
    _max?: Prisma.NegotiationMaxOrderByAggregateInput;
    _min?: Prisma.NegotiationMinOrderByAggregateInput;
    _sum?: Prisma.NegotiationSumOrderByAggregateInput;
};
export type NegotiationScalarWhereWithAggregatesInput = {
    AND?: Prisma.NegotiationScalarWhereWithAggregatesInput | Prisma.NegotiationScalarWhereWithAggregatesInput[];
    OR?: Prisma.NegotiationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.NegotiationScalarWhereWithAggregatesInput | Prisma.NegotiationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Negotiation"> | string;
    conversationId?: Prisma.StringWithAggregatesFilter<"Negotiation"> | string;
    variantId?: Prisma.StringWithAggregatesFilter<"Negotiation"> | string;
    rounds?: Prisma.IntWithAggregatesFilter<"Negotiation"> | number;
    lastOfferKobo?: Prisma.IntNullableWithAggregatesFilter<"Negotiation"> | number | null;
    quotedKobo?: Prisma.IntNullableWithAggregatesFilter<"Negotiation"> | number | null;
    agreedKobo?: Prisma.IntNullableWithAggregatesFilter<"Negotiation"> | number | null;
    status?: Prisma.EnumNegotiationStatusWithAggregatesFilter<"Negotiation"> | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Negotiation"> | Date | string;
};
export type NegotiationCreateInput = {
    id?: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
    conversation: Prisma.ConversationCreateNestedOneWithoutNegotiationsInput;
    variant: Prisma.VariantCreateNestedOneWithoutNegotiationsInput;
};
export type NegotiationUncheckedCreateInput = {
    id?: string;
    conversationId: string;
    variantId: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
};
export type NegotiationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutNegotiationsNestedInput;
    variant?: Prisma.VariantUpdateOneRequiredWithoutNegotiationsNestedInput;
};
export type NegotiationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    variantId?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationCreateManyInput = {
    id?: string;
    conversationId: string;
    variantId: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
};
export type NegotiationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    variantId?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationListRelationFilter = {
    every?: Prisma.NegotiationWhereInput;
    some?: Prisma.NegotiationWhereInput;
    none?: Prisma.NegotiationWhereInput;
};
export type NegotiationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NegotiationConversationIdVariantIdCompoundUniqueInput = {
    conversationId: string;
    variantId: string;
};
export type NegotiationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    variantId?: Prisma.SortOrder;
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NegotiationAvgOrderByAggregateInput = {
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrder;
};
export type NegotiationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    variantId?: Prisma.SortOrder;
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NegotiationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    variantId?: Prisma.SortOrder;
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NegotiationSumOrderByAggregateInput = {
    rounds?: Prisma.SortOrder;
    lastOfferKobo?: Prisma.SortOrder;
    quotedKobo?: Prisma.SortOrder;
    agreedKobo?: Prisma.SortOrder;
};
export type NegotiationCreateNestedManyWithoutVariantInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutVariantInput, Prisma.NegotiationUncheckedCreateWithoutVariantInput> | Prisma.NegotiationCreateWithoutVariantInput[] | Prisma.NegotiationUncheckedCreateWithoutVariantInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutVariantInput | Prisma.NegotiationCreateOrConnectWithoutVariantInput[];
    createMany?: Prisma.NegotiationCreateManyVariantInputEnvelope;
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
};
export type NegotiationUncheckedCreateNestedManyWithoutVariantInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutVariantInput, Prisma.NegotiationUncheckedCreateWithoutVariantInput> | Prisma.NegotiationCreateWithoutVariantInput[] | Prisma.NegotiationUncheckedCreateWithoutVariantInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutVariantInput | Prisma.NegotiationCreateOrConnectWithoutVariantInput[];
    createMany?: Prisma.NegotiationCreateManyVariantInputEnvelope;
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
};
export type NegotiationUpdateManyWithoutVariantNestedInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutVariantInput, Prisma.NegotiationUncheckedCreateWithoutVariantInput> | Prisma.NegotiationCreateWithoutVariantInput[] | Prisma.NegotiationUncheckedCreateWithoutVariantInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutVariantInput | Prisma.NegotiationCreateOrConnectWithoutVariantInput[];
    upsert?: Prisma.NegotiationUpsertWithWhereUniqueWithoutVariantInput | Prisma.NegotiationUpsertWithWhereUniqueWithoutVariantInput[];
    createMany?: Prisma.NegotiationCreateManyVariantInputEnvelope;
    set?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    disconnect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    delete?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    update?: Prisma.NegotiationUpdateWithWhereUniqueWithoutVariantInput | Prisma.NegotiationUpdateWithWhereUniqueWithoutVariantInput[];
    updateMany?: Prisma.NegotiationUpdateManyWithWhereWithoutVariantInput | Prisma.NegotiationUpdateManyWithWhereWithoutVariantInput[];
    deleteMany?: Prisma.NegotiationScalarWhereInput | Prisma.NegotiationScalarWhereInput[];
};
export type NegotiationUncheckedUpdateManyWithoutVariantNestedInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutVariantInput, Prisma.NegotiationUncheckedCreateWithoutVariantInput> | Prisma.NegotiationCreateWithoutVariantInput[] | Prisma.NegotiationUncheckedCreateWithoutVariantInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutVariantInput | Prisma.NegotiationCreateOrConnectWithoutVariantInput[];
    upsert?: Prisma.NegotiationUpsertWithWhereUniqueWithoutVariantInput | Prisma.NegotiationUpsertWithWhereUniqueWithoutVariantInput[];
    createMany?: Prisma.NegotiationCreateManyVariantInputEnvelope;
    set?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    disconnect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    delete?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    update?: Prisma.NegotiationUpdateWithWhereUniqueWithoutVariantInput | Prisma.NegotiationUpdateWithWhereUniqueWithoutVariantInput[];
    updateMany?: Prisma.NegotiationUpdateManyWithWhereWithoutVariantInput | Prisma.NegotiationUpdateManyWithWhereWithoutVariantInput[];
    deleteMany?: Prisma.NegotiationScalarWhereInput | Prisma.NegotiationScalarWhereInput[];
};
export type NegotiationCreateNestedManyWithoutConversationInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutConversationInput, Prisma.NegotiationUncheckedCreateWithoutConversationInput> | Prisma.NegotiationCreateWithoutConversationInput[] | Prisma.NegotiationUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutConversationInput | Prisma.NegotiationCreateOrConnectWithoutConversationInput[];
    createMany?: Prisma.NegotiationCreateManyConversationInputEnvelope;
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
};
export type NegotiationUncheckedCreateNestedManyWithoutConversationInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutConversationInput, Prisma.NegotiationUncheckedCreateWithoutConversationInput> | Prisma.NegotiationCreateWithoutConversationInput[] | Prisma.NegotiationUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutConversationInput | Prisma.NegotiationCreateOrConnectWithoutConversationInput[];
    createMany?: Prisma.NegotiationCreateManyConversationInputEnvelope;
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
};
export type NegotiationUpdateManyWithoutConversationNestedInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutConversationInput, Prisma.NegotiationUncheckedCreateWithoutConversationInput> | Prisma.NegotiationCreateWithoutConversationInput[] | Prisma.NegotiationUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutConversationInput | Prisma.NegotiationCreateOrConnectWithoutConversationInput[];
    upsert?: Prisma.NegotiationUpsertWithWhereUniqueWithoutConversationInput | Prisma.NegotiationUpsertWithWhereUniqueWithoutConversationInput[];
    createMany?: Prisma.NegotiationCreateManyConversationInputEnvelope;
    set?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    disconnect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    delete?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    update?: Prisma.NegotiationUpdateWithWhereUniqueWithoutConversationInput | Prisma.NegotiationUpdateWithWhereUniqueWithoutConversationInput[];
    updateMany?: Prisma.NegotiationUpdateManyWithWhereWithoutConversationInput | Prisma.NegotiationUpdateManyWithWhereWithoutConversationInput[];
    deleteMany?: Prisma.NegotiationScalarWhereInput | Prisma.NegotiationScalarWhereInput[];
};
export type NegotiationUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: Prisma.XOR<Prisma.NegotiationCreateWithoutConversationInput, Prisma.NegotiationUncheckedCreateWithoutConversationInput> | Prisma.NegotiationCreateWithoutConversationInput[] | Prisma.NegotiationUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.NegotiationCreateOrConnectWithoutConversationInput | Prisma.NegotiationCreateOrConnectWithoutConversationInput[];
    upsert?: Prisma.NegotiationUpsertWithWhereUniqueWithoutConversationInput | Prisma.NegotiationUpsertWithWhereUniqueWithoutConversationInput[];
    createMany?: Prisma.NegotiationCreateManyConversationInputEnvelope;
    set?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    disconnect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    delete?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    connect?: Prisma.NegotiationWhereUniqueInput | Prisma.NegotiationWhereUniqueInput[];
    update?: Prisma.NegotiationUpdateWithWhereUniqueWithoutConversationInput | Prisma.NegotiationUpdateWithWhereUniqueWithoutConversationInput[];
    updateMany?: Prisma.NegotiationUpdateManyWithWhereWithoutConversationInput | Prisma.NegotiationUpdateManyWithWhereWithoutConversationInput[];
    deleteMany?: Prisma.NegotiationScalarWhereInput | Prisma.NegotiationScalarWhereInput[];
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumNegotiationStatusFieldUpdateOperationsInput = {
    set?: $Enums.NegotiationStatus;
};
export type NegotiationCreateWithoutVariantInput = {
    id?: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
    conversation: Prisma.ConversationCreateNestedOneWithoutNegotiationsInput;
};
export type NegotiationUncheckedCreateWithoutVariantInput = {
    id?: string;
    conversationId: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
};
export type NegotiationCreateOrConnectWithoutVariantInput = {
    where: Prisma.NegotiationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NegotiationCreateWithoutVariantInput, Prisma.NegotiationUncheckedCreateWithoutVariantInput>;
};
export type NegotiationCreateManyVariantInputEnvelope = {
    data: Prisma.NegotiationCreateManyVariantInput | Prisma.NegotiationCreateManyVariantInput[];
    skipDuplicates?: boolean;
};
export type NegotiationUpsertWithWhereUniqueWithoutVariantInput = {
    where: Prisma.NegotiationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NegotiationUpdateWithoutVariantInput, Prisma.NegotiationUncheckedUpdateWithoutVariantInput>;
    create: Prisma.XOR<Prisma.NegotiationCreateWithoutVariantInput, Prisma.NegotiationUncheckedCreateWithoutVariantInput>;
};
export type NegotiationUpdateWithWhereUniqueWithoutVariantInput = {
    where: Prisma.NegotiationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NegotiationUpdateWithoutVariantInput, Prisma.NegotiationUncheckedUpdateWithoutVariantInput>;
};
export type NegotiationUpdateManyWithWhereWithoutVariantInput = {
    where: Prisma.NegotiationScalarWhereInput;
    data: Prisma.XOR<Prisma.NegotiationUpdateManyMutationInput, Prisma.NegotiationUncheckedUpdateManyWithoutVariantInput>;
};
export type NegotiationScalarWhereInput = {
    AND?: Prisma.NegotiationScalarWhereInput | Prisma.NegotiationScalarWhereInput[];
    OR?: Prisma.NegotiationScalarWhereInput[];
    NOT?: Prisma.NegotiationScalarWhereInput | Prisma.NegotiationScalarWhereInput[];
    id?: Prisma.StringFilter<"Negotiation"> | string;
    conversationId?: Prisma.StringFilter<"Negotiation"> | string;
    variantId?: Prisma.StringFilter<"Negotiation"> | string;
    rounds?: Prisma.IntFilter<"Negotiation"> | number;
    lastOfferKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    quotedKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    agreedKobo?: Prisma.IntNullableFilter<"Negotiation"> | number | null;
    status?: Prisma.EnumNegotiationStatusFilter<"Negotiation"> | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFilter<"Negotiation"> | Date | string;
};
export type NegotiationCreateWithoutConversationInput = {
    id?: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
    variant: Prisma.VariantCreateNestedOneWithoutNegotiationsInput;
};
export type NegotiationUncheckedCreateWithoutConversationInput = {
    id?: string;
    variantId: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
};
export type NegotiationCreateOrConnectWithoutConversationInput = {
    where: Prisma.NegotiationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NegotiationCreateWithoutConversationInput, Prisma.NegotiationUncheckedCreateWithoutConversationInput>;
};
export type NegotiationCreateManyConversationInputEnvelope = {
    data: Prisma.NegotiationCreateManyConversationInput | Prisma.NegotiationCreateManyConversationInput[];
    skipDuplicates?: boolean;
};
export type NegotiationUpsertWithWhereUniqueWithoutConversationInput = {
    where: Prisma.NegotiationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NegotiationUpdateWithoutConversationInput, Prisma.NegotiationUncheckedUpdateWithoutConversationInput>;
    create: Prisma.XOR<Prisma.NegotiationCreateWithoutConversationInput, Prisma.NegotiationUncheckedCreateWithoutConversationInput>;
};
export type NegotiationUpdateWithWhereUniqueWithoutConversationInput = {
    where: Prisma.NegotiationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NegotiationUpdateWithoutConversationInput, Prisma.NegotiationUncheckedUpdateWithoutConversationInput>;
};
export type NegotiationUpdateManyWithWhereWithoutConversationInput = {
    where: Prisma.NegotiationScalarWhereInput;
    data: Prisma.XOR<Prisma.NegotiationUpdateManyMutationInput, Prisma.NegotiationUncheckedUpdateManyWithoutConversationInput>;
};
export type NegotiationCreateManyVariantInput = {
    id?: string;
    conversationId: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
};
export type NegotiationUpdateWithoutVariantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    conversation?: Prisma.ConversationUpdateOneRequiredWithoutNegotiationsNestedInput;
};
export type NegotiationUncheckedUpdateWithoutVariantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationUncheckedUpdateManyWithoutVariantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationCreateManyConversationInput = {
    id?: string;
    variantId: string;
    rounds?: number;
    lastOfferKobo?: number | null;
    quotedKobo?: number | null;
    agreedKobo?: number | null;
    status?: $Enums.NegotiationStatus;
    updatedAt?: Date | string;
};
export type NegotiationUpdateWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    variant?: Prisma.VariantUpdateOneRequiredWithoutNegotiationsNestedInput;
};
export type NegotiationUncheckedUpdateWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    variantId?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationUncheckedUpdateManyWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    variantId?: Prisma.StringFieldUpdateOperationsInput | string;
    rounds?: Prisma.IntFieldUpdateOperationsInput | number;
    lastOfferKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    quotedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    agreedKobo?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.EnumNegotiationStatusFieldUpdateOperationsInput | $Enums.NegotiationStatus;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NegotiationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    conversationId?: boolean;
    variantId?: boolean;
    rounds?: boolean;
    lastOfferKobo?: boolean;
    quotedKobo?: boolean;
    agreedKobo?: boolean;
    status?: boolean;
    updatedAt?: boolean;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    variant?: boolean | Prisma.VariantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["negotiation"]>;
export type NegotiationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    conversationId?: boolean;
    variantId?: boolean;
    rounds?: boolean;
    lastOfferKobo?: boolean;
    quotedKobo?: boolean;
    agreedKobo?: boolean;
    status?: boolean;
    updatedAt?: boolean;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    variant?: boolean | Prisma.VariantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["negotiation"]>;
export type NegotiationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    conversationId?: boolean;
    variantId?: boolean;
    rounds?: boolean;
    lastOfferKobo?: boolean;
    quotedKobo?: boolean;
    agreedKobo?: boolean;
    status?: boolean;
    updatedAt?: boolean;
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    variant?: boolean | Prisma.VariantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["negotiation"]>;
export type NegotiationSelectScalar = {
    id?: boolean;
    conversationId?: boolean;
    variantId?: boolean;
    rounds?: boolean;
    lastOfferKobo?: boolean;
    quotedKobo?: boolean;
    agreedKobo?: boolean;
    status?: boolean;
    updatedAt?: boolean;
};
export type NegotiationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "conversationId" | "variantId" | "rounds" | "lastOfferKobo" | "quotedKobo" | "agreedKobo" | "status" | "updatedAt", ExtArgs["result"]["negotiation"]>;
export type NegotiationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    variant?: boolean | Prisma.VariantDefaultArgs<ExtArgs>;
};
export type NegotiationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    variant?: boolean | Prisma.VariantDefaultArgs<ExtArgs>;
};
export type NegotiationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    conversation?: boolean | Prisma.ConversationDefaultArgs<ExtArgs>;
    variant?: boolean | Prisma.VariantDefaultArgs<ExtArgs>;
};
export type $NegotiationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Negotiation";
    objects: {
        conversation: Prisma.$ConversationPayload<ExtArgs>;
        variant: Prisma.$VariantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        conversationId: string;
        variantId: string;
        rounds: number;
        lastOfferKobo: number | null;
        quotedKobo: number | null;
        agreedKobo: number | null;
        status: $Enums.NegotiationStatus;
        updatedAt: Date;
    }, ExtArgs["result"]["negotiation"]>;
    composites: {};
};
export type NegotiationGetPayload<S extends boolean | null | undefined | NegotiationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$NegotiationPayload, S>;
export type NegotiationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<NegotiationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: NegotiationCountAggregateInputType | true;
};
export interface NegotiationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Negotiation'];
        meta: {
            name: 'Negotiation';
        };
    };
    findUnique<T extends NegotiationFindUniqueArgs>(args: Prisma.SelectSubset<T, NegotiationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends NegotiationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, NegotiationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends NegotiationFindFirstArgs>(args?: Prisma.SelectSubset<T, NegotiationFindFirstArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends NegotiationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, NegotiationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends NegotiationFindManyArgs>(args?: Prisma.SelectSubset<T, NegotiationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends NegotiationCreateArgs>(args: Prisma.SelectSubset<T, NegotiationCreateArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends NegotiationCreateManyArgs>(args?: Prisma.SelectSubset<T, NegotiationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends NegotiationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, NegotiationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends NegotiationDeleteArgs>(args: Prisma.SelectSubset<T, NegotiationDeleteArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends NegotiationUpdateArgs>(args: Prisma.SelectSubset<T, NegotiationUpdateArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends NegotiationDeleteManyArgs>(args?: Prisma.SelectSubset<T, NegotiationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends NegotiationUpdateManyArgs>(args: Prisma.SelectSubset<T, NegotiationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends NegotiationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, NegotiationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends NegotiationUpsertArgs>(args: Prisma.SelectSubset<T, NegotiationUpsertArgs<ExtArgs>>): Prisma.Prisma__NegotiationClient<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends NegotiationCountArgs>(args?: Prisma.Subset<T, NegotiationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], NegotiationCountAggregateOutputType> : number>;
    aggregate<T extends NegotiationAggregateArgs>(args: Prisma.Subset<T, NegotiationAggregateArgs>): Prisma.PrismaPromise<GetNegotiationAggregateType<T>>;
    groupBy<T extends NegotiationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: NegotiationGroupByArgs['orderBy'];
    } : {
        orderBy?: NegotiationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, NegotiationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNegotiationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: NegotiationFieldRefs;
}
export interface Prisma__NegotiationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    conversation<T extends Prisma.ConversationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ConversationDefaultArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    variant<T extends Prisma.VariantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VariantDefaultArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface NegotiationFieldRefs {
    readonly id: Prisma.FieldRef<"Negotiation", 'String'>;
    readonly conversationId: Prisma.FieldRef<"Negotiation", 'String'>;
    readonly variantId: Prisma.FieldRef<"Negotiation", 'String'>;
    readonly rounds: Prisma.FieldRef<"Negotiation", 'Int'>;
    readonly lastOfferKobo: Prisma.FieldRef<"Negotiation", 'Int'>;
    readonly quotedKobo: Prisma.FieldRef<"Negotiation", 'Int'>;
    readonly agreedKobo: Prisma.FieldRef<"Negotiation", 'Int'>;
    readonly status: Prisma.FieldRef<"Negotiation", 'NegotiationStatus'>;
    readonly updatedAt: Prisma.FieldRef<"Negotiation", 'DateTime'>;
}
export type NegotiationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    where: Prisma.NegotiationWhereUniqueInput;
};
export type NegotiationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    where: Prisma.NegotiationWhereUniqueInput;
};
export type NegotiationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type NegotiationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type NegotiationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type NegotiationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NegotiationCreateInput, Prisma.NegotiationUncheckedCreateInput>;
};
export type NegotiationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.NegotiationCreateManyInput | Prisma.NegotiationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type NegotiationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    data: Prisma.NegotiationCreateManyInput | Prisma.NegotiationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.NegotiationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type NegotiationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NegotiationUpdateInput, Prisma.NegotiationUncheckedUpdateInput>;
    where: Prisma.NegotiationWhereUniqueInput;
};
export type NegotiationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.NegotiationUpdateManyMutationInput, Prisma.NegotiationUncheckedUpdateManyInput>;
    where?: Prisma.NegotiationWhereInput;
    limit?: number;
};
export type NegotiationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NegotiationUpdateManyMutationInput, Prisma.NegotiationUncheckedUpdateManyInput>;
    where?: Prisma.NegotiationWhereInput;
    limit?: number;
    include?: Prisma.NegotiationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type NegotiationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    where: Prisma.NegotiationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NegotiationCreateInput, Prisma.NegotiationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.NegotiationUpdateInput, Prisma.NegotiationUncheckedUpdateInput>;
};
export type NegotiationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
    where: Prisma.NegotiationWhereUniqueInput;
};
export type NegotiationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NegotiationWhereInput;
    limit?: number;
};
export type NegotiationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NegotiationSelect<ExtArgs> | null;
    omit?: Prisma.NegotiationOmit<ExtArgs> | null;
    include?: Prisma.NegotiationInclude<ExtArgs> | null;
};
