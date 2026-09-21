"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Shield,
  LayoutDashboard,
  Layers,
  Armchair,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  adminName?: string;
}

export function AdminHeader({ adminName }: AdminHeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("admin.nav");

  const navItems = [
    {
      href: "/admin",
      label: t("dashboard"),
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/categories",
      label: t("categories"),
      icon: Layers,
      active: pathname.startsWith("/admin/categories"),
    },
    {
      href: "/admin/products",
      label: t("products"),
      icon: Armchair,
      active: pathname.startsWith("/admin/products"),
    },
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center space-x-6">
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            {adminName && (
              <p className="text-xs text-muted-foreground">
                {t("adminUser")}: <span className="font-medium text-foreground">{adminName}</span>
              </p>
            )}
          </div>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center space-x-2 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link
          href="/uz"
          target="_blank"
          className="hidden md:inline-flex items-center space-x-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <span>{t("viewShowcase")}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <ThemeToggle />

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center space-x-1.5 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </div>
    </header>
  );
}
