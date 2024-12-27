use anchor_lang::prelude::*;
use puppet::cpi::accounts::SetData;
use puppet::program::Puppet;
use puppet::{self, PData};

declare_id!("7S7JNp88GfyKkrmtpFpJy8NqDdLA7shFPJ5tzHb2UWSy");

#[program]
mod puppet_master {
    use super::*;
    pub fn pull_strings(ctx: Context<PullStrings>, data: u64, title: String) -> Result<()> {
        puppet::cpi::set_data(ctx.accounts.set_data_ctx(), data, title);
        // to read the value of an account that has just been changed by a CPI,
        // call reload method which will re-deserialize the account
        ctx.accounts.puppet.reload();
        if ctx.accounts.puppet.pup_data != data {
            panic!();
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PullStrings<'info> {
    #[account(mut)]
    pub puppet: Account<'info, PData>,
    pub puppet_program: Program<'info, Puppet>,
}

impl<'info> PullStrings<'info> {
    pub fn set_data_ctx(&self) -> CpiContext<'_, '_, '_, 'info, SetData<'info>> {
        let cpi_program = self.puppet_program.to_account_info();
        let cpi_accounts = SetData {
            puppet: self.puppet.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
