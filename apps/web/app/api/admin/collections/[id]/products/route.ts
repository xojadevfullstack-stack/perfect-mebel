import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { attachProductsSchema } from "@mebel-salon/shared";
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
    const products = await prisma.product.findMany({
      where: { collectionId: params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Admin Collection Products GET Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: RouteParams): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

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
      data: { collectionId: params.id },
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

export async function DELETE(req: Request, { params }: RouteParams): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
      await prisma.product.updateMany({
        where: { id: productId, collectionId: params.id },
        data: { collectionId: null },
      });
      return NextResponse.json({ success: true, data: { message: "Mebel komplektdan ajratildi" } });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = attachProductsSchema.safeParse(body);

    if (parsed.success) {
      await prisma.product.updateMany({
        where: { id: { in: parsed.data.productIds }, collectionId: params.id },
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
