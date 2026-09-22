"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Phone, MapPin, Clock, Send } from "lucide-react";

export function Footer(): React.JSX.Element {
  const locale = useLocale();
  const tNav = useTranslations("navigation");
  const tFoot = useTranslations("footer");
  const tContact = useTranslations("contact");
  const tCommon = useTranslations("common");

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Mebel Salon
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {tFoot("about")}
            </p>
            <div className="pt-1">
              <a
                href="https://t.me/mebel_salon_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{tContact("telegramChannel")}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              {tFoot("quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog`} className="hover:text-primary transition-colors">
                  {tNav("catalog")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/collections`} className="hover:text-primary transition-colors">
                  {tNav("collections")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-primary transition-colors">
                  {tNav("contacts")}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors text-muted-foreground/70">
                  {tNav("admin")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Factory */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              {tContact("showroomTitle")}
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{tContact("showroomAddress")}</span>
              </p>
              <p className="flex items-start space-x-2 pt-2 border-t border-border/50">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-foreground font-medium">{tContact("factoryTitle")}:</strong>
                  {tContact("factoryAddress")}
                </span>
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              {tContact("phonesTitle")}
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+998901234567" className="hover:text-primary transition-colors font-medium text-foreground">
                  +998 (90) 123-45-67
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+998712000000" className="hover:text-primary transition-colors font-medium text-foreground">
                  +998 (71) 200-00-00
                </a>
              </p>
              <p className="flex items-start space-x-2 pt-2 text-[11px]">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{tContact("workingHoursDesc")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Mebel Salon. {tFoot("allRightsReserved")}</p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            {tCommon("siteDescription")}
          </p>
        </div>
      </div>
    </footer>
  );
}
