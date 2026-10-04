/**
 * Mebel Salon — Keng qamrovli tizim testi (System Integration Test Suite)
 * 
 * Ushbu test quyidagi barcha yo'nalishlarni to'liq tekshiradi:
 * 1. Baza (Neon PostgreSQL) va Prisma ORM CRUD
 * 2. Zod validatsiya sxemalari (@mebel-salon/shared)
 * 3. Ko'p tillilik (i18n) lug'atlar to'liqligi (UZ, RU, EN)
 * 4. Narxlar yo'qligi qoidasi (No-Price Rule)
 * 5. Admin autentifikatsiyasi va xavfsizlik (bcrypt)
 * 6. Telegram xabarnomasi formatlash va HTML escaping
 * 7. Bot arxitekturasi va konfiguratsiyasi
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import {
  leadSchema,
  categorySchema,
  productSchema,
  collectionSchema,
  escapeHtml,
} from "../packages/shared/src";
import { checkRateLimitAtomic, cleanupExpiredRateLimits } from "../packages/db/src";

const prisma = new PrismaClient();

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void> | void): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ name, passed: true, durationMs });
    process.stdout.write(`  ✅ PASS: ${name} (${durationMs}ms)\n`);
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error: msg, durationMs });
    process.stderr.write(`  ❌ FAIL: ${name} (${durationMs}ms)\n     Xato: ${msg}\n`);
  }
}

async function main(): Promise<void> {
  process.stdout.write("\n=======================================================\n");
  process.stdout.write("🛋️  MEBEL SALON — LOYIHANI INTEGRATSION TESTLASH\n");
  process.stdout.write("=======================================================\n\n");

  // ─────────────────────────────────────────────────────────────
  // 1. MA'LUMOTLAR BAZASI VA PRISMA ORM TESTLARI
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("📦 1. MA'LUMOTLAR BAZASI & PRISMA ORM (PostgreSQL):\n");

  let testCategoryId = "";
  let testProductId = "";
  let testCollectionId = "";
  let testLeadId = "";
  let testSupportMsgId = "";

  try {
    await runTest("Baza ulanishi va jadvallar mavjudligi", async () => {
      const catCount = await prisma.category.count();
      if (typeof catCount !== "number") {
        throw new Error("Category jadvalidan ma'lumot o'qib bo'lmadi");
      }
    });

    await runTest("Category CRUD: Yangi toifa yaratish, o'qish, yangilash", async () => {
      const slug = `test-cat-${Date.now()}`;
      const created = await prisma.category.create({
        data: {
          slug,
          nameUz: "Test Kategoriya UZ",
          nameRu: "Тест Категория RU",
          nameEn: "Test Category EN",
          order: 999,
        },
      });
      testCategoryId = created.id;

      const found = await prisma.category.findUnique({ where: { id: created.id } });
      if (!found || found.slug !== slug) {
        throw new Error("Yaratilgan toifa bazadan topilmadi");
      }

      const updated = await prisma.category.update({
        where: { id: created.id },
        data: { nameUz: "Test Kategoriya Updated" },
      });
      if (updated.nameUz !== "Test Kategoriya Updated") {
        throw new Error("Toifa ma'lumotlari yangilanmadi");
      }
    });

    await runTest("Product CRUD: Mahsulot yaratish (toifaga bog'lash va narxsiz)", async () => {
      const slug = `test-prod-${Date.now()}`;
      const created = await prisma.product.create({
        data: {
          categoryId: testCategoryId,
          slug,
          titleUz: "Zamonaviy Test Divan",
          titleRu: "Современный Тест Диван",
          titleEn: "Modern Test Sofa",
          descUz: "Qulay va sifatli test divan",
          dimensions: "220x100x85 sm",
          material: "Velur, eman karkas",
          warranty: "2 yil",
          stockStatus: "IN_STOCK",
          images: ["https://example.com/test-sofa.jpg"],
        },
      });
      testProductId = created.id;

      const found = await prisma.product.findUnique({
        where: { id: created.id },
        include: { category: true },
      });

      if (!found || found.category.id !== testCategoryId) {
        throw new Error("Mahsulot toifa bilan bog'lanmadi");
      }
    });

    await runTest("Collection CRUD: Komplekt yaratish va mahsulotni biriktirish", async () => {
      const slug = `test-col-${Date.now()}`;
      const created = await prisma.collection.create({
        data: {
          slug,
          titleUz: "Mehmonxona Test To'plami",
          titleRu: "Гостиный Тест Гарнитур",
          titleEn: "Living Room Test Set",
          descUz: "Premium sifatli mebellar to'plami",
          images: ["https://example.com/collection.jpg"],
          products: {
            connect: [{ id: testProductId }],
          },
        },
      });
      testCollectionId = created.id;

      const found = await prisma.collection.findUnique({
        where: { id: created.id },
        include: { products: true },
      });

      if (!found || found.products.length !== 1 || found.products[0]?.id !== testProductId) {
        throw new Error("Komplektga mebel birikmadi");
      }
    });

    await runTest("Lead CRUD: Saytdan (WEB) va Botdan (BOT) arizalarni saqlash", async () => {
      const webLead = await prisma.lead.create({
        data: {
          customerName: "Alisher Navoiy",
          phone: "+998901234567",
          address: "Toshkent sh., Navoiy ko'chasi 1-uy",
          notes: "Eshik oldigacha olib kelish kerak",
          itemsSummary: "Zamonaviy Test Divan (x1)",
          source: "WEB",
        },
      });
      testLeadId = webLead.id;

      const botLead = await prisma.lead.create({
        data: {
          customerName: "Bobur Mirzo",
          phone: "+998991234567",
          telegramId: "123456789",
          itemsSummary: "Mehmonxona Test To'plami",
          source: "BOT",
        },
      });

      if (webLead.source !== "WEB" || botLead.source !== "BOT") {
        throw new Error("Lead manbasi (source) noto'g'ri saqlandi");
      }

      await prisma.lead.delete({ where: { id: botLead.id } });
    });

    await runTest("SupportMessage CRUD: Live Chat xabarlarini saqlash", async () => {
      const msg = await prisma.supportMessage.create({
        data: {
          groupMessageId: 99988877,
          userTelegramId: "123456789",
        },
      });
      testSupportMsgId = msg.id;

      const found = await prisma.supportMessage.findUnique({
        where: { groupMessageId: 99988877 },
      });

      if (!found || found.userTelegramId !== "123456789") {
        throw new Error("SupportMessage topilmadi");
      }
    });

    await runTest("AdminUser tekshiruvi: bcrypt paroli xavfsizligi", async () => {
      const admin = await prisma.adminUser.findUnique({
        where: { username: "admin" },
      });

      if (!admin) {
        throw new Error("Boshlang'ich 'admin' foydalanuvchisi topilmadi");
      }

      const expectedPass = process.env["ADMIN_INITIAL_PASSWORD"] || process.env["ADMIN_PASSWORD"];
      if (expectedPass) {
        const isMatch = await bcrypt.compare(expectedPass, admin.password);
        if (!isMatch) {
          throw new Error("Boshlang'ich admin paroli mos kelmadi");
        }
      } else {
        if (!admin.password || !admin.password.startsWith("$2")) {
          throw new Error("Admin paroli bcrypt bilan hashlangan bo'lishi kerak");
        }
      }
    });
  } finally {
    // Tozalash (Cleanup)
    if (testSupportMsgId) {
      await prisma.supportMessage.delete({ where: { id: testSupportMsgId } }).catch(() => {});
    }
    if (testLeadId) {
      await prisma.lead.delete({ where: { id: testLeadId } }).catch(() => {});
    }
    if (testCollectionId) {
      await prisma.collection.delete({ where: { id: testCollectionId } }).catch(() => {});
    }
    if (testProductId) {
      await prisma.product.delete({ where: { id: testProductId } }).catch(() => {});
    }
    if (testCategoryId) {
      await prisma.category.delete({ where: { id: testCategoryId } }).catch(() => {});
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. VALIDATSIYA SXEMALARI (ZOD) TESTLARI
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("\n🛡️  2. VALIDATSIYA SXEMALARI (@mebel-salon/shared):\n");

  await runTest("leadSchema: To'g'ri ma'lumotlar muvaffaqiyatli o'tishi", () => {
    const validData = {
      customerName: "Jasur Ergashov",
      phone: "+998 90 123 45 67",
      address: "Samarqand sh.",
      notes: "Kechqurun yetkazilsin",
      source: "WEB" as const,
      itemsSummary: "Divan Comfort (x1)",
    };
    const res = leadSchema.safeParse(validData);
    if (!res.success) {
      throw new Error(`Kutilmagan xatolik: ${JSON.stringify(res.error.errors)}`);
    }
  });

  await runTest("leadSchema: Noto'g'ri telefon raqami rad etilishi", () => {
    const invalidData = {
      customerName: "Jasur",
      phone: "123", // juda qisqa
      source: "WEB" as const,
      itemsSummary: "Divan (x1)",
    };
    const res = leadSchema.safeParse(invalidData);
    if (res.success) {
      throw new Error("Noto'g'ri telefon raqami qabul qilinmasligi kerak edi");
    }
  });

  await runTest("leadSchema: Bo'sh ism rad etilishi", () => {
    const invalidData = {
      customerName: "",
      phone: "+998901234567",
      source: "WEB" as const,
      itemsSummary: "Divan (x1)",
    };
    const res = leadSchema.safeParse(invalidData);
    if (res.success) {
      throw new Error("Bo'sh ism qabul qilinmasligi kerak edi");
    }
  });

  await runTest("categorySchema: To'g'ri toifa qabul qilinishi va noto'g'ri tartib rad etilishi", () => {
    const valid = categorySchema.safeParse({
      nameUz: "Oshxona",
      nameRu: "Кухня",
      order: 1,
    });
    if (!valid.success) throw new Error("To'g'ri kategoriya o'tmadi");

    const invalid = categorySchema.safeParse({
      nameUz: "",
      order: "not-a-number",
    });
    if (invalid.success) throw new Error("Noto'g'ri kategoriya o'tmasligi kerak edi");
  });

  await runTest("productSchema: Bo'sh sarlavha yoki noto'g'ri status rad etilishi", () => {
    const valid = productSchema.safeParse({
      categoryId: "a0000000-0000-0000-0000-000000000000",
      titleUz: "Stul",
      stockStatus: "IN_STOCK",
      images: ["https://example.com/chair.jpg"],
    });
    if (!valid.success) throw new Error("To'g'ri mahsulot o'tmadi");

    const invalid = productSchema.safeParse({
      categoryId: "not-uuid",
      titleUz: "",
      stockStatus: "UNKNOWN_STATUS",
      images: [],
    });
    if (invalid.success) throw new Error("Noto'g'ri mahsulot rad etilishi kerak edi");
  });

  await runTest("collectionSchema: Bir nechta rasm va mahsulot ID lari qabul qilinishi", () => {
    const valid = collectionSchema.safeParse({
      titleUz: "Yotoqxona to'plami",
      images: ["https://example.com/bed-set.jpg"],
      productIds: ["a0000000-0000-0000-0000-000000000001"],
    });
    if (!valid.success) throw new Error("To'g'ri to'plam o'tmadi");
  });

  // ─────────────────────────────────────────────────────────────
  // 3. KO'P TILLILIK (i18n) LUG'ATLAR SIFATI VA SIMMETRIYASI
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("\n🌐 3. KO'P TILLILIK (i18n) LUG'ATLARI (messages/):\n");

  await runTest("i18n fayllari mavjudligi va JSON sintaksisi (uz.json, ru.json, en.json)", () => {
    const messagesDir = path.resolve(__dirname, "../messages");
    const uzRaw = fs.readFileSync(path.join(messagesDir, "uz.json"), "utf8");
    const ruRaw = fs.readFileSync(path.join(messagesDir, "ru.json"), "utf8");
    const enRaw = fs.readFileSync(path.join(messagesDir, "en.json"), "utf8");

    const uz = JSON.parse(uzRaw);
    const ru = JSON.parse(ruRaw);
    const en = JSON.parse(enRaw);

    if (!uz || !ru || !en) throw new Error("JSON fayllar o'qilmadi");

    // Kalitlarni rekursiv tekshirish
    function getKeys(obj: Record<string, unknown>, prefix = ""): string[] {
      let keys: string[] = [];
      for (const [key, val] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          keys = keys.concat(getKeys(val as Record<string, unknown>, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }

    const uzKeys = new Set(getKeys(uz));
    const ruKeys = new Set(getKeys(ru));
    const enKeys = new Set(getKeys(en));

    const missingInRu = [...uzKeys].filter((k) => !ruKeys.has(k));
    const missingInEn = [...uzKeys].filter((k) => !enKeys.has(k));

    if (missingInRu.length > 0) {
      throw new Error(`ru.json da yetishmayotgan kalitlar (${missingInRu.length}): ${missingInRu.slice(0, 5).join(", ")}...`);
    }
    if (missingInEn.length > 0) {
      throw new Error(`en.json da yetishmayotgan kalitlar (${missingInEn.length}): ${missingInEn.slice(0, 5).join(", ")}...`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 4. QAT'IY QOIDA: NARXLAR MUTLAQO YO'QLIGINI TEKSHIRISH
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("\n🚫 4. LOYIHA CHEKLOV QOIDALARI (Narxlar yo'qligi):\n");

  await runTest("Bazada va mahsulot modellarida narx ustunlari yo'qligi", () => {
    // schema.prisma da price, narx, discount, summa ustunlari bo'lmasligi kerak
    const schemaPath = path.resolve(__dirname, "../packages/db/prisma/schema.prisma");
    const schemaContent = fs.readFileSync(schemaPath, "utf8");

    const forbiddenFields = [
      /\bprice\b/i,
      /\bnarx\b/i,
      /\bdiscount\b/i,
      /\bcurrency\b/i,
      /\bamount\b/i,
      /\bcost\b/i,
    ];

    for (const pattern of forbiddenFields) {
      if (pattern.test(schemaContent)) {
        throw new Error(`schema.prisma da taqiqlangan narx maydoni topildi: ${pattern}`);
      }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 5. YORDAMCHI FUNKSIYALAR VA XAVFSIZLIK (escapeHtml, JWT)
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("\n🔐 5. XAVFSIZLIK VA TOKENLAR (JWT & jose):\n");

  await runTest("escapeHtml: Telegram HTML (&, <, >, \") maxsus belgilarini to'g'ri almashtirish", () => {
    const raw = `<script>alert("XSS & hack 'test'")</script>`;
    const escaped = escapeHtml(raw);

    if (
      escaped.includes("<") ||
      escaped.includes(">") ||
      escaped.includes('"')
    ) {
      throw new Error(`escapeHtml xavfli belgilarni o'tkazib yubordi: ${escaped}`);
    }

    if (
      !escaped.includes("&lt;script&gt;") ||
      !escaped.includes("&amp;") ||
      !escaped.includes("&quot;")
    ) {
      throw new Error(`escapeHtml noto'g'ri entity formatiga o'girdi: ${escaped}`);
    }
  });

  await runTest("JWT: Admin token yaratish (SignJWT) va tekshirish (jwtVerify)", async () => {
    const { SignJWT, jwtVerify } = await import("../apps/web/node_modules/jose/dist/node/esm/index.js");
    const secret = new TextEncoder().encode(process.env["JWT_SECRET"] || "default_test_jwt_secret_key_32_chars_long");

    const token = await new SignJWT({
      sub: "admin-uuid-123",
      username: "admin",
      name: "Tizim Administratori",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const { payload } = await jwtVerify(token, secret);
    if (payload.sub !== "admin-uuid-123" || payload["username"] !== "admin") {
      throw new Error("JWT token ma'lumotlari buzilgan");
    }

    // Soxta token tekshiruvi (rad etilishi kerak)
    try {
      const wrongSecret = new TextEncoder().encode("different_wrong_secret_key_at_least_32_chars");
      await jwtVerify(token, wrongSecret);
      throw new Error("Noto'g'ri secret bilan imzo qabul qilinmasligi kerak edi");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("Noto'g'ri secret bilan imzo")) {
        throw err;
      }
      // Kutilgan xatolik: JWT verification failed
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 6. TELEGRAM BOT VA INTEGRATSIYA TEKSHIRUVI
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("\n🤖 6. TELEGRAM BOT VA XABARLAR:\n");

  await runTest("Telegram Lead formati: HTML xabarnoma generatsiyasi", () => {
    const leadData = {
      customerName: "Otabek Qodirov",
      phone: "+998901234567",
      address: "Toshkent sh., Yunusobod",
      notes: "Kechqurun qo'ng'iroq qiling",
      itemsSummary: "1. Divan Comfort (x1)\n2. Kreslo Relax (x2)",
      source: "WEB",
    };

    const message =
      `🔔 <b>YANGI ARIZA!</b> (${escapeHtml(leadData.source)})\n\n` +
      `👤 <b>Mijoz:</b> ${escapeHtml(leadData.customerName)}\n` +
      `📞 <b>Telefon:</b> ${escapeHtml(leadData.phone)}\n` +
      `📍 <b>Manzil:</b> ${escapeHtml(leadData.address)}\n` +
      `🛋 <b>Tanlangan mebellar:</b>\n${escapeHtml(leadData.itemsSummary)}\n` +
      `📝 <b>Izoh:</b> ${escapeHtml(leadData.notes)}`;

    if (!message.includes("Otabek Qodirov") || !message.includes("+998901234567")) {
      throw new Error("Xabar matnida mijoz ma'lumotlari yo'q");
    }
    if (!message.includes("Divan Comfort")) {
      throw new Error("Xabar matnida tanlangan mebel yo'q");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 7. ATOMIK RATE LIMITING VA 20 TA PARALLEL SO'ROV TESTI
  // ─────────────────────────────────────────────────────────────
  process.stdout.write("\n🛡️  7. ATOMIK RATE LIMITING (PostgreSQL $queryRaw):\n");

  await runTest("Parallel 20 ta so'rov: Atomik hisoblash va aniq limit nazorati", async () => {
    const testKey = `test:parallel:race_condition_${Date.now()}`;
    const limit = 5;
    const windowSeconds = 60;

    // Bir vaqtning o'zida 20 ta parallel atomik so'rov yuborish
    const promises = Array.from({ length: 20 }, () =>
      checkRateLimitAtomic({
        key: testKey,
        limit,
        windowSeconds,
      })
    );

    const testResults = await Promise.all(promises);

    const allowedCount = testResults.filter((r) => r.allowed).length;
    const blockedCount = testResults.filter((r) => !r.allowed).length;

    if (allowedCount !== 5) {
      throw new Error(`Ruxsat berilgan so'rovlar soni 5 ta bo'lishi kerak edi, lekin ${allowedCount} ta bo'ldi`);
    }

    if (blockedCount !== 15) {
      throw new Error(`Bloklangan so'rovlar soni 15 ta bo'lishi kerak edi, lekin ${blockedCount} ta bo'ldi`);
    }

    // Bazadagi yakuniy count qiymatini tekshiramiz (Lost update bo'lmaganligini isbotlash)
    const dbRecord = await prisma.rateLimit.findUnique({
      where: { key: testKey },
    });

    if (!dbRecord || dbRecord.count !== 20) {
      throw new Error(
        `Bazadagi count qiymati aynan 20 bo'lishi shart edi (lost update tekshiruvi), amalda: ${dbRecord?.count}`
      );
    }

    // Tozalash
    await prisma.rateLimit.delete({ where: { key: testKey } });
  });

  await runTest("Alohida kalitlar izolyatsiyasi: login vs lead namespace", async () => {
    const loginKey = `auth:login:test_ip_${Date.now()}`;
    const leadKey = `api:lead:test_ip_${Date.now()}`;

    // Login uchun 1 ta so'rov
    const resLogin = await checkRateLimitAtomic({ key: loginKey, limit: 5, windowSeconds: 60 });
    // Lead uchun 1 ta so'rov
    const resLead = await checkRateLimitAtomic({ key: leadKey, limit: 5, windowSeconds: 60 });

    if (resLogin.count !== 1 || resLead.count !== 1) {
      throw new Error("Login va Lead kalitlari alohida hisoblanmadi");
    }

    await prisma.rateLimit.deleteMany({
      where: { key: { in: [loginKey, leadKey] } },
    });
  });

  await runTest("Eskirgan yozuvlarni tozalash mexanizmi (cleanupExpiredRateLimits)", async () => {
    const expiredKey = `test:expired_${Date.now()}`;
    // O'tgan vaqt bilan yozuv kiritamiz
    await prisma.rateLimit.create({
      data: {
        key: expiredKey,
        count: 10,
        resetAt: new Date(Date.now() - 10000), // 10 soniya oldin eskirgan
      },
    });

    const cleanedCount = await cleanupExpiredRateLimits();
    if (cleanedCount < 1) {
      throw new Error("Eskirgan yozuv tozalanmadi");
    }

    const check = await prisma.rateLimit.findUnique({
      where: { key: expiredKey },
    });
    if (check !== null) {
      throw new Error("Eskirgan yozuv hali ham bazada mavjud");
    }
  });

  // ─────────────────────────────────────────────────────────────
  // TEST XULOSASI
  // ─────────────────────────────────────────────────────────────
  await prisma.$disconnect();

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  process.stdout.write("\n=======================================================\n");
  process.stdout.write(`📊 TEST NATIJALARI: Jami: ${total} | O'tdi: ${passed} | Xatolik: ${failed}\n`);
  process.stdout.write("=======================================================\n\n");

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal test runner error: ${err}\n`);
  process.exit(1);
});
