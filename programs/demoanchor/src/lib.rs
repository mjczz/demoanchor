use anchor_lang::prelude::*;

declare_id!("4wYWQ4DZMjy9wahmnjeZGt63qbkGkj7GXzGzztPtjadN");

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
