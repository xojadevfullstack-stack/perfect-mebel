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
import { ATELIER_PRODUCTS } from "@/lib/catalog-data";

interface CollectionDetailPageProps {
  params: { locale: string; slug: string };
}

// Map ATELIER_PRODUCTS to collection sets
const FALLBACK_COLLECTION_DETAILS = [
  {
    id: "col-nordic-living",
    slug: "nordic-yashash-xonasi",
    titleUz: "Nordic Yashash Xonasi To'plami",
    titleRu: "Гостиный гарнитур Nordic",
    titleEn: "Nordic Living Room Set",
    descUz:
      "Iliq krem rangli boucle divan, yaxlit eman oval jurnal stoli va devorga o'rnatiladigan suzuvchi konsol ansambli. Skandinaviya minimalizmi va sokin hashamat uyg'unligi.",
    descRu:
      "Теплый диван букле, овальный журнальный столик из цельного дуба и парящая консоль.",
    descEn:
      "Warm cream boucle sofa, solid oak oval coffee table and floating wall-mounted media console.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATnyonbIkv8ZAc6afuYQB25mX2C4CMBJi0udEuFwc9BOZo357mX1Teegjh1r1vN2VyR8U9DzS0gWXZXr9g8YDpshD1c0agf5QT1QnECZ1ytSryK7fZJ8Pj8L4_bSFWNK5iTEhxUZ7wOKXIGiGHzgUYq4-OjiRPIZrfouy7DvgiZm-jKl7s26_fFc1h32vRbVtMgLEoGOcXYKAnDV3juGl5RyBIySeKRG9YslIE4p7xETuhfkf-WCYLSArkvMX-tHO8Lm8xwrXqtNQ",
    ],
    products: [
      {
        id: "soprano",
        slug: "soprano-divan",
        titleUz: "Soprano 3 Kishilik Bouclé Divan",
        titleRu: "3-местный диван Soprano Bouclé",
        titleEn: "Soprano 3-Seater Bouclé Sofa",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDOofZYvEkNu4UfgDMaosUy9UmOtP7k2S9Vy5nEbKmnpGY6t5SvuO30ek1x_KM6p02iHrHE2XpCM9zXo8VUsUa6Kr4EWa24WbAYYxVq-O2Sj-syvesBg9ChGDVBf9LKeYS1Aw5N-0k0yAWza-80smu7b0UGE2XNCC1FHe30kE1Lu6zqzMzwaJ14NJWkwF1SMFKbAP59nizBsEDWlm0P6fnwJAHCO8mEYNTYtBpfLBQGLqu5PKCk5OLov2y-18jgkGqcOgFu_jxPv-w",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuATnyonbIkv8ZAc6afuYQB25mX2C4CMBJi0udEuFwc9BOZo357mX1Teegjh1r1vN2VyR8U9DzS0gWXZXr9g8YDpshD1c0agf5QT1QnECZ1ytSryK7fZJ8Pj8L4_bSFWNK5iTEhxUZ7wOKXIGiGHzgUYq4-OjiRPIZrfouy7DvgiZm-jKl7s26_fFc1h32vRbVtMgLEoGOcXYKAnDV3juGl5RyBIySeKRG9YslIE4p7xETuhfkf-WCYLSArkvMX-tHO8Lm8xwrXqtNQ",
        ],
        dimensions: "280 × 160 × 78 sm",
        material: "Tabiiy buk karkas, Italiya Bouclé matosi",
        warranty: "3 yil to'liq kafolat",
        stockStatus: "IN_STOCK" as const,
        categoryName: "Divanlar",
      },
      {
        id: "elegance",
        slug: "elegance-jurnal-stoli",
        titleUz: "Elegance Travertin Jurnal Stoli",
        titleRu: "Журнальный столик Elegance с травертином",
        titleEn: "Elegance Travertine Coffee Table",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDMFtGGQr6vtPjqLv8mQQVUr1xG4OuaWJdfh8DCGRWHwdHFBdoa3eg61eEskNVBZ9sBb07cgkLgAQimgZXAGyWLM40nxla466HCC15401hOUDjeLWTOxlPGWRhcjYuclpOX2jmb6ch38U1gtgVC7j5zngJ2xTuNn8rFvP4RhaFku35M4sdwx3DguXV3p3zTwUVMQD0ocnBRWaT0KyD2iz5hTEnHIZoPbiQNz9cQV52lz7-wh7R7DCnfCgQjC8syKlI01fdW2gHc28I",
          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "120 × 70 × 38 sm",
        material: "Yaxlit eman va tabiiy Italiya travertini",
        warranty: "5 yil kafolat",
        stockStatus: "IN_STOCK" as const,
        categoryName: "Stollar",
      },
      {
        id: "verona",
        slug: "verona-konsol",
        titleUz: "Verona Me'moriy Konsol",
        titleRu: "Архитектурная консоль Verona",
        titleEn: "Verona Architectural Console",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuACgs2cK5dXj2eKmdVTnLdXpSXT94NeVTyO7Qt_adjpo41KmnLNXKZekAlIeThGV8YoCHP-MPn2Fs4bOTTpbAKnjaF0Fx7xdGJNudCNonaxdGSROth4rQrZ0xbZoqrA3UnDVHuY6dZUU_Ow_EZAzCc1X3r-3-J9FR72e4htdg9ROjydDvY5bDiC3Li4-YhVPh8gHm0lVD1WX_FIYnhsU0aUhuVSgJpnFChDa019SrLi-N_oRfNFCZIRn2uizlFvkfIbyIUKWlz83Dk",
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "140 × 40 × 85 sm",
        material: "Travertin toshi va to'q eman yog'ochi",
        warranty: "5 yil kafolat",
        stockStatus: "IN_STOCK" as const,
        categoryName: "Konsollar",
      },
    ],
  },
  {
    id: "col-kyoto-bedroom",
    slug: "kyoto-yotoqxona-toplami",
    titleUz: "Venetsiya Yotoqxona To'plami",
    titleRu: "Спальный гарнитур Венеция",
    titleEn: "Venice Bedroom Set",
    descUz:
      "Suzuvchi platformali yong'oq krovati, tabiiy eman tungi tumba va ochiq javon ansambli. Sokin tungi dam olish uchun yaratilgan arxitekturaviy muhit.",
    descRu:
      "Кровать из массива ореха с низкой платформой, тумба из дуба и стеллаж.",
    descEn:
      "Walnut platform bed, solid oak nightstand, and Danish oil finished open shelving.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcDYSRzNE0rrW_Po8KOGmWeFj0Le5F2yCM-hkdAfBF825NkJLjakp8T9MNNlLdYWBG9ik8jPcdcwkj0-HUAUuGZbfW9IJW-FXkDM0bnL6sVB5KeY4IesTLOf3ASiqBT9Sg3VSP__3QFsMLWpuUJSVUerUIEc-VRVzpbd5usKe9YxQ_G0CgmQb8DR9x75S3dDB8C10k8MOvcMPoYH_S3TSax005YrqLafmogujVZuf3B6bExpjcwnoz1rIo6DLJCL7Ot16Pn2Zb-LE",
    ],
    products: [
      {
        id: "kyoto",
        slug: "kyoto-yotoqxona-krovati",
        titleUz: "Kyoto Platformali Krovat",
        titleRu: "Кровать Kyoto с парящей платформой",
        titleEn: "Kyoto Platform Bed",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD7ZTqapzC3o3cxB8SAD7oOhR5f15J_HsN9n430VY5R1oJS_QI0gCThkJI-erHj4AIJpoAueJIrJUMT2Ac4s4Gjv4Ihs3RsqphSyg8rg2o4A_S-_MEozgMRT1DZRMRezAX0hldS7jhmpgkvSGDdpxRJ51_C1HU2a9qHHBcmir13GuyT_pguQlwckj1Oa9sui6QHubKGLzfZauJ8YWuK6m4Lv7rXYdM-7CB_qJcsHV8-YahFoi2JgIIgP27Oh3NuFvLrZeNRAiKM-o0",
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "200 × 220 × 42 sm (Matras: 180×200)",
        material: "Amerika yong'og'i, tabiiy zig'ir qoplamasi",
        warranty: "5 yil kafolat",
        stockStatus: "MADE_TO_ORDER" as const,
        categoryName: "Yotoqxona",
      },
      {
        id: "aura",
        slug: "aura-tumba",
        titleUz: "Aura Eman Tumba",
        titleRu: "Прикроватная тумба Aura",
        titleEn: "Aura Solid Oak Nightstand",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD80viJJMS9eNVA29O-MjcPGcPNf2mpSvNXgmi_7QxgdP8zE2PvaYtcuywm7UKX40txexp08ITgCRQ4CefEEJ6wYlBfo0JhLBJ31id3QhcJKI80dC96oio3oRgOdPFvf6Jxa2y-osqBEQZs1Ivrhbxw4y3SFZ03knrO5Rc6LCZw1jzubySme2yTmCnDLKeDNECMvbhQjAtG0ZMhdIhdQ4FDI_dbK6PNFyD0Hf6ppe_JnYzBsFjbyQvTkWf4Jdo35dRUGchgNWQoL1I",
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "68 × 42 × 60 sm",
        material: "Eman daraxti, bronza tutqichlar",
        warranty: "5 yil kafolat",
        stockStatus: "MADE_TO_ORDER" as const,
        categoryName: "Tumba & Komod",
      },
      {
        id: "nordic",
        slug: "nordic-kitob-javoni",
        titleUz: "Nordic Kitob Javoni",
        titleRu: "Стеллаж Nordic",
        titleEn: "Nordic Open Bookcase",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAwheKyKByXlbB46-k5MvdGHUzn_RNM2K94ph9eyHdrUSkJ35zPaEoNOung75UY6HdDV92r-q16rgvEnnhJ8iO-pNQLkjzsllSyna7QTaULDiRlIOGsyYctPKYQe4Paj6jxZz_2GxWkqFqIsTs_0XhyzGt6NIYsQbPP6ZQY2YwHLLjkUbGGFQ8o8AyYXoMfMLuyeFBbR-HFY3R5tbud4z9hogRrJRPX5J1Fy5jILjP-FfLW_mNfK7B-q9xOR5y7452tXgFuaDd10UQ",
          "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "240 × 36 × 240 sm",
        material: "Yaxlit tabiiy eman massivi",
        warranty: "5 yil kafolat",
        stockStatus: "MADE_TO_ORDER" as const,
        categoryName: "Javonlar",
      },
    ],
  },
  {
    id: "col-milano-dining",
    slug: "milano-ovqatlanish-toplami",
    titleUz: "Milano Ovqatlanish To'plami",
    titleRu: "Обеденный гарнитур Milano",
    titleEn: "Milano Dining Room Set",
    descUz:
      "Qora yong'oqdan ishlangan keng stol, tabiiy terili Tivoli bar stuli va Zen qulay kreslo ansambli.",
    descRu:
      "Большой стол из массива ореха, барные стулья Tivoli и кресло Zen.",
    descEn:
      "Solid walnut workspace/dining table, leather Tivoli stools and tactile Zen armchair.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvG1FELOfv6qU5qk8w7fjYgJfcJwAhtUElBQAm_ozXUCpFbD2Cz2ycaQgDJ8UWZAWR0TJwlArzpb88hNMbeYV9n9u0UNCizVwjWig111eCS59BJT8g-nWi7ulFh_Yxt3moil7qm6pwM0yo5wo3cRDedRvF3nXpwO5rtKiYvTQaijW4122HU4558GtTQrijheGi3wF8OKcmOBNx4JXzXKR0Ygh4XDsE_O5bq3D6dEQzHmDVSURaakNrojs90170bmKflp1gDoaSnks",
    ],
    products: [
      {
        id: "atelier-desk",
        slug: "atelier-ish-stoli",
        titleUz: "Atelier Katta Yong'oq Stoli",
        titleRu: "Стол Atelier из массива ореха",
        titleEn: "Atelier Executive Walnut Table",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAbeZnQReuZQCp1ec_QXm0xCXCF82jU0GzTOKZCscOdC3kI4mjq2cdC4tOq5a3I9adnBoIVwsc9XOO7buf6KXoHtueyiyFxqXJemtCDAXmKc7UwJZDGSwdAH_Hb8qGOAMM3B571shjvyj6wEH2CAEesmgt120PjgYUWciYAINqhbDkW7_s3EComKsDguGvsHYF6OZzzfpblDrvXXiieFVTAl1OC_UV6ogAlFM4JNqkVeDt4mPcytvhQDgIRKaj4y07u4rWKlpuCE8k",
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "180 × 80 × 76 sm",
        material: "Tabiiy qora yong'oq massivi, travertin detal",
        warranty: "5 yil kafolat",
        stockStatus: "MADE_TO_ORDER" as const,
        categoryName: "Stollar",
      },
      {
        id: "tivoli",
        slug: "tivoli-bar-stuli",
        titleUz: "Tivoli Tabiiy Teri Stuli",
        titleRu: "Стул Tivoli из натуральной кожи",
        titleEn: "Tivoli Leather Bar Stool",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDG5ms-kq1fJasZ0lWuPSUNkcRIFr-NC6tJyRf9BB5CZyZxCejbo-biKlkRKXvO6Hx5rwHAsQCjWOyCaUBV3_WnnZ1TXfLHOK8bDZvuKf7tCX2beMTUf198rKbzslfPPGVLIHntGk779vLSKamGZM9QDFp8LznBV4heziZGe8hSyjoCI1cf_0ROhGuR9SZqfDV9r_jzfxfv8nkNGxhKTEVcG7oaF6cbUeK5iSV-Cr5k5HSe-k1hZwlWWnAncw5kDygZoUwCz5PfKF8",
          "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "48 × 52 × 92 sm",
        material: "Tabiiy teri, eman karkas, bronza",
        warranty: "3 yil kafolat",
        stockStatus: "IN_STOCK" as const,
        categoryName: "Stullar",
      },
      {
        id: "zen",
        slug: "zen-kreslo",
        titleUz: "Zen Qulay Kreslo",
        titleRu: "Кресло Zen из натурального льна",
        titleEn: "Zen Linen Armchair",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDUsA1mIZqmJE4fL8KmvglBnNAyCfIZX8ZEynm0_c6nCZw6Q1oI9DzdzLwzHrE_QqfQbb7IilOqdutUplShhaTRgqmL1ORzdpHgzarhjzwXewMnXXPW9-kk1n6RneQRRu3D5xvjRtrKJmcgpD_-DOjMeRT0l0yf5mxQ6Mm1KstyqGIBsOugGFTuHgjRJIFS87SUFdYLY08JtuCgj_Y-722-uoT-xVJGNrEWuqHsOVFrBr2AkKNRHXt8Qy528A1Cwm-Fyw9a1mxoiww",
          "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
        ],
        dimensions: "82 × 90 × 76 sm",
        material: "Tabiiy zig'ir, massiv eman karkas",
        warranty: "3 yil kafolat",
        stockStatus: "IN_STOCK" as const,
        categoryName: "Kreslolar",
      },
    ],
  },
];

