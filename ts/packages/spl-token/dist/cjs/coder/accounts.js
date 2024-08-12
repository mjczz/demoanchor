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
exports.SplTokenAccountsCoder = void 0;
// @ts-nocheck
const B = __importStar(require("@native-to-anchor/buffer-layout"));
class SplTokenAccountsCoder {
    constructor(_idl) { }
    async encode(accountName, account) {
        switch (accountName) {
            case "mint": {
                const buffer = Buffer.alloc(82);
                const len = MINT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            case "account": {
                const buffer = Buffer.alloc(165);
                const len = ACCOUNT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            case "multisig": {
                const buffer = Buffer.alloc(355);
                const len = MULTISIG_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            case "mint": {
                return decodeMintAccount(ix);
            }
            case "account": {
                return decodeAccountAccount(ix);
            }
            case "multisig": {
                return decodeMultisigAccount(ix);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    memcmp(accountName, _appendData) {
        switch (accountName) {
            case "mint": {
                return {
                    dataSize: 82,
                };
            }
            case "account": {
                return {
                    dataSize: 165,
                };
            }
            case "multisig": {
                return {
                    dataSize: 355,
                };
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(accountName) {
        switch (accountName) {
            case "mint": {
                return 82;
            }
            case "account": {
                return 165;
            }
            case "multisig": {
                return 355;
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
}
exports.SplTokenAccountsCoder = SplTokenAccountsCoder;
function decodeMintAccount(ix) {
    return MINT_LAYOUT.decode(ix);
}
function decodeAccountAccount(ix) {
    return ACCOUNT_LAYOUT.decode(ix);
}
function decodeMultisigAccount(ix) {
    return MULTISIG_LAYOUT.decode(ix);
}
const MINT_LAYOUT = B.struct([
    B.coption(B.publicKey(), "mintAuthority"),
    B.u64("supply"),
    B.u8("decimals"),
    B.bool("isInitialized"),
    B.coption(B.publicKey(), "freezeAuthority"),
]);
const ACCOUNT_LAYOUT = B.struct([
    B.publicKey("mint"),
    B.publicKey("owner"),
    B.u64("amount"),
    B.coption(B.publicKey(), "delegate"),
    ((p) => {
        const U = B.union(B.u8("discriminator"), null, p);
        U.addVariant(0, B.struct([]), "uninitialized");
        U.addVariant(1, B.struct([]), "initialized");
        U.addVariant(2, B.struct([]), "frozen");
        return U;
    })("state"),
    B.coption(B.u64(), "isNative"),
    B.u64("delegatedAmount"),
    B.coption(B.publicKey(), "closeAuthority"),
]);
const MULTISIG_LAYOUT = B.struct([
    B.u8("m"),
    B.u8("n"),
    B.bool("isInitialized"),
    B.seq(B.publicKey(), 11, "signers"),
]);
//# sourceMappingURL=accounts.js.map