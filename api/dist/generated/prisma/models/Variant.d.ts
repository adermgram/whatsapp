import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type VariantModel = runtime.Types.Result.DefaultSelection<Prisma.$VariantPayload>;
export type AggregateVariant = {
    _count: VariantCountAggregateOutputType | null;
    _avg: VariantAvgAggregateOutputType | null;
    _sum: VariantSumAggregateOutputType | null;
    _min: VariantMinAggregateOutputType | null;
    _max: VariantMaxAggregateOutputType | null;
};
export type VariantAvgAggregateOutputType = {
    priceKobo: number | null;
    minPriceKobo: number | null;
    stock: number | null;
    reserved: number | null;
};
export type VariantSumAggregateOutputType = {
    priceKobo: number | null;
    minPriceKobo: number | null;
    stock: number | null;
    reserved: number | null;
};
export type VariantMinAggregateOutputType = {
    id: string | null;
    productId: string | null;
    merchantId: string | null;
    sku: string | null;
    size: string | null;
    color: string | null;
    priceKobo: number | null;
    minPriceKobo: number | null;
    stock: number | null;
    reserved: number | null;
    createdAt: Date | null;
};
export type VariantMaxAggregateOutputType = {
    id: string | null;
    productId: string | null;
    merchantId: string | null;
    sku: string | null;
    size: string | null;
    color: string | null;
    priceKobo: number | null;
    minPriceKobo: number | null;
    stock: number | null;
    reserved: number | null;
    createdAt: Date | null;
};
export type VariantCountAggregateOutputType = {
    id: number;
    productId: number;
    merchantId: number;
    sku: number;
    size: number;
    color: number;
    priceKobo: number;
    minPriceKobo: number;
    stock: number;
    reserved: number;
    createdAt: number;
    _all: number;
};
export type VariantAvgAggregateInputType = {
    priceKobo?: true;
    minPriceKobo?: true;
    stock?: true;
    reserved?: true;
};
export type VariantSumAggregateInputType = {
    priceKobo?: true;
    minPriceKobo?: true;
    stock?: true;
    reserved?: true;
};
export type VariantMinAggregateInputType = {
    id?: true;
    productId?: true;
    merchantId?: true;
    sku?: true;
    size?: true;
    color?: true;
    priceKobo?: true;
    minPriceKobo?: true;
    stock?: true;
    reserved?: true;
    createdAt?: true;
};
export type VariantMaxAggregateInputType = {
    id?: true;
    productId?: true;
    merchantId?: true;
    sku?: true;
    size?: true;
    color?: true;
    priceKobo?: true;
    minPriceKobo?: true;
    stock?: true;
    reserved?: true;
    createdAt?: true;
};
export type VariantCountAggregateInputType = {
    id?: true;
    productId?: true;
    merchantId?: true;
    sku?: true;
    size?: true;
    color?: true;
    priceKobo?: true;
    minPriceKobo?: true;
    stock?: true;
    reserved?: true;
    createdAt?: true;
    _all?: true;
};
export type VariantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VariantWhereInput;
    orderBy?: Prisma.VariantOrderByWithRelationInput | Prisma.VariantOrderByWithRelationInput[];
    cursor?: Prisma.VariantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VariantCountAggregateInputType;
    _avg?: VariantAvgAggregateInputType;
    _sum?: VariantSumAggregateInputType;
    _min?: VariantMinAggregateInputType;
    _max?: VariantMaxAggregateInputType;
};
export type GetVariantAggregateType<T extends VariantAggregateArgs> = {
    [P in keyof T & keyof AggregateVariant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVariant[P]> : Prisma.GetScalarType<T[P], AggregateVariant[P]>;
};
export type VariantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VariantWhereInput;
    orderBy?: Prisma.VariantOrderByWithAggregationInput | Prisma.VariantOrderByWithAggregationInput[];
    by: Prisma.VariantScalarFieldEnum[] | Prisma.VariantScalarFieldEnum;
    having?: Prisma.VariantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VariantCountAggregateInputType | true;
    _avg?: VariantAvgAggregateInputType;
    _sum?: VariantSumAggregateInputType;
    _min?: VariantMinAggregateInputType;
    _max?: VariantMaxAggregateInputType;
};
export type VariantGroupByOutputType = {
    id: string;
    productId: string;
    merchantId: string;
    sku: string | null;
    size: string | null;
    color: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock: number;
    reserved: number;
    createdAt: Date;
    _count: VariantCountAggregateOutputType | null;
    _avg: VariantAvgAggregateOutputType | null;
    _sum: VariantSumAggregateOutputType | null;
    _min: VariantMinAggregateOutputType | null;
    _max: VariantMaxAggregateOutputType | null;
};
export type GetVariantGroupByPayload<T extends VariantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VariantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VariantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VariantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VariantGroupByOutputType[P]>;
}>>;
export type VariantWhereInput = {
    AND?: Prisma.VariantWhereInput | Prisma.VariantWhereInput[];
    OR?: Prisma.VariantWhereInput[];
    NOT?: Prisma.VariantWhereInput | Prisma.VariantWhereInput[];
    id?: Prisma.StringFilter<"Variant"> | string;
    productId?: Prisma.StringFilter<"Variant"> | string;
    merchantId?: Prisma.StringFilter<"Variant"> | string;
    sku?: Prisma.StringNullableFilter<"Variant"> | string | null;
    size?: Prisma.StringNullableFilter<"Variant"> | string | null;
    color?: Prisma.StringNullableFilter<"Variant"> | string | null;
    priceKobo?: Prisma.IntFilter<"Variant"> | number;
    minPriceKobo?: Prisma.IntFilter<"Variant"> | number;
    stock?: Prisma.IntFilter<"Variant"> | number;
    reserved?: Prisma.IntFilter<"Variant"> | number;
    createdAt?: Prisma.DateTimeFilter<"Variant"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
    orderItems?: Prisma.OrderItemListRelationFilter;
    negotiations?: Prisma.NegotiationListRelationFilter;
};
export type VariantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    size?: Prisma.SortOrderInput | Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    product?: Prisma.ProductOrderByWithRelationInput;
    orderItems?: Prisma.OrderItemOrderByRelationAggregateInput;
    negotiations?: Prisma.NegotiationOrderByRelationAggregateInput;
};
export type VariantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.VariantWhereInput | Prisma.VariantWhereInput[];
    OR?: Prisma.VariantWhereInput[];
    NOT?: Prisma.VariantWhereInput | Prisma.VariantWhereInput[];
    productId?: Prisma.StringFilter<"Variant"> | string;
    merchantId?: Prisma.StringFilter<"Variant"> | string;
    sku?: Prisma.StringNullableFilter<"Variant"> | string | null;
    size?: Prisma.StringNullableFilter<"Variant"> | string | null;
    color?: Prisma.StringNullableFilter<"Variant"> | string | null;
    priceKobo?: Prisma.IntFilter<"Variant"> | number;
    minPriceKobo?: Prisma.IntFilter<"Variant"> | number;
    stock?: Prisma.IntFilter<"Variant"> | number;
    reserved?: Prisma.IntFilter<"Variant"> | number;
    createdAt?: Prisma.DateTimeFilter<"Variant"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
    orderItems?: Prisma.OrderItemListRelationFilter;
    negotiations?: Prisma.NegotiationListRelationFilter;
}, "id">;
export type VariantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    size?: Prisma.SortOrderInput | Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.VariantCountOrderByAggregateInput;
    _avg?: Prisma.VariantAvgOrderByAggregateInput;
    _max?: Prisma.VariantMaxOrderByAggregateInput;
    _min?: Prisma.VariantMinOrderByAggregateInput;
    _sum?: Prisma.VariantSumOrderByAggregateInput;
};
export type VariantScalarWhereWithAggregatesInput = {
    AND?: Prisma.VariantScalarWhereWithAggregatesInput | Prisma.VariantScalarWhereWithAggregatesInput[];
    OR?: Prisma.VariantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VariantScalarWhereWithAggregatesInput | Prisma.VariantScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Variant"> | string;
    productId?: Prisma.StringWithAggregatesFilter<"Variant"> | string;
    merchantId?: Prisma.StringWithAggregatesFilter<"Variant"> | string;
    sku?: Prisma.StringNullableWithAggregatesFilter<"Variant"> | string | null;
    size?: Prisma.StringNullableWithAggregatesFilter<"Variant"> | string | null;
    color?: Prisma.StringNullableWithAggregatesFilter<"Variant"> | string | null;
    priceKobo?: Prisma.IntWithAggregatesFilter<"Variant"> | number;
    minPriceKobo?: Prisma.IntWithAggregatesFilter<"Variant"> | number;
    stock?: Prisma.IntWithAggregatesFilter<"Variant"> | number;
    reserved?: Prisma.IntWithAggregatesFilter<"Variant"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Variant"> | Date | string;
};
export type VariantCreateInput = {
    id?: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    product: Prisma.ProductCreateNestedOneWithoutVariantsInput;
    orderItems?: Prisma.OrderItemCreateNestedManyWithoutVariantInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutVariantInput;
};
export type VariantUncheckedCreateInput = {
    id?: string;
    productId: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    orderItems?: Prisma.OrderItemUncheckedCreateNestedManyWithoutVariantInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutVariantInput;
};
export type VariantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutVariantsNestedInput;
    orderItems?: Prisma.OrderItemUpdateManyWithoutVariantNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutVariantNestedInput;
};
export type VariantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUncheckedUpdateManyWithoutVariantNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutVariantNestedInput;
};
export type VariantCreateManyInput = {
    id?: string;
    productId: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
};
export type VariantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VariantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VariantListRelationFilter = {
    every?: Prisma.VariantWhereInput;
    some?: Prisma.VariantWhereInput;
    none?: Prisma.VariantWhereInput;
};
export type VariantOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VariantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type VariantAvgOrderByAggregateInput = {
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
};
export type VariantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type VariantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type VariantSumOrderByAggregateInput = {
    priceKobo?: Prisma.SortOrder;
    minPriceKobo?: Prisma.SortOrder;
    stock?: Prisma.SortOrder;
    reserved?: Prisma.SortOrder;
};
export type VariantScalarRelationFilter = {
    is?: Prisma.VariantWhereInput;
    isNot?: Prisma.VariantWhereInput;
};
export type VariantCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutProductInput, Prisma.VariantUncheckedCreateWithoutProductInput> | Prisma.VariantCreateWithoutProductInput[] | Prisma.VariantUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutProductInput | Prisma.VariantCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.VariantCreateManyProductInputEnvelope;
    connect?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
};
export type VariantUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutProductInput, Prisma.VariantUncheckedCreateWithoutProductInput> | Prisma.VariantCreateWithoutProductInput[] | Prisma.VariantUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutProductInput | Prisma.VariantCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.VariantCreateManyProductInputEnvelope;
    connect?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
};
export type VariantUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutProductInput, Prisma.VariantUncheckedCreateWithoutProductInput> | Prisma.VariantCreateWithoutProductInput[] | Prisma.VariantUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutProductInput | Prisma.VariantCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.VariantUpsertWithWhereUniqueWithoutProductInput | Prisma.VariantUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.VariantCreateManyProductInputEnvelope;
    set?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    disconnect?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    delete?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    connect?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    update?: Prisma.VariantUpdateWithWhereUniqueWithoutProductInput | Prisma.VariantUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.VariantUpdateManyWithWhereWithoutProductInput | Prisma.VariantUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.VariantScalarWhereInput | Prisma.VariantScalarWhereInput[];
};
export type VariantUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutProductInput, Prisma.VariantUncheckedCreateWithoutProductInput> | Prisma.VariantCreateWithoutProductInput[] | Prisma.VariantUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutProductInput | Prisma.VariantCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.VariantUpsertWithWhereUniqueWithoutProductInput | Prisma.VariantUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.VariantCreateManyProductInputEnvelope;
    set?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    disconnect?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    delete?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    connect?: Prisma.VariantWhereUniqueInput | Prisma.VariantWhereUniqueInput[];
    update?: Prisma.VariantUpdateWithWhereUniqueWithoutProductInput | Prisma.VariantUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.VariantUpdateManyWithWhereWithoutProductInput | Prisma.VariantUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.VariantScalarWhereInput | Prisma.VariantScalarWhereInput[];
};
export type VariantCreateNestedOneWithoutNegotiationsInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutNegotiationsInput, Prisma.VariantUncheckedCreateWithoutNegotiationsInput>;
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutNegotiationsInput;
    connect?: Prisma.VariantWhereUniqueInput;
};
export type VariantUpdateOneRequiredWithoutNegotiationsNestedInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutNegotiationsInput, Prisma.VariantUncheckedCreateWithoutNegotiationsInput>;
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutNegotiationsInput;
    upsert?: Prisma.VariantUpsertWithoutNegotiationsInput;
    connect?: Prisma.VariantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VariantUpdateToOneWithWhereWithoutNegotiationsInput, Prisma.VariantUpdateWithoutNegotiationsInput>, Prisma.VariantUncheckedUpdateWithoutNegotiationsInput>;
};
export type VariantCreateNestedOneWithoutOrderItemsInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutOrderItemsInput, Prisma.VariantUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutOrderItemsInput;
    connect?: Prisma.VariantWhereUniqueInput;
};
export type VariantUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: Prisma.XOR<Prisma.VariantCreateWithoutOrderItemsInput, Prisma.VariantUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.VariantCreateOrConnectWithoutOrderItemsInput;
    upsert?: Prisma.VariantUpsertWithoutOrderItemsInput;
    connect?: Prisma.VariantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.VariantUpdateToOneWithWhereWithoutOrderItemsInput, Prisma.VariantUpdateWithoutOrderItemsInput>, Prisma.VariantUncheckedUpdateWithoutOrderItemsInput>;
};
export type VariantCreateWithoutProductInput = {
    id?: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    orderItems?: Prisma.OrderItemCreateNestedManyWithoutVariantInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutVariantInput;
};
export type VariantUncheckedCreateWithoutProductInput = {
    id?: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    orderItems?: Prisma.OrderItemUncheckedCreateNestedManyWithoutVariantInput;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutVariantInput;
};
export type VariantCreateOrConnectWithoutProductInput = {
    where: Prisma.VariantWhereUniqueInput;
    create: Prisma.XOR<Prisma.VariantCreateWithoutProductInput, Prisma.VariantUncheckedCreateWithoutProductInput>;
};
export type VariantCreateManyProductInputEnvelope = {
    data: Prisma.VariantCreateManyProductInput | Prisma.VariantCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type VariantUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.VariantWhereUniqueInput;
    update: Prisma.XOR<Prisma.VariantUpdateWithoutProductInput, Prisma.VariantUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.VariantCreateWithoutProductInput, Prisma.VariantUncheckedCreateWithoutProductInput>;
};
export type VariantUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.VariantWhereUniqueInput;
    data: Prisma.XOR<Prisma.VariantUpdateWithoutProductInput, Prisma.VariantUncheckedUpdateWithoutProductInput>;
};
export type VariantUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.VariantScalarWhereInput;
    data: Prisma.XOR<Prisma.VariantUpdateManyMutationInput, Prisma.VariantUncheckedUpdateManyWithoutProductInput>;
};
export type VariantScalarWhereInput = {
    AND?: Prisma.VariantScalarWhereInput | Prisma.VariantScalarWhereInput[];
    OR?: Prisma.VariantScalarWhereInput[];
    NOT?: Prisma.VariantScalarWhereInput | Prisma.VariantScalarWhereInput[];
    id?: Prisma.StringFilter<"Variant"> | string;
    productId?: Prisma.StringFilter<"Variant"> | string;
    merchantId?: Prisma.StringFilter<"Variant"> | string;
    sku?: Prisma.StringNullableFilter<"Variant"> | string | null;
    size?: Prisma.StringNullableFilter<"Variant"> | string | null;
    color?: Prisma.StringNullableFilter<"Variant"> | string | null;
    priceKobo?: Prisma.IntFilter<"Variant"> | number;
    minPriceKobo?: Prisma.IntFilter<"Variant"> | number;
    stock?: Prisma.IntFilter<"Variant"> | number;
    reserved?: Prisma.IntFilter<"Variant"> | number;
    createdAt?: Prisma.DateTimeFilter<"Variant"> | Date | string;
};
export type VariantCreateWithoutNegotiationsInput = {
    id?: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    product: Prisma.ProductCreateNestedOneWithoutVariantsInput;
    orderItems?: Prisma.OrderItemCreateNestedManyWithoutVariantInput;
};
export type VariantUncheckedCreateWithoutNegotiationsInput = {
    id?: string;
    productId: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    orderItems?: Prisma.OrderItemUncheckedCreateNestedManyWithoutVariantInput;
};
export type VariantCreateOrConnectWithoutNegotiationsInput = {
    where: Prisma.VariantWhereUniqueInput;
    create: Prisma.XOR<Prisma.VariantCreateWithoutNegotiationsInput, Prisma.VariantUncheckedCreateWithoutNegotiationsInput>;
};
export type VariantUpsertWithoutNegotiationsInput = {
    update: Prisma.XOR<Prisma.VariantUpdateWithoutNegotiationsInput, Prisma.VariantUncheckedUpdateWithoutNegotiationsInput>;
    create: Prisma.XOR<Prisma.VariantCreateWithoutNegotiationsInput, Prisma.VariantUncheckedCreateWithoutNegotiationsInput>;
    where?: Prisma.VariantWhereInput;
};
export type VariantUpdateToOneWithWhereWithoutNegotiationsInput = {
    where?: Prisma.VariantWhereInput;
    data: Prisma.XOR<Prisma.VariantUpdateWithoutNegotiationsInput, Prisma.VariantUncheckedUpdateWithoutNegotiationsInput>;
};
export type VariantUpdateWithoutNegotiationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutVariantsNestedInput;
    orderItems?: Prisma.OrderItemUpdateManyWithoutVariantNestedInput;
};
export type VariantUncheckedUpdateWithoutNegotiationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUncheckedUpdateManyWithoutVariantNestedInput;
};
export type VariantCreateWithoutOrderItemsInput = {
    id?: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    product: Prisma.ProductCreateNestedOneWithoutVariantsInput;
    negotiations?: Prisma.NegotiationCreateNestedManyWithoutVariantInput;
};
export type VariantUncheckedCreateWithoutOrderItemsInput = {
    id?: string;
    productId: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
    negotiations?: Prisma.NegotiationUncheckedCreateNestedManyWithoutVariantInput;
};
export type VariantCreateOrConnectWithoutOrderItemsInput = {
    where: Prisma.VariantWhereUniqueInput;
    create: Prisma.XOR<Prisma.VariantCreateWithoutOrderItemsInput, Prisma.VariantUncheckedCreateWithoutOrderItemsInput>;
};
export type VariantUpsertWithoutOrderItemsInput = {
    update: Prisma.XOR<Prisma.VariantUpdateWithoutOrderItemsInput, Prisma.VariantUncheckedUpdateWithoutOrderItemsInput>;
    create: Prisma.XOR<Prisma.VariantCreateWithoutOrderItemsInput, Prisma.VariantUncheckedCreateWithoutOrderItemsInput>;
    where?: Prisma.VariantWhereInput;
};
export type VariantUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: Prisma.VariantWhereInput;
    data: Prisma.XOR<Prisma.VariantUpdateWithoutOrderItemsInput, Prisma.VariantUncheckedUpdateWithoutOrderItemsInput>;
};
export type VariantUpdateWithoutOrderItemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutVariantsNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutVariantNestedInput;
};
export type VariantUncheckedUpdateWithoutOrderItemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutVariantNestedInput;
};
export type VariantCreateManyProductInput = {
    id?: string;
    merchantId: string;
    sku?: string | null;
    size?: string | null;
    color?: string | null;
    priceKobo: number;
    minPriceKobo: number;
    stock?: number;
    reserved?: number;
    createdAt?: Date | string;
};
export type VariantUpdateWithoutProductInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUpdateManyWithoutVariantNestedInput;
    negotiations?: Prisma.NegotiationUpdateManyWithoutVariantNestedInput;
};
export type VariantUncheckedUpdateWithoutProductInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUncheckedUpdateManyWithoutVariantNestedInput;
    negotiations?: Prisma.NegotiationUncheckedUpdateManyWithoutVariantNestedInput;
};
export type VariantUncheckedUpdateManyWithoutProductInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    size?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    minPriceKobo?: Prisma.IntFieldUpdateOperationsInput | number;
    stock?: Prisma.IntFieldUpdateOperationsInput | number;
    reserved?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VariantCountOutputType = {
    orderItems: number;
    negotiations: number;
};
export type VariantCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItems?: boolean | VariantCountOutputTypeCountOrderItemsArgs;
    negotiations?: boolean | VariantCountOutputTypeCountNegotiationsArgs;
};
export type VariantCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantCountOutputTypeSelect<ExtArgs> | null;
};
export type VariantCountOutputTypeCountOrderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemWhereInput;
};
export type VariantCountOutputTypeCountNegotiationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NegotiationWhereInput;
};
export type VariantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    productId?: boolean;
    merchantId?: boolean;
    sku?: boolean;
    size?: boolean;
    color?: boolean;
    priceKobo?: boolean;
    minPriceKobo?: boolean;
    stock?: boolean;
    reserved?: boolean;
    createdAt?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    orderItems?: boolean | Prisma.Variant$orderItemsArgs<ExtArgs>;
    negotiations?: boolean | Prisma.Variant$negotiationsArgs<ExtArgs>;
    _count?: boolean | Prisma.VariantCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["variant"]>;
