"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splAssociatedTokenAccountProgram = exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const coder_1 = require("./coder");
exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
function splAssociatedTokenAccountProgram(params) {
    return new anchor_1.Program((params === null || params === void 0 ? void 0 : params.programId) ? { ...IDL, address: params.programId.toString() } : IDL, params === null || params === void 0 ? void 0 : params.provider, new coder_1.SplAssociatedTokenAccountCoder(IDL));
}
exports.splAssociatedTokenAccountProgram = splAssociatedTokenAccountProgram;
const IDL = {
    address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    metadata: {
        name: "splAssociatedTokenAccount",
        version: "1.1.1",
        spec: "0.1.0",
    },
    instructions: [
        {
            name: "create",
            discriminator: [0],
            accounts: [
                {
                    name: "fundingAddress",
                    writable: true,
                    signer: true,
                },
                {
                    name: "associatedAccountAddress",
                    writable: true,
                },
                {
                    name: "walletAddress",
                },
                {
                    name: "tokenMintAddress",
                },
                {
                    name: "systemProgram",
                    address: "11111111111111111111111111111111",
                },
                {
                    name: "tokenProgram",
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                },
            ],
            args: [],
        },
        {
            name: "createIdempotent",
            discriminator: [1],
            accounts: [
                {
                    name: "fundingAddress",
                    writable: true,
                    signer: true,
                },
                {
                    name: "associatedAccountAddress",
                    writable: true,
                },
                {
                    name: "walletAddress",
                },
                {
                    name: "tokenMintAddress",
                },
                {
                    name: "systemProgram",
                    address: "11111111111111111111111111111111",
                },
                {
                    name: "tokenProgram",
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                },
            ],
            args: [],
        },
        {
            name: "recoverNested",
            discriminator: [2],
            accounts: [
                {
                    name: "nestedAssociatedAccountAddress",
                    writable: true,
                },
                {
                    name: "nestedTokenMintAddress",
                },
                {
                    name: "destinationAssociatedAccountAddress",
                    writable: true,
                },
                {
                    name: "ownerAssociatedAccountAddress",
                },
                {
                    name: "ownerTokenMintAddress",
                },
                {
                    name: "walletAddress",
                    writable: true,
                    signer: true,
                },
                {
                    name: "tokenProgram",
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                },
            ],
            args: [],
        },
    ],
    errors: [
        {
            code: 0,
            name: "invalidOwner",
            msg: "Associated token account owner does not match address derivation",
        },
    ],
};
//# sourceMappingURL=program.js.map