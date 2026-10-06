import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProductModel = runtime.Types.Result.DefaultSelection<Prisma.$ProductPayload>;
export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null;
    _min: ProductMinAggregateOutputType | null;
    _max: ProductMaxAggregateOutputType | null;
};
export type ProductMinAggregateOutputType = {
    id: string | null;
    merchantId: string | null;
    name: string | null;
    description: string | null;
    category: $Enums.ProductCategory | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type ProductMaxAggregateOutputType = {
    id: string | null;
    merchantId: string | null;
    name: string | null;
    description: string | null;
    category: $Enums.ProductCategory | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type ProductCountAggregateOutputType = {
    id: number;
    merchantId: number;
    name: number;
    description: number;
    category: number;
    attributes: number;
    imageKeys: number;
    active: number;
    createdAt: number;
    _all: number;
};
export type ProductMinAggregateInputType = {
    id?: true;
    merchantId?: true;
    name?: true;
    description?: true;
    category?: true;
    active?: true;
    createdAt?: true;
};
export type ProductMaxAggregateInputType = {
    id?: true;
    merchantId?: true;
    name?: true;
    description?: true;
    category?: true;
    active?: true;
    createdAt?: true;
};
export type ProductCountAggregateInputType = {
    id?: true;
    merchantId?: true;
    name?: true;
    description?: true;
    category?: true;
    attributes?: true;
    imageKeys?: true;
    active?: true;
    createdAt?: true;
    _all?: true;
};
export type ProductAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
    cursor?: Prisma.ProductWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProductCountAggregateInputType;
    _min?: ProductMinAggregateInputType;
    _max?: ProductMaxAggregateInputType;
};
export type GetProductAggregateType<T extends ProductAggregateArgs> = {
    [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProduct[P]> : Prisma.GetScalarType<T[P], AggregateProduct[P]>;
};
export type ProductGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithAggregationInput | Prisma.ProductOrderByWithAggregationInput[];
    by: Prisma.ProductScalarFieldEnum[] | Prisma.ProductScalarFieldEnum;
    having?: Prisma.ProductScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductCountAggregateInputType | true;
    _min?: ProductMinAggregateInputType;
    _max?: ProductMaxAggregateInputType;
};
export type ProductGroupByOutputType = {
    id: string;
    merchantId: string;
    name: string;
    description: string | null;
    category: $Enums.ProductCategory;
    attributes: runtime.JsonValue;
    imageKeys: string[];
    active: boolean;
    createdAt: Date;
    _count: ProductCountAggregateOutputType | null;
    _min: ProductMinAggregateOutputType | null;
    _max: ProductMaxAggregateOutputType | null;
};
export type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductGroupByOutputType[P]>;
}>>;
export type ProductWhereInput = {
    AND?: Prisma.ProductWhereInput | Prisma.ProductWhereInput[];
    OR?: Prisma.ProductWhereInput[];
    NOT?: Prisma.ProductWhereInput | Prisma.ProductWhereInput[];
    id?: Prisma.StringFilter<"Product"> | string;
    merchantId?: Prisma.StringFilter<"Product"> | string;
    name?: Prisma.StringFilter<"Product"> | string;
    description?: Prisma.StringNullableFilter<"Product"> | string | null;
    category?: Prisma.EnumProductCategoryFilter<"Product"> | $Enums.ProductCategory;
    attributes?: Prisma.JsonFilter<"Product">;
    imageKeys?: Prisma.StringNullableListFilter<"Product">;
    active?: Prisma.BoolFilter<"Product"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Product"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
    variants?: Prisma.VariantListRelationFilter;
};
export type ProductOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrder;
    attributes?: Prisma.SortOrder;
    imageKeys?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    merchant?: Prisma.MerchantOrderByWithRelationInput;
    variants?: Prisma.VariantOrderByRelationAggregateInput;
};
export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ProductWhereInput | Prisma.ProductWhereInput[];
    OR?: Prisma.ProductWhereInput[];
    NOT?: Prisma.ProductWhereInput | Prisma.ProductWhereInput[];
    merchantId?: Prisma.StringFilter<"Product"> | string;
    name?: Prisma.StringFilter<"Product"> | string;
    description?: Prisma.StringNullableFilter<"Product"> | string | null;
    category?: Prisma.EnumProductCategoryFilter<"Product"> | $Enums.ProductCategory;
    attributes?: Prisma.JsonFilter<"Product">;
    imageKeys?: Prisma.StringNullableListFilter<"Product">;
    active?: Prisma.BoolFilter<"Product"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Product"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
    variants?: Prisma.VariantListRelationFilter;
}, "id">;
export type ProductOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrder;
    attributes?: Prisma.SortOrder;
    imageKeys?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProductCountOrderByAggregateInput;
    _max?: Prisma.ProductMaxOrderByAggregateInput;
    _min?: Prisma.ProductMinOrderByAggregateInput;
};
export type ProductScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProductScalarWhereWithAggregatesInput | Prisma.ProductScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProductScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProductScalarWhereWithAggregatesInput | Prisma.ProductScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Product"> | string;
    merchantId?: Prisma.StringWithAggregatesFilter<"Product"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Product"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Product"> | string | null;
    category?: Prisma.EnumProductCategoryWithAggregatesFilter<"Product"> | $Enums.ProductCategory;
    attributes?: Prisma.JsonWithAggregatesFilter<"Product">;
    imageKeys?: Prisma.StringNullableListFilter<"Product">;
    active?: Prisma.BoolWithAggregatesFilter<"Product"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Product"> | Date | string;
};
export type ProductCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutProductsInput;
    variants?: Prisma.VariantCreateNestedManyWithoutProductInput;
};
export type ProductUncheckedCreateInput = {
    id?: string;
    merchantId: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
    variants?: Prisma.VariantUncheckedCreateNestedManyWithoutProductInput;
};
export type ProductUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutProductsNestedInput;
    variants?: Prisma.VariantUpdateManyWithoutProductNestedInput;
};
export type ProductUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: Prisma.VariantUncheckedUpdateManyWithoutProductNestedInput;
};
export type ProductCreateManyInput = {
    id?: string;
    merchantId: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
};
export type ProductUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductListRelationFilter = {
    every?: Prisma.ProductWhereInput;
    some?: Prisma.ProductWhereInput;
    none?: Prisma.ProductWhereInput;
};
export type ProductOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type ProductCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    attributes?: Prisma.SortOrder;
    imageKeys?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    merchantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProductScalarRelationFilter = {
    is?: Prisma.ProductWhereInput;
    isNot?: Prisma.ProductWhereInput;
};
export type ProductCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.ProductCreateWithoutMerchantInput, Prisma.ProductUncheckedCreateWithoutMerchantInput> | Prisma.ProductCreateWithoutMerchantInput[] | Prisma.ProductUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ProductCreateOrConnectWithoutMerchantInput | Prisma.ProductCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.ProductCreateManyMerchantInputEnvelope;
    connect?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
};
export type ProductUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.ProductCreateWithoutMerchantInput, Prisma.ProductUncheckedCreateWithoutMerchantInput> | Prisma.ProductCreateWithoutMerchantInput[] | Prisma.ProductUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ProductCreateOrConnectWithoutMerchantInput | Prisma.ProductCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.ProductCreateManyMerchantInputEnvelope;
    connect?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
};
export type ProductUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.ProductCreateWithoutMerchantInput, Prisma.ProductUncheckedCreateWithoutMerchantInput> | Prisma.ProductCreateWithoutMerchantInput[] | Prisma.ProductUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ProductCreateOrConnectWithoutMerchantInput | Prisma.ProductCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.ProductUpsertWithWhereUniqueWithoutMerchantInput | Prisma.ProductUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.ProductCreateManyMerchantInputEnvelope;
    set?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    disconnect?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    delete?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    connect?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    update?: Prisma.ProductUpdateWithWhereUniqueWithoutMerchantInput | Prisma.ProductUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.ProductUpdateManyWithWhereWithoutMerchantInput | Prisma.ProductUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.ProductScalarWhereInput | Prisma.ProductScalarWhereInput[];
};
export type ProductUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.ProductCreateWithoutMerchantInput, Prisma.ProductUncheckedCreateWithoutMerchantInput> | Prisma.ProductCreateWithoutMerchantInput[] | Prisma.ProductUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.ProductCreateOrConnectWithoutMerchantInput | Prisma.ProductCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.ProductUpsertWithWhereUniqueWithoutMerchantInput | Prisma.ProductUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.ProductCreateManyMerchantInputEnvelope;
    set?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    disconnect?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    delete?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    connect?: Prisma.ProductWhereUniqueInput | Prisma.ProductWhereUniqueInput[];
    update?: Prisma.ProductUpdateWithWhereUniqueWithoutMerchantInput | Prisma.ProductUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.ProductUpdateManyWithWhereWithoutMerchantInput | Prisma.ProductUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.ProductScalarWhereInput | Prisma.ProductScalarWhereInput[];
};
export type ProductCreateimageKeysInput = {
    set: string[];
};
export type EnumProductCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ProductCategory;
};
export type ProductUpdateimageKeysInput = {
    set?: string[];
    push?: string | string[];
};
export type ProductCreateNestedOneWithoutVariantsInput = {
    create?: Prisma.XOR<Prisma.ProductCreateWithoutVariantsInput, Prisma.ProductUncheckedCreateWithoutVariantsInput>;
    connectOrCreate?: Prisma.ProductCreateOrConnectWithoutVariantsInput;
    connect?: Prisma.ProductWhereUniqueInput;
};
export type ProductUpdateOneRequiredWithoutVariantsNestedInput = {
    create?: Prisma.XOR<Prisma.ProductCreateWithoutVariantsInput, Prisma.ProductUncheckedCreateWithoutVariantsInput>;
    connectOrCreate?: Prisma.ProductCreateOrConnectWithoutVariantsInput;
    upsert?: Prisma.ProductUpsertWithoutVariantsInput;
    connect?: Prisma.ProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProductUpdateToOneWithWhereWithoutVariantsInput, Prisma.ProductUpdateWithoutVariantsInput>, Prisma.ProductUncheckedUpdateWithoutVariantsInput>;
};
export type ProductCreateWithoutMerchantInput = {
    id?: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
    variants?: Prisma.VariantCreateNestedManyWithoutProductInput;
};
export type ProductUncheckedCreateWithoutMerchantInput = {
    id?: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
    variants?: Prisma.VariantUncheckedCreateNestedManyWithoutProductInput;
};
export type ProductCreateOrConnectWithoutMerchantInput = {
    where: Prisma.ProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductCreateWithoutMerchantInput, Prisma.ProductUncheckedCreateWithoutMerchantInput>;
};
export type ProductCreateManyMerchantInputEnvelope = {
    data: Prisma.ProductCreateManyMerchantInput | Prisma.ProductCreateManyMerchantInput[];
    skipDuplicates?: boolean;
};
export type ProductUpsertWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.ProductWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProductUpdateWithoutMerchantInput, Prisma.ProductUncheckedUpdateWithoutMerchantInput>;
    create: Prisma.XOR<Prisma.ProductCreateWithoutMerchantInput, Prisma.ProductUncheckedCreateWithoutMerchantInput>;
};
export type ProductUpdateWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProductUpdateWithoutMerchantInput, Prisma.ProductUncheckedUpdateWithoutMerchantInput>;
};
export type ProductUpdateManyWithWhereWithoutMerchantInput = {
    where: Prisma.ProductScalarWhereInput;
    data: Prisma.XOR<Prisma.ProductUpdateManyMutationInput, Prisma.ProductUncheckedUpdateManyWithoutMerchantInput>;
};
export type ProductScalarWhereInput = {
    AND?: Prisma.ProductScalarWhereInput | Prisma.ProductScalarWhereInput[];
    OR?: Prisma.ProductScalarWhereInput[];
    NOT?: Prisma.ProductScalarWhereInput | Prisma.ProductScalarWhereInput[];
    id?: Prisma.StringFilter<"Product"> | string;
    merchantId?: Prisma.StringFilter<"Product"> | string;
    name?: Prisma.StringFilter<"Product"> | string;
    description?: Prisma.StringNullableFilter<"Product"> | string | null;
    category?: Prisma.EnumProductCategoryFilter<"Product"> | $Enums.ProductCategory;
    attributes?: Prisma.JsonFilter<"Product">;
    imageKeys?: Prisma.StringNullableListFilter<"Product">;
    active?: Prisma.BoolFilter<"Product"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Product"> | Date | string;
};
export type ProductCreateWithoutVariantsInput = {
    id?: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutProductsInput;
};
export type ProductUncheckedCreateWithoutVariantsInput = {
    id?: string;
    merchantId: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
};
export type ProductCreateOrConnectWithoutVariantsInput = {
    where: Prisma.ProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductCreateWithoutVariantsInput, Prisma.ProductUncheckedCreateWithoutVariantsInput>;
};
export type ProductUpsertWithoutVariantsInput = {
    update: Prisma.XOR<Prisma.ProductUpdateWithoutVariantsInput, Prisma.ProductUncheckedUpdateWithoutVariantsInput>;
    create: Prisma.XOR<Prisma.ProductCreateWithoutVariantsInput, Prisma.ProductUncheckedCreateWithoutVariantsInput>;
    where?: Prisma.ProductWhereInput;
};
export type ProductUpdateToOneWithWhereWithoutVariantsInput = {
    where?: Prisma.ProductWhereInput;
    data: Prisma.XOR<Prisma.ProductUpdateWithoutVariantsInput, Prisma.ProductUncheckedUpdateWithoutVariantsInput>;
};
export type ProductUpdateWithoutVariantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutProductsNestedInput;
};
export type ProductUncheckedUpdateWithoutVariantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductCreateManyMerchantInput = {
    id?: string;
    name: string;
    description?: string | null;
    category: $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductCreateimageKeysInput | string[];
    active?: boolean;
    createdAt?: Date | string;
};
export type ProductUpdateWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: Prisma.VariantUpdateManyWithoutProductNestedInput;
};
export type ProductUncheckedUpdateWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    variants?: Prisma.VariantUncheckedUpdateManyWithoutProductNestedInput;
};
export type ProductUncheckedUpdateManyWithoutMerchantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category?: Prisma.EnumProductCategoryFieldUpdateOperationsInput | $Enums.ProductCategory;
    attributes?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    imageKeys?: Prisma.ProductUpdateimageKeysInput | string[];
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductCountOutputType = {
    variants: number;
};
export type ProductCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    variants?: boolean | ProductCountOutputTypeCountVariantsArgs;
};
export type ProductCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductCountOutputTypeSelect<ExtArgs> | null;
};
export type ProductCountOutputTypeCountVariantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VariantWhereInput;
};
export type ProductSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    name?: boolean;
    description?: boolean;
    category?: boolean;
    attributes?: boolean;
    imageKeys?: boolean;
    active?: boolean;
    createdAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    variants?: boolean | Prisma.Product$variantsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["product"]>;
