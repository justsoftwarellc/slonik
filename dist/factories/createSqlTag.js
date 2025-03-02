"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSqlTag = void 0;
const errors_1 = require("../errors");
const Logger_1 = require("../Logger");
const tokens_1 = require("../tokens");
const escapeLiteralValue_1 = require("../utilities/escapeLiteralValue");
const isPrimitiveValueExpression_1 = require("../utilities/isPrimitiveValueExpression");
const isSqlToken_1 = require("../utilities/isSqlToken");
const safeStringify_1 = require("../utilities/safeStringify");
const createSqlTokenSqlFragment_1 = require("./createSqlTokenSqlFragment");
const zod_1 = require("zod");
const log = Logger_1.Logger.child({
    namespace: 'sql',
});
const createFragment = (parts, values) => {
    let rawSql = '';
    const parameterValues = [];
    let index = 0;
    for (const part of parts) {
        const token = values[index++];
        rawSql += part;
        if (index >= parts.length) {
            continue;
        }
        if (token === undefined) {
            log.debug({
                index,
                parts: JSON.parse((0, safeStringify_1.safeStringify)(parts)),
                values: JSON.parse((0, safeStringify_1.safeStringify)(values)),
            }, 'bound values');
            throw new errors_1.InvalidInputError('SQL tag cannot be bound an undefined value.');
        }
        else if ((0, isPrimitiveValueExpression_1.isPrimitiveValueExpression)(token)) {
            rawSql += '$' + String(parameterValues.length + 1);
            parameterValues.push(token);
        }
        else if ((0, isSqlToken_1.isSqlToken)(token)) {
            const sqlFragment = (0, createSqlTokenSqlFragment_1.createSqlTokenSqlFragment)(token, parameterValues.length);
            rawSql += sqlFragment.sql;
            parameterValues.push(...sqlFragment.values);
        }
        else {
            log.error({
                constructedSql: rawSql,
                index,
                offendingToken: JSON.parse((0, safeStringify_1.safeStringify)(token)),
            }, 'unexpected value expression');
            throw new TypeError('Unexpected value expression.');
        }
    }
    return {
        sql: rawSql,
        values: parameterValues,
    };
};
const createSqlTag = (configuration = {}) => {
    const typeAliases = configuration.typeAliases;
    return {
        array: (values, memberType) => {
            return Object.freeze({
                memberType,
                type: tokens_1.ArrayToken,
                values,
            });
        },
        binary: (data) => {
            return Object.freeze({
                data,
                type: tokens_1.BinaryToken,
            });
        },
        date: (date) => {
            return Object.freeze({
                date,
                type: tokens_1.DateToken,
            });
        },
        fragment: (parts, ...args) => {
            return Object.freeze({
                ...createFragment(parts, args),
                type: tokens_1.FragmentToken,
            });
        },
        identifier: (names) => {
            return Object.freeze({
                names,
                type: tokens_1.IdentifierToken,
            });
        },
        interval: (interval) => {
            return Object.freeze({
                interval,
                type: tokens_1.IntervalToken,
            });
        },
        join: (members, glue) => {
            return Object.freeze({
                glue,
                members,
                type: tokens_1.ListToken,
            });
        },
        json: (value) => {
            return Object.freeze({
                type: tokens_1.JsonToken,
                value,
            });
        },
        jsonb: (value) => {
            return Object.freeze({
                type: tokens_1.JsonBinaryToken,
                value,
            });
        },
        literalValue: (value) => {
            return Object.freeze({
                sql: (0, escapeLiteralValue_1.escapeLiteralValue)(value),
                type: tokens_1.FragmentToken,
                values: [],
            });
        },
        timestamp: (date) => {
            return Object.freeze({
                date,
                type: tokens_1.TimestampToken,
            });
        },
        type: (parser) => {
            return (parts, ...args) => {
                return Object.freeze({
                    ...createFragment(parts, args),
                    parser,
                    type: tokens_1.QueryToken,
                });
            };
        },
        typeAlias: (parserAlias) => {
            if (!(typeAliases === null || typeAliases === void 0 ? void 0 : typeAliases[parserAlias])) {
                throw new Error('Type alias "' + String(parserAlias) + '" does not exist.');
            }
            return (parts, ...args) => {
                return Object.freeze({
                    ...createFragment(parts, args),
                    parser: typeAliases[parserAlias],
                    type: tokens_1.QueryToken,
                });
            };
        },
        unnest: (tuples, columnTypes) => {
            return Object.freeze({
                columnTypes,
                tuples,
                type: tokens_1.UnnestToken,
            });
        },
        unsafe: (parts, ...args) => {
            return Object.freeze({
                ...createFragment(parts, args),
                parser: zod_1.z.any(),
                type: tokens_1.QueryToken,
            });
        },
    };
};
exports.createSqlTag = createSqlTag;
//# sourceMappingURL=createSqlTag.js.map