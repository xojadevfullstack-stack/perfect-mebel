import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { ShieldCheck, Ruler, Sparkles, MapPin, Phone, Clock, ArrowRight, Award } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: AboutPageProps): Promise<Metadata> {
  const titles: Record<string, string> = {
    uz: "Biz haqimizda — Perfect Mebel Atelyesi",
    ru: "О нас — Ателье Perfect Mebel",
    en: "About Us — Perfect Mebel Atelier",
  };
  return {
    title: titles[locale] || titles.uz,
    description:
      "Toshkentda tabiiy materiallardan yaratilgan mualliflik mebellari atelyesi.",
  };
}

export default async function AboutPage({
  params: { locale },
}: AboutPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  return (
    <div className="space-y-16 py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Editorial Header Section */}
      <section className="max-w-3xl space-y-4">
        <p className="eyebrow">Atelier Falsafasi &bull; Toshkent, 2026</p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Biz mebel emas, yillar davomida qadrini yo'qotmaydigan san'at asarlarini yaratamiz.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed pt-2">
          Perfect Mebel — sokin hashamat (Quiet Luxury) va me'moriy muvozanatga asoslangan O'zbekiston mualliflik mebel atelyesi. Toshkentdagi ustaxonamizda 15 yildan ortiq vaqt mobaynida an'anaviy duradgorlik san'atini zamonaviy arxitektura bilan uyg'unlashtirib kelmoqdamiz.
        </p>
      </section>

      {/* Panoramic Workshop Photo */}
      <section className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden border border-border bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=1800&auto=format&fit=crop"
          alt="Perfect Mebel duradgorlik ustaxonasi"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:bottom-6 sm:left-6 max-w-lg border border-border bg-card p-3 sm:p-5 shadow-md">
          <p className="text-foreground text-xs sm:text-sm font-light tracking-wide italic font-serif">
            "Mukammallik ortiqcha bezakda emas, balki tabiiy tolalarning samimiy tilida namoyon bo'ladi."
          </p>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-6">
        <div className="border border-border bg-card p-5 sm:p-8 space-y-3 sm:space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            Tabiiy va Oliy Xomashyolar
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Biz faqat ekologik toza materiallar bilan ishlaymiz: yaxlit eman, qora Amerika yong'og'i, Italiya tabiiy travertin toshi va antibakterial to'qilgan Bouclé matolari.
          </p>
        </div>

        <div className="border border-border bg-card p-5 sm:p-8 space-y-3 sm:space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            <Ruler className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            Individual Arxitektura
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Standart o'lchamlar bilan chegaralanmaymiz. Har bir mebel xonadoningizning aniq chizmasi, yorug'lik tushishi va interyer proporsiyalariga moslashtirib tayyorlanadi.
          </p>
        </div>

        <div className="border border-border bg-card p-5 sm:p-8 space-y-3 sm:space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            24 Oylik Rasmiy Kafolat
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Har bir birikma, qattiq karkas va furnitura sifatiga to'liq javobgarlik beramiz. Barcha mexanizmlar avstriya BLUM va germaniya sifat standartlariga muvofiq.
          </p>
        </div>
      </section>

      {/* Showroom & Atelier Invitation */}
      <section className="border border-border bg-muted/40 p-5 sm:p-12 grid gap-6 sm:gap-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <p className="eyebrow">Toshkent Ko'rgazma Zali</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Showroomimizga tashrif buyuring
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
            Materiallar namunalarini qo'l bilan ushlab ko'ring, yog'och teksturasini his qiling va mutaxassisimiz bilan birga orzuingizdagi mebel loyihasini yarating.
          </p>
          <div className="pt-2 space-y-2 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Toshkent sh., Bunyodkor shox ko'chasi, 42-uy ("Novza" metrosi yaqinida)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Dushanba &ndash; Shanba: 10:00 &ndash; 20:00</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>+998 (71) 200-88-00</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}/catalog`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary hover:bg-primary-hover text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none shadow-none"
            )}
          >
            Katalogni ko'rish
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-border-strong bg-card text-foreground hover:bg-foreground hover:text-background text-xs uppercase tracking-wider font-semibold rounded-none transition-colors"
            )}
          >
            Bog'lanish
          </Link>
        </div>
      </section>
    </div>
  );
}
