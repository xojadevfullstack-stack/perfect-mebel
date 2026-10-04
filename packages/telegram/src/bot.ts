import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { prisma } from "@mebel-salon/db";
import type { MyContext } from "./types/index";
import { config } from "./config";

// Conversations
import { applyConversation } from "./conversations/apply";
import { adminAddCategoryConversation } from "./conversations/admin-category";
import { adminAddProductConversation } from "./conversations/admin-product";
import { adminAddCollectionConversation } from "./conversations/admin-collection";

// Handlers
import { handleStart } from "./handlers/start";
import {
  showCategories,
  showCategoryProducts,
  showProductDetails,
  showCollections,
  showCollectionDetails,
  showContactInfo,
} from "./handlers/catalog";
import {
  handleAdminMenu,
  handleAdminStats,
} from "./handlers/admin";
import {
  handleCustomerMessage,
  handleSupportGroupReply,
} from "./handlers/livechat";
import { requireAdmin } from "./middleware/auth";

/**
 * Telegram Bot instansiyasini barcha middleware va FSM dialoglari bilan yaratish.
 * Sessiyalar to'liq PostgreSQL'dagi `sessions` jadvalida saqlanadi va
 * stateless HTTP webhook rejimida ham, polling rejimida ham uzluksiz ishlaydi.
 */
export function createBot(customToken?: string): Bot<MyContext> {
  const token = customToken || config.botToken || "dummy-token-for-typecheck";
  const bot = new Bot<MyContext>(token);

  // 1. Session va Conversations pluginlarini ulash (PostgreSQL Prisma adapter)
  bot.use(
    session({
      initial: () => ({}),
      storage: new PrismaAdapter(prisma.session),
    })
  );
  bot.use(conversations());

  // 2. FSM Conversationlarni ro'yxatdan o'tkazish
  bot.use(createConversation(applyConversation));
  bot.use(createConversation(adminAddCategoryConversation));
  bot.use(createConversation(adminAddProductConversation));
  bot.use(createConversation(adminAddCollectionConversation));

  // 3. Buyruqlar (Commands)
  bot.command("start", handleStart);
  bot.command("catalog", showCategories);
  bot.command("collections", (ctx) => showCollections(ctx, 1));
  bot.command("help", showContactInfo);
  bot.command("admin", handleAdminMenu);

  bot.command("add_category", requireAdmin, async (ctx) => {
    await ctx.conversation.enter("adminAddCategoryConversation");
  });
  bot.command("add_product", requireAdmin, async (ctx) => {
    await ctx.conversation.enter("adminAddProductConversation");
  });
  bot.command("add_collection", requireAdmin, async (ctx) => {
    await ctx.conversation.enter("adminAddCollectionConversation");
  });

  // 4. Asosiy Menyu (Reply Keyboard tugmalari)
  bot.hears("🛋 Katalog", showCategories);
  bot.hears("🗂 Komplektlar", (ctx) => showCollections(ctx, 1));
  bot.hears("📝 Ariza qoldirish", async (ctx) => {
    await ctx.conversation.enter("applyConversation");
  });
  bot.hears("📞 Aloqa", showContactInfo);
  bot.hears("⚙️ Admin Panel", handleAdminMenu);

  // 5. Callback querylar (Inline keyboard hodisalari)
  bot.callbackQuery("show_categories", showCategories);

  bot.callbackQuery(/^cat_([a-zA-Z0-9-]+)_(\d+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1] && match[2]) {
      const categoryId = match[1];
      const page = parseInt(match[2], 10) || 1;
      await showCategoryProducts(ctx, categoryId, page);
    }
  });

  bot.callbackQuery(/^prod_([a-zA-Z0-9-]+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      await showProductDetails(ctx, match[1]);
    }
  });

  bot.callbackQuery(/^apply_prod_([a-zA-Z0-9-]+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      ctx.match = `order_product_${match[1]}`;
      await ctx.conversation.enter("applyConversation");
    }
  });

  bot.callbackQuery("show_collections", (ctx) => showCollections(ctx, 1));

  bot.callbackQuery(/^cols_(\d+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      const page = parseInt(match[1], 10) || 1;
      await showCollections(ctx, page);
    }
  });

  bot.callbackQuery(/^col_([a-zA-Z0-9-]+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      await showCollectionDetails(ctx, match[1]);
    }
  });

  bot.callbackQuery(/^apply_col_([a-zA-Z0-9-]+)$/, async (ctx) => {
    const match = ctx.match;
    if (match && match[1]) {
      ctx.match = `order_set_${match[1]}`;
      await ctx.conversation.enter("applyConversation");
    }
  });

  // Admin Callbacks
  bot.callbackQuery("admin_menu", handleAdminMenu);
  bot.callbackQuery("admin_stats", handleAdminStats);

  bot.callbackQuery("admin_add_cat", requireAdmin, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter("adminAddCategoryConversation");
  });

  bot.callbackQuery("admin_add_prod", requireAdmin, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter("adminAddProductConversation");
  });

  bot.callbackQuery("admin_add_col", requireAdmin, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter("adminAddCollectionConversation");
  });

  // 6. Support Guruhi javoblari (Reply to customer)
  bot.on("message", async (ctx, next) => {
    if (ctx.message?.reply_to_message) {
      await handleSupportGroupReply(ctx);
      return;
    }
    await next();
  });

  // 7. Mijoz erkin xabari (Live Chat)
  bot.on("message:text", handleCustomerMessage);

  // 8. Xatoliklar boshqaruvi
  bot.catch((err) => {
    const ctx = err.ctx;
    process.stderr.write(
      `Bot xatoligi [update_id: ${ctx.update.update_id}]: ${
        err.error instanceof Error ? err.error.message : String(err.error)
      }\n`
    );
  });

  return bot;
}

let cachedBot: Bot<MyContext> | null = null;
export function getBot(token?: string): Bot<MyContext> {
  if (!cachedBot) {
    cachedBot = createBot(token);
  }
  return cachedBot;
}

export const bot = getBot();
