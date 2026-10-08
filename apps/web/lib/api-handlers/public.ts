import { NextResponse } from "next/server";
import { prisma, type Prisma } from "@mebel-salon/db";
import { leadSchema } from "@mebel-salon/shared";
import { sendLeadTelegramNotification } from "@/lib/telegram/channel-notify";
import { checkLeadRateLimit } from "@/lib/rate-limit";
import { bot } from "@mebel-salon/telegram";
import {
  isTelegramUpdateProcessed,
  acquireTelegramUpdateLock,
  markTelegramUpdateDone,
  rollbackTelegramUpdate,
  cleanupTelegramUpdates,
} from "@mebel-salon/db";

// --- Health Check ---
export async function handleHealth(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    data: {
      status: "healthy",
      environment: process.env["NODE_ENV"] || "development",
      timestamp: new Date().toISOString(),
    },
  });
}

// --- Categories ---
export async function handleCategoriesGet(): Promise<NextResponse> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

// --- Products ---
export async function handleProductsGet(req: Request, idOrSlug?: string): Promise<NextResponse> {
  try {
    if (idOrSlug) {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
          category: true,
          collection: true,
        },
      });

      if (!product) {
        return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: product });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const categorySlug = searchParams.get("category")?.trim();
    const collectionSlug = searchParams.get("collection")?.trim();
    const categoryIdParam = searchParams.get("categoryId")?.trim();
    const search = searchParams.get("search")?.trim();
    const stockStatusParam = searchParams.get("stockStatus")?.trim();

    let categoryId: string | undefined = categoryIdParam || undefined;
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (!category) {
        return NextResponse.json({
          success: true,
          data: [],
          meta: { total: 0, page, limit },
        });
      }
      categoryId = category.id;
    }

    let collectionId: string | undefined;
    if (collectionSlug) {
      const collection = await prisma.collection.findUnique({
        where: { slug: collectionSlug },
      });

      if (!collection) {
        return NextResponse.json({
          success: true,
          data: [],
          meta: { total: 0, page, limit },
        });
      }
      collectionId = collection.id;
    }

    const stockStatus =
      stockStatusParam === "IN_STOCK" || stockStatusParam === "MADE_TO_ORDER"
        ? stockStatusParam
        : undefined;

    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categoryId }),
      ...(collectionId && { collectionId }),
      ...(stockStatus && { stockStatus }),
      ...(search && {
        OR: [
          { titleUz: { contains: search, mode: "insensitive" } },
          { titleRu: { contains: search, mode: "insensitive" } },
          { titleEn: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          collection: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

// --- Collections ---
export async function handleCollectionsGet(req: Request, idOrSlug?: string): Promise<NextResponse> {
  try {
    if (idOrSlug) {
      const collection = await prisma.collection.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
          products: {
            include: {
              category: {
                select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!collection) {
        return NextResponse.json({ success: false, error: "Komplekt topilmadi" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: collection });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const [total, collections] = await Promise.all([
      prisma.collection.count(),
      prisma.collection.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: collections,
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Collections API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

// --- Leads ---
function isValidOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const hostHeader = req.headers.get("host");
    const forwardedHost = req.headers.get("x-forwarded-host");

    // 1. Same host / port or reverse proxy match
    if (hostHeader) {
      const cleanHost = hostHeader.split(":")[0];
      if (originUrl.host === hostHeader || originUrl.hostname === cleanHost) {
        return true;
      }
    }

    if (forwardedHost) {
      const cleanForwarded = forwardedHost.split(":")[0];
      if (originUrl.host === forwardedHost || originUrl.hostname === cleanForwarded) {
        return true;
      }
    }

    // 2. Configured app URL
    const appUrlString = process.env["NEXT_PUBLIC_APP_URL"];
    if (appUrlString) {
      try {
        const appUrl = new URL(appUrlString);
        if (originUrl.host === appUrl.host || originUrl.hostname === appUrl.hostname) {
          return true;
        }
      } catch {
        // ignore invalid URL in config
      }
    }

    // 3. Localhost / Loopback environments
    if (
      originUrl.hostname === "localhost" ||
      originUrl.hostname === "127.0.0.1" ||
      originUrl.hostname === "0.0.0.0"
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function handleLeadsPost(req: Request): Promise<NextResponse> {
  if (!isValidOrigin(req)) {
    return NextResponse.json(
      { success: false, error: "Ruxsat berilmagan manba (Forbidden origin)" },
      { status: 403 }
    );
  }

  const rateLimit = await checkLeadRateLimit(req);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "So'rovlar soni cheklovdan oshdi. Iltimos, bir ozdan so'ng qayta urinib ko'ring.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        notes: data.notes || null,
        telegramId: data.telegramId || null,
        source: "WEB",
        itemsSummary: data.itemsSummary,
      },
    });

    try {
      await sendLeadTelegramNotification({
        id: lead.id,
        customerName: lead.customerName,
        phone: lead.phone,
        address: lead.address,
        latitude: lead.latitude,
        longitude: lead.longitude,
        notes: lead.notes,
        telegramId: lead.telegramId,
        itemsSummary: lead.itemsSummary,
        source: "WEB",
        createdAt: lead.createdAt,
      });
    } catch (notifyErr) {
      console.error("Lead Telegram notify failed (lead saved successfully):", notifyErr);
    }

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error) {
    console.error("Leads API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

// --- Telegram Bot Webhook ---
export async function handleBotPost(req: Request): Promise<NextResponse> {
  const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
  const expectedSecret = process.env["TELEGRAM_WEBHOOK_SECRET"];

  if (!expectedSecret || secretHeader !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid secret token" },
      { status: 401 }
    );
  }

  let currentUpdateId: number | null = null;

  try {
    const update = await req.json();
    const updateId = update?.update_id;

    if (typeof updateId === "number") {
      currentUpdateId = updateId;

      const alreadyDone = await isTelegramUpdateProcessed(updateId);
      if (alreadyDone) {
        return NextResponse.json(
          { ok: true, duplicate: true, message: "Already completed update skipped" },
          { status: 200 }
        );
      }

      const lockAcquired = await acquireTelegramUpdateLock(updateId);
      if (!lockAcquired) {
        return NextResponse.json(
          { ok: true, duplicate: true, message: "Update currently processing in parallel" },
          { status: 200 }
        );
      }
    }

    await bot.handleUpdate(update);

    if (typeof currentUpdateId === "number") {
      await markTelegramUpdateDone(currentUpdateId);
    }

    if (Math.random() < 0.05) {
      cleanupTelegramUpdates().catch(() => {});
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Telegram Webhook Route Error:", error);

    if (typeof currentUpdateId === "number") {
      await rollbackTelegramUpdate(currentUpdateId);
    }

    return NextResponse.json({ ok: false, error: "Internal processing error" }, { status: 500 });
  }
}
