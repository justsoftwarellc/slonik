"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJsonSqlFragment = void 0;
const errors_1 = require("../errors");
const Logger_1 = require("../Logger");
const isPlainObject_1 = require("../utilities/isPlainObject");
const safeStringify_1 = require("../utilities/safeStringify");
const serialize_error_1 = require("serialize-error");
const log = Logger_1.Logger.child({
    namespace: 'createJsonSqlFragment',
});
const createJsonSqlFragment = (token, greatestParameterPosition, binary) => {
    let value;
    if (token.value === undefined) {
        throw new errors_1.InvalidInputError('JSON payload must not be undefined.');
    }
    else if (token.value === null) {
        value = 'null';
        // @todo Deep check Array.
    }
    else if (!(0, isPlainObject_1.isPlainObject)(token.value) &&
        !Array.isArray(token.value) &&
        !['number', 'string', 'boolean'].includes(typeof token.value)) {
        throw new errors_1.InvalidInputError('JSON payload must be a primitive value or a plain object.');
    }
    else {
        try {
            value = (0, safeStringify_1.safeStringify)(token.value);
        }
        catch (error) {
            log.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'payload cannot be stringified');
            throw new errors_1.InvalidInputError('JSON payload cannot be stringified.');
        }
        if (value === undefined) {
            throw new errors_1.InvalidInputError('JSON payload cannot be stringified. The resulting value is undefined.');
        }
    }
    return {
        sql: '$' +
            String(greatestParameterPosition + 1) +
            '::' +
            (binary ? 'jsonb' : 'json'),
        values: [value],
    };
};
exports.createJsonSqlFragment = createJsonSqlFragment;
//# sourceMappingURL=createJsonSqlFragment.js.map