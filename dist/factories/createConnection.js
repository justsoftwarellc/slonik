"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const bindPoolConnection_1 = require("../binders/bindPoolConnection");
const errors_1 = require("../errors");
const state_1 = require("../state");
const createUid_1 = require("../utilities/createUid");
const serialize_error_1 = require("serialize-error");
const terminatePoolConnection = (connection) => {
    // tells the pool to destroy this client
    connection.release(true);
};
const destroyBoundConnection = (boundConnection) => {
    const boundConnectionMethods = [
        'any',
        'anyFirst',
        'exists',
        'many',
        'manyFirst',
        'maybeOne',
        'maybeOneFirst',
        'one',
        'oneFirst',
        'query',
        'stream',
        'transaction',
    ];
    for (const boundConnectionMethod of boundConnectionMethods) {
        boundConnection[boundConnectionMethod] = async () => {
            throw new Error('Cannot use released connection');
        };
    }
};
const createConnection = async (parentLog, pool, clientConfiguration, connectionType, connectionHandler, poolHandler, query = null) => {
    const poolState = (0, state_1.getPoolState)(pool);
    if (poolState.ended) {
        throw new errors_1.UnexpectedStateError('Connection pool shutdown has been already initiated. Cannot create a new connection.');
    }
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.beforePoolConnection) {
            const maybeNewPool = await interceptor.beforePoolConnection({
                log: parentLog,
                poolId: poolState.poolId,
                query,
            });
            if (maybeNewPool) {
                return await poolHandler(maybeNewPool);
            }
        }
    }
    let connection;
    let remainingConnectionRetryLimit = clientConfiguration.connectionRetryLimit;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        remainingConnectionRetryLimit--;
        try {
            connection = await pool.connect();
            state_1.poolClientStateMap.set(connection, {
                connectionId: (0, createUid_1.createUid)(),
                mock: poolState.mock,
                poolId: poolState.poolId,
                terminated: null,
                transactionDepth: null,
                transactionId: null,
            });
            break;
        }
        catch (error) {
            parentLog.error({
                error: (0, serialize_error_1.serializeError)(error),
                remainingConnectionRetryLimit,
            }, 'cannot establish connection');
            if (remainingConnectionRetryLimit > 1) {
                parentLog.info('retrying connection');
                continue;
            }
            else {
                throw new errors_1.ConnectionError(error.message);
            }
        }
    }
    if (!connection) {
        throw new errors_1.UnexpectedStateError('Connection handle is not present.');
    }
    const poolClientState = (0, state_1.getPoolClientState)(connection);
    const { connectionId } = poolClientState;
    const connectionLog = parentLog.child({
        connectionId,
    });
    const connectionContext = {
        connectionId,
        connectionType,
        log: connectionLog,
        poolId: poolState.poolId,
    };
    const boundConnection = (0, bindPoolConnection_1.bindPoolConnection)(connectionLog, connection, clientConfiguration);
    try {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.afterPoolConnection) {
                await interceptor.afterPoolConnection(connectionContext, boundConnection);
            }
        }
    }
    catch (error) {
        terminatePoolConnection(connection);
        throw error;
    }
    let result;
    try {
        result = await connectionHandler(connectionLog, connection, boundConnection, clientConfiguration);
    }
    catch (error) {
        terminatePoolConnection(connection);
        throw error;
    }
    try {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.beforePoolConnectionRelease) {
                await interceptor.beforePoolConnectionRelease(connectionContext, boundConnection);
            }
        }
    }
    catch (error) {
        terminatePoolConnection(connection);
        throw error;
    }
    destroyBoundConnection(boundConnection);
    connection.release();
    return result;
};
exports.createConnection = createConnection;
//# sourceMappingURL=createConnection.js.map