use anchor_lang::prelude::*;
use anchor_lang::solana_program as anchor_solana_program;
declare_id!("5CYqYfU4QCq9krUaw2XbbtEPGkqR8xiMNwg7cgtY6DHW");

#[program]
pub mod my_nft_project {
    use super::*;

    pub fn mint_nft(ctx: Context<MintNft>, metadata_uri: String) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        nft.metadata_uri = metadata_uri;
        nft.owner = ctx.accounts.user.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(init, payer = user, space = 8 + 200)] // 调整 space 大小以适应你的 metadata_uri
    pub nft: Account<'info, Nft>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Nft {
    pub metadata_uri: String,
    pub owner: Pubkey,
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     // use anchor_lang::solana_program::example_mocks::solana_sdk::signature::{Keypair, Signer};
//     // use anchor_lang::solana_program::pubkey::Pubkey;
//     use solana_sdk::{
//         account::AccountSharedData, instruction::Instruction, pubkey::Pubkey,
//         signer::keypair::Keypair, system_program, transaction::Transaction,
//     };
//
//     #[tokio::test] // 使用 tokio::test 支持异步测试
//     async fn test_mint_nft() {
//         // 创建测试环境
//         let program_id = my_nft_project::ID;
//         let mut context = ProgramTest::new(
//             "my_nft_project", // 程序名称
//             program_id,
//             processor!(my_nft_project::entry), // 程序入口函数
//         );
//
//         // 添加账户
//         let user_pk = Pubkey::new_unique();
//         let nft_pk = Pubkey::new_unique();
//         let user = Keypair::from_base58_string(user_pk.into());
//         let nft = Keypair::from_base58_string(nft_pk.into());
//         let metadata_uri = "ipfs://QmSomeHash".to_string();
//
//         context.add_account(
//             user_pk,
//             (AccountSharedData::new(1000000000, 0, &system_program::ID)).into(), // 给用户分配 SOL
//         );
//
//         // 初始化模拟环境
//         let (mut banks_client, payer, recent_blockhash) = context.start().await;
//
//         // 构建交易
//         let accounts = my_nft_project::MintNft {
//             nft: nft.into(),
//             user: payer.into(),
//             system_program: system_program::ID.into(),
//         };
//
//         let mint_tx = Transaction::new_signed_with_payer(
//             &[Instruction {
//                 program_id,
//                 accounts: accounts.to_account_metas(None),
//                 data: vec![],
//             }],
//             Some(&payer),
//             &[&payer, &nft], // 注意这里需要nft的签名，修改了之前的逻辑
//             recent_blockhash,
//         );
//         // data: my_nft_project::instruction::mint_nft(metadata_uri.clone()).data(),
//
//         // 发送交易
//         banks_client.process_transaction(mint_tx).await.unwrap();
//
//         // 获取 NFT 账户数据
//         let nft_account = banks_client.get_account(nft_pk).await.unwrap().unwrap();
//         let nft_data = Nft::try_from_slice(&nft_account.data).unwrap();
//
//         // 断言
//         assert_eq!(nft_data.metadata_uri, metadata_uri);
//         assert_eq!(payer.eq(&nft_data.owner), true);
//     }
//
//     // #[tokio::test]
//     // #[should_panic]
//     // async fn test_mint_nft_insufficient_space() {
//     //     // 创建测试环境
//     //     let program_id = my_nft_project::ID;
//     //     let mut context = ProgramTest::new(
//     //         "my_nft_project",
//     //         program_id,
//     //         processor!(my_nft_project::entry),
//     //     );
//     //
//     //     // 添加账户
//     //     // let user = Keypair::new();
//     //     // let nft = Keypair::new();
//     //     let user = Pubkey::new_unique();
//     //     let nft = Pubkey::new_unique();
//     //     let metadata_uri = "ipfs://VeryLongHashThatExceedsTheSpace".to_string();
//     //
//     //     context.add_account(
//     //         user.pubkey(),
//     //         AccountSharedData::new(1000000000, 0, &system_program::ID),
//     //     );
//     //     // 初始化模拟环境
//     //     let (mut banks_client, payer, recent_blockhash) = context.start().await;
//     //
//     //     let accounts = my_nft_project::MintNft {
//     //         nft: nft.pubkey(),
//     //         user: payer.pubkey(),
//     //         system_program: system_program::ID,
//     //     };
//     //
//     //     let mint_tx = Transaction::new_signed_with_payer(
//     //         &[Instruction {
//     //             program_id,
//     //             accounts: accounts.to_account_metas(None),
//     //             data: my_nft_project::instruction::mint_nft(metadata_uri.clone()).data(),
//     //         }],
//     //         Some(&payer.pubkey()),
//     //         &[&payer, &nft],
//     //         recent_blockhash,
//     //         0,
//     //     );
//     //
//     //     banks_client.process_transaction(mint_tx).await.unwrap();
//     // }
//     //
// }
