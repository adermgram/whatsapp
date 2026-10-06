import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WhatsAppSessionModel = runtime.Types.Result.DefaultSelection<Prisma.$WhatsAppSessionPayload>;
export type AggregateWhatsAppSession = {
    _count: WhatsAppSessionCountAggregateOutputType | null;
    _min: WhatsAppSessionMinAggregateOutputType | null;
    _max: WhatsAppSessionMaxAggregateOutputType | null;
};
export type WhatsAppSessionMinAggregateOutputType = {
    merchantId: string | null;
    status: $Enums.SessionStatus | null;
    phone: string | null;
    qr: string | null;
    updatedAt: Date | null;
};
export type WhatsAppSessionMaxAggregateOutputType = {
    merchantId: string | null;
    status: $Enums.SessionStatus | null;
    phone: string | null;
    qr: string | null;
    updatedAt: Date | null;
};
export type WhatsAppSessionCountAggregateOutputType = {
    merchantId: number;
    status: number;
    phone: number;
    qr: number;
    updatedAt: number;
    _all: number;
};
export type WhatsAppSessionMinAggregateInputType = {
    merchantId?: true;
    status?: true;
    phone?: true;
    qr?: true;
    updatedAt?: true;
};
export type WhatsAppSessionMaxAggregateInputType = {
    merchantId?: true;
    status?: true;
    phone?: true;
    qr?: true;
    updatedAt?: true;
};
export type WhatsAppSessionCountAggregateInputType = {
    merchantId?: true;
    status?: true;
    phone?: true;
    qr?: true;
    updatedAt?: true;
    _all?: true;
};
export type WhatsAppSessionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WhatsAppSessionWhereInput;
    orderBy?: Prisma.WhatsAppSessionOrderByWithRelationInput | Prisma.WhatsAppSessionOrderByWithRelationInput[];
    cursor?: Prisma.WhatsAppSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WhatsAppSessionCountAggregateInputType;
    _min?: WhatsAppSessionMinAggregateInputType;
    _max?: WhatsAppSessionMaxAggregateInputType;
};
export type GetWhatsAppSessionAggregateType<T extends WhatsAppSessionAggregateArgs> = {
    [P in keyof T & keyof AggregateWhatsAppSession]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWhatsAppSession[P]> : Prisma.GetScalarType<T[P], AggregateWhatsAppSession[P]>;
};
export type WhatsAppSessionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WhatsAppSessionWhereInput;
    orderBy?: Prisma.WhatsAppSessionOrderByWithAggregationInput | Prisma.WhatsAppSessionOrderByWithAggregationInput[];
    by: Prisma.WhatsAppSessionScalarFieldEnum[] | Prisma.WhatsAppSessionScalarFieldEnum;
    having?: Prisma.WhatsAppSessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WhatsAppSessionCountAggregateInputType | true;
    _min?: WhatsAppSessionMinAggregateInputType;
    _max?: WhatsAppSessionMaxAggregateInputType;
};
export type WhatsAppSessionGroupByOutputType = {
    merchantId: string;
    status: $Enums.SessionStatus;
    phone: string | null;
    qr: string | null;
    updatedAt: Date;
    _count: WhatsAppSessionCountAggregateOutputType | null;
    _min: WhatsAppSessionMinAggregateOutputType | null;
    _max: WhatsAppSessionMaxAggregateOutputType | null;
};
export type GetWhatsAppSessionGroupByPayload<T extends WhatsAppSessionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WhatsAppSessionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WhatsAppSessionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WhatsAppSessionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WhatsAppSessionGroupByOutputType[P]>;
}>>;
export type WhatsAppSessionWhereInput = {
    AND?: Prisma.WhatsAppSessionWhereInput | Prisma.WhatsAppSessionWhereInput[];
    OR?: Prisma.WhatsAppSessionWhereInput[];
    NOT?: Prisma.WhatsAppSessionWhereInput | Prisma.WhatsAppSessionWhereInput[];
    merchantId?: Prisma.StringFilter<"WhatsAppSession"> | string;
    status?: Prisma.EnumSessionStatusFilter<"WhatsAppSession"> | $Enums.SessionStatus;
    phone?: Prisma.StringNullableFilter<"WhatsAppSession"> | string | null;
    qr?: Prisma.StringNullableFilter<"WhatsAppSession"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"WhatsAppSession"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
};
export type WhatsAppSessionOrderByWithRelationInput = {
    merchantId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    qr?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    merchant?: Prisma.MerchantOrderByWithRelationInput;
};
export type WhatsAppSessionWhereUniqueInput = Prisma.AtLeast<{
    merchantId?: string;
    AND?: Prisma.WhatsAppSessionWhereInput | Prisma.WhatsAppSessionWhereInput[];
    OR?: Prisma.WhatsAppSessionWhereInput[];
    NOT?: Prisma.WhatsAppSessionWhereInput | Prisma.WhatsAppSessionWhereInput[];
    status?: Prisma.EnumSessionStatusFilter<"WhatsAppSession"> | $Enums.SessionStatus;
    phone?: Prisma.StringNullableFilter<"WhatsAppSession"> | string | null;
    qr?: Prisma.StringNullableFilter<"WhatsAppSession"> | string | null;
    updatedAt?: Prisma.DateTimeFilter<"WhatsAppSession"> | Date | string;
    merchant?: Prisma.XOR<Prisma.MerchantScalarRelationFilter, Prisma.MerchantWhereInput>;
}, "merchantId">;
export type WhatsAppSessionOrderByWithAggregationInput = {
    merchantId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    qr?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WhatsAppSessionCountOrderByAggregateInput;
    _max?: Prisma.WhatsAppSessionMaxOrderByAggregateInput;
    _min?: Prisma.WhatsAppSessionMinOrderByAggregateInput;
};
export type WhatsAppSessionScalarWhereWithAggregatesInput = {
    AND?: Prisma.WhatsAppSessionScalarWhereWithAggregatesInput | Prisma.WhatsAppSessionScalarWhereWithAggregatesInput[];
    OR?: Prisma.WhatsAppSessionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WhatsAppSessionScalarWhereWithAggregatesInput | Prisma.WhatsAppSessionScalarWhereWithAggregatesInput[];
    merchantId?: Prisma.StringWithAggregatesFilter<"WhatsAppSession"> | string;
    status?: Prisma.EnumSessionStatusWithAggregatesFilter<"WhatsAppSession"> | $Enums.SessionStatus;
    phone?: Prisma.StringNullableWithAggregatesFilter<"WhatsAppSession"> | string | null;
    qr?: Prisma.StringNullableWithAggregatesFilter<"WhatsAppSession"> | string | null;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"WhatsAppSession"> | Date | string;
};
export type WhatsAppSessionCreateInput = {
    status?: $Enums.SessionStatus;
    phone?: string | null;
    qr?: string | null;
    updatedAt?: Date | string;
    merchant: Prisma.MerchantCreateNestedOneWithoutSessionInput;
};
export type WhatsAppSessionUncheckedCreateInput = {
    merchantId: string;
    status?: $Enums.SessionStatus;
    phone?: string | null;
    qr?: string | null;
    updatedAt?: Date | string;
};
export type WhatsAppSessionUpdateInput = {
    status?: Prisma.EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    merchant?: Prisma.MerchantUpdateOneRequiredWithoutSessionNestedInput;
};
export type WhatsAppSessionUncheckedUpdateInput = {
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WhatsAppSessionCreateManyInput = {
    merchantId: string;
    status?: $Enums.SessionStatus;
    phone?: string | null;
    qr?: string | null;
    updatedAt?: Date | string;
};
export type WhatsAppSessionUpdateManyMutationInput = {
    status?: Prisma.EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WhatsAppSessionUncheckedUpdateManyInput = {
    merchantId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WhatsAppSessionNullableScalarRelationFilter = {
    is?: Prisma.WhatsAppSessionWhereInput | null;
    isNot?: Prisma.WhatsAppSessionWhereInput | null;
};
export type WhatsAppSessionCountOrderByAggregateInput = {
    merchantId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    qr?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WhatsAppSessionMaxOrderByAggregateInput = {
    merchantId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    qr?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WhatsAppSessionMinOrderByAggregateInput = {
    merchantId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    qr?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WhatsAppSessionCreateNestedOneWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.WhatsAppSessionCreateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedCreateWithoutMerchantInput>;
    connectOrCreate?: Prisma.WhatsAppSessionCreateOrConnectWithoutMerchantInput;
    connect?: Prisma.WhatsAppSessionWhereUniqueInput;
};
export type WhatsAppSessionUncheckedCreateNestedOneWithoutMerchantInput = {
    create?: Prisma.XOR<Prisma.WhatsAppSessionCreateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedCreateWithoutMerchantInput>;
    connectOrCreate?: Prisma.WhatsAppSessionCreateOrConnectWithoutMerchantInput;
    connect?: Prisma.WhatsAppSessionWhereUniqueInput;
};
export type WhatsAppSessionUpdateOneWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.WhatsAppSessionCreateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedCreateWithoutMerchantInput>;
    connectOrCreate?: Prisma.WhatsAppSessionCreateOrConnectWithoutMerchantInput;
    upsert?: Prisma.WhatsAppSessionUpsertWithoutMerchantInput;
    disconnect?: Prisma.WhatsAppSessionWhereInput | boolean;
    delete?: Prisma.WhatsAppSessionWhereInput | boolean;
    connect?: Prisma.WhatsAppSessionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WhatsAppSessionUpdateToOneWithWhereWithoutMerchantInput, Prisma.WhatsAppSessionUpdateWithoutMerchantInput>, Prisma.WhatsAppSessionUncheckedUpdateWithoutMerchantInput>;
};
export type WhatsAppSessionUncheckedUpdateOneWithoutMerchantNestedInput = {
    create?: Prisma.XOR<Prisma.WhatsAppSessionCreateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedCreateWithoutMerchantInput>;
    connectOrCreate?: Prisma.WhatsAppSessionCreateOrConnectWithoutMerchantInput;
    upsert?: Prisma.WhatsAppSessionUpsertWithoutMerchantInput;
    disconnect?: Prisma.WhatsAppSessionWhereInput | boolean;
    delete?: Prisma.WhatsAppSessionWhereInput | boolean;
    connect?: Prisma.WhatsAppSessionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WhatsAppSessionUpdateToOneWithWhereWithoutMerchantInput, Prisma.WhatsAppSessionUpdateWithoutMerchantInput>, Prisma.WhatsAppSessionUncheckedUpdateWithoutMerchantInput>;
};
export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus;
};
export type WhatsAppSessionCreateWithoutMerchantInput = {
    status?: $Enums.SessionStatus;
    phone?: string | null;
    qr?: string | null;
    updatedAt?: Date | string;
};
export type WhatsAppSessionUncheckedCreateWithoutMerchantInput = {
    status?: $Enums.SessionStatus;
    phone?: string | null;
    qr?: string | null;
    updatedAt?: Date | string;
};
export type WhatsAppSessionCreateOrConnectWithoutMerchantInput = {
    where: Prisma.WhatsAppSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.WhatsAppSessionCreateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedCreateWithoutMerchantInput>;
};
export type WhatsAppSessionUpsertWithoutMerchantInput = {
    update: Prisma.XOR<Prisma.WhatsAppSessionUpdateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedUpdateWithoutMerchantInput>;
    create: Prisma.XOR<Prisma.WhatsAppSessionCreateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedCreateWithoutMerchantInput>;
    where?: Prisma.WhatsAppSessionWhereInput;
};
export type WhatsAppSessionUpdateToOneWithWhereWithoutMerchantInput = {
    where?: Prisma.WhatsAppSessionWhereInput;
    data: Prisma.XOR<Prisma.WhatsAppSessionUpdateWithoutMerchantInput, Prisma.WhatsAppSessionUncheckedUpdateWithoutMerchantInput>;
};
export type WhatsAppSessionUpdateWithoutMerchantInput = {
    status?: Prisma.EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WhatsAppSessionUncheckedUpdateWithoutMerchantInput = {
    status?: Prisma.EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    qr?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WhatsAppSessionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    merchantId?: boolean;
    status?: boolean;
    phone?: boolean;
    qr?: boolean;
    updatedAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["whatsAppSession"]>;
export type WhatsAppSessionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    merchantId?: boolean;
    status?: boolean;
    phone?: boolean;
    qr?: boolean;
    updatedAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["whatsAppSession"]>;
export type WhatsAppSessionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    merchantId?: boolean;
    status?: boolean;
    phone?: boolean;
    qr?: boolean;
    updatedAt?: boolean;
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["whatsAppSession"]>;
export type WhatsAppSessionSelectScalar = {
    merchantId?: boolean;
    status?: boolean;
    phone?: boolean;
    qr?: boolean;
    updatedAt?: boolean;
};
export type WhatsAppSessionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"merchantId" | "status" | "phone" | "qr" | "updatedAt", ExtArgs["result"]["whatsAppSession"]>;
export type WhatsAppSessionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type WhatsAppSessionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type WhatsAppSessionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    merchant?: boolean | Prisma.MerchantDefaultArgs<ExtArgs>;
};
export type $WhatsAppSessionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WhatsAppSession";
    objects: {
        merchant: Prisma.$MerchantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        merchantId: string;
        status: $Enums.SessionStatus;
        phone: string | null;
        qr: string | null;
        updatedAt: Date;
    }, ExtArgs["result"]["whatsAppSession"]>;
    composites: {};
};
export type WhatsAppSessionGetPayload<S extends boolean | null | undefined | WhatsAppSessionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload, S>;
export type WhatsAppSessionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WhatsAppSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WhatsAppSessionCountAggregateInputType | true;
};
export interface WhatsAppSessionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppSession'];
        meta: {
            name: 'WhatsAppSession';
        };
    };
    findUnique<T extends WhatsAppSessionFindUniqueArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WhatsAppSessionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WhatsAppSessionFindFirstArgs>(args?: Prisma.SelectSubset<T, WhatsAppSessionFindFirstArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WhatsAppSessionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WhatsAppSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WhatsAppSessionFindManyArgs>(args?: Prisma.SelectSubset<T, WhatsAppSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WhatsAppSessionCreateArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionCreateArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WhatsAppSessionCreateManyArgs>(args?: Prisma.SelectSubset<T, WhatsAppSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WhatsAppSessionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WhatsAppSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WhatsAppSessionDeleteArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionDeleteArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WhatsAppSessionUpdateArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionUpdateArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WhatsAppSessionDeleteManyArgs>(args?: Prisma.SelectSubset<T, WhatsAppSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WhatsAppSessionUpdateManyArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WhatsAppSessionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WhatsAppSessionUpsertArgs>(args: Prisma.SelectSubset<T, WhatsAppSessionUpsertArgs<ExtArgs>>): Prisma.Prisma__WhatsAppSessionClient<runtime.Types.Result.GetResult<Prisma.$WhatsAppSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WhatsAppSessionCountArgs>(args?: Prisma.Subset<T, WhatsAppSessionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WhatsAppSessionCountAggregateOutputType> : number>;
    aggregate<T extends WhatsAppSessionAggregateArgs>(args: Prisma.Subset<T, WhatsAppSessionAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppSessionAggregateType<T>>;
    groupBy<T extends WhatsAppSessionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WhatsAppSessionGroupByArgs['orderBy'];
    } : {
        orderBy?: WhatsAppSessionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WhatsAppSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WhatsAppSessionFieldRefs;
}
export interface Prisma__WhatsAppSessionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    merchant<T extends Prisma.MerchantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MerchantDefaultArgs<ExtArgs>>): Prisma.Prisma__MerchantClient<runtime.Types.Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WhatsAppSessionFieldRefs {
    readonly merchantId: Prisma.FieldRef<"WhatsAppSession", 'String'>;
    readonly status: Prisma.FieldRef<"WhatsAppSession", 'SessionStatus'>;
    readonly phone: Prisma.FieldRef<"WhatsAppSession", 'String'>;
    readonly qr: Prisma.FieldRef<"WhatsAppSession", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"WhatsAppSession", 'DateTime'>;
}
export type WhatsAppSessionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where: Prisma.WhatsAppSessionWhereUniqueInput;
};
export type WhatsAppSessionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where: Prisma.WhatsAppSessionWhereUniqueInput;
};
export type WhatsAppSessionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where?: Prisma.WhatsAppSessionWhereInput;
    orderBy?: Prisma.WhatsAppSessionOrderByWithRelationInput | Prisma.WhatsAppSessionOrderByWithRelationInput[];
    cursor?: Prisma.WhatsAppSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WhatsAppSessionScalarFieldEnum | Prisma.WhatsAppSessionScalarFieldEnum[];
};
export type WhatsAppSessionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where?: Prisma.WhatsAppSessionWhereInput;
    orderBy?: Prisma.WhatsAppSessionOrderByWithRelationInput | Prisma.WhatsAppSessionOrderByWithRelationInput[];
    cursor?: Prisma.WhatsAppSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WhatsAppSessionScalarFieldEnum | Prisma.WhatsAppSessionScalarFieldEnum[];
};
export type WhatsAppSessionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where?: Prisma.WhatsAppSessionWhereInput;
    orderBy?: Prisma.WhatsAppSessionOrderByWithRelationInput | Prisma.WhatsAppSessionOrderByWithRelationInput[];
    cursor?: Prisma.WhatsAppSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WhatsAppSessionScalarFieldEnum | Prisma.WhatsAppSessionScalarFieldEnum[];
};
export type WhatsAppSessionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WhatsAppSessionCreateInput, Prisma.WhatsAppSessionUncheckedCreateInput>;
};
export type WhatsAppSessionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WhatsAppSessionCreateManyInput | Prisma.WhatsAppSessionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WhatsAppSessionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    data: Prisma.WhatsAppSessionCreateManyInput | Prisma.WhatsAppSessionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WhatsAppSessionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WhatsAppSessionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WhatsAppSessionUpdateInput, Prisma.WhatsAppSessionUncheckedUpdateInput>;
    where: Prisma.WhatsAppSessionWhereUniqueInput;
};
export type WhatsAppSessionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WhatsAppSessionUpdateManyMutationInput, Prisma.WhatsAppSessionUncheckedUpdateManyInput>;
    where?: Prisma.WhatsAppSessionWhereInput;
    limit?: number;
};
export type WhatsAppSessionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WhatsAppSessionUpdateManyMutationInput, Prisma.WhatsAppSessionUncheckedUpdateManyInput>;
    where?: Prisma.WhatsAppSessionWhereInput;
    limit?: number;
    include?: Prisma.WhatsAppSessionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WhatsAppSessionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where: Prisma.WhatsAppSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.WhatsAppSessionCreateInput, Prisma.WhatsAppSessionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WhatsAppSessionUpdateInput, Prisma.WhatsAppSessionUncheckedUpdateInput>;
};
export type WhatsAppSessionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
    where: Prisma.WhatsAppSessionWhereUniqueInput;
};
export type WhatsAppSessionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WhatsAppSessionWhereInput;
    limit?: number;
};
export type WhatsAppSessionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WhatsAppSessionSelect<ExtArgs> | null;
    omit?: Prisma.WhatsAppSessionOmit<ExtArgs> | null;
    include?: Prisma.WhatsAppSessionInclude<ExtArgs> | null;
};
