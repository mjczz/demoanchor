use anchor_lang::prelude::*;

declare_id!("6hbdXkgoEHtpyaBYpqZQBfKpgujCANdg5pVBdPjLfyEn");

#[program]
pub mod puppet {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, data_param: u64, title: String) -> Result<()> {
        let puppet = &mut ctx.accounts.puppet;
        puppet.pup_data = data_param;
        puppet.title = title;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // #[account(init, payer = user, space = 8 + 8)]
    #[account(init, payer = user, space = 8 + PData::LEN)] // discriminator 占 8 字节
    pub puppet: Account<'info, PData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub puppet: Account<'info, PData>,
}

#[account]
pub struct PData {
    pub pup_data: u64,
    pub title: String,
}

impl PData {
    // 定义一个常量，用于表示账户所需的总空间
    // pup_data:8字节 + (title: 4 字节存储长度 + 最大字符串长度的字节数（假设最大长度为 50）)
    pub const LEN: usize = 8 + 4 + 50; // 8 字节的 pup_data, 4 字节的长度, 50 字节的最大内容
}
