import * as React from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { CatalogView } from "@/components/catalog/catalog-view";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  params: { locale: string };
}

export default async function CatalogPage({
  params: { locale },
}: CatalogPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  // Kategoriyalarni bazadan server tomonda olish
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      nameUz: true,
      nameRu: true,
      nameEn: true,
    },
  });

  return (
    <React.Suspense
      fallback={
        <div className="container py-12 flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CatalogView initialCategories={categories} />
    </React.Suspense>
  );
}
