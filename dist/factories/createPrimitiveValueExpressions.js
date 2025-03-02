"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrimitiveValueExpressions = void 0;
const errors_1 = require("../errors");
const Logger_1 = require("../Logger");
const safeStringify_1 = require("../utilities/safeStringify");
const log = Logger_1.Logger.child({
    namespace: 'createPrimitiveValueExpressions',
});
const createPrimitiveValueExpressions = (values) => {
    const primitiveValueExpressions = [];
    for (const value of values) {
        if (Array.isArray(value) ||
            Buffer.isBuffer(value) ||
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            value === null) {
            primitiveValueExpressions.push(value);
        }
        else {
            log.warn({
                value: JSON.parse((0, safeStringify_1.safeStringify)(value)),
                values: JSON.parse((0, safeStringify_1.safeStringify)(values)),
            }, 'unexpected value expression');
            throw new errors_1.UnexpectedStateError('Unexpected value expression.');
        }
    }
    return primitiveValueExpressions;
};
exports.createPrimitiveValueExpressions = createPrimitiveValueExpressions;
//# sourceMappingURL=createPrimitiveValueExpressions.js.map