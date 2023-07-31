"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUid = void 0;
const uuidv4_1 = require("uuidv4");
const createUid = () => {
    return (0, uuidv4_1.uuid)().split('-', 1)[0];
};
exports.createUid = createUid;
//# sourceMappingURL=createUid.js.map