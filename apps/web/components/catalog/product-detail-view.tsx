"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Bookmark,
  Check,
  Send,
  ShieldCheck,
  Ruler,
  Clock,
  ChevronLeft,
  ArrowRight,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/lead/lead-modal";
import { useSelectionsStore, type SelectionItem } from "@/lib/store/selections-store";
import { buildProductDeepLink } from "@/lib/telegram/deep-link";
import { toast } from "sonner";
import { ProductCard, type ProductCardData } from "@/components/catalog/product-card";

export interface DetailedProduct {
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
  article?: string;
  images: string[];
  categoryName: string;
  categorySlug?: string;
  colors?: { name: string; hex: string }[];
  characteristics?: { label: string; value: string }[];
}

interface ProductDetailViewProps {
  product: DetailedProduct;
  relatedProducts: ProductCardData[];
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps): React.JSX.Element {
  const locale = useLocale();
  const t = useTranslations("productDetail");

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

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false);

  const isInSelection = useSelectionsStore((state) => state.isSelected(product.id));
  const addItem = useSelectionsStore((state) => state.addItem);
  const removeItem = useSelectionsStore((state) => state.removeItem);

  const toggleSelection = () => {
    if (isInSelection) {
      removeItem(product.id);
      toast.info(t("removedToast"));
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
        categoryName: product.categoryName,
      };
      addItem(item);
      toast.success(t("addedToast"));
    }
  };

  const currentImage =
    product.images[activeImageIndex] ||
    product.images[0] ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc";
  const telegramLink = buildProductDeepLink(product.id);
  const articleCode = product.article || `PM-${product.id.slice(0, 4).toUpperCase()}`;

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("shareCopied"));
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Top Breadcrumb */}
      <section className="border-b border-border/80 bg-muted/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <Link
            href={`/${locale}/catalog`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t("backToCatalog")}</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">{product.categoryName}</span>
            <span className="hidden sm:inline">/</span>
            <span className="font-semibold text-foreground truncate max-w-[140px] sm:max-w-none">
              {title}
            </span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Big Image */}
          <div className="group relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden border border-border bg-muted">
            <Image
              src={currentImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-1000 ease-editorial group-hover:scale-[1.025]"
            />

            {/* Share button */}
            <button
              type="button"
              onClick={copyShareLink}
              title={t("share")}
              className="icon-button absolute right-4 top-4 bg-card border border-border-strong text-foreground hover:bg-foreground hover:text-background shadow-whisper-md transition-all duration-300 ease-editorial hover:scale-105 active:scale-95"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 w-20 sm:h-20 sm:w-24 shrink-0 overflow-hidden border transition-all duration-300 ease-editorial ${
                    activeImageIndex === idx
                      ? "border-primary ring-1 ring-primary opacity-100 scale-[1.02]"
                      : "border-border opacity-60 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <Image src={img} alt={`${title} ${idx + 1}`} fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Atelier Trust Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 border border-border bg-card p-4 text-center">
            <div className="space-y-1">
              <ShieldCheck className="h-4 w-4 text-primary mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                {t("warranty24")}
              </p>
              <p className="text-[10px] text-muted-foreground">{t("warranty24Desc")}</p>
            </div>
            <div className="space-y-1 border-x border-border/80">
              <Ruler className="h-4 w-4 text-primary mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                {t("customDimensions")}
              </p>
              <p className="text-[10px] text-muted-foreground">{t("customDimensionsDesc")}</p>
            </div>
            <div className="space-y-1">
              <Clock className="h-4 w-4 text-primary mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                {t("delivery")}
              </p>
              <p className="text-[10px] text-muted-foreground">{t("deliveryDesc")}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Specs & Inquiry (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="eyebrow">
                {product.categoryName} {product.material ? `• ${product.material}` : ""}
              </p>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                {t("articleNo", { code: articleCode })}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {title}
            </h1>

            {desc && (
              <p className="text-sm text-muted-foreground leading-relaxed font-light pt-1">
                {desc}
              </p>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Color & Material Options (if defined) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-foreground">
                {t("colorOptions")}{" "}
                <span className="text-muted-foreground font-normal">
                  {product.colors[selectedColorIndex]?.name}
                </span>
              </p>
              <div className="flex items-center gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    title={c.name}
                    className={`h-7 w-7 rounded-full border-2 transition-all duration-300 ease-editorial ${
                      selectedColorIndex === idx
                        ? "border-primary scale-110 shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Detailed Specifications Table */}
          <div className="border border-border bg-card p-4 space-y-3 text-xs">
            <p className="text-[10px] uppercase font-bold tracking-widest text-foreground">
              {t("specsTitle")}
            </p>
            <div className="space-y-2 divide-y divide-border/60">
              {product.dimensions && (
                <div className="flex items-center justify-between pt-1.5 text-muted-foreground">
                  <span>{t("dimensions")}</span>
                  <span className="font-medium text-foreground">{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex items-center justify-between pt-1.5 text-muted-foreground">
                  <span>{t("material")}</span>
                  <span className="font-medium text-foreground">{product.material}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex items-center justify-between pt-1.5 text-muted-foreground">
                  <span>{t("warranty")}</span>
                  <span className="font-medium text-foreground">{product.warranty}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 text-muted-foreground">
                <span>{t("status")}</span>
                <span className="font-medium text-foreground">
                  {product.stockStatus === "IN_STOCK" ? t("inStock") : t("madeToOrder")}
                </span>
              </div>
              {product.characteristics?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pt-1.5 text-muted-foreground">
                  <span>{item.label}:</span>
                  <span className="font-medium text-foreground text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {/* Primary Action: Konsultatsiya / Narxini bilish */}
            <Button
              size="lg"
              onClick={() => setIsInquiryModalOpen(true)}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider py-5 sm:py-6 rounded-none shadow-none smooth-btn"
            >
              <span>{t("askPriceBtn")}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            {/* Secondary Action: Tanlovga qo'shish & Telegram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleSelection}
                className={`w-full text-xs uppercase tracking-wider font-semibold py-4 sm:py-5 rounded-none border smooth-btn ${
                  isInSelection
                    ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
                    : "border-border-strong bg-card text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {isInSelection ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4 stroke-[2.5]" />
                    <span>{t("selected")}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-1.5 h-4 w-4" />
                    <span>{t("select")}</span>
                  </>
                )}
              </Button>

              {/* Direct Telegram order */}
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 border border-border-strong bg-card hover:border-foreground hover:bg-foreground hover:text-background text-foreground text-xs uppercase tracking-wider font-semibold py-3 sm:py-2.5 smooth-btn"
              >
                <Send className="h-3.5 w-3.5 text-primary" />
                <span>{t("telegramBtn")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="eyebrow">{t("atelierChoice")}</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
                {t("relatedTitle")}
              </h2>
            </div>
            <Link
              href={`/${locale}/catalog`}
              className="editorial-link"
            >
              <span className="editorial-link-text">{t("allProducts")}</span>
              <ArrowRight className="editorial-link-arrow" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lead Inquiry Modal */}
      <LeadModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        customItemsSummary={t("inquirySummary", {
          title,
          code: articleCode,
          dimensions: product.dimensions || "",
        })}
      />
    </div>
  );
}
