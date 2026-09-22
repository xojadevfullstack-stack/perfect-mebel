"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard, type ProductCardData } from "@/components/catalog/product-card";
import { LeadModal } from "@/components/lead/lead-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw, PackageSearch, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface CategoryData {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
}

interface CatalogViewProps {
  initialCategories: CategoryData[];
}

export function CatalogView({ initialCategories }: CatalogViewProps): React.JSX.Element {
  const tCat = useTranslations("catalog");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL parametrlaridan o'qish
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchQuery, setSearchQuery] = React.useState(searchParam);
  const [products, setProducts] = React.useState<ProductCardData[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  // Narxini bilish uchun modal
  const [leadProduct, setLeadProduct] = React.useState<ProductCardData | null>(null);

  const limit = 12;

  // URL yangilash yordamchisi
  const updateUrlParams = React.useCallback(
    (newParams: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Qidiruv debounce (350ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== searchParam) {
        updateUrlParams({ search: searchQuery.trim(), page: "1" });
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery, searchParam, updateUrlParams]);

  // Mahsulotlarni yuklash
  React.useEffect(() => {
    let isCancelled = false;

    async function loadProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageParam.toString(),
          limit: limit.toString(),
        });

        if (categoryParam && categoryParam !== "all") {
          // find category by slug
          const cat = initialCategories.find((c) => c.slug === categoryParam);
          if (cat) {
            params.set("categoryId", cat.id);
          }
        }

        if (searchParam) {
          params.set("search", searchParam);
        }

        if (statusParam && statusParam !== "all") {
          params.set("stockStatus", statusParam);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();

        if (!isCancelled && json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          if (json.meta) {
            setTotalCount(json.meta.total);
            setTotalPages(Math.max(1, Math.ceil(json.meta.total / limit)));
          }
        }
      } catch {
        // error handling
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [categoryParam, searchParam, statusParam, pageParam, initialCategories, limit]);

  const handleResetFilters = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-8">
      {/* Sarlavha */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {tCat("title")}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {tCat("subtitle")}
        </p>
      </div>

      {/* Gorizontal Kategoriya Tablari (Pills) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => updateUrlParams({ category: "all", page: "1" })}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            categoryParam === "all"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {tCat("allCategories")}
        </button>

        {initialCategories.map((cat) => {
          const catName =
            locale === "ru" && cat.nameRu
              ? cat.nameRu
              : locale === "en" && cat.nameEn
              ? cat.nameEn
              : cat.nameUz;

          const isSelected = categoryParam === cat.slug;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateUrlParams({ category: cat.slug, page: "1" })}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Qidiruv va Filterlar Paneli */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        {/* Qidiruv input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tCat("searchPlaceholder")}
            className="pl-9 h-10 text-xs sm:text-sm"
          />
        </div>

        {/* Holati bo'yicha filter */}
        <div className="flex items-center space-x-3">
          <Select
            value={statusParam}
            onValueChange={(val) => updateUrlParams({ status: val, page: "1" })}
          >
            <SelectTrigger className="w-[170px] h-10 text-xs font-medium">
              <SelectValue placeholder={tCat("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCat("allStatuses")}</SelectItem>
              <SelectItem value="IN_STOCK">{tCat("inStock")}</SelectItem>
              <SelectItem value="MADE_TO_ORDER">{tCat("madeToOrder")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset button */}
          {(categoryParam !== "all" || searchParam !== "" || statusParam !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-10 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>{tCat("resetFilters")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mahsulotlar to'ri (Grid) */}
      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              {totalCount} {tCat("itemsFound")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAskPrice={(prod) => setLeadProduct(prod)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateUrlParams({ page: Math.max(1, pageParam - 1).toString() })
                }
                disabled={pageParam <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Oldingi</span>
              </Button>

              <span className="text-xs font-medium text-foreground px-3">
                {pageParam} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateUrlParams({
                    page: Math.min(totalPages, pageParam + 1).toString(),
                  })
                }
                disabled={pageParam >= totalPages}
              >
                <span>Keyingi</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-card/50">
          <PackageSearch className="h-14 w-14 text-muted-foreground/40 stroke-1" />
          <h3 className="mt-4 text-lg font-bold text-foreground">{tCat("empty")}</h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-sm">
            Qidiruv mezonlariga mos keladigan mahsulot topilmadi. Filtrlarni tozalab qayta urinib ko&apos;ring.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-5"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            <span>{tCat("resetFilters")}</span>
          </Button>
        </div>
      )}

      {/* Yagona mahsulot bo'yicha Ariza Modali (Narxini bilish) */}
      <LeadModal
        isOpen={Boolean(leadProduct)}
        onClose={() => setLeadProduct(null)}
        customItemsSummary={
          leadProduct
            ? `${leadProduct.titleUz} (${leadProduct.category?.nameUz || ""})`
            : undefined
        }
      />
    </div>
  );
}
