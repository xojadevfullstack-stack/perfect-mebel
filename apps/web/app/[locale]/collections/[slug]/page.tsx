import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { ChevronLeft, Layers, Sparkles } from "lucide-react";

interface CollectionDetailPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: CollectionDetailPageProps): Promise<Metadata> {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { titleUz: true, titleRu: true, titleEn: true, descUz: true, descRu: true, descEn: true },
  });

  if (!collection) {
    return { title: "Komplekt topilmadi — Mebel Salon" };
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
    title: `${title} — Mebel Salon`,
    description: desc || "Zamonaviy sifatli mebellar to'plami",
  };
}

export default async function CollectionDetailPage({
  params: { locale, slug },
}: CollectionDetailPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "navigation" });
  const tCol = await getTranslations({ locale, namespace: "collections" });

  const collection = await prisma.collection.findUnique({
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

  if (!collection) {
    notFound();
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

  // Format checklist products
  const checklistProducts: ChecklistProduct[] = collection.products.map((p) => {
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

  const mainCover = collection.images.length > 0 ? collection.images[0] : null;

  return (
    <div className="container py-8 md:py-12 space-y-10">
      {/* Orqaga navigatsiya */}
      <div>
        <Link
          href={`/${locale}/collections`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 -ml-2"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{tNav("collections")}</span>
        </Link>
      </div>

      {/* Komplekt Sarlavhasi va Asosiy Rasmlar */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Rasmlar galereyasi */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted shadow-md">
            {mainCover ? (
              <Image
                src={mainCover}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Layers className="h-16 w-16 stroke-1" />
              </div>
            )}
          </div>

          {/* Qo'shimcha rasmlar thumbnail lari */}
          {collection.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {collection.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted"
                >
                  <Image
                    src={img}
                    alt={`${title} - ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Komplekt haqida qisqacha */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{collection.products.length} {tCol("itemsCount")}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
              {title}
            </h1>
            {desc && (
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                {desc}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>{tCol("title")}:</span>
              <span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground border-t pt-2">
              <span>{tCol("checklistTitle")}:</span>
              <span className="font-medium text-foreground">
                {collection.products.length} {tCol("itemsCount")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interaktiv Checklist Bo'limi */}
      <div className="pt-6 border-t">
        <CollectionChecklist
          collection={{
            id: collection.id,
            slug: collection.slug,
            titleUz: collection.titleUz,
            titleRu: collection.titleRu,
            titleEn: collection.titleEn,
            descUz: collection.descUz,
            descRu: collection.descRu,
            descEn: collection.descEn,
            images: collection.images,
            products: checklistProducts,
          }}
        />
      </div>
    </div>
  );
}
