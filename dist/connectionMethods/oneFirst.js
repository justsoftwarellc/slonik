"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneFirst = void 0;
const errors_1 = require("../errors");
const createQueryId_1 = require("../utilities/createQueryId");
const one_1 = require("./one");
/**
 * Makes a query and expects exactly one result.
 * Returns value of the first column.
 * @throws NotFoundError If query returns no rows.
 * @throws DataIntegrityError If query returns multiple rows.
 */
const oneFirst = async (log, connection, clientConfiguration, slonikSql, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const row = await (0, one_1.one)(log, connection, clientConfiguration, slonikSql, queryId);
    const keys = Object.keys(row);
    if (keys.length > 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.UnexpectedStateError();
    }
    return row[keys[0]];
};
exports.oneFirst = oneFirst;
//# sourceMappingURL=oneFirst.js.map