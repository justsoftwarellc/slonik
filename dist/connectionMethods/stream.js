"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const QueryStream_1 = require("../QueryStream");
const executeQuery_1 = require("../routines/executeQuery");
const through = __importStar(require("through2"));
const stream = async (connectionLogger, connection, clientConfiguration, slonikSql, streamHandler, uid, options) => {
    return await (0, executeQuery_1.executeQuery)(connectionLogger, connection, clientConfiguration, slonikSql, undefined, async (finalConnection, finalSql, finalValues, executionContext, actualQuery) => {
        const query = new QueryStream_1.QueryStream(finalSql, finalValues, options);
        const queryStream = finalConnection.query(query);
        const rowTransformers = [];
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.transformRow) {
                rowTransformers.push(interceptor.transformRow);
            }
        }
        return await new Promise((resolve, reject) => {
            queryStream.on('error', (error) => {
                reject(error);
            });
            const transformedStream = queryStream.pipe(through.obj(function (datum, enc, callback) {
                let finalRow = datum.row;
                if (rowTransformers.length) {
                    for (const rowTransformer of rowTransformers) {
                        finalRow = rowTransformer(executionContext, actualQuery, finalRow, datum.fields);
                    }
                }
                // eslint-disable-next-line @babel/no-invalid-this
                this.push({
                    fields: datum.fields,
                    row: finalRow,
                });
                callback();
            }));
            transformedStream.on('end', () => {
                resolve({
                    command: 'SELECT',
                    fields: [],
                    notices: [],
                    rowCount: 0,
                    rows: [],
                });
            });
            // Invoked if stream is destroyed using transformedStream.destroy().
            transformedStream.on('close', () => {
                if (!queryStream.destroyed) {
                    queryStream.destroy();
                }
                resolve({
                    command: 'SELECT',
                    fields: [],
                    notices: [],
                    rowCount: 0,
                    rows: [],
                });
            });
            transformedStream.on('error', (error) => {
                queryStream.destroy(error);
            });
            transformedStream.once('readable', () => {
                streamHandler(transformedStream);
            });
        });
    });
};
exports.stream = stream;
//# sourceMappingURL=stream.js.map