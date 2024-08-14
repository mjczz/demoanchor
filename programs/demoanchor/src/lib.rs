use anchor_lang::prelude::*;

declare_id!("9H38cHGSZirSQhQbjhvariRUoqPB4fRZJWs5kydhsepa");

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
