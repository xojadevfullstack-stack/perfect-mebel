"use client";

import * as React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/lead/lead-modal";
import { buildCollectionDeepLink } from "@/lib/telegram/deep-link";
import { Send, ArrowRight, Check, Plus } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/catalog/product-card";

export interface ChecklistProduct {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  images: string[];
  dimensions: string | null;
  material: string | null;
  warranty: string | null;
  stockStatus: "IN_STOCK" | "MADE_TO_ORDER";
  categoryName: string;
  colors?: { name: string; hex: string }[];
}

export interface CollectionChecklistProps {
  collection: {
    id: string;
    slug: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descUz: string | null;
    descRu: string | null;
    descEn: string | null;
    images: string[];
    products: ChecklistProduct[];
  };
}

export function CollectionChecklist({ collection }: CollectionChecklistProps): React.JSX.Element {
  const locale = useLocale();
  const t = useTranslations("collectionDetail");

  const getCollectionTitle = () => {
    if (locale === "ru" && collection.titleRu) return collection.titleRu;
    if (locale === "en" && collection.titleEn) return collection.titleEn;
    return collection.titleUz;
  };

  const getProductTitle = (p: ChecklistProduct) => {
    if (locale === "ru" && p.titleRu) return p.titleRu;
    if (locale === "en" && p.titleEn) return p.titleEn;
    return p.titleUz;
  };

  // Barcha mebellar default tanlangan
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(collection.products.map((p) => p.id))
  );

  const [leadModalOpen, setLeadModalOpen] = React.useState(false);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(collection.products.map((p) => p.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const selectedProducts = collection.products.filter((p) => selectedIds.has(p.id));
  const collectionTitle = getCollectionTitle();
  const selectedSummary =
    selectedProducts.length > 0
      ? t("setSummary", {
          title: collectionTitle,
          count: selectedProducts.length,
          items: selectedProducts.map((p) => getProductTitle(p)).join(", "),
        })
      : "";

  const telegramLink = buildCollectionDeepLink(collection.id);
  const heroImage =
    collection.images[0] ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAcDYSRzNE0rrW_Po8KOGmWeFj0Le5F2yCM-hkdAfBF825NkJLjakp8T9MNNlLdYWBG9ik8jPcdcwkj0-HUAUuGZbfW9IJW-FXkDM0bnL6sVB5KeY4IesTLOf3ASiqBT9Sg3VSP__3QFsMLWpuUJSVUerUIEc-VRVzpbd5usKe9YxQ_G0CgmQb8DR9x75S3dDB8C10k8MOvcMPoYH_S3TSax005YrqLafmogujVZuf3B6bExpjcwnoz1rIo6DLJCL7Ot16Pn2Zb-LE";

  return (
    <div className="space-y-16 pb-20 sm:pb-0">
      {/* Top Split: Hero Panorama + Checklist Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Architectural Hero Image & Hotspots (7 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-card border border-border p-3 sm:p-5 shadow-sm space-y-4">
          <div className="relative aspect-[4/3] md:aspect-[16/11] overflow-hidden bg-muted">
            <Image
              src={heroImage}
              alt={collectionTitle}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />

            {/* Scrim Overlay Tag */}
            <div className="absolute bottom-4 left-4 bg-card px-3.5 py-1.5 border border-border flex items-center space-x-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="eyebrow">
                {t("specBadge")}
              </span>
            </div>

            {/* Interactive Hotspots */}
            <div className="absolute top-[58%] left-[45%] group cursor-pointer">
              <span className="absolute -inset-2 rounded-full bg-primary/20 animate-ping" />
              <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-background text-primary border border-primary shadow text-xs font-bold">
                1
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-foreground text-background px-3 py-1.5 text-xs whitespace-nowrap shadow-lg">
                {t("hotspotMain")}
              </div>
            </div>

            <div className="absolute top-[64%] left-[20%] group cursor-pointer">
              <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-background text-primary border border-primary shadow text-xs font-bold">
                2
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-foreground text-background px-3 py-1.5 text-xs whitespace-nowrap shadow-lg">
                {t("hotspotSide")}
              </div>
            </div>

            <div className="absolute top-[35%] right-[22%] group cursor-pointer">
              <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-background text-primary border border-primary shadow text-xs font-bold">
                3
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-foreground text-background px-3 py-1.5 text-xs whitespace-nowrap shadow-lg">
                {t("hotspotShelf")}
              </div>
            </div>
          </div>

          {/* Material Spec Badges Under Hero */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-muted/40 border border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                {t("upholstery")}
              </span>
              <span className="font-medium text-foreground">{t("upholsteryValue")}</span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                {t("wood")}
              </span>
              <span className="font-medium text-foreground">{t("woodValue")}</span>
            </div>
            <div className="p-2.5 bg-muted/40 border border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                {t("surface")}
              </span>
              <span className="font-medium text-foreground">{t("surfaceValue")}</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Interactive Checklist Module (5 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-card border border-border p-4 sm:p-8 space-y-6">
          <div className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                {t("componentsTitle")}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary">
                {t("selectedCount", { count: selectedProducts.length })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {t("description")}
            </p>

            <div className="flex items-center gap-3 pt-3 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="text-primary hover:underline font-semibold"
              >
                {t("selectAll")}
              </button>
              <span className="text-muted-foreground">&bull;</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-muted-foreground hover:text-foreground"
              >
                {t("deselectAll")}
              </button>
            </div>
          </div>

          {/* Checklist Items: 2-Column Marketplace Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {collection.products.map((product) => {
              const isChecked = selectedIds.has(product.id);
              const pTitle = getProductTitle(product);
              const coverImg = product.images[0] || null;

              return (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleProduct(product.id);
                    }
                  }}
                  className={`group relative flex flex-col justify-between p-2.5 sm:p-3 border cursor-pointer select-none transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:shadow-whisper active:scale-[0.99] ${
                    isChecked
                      ? "border-primary bg-primary/[0.05] ring-1 ring-primary/40 shadow-whisper"
                      : "border-border/70 bg-card hover:border-foreground/30 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div>
                    {/* Thumbnail Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/60 mb-2 border border-border/40">
                      {coverImg ? (
                        <Image
                          src={coverImg}
                          alt={pTitle}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                        />
                      ) : null}

                      {/* Top-Right Floating Checkbox Indicator */}
                      <div className="absolute top-1.5 right-1.5 z-10">
                        <div
                          className={`h-5 w-5 rounded-none flex items-center justify-center transition-all duration-200 ease-editorial shadow-sm ${
                            isChecked
                              ? "bg-primary text-primary-foreground scale-105"
                              : "bg-card border border-border text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Top-Left Stock Badge */}
                      <div className="absolute top-1.5 left-1.5 z-10">
                        <span
                          className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-semibold shadow-sm transition-opacity duration-200 ${
                            product.stockStatus === "IN_STOCK"
                              ? "bg-card text-success border border-success/40"
                              : "bg-card text-warning border border-warning/40"
                          }`}
                        >
                          {product.stockStatus === "IN_STOCK" ? t("statusReady") : t("statusOrder")}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug transition-colors duration-200 group-hover:text-primary">
                      {pTitle}
                    </h4>
                    {product.dimensions && (
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground block mt-0.5 line-clamp-1">
                        {product.dimensions}
                      </span>
                    )}
                  </div>

                  {/* Bottom Toggle Pill */}
                  <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {isChecked ? t("selected") : t("add")}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border inline-flex items-center justify-center transition-all duration-200 ease-editorial ${
                        isChecked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground group-hover:border-foreground"
                      }`}
                    >
                      {isChecked ? <Check className="h-3 w-3 stroke-[2.5]" /> : <Plus className="h-3 w-3" />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lead Modal Trigger & Telegram Direct */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              disabled={selectedProducts.length === 0}
              onClick={() => setLeadModalOpen(true)}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider py-5 sm:py-6 rounded-none shadow-none smooth-btn"
            >
              <span>{t("submitInquiry")}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground text-xs uppercase tracking-wider font-semibold py-3 smooth-btn"
            >
              <Send className="h-3.5 w-3.5 text-primary" />
              <span>{t("orderViaTelegram")}</span>
            </a>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-1.5 text-xs text-muted-foreground font-light">
            <p className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{t("freeMeasurement")}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{t("free3d")}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{t("warranty24")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM SECTION: Minimalist Furniture Grid */}
      {/* ======================================================== */}
      <section className="space-y-8 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t("galleryEyebrow")}</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              {t("galleryTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
              {t("galleryDesc")}
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("itemsCount", { count: collection.products.length })}
          </span>
        </div>

        {/* Minimalist Furniture Gallery */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collection.products.map((p) => {
            const cardProduct: ProductCardData = {
              id: p.id,
              slug: p.slug,
              titleUz: p.titleUz,
              titleRu: p.titleRu,
              titleEn: p.titleEn,
              dimensions: p.dimensions,
              material: p.material,
              warranty: p.warranty,
              stockStatus: p.stockStatus,
              images: p.images && p.images.length > 0 ? p.images : [heroImage],
              category: {
                id: p.id,
                slug: p.slug,
                nameUz: p.categoryName,
                nameRu: p.categoryName,
                nameEn: p.categoryName,
              },
            };

            return <ProductCard key={p.id} product={cardProduct} />;
          })}
        </div>
      </section>

      {/* Mobile Floating Sticky Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-3 shadow-2xl flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            {t("mobileFromSet")}
          </div>
          <div className="text-xs font-bold text-foreground truncate">
            {t("mobileSelected", { count: selectedProducts.length })}
          </div>
        </div>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 w-10 flex items-center justify-center border border-border bg-card text-foreground hover:bg-muted shrink-0 transition-colors"
          title={t("orderViaTelegram")}
        >
          <Send className="h-4 w-4 text-primary" />
        </a>
        <Button
          size="sm"
          disabled={selectedProducts.length === 0}
          onClick={() => setLeadModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider h-10 px-3.5 rounded-none shadow-none shrink-0"
        >
          <span>{t("mobileInquiry")}</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Inquiry Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        customItemsSummary={selectedSummary}
      />
    </div>
  );
}
