"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Bookmark, Search, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectionsStore } from "@/lib/store/selections-store";

interface HeaderProps {
  onOpenSelections?: () => void;
  onOpenInquiry?: () => void;
}

export function Header({ onOpenSelections, onOpenInquiry }: HeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const tNav = useTranslations("navigation");

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const selectedCount = useSelectionsStore((state) => state.items.length);

  const navLinks = [
    { href: `/${locale}`, label: tNav("home"), exact: true },
    { href: `/${locale}/catalog`, label: tNav("catalog") },
    { href: `/${locale}/collections`, label: tNav("collections") },
    { href: `/${locale}/about`, label: tNav("about") },
    { href: `/${locale}/contact`, label: tNav("contacts") },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background transition-colors duration-200">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Brand Logo Anchor with proper minimum breathing space */}
        <Link
          href={`/${locale}`}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-none shrink-0 mr-2 sm:mr-4 lg:mr-6 xl:mr-10"
          aria-label="Perfect Mebel"
        >
          <BrandLogo size="md" subtitle="Atelier Vitrinasi" />
        </Link>

        {/* Desktop Navigation Links: Visible on xl and above (>=1280px) for spacious elegance */}
        <nav className="hidden xl:flex items-center gap-7 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-[0.14em] transition-all duration-300 ease-editorial py-1 border-b-2 whitespace-nowrap ${
                isActive(link.href, link.exact)
                  ? "text-foreground font-bold border-primary"
                  : "text-muted-foreground font-medium border-transparent hover:text-foreground hover:border-border-strong hover:-translate-y-0.5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Trailing Controls Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto xl:ml-0">
          {/* Subtle Search Button (Redirects to catalog) */}
          <Link
            href={`/${locale}/catalog`}
            aria-label="Qidiruv"
            className="hidden sm:flex items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-all duration-200 ease-editorial hover:scale-110 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Mening tanlovlarim */}
          <button
            type="button"
            onClick={onOpenSelections}
            title={tNav("mySelections")}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 border border-border bg-card hover:border-foreground text-foreground transition-all duration-300 ease-editorial text-xs font-medium rounded-none hover:shadow-whisper active:scale-[0.98]"
          >
            <Bookmark className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-semibold">
              {tNav("mySelections")}
            </span>
            <span className="text-xs font-bold text-primary">
              ({selectedCount})
            </span>
          </button>

          {/* Language Selector Dropdown (Visible on >= sm) */}
          <div className="hidden sm:block">
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-8 w-[64px] px-2 text-xs font-semibold uppercase tracking-wider border-border bg-card transition-all duration-200 ease-editorial hover:border-foreground/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="min-w-[5rem] bg-card border-border animate-in fade-in-0 zoom-in-95 duration-200">
                <SelectItem value="uz" className="text-xs font-semibold cursor-pointer">
                  UZ
                </SelectItem>
                <SelectItem value="ru" className="text-xs font-semibold cursor-pointer">
                  RU
                </SelectItem>
                <SelectItem value="en" className="text-xs font-semibold cursor-pointer">
                  EN
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dark / Light Mode Toggle (Visible on >= sm) */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Primary CTA Button: Maslahat olish */}
          <Button
            size="sm"
            onClick={onOpenInquiry}
            className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2 transition-all duration-300 ease-editorial shadow-none rounded-none hover:brightness-105 active:scale-[0.98]"
          >
            <span>{tNav("consultation")}</span>
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>

          {/* Mobile menu hamburger toggle: visible on < xl */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 xl:hidden text-foreground hover:bg-muted transition-transform active:scale-90"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer - 100% Solid matching the header */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-5 py-6 xl:hidden animate-in fade-in-0 slide-in-from-top-3 duration-300 ease-editorial">
          <nav className="flex flex-col space-y-3.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-wider transition-colors py-2 border-b border-border/60 ${
                  isActive(link.href, link.exact)
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Controls Row: Language Switch + Theme Toggle */}
            <div className="pt-2 flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center border border-border bg-card">
                {(["uz", "ru", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleLanguageChange(l)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      locale === l
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Rejim:</span>
                <ThemeToggle />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {tNav("mySelections")}: <strong className="text-foreground">({selectedCount})</strong>
              </span>
              <Button
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry?.();
                }}
                className="bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-none"
              >
                {tNav("consultation")}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
