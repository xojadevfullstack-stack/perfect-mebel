import type { NextFunction } from "grammy";
import type { MyContext } from "../types/index.js";
import { isAdmin } from "../config.js";

export async function requireAdmin(ctx: MyContext, next: NextFunction): Promise<void> {
  const userId = ctx.from?.id;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Kechirasiz, bu buyruq faqat bot ma'murlari uchun mo'ljallangan.");
    return;
  }
  await next();
}
