import * as React from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { CatalogView } from "@/components/catalog/catalog-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CatalogPageProps {
  params: { locale: string };
}

export default async function CatalogPage({
  params: { locale },
}: CatalogPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  // Kategoriyalar va mahsulotlarni bazadan server tomonda olish
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        nameUz: true,
        nameRu: true,
        nameEn: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        collection: true,
      },
    }),
  ]);

  const initialProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleUz: p.titleUz,
    titleRu: p.titleRu,
    titleEn: p.titleEn,
    descUz: p.descUz,
    descRu: p.descRu,
    descEn: p.descEn,
    dimensions: p.dimensions,
    material: p.material,
    warranty: p.warranty,
    stockStatus: p.stockStatus as "IN_STOCK" | "MADE_TO_ORDER",
    images: p.images,
    article: p.id ? `PM-${p.id.slice(0, 4).toUpperCase()}` : undefined,
    category: p.category
      ? {
          id: p.category.id,
          slug: p.category.slug,
          nameUz: p.category.nameUz,
          nameRu: p.category.nameRu,
          nameEn: p.category.nameEn,
        }
      : null,
    colors: [],
  }));

  return (
    <React.Suspense
      fallback={
        <div className="container py-12 flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CatalogView initialCategories={categories} initialProducts={initialProducts} />
    </React.Suspense>
  );
}
