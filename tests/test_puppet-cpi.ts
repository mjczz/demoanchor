import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {expect} from 'chai'
import {Puppet} from '../app/src/idl/puppet'
import {PuppetMaster} from '../app/src/idl/puppet_master'


describe('call puppet program by cpi', () => {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const puppetProgram = anchor.workspace.Puppet as Program<Puppet>
    const puppetMasterProgram = anchor.workspace
        .PuppetMaster as Program<PuppetMaster>

    const puppetKeypair = Keypair.generate()

    it('Does CPI!', async () => {
        await puppetProgram.methods
            .initialize()
            .accounts({
                puppet: puppetKeypair.publicKey,
                user: provider.wallet.publicKey,
            })
            .signers([puppetKeypair])
            .rpc()


        // @ts-ignore
        await puppetMasterProgram.methods
            .pullStrings(new anchor.BN(42), "czz")
            .accounts({
                puppetProgram: puppetProgram.programId,
                puppet: puppetKeypair.publicKey,
            })
            .rpc()


        expect(
            (
                await puppetProgram.account.pData.fetch(puppetKeypair.publicKey)
            ).pupData.toNumber()
        ).to.equal(42)
        expect(
            (
                await puppetProgram.account.pData.fetch(puppetKeypair.publicKey)
            ).title
        ).to.equal("czz")
    })
})