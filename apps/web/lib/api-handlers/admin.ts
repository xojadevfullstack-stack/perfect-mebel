import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma, type Prisma, type LeadSource } from "@mebel-salon/db";
import {
  categorySchema,
  updateCategorySchema,
  productSchema,
  updateProductSchema,
  collectionSchema,
  updateCollectionSchema,
  attachProductsSchema,
} from "@mebel-salon/shared";
import { createAdminToken, verifyPassword, getAdminSession } from "@/lib/auth";
import { checkLoginRateLimit, getClientIpInfo } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";
import { uploadImageFile } from "@/lib/storage";

// ==========================================
// 1. ADMIN AUTH
// ==========================================
const loginSchema = z.object({
  username: z.string().min(1, "Foydalanuvchi nomi kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

export async function handleAdminAuthLogin(req: Request): Promise<NextResponse> {
  try {
    const rateLimit = await checkLoginRateLimit(req);
    if (!rateLimit.allowed) {
      const remainingMinutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p urinishlar. Iltimos, ${remainingMinutes} daqiqadan so'ng qayta urinib ko'ring.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    const { key } = getClientIpInfo(req);
    await prisma.rateLimit.deleteMany({
      where: { key: `auth:login:${key}` },
    }).catch(() => {});

    const token = await createAdminToken({
      id: admin.id,
      name: admin.name,
      username: admin.username,
    });

    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Tizimga kirishda server xatoligi yuz berdi" },
      { status: 500 }
    );
  }
}

export async function handleAdminAuthLogout(): Promise<NextResponse> {
  cookies().delete("admin_token");
  return NextResponse.json({ success: true, data: null });
}

export async function handleAdminAuthMe(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: session.sub,
      name: session.name,
      username: session.username,
    },
  });
}

