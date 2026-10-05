"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Check, Plus, HelpCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardImageSlider } from "@/components/catalog/card-image-slider";
import { LeadModal } from "@/components/lead/lead-modal";
import { useSelectionsStore, type SelectionItem } from "@/lib/store/selections-store";
import { buildProductDeepLink } from "@/lib/telegram/deep-link";

export interface ProductCardData {
  id: string;
  slug: string;
  titleUz: string;
  titleRu?: string | null;
  titleEn?: string | null;
  descUz?: string | null;
  descRu?: string | null;
  descEn?: string | null;
  dimensions?: string | null;
  material?: string | null;
  warranty?: string | null;
  stockStatus: "IN_STOCK" | "MADE_TO_ORDER";
  images: string[];
  article?: string;
  category?: {
    id: string;
    slug: string;
    nameUz: string;
    nameRu?: string | null;
    nameEn?: string | null;
  } | null;
  colors?: { name: string; hex: string }[];
}

interface ProductCardProps {
  product: ProductCardData;
  onAskPrice?: (product: ProductCardData) => void;
}

export function ProductCard({ product, onAskPrice }: ProductCardProps): React.JSX.Element {
  const locale = useLocale();
  const tCat = useTranslations("catalog");

  const [leadModalOpen, setLeadModalOpen] = React.useState(false);

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
    locale === "ru" && product.category?.nameRu
      ? product.category.nameRu
      : locale === "en" && product.category?.nameEn
      ? product.category.nameEn
      : product.category?.nameUz || "Mebel";

  const isInSelection = useSelectionsStore((state) => state.isSelected(product.id));
  const addItem = useSelectionsStore((state) => state.addItem);
  const removeItem = useSelectionsStore((state) => state.removeItem);

  const toggleSelection = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isInSelection) {
      removeItem(product.id);
    } else {
      const item: SelectionItem = {
        id: product.id,
        slug: product.slug,
        titleUz: product.titleUz,
        titleRu: product.titleRu || product.titleUz,
        titleEn: product.titleEn || product.titleUz,
        dimensions: product.dimensions,
        material: product.material,
        stockStatus: product.stockStatus,
        images: product.images,
        categoryName: categoryName,
      };
      addItem(item);
    }
  };

  const handleAskPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAskPrice) {
      onAskPrice(product);
    } else {
      setLeadModalOpen(true);
    }
  };

  const articleCode = product.article || `PM-${product.id.slice(0, 4).toUpperCase()}`;
  const telegramLink = buildProductDeepLink(product.id);

  const productHref = `/${locale}/catalog/${product.slug}`;

  return (
    <article className="group smooth-card border border-border bg-card flex flex-col justify-between overflow-hidden relative">
      {/* 1st Plan: Entire card is a direct link to product detail */}
      <Link href={productHref} className="block flex-1">
        {/* Multi-Image Touch Slider */}
        <CardImageSlider
          images={product.images}
          title={title}
          aspectRatio="aspect-[4/5]"
          stockStatus={product.stockStatus}
          isInSelection={isInSelection}
          onToggleSelection={toggleSelection}
        />

        {/* Card Body: Clean, calm typography with clear contrast */}
        <div className="p-2.5 sm:p-5 space-y-1 sm:space-y-1.5">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-primary truncate">
            {categoryName} {product.material ? `• ${product.material}` : ""}
          </p>

          <h3 className="font-sans text-xs sm:text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 ease-editorial group-hover:text-primary leading-tight sm:leading-snug line-clamp-1 sm:line-clamp-2">
            {title}
          </h3>

          {product.dimensions && (
            <p className="text-[10px] sm:text-xs text-muted-foreground pt-0.5 line-clamp-1">
              <span className="hidden sm:inline font-medium text-foreground">{tCat("dimensions")}: </span>
              {product.dimensions}
            </p>
          )}
        </div>
      </Link>

      {/* Clean Single Action: Narxini bilish */}
      <div className="p-2.5 sm:p-5 pt-0 mt-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={handleAskPrice}
          className="w-full h-8 sm:h-10 text-[10px] sm:text-xs font-semibold uppercase tracking-wider border-border-strong bg-card text-foreground hover:bg-foreground hover:text-background smooth-btn px-1 sm:px-3"
        >
          <HelpCircle className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0 transition-transform duration-300 group-hover/btn:scale-110" />
          <span className="truncate">{tCat("askPrice")}</span>
        </Button>
      </div>

      {/* Modal for "Narxini bilish" */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        customItemsSummary={`${title} (№ ${articleCode})`}
      />
    </article>
  );
}
