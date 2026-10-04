import * as React from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Phone, MapPin, Clock, Send, ShieldCheck, Factory, Award } from "lucide-react";

interface ContactPageProps {
  params: { locale: string };
}

export default async function ContactPage({
  params: { locale },
}: ContactPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  const tContact = await getTranslations("contact");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
      {/* Sarlavha (Editorial) */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
          Atelier &amp; Showroom
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          {tContact("title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
          {tContact("subtitle")}
        </p>
      </div>

      {/* Asosiy Aloqa Kartalari Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Telefon raqamlari */}
        <div className="flex flex-col justify-between rounded-none border border-border bg-card p-5 sm:p-8 shadow-whisper hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-none bg-primary/10 text-primary border border-primary/20">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              {tContact("phonesTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tContact("phonesDesc")}
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:+998712000000"
                className="block text-base font-bold text-foreground hover:text-primary transition-colors"
              >
                +998 (71) 200-00-00
              </a>
              <a
                href="tel:+998901234567"
                className="block text-base font-bold text-foreground hover:text-primary transition-colors"
              >
                +998 (90) 123-45-67
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>09:00 – 20:00 (Har kuni, dam olishsiz)</span>
          </div>
        </div>

        {/* 2. Showroom & Do'kon */}
        <div className="flex flex-col justify-between rounded-none border border-border bg-card p-5 sm:p-8 shadow-whisper hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-none bg-primary/10 text-primary border border-primary/20">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              {tContact("showroomTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Showroomimizga tashrif buyurib, tabiiy materiallar va mebellar sifati bilan bevosita tanishishingiz mumkin.
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed pt-2">
              Toshkent sh., Bunyodkor shox ko'chasi, 42-uy
            </p>
          </div>

          <div className="mt-6 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <span>Mo'ljal: 'Novza' metrosi yaqinida, 'Perfect' binosi</span>
          </div>
        </div>

        {/* 3. Ishlab chiqarish fabrikasi */}
        <div className="flex flex-col justify-between rounded-none border border-border bg-card p-5 sm:p-8 shadow-whisper hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-none bg-primary/10 text-primary border border-primary/20">
              <Factory className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              {tContact("factoryTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zamonaviy texnologiyalar va tabiiy duradgorlik an'analari asosida to'liq tsiklli mebellar fabrikasi.
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed pt-2">
              Toshkent sh., Sergeli sanoat zonasi, 12-bino
            </p>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <Award className="h-4 w-4 text-primary shrink-0" />
            <span>10 yillik rasmiy kafolat bilan</span>
          </div>
        </div>
      </div>

      {/* Telegram Onlayn Xizmatlar Bloki */}
      <div className="rounded-none border border-border bg-card p-5 sm:p-12 shadow-whisper">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center space-x-2 border border-border bg-background px-3 py-1 text-xs font-bold text-primary">
              <Send className="h-3.5 w-3.5" />
              <span>Telegram 24/7 Aloqa</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Telegram Bot &amp; Jonli Maslahatchi
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Savollaringiz bormi? Telegram botimiz orqali mebellarni ko'rishingiz, rasmlar bo'yicha maslahat olishingiz yoki operatorimiz bilan jonli muloqot qilishingiz mumkin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://t.me/perfectmebel_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-none bg-primary hover:bg-primary-hover px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-none transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Telegram Botga o'tish</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
