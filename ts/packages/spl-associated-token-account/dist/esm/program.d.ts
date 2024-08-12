import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
export declare const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey;
interface GetProgramParams {
    programId?: PublicKey;
    provider?: AnchorProvider;
}
export declare function splAssociatedTokenAccountProgram(params?: GetProgramParams): Program<SplAssociatedTokenAccount>;
declare type SplAssociatedTokenAccount = {
    address: string;
    metadata: {
        name: "splAssociatedTokenAccount";
        version: "1.1.1";
        spec: "0.1.0";
    };
    instructions: [
        {
            name: "create";
            discriminator: [0];
            accounts: [
                {
                    name: "fundingAddress";
                    writable: true;
                    signer: true;
                },
                {
                    name: "associatedAccountAddress";
                    writable: true;
                },
                {
                    name: "walletAddress";
                },
                {
                    name: "tokenMintAddress";
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
                {
                    name: "tokenProgram";
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
                }
            ];
            args: [];
        },
        {
            name: "createIdempotent";
            discriminator: [1];
            accounts: [
                {
                    name: "fundingAddress";
                    writable: true;
                    signer: true;
                },
                {
                    name: "associatedAccountAddress";
                    writable: true;
                },
                {
                    name: "walletAddress";
                },
                {
                    name: "tokenMintAddress";
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
                {
                    name: "tokenProgram";
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
                }
            ];
            args: [];
        },
        {
            name: "recoverNested";
            discriminator: [2];
            accounts: [
                {
                    name: "nestedAssociatedAccountAddress";
                    writable: true;
                },
                {
                    name: "nestedTokenMintAddress";
                },
                {
                    name: "destinationAssociatedAccountAddress";
                    writable: true;
                },
                {
                    name: "ownerAssociatedAccountAddress";
                },
                {
                    name: "ownerTokenMintAddress";
                },
                {
                    name: "walletAddress";
                    writable: true;
                    signer: true;
                },
                {
                    name: "tokenProgram";
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
                }
            ];
            args: [];
        }
    ];
    errors: [
        {
            code: 0;
            name: "invalidOwner";
            msg: "Associated token account owner does not match address derivation";
        }
    ];
};
export {};
//# sourceMappingURL=program.d.ts.map