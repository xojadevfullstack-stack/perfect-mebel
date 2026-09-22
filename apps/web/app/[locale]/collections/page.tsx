import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Layers, ArrowRight, Package } from "lucide-react";

interface CollectionsPageProps {
  params: { locale: string };
}

export default async function CollectionsPage({
  params: { locale },
}: CollectionsPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const tCol = await getTranslations({ locale, namespace: "collections" });

  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        select: { id: true },
      },
    },
  });

  return (
    <div className="container py-10 md:py-16 space-y-10">
      {/* Sahifa sarlavhasi */}
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Layers className="h-3.5 w-3.5" />
          <span>{tCol("title")}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {tCol("title")}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {tCol("subtitle")}
        </p>
      </div>

      {/* Komplektlar Grid */}
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-semibold text-lg">{tCol("empty")}</h3>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => {
            const title =
              locale === "ru" && col.titleRu
                ? col.titleRu
                : locale === "en" && col.titleEn
                ? col.titleEn
                : col.titleUz;

            const desc =
              locale === "ru" && col.descRu
                ? col.descRu
                : locale === "en" && col.descEn
                ? col.descEn
                : col.descUz;

            const coverImage = col.images.length > 0 ? col.images[0] : null;

            return (
              <Card
                key={col.id}
                className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:border-primary/50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Layers className="h-12 w-12 stroke-1" />
                    </div>
                  )}

                  <Badge className="absolute top-4 right-4 bg-background/90 text-foreground backdrop-blur shadow-sm border font-semibold">
                    {col.products.length} {tCol("itemsCount")}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-6 space-y-4">
                  <div className="space-y-2 flex-1">
                    <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {title}
                    </h2>
                    {desc && (
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Link
                      href={`/${locale}/collections/${col.slug}`}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full justify-between group/btn"
                      )}
                    >
                      <span>{tCol("viewSet")}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
