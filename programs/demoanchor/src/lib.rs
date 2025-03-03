use anchor_lang::prelude::*;

declare_id!("Bswqr1Y7ZbpJKws9tAYubGJQ5XpdAuywSBoThPxLQHkm");

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
