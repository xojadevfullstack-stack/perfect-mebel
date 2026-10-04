import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { ShieldCheck, Ruler, Sparkles, MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: AboutPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({
  params: { locale },
}: AboutPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="space-y-16 py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Editorial Header Section */}
      <section className="max-w-3xl space-y-4">
        <p className="eyebrow">{t("philosophyBadge")}</p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed pt-2">
          {t("heroDesc")}
        </p>
      </section>

      {/* Panoramic Workshop Photo */}
      <section className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden border border-border bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=1800&auto=format&fit=crop"
          alt="Perfect Mebel"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:bottom-6 sm:left-6 max-w-lg border border-border bg-card p-3 sm:p-5 shadow-md">
          <p className="text-foreground text-xs sm:text-sm font-light tracking-wide italic font-serif">
            {t("quote")}
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
            {t("pillar1Title")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("pillar1Desc")}
          </p>
        </div>

        <div className="border border-border bg-card p-5 sm:p-8 space-y-3 sm:space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            <Ruler className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            {t("pillar2Title")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("pillar2Desc")}
          </p>
        </div>

        <div className="border border-border bg-card p-5 sm:p-8 space-y-3 sm:space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            {t("pillar3Title")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("pillar3Desc")}
          </p>
        </div>
      </section>

      {/* Showroom & Atelier Invitation */}
      <section className="border border-border bg-muted/40 p-5 sm:p-12 grid gap-6 sm:gap-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <p className="eyebrow">{t.has("showroomEyebrow") ? t("showroomEyebrow") : "Showroom"}</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            {t.has("showroomTitle") ? t("showroomTitle") : "Showroom"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
            {t.has("showroomDesc") ? t("showroomDesc") : ""}
          </p>
          <div className="pt-2 space-y-2 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{t.has("showroomAddress") ? t("showroomAddress") : "Toshkent sh., Bunyodkor shox ko'chasi, 42-uy"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{t.has("workingHours") ? t("workingHours") : "10:00 - 20:00"}</span>
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
            {tHome("viewCatalog")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-border-strong bg-card text-foreground hover:bg-foreground hover:text-background text-xs uppercase tracking-wider font-semibold rounded-none transition-colors"
            )}
          >
            {tHome("contactUs")}
          </Link>
        </div>
      </section>
    </div>
  );
}
