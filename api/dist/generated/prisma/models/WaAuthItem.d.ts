import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WaAuthItemModel = runtime.Types.Result.DefaultSelection<Prisma.$WaAuthItemPayload>;
export type AggregateWaAuthItem = {
    _count: WaAuthItemCountAggregateOutputType | null;
    _min: WaAuthItemMinAggregateOutputType | null;
    _max: WaAuthItemMaxAggregateOutputType | null;
};
export type WaAuthItemMinAggregateOutputType = {
    merchantId: string | null;
    key: string | null;
    value: string | null;
};
export type WaAuthItemMaxAggregateOutputType = {
    merchantId: string | null;
    key: string | null;
    value: string | null;
};
export type WaAuthItemCountAggregateOutputType = {
    merchantId: number;
    key: number;
    value: number;
    _all: number;
};
export type WaAuthItemMinAggregateInputType = {
    merchantId?: true;
    key?: true;
    value?: true;
};
export type WaAuthItemMaxAggregateInputType = {
    merchantId?: true;
    key?: true;
    value?: true;
};
export type WaAuthItemCountAggregateInputType = {
    merchantId?: true;
    key?: true;
    value?: true;
    _all?: true;
};
export type WaAuthItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WaAuthItemWhereInput;
    orderBy?: Prisma.WaAuthItemOrderByWithRelationInput | Prisma.WaAuthItemOrderByWithRelationInput[];
    cursor?: Prisma.WaAuthItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WaAuthItemCountAggregateInputType;
    _min?: WaAuthItemMinAggregateInputType;
    _max?: WaAuthItemMaxAggregateInputType;
};
export type GetWaAuthItemAggregateType<T extends WaAuthItemAggregateArgs> = {
    [P in keyof T & keyof AggregateWaAuthItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWaAuthItem[P]> : Prisma.GetScalarType<T[P], AggregateWaAuthItem[P]>;
};
export type WaAuthItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WaAuthItemWhereInput;
    orderBy?: Prisma.WaAuthItemOrderByWithAggregationInput | Prisma.WaAuthItemOrderByWithAggregationInput[];
    by: Prisma.WaAuthItemScalarFieldEnum[] | Prisma.WaAuthItemScalarFieldEnum;
    having?: Prisma.WaAuthItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WaAuthItemCountAggregateInputType | true;
    _min?: WaAuthItemMinAggregateInputType;
    _max?: WaAuthItemMaxAggregateInputType;
};
export type WaAuthItemGroupByOutputType = {
    merchantId: string;
    key: string;
    value: string;
    _count: WaAuthItemCountAggregateOutputType | null;
    _min: WaAuthItemMinAggregateOutputType | null;
    _max: WaAuthItemMaxAggregateOutputType | null;
};
export type GetWaAuthItemGroupByPayload<T extends WaAuthItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WaAuthItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WaAuthItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WaAuthItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WaAuthItemGroupByOutputType[P]>;
}>>;
export type WaAuthItemWhereInput = {
    AND?: Prisma.WaAuthItemWhereInput | Prisma.WaAuthItemWhereInput[];
    OR?: Prisma.WaAuthItemWhereInput[];
    NOT?: Prisma.WaAuthItemWhereInput | Prisma.WaAuthItemWhereInput[];
    merchantId?: Prisma.StringFilter<"WaAuthItem"> | string;
    key?: Prisma.StringFilter<"WaAuthItem"> | string;
    value?: Prisma.StringFilter<"WaAuthItem"> | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
};
export type WaAuthItemOrderByWithRelationInput = {
    merchantId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    merchant?: Prisma.MerchantOrderByWithRelationInput;
};
export type WaAuthItemWhereUniqueInput = Prisma.AtLeast<{
    merchantId_key?: Prisma.WaAuthItemMerchantIdKeyCompoundUniqueInput;
    AND?: Prisma.WaAuthItemWhereInput | Prisma.WaAuthItemWhereInput[];
    OR?: Prisma.WaAuthItemWhereInput[];
    NOT?: Prisma.WaAuthItemWhereInput | Prisma.WaAuthItemWhereInput[];
    merchantId?: Prisma.StringFilter<"WaAuthItem"> | string;
    key?: Prisma.StringFilter<"WaAuthItem"> | string;
    value?: Prisma.StringFilter<"WaAuthItem"> | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
}, "merchantId_key">;
export type WaAuthItemOrderByWithAggregationInput = {
    merchantId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    _count?: Prisma.WaAuthItemCountOrderByAggregateInput;
    _max?: Prisma.WaAuthItemMaxOrderByAggregateInput;
    _min?: Prisma.WaAuthItemMinOrderByAggregateInput;
};
export type WaAuthItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.WaAuthItemScalarWhereWithAggregatesInput | Prisma.WaAuthItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.WaAuthItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WaAuthItemScalarWhereWithAggregatesInput | Prisma.WaAuthItemScalarWhereWithAggregatesInput[];
    merchantId?: Prisma.StringWithAggregatesFilter<"WaAuthItem"> | string;
    key?: Prisma.StringWithAggregatesFilter<"WaAuthItem"> | string;
    value?: Prisma.StringWithAggregatesFilter<"WaAuthItem"> | string;
};
export type WaAuthItemCreateInput = {
    key: string;
    value: string;
    merchant: Prisma.MerchantCreateNestedOneWithoutAuthItemsInput;
};
export type WaAuthItemUncheckedCreateInput = {
    merchantId: string;
    key: string;
    value: string;
};
export type WaAuthItemUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutAuthItemsNestedInput;
};
export type WaAuthItemUncheckedUpdateInput = {
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type WaAuthItemCreateManyInput = {
    merchantId: string;
    key: string;
    value: string;
};
export type WaAuthItemUpdateManyMutationInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type WaAuthItemUncheckedUpdateManyInput = {
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type WaAuthItemListRelationFilter = {
    every?: Prisma.WaAuthItemWhereInput;
    some?: Prisma.WaAuthItemWhereInput;
    none?: Prisma.WaAuthItemWhereInput;
};
export type WaAuthItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WaAuthItemMerchantIdKeyCompoundUniqueInput = {
    merchantId: string;
    key: string;
};
export type WaAuthItemCountOrderByAggregateInput = {
    merchantId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
};
export type WaAuthItemMaxOrderByAggregateInput = {
    merchantId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
};
export type WaAuthItemMinOrderByAggregateInput = {
    merchantId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
};
export type WaAuthItemCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.WaAuthItemCreateWithoutMerchantInput, Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput> | Prisma.WaAuthItemCreateWithoutMerchantInput[] | Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput | Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.WaAuthItemCreateManyMerchantInputEnvelope;
    connect?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
};
export type WaAuthItemUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.WaAuthItemCreateWithoutMerchantInput, Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput> | Prisma.WaAuthItemCreateWithoutMerchantInput[] | Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput | Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput[];
    createMany?: Prisma.WaAuthItemCreateManyMerchantInputEnvelope;
    connect?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
};
export type WaAuthItemUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.WaAuthItemCreateWithoutMerchantInput, Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput> | Prisma.WaAuthItemCreateWithoutMerchantInput[] | Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput | Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.WaAuthItemUpsertWithWhereUniqueWithoutMerchantInput | Prisma.WaAuthItemUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.WaAuthItemCreateManyMerchantInputEnvelope;
    set?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    disconnect?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    delete?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    connect?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    update?: Prisma.WaAuthItemUpdateWithWhereUniqueWithoutMerchantInput | Prisma.WaAuthItemUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.WaAuthItemUpdateManyWithWhereWithoutMerchantInput | Prisma.WaAuthItemUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.WaAuthItemScalarWhereInput | Prisma.WaAuthItemScalarWhereInput[];
};
export type WaAuthItemUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.WaAuthItemCreateWithoutMerchantInput, Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput> | Prisma.WaAuthItemCreateWithoutMerchantInput[] | Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput[];
    connectOrCreate?: Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput | Prisma.WaAuthItemCreateOrConnectWithoutMerchantInput[];
    upsert?: Prisma.WaAuthItemUpsertWithWhereUniqueWithoutMerchantInput | Prisma.WaAuthItemUpsertWithWhereUniqueWithoutMerchantInput[];
    createMany?: Prisma.WaAuthItemCreateManyMerchantInputEnvelope;
    set?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    disconnect?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    delete?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    connect?: Prisma.WaAuthItemWhereUniqueInput | Prisma.WaAuthItemWhereUniqueInput[];
    update?: Prisma.WaAuthItemUpdateWithWhereUniqueWithoutMerchantInput | Prisma.WaAuthItemUpdateWithWhereUniqueWithoutMerchantInput[];
    updateMany?: Prisma.WaAuthItemUpdateManyWithWhereWithoutMerchantInput | Prisma.WaAuthItemUpdateManyWithWhereWithoutMerchantInput[];
    deleteMany?: Prisma.WaAuthItemScalarWhereInput | Prisma.WaAuthItemScalarWhereInput[];
};
export type WaAuthItemCreateWithoutMerchantInput = {
    key: string;
    value: string;
};
export type WaAuthItemUncheckedCreateWithoutMerchantInput = {
    key: string;
    value: string;
};
export type WaAuthItemCreateOrConnectWithoutMerchantInput = {
    where: Prisma.WaAuthItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.WaAuthItemCreateWithoutMerchantInput, Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput>;
};
export type WaAuthItemCreateManyMerchantInputEnvelope = {
    data: Prisma.WaAuthItemCreateManyMerchantInput | Prisma.WaAuthItemCreateManyMerchantInput[];
    skipDuplicates?: boolean;
};
export type WaAuthItemUpsertWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.WaAuthItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.WaAuthItemUpdateWithoutMerchantInput, Prisma.WaAuthItemUncheckedUpdateWithoutMerchantInput>;
    create: Prisma.XOR<Prisma.WaAuthItemCreateWithoutMerchantInput, Prisma.WaAuthItemUncheckedCreateWithoutMerchantInput>;
};
export type WaAuthItemUpdateWithWhereUniqueWithoutMerchantInput = {
    where: Prisma.WaAuthItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.WaAuthItemUpdateWithoutMerchantInput, Prisma.WaAuthItemUncheckedUpdateWithoutMerchantInput>;
};
export type WaAuthItemUpdateManyWithWhereWithoutMerchantInput = {
    where: Prisma.WaAuthItemScalarWhereInput;
    data: Prisma.XOR<Prisma.WaAuthItemUpdateManyMutationInput, Prisma.WaAuthItemUncheckedUpdateManyWithoutMerchantInput>;
};
export type WaAuthItemScalarWhereInput = {
    AND?: Prisma.WaAuthItemScalarWhereInput | Prisma.WaAuthItemScalarWhereInput[];
    OR?: Prisma.WaAuthItemScalarWhereInput[];
    NOT?: Prisma.WaAuthItemScalarWhereInput | Prisma.WaAuthItemScalarWhereInput[];
    merchantId?: Prisma.StringFilter<"WaAuthItem"> | string;
    key?: Prisma.StringFilter<"WaAuthItem"> | string;
    value?: Prisma.StringFilter<"WaAuthItem"> | string;
};
export type WaAuthItemCreateManyMerchantInput = {
    key: string;
    value: string;
};
export type WaAuthItemUpdateWithoutMerchantInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type WaAuthItemUncheckedUpdateWithoutMerchantInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type WaAuthItemUncheckedUpdateManyWithoutMerchantInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type WaAuthItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    merchantId?: boolean;
    key?: boolean;
    value?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["waAuthItem"]>;
