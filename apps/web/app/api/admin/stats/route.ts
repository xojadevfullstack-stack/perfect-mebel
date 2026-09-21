import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Ruxsat yo'q" }, { status: 401 });
  }

  const [categoriesCount, productsCount, collectionsCount, leadsCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.collection.count(),
    prisma.lead.count(),
  ]);

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        categories: categoriesCount,
        products: productsCount,
        collections: collectionsCount,
        leads: leadsCount,
      },
      categories,
    },
  });
}
