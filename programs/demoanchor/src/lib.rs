use anchor_lang::prelude::*;

declare_id!("HY8ddMJy8FjhvuoQKXcvzYyVEUU3LwywK54gU79SiBWq");

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
