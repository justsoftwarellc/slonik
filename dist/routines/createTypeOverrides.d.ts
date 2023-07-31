import { type TypeParser } from '../types';
import { type Client as PgClient } from 'pg';
export declare const createTypeOverrides: (pool: PgClient, typeParsers: readonly TypeParser[]) => Promise<(oid: number) => any>;
//# sourceMappingURL=createTypeOverrides.d.ts.map