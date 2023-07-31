"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackTrace = void 0;
const getStackTrace = () => {
    const oldStackTraceLimit = Error.stackTraceLimit;
    const oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, structuredStackTrace) => {
        return structuredStackTrace;
    };
    const honeypot = {
        stack: [],
    };
    Error.captureStackTrace(honeypot);
    const callSites = honeypot.stack;
    Error.stackTraceLimit = oldStackTraceLimit;
    Error.prepareStackTrace = oldPrepareStackTrace;
    const trail = callSites.slice(1);
    return trail.map((callSite) => {
        var _a;
        return {
            columnNumber: callSite.getColumnNumber(),
            fileName: (_a = callSite.getFileName()) !== null && _a !== void 0 ? _a : null,
            functionName: callSite.getFunctionName(),
            lineNumber: callSite.getLineNumber(),
        };
    });
};
exports.getStackTrace = getStackTrace;
//# sourceMappingURL=getStackTrace.js.map