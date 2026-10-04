"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard, type ProductCardData } from "@/components/catalog/product-card";
import { ATELIER_PRODUCTS, type AtelierProduct } from "@/lib/catalog-data";
import { RotateCcw } from "lucide-react";

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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";

  const [categories, setCategories] = React.useState<CategoryData[]>(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(categoryParam);

  // Fetch categories from database API if not provided in initialCategories
  React.useEffect(() => {
    if (!categories || categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const res = await fetch("/api/categories");
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              setCategories(json.data);
            }
          }
        } catch {
          // fallback
        }
      };
      fetchCategories();
    }
  }, [categories]);

  // Convert ATELIER_PRODUCTS to ProductCardData format
  const mappedAtelierProducts: ProductCardData[] = React.useMemo(() => {
    return ATELIER_PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      titleUz: p.titleUz,
      titleRu: p.titleRu,
      titleEn: p.titleEn,
      descUz: p.descUz,
      descRu: p.descRu,
      descEn: p.descEn,
      dimensions: p.dimensions,
      material: p.material,
      warranty: p.warranty,
      stockStatus: p.stockStatus,
      images: p.images,
      article: p.article,
      colors: p.colors,
      category: {
        id: p.categorySlug,
        slug: p.categorySlug,
        nameUz: p.categoryName,
        nameRu: p.categoryName,
        nameEn: p.categoryName,
      },
    }));
  }, []);

  const [dbProducts, setDbProducts] = React.useState<ProductCardData[]>([]);

  // Fetch from database API if present
  React.useEffect(() => {
    async function fetchDb() {
      try {
        const res = await fetch("/api/products?limit=50");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setDbProducts(json.data);
          }
        }
      } catch {
        // Fallback to ATELIER_PRODUCTS
      }
    }
    fetchDb();
  }, []);

  const allProducts = dbProducts.length > 0 ? dbProducts : mappedAtelierProducts;

  // Filter products based on selected category slug
  const filteredProducts = React.useMemo(() => {
    return allProducts.filter((product) => {
      if (!selectedCategory || selectedCategory === "all" || selectedCategory === "Barchasi") return true;
      const catSlug = product.category?.slug;
      return catSlug === selectedCategory;
    });
  }, [allProducts, selectedCategory]);

  const resetFilters = () => {
    setSelectedCategory("all");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const getCategoryName = (cat: CategoryData) => {
    if (locale === "ru" && cat.nameRu) return cat.nameRu;
    if (locale === "en" && cat.nameEn) return cat.nameEn;
    return cat.nameUz;
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const activeCategoryTitle = activeCategoryObj ? getCategoryName(activeCategoryObj) : selectedCategory;
  const isAllSelected = !selectedCategory || selectedCategory === "all" || selectedCategory === "Barchasi";

  const allLabel = locale === "ru" ? "Все" : locale === "en" ? "All" : "Barchasi";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-16">
      {/* Eyebrow & Header */}
      <p className="eyebrow">Atelier ko'rgazmasi 2026</p>
      <h1 className="mt-2.5 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
        Mebellar Katalogi
      </h1>
      <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground font-light max-w-2xl leading-relaxed">
        Har bir buyum alohida e'tibor va tabiiy materiallar bilan yaratilgan me'moriy namunadir.
      </p>

      {/* Hairline Divider */}
      <div className="my-6 sm:my-10 h-px bg-border" />

      {/* Filter Controls Row: Clean Minimalist Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {/* Barchasi / All button */}
          <button
            type="button"
            onClick={() => handleSelectCategory("all")}
            className={`border px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 ease-editorial hover:scale-[1.02] active:scale-[0.98] ${
              isAllSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:border-foreground/60"
            }`}
          >
            {allLabel}
          </button>

          {/* Dynamic DB categories */}
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => handleSelectCategory(cat.slug)}
              className={`border px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 ease-editorial hover:scale-[1.02] active:scale-[0.98] ${
                selectedCategory === cat.slug
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-foreground/60"
              }`}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>

        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          <span>{filteredProducts.length} ta namuna</span>
        </div>
      </div>

      {/* Reset Filter if active */}
      {!isAllSelected && (
        <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground animate-in fade-in-0 duration-300">
          <span className="text-foreground font-semibold">Kategoriya: {activeCategoryTitle}</span>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-semibold transition-colors duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Tozalash</span>
          </button>
        </div>
      )}

      {/* 3-Column Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 duration-500 ease-editorial">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4">
          <p className="font-serif text-2xl text-foreground">
            Bu filtrlarga mos mebel topilmadi.
          </p>
          <p className="text-xs text-muted-foreground">
            Boshqa toifa yoki materialni tanlab ko'ring.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="border border-border bg-card px-4 py-2 text-xs uppercase tracking-wider font-semibold text-foreground hover:bg-muted"
          >
            Barcha mebellarni ko'rsatish
          </button>
        </div>
      )}
    </div>
  );
}
