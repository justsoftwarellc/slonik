"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPool = void 0;
const transaction_1 = require("../connectionMethods/transaction");
const createConnection_1 = require("../factories/createConnection");
const state_1 = require("../state");
const bindPool = (parentLog, pool, clientConfiguration) => {
    return {
        any: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.any(query);
            }, async (newPool) => {
                return await newPool.any(query);
            }, query);
        },
        anyFirst: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.anyFirst(query);
            }, async (newPool) => {
                return await newPool.anyFirst(query);
            }, query);
        },
        configuration: clientConfiguration,
        connect: async (connectionHandler) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'EXPLICIT', async (connectionLog, connection, boundConnection) => {
                return await connectionHandler(boundConnection);
            }, async (newPool) => {
                return await newPool.connect(connectionHandler);
            });
        },
        end: async () => {
            const poolState = (0, state_1.getPoolState)(pool);
            poolState.ended = true;
            await pool.end();
        },
        exists: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.exists(query);
            }, async (newPool) => {
                return await newPool.exists(query);
            }, query);
        },
        getPoolState: () => {
            const poolState = (0, state_1.getPoolState)(pool);
            return {
                activeConnectionCount: pool.totalCount - pool.idleCount,
                ended: poolState.ended,
                idleConnectionCount: pool.idleCount,
                waitingClientCount: pool.waitingCount,
            };
        },
        many: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.many(query);
            }, async (newPool) => {
                return await newPool.many(query);
            }, query);
        },
        manyFirst: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.manyFirst(query);
            }, async (newPool) => {
                return await newPool.manyFirst(query);
            }, query);
        },
        maybeOne: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.maybeOne(query);
            }, async (newPool) => {
                return await newPool.maybeOne(query);
            }, query);
        },
        maybeOneFirst: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.maybeOneFirst(query);
            }, async (newPool) => {
                return await newPool.maybeOneFirst(query);
            }, query);
        },
        one: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.one(query);
            }, async (newPool) => {
                return await newPool.one(query);
            }, query);
        },
        oneFirst: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.oneFirst(query);
            }, async (newPool) => {
                return await newPool.oneFirst(query);
            }, query);
        },
        query: async (query) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.query(query);
            }, async (newPool) => {
                return await newPool.query(query);
            }, query);
        },
        stream: async (streamQuery, streamHandler, config) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', async (connectionLog, connection, boundConnection) => {
                return await boundConnection.stream(streamQuery, streamHandler, config);
            }, async (newPool) => {
                return await newPool.stream(streamQuery, streamHandler, config);
            }, streamQuery);
        },
        transaction: async (transactionHandler, transactionRetryLimit) => {
            return await (0, createConnection_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_TRANSACTION', async (connectionLog, connection) => {
                return await (0, transaction_1.transaction)(connectionLog, connection, clientConfiguration, transactionHandler, transactionRetryLimit);
            }, async (newPool) => {
                return await newPool.transaction(transactionHandler);
            });
        },
    };
};
exports.bindPool = bindPool;
//# sourceMappingURL=bindPool.js.map