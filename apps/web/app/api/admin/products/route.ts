import { NextResponse } from "next/server";
import { prisma, type Prisma } from "@mebel-salon/db";
import { productSchema } from "@/lib/schemas/product";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request): Promise<NextResponse> {
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
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
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

    // 1. Kategoriya mavjudligini qat'iy tekshirish
    const categoryExists = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Ko'rsatilgan kategoriya topilmadi" },
        { status: 400 }
      );
    }

    // 2. Kolleksiya ko'rsatilgan bo'lsa, mavjudligini tekshirish
    if (input.collectionId) {
      const collectionExists = await prisma.collection.findUnique({
        where: { id: input.collectionId },
      });

      if (!collectionExists) {
        return NextResponse.json(
          { success: false, error: "Ko'rsatilgan kolleksiya topilmadi" },
          { status: 400 }
        );
      }
    }

    // 3. Slug tayyorlash va unikal tekshiruvi
    let slug = input.slug || slugify(input.titleUz);
    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Bunday slug bilan mahsulot allaqachon mavjud" },
        { status: 400 }
      );
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
      include: {
        category: true,
        collection: true,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
