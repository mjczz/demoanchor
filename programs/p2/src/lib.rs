use anchor_lang::prelude::*;

declare_id!("12i4RiKqcPszvnA7VgR85EE3Th3Sg4Brm5YMSpzDxJX6");

#[program]
pub mod p2 {
    use super::*;
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[account]
pub struct Counter {
    pub count: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}
