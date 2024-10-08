import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import { sha256 } from "@noble/hashes/sha256";
// Sync version of web3.PublicKey.createWithSeed.
export function createWithSeedSync(fromPublicKey, seed, programId) {
    const buffer = Buffer.concat([
        fromPublicKey.toBuffer(),
        Buffer.from(seed),
        programId.toBuffer(),
    ]);
    return new PublicKey(sha256(buffer));
}
//# sourceMappingURL=pubkey.js.map