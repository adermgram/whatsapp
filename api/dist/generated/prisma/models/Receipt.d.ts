import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReceiptModel = runtime.Types.Result.DefaultSelection<Prisma.$ReceiptPayload>;
export type AggregateReceipt = {
    _count: ReceiptCountAggregateOutputType | null;
    _min: ReceiptMinAggregateOutputType | null;
    _max: ReceiptMaxAggregateOutputType | null;
};
export type ReceiptMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    number: string | null;
    fileKey: string | null;
    createdAt: Date | null;
};
export type ReceiptMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    number: string | null;
    fileKey: string | null;
    createdAt: Date | null;
};
export type ReceiptCountAggregateOutputType = {
    id: number;
    orderId: number;
    number: number;
    fileKey: number;
    createdAt: number;
    _all: number;
};
export type ReceiptMinAggregateInputType = {
    id?: true;
    orderId?: true;
    number?: true;
    fileKey?: true;
    createdAt?: true;
};
export type ReceiptMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    number?: true;
    fileKey?: true;
    createdAt?: true;
};
export type ReceiptCountAggregateInputType = {
    id?: true;
    orderId?: true;
    number?: true;
    fileKey?: true;
    createdAt?: true;
    _all?: true;
};
export type ReceiptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceiptWhereInput;
    orderBy?: Prisma.ReceiptOrderByWithRelationInput | Prisma.ReceiptOrderByWithRelationInput[];
    cursor?: Prisma.ReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReceiptCountAggregateInputType;
    _min?: ReceiptMinAggregateInputType;
    _max?: ReceiptMaxAggregateInputType;
};
export type GetReceiptAggregateType<T extends ReceiptAggregateArgs> = {
    [P in keyof T & keyof AggregateReceipt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReceipt[P]> : Prisma.GetScalarType<T[P], AggregateReceipt[P]>;
};
export type ReceiptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceiptWhereInput;
    orderBy?: Prisma.ReceiptOrderByWithAggregationInput | Prisma.ReceiptOrderByWithAggregationInput[];
    by: Prisma.ReceiptScalarFieldEnum[] | Prisma.ReceiptScalarFieldEnum;
    having?: Prisma.ReceiptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReceiptCountAggregateInputType | true;
    _min?: ReceiptMinAggregateInputType;
    _max?: ReceiptMaxAggregateInputType;
};
export type ReceiptGroupByOutputType = {
    id: string;
    orderId: string;
    number: string;
    fileKey: string;
    createdAt: Date;
    _count: ReceiptCountAggregateOutputType | null;
    _min: ReceiptMinAggregateOutputType | null;
    _max: ReceiptMaxAggregateOutputType | null;
};
export type GetReceiptGroupByPayload<T extends ReceiptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReceiptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReceiptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReceiptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReceiptGroupByOutputType[P]>;
}>>;
export type ReceiptWhereInput = {
    AND?: Prisma.ReceiptWhereInput | Prisma.ReceiptWhereInput[];
    OR?: Prisma.ReceiptWhereInput[];
    NOT?: Prisma.ReceiptWhereInput | Prisma.ReceiptWhereInput[];
    id?: Prisma.StringFilter<"Receipt"> | string;
    orderId?: Prisma.StringFilter<"Receipt"> | string;
    number?: Prisma.StringFilter<"Receipt"> | string;
    fileKey?: Prisma.StringFilter<"Receipt"> | string;
    createdAt?: Prisma.DateTimeFilter<"Receipt"> | Date | string;
    order?: Prisma.XOR<Prisma.OrderScalarRelationFilter, Prisma.OrderWhereInput>;
};
export type ReceiptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    fileKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    order?: Prisma.OrderOrderByWithRelationInput;
};
export type ReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    orderId?: string;
    AND?: Prisma.ReceiptWhereInput | Prisma.ReceiptWhereInput[];
    OR?: Prisma.ReceiptWhereInput[];
    NOT?: Prisma.ReceiptWhereInput | Prisma.ReceiptWhereInput[];
    number?: Prisma.StringFilter<"Receipt"> | string;
    fileKey?: Prisma.StringFilter<"Receipt"> | string;
    createdAt?: Prisma.DateTimeFilter<"Receipt"> | Date | string;
    order?: Prisma.XOR<Prisma.OrderScalarRelationFilter, Prisma.OrderWhereInput>;
}, "id" | "orderId">;
export type ReceiptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    fileKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ReceiptCountOrderByAggregateInput;
    _max?: Prisma.ReceiptMaxOrderByAggregateInput;
    _min?: Prisma.ReceiptMinOrderByAggregateInput;
};
export type ReceiptScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReceiptScalarWhereWithAggregatesInput | Prisma.ReceiptScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReceiptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReceiptScalarWhereWithAggregatesInput | Prisma.ReceiptScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Receipt"> | string;
    orderId?: Prisma.StringWithAggregatesFilter<"Receipt"> | string;
    number?: Prisma.StringWithAggregatesFilter<"Receipt"> | string;
    fileKey?: Prisma.StringWithAggregatesFilter<"Receipt"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Receipt"> | Date | string;
};
export type ReceiptCreateInput = {
    id?: string;
    number: string;
    fileKey: string;
    createdAt?: Date | string;
    order: Prisma.OrderCreateNestedOneWithoutReceiptInput;
};
export type ReceiptUncheckedCreateInput = {
    id?: string;
    orderId: string;
    number: string;
    fileKey: string;
    createdAt?: Date | string;
};
export type ReceiptUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    fileKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    order?: Prisma.OrderUpdateOneRequiredWithoutReceiptNestedInput;
};
export type ReceiptUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    fileKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceiptCreateManyInput = {
    id?: string;
    orderId: string;
    number: string;
    fileKey: string;
    createdAt?: Date | string;
};
export type ReceiptUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    fileKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceiptUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    fileKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceiptNullableScalarRelationFilter = {
    is?: Prisma.ReceiptWhereInput | null;
    isNot?: Prisma.ReceiptWhereInput | null;
};
export type ReceiptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    fileKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReceiptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    fileKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReceiptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    fileKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReceiptCreateNestedOneWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.ReceiptCreateWithoutOrderInput, Prisma.ReceiptUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.ReceiptCreateOrConnectWithoutOrderInput;
    connect?: Prisma.ReceiptWhereUniqueInput;
};
export type ReceiptUncheckedCreateNestedOneWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.ReceiptCreateWithoutOrderInput, Prisma.ReceiptUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.ReceiptCreateOrConnectWithoutOrderInput;
    connect?: Prisma.ReceiptWhereUniqueInput;
};
export type ReceiptUpdateOneWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.ReceiptCreateWithoutOrderInput, Prisma.ReceiptUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.ReceiptCreateOrConnectWithoutOrderInput;
    upsert?: Prisma.ReceiptUpsertWithoutOrderInput;
    disconnect?: Prisma.ReceiptWhereInput | boolean;
    delete?: Prisma.ReceiptWhereInput | boolean;
    connect?: Prisma.ReceiptWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReceiptUpdateToOneWithWhereWithoutOrderInput, Prisma.ReceiptUpdateWithoutOrderInput>, Prisma.ReceiptUncheckedUpdateWithoutOrderInput>;
};
export type ReceiptUncheckedUpdateOneWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.ReceiptCreateWithoutOrderInput, Prisma.ReceiptUncheckedCreateWithoutOrderInput>;
    connectOrCreate?: Prisma.ReceiptCreateOrConnectWithoutOrderInput;
    upsert?: Prisma.ReceiptUpsertWithoutOrderInput;
    disconnect?: Prisma.ReceiptWhereInput | boolean;
    delete?: Prisma.ReceiptWhereInput | boolean;
    connect?: Prisma.ReceiptWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReceiptUpdateToOneWithWhereWithoutOrderInput, Prisma.ReceiptUpdateWithoutOrderInput>, Prisma.ReceiptUncheckedUpdateWithoutOrderInput>;
};
export type ReceiptCreateWithoutOrderInput = {
    id?: string;
    number: string;
    fileKey: string;
    createdAt?: Date | string;
};
export type ReceiptUncheckedCreateWithoutOrderInput = {
    id?: string;
    number: string;
    fileKey: string;
    createdAt?: Date | string;
};
export type ReceiptCreateOrConnectWithoutOrderInput = {
    where: Prisma.ReceiptWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceiptCreateWithoutOrderInput, Prisma.ReceiptUncheckedCreateWithoutOrderInput>;
};
export type ReceiptUpsertWithoutOrderInput = {
    update: Prisma.XOR<Prisma.ReceiptUpdateWithoutOrderInput, Prisma.ReceiptUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.ReceiptCreateWithoutOrderInput, Prisma.ReceiptUncheckedCreateWithoutOrderInput>;
    where?: Prisma.ReceiptWhereInput;
};
export type ReceiptUpdateToOneWithWhereWithoutOrderInput = {
    where?: Prisma.ReceiptWhereInput;
    data: Prisma.XOR<Prisma.ReceiptUpdateWithoutOrderInput, Prisma.ReceiptUncheckedUpdateWithoutOrderInput>;
};
export type ReceiptUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    fileKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceiptUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    fileKey?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReceiptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    number?: boolean;
    fileKey?: boolean;
    createdAt?: boolean;
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["receipt"]>;
export type ReceiptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    number?: boolean;
    fileKey?: boolean;
    createdAt?: boolean;
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["receipt"]>;
export type ReceiptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    number?: boolean;
    fileKey?: boolean;
    createdAt?: boolean;
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["receipt"]>;
export type ReceiptSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    number?: boolean;
    fileKey?: boolean;
    createdAt?: boolean;
};
export type ReceiptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderId" | "number" | "fileKey" | "createdAt", ExtArgs["result"]["receipt"]>;
export type ReceiptInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
};
export type ReceiptIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
};
export type ReceiptIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
};
export type $ReceiptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Receipt";
    objects: {
        order: Prisma.$OrderPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orderId: string;
        number: string;
        fileKey: string;
        createdAt: Date;
    }, ExtArgs["result"]["receipt"]>;
    composites: {};
};
export type ReceiptGetPayload<S extends boolean | null | undefined | ReceiptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReceiptPayload, S>;
export type ReceiptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReceiptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReceiptCountAggregateInputType | true;
};
export interface ReceiptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Receipt'];
        meta: {
            name: 'Receipt';
        };
    };
    findUnique<T extends ReceiptFindUniqueArgs>(args: Prisma.SelectSubset<T, ReceiptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReceiptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReceiptFindFirstArgs>(args?: Prisma.SelectSubset<T, ReceiptFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReceiptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReceiptFindManyArgs>(args?: Prisma.SelectSubset<T, ReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReceiptCreateArgs>(args: Prisma.SelectSubset<T, ReceiptCreateArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReceiptCreateManyArgs>(args?: Prisma.SelectSubset<T, ReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReceiptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReceiptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReceiptDeleteArgs>(args: Prisma.SelectSubset<T, ReceiptDeleteArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReceiptUpdateArgs>(args: Prisma.SelectSubset<T, ReceiptUpdateArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReceiptDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReceiptUpdateManyArgs>(args: Prisma.SelectSubset<T, ReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReceiptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReceiptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReceiptUpsertArgs>(args: Prisma.SelectSubset<T, ReceiptUpsertArgs<ExtArgs>>): Prisma.Prisma__ReceiptClient<runtime.Types.Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReceiptCountArgs>(args?: Prisma.Subset<T, ReceiptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReceiptCountAggregateOutputType> : number>;
    aggregate<T extends ReceiptAggregateArgs>(args: Prisma.Subset<T, ReceiptAggregateArgs>): Prisma.PrismaPromise<GetReceiptAggregateType<T>>;
    groupBy<T extends ReceiptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReceiptGroupByArgs['orderBy'];
    } : {
        orderBy?: ReceiptGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReceiptFieldRefs;
}
export interface Prisma__ReceiptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    order<T extends Prisma.OrderDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrderDefaultArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReceiptFieldRefs {
    readonly id: Prisma.FieldRef<"Receipt", 'String'>;
    readonly orderId: Prisma.FieldRef<"Receipt", 'String'>;
    readonly number: Prisma.FieldRef<"Receipt", 'String'>;
    readonly fileKey: Prisma.FieldRef<"Receipt", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Receipt", 'DateTime'>;
}
export type ReceiptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where: Prisma.ReceiptWhereUniqueInput;
};
export type ReceiptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where: Prisma.ReceiptWhereUniqueInput;
};
export type ReceiptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where?: Prisma.ReceiptWhereInput;
    orderBy?: Prisma.ReceiptOrderByWithRelationInput | Prisma.ReceiptOrderByWithRelationInput[];
    cursor?: Prisma.ReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceiptScalarFieldEnum | Prisma.ReceiptScalarFieldEnum[];
};
export type ReceiptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where?: Prisma.ReceiptWhereInput;
    orderBy?: Prisma.ReceiptOrderByWithRelationInput | Prisma.ReceiptOrderByWithRelationInput[];
    cursor?: Prisma.ReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceiptScalarFieldEnum | Prisma.ReceiptScalarFieldEnum[];
};
export type ReceiptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where?: Prisma.ReceiptWhereInput;
    orderBy?: Prisma.ReceiptOrderByWithRelationInput | Prisma.ReceiptOrderByWithRelationInput[];
    cursor?: Prisma.ReceiptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReceiptScalarFieldEnum | Prisma.ReceiptScalarFieldEnum[];
};
export type ReceiptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceiptCreateInput, Prisma.ReceiptUncheckedCreateInput>;
};
export type ReceiptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReceiptCreateManyInput | Prisma.ReceiptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReceiptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    data: Prisma.ReceiptCreateManyInput | Prisma.ReceiptCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReceiptIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReceiptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceiptUpdateInput, Prisma.ReceiptUncheckedUpdateInput>;
    where: Prisma.ReceiptWhereUniqueInput;
};
export type ReceiptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReceiptUpdateManyMutationInput, Prisma.ReceiptUncheckedUpdateManyInput>;
    where?: Prisma.ReceiptWhereInput;
    limit?: number;
};
export type ReceiptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReceiptUpdateManyMutationInput, Prisma.ReceiptUncheckedUpdateManyInput>;
    where?: Prisma.ReceiptWhereInput;
    limit?: number;
    include?: Prisma.ReceiptIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReceiptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where: Prisma.ReceiptWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReceiptCreateInput, Prisma.ReceiptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReceiptUpdateInput, Prisma.ReceiptUncheckedUpdateInput>;
};
export type ReceiptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
    where: Prisma.ReceiptWhereUniqueInput;
};
export type ReceiptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReceiptWhereInput;
    limit?: number;
};
export type ReceiptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReceiptSelect<ExtArgs> | null;
    omit?: Prisma.ReceiptOmit<ExtArgs> | null;
    include?: Prisma.ReceiptInclude<ExtArgs> | null;
};
