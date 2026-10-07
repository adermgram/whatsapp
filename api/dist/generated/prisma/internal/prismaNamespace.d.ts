import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Merchant: "Merchant";
    readonly WhatsAppSession: "WhatsAppSession";
    readonly WaAuthItem: "WaAuthItem";
    readonly Product: "Product";
    readonly Variant: "Variant";
    readonly Customer: "Customer";
    readonly Conversation: "Conversation";
    readonly Message: "Message";
    readonly Negotiation: "Negotiation";
    readonly Order: "Order";
    readonly OrderItem: "OrderItem";
    readonly Payment: "Payment";
    readonly Receipt: "Receipt";
    readonly ProcessedEvent: "ProcessedEvent";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "merchant" | "whatsAppSession" | "waAuthItem" | "product" | "variant" | "customer" | "conversation" | "message" | "negotiation" | "order" | "orderItem" | "payment" | "receipt" | "processedEvent";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Merchant: {
            payload: Prisma.$MerchantPayload<ExtArgs>;
            fields: Prisma.MerchantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MerchantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MerchantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>;
                };
                findFirst: {
                    args: Prisma.MerchantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MerchantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>;
                };
                findMany: {
                    args: Prisma.MerchantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>[];
                };
                create: {
                    args: Prisma.MerchantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>;
                };
                createMany: {
                    args: Prisma.MerchantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MerchantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>[];
                };
                delete: {
                    args: Prisma.MerchantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>;
                };
                update: {
                    args: Prisma.MerchantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>;
                };
                deleteMany: {
                    args: Prisma.MerchantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MerchantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MerchantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>[];
                };
                upsert: {
                    args: Prisma.MerchantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MerchantPayload>;
                };
                aggregate: {
                    args: Prisma.MerchantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMerchant>;
                };
                groupBy: {
                    args: Prisma.MerchantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MerchantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MerchantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MerchantCountAggregateOutputType> | number;
                };
            };
        };
        WhatsAppSession: {
            payload: Prisma.$WhatsAppSessionPayload<ExtArgs>;
            fields: Prisma.WhatsAppSessionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WhatsAppSessionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WhatsAppSessionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>;
                };
                findFirst: {
                    args: Prisma.WhatsAppSessionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WhatsAppSessionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>;
                };
                findMany: {
                    args: Prisma.WhatsAppSessionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>[];
                };
                create: {
                    args: Prisma.WhatsAppSessionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>;
                };
                createMany: {
                    args: Prisma.WhatsAppSessionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WhatsAppSessionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>[];
                };
                delete: {
                    args: Prisma.WhatsAppSessionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>;
                };
                update: {
                    args: Prisma.WhatsAppSessionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>;
                };
                deleteMany: {
                    args: Prisma.WhatsAppSessionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WhatsAppSessionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WhatsAppSessionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>[];
                };
                upsert: {
                    args: Prisma.WhatsAppSessionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WhatsAppSessionPayload>;
                };
                aggregate: {
                    args: Prisma.WhatsAppSessionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWhatsAppSession>;
                };
                groupBy: {
                    args: Prisma.WhatsAppSessionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WhatsAppSessionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WhatsAppSessionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WhatsAppSessionCountAggregateOutputType> | number;
                };
            };
        };
        WaAuthItem: {
            payload: Prisma.$WaAuthItemPayload<ExtArgs>;
            fields: Prisma.WaAuthItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WaAuthItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WaAuthItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>;
                };
                findFirst: {
                    args: Prisma.WaAuthItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WaAuthItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>;
                };
                findMany: {
                    args: Prisma.WaAuthItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>[];
                };
                create: {
                    args: Prisma.WaAuthItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>;
                };
                createMany: {
                    args: Prisma.WaAuthItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WaAuthItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>[];
                };
                delete: {
                    args: Prisma.WaAuthItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>;
                };
                update: {
                    args: Prisma.WaAuthItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>;
                };
                deleteMany: {
                    args: Prisma.WaAuthItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WaAuthItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WaAuthItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>[];
                };
                upsert: {
                    args: Prisma.WaAuthItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WaAuthItemPayload>;
                };
                aggregate: {
                    args: Prisma.WaAuthItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWaAuthItem>;
                };
                groupBy: {
                    args: Prisma.WaAuthItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WaAuthItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WaAuthItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WaAuthItemCountAggregateOutputType> | number;
                };
            };
        };
        Product: {
            payload: Prisma.$ProductPayload<ExtArgs>;
            fields: Prisma.ProductFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProductFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                findFirst: {
                    args: Prisma.ProductFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                findMany: {
                    args: Prisma.ProductFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>[];
                };
                create: {
                    args: Prisma.ProductCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                createMany: {
                    args: Prisma.ProductCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>[];
                };
                delete: {
                    args: Prisma.ProductDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                update: {
                    args: Prisma.ProductUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                deleteMany: {
                    args: Prisma.ProductDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProductUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>[];
                };
                upsert: {
                    args: Prisma.ProductUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProductPayload>;
                };
                aggregate: {
                    args: Prisma.ProductAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProduct>;
                };
                groupBy: {
                    args: Prisma.ProductGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProductCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductCountAggregateOutputType> | number;
                };
            };
        };
        Variant: {
            payload: Prisma.$VariantPayload<ExtArgs>;
            fields: Prisma.VariantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VariantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VariantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>;
                };
                findFirst: {
                    args: Prisma.VariantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VariantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>;
                };
                findMany: {
                    args: Prisma.VariantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>[];
                };
                create: {
                    args: Prisma.VariantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>;
                };
                createMany: {
                    args: Prisma.VariantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.VariantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>[];
                };
                delete: {
                    args: Prisma.VariantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>;
                };
                update: {
                    args: Prisma.VariantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>;
                };
                deleteMany: {
                    args: Prisma.VariantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VariantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.VariantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>[];
                };
                upsert: {
                    args: Prisma.VariantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VariantPayload>;
                };
                aggregate: {
                    args: Prisma.VariantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVariant>;
                };
                groupBy: {
                    args: Prisma.VariantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VariantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VariantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VariantCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
        Conversation: {
            payload: Prisma.$ConversationPayload<ExtArgs>;
            fields: Prisma.ConversationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ConversationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                findFirst: {
                    args: Prisma.ConversationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                findMany: {
                    args: Prisma.ConversationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>[];
                };
                create: {
                    args: Prisma.ConversationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                createMany: {
                    args: Prisma.ConversationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>[];
                };
                delete: {
                    args: Prisma.ConversationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                update: {
                    args: Prisma.ConversationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                deleteMany: {
                    args: Prisma.ConversationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ConversationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ConversationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>[];
                };
                upsert: {
                    args: Prisma.ConversationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConversationPayload>;
                };
                aggregate: {
                    args: Prisma.ConversationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateConversation>;
                };
                groupBy: {
                    args: Prisma.ConversationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConversationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ConversationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConversationCountAggregateOutputType> | number;
                };
            };
        };
        Message: {
            payload: Prisma.$MessagePayload<ExtArgs>;
            fields: Prisma.MessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                findFirst: {
                    args: Prisma.MessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                findMany: {
                    args: Prisma.MessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                create: {
                    args: Prisma.MessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                createMany: {
                    args: Prisma.MessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                delete: {
                    args: Prisma.MessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                update: {
                    args: Prisma.MessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                deleteMany: {
                    args: Prisma.MessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>[];
                };
                upsert: {
                    args: Prisma.MessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MessagePayload>;
                };
                aggregate: {
                    args: Prisma.MessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMessage>;
                };
                groupBy: {
                    args: Prisma.MessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MessageCountAggregateOutputType> | number;
                };
            };
        };
        Negotiation: {
            payload: Prisma.$NegotiationPayload<ExtArgs>;
            fields: Prisma.NegotiationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NegotiationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NegotiationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>;
                };
                findFirst: {
                    args: Prisma.NegotiationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NegotiationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>;
                };
                findMany: {
                    args: Prisma.NegotiationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>[];
                };
                create: {
                    args: Prisma.NegotiationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>;
                };
                createMany: {
                    args: Prisma.NegotiationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NegotiationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>[];
                };
                delete: {
                    args: Prisma.NegotiationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>;
                };
                update: {
                    args: Prisma.NegotiationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>;
                };
                deleteMany: {
                    args: Prisma.NegotiationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NegotiationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NegotiationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>[];
                };
                upsert: {
                    args: Prisma.NegotiationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NegotiationPayload>;
                };
                aggregate: {
                    args: Prisma.NegotiationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNegotiation>;
                };
                groupBy: {
                    args: Prisma.NegotiationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NegotiationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NegotiationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NegotiationCountAggregateOutputType> | number;
                };
            };
        };
        Order: {
            payload: Prisma.$OrderPayload<ExtArgs>;
            fields: Prisma.OrderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                findFirst: {
                    args: Prisma.OrderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                findMany: {
                    args: Prisma.OrderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                create: {
                    args: Prisma.OrderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                createMany: {
                    args: Prisma.OrderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                delete: {
                    args: Prisma.OrderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                update: {
                    args: Prisma.OrderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                deleteMany: {
                    args: Prisma.OrderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                upsert: {
                    args: Prisma.OrderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                aggregate: {
                    args: Prisma.OrderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrder>;
                };
                groupBy: {
                    args: Prisma.OrderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderCountAggregateOutputType> | number;
                };
            };
        };
        OrderItem: {
            payload: Prisma.$OrderItemPayload<ExtArgs>;
            fields: Prisma.OrderItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrderItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrderItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>;
                };
                findFirst: {
                    args: Prisma.OrderItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrderItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>;
                };
                findMany: {
                    args: Prisma.OrderItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>[];
                };
                create: {
                    args: Prisma.OrderItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>;
                };
                createMany: {
                    args: Prisma.OrderItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrderItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>[];
                };
                delete: {
                    args: Prisma.OrderItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>;
                };
                update: {
                    args: Prisma.OrderItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>;
                };
                deleteMany: {
                    args: Prisma.OrderItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrderItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrderItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>[];
                };
                upsert: {
                    args: Prisma.OrderItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderItemPayload>;
                };
                aggregate: {
                    args: Prisma.OrderItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrderItem>;
                };
                groupBy: {
                    args: Prisma.OrderItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrderItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderItemCountAggregateOutputType> | number;
                };
            };
        };
        Payment: {
            payload: Prisma.$PaymentPayload<ExtArgs>;
            fields: Prisma.PaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findMany: {
                    args: Prisma.PaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                create: {
                    args: Prisma.PaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                createMany: {
                    args: Prisma.PaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                delete: {
                    args: Prisma.PaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                update: {
                    args: Prisma.PaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePayment>;
                };
                groupBy: {
                    args: Prisma.PaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentCountAggregateOutputType> | number;
                };
            };
        };
        Receipt: {
            payload: Prisma.$ReceiptPayload<ExtArgs>;
            fields: Prisma.ReceiptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReceiptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReceiptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>;
                };
                findFirst: {
                    args: Prisma.ReceiptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReceiptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>;
                };
                findMany: {
                    args: Prisma.ReceiptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>[];
                };
                create: {
                    args: Prisma.ReceiptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>;
                };
                createMany: {
                    args: Prisma.ReceiptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReceiptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>[];
                };
                delete: {
                    args: Prisma.ReceiptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>;
                };
                update: {
                    args: Prisma.ReceiptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>;
                };
                deleteMany: {
                    args: Prisma.ReceiptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReceiptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReceiptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>[];
                };
                upsert: {
                    args: Prisma.ReceiptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReceiptPayload>;
                };
                aggregate: {
                    args: Prisma.ReceiptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReceipt>;
                };
                groupBy: {
                    args: Prisma.ReceiptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReceiptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReceiptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReceiptCountAggregateOutputType> | number;
                };
            };
        };
        ProcessedEvent: {
            payload: Prisma.$ProcessedEventPayload<ExtArgs>;
            fields: Prisma.ProcessedEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProcessedEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProcessedEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>;
                };
                findFirst: {
                    args: Prisma.ProcessedEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProcessedEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>;
                };
                findMany: {
                    args: Prisma.ProcessedEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[];
                };
                create: {
                    args: Prisma.ProcessedEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>;
                };
                createMany: {
                    args: Prisma.ProcessedEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProcessedEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[];
                };
                delete: {
                    args: Prisma.ProcessedEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>;
                };
                update: {
                    args: Prisma.ProcessedEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>;
                };
                deleteMany: {
                    args: Prisma.ProcessedEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProcessedEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProcessedEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[];
                };
                upsert: {
                    args: Prisma.ProcessedEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProcessedEventPayload>;
                };
                aggregate: {
                    args: Prisma.ProcessedEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProcessedEvent>;
                };
                groupBy: {
                    args: Prisma.ProcessedEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProcessedEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProcessedEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProcessedEventCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const MerchantScalarFieldEnum: {
    readonly id: "id";
    readonly businessName: "businessName";
    readonly ownerName: "ownerName";
    readonly ownerPhone: "ownerPhone";
    readonly ownerEmail: "ownerEmail";
    readonly alertEmail: "alertEmail";
    readonly passwordHash: "passwordHash";
    readonly maxDiscountPercent: "maxDiscountPercent";
    readonly aiEnabled: "aiEnabled";
    readonly paystackSecretEnc: "paystackSecretEnc";
    readonly receiptCounter: "receiptCounter";
    readonly orderCounter: "orderCounter";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MerchantScalarFieldEnum = (typeof MerchantScalarFieldEnum)[keyof typeof MerchantScalarFieldEnum];
export declare const WhatsAppSessionScalarFieldEnum: {
    readonly merchantId: "merchantId";
    readonly status: "status";
    readonly phone: "phone";
    readonly qr: "qr";
    readonly updatedAt: "updatedAt";
};
export type WhatsAppSessionScalarFieldEnum = (typeof WhatsAppSessionScalarFieldEnum)[keyof typeof WhatsAppSessionScalarFieldEnum];
export declare const WaAuthItemScalarFieldEnum: {
    readonly merchantId: "merchantId";
    readonly key: "key";
    readonly value: "value";
};
export type WaAuthItemScalarFieldEnum = (typeof WaAuthItemScalarFieldEnum)[keyof typeof WaAuthItemScalarFieldEnum];
export declare const ProductScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly name: "name";
    readonly description: "description";
    readonly category: "category";
    readonly attributes: "attributes";
    readonly imageKeys: "imageKeys";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];
export declare const VariantScalarFieldEnum: {
    readonly id: "id";
    readonly productId: "productId";
    readonly merchantId: "merchantId";
    readonly sku: "sku";
    readonly size: "size";
    readonly color: "color";
    readonly priceKobo: "priceKobo";
    readonly minPriceKobo: "minPriceKobo";
    readonly stock: "stock";
    readonly reserved: "reserved";
    readonly createdAt: "createdAt";
};
export type VariantScalarFieldEnum = (typeof VariantScalarFieldEnum)[keyof typeof VariantScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly phone: "phone";
    readonly name: "name";
    readonly address: "address";
    readonly createdAt: "createdAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const ConversationScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly customerId: "customerId";
    readonly chatId: "chatId";
    readonly mode: "mode";
    readonly handoffReason: "handoffReason";
    readonly handoffBy: "handoffBy";
    readonly humanSince: "humanSince";
    readonly lastMessageAt: "lastMessageAt";
    readonly createdAt: "createdAt";
};
export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum];
export declare const MessageScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly conversationId: "conversationId";
    readonly externalId: "externalId";
    readonly direction: "direction";
    readonly sender: "sender";
    readonly type: "type";
    readonly text: "text";
    readonly meta: "meta";
    readonly createdAt: "createdAt";
};
export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];
export declare const NegotiationScalarFieldEnum: {
    readonly id: "id";
    readonly conversationId: "conversationId";
    readonly variantId: "variantId";
    readonly rounds: "rounds";
    readonly lastOfferKobo: "lastOfferKobo";
    readonly quotedKobo: "quotedKobo";
    readonly agreedKobo: "agreedKobo";
    readonly status: "status";
    readonly updatedAt: "updatedAt";
};
export type NegotiationScalarFieldEnum = (typeof NegotiationScalarFieldEnum)[keyof typeof NegotiationScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly merchantId: "merchantId";
    readonly customerId: "customerId";
    readonly conversationId: "conversationId";
    readonly orderNumber: "orderNumber";
    readonly status: "status";
    readonly subtotalKobo: "subtotalKobo";
    readonly deliveryFeeKobo: "deliveryFeeKobo";
    readonly totalKobo: "totalKobo";
    readonly deliveryAddress: "deliveryAddress";
    readonly expiresAt: "expiresAt";
    readonly paidAt: "paidAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly variantId: "variantId";
    readonly quantity: "quantity";
    readonly listPriceKobo: "listPriceKobo";
    readonly unitPriceKobo: "unitPriceKobo";
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly reference: "reference";
    readonly status: "status";
    readonly amountKobo: "amountKobo";
    readonly checkoutUrl: "checkoutUrl";
    readonly rawEvent: "rawEvent";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const ReceiptScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly number: "number";
    readonly fileKey: "fileKey";
    readonly sentAt: "sentAt";
    readonly createdAt: "createdAt";
};
export type ReceiptScalarFieldEnum = (typeof ReceiptScalarFieldEnum)[keyof typeof ReceiptScalarFieldEnum];
export declare const ProcessedEventScalarFieldEnum: {
    readonly id: "id";
    readonly createdAt: "createdAt";
};
export type ProcessedEventScalarFieldEnum = (typeof ProcessedEventScalarFieldEnum)[keyof typeof ProcessedEventScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>;
export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>;
export type EnumProductCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductCategory'>;
export type ListEnumProductCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductCategory[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumConversationModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationMode'>;
export type ListEnumConversationModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationMode[]'>;
export type EnumHandoffSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HandoffSource'>;
export type ListEnumHandoffSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HandoffSource[]'>;
export type EnumMessageDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageDirection'>;
export type ListEnumMessageDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageDirection[]'>;
export type EnumMessageSenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageSender'>;
export type ListEnumMessageSenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageSender[]'>;
export type EnumNegotiationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NegotiationStatus'>;
export type ListEnumNegotiationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NegotiationStatus[]'>;
export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>;
export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>;
export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>;
export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    merchant?: Prisma.MerchantOmit;
    whatsAppSession?: Prisma.WhatsAppSessionOmit;
    waAuthItem?: Prisma.WaAuthItemOmit;
    product?: Prisma.ProductOmit;
    variant?: Prisma.VariantOmit;
    customer?: Prisma.CustomerOmit;
    conversation?: Prisma.ConversationOmit;
    message?: Prisma.MessageOmit;
    negotiation?: Prisma.NegotiationOmit;
    order?: Prisma.OrderOmit;
    orderItem?: Prisma.OrderItemOmit;
    payment?: Prisma.PaymentOmit;
    receipt?: Prisma.ReceiptOmit;
    processedEvent?: Prisma.ProcessedEventOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