export type VariantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    productId?: boolean;
    merchantId?: boolean;
    sku?: boolean;
    size?: boolean;
    color?: boolean;
    priceKobo?: boolean;
    minPriceKobo?: boolean;
    stock?: boolean;
    reserved?: boolean;
    createdAt?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["variant"]>;
export type VariantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    productId?: boolean;
    merchantId?: boolean;
    sku?: boolean;
    size?: boolean;
    color?: boolean;
    priceKobo?: boolean;
    minPriceKobo?: boolean;
    stock?: boolean;
    reserved?: boolean;
    createdAt?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["variant"]>;
export type VariantSelectScalar = {
    id?: boolean;
    productId?: boolean;
    merchantId?: boolean;
    sku?: boolean;
    size?: boolean;
    color?: boolean;
    priceKobo?: boolean;
    minPriceKobo?: boolean;
    stock?: boolean;
    reserved?: boolean;
    createdAt?: boolean;
};
export type VariantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "productId" | "merchantId" | "sku" | "size" | "color" | "priceKobo" | "minPriceKobo" | "stock" | "reserved" | "createdAt", ExtArgs["result"]["variant"]>;
export type VariantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    orderItems?: boolean | Prisma.Variant$orderItemsArgs<ExtArgs>;
    negotiations?: boolean | Prisma.Variant$negotiationsArgs<ExtArgs>;
    _count?: boolean | Prisma.VariantCountOutputTypeDefaultArgs<ExtArgs>;
};
export type VariantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type VariantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type $VariantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Variant";
    objects: {
        product: Prisma.$ProductPayload<ExtArgs>;
        orderItems: Prisma.$OrderItemPayload<ExtArgs>[];
        negotiations: Prisma.$NegotiationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        productId: string;
        merchantId: string;
        sku: string | null;
        size: string | null;
        color: string | null;
        priceKobo: number;
        minPriceKobo: number;
        stock: number;
        reserved: number;
        createdAt: Date;
    }, ExtArgs["result"]["variant"]>;
    composites: {};
};
export type VariantGetPayload<S extends boolean | null | undefined | VariantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VariantPayload, S>;
export type VariantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VariantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VariantCountAggregateInputType | true;
};
export interface VariantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Variant'];
        meta: {
            name: 'Variant';
        };
    };
    findUnique<T extends VariantFindUniqueArgs>(args: Prisma.SelectSubset<T, VariantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VariantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VariantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VariantFindFirstArgs>(args?: Prisma.SelectSubset<T, VariantFindFirstArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VariantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VariantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VariantFindManyArgs>(args?: Prisma.SelectSubset<T, VariantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VariantCreateArgs>(args: Prisma.SelectSubset<T, VariantCreateArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VariantCreateManyArgs>(args?: Prisma.SelectSubset<T, VariantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VariantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VariantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VariantDeleteArgs>(args: Prisma.SelectSubset<T, VariantDeleteArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VariantUpdateArgs>(args: Prisma.SelectSubset<T, VariantUpdateArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VariantDeleteManyArgs>(args?: Prisma.SelectSubset<T, VariantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VariantUpdateManyArgs>(args: Prisma.SelectSubset<T, VariantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VariantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VariantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VariantUpsertArgs>(args: Prisma.SelectSubset<T, VariantUpsertArgs<ExtArgs>>): Prisma.Prisma__VariantClient<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VariantCountArgs>(args?: Prisma.Subset<T, VariantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VariantCountAggregateOutputType> : number>;
    aggregate<T extends VariantAggregateArgs>(args: Prisma.Subset<T, VariantAggregateArgs>): Prisma.PrismaPromise<GetVariantAggregateType<T>>;
    groupBy<T extends VariantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VariantGroupByArgs['orderBy'];
    } : {
        orderBy?: VariantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VariantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VariantFieldRefs;
}
export interface Prisma__VariantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    product<T extends Prisma.ProductDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProductDefaultArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    orderItems<T extends Prisma.Variant$orderItemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Variant$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    negotiations<T extends Prisma.Variant$negotiationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Variant$negotiationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NegotiationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VariantFieldRefs {
    readonly id: Prisma.FieldRef<"Variant", 'String'>;
    readonly productId: Prisma.FieldRef<"Variant", 'String'>;
    readonly merchantId: Prisma.FieldRef<"Variant", 'String'>;
    readonly sku: Prisma.FieldRef<"Variant", 'String'>;
    readonly size: Prisma.FieldRef<"Variant", 'String'>;
    readonly color: Prisma.FieldRef<"Variant", 'String'>;
    readonly priceKobo: Prisma.FieldRef<"Variant", 'Int'>;
    readonly minPriceKobo: Prisma.FieldRef<"Variant", 'Int'>;
    readonly stock: Prisma.FieldRef<"Variant", 'Int'>;
    readonly reserved: Prisma.FieldRef<"Variant", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Variant", 'DateTime'>;
}
export type VariantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where: Prisma.VariantWhereUniqueInput;
};
export type VariantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where: Prisma.VariantWhereUniqueInput;
};
export type VariantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where?: Prisma.VariantWhereInput;
    orderBy?: Prisma.VariantOrderByWithRelationInput | Prisma.VariantOrderByWithRelationInput[];
    cursor?: Prisma.VariantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VariantScalarFieldEnum | Prisma.VariantScalarFieldEnum[];
};
export type VariantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where?: Prisma.VariantWhereInput;
    orderBy?: Prisma.VariantOrderByWithRelationInput | Prisma.VariantOrderByWithRelationInput[];
    cursor?: Prisma.VariantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VariantScalarFieldEnum | Prisma.VariantScalarFieldEnum[];
};
export type VariantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where?: Prisma.VariantWhereInput;
    orderBy?: Prisma.VariantOrderByWithRelationInput | Prisma.VariantOrderByWithRelationInput[];
    cursor?: Prisma.VariantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VariantScalarFieldEnum | Prisma.VariantScalarFieldEnum[];
};
export type VariantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VariantCreateInput, Prisma.VariantUncheckedCreateInput>;
};
export type VariantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VariantCreateManyInput | Prisma.VariantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VariantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    data: Prisma.VariantCreateManyInput | Prisma.VariantCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VariantIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VariantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VariantUpdateInput, Prisma.VariantUncheckedUpdateInput>;
    where: Prisma.VariantWhereUniqueInput;
};
export type VariantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VariantUpdateManyMutationInput, Prisma.VariantUncheckedUpdateManyInput>;
    where?: Prisma.VariantWhereInput;
    limit?: number;
};
export type VariantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VariantUpdateManyMutationInput, Prisma.VariantUncheckedUpdateManyInput>;
    where?: Prisma.VariantWhereInput;
    limit?: number;
    include?: Prisma.VariantIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VariantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where: Prisma.VariantWhereUniqueInput;
    create: Prisma.XOR<Prisma.VariantCreateInput, Prisma.VariantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VariantUpdateInput, Prisma.VariantUncheckedUpdateInput>;
};
export type VariantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
    where: Prisma.VariantWhereUniqueInput;
};
export type VariantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VariantWhereInput;
    limit?: number;
};
export type Variant$orderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Variant$negotiationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type VariantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VariantSelect<ExtArgs> | null;
    omit?: Prisma.VariantOmit<ExtArgs> | null;
    include?: Prisma.VariantInclude<ExtArgs> | null;
};
