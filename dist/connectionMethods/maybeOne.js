"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeOne = void 0;
const errors_1 = require("../errors");
const createQueryId_1 = require("../utilities/createQueryId");
const query_1 = require("./query");
/**
 * Makes a query and expects exactly one result.
 * @throws DataIntegrityError If query returns multiple rows.
 */
const maybeOne = async (log, connection, clientConfiguration, slonikQuery, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const { rows } = await (0, query_1.query)(log, connection, clientConfiguration, slonikQuery, queryId);
    if (rows.length === 0) {
        return null;
    }
    if (rows.length > 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError(slonikQuery);
    }
    return rows[0];
};
exports.maybeOne = maybeOne;
//# sourceMappingURL=maybeOne.js.map