"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Armchair,
  Boxes,
  FileText,
  ArrowRight,
  Plus,
  CheckCircle2,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  username: string;
}

interface CategoryItem {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  order: number;
  _count?: {
    products: number;
  };
}

interface DashboardData {
  stats: {
    categories: number;
    products: number;
    collections: number;
    leads: number;
  };
  categories: CategoryItem[];
}

export default function AdminDashboardPage(): React.JSX.Element {
  const tNav = useTranslations("admin.nav");
  const tCat = useTranslations("admin.categories");
  const tProd = useTranslations("admin.products");
  const tCommon = useTranslations("admin.common");
  const tDash = useTranslations("admin.dashboard");

  const [currentUser, setCurrentUser] = React.useState<AdminUser | null>(null);
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchDashboard = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [userRes, statsRes] = await Promise.all([
        fetch("/api/admin/auth/me"),
        fetch("/api/admin/stats"),
      ]);

      const userJson = await userRes.json();
      if (userJson.success && userJson.data) {
        setCurrentUser(userJson.data);
      }

      const statsJson = await statsRes.json();
      if (statsJson.success && statsJson.data) {
        setDashboardData(statsJson.data);
      }
    } catch {
      // fetch error
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminName={currentUser?.name} />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Status banner */}
          <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {tDash("dbConnected")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tDash("realtimeSync")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/admin/categories">
                <Button size="sm" variant="outline">
                  <Layers className="mr-1.5 h-4 w-4" />
                  <span>{tNav("categories")}</span>
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button size="sm">
                  <Armchair className="mr-1.5 h-4 w-4" />
                  <span>{tNav("products")}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/categories"
              className="group block rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  {tNav("categories")}
                </p>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {isLoading ? "—" : dashboardData?.stats.categories ?? 0}
              </p>
              <div className="mt-2 flex items-center text-xs font-medium text-primary">
                <span>{tCat("title")}</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="group block rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  {tNav("products")}
                </p>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Armchair className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {isLoading ? "—" : dashboardData?.stats.products ?? 0}
              </p>
              <div className="mt-2 flex items-center text-xs font-medium text-primary">
                <span>{tProd("title")}</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/admin/collections"
              className="group block rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  {tDash("collections")}
                </p>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Boxes className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {isLoading ? "—" : dashboardData?.stats.collections ?? 0}
              </p>
              <div className="mt-2 flex items-center text-xs font-medium text-primary">
                <span>{tDash("collections")}</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/admin/leads"
              className="group block rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  {tNav("leads")}
                </p>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {isLoading ? "—" : dashboardData?.stats.leads ?? 0}
              </p>
              <div className="mt-2 flex items-center text-xs font-medium text-primary">
                <span>{tNav("leads")}</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Oxirgi Kategoriyalar */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {tCat("tableTitle")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tCat("subtitle")}
                </p>
              </div>

              <Link href="/admin/categories">
                <Button size="sm" variant="outline">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  <span>{tCat("addNew")}</span>
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 text-center">{tCat("order")}</th>
                    <th className="px-5 py-3">{tCat("nameUz")}</th>
                    <th className="px-5 py-3">{tCat("nameRu")}</th>
                    <th className="px-5 py-3">{tCat("nameEn")}</th>
                    <th className="px-5 py-3">{tCat("slug")}</th>
                    <th className="px-5 py-3 text-center">{tCat("productsCount")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {dashboardData?.categories && dashboardData.categories.length > 0 ? (
                    dashboardData.categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 text-center font-mono text-xs text-muted-foreground">
                          {cat.order}
                        </td>
                        <td className="px-5 py-3 font-medium">{cat.nameUz}</td>
                        <td className="px-5 py-3 text-muted-foreground">{cat.nameRu}</td>
                        <td className="px-5 py-3 text-muted-foreground">{cat.nameEn}</td>
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                          {cat.slug}
                        </td>
                        <td className="px-5 py-3 text-center font-medium">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {cat._count?.products ?? 0} {tCommon("unitItem")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">
                        {isLoading ? tCommon("loading") : tCat("empty")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
