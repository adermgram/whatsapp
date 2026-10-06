import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProcessedEventModel = runtime.Types.Result.DefaultSelection<Prisma.$ProcessedEventPayload>;
export type AggregateProcessedEvent = {
    _count: ProcessedEventCountAggregateOutputType | null;
    _min: ProcessedEventMinAggregateOutputType | null;
    _max: ProcessedEventMaxAggregateOutputType | null;
};
export type ProcessedEventMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
};
export type ProcessedEventMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
};
export type ProcessedEventCountAggregateOutputType = {
    id: number;
    createdAt: number;
    _all: number;
};
export type ProcessedEventMinAggregateInputType = {
    id?: true;
    createdAt?: true;
};
export type ProcessedEventMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
};
export type ProcessedEventCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    _all?: true;
};
export type ProcessedEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProcessedEventWhereInput;
    orderBy?: Prisma.ProcessedEventOrderByWithRelationInput | Prisma.ProcessedEventOrderByWithRelationInput[];
    cursor?: Prisma.ProcessedEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProcessedEventCountAggregateInputType;
    _min?: ProcessedEventMinAggregateInputType;
    _max?: ProcessedEventMaxAggregateInputType;
};
export type GetProcessedEventAggregateType<T extends ProcessedEventAggregateArgs> = {
    [P in keyof T & keyof AggregateProcessedEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProcessedEvent[P]> : Prisma.GetScalarType<T[P], AggregateProcessedEvent[P]>;
};
export type ProcessedEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProcessedEventWhereInput;
    orderBy?: Prisma.ProcessedEventOrderByWithAggregationInput | Prisma.ProcessedEventOrderByWithAggregationInput[];
    by: Prisma.ProcessedEventScalarFieldEnum[] | Prisma.ProcessedEventScalarFieldEnum;
    having?: Prisma.ProcessedEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProcessedEventCountAggregateInputType | true;
    _min?: ProcessedEventMinAggregateInputType;
    _max?: ProcessedEventMaxAggregateInputType;
};
export type ProcessedEventGroupByOutputType = {
    id: string;
    createdAt: Date;
    _count: ProcessedEventCountAggregateOutputType | null;
    _min: ProcessedEventMinAggregateOutputType | null;
    _max: ProcessedEventMaxAggregateOutputType | null;
};
export type GetProcessedEventGroupByPayload<T extends ProcessedEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProcessedEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProcessedEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProcessedEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProcessedEventGroupByOutputType[P]>;
}>>;
export type ProcessedEventWhereInput = {
    AND?: Prisma.ProcessedEventWhereInput | Prisma.ProcessedEventWhereInput[];
    OR?: Prisma.ProcessedEventWhereInput[];
    NOT?: Prisma.ProcessedEventWhereInput | Prisma.ProcessedEventWhereInput[];
    id?: Prisma.StringFilter<"ProcessedEvent"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProcessedEvent"> | Date | string;
};
export type ProcessedEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProcessedEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ProcessedEventWhereInput | Prisma.ProcessedEventWhereInput[];
    OR?: Prisma.ProcessedEventWhereInput[];
    NOT?: Prisma.ProcessedEventWhereInput | Prisma.ProcessedEventWhereInput[];
    createdAt?: Prisma.DateTimeFilter<"ProcessedEvent"> | Date | string;
}, "id">;
export type ProcessedEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProcessedEventCountOrderByAggregateInput;
    _max?: Prisma.ProcessedEventMaxOrderByAggregateInput;
    _min?: Prisma.ProcessedEventMinOrderByAggregateInput;
};
export type ProcessedEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProcessedEventScalarWhereWithAggregatesInput | Prisma.ProcessedEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProcessedEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProcessedEventScalarWhereWithAggregatesInput | Prisma.ProcessedEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProcessedEvent"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProcessedEvent"> | Date | string;
};
export type ProcessedEventCreateInput = {
    id: string;
    createdAt?: Date | string;
};
export type ProcessedEventUncheckedCreateInput = {
    id: string;
    createdAt?: Date | string;
};
export type ProcessedEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedEventCreateManyInput = {
    id: string;
    createdAt?: Date | string;
};
export type ProcessedEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProcessedEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProcessedEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProcessedEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProcessedEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["processedEvent"]>;
export type ProcessedEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["processedEvent"]>;
export type ProcessedEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["processedEvent"]>;
export type ProcessedEventSelectScalar = {
    id?: boolean;
    createdAt?: boolean;
};
export type ProcessedEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "createdAt", ExtArgs["result"]["processedEvent"]>;
export type $ProcessedEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProcessedEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        createdAt: Date;
    }, ExtArgs["result"]["processedEvent"]>;
    composites: {};
};
export type ProcessedEventGetPayload<S extends boolean | null | undefined | ProcessedEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload, S>;
export type ProcessedEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProcessedEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProcessedEventCountAggregateInputType | true;
};
export interface ProcessedEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProcessedEvent'];
        meta: {
            name: 'ProcessedEvent';
        };
    };
    findUnique<T extends ProcessedEventFindUniqueArgs>(args: Prisma.SelectSubset<T, ProcessedEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProcessedEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProcessedEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProcessedEventFindFirstArgs>(args?: Prisma.SelectSubset<T, ProcessedEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProcessedEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProcessedEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProcessedEventFindManyArgs>(args?: Prisma.SelectSubset<T, ProcessedEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProcessedEventCreateArgs>(args: Prisma.SelectSubset<T, ProcessedEventCreateArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProcessedEventCreateManyArgs>(args?: Prisma.SelectSubset<T, ProcessedEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProcessedEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProcessedEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProcessedEventDeleteArgs>(args: Prisma.SelectSubset<T, ProcessedEventDeleteArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProcessedEventUpdateArgs>(args: Prisma.SelectSubset<T, ProcessedEventUpdateArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProcessedEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProcessedEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProcessedEventUpdateManyArgs>(args: Prisma.SelectSubset<T, ProcessedEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProcessedEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProcessedEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProcessedEventUpsertArgs>(args: Prisma.SelectSubset<T, ProcessedEventUpsertArgs<ExtArgs>>): Prisma.Prisma__ProcessedEventClient<runtime.Types.Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProcessedEventCountArgs>(args?: Prisma.Subset<T, ProcessedEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProcessedEventCountAggregateOutputType> : number>;
    aggregate<T extends ProcessedEventAggregateArgs>(args: Prisma.Subset<T, ProcessedEventAggregateArgs>): Prisma.PrismaPromise<GetProcessedEventAggregateType<T>>;
    groupBy<T extends ProcessedEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProcessedEventGroupByArgs['orderBy'];
    } : {
        orderBy?: ProcessedEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProcessedEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessedEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProcessedEventFieldRefs;
}
export interface Prisma__ProcessedEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProcessedEventFieldRefs {
    readonly id: Prisma.FieldRef<"ProcessedEvent", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ProcessedEvent", 'DateTime'>;
}
export type ProcessedEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where: Prisma.ProcessedEventWhereUniqueInput;
};
export type ProcessedEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where: Prisma.ProcessedEventWhereUniqueInput;
};
export type ProcessedEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where?: Prisma.ProcessedEventWhereInput;
    orderBy?: Prisma.ProcessedEventOrderByWithRelationInput | Prisma.ProcessedEventOrderByWithRelationInput[];
    cursor?: Prisma.ProcessedEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProcessedEventScalarFieldEnum | Prisma.ProcessedEventScalarFieldEnum[];
};
export type ProcessedEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where?: Prisma.ProcessedEventWhereInput;
    orderBy?: Prisma.ProcessedEventOrderByWithRelationInput | Prisma.ProcessedEventOrderByWithRelationInput[];
    cursor?: Prisma.ProcessedEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProcessedEventScalarFieldEnum | Prisma.ProcessedEventScalarFieldEnum[];
};
export type ProcessedEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where?: Prisma.ProcessedEventWhereInput;
    orderBy?: Prisma.ProcessedEventOrderByWithRelationInput | Prisma.ProcessedEventOrderByWithRelationInput[];
    cursor?: Prisma.ProcessedEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProcessedEventScalarFieldEnum | Prisma.ProcessedEventScalarFieldEnum[];
};
export type ProcessedEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProcessedEventCreateInput, Prisma.ProcessedEventUncheckedCreateInput>;
};
export type ProcessedEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProcessedEventCreateManyInput | Prisma.ProcessedEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProcessedEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    data: Prisma.ProcessedEventCreateManyInput | Prisma.ProcessedEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProcessedEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProcessedEventUpdateInput, Prisma.ProcessedEventUncheckedUpdateInput>;
    where: Prisma.ProcessedEventWhereUniqueInput;
};
export type ProcessedEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProcessedEventUpdateManyMutationInput, Prisma.ProcessedEventUncheckedUpdateManyInput>;
    where?: Prisma.ProcessedEventWhereInput;
    limit?: number;
};
export type ProcessedEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProcessedEventUpdateManyMutationInput, Prisma.ProcessedEventUncheckedUpdateManyInput>;
    where?: Prisma.ProcessedEventWhereInput;
    limit?: number;
};
export type ProcessedEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where: Prisma.ProcessedEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProcessedEventCreateInput, Prisma.ProcessedEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProcessedEventUpdateInput, Prisma.ProcessedEventUncheckedUpdateInput>;
};
export type ProcessedEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
    where: Prisma.ProcessedEventWhereUniqueInput;
};
export type ProcessedEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProcessedEventWhereInput;
    limit?: number;
};
export type ProcessedEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProcessedEventSelect<ExtArgs> | null;
    omit?: Prisma.ProcessedEventOmit<ExtArgs> | null;
};
