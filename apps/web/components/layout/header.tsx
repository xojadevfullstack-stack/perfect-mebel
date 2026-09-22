"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Menu, X, Globe, ClipboardList } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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
}

export function Header({ onOpenSelections }: HeaderProps): React.JSX.Element {
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
    { href: `/${locale}/contact`, label: tNav("contacts") },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace locale prefix in current pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Mebel Salon
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href, link.exact)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Selections button in header */}
          {selectedCount > 0 && onOpenSelections && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSelections}
              className="flex items-center space-x-1.5 border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">{tNav("mySelections")}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {selectedCount}
              </span>
            </Button>
          )}

          {/* Language Switcher */}
          <Select value={locale} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-[82px] text-xs font-semibold">
              <Globe className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="uz">UZ</SelectItem>
              <SelectItem value="ru">RU</SelectItem>
              <SelectItem value="en">EN</SelectItem>
            </SelectContent>
          </Select>

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card px-4 py-4 md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href, link.exact)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
