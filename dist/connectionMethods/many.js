"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.many = void 0;
const errors_1 = require("../errors");
const createQueryId_1 = require("../utilities/createQueryId");
const query_1 = require("./query");
/**
 * Makes a query and expects at least 1 result.
 * @throws NotFoundError If query returns no rows.
 */
const many = async (log, connection, clientConfiguration, slonikQuery, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const { rows } = await (0, query_1.query)(log, connection, clientConfiguration, slonikQuery, queryId);
    if (rows.length === 0) {
        log.error({
            queryId,
        }, 'NotFoundError');
        throw new errors_1.NotFoundError(slonikQuery);
    }
    return rows;
};
exports.many = many;
//# sourceMappingURL=many.js.map