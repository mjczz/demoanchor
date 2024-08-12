"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenAccountStateCoder = void 0;
class SplAssociatedTokenAccountStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SplAssociatedTokenAccount does not have state");
    }
    decode(_ix) {
        throw new Error("SplAssociatedTokenAccount does not have state");
    }
}
exports.SplAssociatedTokenAccountStateCoder = SplAssociatedTokenAccountStateCoder;
//# sourceMappingURL=state.js.map