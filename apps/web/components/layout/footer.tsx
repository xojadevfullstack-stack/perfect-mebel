"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Phone, MapPin, Clock, Send, Award } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { getBotUsername } from "@/lib/telegram/deep-link";

export function Footer(): React.JSX.Element {
  const locale = useLocale();
  const tNav = useTranslations("navigation");

  return (
    <footer className="w-full border-t border-footer-border bg-footer text-footer-foreground transition-colors duration-200">
      <div className="container mx-auto px-5 py-16 sm:px-8 max-w-site">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Philosophy Column (4 cols) */}
          <div className="space-y-4 md:col-span-4">
            <Link
              href={`/${locale}`}
              className="inline-flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Perfect Mebel"
            >
              <BrandLogo size="lg" subtitle="Atelier & Curation" inverted />
            </Link>
            <p className="text-xs font-light leading-relaxed text-footer-muted max-w-sm">
              Sokin hashamat va me'moriy muvozanatga asoslangan O'zbekiston mualliflik mebel atelyesi. Tabiiy materiallar va qo'lda ishlangan nafislik.
            </p>
            <div className="flex items-center space-x-2 text-xs pt-1">
              <Award className="h-4 w-4 text-footer-accent" />
              <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-footer-accent">
                Atelier ko'rgazmasi 2026
              </span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-footer-foreground">
              Bo'limlar
            </h4>
            <ul className="space-y-2 text-xs text-footer-muted">
              <li>
                <Link href={`/${locale}`} className="hover:text-footer-foreground transition-colors">
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog`} className="hover:text-footer-foreground transition-colors">
                  {tNav("catalog")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/collections`} className="hover:text-footer-foreground transition-colors">
                  {tNav("collections")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-footer-foreground transition-colors">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-footer-foreground transition-colors">
                  {tNav("contacts")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom (3 cols) */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-footer-foreground">
              Showroom &amp; Vitrina
            </h4>
            <div className="space-y-2 text-xs text-footer-muted">
              <p className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-footer-accent shrink-0 mt-0.5" />
                <span>Toshkent sh., Bunyodkor shox ko'chasi, 42-uy ("Novza" metrosi yaqinida)</span>
              </p>
              <p className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-footer-accent shrink-0 mt-0.5" />
                <span>Dushanba–Shanba: 10:00–20:00</span>
              </p>
            </div>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-footer-foreground">
              Aloqa &amp; Telegram
            </h4>
            <div className="space-y-2 text-xs text-footer-muted">
              <p className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-footer-accent shrink-0" />
                <a href="tel:+998712008800" className="hover:text-footer-foreground font-medium text-footer-foreground transition-colors">
                  +998 (71) 200-88-00
                </a>
              </p>
              <p className="flex items-center space-x-2 pt-1">
                <Send className="h-4 w-4 text-footer-accent shrink-0" />
                <a
                  href={`https://t.me/${getBotUsername()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-footer-accent font-semibold transition-colors"
                >
                  @{getBotUsername()}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-footer-border pt-6 text-[10px] text-footer-muted uppercase tracking-wider sm:flex-row">
          <p>© {new Date().getFullYear()} PERFECT MEBEL. Barcha huquqlar himoyalangan.</p>
          <div className="mt-3 flex items-center space-x-6 sm:mt-0">
            <Link href="/admin/login" className="hover:text-footer-foreground transition-colors">
              {tNav("admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
