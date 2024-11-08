import * as anchor from "@coral-xyz/anchor";
import {Fight} from "../target/types/fight";

describe("fight", () => {
    const provider = anchor.AnchorProvider.local();

    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    const program = anchor.workspace.Fight as anchor.Program<Fight>;
    const user = provider.wallet.publicKey;

    let [actionState] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("action-state"), user.toBuffer()],
        program.programId
    );
    console.log(actionState)

    it("fight: Robot actions!", async () => {
        let instructions: anchor.web3.TransactionInstruction[] = [];
        let is_exist: boolean = false
        const actionStates= await program.account.actionState.all();
        actionStates.forEach((a) => {
            if (a.publicKey.toBase58() == actionState.toBase58()) {
                is_exist = true
                console.log("已存在了");
            }
        })

        // Create instruction: set up the Solana accounts to be used
        const createInstruction = await program.methods
            .create()
            .accounts({
                actionState,
                user,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .instruction();
        if (!is_exist) {
            instructions.push(createInstruction)
        }

        // Walk instruction: Invoke the Robot to walk
        const walkInstruction = await program.methods
            .walk()
            .accounts({
                actionState,
                user,
            })
            .instruction();
        instructions.push(walkInstruction)

        // Run instruction: Invoke the Robot to run
        const runInstruction = await program.methods
            .run()
            .accounts({
                actionState,
                user,
            })
            .instruction();
        instructions.push(runInstruction)

        // Jump instruction: Invoke the Robot to jump
        const jumpInstruction = await program.methods
            .jump()
            .accounts({
                actionState,
                user,
            })
            .instruction();
        instructions.push(jumpInstruction)

        // Reset instruction: Reset actions of the Robot
        const resetInstruction = await program.methods
            .reset()
            .accounts({
                actionState,
                user,
            })
            .instruction();
        instructions.push(resetInstruction)

        await createAndSendV0Tx(instructions);
    });

    async function createAndSendV0Tx(
        txInstructions: anchor.web3.TransactionInstruction[]
    ) {
        // Step 1 - Fetch the latest blockhash
        let latestBlockhash = await provider.connection.getLatestBlockhash(
            "confirmed"
        );
        console.log(
            "   ✅ - Fetched latest blockhash. Last Valid Height:",
            latestBlockhash.lastValidBlockHeight
        );

        // Step 2 - Generate Transaction Message
        const messageV0 = new anchor.web3.TransactionMessage({
            payerKey: user,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: txInstructions,
        }).compileToV0Message();
        console.log("   ✅ - Compiled Transaction Message");
        const transaction = new anchor.web3.VersionedTransaction(messageV0);

        // Step 3 - Sign your transaction with the required `Signers`
        provider.wallet.signTransaction(transaction);
        console.log("   ✅ - Transaction Signed");

        // Step 4 - Send our v0 transaction to the cluster
        const txid = await provider.connection.sendTransaction(transaction, {
            maxRetries: 5,
        });
        console.log("   ✅ - Transaction sent to network");

        // Step 5 - Confirm Transaction
        const confirmation = await provider.connection.confirmTransaction({
            signature: txid,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
        if (confirmation.value.err) {
            throw new Error(
                `   ❌ - Transaction not confirmed.\nReason: ${confirmation.value.err}`
            );
        }

        console.log("🎉 Transaction Successfully Confirmed!");
        let result = await program.account.actionState.fetch(actionState);
        console.log("Robot action state details: ", result);
    }
});
