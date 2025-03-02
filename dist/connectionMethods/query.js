"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const executeQuery_1 = require("../routines/executeQuery");
const query = async (connectionLogger, connection, clientConfiguration, slonikSql, inheritedQueryId) => {
    return await (0, executeQuery_1.executeQuery)(connectionLogger, connection, clientConfiguration, slonikSql, inheritedQueryId, async (finalConnection, finalSql, finalValues) => {
        var _a;
        const result = await finalConnection.query(finalSql, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        finalValues);
        const fields = [];
        if (result.fields) {
            for (const field of result.fields) {
                fields.push({
                    dataTypeId: field.dataTypeID,
                    name: field.name,
                });
            }
        }
        return {
            command: result.command,
            fields,
            notices: (_a = result.notices) !== null && _a !== void 0 ? _a : [],
            rowCount: result.rowCount || 0,
            rows: result.rows || [],
        };
    });
};
exports.query = query;
//# sourceMappingURL=query.js.map