// ==========================================
// 2. ADMIN CATEGORIES
// ==========================================
export async function handleAdminCategoriesGet(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const [total, categories] = await Promise.all([
      prisma.category.count(),
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("Admin Categories GET Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function handleAdminCategoriesPost(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const slug = input.slug || slugify(input.nameUz);

    if (!slug) {
      return NextResponse.json({ success: false, error: "Kategoriya slugi hosil qilinmadi" }, { status: 400 });
    }

    const existingSlug = await prisma.category.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ success: false, error: "Bunday slug bilan kategoriya allaqachon mavjud" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        nameUz: input.nameUz,
        nameRu: input.nameRu || input.nameUz,
        nameEn: input.nameEn || input.nameUz,
        slug,
        order: input.order ?? 0,
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Admin Categories POST Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function handleAdminCategoryDetail(req: Request, id: string): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
      });
      if (!category) {
        return NextResponse.json({ success: false, error: "Kategoriya topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: category });
    } catch (error) {
      console.error("Admin Category Detail GET Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "PUT") {
    try {
      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ success: false, error: "Kategoriya topilmadi" }, { status: 404 });
      }

      const body = await req.json();
      const parsed = updateCategorySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
          { status: 400 }
        );
      }

      const input = parsed.data;
      let newSlug = input.slug;
      if (!newSlug && input.nameUz && input.nameUz !== existing.nameUz) {
        newSlug = slugify(input.nameUz);
      }

      if (newSlug && newSlug !== existing.slug) {
        const slugConflict = await prisma.category.findUnique({ where: { slug: newSlug } });
        if (slugConflict && slugConflict.id !== id) {
          return NextResponse.json({ success: false, error: "Bunday slug bilan boshqa kategoriya mavjud" }, { status: 400 });
        }
      }

      const updated = await prisma.category.update({
        where: { id },
        data: {
          ...(input.nameUz && { nameUz: input.nameUz }),
          ...(input.nameRu !== undefined && { nameRu: input.nameRu || input.nameUz || existing.nameUz }),
          ...(input.nameEn !== undefined && { nameEn: input.nameEn || input.nameUz || existing.nameUz }),
          ...(newSlug && { slug: newSlug }),
          ...(input.order !== undefined && { order: input.order }),
        },
        include: { _count: { select: { products: true } } },
      });

      return NextResponse.json({ success: true, data: updated });
    } catch (error) {
      console.error("Admin Category Detail PUT Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
      });
      if (!category) {
        return NextResponse.json({ success: false, error: "Kategoriya topilmadi" }, { status: 404 });
      }
      if (category._count.products > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Ushbu toifaga biriktirilgan ${category._count.products} ta mahsulot mavjud. O'chirishdan oldin mahsulotlarni boshqa toifaga o'tkazing yoki o'chiring.`,
          },
          { status: 400 }
        );
      }
      await prisma.category.delete({ where: { id } });
      return NextResponse.json({ success: true, data: null });
    } catch (error) {
      console.error("Admin Category Detail DELETE Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: "Metod qo'llab-quvvatlanmaydi" }, { status: 405 });
}

// ==========================================
// 3. ADMIN PRODUCTS
// ==========================================
export async function handleAdminProductsGet(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const categoryId = searchParams.get("categoryId") || undefined;
    const collectionId = searchParams.get("collectionId") || undefined;
    const search = searchParams.get("search")?.trim() || undefined;

    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categoryId }),
      ...(collectionId && { collectionId }),
      ...(search && {
        OR: [
          { titleUz: { contains: search, mode: "insensitive" } },
          { titleRu: { contains: search, mode: "insensitive" } },
          { titleEn: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
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
        include: { category: true, collection: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("Admin Products GET Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function handleAdminProductsPost(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const categoryExists = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!categoryExists) {
      return NextResponse.json({ success: false, error: "Ko'rsatilgan kategoriya topilmadi" }, { status: 400 });
    }

    if (input.collectionId) {
      const collectionExists = await prisma.collection.findUnique({ where: { id: input.collectionId } });
      if (!collectionExists) {
        return NextResponse.json({ success: false, error: "Ko'rsatilgan kolleksiya topilmadi" }, { status: 400 });
      }
    }

    let slug = input.slug || slugify(input.titleUz);
    if (!slug) slug = `product-${Date.now()}`;

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ success: false, error: "Bunday slug bilan mahsulot allaqachon mavjud" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        categoryId: input.categoryId,
        collectionId: input.collectionId || null,
        slug,
        titleUz: input.titleUz,
        titleRu: input.titleRu || input.titleUz,
        titleEn: input.titleEn || input.titleUz,
        descUz: input.descUz || null,
        descRu: input.descRu || input.descUz || null,
        descEn: input.descEn || input.descUz || null,
        dimensions: input.dimensions || null,
        material: input.material || null,
        warranty: input.warranty || null,
        stockStatus: input.stockStatus,
        images: input.images,
      },
      include: { category: true, collection: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Admin Products POST Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function handleAdminProductDetail(req: Request, id: string): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true, collection: true },
      });
      if (!product) {
        return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: product });
    } catch (error) {
      console.error("Admin Product Detail GET Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "PUT") {
    try {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
      }

      const body = await req.json();
      const parsed = updateProductSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
          { status: 400 }
        );
      }

      const input = parsed.data;

      if (input.categoryId && input.categoryId !== existing.categoryId) {
        const categoryExists = await prisma.category.findUnique({ where: { id: input.categoryId } });
        if (!categoryExists) {
          return NextResponse.json({ success: false, error: "Ko'rsatilgan kategoriya topilmadi" }, { status: 400 });
        }
      }

      if (input.collectionId && input.collectionId !== existing.collectionId) {
        const collectionExists = await prisma.collection.findUnique({ where: { id: input.collectionId } });
        if (!collectionExists) {
          return NextResponse.json({ success: false, error: "Ko'rsatilgan kolleksiya topilmadi" }, { status: 400 });
        }
      }

      let newSlug = input.slug;
      if (!newSlug && input.titleUz && input.titleUz !== existing.titleUz) {
        newSlug = slugify(input.titleUz);
      }

      if (newSlug && newSlug !== existing.slug) {
        const slugConflict = await prisma.product.findUnique({ where: { slug: newSlug } });
        if (slugConflict && slugConflict.id !== id) {
          return NextResponse.json({ success: false, error: "Bunday slug bilan boshqa mahsulot mavjud" }, { status: 400 });
        }
      }

      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...(input.categoryId && { categoryId: input.categoryId }),
          ...(input.collectionId !== undefined && { collectionId: input.collectionId }),
          ...(newSlug && { slug: newSlug }),
          ...(input.titleUz && { titleUz: input.titleUz }),
          ...(input.titleRu !== undefined && { titleRu: input.titleRu || input.titleUz || existing.titleUz }),
          ...(input.titleEn !== undefined && { titleEn: input.titleEn || input.titleUz || existing.titleUz }),
          ...(input.descUz !== undefined && { descUz: input.descUz }),
          ...(input.descRu !== undefined && { descRu: input.descRu || input.descUz || existing.descUz }),
          ...(input.descEn !== undefined && { descEn: input.descEn || input.descUz || existing.descEn }),
          ...(input.dimensions !== undefined && { dimensions: input.dimensions }),
          ...(input.material !== undefined && { material: input.material }),
          ...(input.warranty !== undefined && { warranty: input.warranty }),
          ...(input.stockStatus && { stockStatus: input.stockStatus }),
          ...(input.images && { images: input.images }),
        },
        include: { category: true, collection: true },
      });

      return NextResponse.json({ success: true, data: updated });
    } catch (error) {
      console.error("Admin Product Detail PUT Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
      }
      await prisma.product.delete({ where: { id } });
      return NextResponse.json({ success: true, data: null });
    } catch (error) {
      console.error("Admin Product Detail DELETE Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: "Metod qo'llab-quvvatlanmaydi" }, { status: 405 });
}

// ==========================================
// 4. ADMIN COLLECTIONS
// ==========================================
export async function handleAdminCollectionsGet(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { titleUz: { contains: search, mode: "insensitive" as const } },
            { titleRu: { contains: search, mode: "insensitive" as const } },
            { titleEn: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, collections] = await Promise.all([
      prisma.collection.count({ where }),
      prisma.collection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { products: true } },
          products: {
            select: { id: true, titleUz: true, images: true, stockStatus: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: collections,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("Admin Collections GET Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function handleAdminCollectionsPost(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = collectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const slug = input.slug || slugify(input.titleUz);
    if (!slug) {
      return NextResponse.json({ success: false, error: "Komplekt slugi hosil qilinmadi" }, { status: 400 });
    }

    const existingSlug = await prisma.collection.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ success: false, error: "Bunday slug bilan komplekt allaqachon mavjud" }, { status: 400 });
    }

    const collection = await prisma.$transaction(async (tx) => {
      const created = await tx.collection.create({
        data: {
          titleUz: input.titleUz,
          titleRu: input.titleRu || input.titleUz,
          titleEn: input.titleEn || input.titleUz,
          descUz: input.descUz,
          descRu: input.descRu,
          descEn: input.descEn,
          slug,
          images: input.images || [],
        },
      });

      if (input.productIds && input.productIds.length > 0) {
        await tx.product.updateMany({
          where: { id: { in: input.productIds } },
          data: { collectionId: created.id },
        });
      }

      return tx.collection.findUnique({
        where: { id: created.id },
        include: {
          _count: { select: { products: true } },
          products: {
            select: { id: true, titleUz: true, images: true, stockStatus: true },
          },
        },
      });
    });

    return NextResponse.json({ success: true, data: collection }, { status: 201 });
  } catch (error) {
    console.error("Admin Collections POST Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function handleAdminCollectionDetail(req: Request, id: string): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id },
        include: {
          _count: { select: { products: true } },
          products: {
            select: {
              id: true,
              titleUz: true,
              titleRu: true,
              titleEn: true,
              images: true,
              stockStatus: true,
              dimensions: true,
              material: true,
              warranty: true,
            },
          },
        },
      });
      if (!collection) {
        return NextResponse.json({ success: false, error: "Komplekt topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: collection });
    } catch (error) {
      console.error("Admin Collection Detail GET Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const existing = await prisma.collection.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ success: false, error: "Komplekt topilmadi" }, { status: 404 });
      }

      const body = await req.json();
      const parsed = updateCollectionSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
          { status: 400 }
        );
      }

      const input = parsed.data;
      let slug = input.slug;
      if (!slug && input.titleUz) {
        slug = slugify(input.titleUz);
      }

      if (slug && slug !== existing.slug) {
        const slugConflict = await prisma.collection.findUnique({ where: { slug } });
        if (slugConflict && slugConflict.id !== id) {
          return NextResponse.json({ success: false, error: "Bunday slug bilan komplekt allaqachon mavjud" }, { status: 400 });
        }
      }

      const updated = await prisma.$transaction(async (tx) => {
        const col = await tx.collection.update({
          where: { id },
          data: {
            titleUz: input.titleUz,
            titleRu: input.titleRu,
            titleEn: input.titleEn,
            descUz: input.descUz,
            descRu: input.descRu,
            descEn: input.descEn,
            slug: slug || existing.slug,
            images: input.images !== undefined ? input.images : existing.images,
          },
        });

        if (input.productIds !== undefined) {
          await tx.product.updateMany({
            where: { collectionId: id },
            data: { collectionId: null },
          });

          if (input.productIds.length > 0) {
            await tx.product.updateMany({
              where: { id: { in: input.productIds } },
              data: { collectionId: id },
            });
          }
        }

        return tx.collection.findUnique({
          where: { id: col.id },
          include: {
            _count: { select: { products: true } },
            products: {
              select: { id: true, titleUz: true, images: true, stockStatus: true },
            },
          },
        });
      });

      return NextResponse.json({ success: true, data: updated });
    } catch (error) {
      console.error("Admin Collection Detail PUT Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.collection.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ success: false, error: "Komplekt topilmadi" }, { status: 404 });
      }
      await prisma.collection.delete({ where: { id } });
      return NextResponse.json({ success: true, data: { message: "Komplekt muvaffaqiyatli o'chirildi" } });
    } catch (error) {
      console.error("Admin Collection Detail DELETE Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: "Metod qo'llab-quvvatlanmaydi" }, { status: 405 });
}

export async function handleAdminCollectionProducts(req: Request, collectionId: string): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany({
        where: { collectionId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, data: products });
    } catch (error) {
      console.error("Admin Collection Products GET Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const parsed = attachProductsSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
          { status: 400 }
        );
      }
      const { productIds } = parsed.data;
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { collectionId },
      });
      return NextResponse.json({
        success: true,
        data: { message: `${productIds.length} ta mebel komplektga muvaffaqiyatli biriktirildi` },
      });
    } catch (error) {
      console.error("Admin Collection Products POST Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { searchParams } = new URL(req.url);
      const productId = searchParams.get("productId");
      if (productId) {
        await prisma.product.updateMany({
          where: { id: productId, collectionId },
          data: { collectionId: null },
        });
        return NextResponse.json({ success: true, data: { message: "Mebel komplektdan ajratildi" } });
      }

      const body = await req.json().catch(() => ({}));
      const parsed = attachProductsSchema.safeParse(body);
      if (parsed.success) {
        await prisma.product.updateMany({
          where: { id: { in: parsed.data.productIds }, collectionId },
          data: { collectionId: null },
        });
        return NextResponse.json({ success: true, data: { message: "Mebellar komplektdan ajratildi" } });
      }
      return NextResponse.json({ success: false, error: "productId yoki productIds talab qilinadi" }, { status: 400 });
    } catch (error) {
      console.error("Admin Collection Products DELETE Error:", error);
      return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: "Metod qo'llab-quvvatlanmaydi" }, { status: 405 });
}

