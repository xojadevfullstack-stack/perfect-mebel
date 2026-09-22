import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const idOrSlug = params.id;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
