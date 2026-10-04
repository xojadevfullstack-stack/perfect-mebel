import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import {
  CollectionChecklist,
  type ChecklistProduct,
} from "@/components/collections/collection-checklist";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface CollectionDetailPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: CollectionDetailPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "collectionDetail" });
  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { titleUz: true, titleRu: true, titleEn: true, descUz: true, descRu: true, descEn: true },
  });

  if (!collection) {
    return { title: t("notFoundTitle") };
  }

  const title =
    locale === "ru" && collection.titleRu
      ? collection.titleRu
      : locale === "en" && collection.titleEn
      ? collection.titleEn
      : collection.titleUz;

  const desc =
    locale === "ru" && collection.descRu
      ? collection.descRu
      : locale === "en" && collection.descEn
      ? collection.descEn
      : collection.descUz;

  return {
    title: t("metaTitle", { title }),
    description: desc || t("metaDescription"),
  };
}

export default async function CollectionDetailPage({
  params: { locale, slug },
}: CollectionDetailPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "navigation" });
  const t = await getTranslations({ locale, namespace: "collectionDetail" });

  const dbCollection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          category: {
            select: { nameUz: true, nameRu: true, nameEn: true },
          },
        },
      },
    },
  });

  if (!dbCollection) {
    notFound();
  }

  const checklistProducts: ChecklistProduct[] = dbCollection.products.map((p) => {
    const catName =
      locale === "ru" && p.category.nameRu
        ? p.category.nameRu
        : locale === "en" && p.category.nameEn
        ? p.category.nameEn
        : p.category.nameUz;

    return {
      id: p.id,
      slug: p.slug,
      titleUz: p.titleUz,
      titleRu: p.titleRu,
      titleEn: p.titleEn,
      images: p.images,
      dimensions: p.dimensions,
      material: p.material,
      warranty: p.warranty,
      stockStatus: p.stockStatus,
      categoryName: catName,
    };
  });

  const finalCollection = {
    id: dbCollection.id,
    slug: dbCollection.slug,
    titleUz: dbCollection.titleUz,
    titleRu: dbCollection.titleRu,
    titleEn: dbCollection.titleEn,
    descUz: dbCollection.descUz,
    descRu: dbCollection.descRu,
    descEn: dbCollection.descEn,
    images: dbCollection.images,
    products: checklistProducts,
  };

  const title =
    locale === "ru" && finalCollection.titleRu
      ? finalCollection.titleRu
      : locale === "en" && finalCollection.titleEn
      ? finalCollection.titleEn
      : finalCollection.titleUz;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Navigation */}
      <section className="bg-muted/30 border-b border-border/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <Link
            href={`/${locale}/collections`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5 -ml-2 text-muted-foreground hover:text-foreground hover:bg-transparent text-xs uppercase tracking-wider font-semibold"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{tNav("collections")}</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">{t("breadcrumb")}</span>
            <span className="hidden sm:inline">/</span>
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
              {title}
            </span>
          </div>
        </div>
      </section>

      {/* Main Checklist Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        <CollectionChecklist collection={finalCollection} />
      </main>
    </div>
  );
}
