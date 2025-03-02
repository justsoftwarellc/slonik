/// <reference types="node" />
export declare const sql: {
    array: (values: readonly import("./types").PrimitiveValueExpression[], memberType: string | import("./types").SqlToken) => import("./types").ArraySqlToken;
    binary: (data: Buffer) => import("./types").BinarySqlToken;
    date: (date: Date) => import("./types").DateSqlToken;
    fragment: (parts: readonly string[], ...args: readonly import("./types").ValueExpression[]) => Readonly<{
        type: "SLONIK_TOKEN_FRAGMENT";
        sql: string;
        values: import("./types").PrimitiveValueExpression[];
    }>;
    identifier: (names: readonly string[]) => import("./types").IdentifierSqlToken;
    interval: (interval: import("./types").IntervalInput) => import("./types").IntervalSqlToken;
    join: (members: readonly import("./types").ValueExpression[], glue: import("./types").SqlFragment) => import("./types").ListSqlToken;
    json: (value: import("./types").SerializableValue) => import("./types").JsonSqlToken;
    jsonb: (value: import("./types").SerializableValue) => import("./types").JsonBinarySqlToken;
    literalValue: (value: string) => import("./types").SqlFragment;
    timestamp: (date: Date) => import("./types").TimestampSqlToken;
    type: <T extends import("zod").ZodTypeAny>(parser: T) => (parts: readonly string[], ...args: readonly import("./types").ValueExpression[]) => Readonly<{
        parser: T;
        type: "SLONIK_TOKEN_QUERY";
        sql: string;
        values: import("./types").PrimitiveValueExpression[];
    }>;
    typeAlias: <Y extends PropertyKey>(parserAlias: Y) => (parts: readonly string[], ...args: readonly import("./types").ValueExpression[]) => Readonly<{
        parser: Record<PropertyKey, import("zod").ZodTypeAny>[Y];
        type: "SLONIK_TOKEN_QUERY";
        sql: string;
        values: import("./types").PrimitiveValueExpression[];
    }>;
    unnest: (tuples: readonly (readonly import("./types").PrimitiveValueExpression[])[], columnTypes: [...string[], string][] | (string | import("./types").SqlFragment)[]) => import("./types").UnnestSqlToken;
    unsafe: (parts: readonly string[], ...args: readonly import("./types").ValueExpression[]) => Readonly<{
        parser: import("zod").ZodAny;
        type: "SLONIK_TOKEN_QUERY";
        sql: string;
        values: import("./types").PrimitiveValueExpression[];
    }>;
};
export { BackendTerminatedError, CheckIntegrityConstraintViolationError, ConnectionError, DataIntegrityError, ForeignKeyIntegrityConstraintViolationError, IntegrityConstraintViolationError, InvalidConfigurationError, InvalidInputError, NotFoundError, NotNullIntegrityConstraintViolationError, SchemaValidationError, SlonikError, StatementCancelledError, StatementTimeoutError, TupleMovedToAnotherPartitionError, UnexpectedStateError, UniqueIntegrityConstraintViolationError, } from './errors';
export { createMockPool } from './factories/createMockPool';
export { createMockQueryResult } from './factories/createMockQueryResult';
export { createPool } from './factories/createPool';
export { createSqlTag } from './factories/createSqlTag';
export { createSqlTokenSqlFragment } from './factories/createSqlTokenSqlFragment';
export { createTypeParserPreset } from './factories/createTypeParserPreset';
export { createBigintTypeParser } from './factories/typeParsers/createBigintTypeParser';
export { createDateTypeParser } from './factories/typeParsers/createDateTypeParser';
export { createIntervalTypeParser } from './factories/typeParsers/createIntervalTypeParser';
export { createNumericTypeParser } from './factories/typeParsers/createNumericTypeParser';
export { createTimestampTypeParser } from './factories/typeParsers/createTimestampTypeParser';
export { createTimestampWithTimeZoneTypeParser } from './factories/typeParsers/createTimestampWithTimeZoneTypeParser';
export type { ArraySqlToken, BinarySqlToken, ClientConfiguration, ClientConfigurationInput, CommonQueryMethods, Connection, ConnectionOptions, ConnectionRoutine, DatabaseConnection, DatabasePool, DatabasePoolConnection, DatabaseTransactionConnection, Field, FragmentSqlToken, IdentifierNormalizer, IdentifierSqlToken, Interceptor, JsonBinarySqlToken, JsonSqlToken, ListSqlToken, MockPoolOverrides, PoolContext, PrimitiveValueExpression, Query, QueryContext, QueryFunction, QueryResult, QueryResultRow, QueryResultRowColumn, QuerySqlToken, SerializableValue, SqlFragment, SqlTag, SqlToken, TypeNameIdentifier, TypeParser, UnnestSqlToken, ValueExpression, } from './types';
export { isSqlToken } from './utilities/isSqlToken';
export { parseDsn } from './utilities/parseDsn';
export { stringifyDsn } from './utilities/stringifyDsn';
//# sourceMappingURL=index.d.ts.map