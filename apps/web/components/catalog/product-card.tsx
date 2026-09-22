"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  Armchair,
  Check,
  Plus,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Ruler,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSelectionsStore, type SelectionItem } from "@/lib/store/selections-store";
import { buildProductDeepLink } from "@/lib/telegram/deep-link";

export interface ProductCardData {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descUz?: string | null;
  descRu?: string | null;
  descEn?: string | null;
  dimensions?: string | null;
  material?: string | null;
  warranty?: string | null;
  stockStatus: "IN_STOCK" | "MADE_TO_ORDER";
  images: string[];
  category?: {
    id: string;
    slug: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
  } | null;
}

interface ProductCardProps {
  product: ProductCardData;
  onAskPrice?: (product: ProductCardData) => void;
}

export function ProductCard({ product, onAskPrice }: ProductCardProps): React.JSX.Element {
  const locale = useLocale();
  const tCat = useTranslations("catalog");

  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(false);

  const isSelected = useSelectionsStore((state) => state.isSelected(product.id));
  const toggleItem = useSelectionsStore((state) => state.toggleItem);

  // Tanlangan til bo'yicha nom va tavsif
  const title =
    locale === "ru" && product.titleRu
      ? product.titleRu
      : locale === "en" && product.titleEn
      ? product.titleEn
      : product.titleUz;

  const desc =
    locale === "ru" && product.descRu
      ? product.descRu
      : locale === "en" && product.descEn
      ? product.descEn
      : product.descUz;

  const categoryName =
    product.category
      ? locale === "ru" && product.category.nameRu
        ? product.category.nameRu
        : locale === "en" && product.category.nameEn
        ? product.category.nameEn
        : product.category.nameUz
      : null;

  const coverImage = product.images[0] || null;

  const handleToggleSelect = () => {
    const item: SelectionItem = {
      id: product.id,
      slug: product.slug,
      titleUz: product.titleUz,
      titleRu: product.titleRu,
      titleEn: product.titleEn,
      images: product.images,
      categoryName: categoryName || undefined,
      stockStatus: product.stockStatus,
      dimensions: product.dimensions,
      material: product.material,
    };
    toggleItem(item);
  };

  const telegramLink = buildProductDeepLink(product.id);

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
      <div>
        {/* Rasm va Holat Badge */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={coverImage.startsWith("/uploads")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Armchair className="h-12 w-12 stroke-1" />
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {product.stockStatus === "IN_STOCK" ? (
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] shadow">
                {tCat("inStock")}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/90 hover:bg-amber-600 text-white border-none font-medium text-[11px] shadow">
                {tCat("madeToOrder")}
              </Badge>
            )}
          </div>

          {/* Kategoriya Badge */}
          {categoryName && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/85 text-[11px] font-medium">
                {categoryName}
              </Badge>
            </div>
          )}
        </div>

        {/* Ma'lumot qismi */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {desc && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {desc}
            </p>
          )}

          {/* Batafsil (Accordion) qismi */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="flex items-center text-xs font-medium text-primary hover:underline"
            >
              <span>{isDetailsExpanded ? tCat("hideDetails") : tCat("viewDetails")}</span>
              {isDetailsExpanded ? (
                <ChevronUp className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              )}
            </button>

            {isDetailsExpanded && (
              <div className="mt-2.5 space-y-1.5 rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground animate-in fade-in-50">
                {product.dimensions && (
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground">{tCat("dimensions")}:</strong> {product.dimensions}
                    </span>
                  </div>
                )}
                {product.material && (
                  <div className="flex items-center space-x-2">
                    <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground">{tCat("material")}:</strong> {product.material}
                    </span>
                  </div>
                )}
                {product.warranty && (
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground">{tCat("warranty")}:</strong> {product.warranty}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tugmalar paneli (Actions) */}
      <div className="border-t border-border/60 bg-muted/15 p-3 sm:p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Tanlash ➕ / Tanlandi ✅ */}
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={handleToggleSelect}
            className="w-full text-xs"
          >
            {isSelected ? (
              <>
                <Check className="mr-1 h-3.5 w-3.5 stroke-[3]" />
                <span>{tCat("inSelection")}</span>
              </>
            ) : (
              <>
                <Plus className="mr-1 h-3.5 w-3.5" />
                <span>{tCat("addToSelection")}</span>
              </>
            )}
          </Button>

          {/* Narxini bilish */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAskPrice?.(product)}
            className="w-full text-xs"
          >
            <HelpCircle className="mr-1 h-3.5 w-3.5 text-primary" />
            <span>{tCat("askPrice")}</span>
          </Button>
        </div>

        {/* Telegram orqali buyurtma (Deep link) */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center space-x-1.5 rounded-md border border-sky-500/30 bg-sky-500/10 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
        >
          <Send className="h-3 w-3" />
          <span>{tCat("orderViaTelegram")}</span>
        </a>
      </div>
    </div>
  );
}
