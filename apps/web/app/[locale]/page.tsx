import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { ProductCard, type ProductCardData } from "@/components/catalog/product-card";
import { QuickConsultationForm } from "@/components/lead/quick-consultation-form";
import {
  ArrowRight,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Layers,
} from "lucide-react";
import { ATELIER_PRODUCTS } from "@/lib/catalog-data";

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({
  params: { locale },
}: HomePageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  // DB dan ommabop mahsulotlar va komplektlarni olish
  const [popularDbProducts, dbCollections] = await Promise.all([
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
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  // Fallback products from ATELIER_PRODUCTS
  const fallbackProducts: ProductCardData[] = ATELIER_PRODUCTS.slice(0, 4).map((p) => ({
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
    stockStatus: p.stockStatus,
    images: p.images,
    article: p.article,
    colors: p.colors,
    category: {
      id: p.categorySlug,
      slug: p.categorySlug,
      nameUz: p.categoryName,
      nameRu: p.categoryName,
      nameEn: p.categoryName,
    },
  }));

  const popularProducts = popularDbProducts.length > 0 ? popularDbProducts : fallbackProducts;

  // Stitch & Lovable uslubidagi komplektlar
  const featuredSets = [
    {
      slug: "nordic-yashash-xonasi",
      title: "Nordic Yashash Xonasi To'plami",
      category: "Yaxlit Ansambl",
      items: ["Modulli Divan", "Jurnal Stoli", "TV Konsol"],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATnyonbIkv8ZAc6afuYQB25mX2C4CMBJi0udEuFwc9BOZo357mX1Teegjh1r1vN2VyR8U9DzS0gWXZXr9g8YDpshD1c0agf5QT1QnECZ1ytSryK7fZJ8Pj8L4_bSFWNK5iTEhxUZ7wOKXIGiGHzgUYq4-OjiRPIZrfouy7DvgiZm-jKl7s26_fFc1h32vRbVtMgLEoGOcXYKAnDV3juGl5RyBIySeKRG9YslIE4p7xETuhfkf-WCYLSArkvMX-tHO8Lm8xwrXqtNQ",
    },
    {
      slug: "kyoto-yotoqxona-toplami",
      title: "Venetsiya Yotoqxona To'plami",
      category: "Yaxlit Ansambl",
      items: ["Boucle Krovat", "2 ta Tumba", "Kitob Javoni"],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcDYSRzNE0rrW_Po8KOGmWeFj0Le5F2yCM-hkdAfBF825NkJLjakp8T9MNNlLdYWBG9ik8jPcdcwkj0-HUAUuGZbfW9IJW-FXkDM0bnL6sVB5KeY4IesTLOf3ASiqBT9Sg3VSP__3QFsMLWpuUJSVUerUIEc-VRVzpbd5usKe9YxQ_G0CgmQb8DR9x75S3dDB8C10k8MOvcMPoYH_S3TSax005YrqLafmogujVZuf3B6bExpjcwnoz1rIo6DLJCL7Ot16Pn2Zb-LE",
    },
    {
      slug: "milano-ovqatlanish-toplami",
      title: "Milano Ovqatlanish To'plami",
      category: "Yaxlit Ansambl",
      items: ["Katta Ovqat Stoli", "Tivoli Stuli", "Zen Kreslo"],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAvG1FELOfv6qU5qk8w7fjYgJfcJwAhtUElBQAm_ozXUCpFbD2Cz2ycaQgDJ8UWZAWR0TJwlArzpb88hNMbeYV9n9u0UNCizVwjWig111eCS59BJT8g-nWi7ulFh_Yxt3moil7qm6pwM0yo5wo3cRDedRvF3nXpwO5rtKiYvTQaijW4122HU4558GtTQrijheGi3wF8OKcmOBNx4JXzXKR0Ygh4XDsE_O5bq3D6dEQzHmDVSURaakNrojs90170bmKflp1gDoaSnks",
    },
  ];

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
              <span>Katalogni ko'rish</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 border border-border-strong hover:border-foreground hover:bg-foreground hover:text-background bg-card text-foreground font-semibold text-xs uppercase tracking-wider rounded-none smooth-btn"
            >
              Konsultatsiya olish
            </Link>
          </div>

          {/* Panoramic Editorial Showcase Banner (Pristine Luxury Interior Photography) */}
          <div className="group relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden border border-border bg-card shadow-whisper">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATnyonbIkv8ZAc6afuYQB25mX2C4CMBJi0udEuFwc9BOZo357mX1Teegjh1r1vN2VyR8U9DzS0gWXZXr9g8YDpshD1c0agf5QT1QnECZ1ytSryK7fZJ8Pj8L4_bSFWNK5iTEhxUZ7wOKXIGiGHzgUYq4-OjiRPIZrfouy7DvgiZm-jKl7s26_fFc1h32vRbVtMgLEoGOcXYKAnDV3juGl5RyBIySeKRG9YslIE4p7xETuhfkf-WCYLSArkvMX-tHO8Lm8xwrXqtNQ"
              alt="Perfect Mebel Atelier Showcase"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-1000 ease-editorial group-hover:scale-[1.025]"
            />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:bottom-8 sm:left-8 max-w-md border border-border bg-card p-3 sm:p-5 text-left space-y-1 shadow-md">
              <span className="eyebrow block text-[10px] sm:text-[11px]">
                Atelier &bull; Individual Mebel
              </span>
              <p className="font-serif text-sm sm:text-lg md:text-xl font-normal text-foreground leading-snug">
                "Har bir mebel — shaxsiy xonadoningiz me'moriy davomi."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECTION 1: OMMABOP MEBELLAR (Curated Products) */}
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
            <span className="editorial-link-text">Barchasini ko'rish</span>
            <ArrowRight className="editorial-link-arrow" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcDYSRzNE0rrW_Po8KOGmWeFj0Le5F2yCM-hkdAfBF825NkJLjakp8T9MNNlLdYWBG9ik8jPcdcwkj0-HUAUuGZbfW9IJW-FXkDM0bnL6sVB5KeY4IesTLOf3ASiqBT9Sg3VSP__3QFsMLWpuUJSVUerUIEc-VRVzpbd5usKe9YxQ_G0CgmQb8DR9x75S3dDB8C10k8MOvcMPoYH_S3TSax005YrqLafmogujVZuf3B6bExpjcwnoz1rIo6DLJCL7Ot16Pn2Zb-LE"
                  alt="Venetsiya kolleksiyasi"
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
                      Har bir detal va mexanizm uchun to'liq rasmiy kafolat.
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
                  <span className="editorial-link-text">Biz haqimizda batafsil o'qish</span>
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
              Mukammal To'plamlar
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
              Bir butun xona uchun tayyor uyg'un echimlar: krovat, divan, jurnal stoli va konsollar.
            </p>
          </div>
          <Link
            href={`/${locale}/collections`}
            className="editorial-link"
          >
            <span className="editorial-link-text">Barcha to'plamlar</span>
            <ArrowRight className="editorial-link-arrow" />
          </Link>
        </div>

        {/* 3 Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSets.map((set, idx) => (
            <Link
              key={idx}
              href={`/${locale}/collections/${set.slug}`}
              className="group smooth-card border border-border bg-card overflow-hidden block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={set.image}
                  alt={set.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 ease-editorial group-hover:scale-105"
                />
                <span className="status absolute top-3 left-3 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{set.category}</span>
                </span>
              </div>
              <div className="p-5 sm:p-6 space-y-2.5">
                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 ease-editorial">
                  {set.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {set.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border/80 text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
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
                    <span className="editorial-link-text">Biz haqimizda batafsil o'qish</span>
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
