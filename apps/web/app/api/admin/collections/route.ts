import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { collectionSchema } from "@mebel-salon/shared";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request): Promise<NextResponse> {
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
          _count: {
            select: { products: true },
          },
          products: {
            select: {
              id: true,
              titleUz: true,
              images: true,
              stockStatus: true,
            },
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
    console.error("Admin Collections GET Error:", error);
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
      return NextResponse.json(
        { success: false, error: "Komplekt slugi hosil qilinmadi" },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.collection.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Bunday slug bilan komplekt allaqachon mavjud" },
        { status: 400 }
      );
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
