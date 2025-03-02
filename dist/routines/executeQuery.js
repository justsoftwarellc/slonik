"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = void 0;
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const state_1 = require("../state");
const createQueryId_1 = require("../utilities/createQueryId");
const defer_1 = require("../utilities/defer");
const getStackTrace_1 = require("../utilities/getStackTrace");
const serialize_error_1 = require("serialize-error");
const retryQuery = async (connectionLogger, connection, query, retryLimit) => {
    let result;
    let remainingRetries = retryLimit;
    let attempt = 0;
    // @todo Provide information about the queries being retried to the logger.
    while (remainingRetries-- > 0) {
        attempt++;
        try {
            connectionLogger.trace({
                attempt,
                queryId: query.executionContext.queryId,
            }, 'retrying query');
            result = await query.executionRoutine(connection, query.sql, 
            // @todo Refresh execution context to reflect that the query has been re-tried.
            query.values, 
            // This (probably) requires changing `queryId` and `queryInputTime`.
            // It should be needed only for the last query (because other queries will not be processed by the middlewares).
            query.executionContext, {
                sql: query.sql,
                values: query.values,
            });
            // If the attempt succeeded break out of the loop
            break;
        }
        catch (error) {
            if (typeof error.code === 'string' &&
                error.code.startsWith(constants_1.TRANSACTION_ROLLBACK_ERROR_PREFIX) &&
                remainingRetries > 0) {
                continue;
            }
            throw error;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result;
};
// eslint-disable-next-line complexity
const executeQuery = async (connectionLogger, connection, clientConfiguration, query, inheritedQueryId, executionRoutine) => {
    var _a, _b;
    const poolClientState = (0, state_1.getPoolClientState)(connection);
    if (poolClientState.terminated) {
        throw new errors_1.BackendTerminatedError(poolClientState.terminated);
    }
    if (query.sql.trim() === '') {
        throw new errors_1.InvalidInputError('Unexpected SQL input. Query cannot be empty.');
    }
    if (query.sql.trim() === '$1') {
        throw new errors_1.InvalidInputError('Unexpected SQL input. Query cannot be empty. Found only value binding.');
    }
    const queryInputTime = process.hrtime.bigint();
    let stackTrace = null;
    if (clientConfiguration.captureStackTrace) {
        stackTrace = (0, getStackTrace_1.getStackTrace)();
    }
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const log = connectionLogger.child({
        queryId,
    });
    const originalQuery = {
        sql: query.sql,
        values: query.values,
    };
    let actualQuery = {
        ...originalQuery,
    };
    const executionContext = {
        connectionId: poolClientState.connectionId,
        log,
        originalQuery,
        poolId: poolClientState.poolId,
        queryId,
        queryInputTime,
        resultParser: query.parser,
        sandbox: {},
        stackTrace,
        transactionId: poolClientState.transactionId,
    };
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.beforeTransformQuery) {
            await interceptor.beforeTransformQuery(executionContext, actualQuery);
        }
    }
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.transformQuery) {
            actualQuery = interceptor.transformQuery(executionContext, actualQuery);
        }
    }
    let result;
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.beforeQueryExecution) {
            result = await interceptor.beforeQueryExecution(executionContext, actualQuery);
            if (result) {
                log.info('beforeQueryExecution interceptor produced a result; short-circuiting query execution using beforeQueryExecution result');
                return result;
            }
        }
    }
    const notices = [];
    const noticeListener = (notice) => {
        notices.push(notice);
    };
    const activeQuery = (0, defer_1.defer)();
    const blockingPromise = (_b = (_a = poolClientState.activeQuery) === null || _a === void 0 ? void 0 : _a.promise) !== null && _b !== void 0 ? _b : null;
    poolClientState.activeQuery = activeQuery;
    await blockingPromise;
    connection.on('notice', noticeListener);
    const queryWithContext = {
        executionContext,
        executionRoutine,
        sql: actualQuery.sql,
        values: actualQuery.values,
    };
    try {
        try {
            try {
                result = await executionRoutine(connection, actualQuery.sql, actualQuery.values, executionContext, actualQuery);
            }
            catch (error) {
                const shouldRetry = typeof error.code === 'string' &&
                    error.code.startsWith(constants_1.TRANSACTION_ROLLBACK_ERROR_PREFIX) &&
                    clientConfiguration.queryRetryLimit > 0;
                // Transactions errors in queries that are part of a transaction are handled by the transaction/nestedTransaction functions
                if (shouldRetry && !poolClientState.transactionId) {
                    result = await retryQuery(connectionLogger, connection, queryWithContext, clientConfiguration.queryRetryLimit);
                }
                else {
                    throw error;
                }
            }
        }
        catch (error) {
            log.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'execution routine produced an error');
            // 'Connection terminated' refers to node-postgres error.
            // @see https://github.com/brianc/node-postgres/blob/eb076db5d47a29c19d3212feac26cd7b6d257a95/lib/client.js#L199
            if (error.code === '57P01' || error.message === 'Connection terminated') {
                poolClientState.terminated = error;
                throw new errors_1.BackendTerminatedError(error);
            }
            if (error.code === '22P02') {
                throw new errors_1.InvalidInputError(error);
            }
            if (error.code === '57014' &&
                error.message.includes('canceling statement due to statement timeout')) {
                throw new errors_1.StatementTimeoutError(error);
            }
            if (error.code === '57014') {
                throw new errors_1.StatementCancelledError(error);
            }
            if (error.message ===
                'tuple to be locked was already moved to another partition due to concurrent update') {
                throw new errors_1.TupleMovedToAnotherPartitionError(error);
            }
            if (error.code === '23502') {
                throw new errors_1.NotNullIntegrityConstraintViolationError(error, error.constraint);
            }
            if (error.code === '23503') {
                throw new errors_1.ForeignKeyIntegrityConstraintViolationError(error, error.constraint);
            }
            if (error.code === '23505') {
                throw new errors_1.UniqueIntegrityConstraintViolationError(error, error.constraint);
            }
            if (error.code === '23514') {
                throw new errors_1.CheckIntegrityConstraintViolationError(error, error.constraint);
            }
            error.notices = notices;
            throw error;
        }
        finally {
            connection.off('notice', noticeListener);
            activeQuery.resolve(null);
        }
    }
    catch (error) {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.queryExecutionError) {
                await interceptor.queryExecutionError(executionContext, actualQuery, error, notices);
            }
        }
        error.notices = notices;
        throw error;
    }
    if (!result) {
        throw new errors_1.UnexpectedStateError();
    }
    // @ts-expect-error -- We want to keep notices as readonly for consumer, but write to it here.
    result.notices = notices;
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.afterQueryExecution) {
            await interceptor.afterQueryExecution(executionContext, actualQuery, result);
        }
    }
    // Stream does not have `rows` in the result object and all rows are already transformed.
    if (result.rows) {
        const interceptors = clientConfiguration.interceptors.slice();
        for (const interceptor of interceptors) {
            if (interceptor.transformRow) {
                const { transformRow } = interceptor;
                const { fields } = result;
                const rows = [];
                for (const row of result.rows) {
                    rows.push(transformRow(executionContext, actualQuery, row, fields));
                }
                result = {
                    ...result,
                    rows,
                };
            }
        }
    }
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.beforeQueryResult) {
            await interceptor.beforeQueryResult(executionContext, actualQuery, result);
        }
    }
    return result;
};
exports.executeQuery = executeQuery;
//# sourceMappingURL=executeQuery.js.map