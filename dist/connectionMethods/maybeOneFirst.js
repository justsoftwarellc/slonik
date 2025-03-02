"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeOneFirst = void 0;
const errors_1 = require("../errors");
const createQueryId_1 = require("../utilities/createQueryId");
const maybeOne_1 = require("./maybeOne");
/**
 * Makes a query and expects exactly one result.
 * Returns value of the first column.
 * @throws DataIntegrityError If query returns multiple rows.
 */
const maybeOneFirst = async (log, connection, clientConfiguration, query, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, createQueryId_1.createQueryId)();
    const row = await (0, maybeOne_1.maybeOne)(log, connection, clientConfiguration, query, queryId);
    if (!row) {
        return null;
    }
    const keys = Object.keys(row);
    if (keys.length !== 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError(query);
    }
    return row[keys[0]];
};
exports.maybeOneFirst = maybeOneFirst;
//# sourceMappingURL=maybeOneFirst.js.map