import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { updateCategorySchema } from "@/lib/schemas/category";
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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: "Kategoriya topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
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
    const existing = await prisma.category.findUnique({
      where: { id },
    });

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
      const slugConflict = await prisma.category.findUnique({
        where: { slug: newSlug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, error: "Bunday slug bilan boshqa kategoriya mavjud" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(input.nameUz && { nameUz: input.nameUz }),
        ...(input.nameRu && { nameRu: input.nameRu }),
        ...(input.nameEn && { nameEn: input.nameEn }),
        ...(newSlug && { slug: newSlug }),
        ...(input.order !== undefined && { order: input.order }),
      },
      include: {
        _count: {
          select: { products: true },
        },
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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: "Kategoriya topilmadi" }, { status: 404 });
    }

    // Agar category'ga bog'liq product bo'lsa, o'chirishni bloklaymiz
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Ushbu toifaga biriktirilgan ${category._count.products} ta mahsulot mavjud. O'chirishdan oldin mahsulotlarni boshqa toifaga o'tkazing yoki o'chiring.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