export type ProductSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    name?: boolean;
    description?: boolean;
    category?: boolean;
    attributes?: boolean;
    imageKeys?: boolean;
    active?: boolean;
    createdAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["product"]>;
export type ProductSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    merchantId?: boolean;
    name?: boolean;
    description?: boolean;
    category?: boolean;
    attributes?: boolean;
    imageKeys?: boolean;
    active?: boolean;
    createdAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["product"]>;
export type ProductSelectScalar = {
    id?: boolean;
    merchantId?: boolean;
    name?: boolean;
    description?: boolean;
    category?: boolean;
    attributes?: boolean;
    imageKeys?: boolean;
    active?: boolean;
    createdAt?: boolean;
};
export type ProductOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "merchantId" | "name" | "description" | "category" | "attributes" | "imageKeys" | "active" | "createdAt", ExtArgs["result"]["product"]>;
export type ProductInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
    variants?: boolean | Prisma.Product$variantsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ProductIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type ProductIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type $ProductPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Product";
    objects: {
        merchant: Prisma.$MerchantPayload<ExtArgs>;
        variants: Prisma.$VariantPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        merchantId: string;
        name: string;
        description: string | null;
        category: $Enums.ProductCategory;
        attributes: runtime.JsonValue;
        imageKeys: string[];
        active: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["product"]>;
    composites: {};
};
export type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProductPayload, S>;
export type ProductCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductCountAggregateInputType | true;
};
export interface ProductDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Product'];
        meta: {
            name: 'Product';
        };
    };
    findUnique<T extends ProductFindUniqueArgs>(args: Prisma.SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProductFindFirstArgs>(args?: Prisma.SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProductFindManyArgs>(args?: Prisma.SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProductCreateArgs>(args: Prisma.SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProductCreateManyArgs>(args?: Prisma.SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProductDeleteArgs>(args: Prisma.SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProductUpdateArgs>(args: Prisma.SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProductDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProductUpdateManyArgs>(args: Prisma.SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProductUpsertArgs>(args: Prisma.SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProductCountArgs>(args?: Prisma.Subset<T, ProductCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductCountAggregateOutputType> : number>;
    aggregate<T extends ProductAggregateArgs>(args: Prisma.Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>;
    groupBy<T extends ProductGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProductGroupByArgs['orderBy'];
    } : {
        orderBy?: ProductGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProductFieldRefs;
}
export interface Prisma__ProductClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    merchant<T extends Prisma.MerchantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MerchantDefaultArgs<ExtArgs>>): Prisma.Prisma__MerchantClient<runtime.Types.Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    variants<T extends Prisma.Product$variantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Product$variantsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProductFieldRefs {
    readonly id: Prisma.FieldRef<"Product", 'String'>;
    readonly merchantId: Prisma.FieldRef<"Product", 'String'>;
    readonly name: Prisma.FieldRef<"Product", 'String'>;
    readonly description: Prisma.FieldRef<"Product", 'String'>;
    readonly category: Prisma.FieldRef<"Product", 'ProductCategory'>;
    readonly attributes: Prisma.FieldRef<"Product", 'Json'>;
    readonly imageKeys: Prisma.FieldRef<"Product", 'String[]'>;
    readonly active: Prisma.FieldRef<"Product", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Product", 'DateTime'>;
}
export type ProductFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where: Prisma.ProductWhereUniqueInput;
};
export type ProductFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where: Prisma.ProductWhereUniqueInput;
};
export type ProductFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
    cursor?: Prisma.ProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductScalarFieldEnum | Prisma.ProductScalarFieldEnum[];
};
export type ProductFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
    cursor?: Prisma.ProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductScalarFieldEnum | Prisma.ProductScalarFieldEnum[];
};
export type ProductFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
    cursor?: Prisma.ProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductScalarFieldEnum | Prisma.ProductScalarFieldEnum[];
};
export type ProductCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductCreateInput, Prisma.ProductUncheckedCreateInput>;
};
export type ProductCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProductCreateManyInput | Prisma.ProductCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    data: Prisma.ProductCreateManyInput | Prisma.ProductCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProductIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProductUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductUpdateInput, Prisma.ProductUncheckedUpdateInput>;
    where: Prisma.ProductWhereUniqueInput;
};
export type ProductUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProductUpdateManyMutationInput, Prisma.ProductUncheckedUpdateManyInput>;
    where?: Prisma.ProductWhereInput;
    limit?: number;
};
export type ProductUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductUpdateManyMutationInput, Prisma.ProductUncheckedUpdateManyInput>;
    where?: Prisma.ProductWhereInput;
    limit?: number;
    include?: Prisma.ProductIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProductUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where: Prisma.ProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductCreateInput, Prisma.ProductUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProductUpdateInput, Prisma.ProductUncheckedUpdateInput>;
};
export type ProductDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where: Prisma.ProductWhereUniqueInput;
};
export type ProductDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductWhereInput;
    limit?: number;
};
export type Product$variantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProductDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
};
