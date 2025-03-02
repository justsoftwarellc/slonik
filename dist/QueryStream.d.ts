/// <reference types="node" />
import { Readable, type ReadableOptions } from 'stream';
import Cursor from 'pg-cursor';
/**
 * @see https://github.com/brianc/node-pg-query-stream
 * @see https://github.com/brianc/node-pg-query-stream/issues/51
 */
export declare class QueryStream extends Readable {
    _reading: boolean;
    _closed: boolean;
    _result: unknown;
    cursor: typeof Cursor;
    batchSize: number;
    handleRowDescription: Function;
    handlePortalSuspended: Function;
    handleDataRow: Function;
    handleCommandComplete: Function;
    handleReadyForQuery: Function;
    handleError: Function;
    constructor(text: unknown, values: unknown, options?: ReadableOptions & {
        batchSize?: number;
    });
    submit(connection: Object): void;
    _destroy(error: Error, onDestroy: Function): void;
    _read(size: number): void;
}
//# sourceMappingURL=QueryStream.d.ts.map