import * as React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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
  const messages = await getMessages({ locale: "uz" });

  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale="uz" messages={messages}>
            {children}
            <Toaster position="top-right" richColors />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
