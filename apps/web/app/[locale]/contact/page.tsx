import * as React from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Phone, MapPin, Clock, Send, ShieldCheck, Factory } from "lucide-react";

interface ContactPageProps {
  params: { locale: string };
}

export default async function ContactPage({
  params: { locale },
}: ContactPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  const tContact = await getTranslations("contact");

  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 sm:py-20 space-y-12">
      {/* Sarlavha */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold text-primary shadow-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>Mebel Salon</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {tContact("title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {tContact("subtitle")}
        </p>
      </div>

      {/* Asosiy Aloqa Kartalari Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Telefon raqamlari */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {tContact("phonesTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tContact("phonesDesc")}
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:+998901234567"
                className="block text-base font-bold text-primary hover:underline"
              >
                +998 (90) 123-45-67
              </a>
              <a
                href="tel:+998712000000"
                className="block text-base font-bold text-primary hover:underline"
              >
                +998 (71) 200-00-00
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>09:00 – 20:00 (Har kuni)</span>
          </div>
        </div>

        {/* 2. Showroom & Do'kon */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {tContact("showroomTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Do&apos;konimizga kelib, mebellarning sifati, matosi va dizayni bilan bevosita tanishishingiz mumkin.
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed pt-2">
              {tContact("showroomAddress")}
            </p>
          </div>

          <div className="mt-6 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <span>Mo&apos;ljal: Chilonzor metro bekati yaqinida</span>
          </div>
        </div>

        {/* 3. Ishlab chiqarish zavodi */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Factory className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {tContact("factoryTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zamonaviy texnologiyalar asosida to&apos;liq tsiklda sifatli mebellar tayyorlanadigan asosiy fabrika.
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed pt-2">
              {tContact("factoryAddress")}
            </p>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>{tContact("workingHoursDesc")}</span>
          </div>
        </div>
      </div>

      {/* Telegram Onlayn Xizmatlar Bloki */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-sky-500/10 via-card to-card p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center space-x-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-600 dark:text-sky-400">
              <Send className="h-3.5 w-3.5" />
              <span>Telegram 24/7</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {tContact("telegramBotTitle")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tContact("telegramBotDesc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://t.me/mebel_salon_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" />
              <span>{tContact("openBot")}</span>
            </a>
            <a
              href="https://t.me/mebel_salon_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-colors"
            >
              <span>{tContact("viewChannel")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
