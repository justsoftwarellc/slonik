"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.one = void 0;
const errors_1 = require("../errors");
const createQueryId_1 = require("../utilities/createQueryId");
const query_1 = require("./query");
/**
 * Makes a query and expects exactly one result.
 * @throws NotFoundError If query returns no rows.
 * @throws DataIntegrityError If query returns multiple rows.
 */
const one = async (log, connection, clientConfiguration, slonikQuery, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const { rows } = await (0, query_1.query)(log, connection, clientConfiguration, slonikQuery, queryId);
    if (rows.length === 0) {
        log.error({
            queryId,
        }, 'NotFoundError');
        throw new errors_1.NotFoundError(slonikQuery);
    }
    if (rows.length > 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError(slonikQuery);
    }
    return rows[0];
};
exports.one = one;
//# sourceMappingURL=one.js.map