import * as React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/env";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Panel — Mebel Salon",
  description: "Mebel Salon boshqaruv paneli",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const cookieStore = cookies();
  const rawLocale =
    cookieStore.get("admin_locale")?.value ||
    cookieStore.get("NEXT_LOCALE")?.value ||
    "uz";
  const locale = ["uz", "ru", "en"].includes(rawLocale) ? rawLocale : "uz";
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster position="top-right" richColors />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