export type WaAuthItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    merchantId?: boolean;
    key?: boolean;
    value?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["waAuthItem"]>;
export type WaAuthItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    merchantId?: boolean;
    key?: boolean;
    value?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["waAuthItem"]>;
export type WaAuthItemSelectScalar = {
    merchantId?: boolean;
    key?: boolean;
    value?: boolean;
};
export type WaAuthItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"merchantId" | "key" | "value", ExtArgs["result"]["waAuthItem"]>;
export type WaAuthItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type WaAuthItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type WaAuthItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type $WaAuthItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WaAuthItem";
    objects: {
        merchant: Prisma.$MerchantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        merchantId: string;
        key: string;
        value: string;
    }, ExtArgs["result"]["waAuthItem"]>;
    composites: {};
};
export type WaAuthItemGetPayload<S extends boolean | null | undefined | WaAuthItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload, S>;
export type WaAuthItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WaAuthItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WaAuthItemCountAggregateInputType | true;
};
export interface WaAuthItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WaAuthItem'];
        meta: {
            name: 'WaAuthItem';
        };
    };
    findUnique<T extends WaAuthItemFindUniqueArgs>(args: Prisma.SelectSubset<T, WaAuthItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WaAuthItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WaAuthItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WaAuthItemFindFirstArgs>(args?: Prisma.SelectSubset<T, WaAuthItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WaAuthItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WaAuthItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WaAuthItemFindManyArgs>(args?: Prisma.SelectSubset<T, WaAuthItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WaAuthItemCreateArgs>(args: Prisma.SelectSubset<T, WaAuthItemCreateArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WaAuthItemCreateManyArgs>(args?: Prisma.SelectSubset<T, WaAuthItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WaAuthItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WaAuthItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WaAuthItemDeleteArgs>(args: Prisma.SelectSubset<T, WaAuthItemDeleteArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WaAuthItemUpdateArgs>(args: Prisma.SelectSubset<T, WaAuthItemUpdateArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WaAuthItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, WaAuthItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WaAuthItemUpdateManyArgs>(args: Prisma.SelectSubset<T, WaAuthItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WaAuthItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WaAuthItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WaAuthItemUpsertArgs>(args: Prisma.SelectSubset<T, WaAuthItemUpsertArgs<ExtArgs>>): Prisma.Prisma__WaAuthItemClient<runtime.Types.Result.GetResult<Prisma.$WaAuthItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WaAuthItemCountArgs>(args?: Prisma.Subset<T, WaAuthItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WaAuthItemCountAggregateOutputType> : number>;
    aggregate<T extends WaAuthItemAggregateArgs>(args: Prisma.Subset<T, WaAuthItemAggregateArgs>): Prisma.PrismaPromise<GetWaAuthItemAggregateType<T>>;
    groupBy<T extends WaAuthItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WaAuthItemGroupByArgs['orderBy'];
    } : {
        orderBy?: WaAuthItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WaAuthItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWaAuthItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WaAuthItemFieldRefs;
}
export interface Prisma__WaAuthItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    merchant<T extends Prisma.MerchantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MerchantDefaultArgs<ExtArgs>>): Prisma.Prisma__MerchantClient<runtime.Types.Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WaAuthItemFieldRefs {
    readonly merchantId: Prisma.FieldRef<"WaAuthItem", 'String'>;
    readonly key: Prisma.FieldRef<"WaAuthItem", 'String'>;
    readonly value: Prisma.FieldRef<"WaAuthItem", 'String'>;
}
export type WaAuthItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where: Prisma.WaAuthItemWhereUniqueInput;
};
export type WaAuthItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where: Prisma.WaAuthItemWhereUniqueInput;
};
export type WaAuthItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where?: Prisma.WaAuthItemWhereInput;
    orderBy?: Prisma.WaAuthItemOrderByWithRelationInput | Prisma.WaAuthItemOrderByWithRelationInput[];
    cursor?: Prisma.WaAuthItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WaAuthItemScalarFieldEnum | Prisma.WaAuthItemScalarFieldEnum[];
};
export type WaAuthItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where?: Prisma.WaAuthItemWhereInput;
    orderBy?: Prisma.WaAuthItemOrderByWithRelationInput | Prisma.WaAuthItemOrderByWithRelationInput[];
    cursor?: Prisma.WaAuthItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WaAuthItemScalarFieldEnum | Prisma.WaAuthItemScalarFieldEnum[];
};
export type WaAuthItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where?: Prisma.WaAuthItemWhereInput;
    orderBy?: Prisma.WaAuthItemOrderByWithRelationInput | Prisma.WaAuthItemOrderByWithRelationInput[];
    cursor?: Prisma.WaAuthItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WaAuthItemScalarFieldEnum | Prisma.WaAuthItemScalarFieldEnum[];
};
export type WaAuthItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WaAuthItemCreateInput, Prisma.WaAuthItemUncheckedCreateInput>;
};
export type WaAuthItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WaAuthItemCreateManyInput | Prisma.WaAuthItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WaAuthItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    data: Prisma.WaAuthItemCreateManyInput | Prisma.WaAuthItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WaAuthItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WaAuthItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WaAuthItemUpdateInput, Prisma.WaAuthItemUncheckedUpdateInput>;
    where: Prisma.WaAuthItemWhereUniqueInput;
};
export type WaAuthItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WaAuthItemUpdateManyMutationInput, Prisma.WaAuthItemUncheckedUpdateManyInput>;
    where?: Prisma.WaAuthItemWhereInput;
    limit?: number;
};
export type WaAuthItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WaAuthItemUpdateManyMutationInput, Prisma.WaAuthItemUncheckedUpdateManyInput>;
    where?: Prisma.WaAuthItemWhereInput;
    limit?: number;
    include?: Prisma.WaAuthItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WaAuthItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where: Prisma.WaAuthItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.WaAuthItemCreateInput, Prisma.WaAuthItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WaAuthItemUpdateInput, Prisma.WaAuthItemUncheckedUpdateInput>;
};
export type WaAuthItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
    where: Prisma.WaAuthItemWhereUniqueInput;
};
export type WaAuthItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WaAuthItemWhereInput;
    limit?: number;
};
export type WaAuthItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WaAuthItemSelect<ExtArgs> | null;
    omit?: Prisma.WaAuthItemOmit<ExtArgs> | null;
    include?: Prisma.WaAuthItemInclude<ExtArgs> | null;
};
