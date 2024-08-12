import { SplAssociatedTokenAccountAccountsCoder } from "./accounts";
import { SplAssociatedTokenAccountEventsCoder } from "./events";
import { SplAssociatedTokenAccountInstructionCoder } from "./instructions";
import { SplAssociatedTokenAccountStateCoder } from "./state";
import { SplAssociatedTokenAccountTypesCoder } from "./types";
/**
 * Coder for SplAssociatedTokenAccount
 */
export class SplAssociatedTokenAccountCoder {
    constructor(idl) {
        this.accounts = new SplAssociatedTokenAccountAccountsCoder(idl);
        this.events = new SplAssociatedTokenAccountEventsCoder(idl);
        this.instruction = new SplAssociatedTokenAccountInstructionCoder(idl);
        this.state = new SplAssociatedTokenAccountStateCoder(idl);
        this.types = new SplAssociatedTokenAccountTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map