export async function generateMetadata({
  params: { locale, slug },
}: CollectionDetailPageProps): Promise<Metadata> {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { titleUz: true, titleRu: true, titleEn: true, descUz: true, descRu: true, descEn: true },
  });

  const fallback = FALLBACK_COLLECTION_DETAILS.find((c) => c.slug === slug);
  const data = collection || fallback;

  if (!data) {
    return { title: "Komplekt topilmadi — Perfect Mebel" };
  }

  const title =
    locale === "ru" && data.titleRu
      ? data.titleRu
      : locale === "en" && data.titleEn
      ? data.titleEn
      : data.titleUz;

  const desc =
    locale === "ru" && data.descRu
      ? data.descRu
      : locale === "en" && data.descEn
      ? data.descEn
      : data.descUz;

  return {
    title: `${title} — Mukammal To'plam | Perfect Mebel`,
    description: desc || "Zamonaviy mebellar to'plami va interaktiv checklist",
  };
}

export default async function CollectionDetailPage({
  params: { locale, slug },
}: CollectionDetailPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "navigation" });

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

  const fallbackCollection = FALLBACK_COLLECTION_DETAILS.find((c) => c.slug === slug);

  if (!dbCollection && !fallbackCollection) {
    notFound();
  }

  let finalCollection;

  if (dbCollection) {
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

    finalCollection = {
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
  } else if (fallbackCollection) {
    finalCollection = fallbackCollection;
  } else {
    notFound();
  }

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
            <span className="hidden sm:inline">Perfect Mebel To'plamlari</span>
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
