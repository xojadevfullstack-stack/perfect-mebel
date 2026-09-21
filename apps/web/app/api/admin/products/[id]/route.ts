import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { updateProductSchema } from "@/lib/schemas/product";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

export async function GET(
  _req: Request,
  { params: { id } }: RouteParams
): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        collection: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params: { id } }: RouteParams
): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

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

    // 1. Yangi category ko'rsatilgan bo'lsa, mavjudligini tekshirish
    if (input.categoryId && input.categoryId !== existing.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!categoryExists) {
        return NextResponse.json(
          { success: false, error: "Ko'rsatilgan kategoriya topilmadi" },
          { status: 400 }
        );
      }
    }

    // 2. Yangi collection ko'rsatilgan bo'lsa, mavjudligini tekshirish
    if (input.collectionId && input.collectionId !== existing.collectionId) {
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

    // 3. Slug unikalligi
    let newSlug = input.slug;
    if (!newSlug && input.titleUz && input.titleUz !== existing.titleUz) {
      newSlug = slugify(input.titleUz);
    }

    if (newSlug && newSlug !== existing.slug) {
      const slugConflict = await prisma.product.findUnique({
        where: { slug: newSlug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, error: "Bunday slug bilan boshqa mahsulot mavjud" },
          { status: 400 }
        );
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
      include: {
        category: true,
        collection: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params: { id } }: RouteParams
): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
