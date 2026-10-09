import http from "http";
import { bot, config } from "@mebel-salon/telegram";

export { bot };

// 1. Render Free Web Service uchun Health Check server
const port = parseInt(process.env["PORT"] || "3000", 10);
const host = "0.0.0.0";

const server = http.createServer((req, res) => {
  if (
    req.url === "/" ||
    req.url === "/health" ||
    req.url === "/healthz" ||
    req.url === "/status"
  ) {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "perfect-mebel-bot",
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(port, host, () => {
  console.log(`[HealthCheck] Web server muvaffaqiyatli ishga tushdi: http://${host}:${port}`);
});

// 2. Telegram Botni ishga tushirish (Long Polling)
if (process.env["NODE_ENV"] !== "test") {
  if (!config.botToken) {
    console.warn(
      "[TelegramBot] OGOHLANTIRISH: TELEGRAM_BOT_TOKEN topilmadi! Render Dashboard -> Environment Variables bo'limiga TELEGRAM_BOT_TOKEN qo'shing."
    );
  } else {
    console.log("[TelegramBot] Bot ishga tushirilmoqda...");
    bot
      .start({
        drop_pending_updates: true,
        onStart: (botInfo) => {
          console.log(`[TelegramBot] @${botInfo.username} muvaffaqiyatli ishga tushdi!`);
        },
      })
      .catch((err) => {
        console.error(
          "[TelegramBot] XATOLIK: Bot Telegram API ga ulana olmadi! Token yoki tarmoq sozlamalarini tekshiring:",
          err?.message || err
        );
      });
  }
}

// 3. Process xatoliklarini ushlash (Process to'xtab qolmasligi uchun)
process.on("unhandledRejection", (reason) => {
  console.error("[Process] Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Process] Uncaught Exception:", error);
});

// 4. Graceful Shutdown
const handleShutdown = () => {
  console.log("[Process] Servis to'xtatilmoqda...");
  server.close(() => {
    bot.stop();
    process.exit(0);
  });
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
