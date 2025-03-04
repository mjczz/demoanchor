use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Transfer};

declare_id!("AWBoVedyrGe6Bj4Bc9jxWkTfjvSBssdLioREjc6vEAFn");
//
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
