import { NextResponse } from "next/server";
import { prisma, type Prisma } from "@mebel-salon/db";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const categorySlug = searchParams.get("category")?.trim();
    const collectionSlug = searchParams.get("collection")?.trim();

    let categoryId: string | undefined;
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      // Agar ko'rsatilgan slug bo'yicha kategoriya topilmasa, xato emas, bo'sh ro'yxat qaytariladi
      if (!category) {
        return NextResponse.json({
          success: true,
          data: [],
          meta: {
            total: 0,
            page,
            limit,
          },
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
          meta: {
            total: 0,
            page,
            limit,
          },
        });
      }
      collectionId = collection.id;
    }

    const where: Prisma.ProductWhereInput = {
      ...(categoryId && { categoryId }),
      ...(collectionId && { collectionId }),
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
