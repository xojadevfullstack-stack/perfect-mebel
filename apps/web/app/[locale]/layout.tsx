import * as React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicShell } from "@/components/layout/public-shell";
import { locales } from "@/i18n/request";
import "@/lib/env";
import "../globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perfect Mebel — Mukammal Makon Yarating | Eksklyuziv Mebel Vitrinasi",
  description: "Xonadoningiz uchun saralangan zamonaviy mebellar to'plami. Tinchlik, sokinlik va me'moriy estetika mujassamlashgan vitrina.",
};

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-primary/20 selection:text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <PublicShell>{children}</PublicShell>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
