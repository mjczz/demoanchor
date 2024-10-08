"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idl_1 = require("../../coder/borsh/idl");
const base64_1 = require("../../utils/bytes/base64");
class ViewFactory {
    static build(programId, idlIx, simulateFn, idl) {
        const isWritable = idlIx.accounts.find((a) => a.writable);
        const hasReturn = !!idlIx.returns;
        if (isWritable || !hasReturn)
            return;
        const view = async (...args) => {
            let simulationResult = await simulateFn(...args);
            const returnPrefix = `Program return: ${programId} `;
            let returnLog = simulationResult.raw.find((l) => l.startsWith(returnPrefix));
            if (!returnLog) {
                throw new Error("View expected return log");
            }
            let returnData = (0, base64_1.decode)(returnLog.slice(returnPrefix.length));
            let returnType = idlIx.returns;
            if (!returnType) {
                throw new Error("View expected return type");
            }
            const coder = idl_1.IdlCoder.fieldLayout({ type: returnType }, idl.types);
            return coder.decode(returnData);
        };
        return view;
    }
}
exports.default = ViewFactory;
//# sourceMappingURL=views.js.map