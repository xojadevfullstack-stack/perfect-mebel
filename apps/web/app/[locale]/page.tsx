import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { ProductCard } from "@/components/catalog/product-card";
import { QuickConsultationForm } from "@/components/lead/quick-consultation-form";
import {
  ArrowRight,
  Maximize2,
  ShieldCheck,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({
  params: { locale },
}: HomePageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "navigation" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tCollections = await getTranslations({ locale, namespace: "collections" });

  // DB dan ommabop mahsulotlar va komplektlarni olish
  const [popularProducts, dbCollections] = await Promise.all([
    prisma.product.findMany({
      where: { stockStatus: "IN_STOCK" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
        },
      },
    }),
    prisma.collection.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        products: {
          select: { id: true, titleUz: true, titleRu: true, titleEn: true },
          take: 4,
        },
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Warm Editorial Minimalism) */}
      {/* ======================================================== */}
      <section className="relative pt-8 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          {/* Editorial Kicker */}
          <span className="eyebrow block mb-3">
            Eksklyuziv Dizayn &bull; Tabiiy Materiallar
          </span>

          {/* Majestic Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-foreground font-bold max-w-4xl mx-auto leading-tight mb-5">
            Mukammal Makon Yarating
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Xonadoningiz uchun saralangan zamonaviy mebellar to'plami. Tinchlik, sokinlik va me'moriy estetika mujassamlashgan vitrina.
          </p>

          {/* Dual CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 w-full max-w-xs sm:max-w-none mx-auto">
            <Link
              href={`/${locale}/catalog`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider rounded-none smooth-btn shadow-none"
            >
              <span>{tNav("catalog")}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 border border-border-strong hover:border-foreground hover:bg-foreground hover:text-background bg-card text-foreground font-semibold text-xs uppercase tracking-wider rounded-none smooth-btn"
            >
              <span>{tNav("contacts")}</span>
            </Link>
          </div>
        </div>

        {/* Hero Architectural Image Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden border border-border bg-card">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80"
              alt="Mebel Salon Showcase"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 border border-border/80 bg-card/90 backdrop-blur-sm text-foreground text-[10px] sm:text-xs uppercase tracking-wider font-semibold shadow-sm">
              Atelier &bull; Individual Mebel
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECTION 1: SARALANGAN MAHSULOTLAR (4-Card Grid) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="eyebrow block mb-1">
              Saralangan Kolleksiya
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold tracking-tight">
              Ommabop Mebellar
            </h2>
          </div>
          <Link
            href={`/${locale}/catalog`}
            className="editorial-link"
          >
            <span className="editorial-link-text">{tCatalog("title")}</span>
            <ArrowRight className="editorial-link-arrow" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        {popularProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-border text-center text-muted-foreground">
            <p>{tCatalog("empty")}</p>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. SECTION 2: 50/50 EDITORIAL FEATURE */}
      {/* ======================================================== */}
      <section className="bg-muted/40 border-y border-border py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-card">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Mebel ustaxonasi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Story (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <span className="eyebrow block">
                Atelier Falsafasi
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight leading-tight">
                Tabiiy Yog'och va Nafis To'qimalar
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Biz har bir mahsulotni tayyorlashda yillar sinovidan o'tgan tabiiy eman, yong'oq va Italiya to'qima matolaridan foydalanamiz. Standart andozalardan xoli, har bir buyum alohida duradgorlik san'ati namunasi sifatida yaratiladi.
              </p>

              {/* Guarantees List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                      24 Oylik Kafolat
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Barcha konstruksiyalar va furnishing qismlariga rasmiy kafolat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Maximize2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                      Individual O'lcham
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Xonadoningiz arxitekturasi va chizmasiga moslashtirish.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={`/${locale}/about`}
                  className="editorial-link"
                >
                  <span className="editorial-link-text">{tNav("about")}</span>
                  <ArrowRight className="editorial-link-arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECTION 3: MUKAMMAL TO'PLAMLAR (Sets Showcase) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="eyebrow block mb-1">
              Garniturlar &bull; Ansambllar
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold tracking-tight">
              {tCollections("title")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
              {tCollections("subtitle")}
            </p>
          </div>
          <Link
            href={`/${locale}/collections`}
            className="editorial-link"
          >
            <span className="editorial-link-text">{tCollections("title")}</span>
            <ArrowRight className="editorial-link-arrow" />
          </Link>
        </div>

        {/* Collections Grid from DB */}
        {dbCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dbCollections.map((col) => {
              const title =
                locale === "ru" && col.titleRu
                  ? col.titleRu
                  : locale === "en" && col.titleEn
                  ? col.titleEn
                  : col.titleUz;

              const coverImage = col.images.length > 0 ? col.images[0] : null;

              return (
                <Link
                  key={col.id}
                  href={`/${locale}/collections/${col.slug}`}
                  className="group smooth-card border border-border bg-card overflow-hidden block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 ease-editorial group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Layers className="h-10 w-10 stroke-1" />
                      </div>
                    )}
                    <span className="status absolute top-3 left-3 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{col._count.products} ta mebel</span>
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 space-y-2.5">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 ease-editorial">
                      {title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {col.products.map((p) => {
                        const itemTitle =
                          locale === "ru" && p.titleRu
                            ? p.titleRu
                            : locale === "en" && p.titleEn
                            ? p.titleEn
                            : p.titleUz;
                        return (
                          <span
                            key={p.id}
                            className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border/80 text-muted-foreground"
                          >
                            {itemTitle}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-border text-center text-muted-foreground">
            <p>{tCollections("empty")}</p>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 5. SECTION 4: BIZNING QADRIYATLARIMIZ & KONSULTATSIYA */}
      {/* ======================================================== */}
      <section className="py-12 bg-background" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left: Values & Craftsmanship */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-card p-4 sm:p-8 lg:p-10 border border-border">
              <div>
                <span className="eyebrow block mb-2">
                  Bizning Qadriyatlarimiz
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-bold mb-4 leading-tight">
                  Har bir mebel — mahorat va tabiiy materiallar hosilasi
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed mb-6">
                  Toshkentdagi ustaxonamizda 15 yildan ortiq vaqt mobaynida an'anaviy duradgorlik san'atini zamonaviy arxitektura tamoyillari bilan uyg'unlashtirib kelmoqdamiz. Biz mebel emas, yillar davomida qadrini yo'qotmaydigan oilaviy xotira obyektlarini yaratamiz.
                </p>
              </div>

              {/* Artisan Workshop Photo */}
              <div className="relative aspect-[16/9] overflow-hidden border border-border/80 mb-6 bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=1200&auto=format&fit=crop"
                  alt="Ustaxona jarayoni — Toshkent"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 border border-border bg-card text-foreground text-[10px] uppercase tracking-wider font-semibold shadow-sm">
                  Ustaxona jarayoni — Toshkent, 2026
                </div>
              </div>

              <div className="space-y-4">
                <blockquote className="border-l-2 border-primary pl-4 italic font-serif text-sm text-foreground">
                  "Mukammallik ortiqcha bezakda emas, balki tabiiy tolalarning samimiy tilida namoyon bo'ladi."
                </blockquote>

                <div className="pt-2">
                  <Link
                    href={`/${locale}/about`}
                    className="editorial-link"
                  >
                    <span className="editorial-link-text">{tNav("about")}</span>
                    <ArrowRight className="editorial-link-arrow" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Quick Consultation Form */}
            <div className="lg:col-span-6 bg-card p-4 sm:p-8 lg:p-10 border border-border flex flex-col justify-between">
              <div>
                <span className="eyebrow block mb-2">
                  Atelier &amp; Konsultatsiya
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-bold mb-2">
                  Mebel Tanlashda Yordam Kerakmi?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  Telefon raqamingizni qoldiring, mutaxassisimiz xonadoningiz o'lchamlari bo'yicha maslahat beradi va hisoblab beradi.
                </p>

                <QuickConsultationForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
