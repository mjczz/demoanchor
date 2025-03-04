import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { assert } from 'chai';
import { Puppet } from '../app/idl-ts/puppet'; // 确保路径正确

describe('puppet', () => {
    // 配置 Anchor 客户端
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const payer = provider.wallet as anchor.Wallet;
    // 获取 Puppet 程序
    const program = anchor.workspace.Puppet as Program<Puppet>;
    // 创建 Puppet 账户的 Keypair
    const puppetKeypair = Keypair.generate();

    it('测试 initialize 方法', async () => {
        await program.methods
            .initialize()
            .accounts({
                puppet: puppetKeypair.publicKey,
                user: payer.publicKey,
            })
            .signers([puppetKeypair])
            .rpc();

        // 检查初始化结果
        const accountInfo = await program.account.pData.fetch(puppetKeypair.publicKey);
        console.log('Initialized Account:', accountInfo);

        // 确保 pup_data 的初始值为 0，title 的默认值为空字符串
        assert.strictEqual(accountInfo.pupData.toNumber(), 0, 'Expected pup_data to be initialized to 0');
        assert.strictEqual(accountInfo.title, '', 'Expected title to be initialized to an empty string');
    });

    it('测试 set_data 方法', async () => {
        const newData = new anchor.BN(42); // 新的 pup_data 值
        const newTitle = 'Hello, Solana!'; // 新的 title 值
        await program.methods
            .setData(newData, newTitle)
            .accounts({
                puppet: puppetKeypair.publicKey,
            })
            .rpc();

        // 检查修改结果
        const accountInfo = await program.account.pData.fetch(puppetKeypair.publicKey);
        console.log('Updated Account:', accountInfo);

        // 确保 pup_data 和 title 被正确更新
        assert.strictEqual(accountInfo.pupData.toNumber(), 42, 'Expected pup_data to be updated to 42');
        assert.strictEqual(accountInfo.title, 'Hello, Solana!', 'Expected title to be updated to "Hello, Solana!"');
    });

    it('Set data again', async () => {
        const newData = new anchor.BN(100); // 新的 pup_data 值
        const newTitle = 'Hello, Solana again!'; // 新的 title 值

        // 调用 set_data 方法
        await program.methods
            .setData(newData, newTitle)
            .accounts({
                puppet: puppetKeypair.publicKey,
            })
            .rpc();

        // 检查修改结果
        const accountInfo = await program.account.pData.fetch(puppetKeypair.publicKey);
        console.log('Updated Account again:', accountInfo);

        // 确保 pup_data 和 title 被正确更新
        assert.strictEqual(accountInfo.pupData.toNumber(), 100, 'Expected pup_data to be updated to 42');
        assert.strictEqual(accountInfo.title, 'Hello, Solana again!', 'Expected title to be updated to "Hello, Solana!"');
    });
});
