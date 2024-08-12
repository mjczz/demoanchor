// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
export class SplAssociatedTokenAccountInstructionCoder {
    constructor(_idl) { }
    encode(ixName, ix) {
        switch (ixName) {
            case "create": {
                return encodeCreate(ix);
            }
            case "createIdempotent": {
                return encodeCreateIdempotent(ix);
            }
            case "recoverNested": {
                return encodeRecoverNested(ix);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("SplAssociatedTokenAccount does not have state");
    }
}
function encodeCreate({}) {
    return encodeData({ create: {} }, 1);
}
function encodeCreateIdempotent({}) {
    return encodeData({ createIdempotent: {} }, 1);
}
function encodeRecoverNested({}) {
    return encodeData({ recoverNested: {} }, 1);
}
const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(0, B.struct([]), "create");
LAYOUT.addVariant(1, B.struct([]), "createIdempotent");
LAYOUT.addVariant(2, B.struct([]), "recoverNested");
function encodeData(ix, span) {
    const b = Buffer.alloc(span);
    LAYOUT.encode(ix, b);
    return b;
}
//# sourceMappingURL=instructions.js.map