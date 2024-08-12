import { Idl, Coder } from "@coral-xyz/anchor";
import { SplAssociatedTokenAccountAccountsCoder } from "./accounts";
import { SplAssociatedTokenAccountEventsCoder } from "./events";
import { SplAssociatedTokenAccountInstructionCoder } from "./instructions";
import { SplAssociatedTokenAccountStateCoder } from "./state";
import { SplAssociatedTokenAccountTypesCoder } from "./types";
/**
 * Coder for SplAssociatedTokenAccount
 */
export declare class SplAssociatedTokenAccountCoder implements Coder {
    readonly accounts: SplAssociatedTokenAccountAccountsCoder;
    readonly events: SplAssociatedTokenAccountEventsCoder;
    readonly instruction: SplAssociatedTokenAccountInstructionCoder;
    readonly state: SplAssociatedTokenAccountStateCoder;
    readonly types: SplAssociatedTokenAccountTypesCoder;
    constructor(idl: Idl);
}
//# sourceMappingURL=index.d.ts.map