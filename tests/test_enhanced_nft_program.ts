import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import {PublicKey, SystemProgram} from "@solana/web3.js";
import {assert} from "chai";
import {EnhancedNftProgram} from "../app/idl-ts/enhanced_nft_program";
import { Token, TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount } from "@solana/spl-token";

describe("Enhanced NFT Program", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);

    const program = anchor.workspace.EnhancedNftProgram as Program<EnhancedNftProgram>;

    const mint = anchor.web3.Keypair.generate();
    const nftDataAccount = anchor.web3.Keypair.generate();

    const nftName = "TestNFT";
    const nftSymbol = "TNFT";
    const maxSupply = 10;

    it("Should create an NFT", async () => {

        // 调用 create_nft
        await program.rpc.createNft(nftName, nftSymbol, new anchor.BN(maxSupply), {
            accounts: {
                nftData: nftDataAccount.publicKey,
                mint: mint.publicKey,
                payer: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            },
            signers: [nftDataAccount, mint], // Add this line
        });

        // 验证 NFT 数据
        const nftData = await program.account.nftData.fetch(nftDataAccount.publicKey);
        assert.equal(nftData.name, nftName);
        assert.equal(nftData.symbol, nftSymbol);
        assert.equal(nftData.maxSupply.toNumber(), maxSupply);
    });

    it("Should mint NFTs", async () => {
        // 创建一个 Token Account
        let tokenAccount = await anchor.utils.token.createTokenAccount(
            provider.connection,
            provider.wallet.payer,
            mint,
            provider.wallet.publicKey
        );

        const mintAmount = 5;

        // 调用铸造 NFT 的方法
        await program.methods
            .mintNft(new anchor.BN(mintAmount))
            .accounts({
                nftData: nftDataPda,
                mint: mint.publicKey,
                tokenAccount: tokenAccount,
                payer: provider.wallet.publicKey,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc();

        // 验证更新后的供应量
        const nftData = await program.account.nftData.fetch(nftDataPda);
        assert.equal(nftData.supply.toNumber(), mintAmount);
    });

    it("Should transfer NFTs", async () => {
        return
        // 创建一个目标 Token Account
        const recipientTokenAccount = await anchor.utils.token.createTokenAccount(
            provider.connection,
            provider.wallet.payer,
            mint,
            provider.wallet.publicKey
        );

        const transferAmount = 2;

        // 调用转移 NFT 的方法
        await program.methods
            .transferNft(new anchor.BN(transferAmount))
            .accounts({
                from: tokenAccount,
                to: recipientTokenAccount,
                owner: provider.wallet.publicKey,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc();

        // 验证余额更新
        const fromBalance = await anchor.utils.token.getAccountBalance(provider.connection, tokenAccount);
        const toBalance = await anchor.utils.token.getAccountBalance(provider.connection, recipientTokenAccount);

        assert.equal(fromBalance, 3); // 初始 5 - 转移 2 = 3
        assert.equal(toBalance, 2);   // 收到 2
    });
});
