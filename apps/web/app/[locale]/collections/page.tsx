import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { ArrowRight, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

interface CollectionsPageProps {
  params: { locale: string };
}

export default async function CollectionsPage({
  params: { locale },
}: CollectionsPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "collectionsPage" });


  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        select: { id: true, titleUz: true },
      },
    },
  });

  const displayCollections = collections;

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Header */}
      <section className="bg-muted/30 border-b border-border/80 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mb-2 block">
              {t("eyebrow")}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      {/* Grid of collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {displayCollections.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">{t("empty")}</p>
        )}
        <div className="grid gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayCollections.map((col) => {
            const title =
              locale === "ru" && "titleRu" in col && col.titleRu
                ? col.titleRu
                : locale === "en" && "titleEn" in col && col.titleEn
                ? col.titleEn
                : col.titleUz;

            const desc =
              locale === "ru" && "descRu" in col && col.descRu
                ? col.descRu
                : locale === "en" && "descEn" in col && col.descEn
                ? col.descEn
                : col.descUz;

            const coverImage = col.images.length > 0 ? col.images[0] : null;

            return (
              <Link
                key={col.id}
                href={`/${locale}/collections/${col.slug}`}
                className="group smooth-card flex flex-col justify-between overflow-hidden rounded-none border border-border bg-card block"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 ease-editorial group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Layers className="h-12 w-12 stroke-1" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-card text-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-border shadow-sm">
                      {t("itemsBadge", { count: col.products.length })}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-1.5 sm:space-y-2">
                    <span className="eyebrow block">
                      {t("ensemble")}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 ease-editorial">
                      {title}
                    </h2>
                    {desc && (
                      <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed pt-1">
                        {desc}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
