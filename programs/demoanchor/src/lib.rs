use anchor_lang::prelude::*;

declare_id!("H3PTiZJrKv2RKP2K5KXaFH7JDKjScYBUDHcyTSUXzB9d");

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
