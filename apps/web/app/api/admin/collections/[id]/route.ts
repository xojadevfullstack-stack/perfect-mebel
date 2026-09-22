import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { updateCollectionSchema } from "@mebel-salon/shared";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteParams): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
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
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams): Promise<NextResponse> {
  return handleUpdate(req, params.id);
}

export async function PATCH(req: Request, { params }: RouteParams): Promise<NextResponse> {
  return handleUpdate(req, params.id);
}

async function handleUpdate(req: Request, id: string): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

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
      const slugConflict = await prisma.collection.findUnique({
        where: { slug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, error: "Bunday slug bilan komplekt allaqachon mavjud" },
          { status: 400 }
        );
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

      // Agar productIds berilgan bo'lsa, mahsulotlar birikmasini yangilaymiz
      if (input.productIds !== undefined) {
        // Avval mavjudlarini tozalaymiz
        await tx.product.updateMany({
          where: { collectionId: id },
          data: { collectionId: null },
        });

        // Yangi tanlanganlarni biriktiramiz
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
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.collection.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Komplekt topilmadi" }, { status: 404 });
    }

    // Prisma schema bo'yicha onDelete: SetNull qilingan, shuning uchun products collectionId null bo'ladi
    await prisma.collection.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { message: "Komplekt muvaffaqiyatli o'chirildi" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
