import http from "http";
import { bot, config } from "@mebel-salon/telegram";

export { bot };

// 1. Render Free Web Service port tinglash (Health check)
const port = process.env["PORT"] || 3000;
http
  .createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Perfect Mebel Bot is running!");
  })
  .listen(port, () => {
    process.stdout.write(`Health check web server running on port ${port}\n`);
  });

// 2. To'g'ridan-to'g'ri ishga tushirish (Long polling)
if (process.env["NODE_ENV"] !== "test" && config.botToken) {
  bot.start({
    drop_pending_updates: true,
    onStart: (botInfo) => {
      process.stdout.write(`Telegram Bot (@${botInfo.username}) muvaffaqiyatli ishga tushdi!\n`);
    },
  });
}
