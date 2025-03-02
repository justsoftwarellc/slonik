"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const errors_1 = require("../errors");
const createQueryId_1 = require("../utilities/createQueryId");
const query_1 = require("./query");
const exists = async (log, connection, clientConfiguration, slonikQuery, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const { rows } = await (0, query_1.query)(log, connection, clientConfiguration, {
        sql: 'SELECT EXISTS(' + slonikQuery.sql + ')',
        values: slonikQuery.values,
    }, queryId);
    if (rows.length !== 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError(slonikQuery);
    }
    return Boolean(rows[0].exists);
};
exports.exists = exists;
//# sourceMappingURL=exists.js.map