use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Transfer};
use solana_program;

declare_id!("4ecAtRiPXREJfJUV34ptoYcNvS1bUybqajo8V9AxauPz");

#[program]
pub mod enhanced_nft_program {
    use super::*;

    // 创建 NFT
    pub fn create_nft(
        ctx: Context<CreateNft>,
        name: String,
        symbol: String,
        max_supply: u64,
    ) -> Result<()> {
        let nft_data = &mut ctx.accounts.nft_data;

        nft_data.name = name;
        nft_data.symbol = symbol;
        nft_data.max_supply = max_supply;
        nft_data.supply = 0;

        Ok(())
    }

    // 铸造 NFT
    pub fn mint_nft(ctx: Context<MintNft>, amount: u64) -> Result<()> {
        let nft_data = &mut ctx.accounts.nft_data;

        // 检查总供应量限制
        require!(
            nft_data.supply + amount <= nft_data.max_supply,
            NftError::MaxSupplyExceeded
        );

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::mint_to(cpi_ctx, amount)?;

        // 更新供应量
        nft_data.supply += amount;

        Ok(())
    }

    // 转移 NFT
    pub fn transfer_nft(ctx: Context<TransferNft>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNft<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 32 + 8 + 8)]
    pub nft_data: Account<'info, NftData>,
    #[account(init, payer = payer, mint::decimals = 0, mint::authority = payer)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>, // Add this line
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub nft_data: Account<'info, NftData>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferNft<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// NFT 数据结构
#[account]
pub struct NftData {
    pub name: String,    // NFT 名称
    pub symbol: String,  // NFT 符号
    pub max_supply: u64, // 最大供应量
    pub supply: u64,     // 当前供应量
}

// 错误定义
#[error_code]
pub enum NftError {
    #[msg("The maximum supply has been exceeded.")]
    MaxSupplyExceeded,
}

// #[cfg(test)]
// mod tests {
//     pub use crate::enhanced_nft_program::{
//         accounts::CreateNft as CreateNft1, entry, id, instruction::CreateNft, NftData,
//     };
//     use solana_program_test::*;
//     use solana_sdk::{
//         account::Account,
//         instruction::Instruction,
//         signature::{Keypair, Signer},
//         transaction::Transaction,
//     };
//
//     #[tokio::test]
//     async fn test_create_nft() {
//         // Step 1: Initialize a program test environment
//         let program_id = id();
//         let mut program_test = ProgramTest::new(
//             "enhanced_nft_program", // Program name
//             program_id,             // Program ID
//             processor!(entry),      // Entry point of the program
//         );
//
//         // Step 2: Add accounts
//         // let payer  = solana_sdk::pubkey::Pubkey::new_unique();
//         let payer = Keypair::new();
//         let nft_data = Keypair::new();
//         let mint = Keypair::new();
//
//         program_test.add_account(
//             payer.pubkey(),
//             Account {
//                 lamports: 1_000_000_000, // Add some SOL to the payer account
//                 owner: solana_program::system_program::id(),
//                 ..Account::default()
//             },
//         );
//
//         // Step 3: Start test context
//         let mut ctx = program_test.start_with_context().await;
//
//         // Step 4: Create NFT instruction
//         let name = "MyNFT".to_string();
//         let symbol = "MNFT".to_string();
//         let max_supply = 1000;
//
//         let accounts = CreateNft {
//             nft_data: nft_data.pubkey(),
//             mint: mint.pubkey(),
//             payer: payer.pubkey(),
//             system_program: solana_program::system_program::id(),
//             token_program: anchor_spl::token::ID,
//         };
//
//         let create_nft_ix = Instruction {
//             program_id,
//             accounts: accounts.to_account_metas(None),
//             data: CreateNft {
//                 name: name.clone(),
//                 symbol: symbol.clone(),
//                 max_supply,
//             }
//             .data(),
//         };
//
//         // Step 5: Construct and send transaction
//         let mut tx = Transaction::new_with_payer(&[create_nft_ix], Some(&payer.pubkey()));
//         tx.sign(&[&payer, &nft_data, &mint], ctx.last_blockhash);
//
//         ctx.banks_client
//             .process_transaction(tx)
//             .await
//             .expect("Failed to process transaction");
//
//         // Step 6: Fetch the account and verify the result
//         let nft_data_account: NftData = ctx
//             .banks_client
//             .get_account(nft_data.pubkey())
//             .await
//             .expect("Failed to fetch account")
//             .map(|account| {
//                 anchor_lang::AccountDeserialize::try_deserialize(&mut account.data.as_slice())
//                     .expect("Failed to deserialize account")
//             })
//             .expect("NFT data account not found");
//
//         assert_eq!(nft_data_account.name, name);
//         assert_eq!(nft_data_account.symbol, symbol);
//         assert_eq!(nft_data_account.max_supply, max_supply);
//         assert_eq!(nft_data_account.supply, 0);
//     }
// }
