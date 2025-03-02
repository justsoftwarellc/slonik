"use strict";
/* eslint-disable canonical/id-match */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoolConfiguration = void 0;
const Logger_1 = require("../Logger");
const parseDsn_1 = require("../utilities/parseDsn");
const createPoolConfiguration = (dsn, clientConfiguration) => {
    const connectionOptions = (0, parseDsn_1.parseDsn)(dsn);
    const poolConfiguration = {
        application_name: connectionOptions.applicationName,
        database: connectionOptions.databaseName,
        host: connectionOptions.host,
        password: connectionOptions.password,
        port: connectionOptions.port,
        ssl: false,
        user: connectionOptions.username,
    };
    if (clientConfiguration.ssl) {
        poolConfiguration.ssl = clientConfiguration.ssl;
    }
    else if (connectionOptions.sslMode === 'disable') {
        poolConfiguration.ssl = false;
    }
    else if (connectionOptions.sslMode === 'require') {
        poolConfiguration.ssl = true;
    }
    else if (connectionOptions.sslMode === 'no-verify') {
        poolConfiguration.ssl = {
            rejectUnauthorized: false,
        };
    }
    if (clientConfiguration.connectionTimeout !== 'DISABLE_TIMEOUT') {
        if (clientConfiguration.connectionTimeout === 0) {
            Logger_1.Logger.warn('connectionTimeout=0 sets timeout to 0 milliseconds; use connectionTimeout=DISABLE_TIMEOUT to disable timeout');
            poolConfiguration.connectionTimeoutMillis = 1;
        }
        else {
            poolConfiguration.connectionTimeoutMillis =
                clientConfiguration.connectionTimeout;
        }
    }
    if (clientConfiguration.statementTimeout !== 'DISABLE_TIMEOUT') {
        if (clientConfiguration.statementTimeout === 0) {
            Logger_1.Logger.warn('statementTimeout=0 sets timeout to 0 milliseconds; use statementTimeout=DISABLE_TIMEOUT to disable timeout');
            poolConfiguration.statement_timeout = 1;
        }
        else {
            poolConfiguration.statement_timeout =
                clientConfiguration.statementTimeout;
        }
    }
    if (clientConfiguration.idleTimeout !== 'DISABLE_TIMEOUT') {
        if (clientConfiguration.idleTimeout === 0) {
            Logger_1.Logger.warn('idleTimeout=0 sets timeout to 0 milliseconds; use idleTimeout=DISABLE_TIMEOUT to disable timeout');
            poolConfiguration.idleTimeoutMillis = 1;
        }
        else {
            poolConfiguration.idleTimeoutMillis = clientConfiguration.idleTimeout;
        }
    }
    if (clientConfiguration.idleInTransactionSessionTimeout !== 'DISABLE_TIMEOUT') {
        if (clientConfiguration.idleInTransactionSessionTimeout === 0) {
            Logger_1.Logger.warn('idleInTransactionSessionTimeout=0 sets timeout to 0 milliseconds; use idleInTransactionSessionTimeout=DISABLE_TIMEOUT to disable timeout');
            poolConfiguration.idle_in_transaction_session_timeout = 1;
        }
        else {
            poolConfiguration.idle_in_transaction_session_timeout =
                clientConfiguration.idleInTransactionSessionTimeout;
        }
    }
    if (clientConfiguration.maximumPoolSize) {
        poolConfiguration.max = clientConfiguration.maximumPoolSize;
    }
    return poolConfiguration;
};
exports.createPoolConfiguration = createPoolConfiguration;
//# sourceMappingURL=createPoolConfiguration.js.map