use anchor_lang::prelude::*;

declare_id!("2wSSiStYruG3QCwVQJNLJbbstR7fuv5dNuMh6NL6HwHC");

#[program]
pub mod demoanchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
