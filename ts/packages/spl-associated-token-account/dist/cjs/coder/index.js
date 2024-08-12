"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenAccountCoder = void 0;
const accounts_1 = require("./accounts");
const events_1 = require("./events");
const instructions_1 = require("./instructions");
const state_1 = require("./state");
const types_1 = require("./types");
/**
 * Coder for SplAssociatedTokenAccount
 */
class SplAssociatedTokenAccountCoder {
    constructor(idl) {
        this.accounts = new accounts_1.SplAssociatedTokenAccountAccountsCoder(idl);
        this.events = new events_1.SplAssociatedTokenAccountEventsCoder(idl);
        this.instruction = new instructions_1.SplAssociatedTokenAccountInstructionCoder(idl);
        this.state = new state_1.SplAssociatedTokenAccountStateCoder(idl);
        this.types = new types_1.SplAssociatedTokenAccountTypesCoder(idl);
    }
}
exports.SplAssociatedTokenAccountCoder = SplAssociatedTokenAccountCoder;
//# sourceMappingURL=index.js.map