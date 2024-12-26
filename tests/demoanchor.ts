import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Demoanchor } from "../app/src/idl/demoanchor";

describe("demoanchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Demoanchor as Program<Demoanchor>;

  it("Is initialized!", async () => {
    console.log("Is initialized ..............")
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
