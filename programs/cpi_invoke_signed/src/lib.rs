use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};

declare_id!("GpzQusdyzEKgKL7frLgaNSmuLW8he5TbrRneLnqtBGHT");

#[program]
pub mod cpi_invoke_signed {
    use super::*;

    pub fn sol_transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_pubkey.key();
        let bump_seed = ctx.bumps.pda_account;
        let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

        let instruction =
            &system_instruction::transfer(&from_pubkey.key(), &to_pubkey.key(), amount);

        invoke_signed(
            instruction,
            &[from_pubkey, to_pubkey, program_id],
            signer_seeds,
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    // 如果客户端提供的 PDA 地址是正确的，并且满足服务端的验证规则（seeds 和 bump），那么签名种子确实可以由服务端生成，且操作会成功完成。
    // 但这并不是安全问题，因为：
    // 1、客户端无法绕过程序逻辑。
    // 2、客户端只能进行程序设计允许的操作。
    // 3、PDA 操作的目标账户（如 recipient）受到服务端逻辑的严格约束。
    // 因此，只要你的程序逻辑设计合理，客户端提供正确的 PDA 地址并不会带来风险。
    #[account(
        mut,
        seeds = [b"pda", recipient.key().as_ref()],
        bump,
    )]
    pda_account: SystemAccount<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