// ==========================================
// 5. ADMIN LEADS
// ==========================================
export async function handleAdminLeadsGet(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim();
    const source = searchParams.get("source")?.toUpperCase();

    const where: {
      source?: LeadSource;
      OR?: Array<{
        customerName?: { contains: string; mode: "insensitive" };
        phone?: { contains: string; mode: "insensitive" };
        address?: { contains: string; mode: "insensitive" };
        itemsSummary?: { contains: string; mode: "insensitive" };
        notes?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (source === "WEB" || source === "BOT") {
      where.source = source as LeadSource;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { itemsSummary: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("Admin Leads API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

// ==========================================
// 6. ADMIN STATS
// ==========================================
export async function handleAdminStatsGet(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 401 });
  }

  const [categoriesCount, productsCount, collectionsCount, leadsCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.collection.count(),
    prisma.lead.count(),
  ]);

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        categories: categoriesCount,
        products: productsCount,
        collections: collectionsCount,
        leads: leadsCount,
      },
      categories,
    },
  });
}

// ==========================================
// 7. ADMIN UPLOAD
// ==========================================
export async function handleAdminUploadPost(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Fayl yuklanmadi yoki form-data dagi 'file' maydoni bo'sh" },
        { status: 400 }
      );
    }

    const result = await uploadImageFile(file);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Admin Upload API Error:", error);
    const message = error instanceof Error ? error.message : "Rasm yuklashda xatolik yuz berdi";
    const status = message.includes("Production") || message.includes("Supabase") ? 500 : 400;
    const clientError = status === 500 ? "Rasm yuklashda server xatoligi yuz berdi" : message;
    return NextResponse.json({ success: false, error: clientError }, { status });
  }
}
