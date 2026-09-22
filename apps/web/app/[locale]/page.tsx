import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { ProductCard } from "@/components/catalog/product-card";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Factory,
  Wrench,
  Award,
  Boxes,
  Send,
  PhoneCall,
} from "lucide-react";

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({
  params: { locale },
}: HomePageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  const tHome = await getTranslations("home");
  const tCol = await getTranslations("collections");
  const tContact = await getTranslations("contact");

  // DB dan ommabop mebellar (IN_STOCK) va komplektlarni yuklash
  const [popularProducts, collections] = await Promise.all([
    prisma.product.findMany({
      where: { stockStatus: "IN_STOCK" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
        },
      },
    }),
    prisma.collection.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-28">
        <div className="container mx-auto px-4 text-center sm:px-8">
          <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground shadow-sm animate-in fade-in">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>{tHome("heroBadge")}</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            {tHome("heroTitle")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {tHome("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/catalog`}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105"
            >
              <span>{tHome("viewCatalog")}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center space-x-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
              <span>{tHome("contactUs")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Ommabop Mebellar Sektsiyasi */}
      {popularProducts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end border-b border-border/60 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{tHome("popularTitle")}</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {tHome("popularSubtitle")}
              </h2>
            </div>
            <Link
              href={`/${locale}/catalog`}
              className="group inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              <span>{tHome("allProducts")}</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Komplektlar (Garniturlar) Taqdimoti */}
      {collections.length > 0 && (
        <section className="container mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end border-b border-border/60 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Boxes className="h-3.5 w-3.5" />
                <span>{tHome("collectionsTitle")}</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {tHome("collectionsSubtitle")}
              </h2>
            </div>
            <Link
              href={`/${locale}/collections`}
              className="group inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              <span>{tHome("viewAllCollections")}</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((col) => {
              const coverImage = col.images[0] || null;
              const title =
                locale === "ru" && col.titleRu
                  ? col.titleRu
                  : locale === "en" && col.titleEn
                  ? col.titleEn
                  : col.titleUz;

              return (
                <Link
                  key={col.id}
                  href={`/${locale}/collections/${col.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={coverImage.startsWith("/uploads")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Boxes className="h-10 w-10 stroke-1" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold text-foreground backdrop-blur">
                      {col._count.products} {tCol("itemsCount")}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <div className="mt-3 flex items-center text-xs font-semibold text-primary">
                      <span>{tCol("viewSet")}</span>
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Afzalliklarimiz Sektsiyasi */}
      <section className="bg-muted/30 py-16 border-y border-border/60">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {tHome("featuresTitle")}
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                {tHome("featureFactory")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {tHome("featureFactoryDesc")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                {tHome("featureCustom")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {tHome("featureCustomDesc")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">
                {tHome("featureWarranty")}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {tHome("featureWarrantyDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mini Aloqa & Telegram Banner */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-primary p-8 sm:p-12 text-primary-foreground shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {tHome("contactCta")}
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/90 leading-relaxed">
              {tContact("telegramBotDesc")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://t.me/mebel_salon_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-lg bg-background px-5 py-2.5 text-xs font-bold text-foreground shadow transition-colors hover:bg-background/90"
              >
                <Send className="h-4 w-4 text-primary" />
                <span>{tContact("openBot")}</span>
              </a>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center space-x-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                <PhoneCall className="h-4 w-4" />
                <span>{tHome("contactUs")}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
