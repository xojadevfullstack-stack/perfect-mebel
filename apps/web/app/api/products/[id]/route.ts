import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";

interface RouteParams {
  params: { id: string };
}

export async function GET(
  _req: Request,
  { params: { id } }: RouteParams
): Promise<NextResponse> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
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
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}
