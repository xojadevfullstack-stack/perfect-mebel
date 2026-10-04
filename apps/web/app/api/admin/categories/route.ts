import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { categorySchema } from "@mebel-salon/shared";
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
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin Categories GET Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
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
      return NextResponse.json(
        { success: false, error: "Kategoriya slugi hosil qilinmadi" },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Bunday slug bilan kategoriya allaqachon mavjud" },
        { status: 400 }
      );
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
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Admin Categories POST Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}
