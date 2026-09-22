"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LeadModal } from "@/components/lead/lead-modal";
import { buildCollectionDeepLink } from "@/lib/telegram/deep-link";
import { cn } from "@/lib/utils";
import { Send, CheckSquare, Square, Package, ExternalLink } from "lucide-react";

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
  const tCol = useTranslations("collections");
  const tCat = useTranslations("catalog");
  const locale = useLocale();

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

  // Tanlangan mebellarning ro'yxati
  const selectedProducts = collection.products.filter((p) => selectedIds.has(p.id));

  // Ariza modaliga beriladigan tanlov matni
  const collectionTitle = getCollectionTitle();
  const selectedSummary =
    selectedProducts.length > 0
      ? `${collectionTitle} komplektidan tanlandi (${selectedProducts.length} ta): ` +
        selectedProducts.map((p) => getProductTitle(p)).join(", ")
      : "";

  const telegramLink = buildCollectionDeepLink(collection.id);

  return (
    <div className="space-y-6">
      {/* Header va Amallar */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{tCol("checklistTitle")}</h2>
          <p className="text-sm text-muted-foreground">{tCol("checklistSubtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="flex items-center gap-1.5"
          >
            <CheckSquare className="h-4 w-4" />
            <span>{tCol("selectAll")}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={deselectAll}
            className="flex items-center gap-1.5"
          >
            <Square className="h-4 w-4" />
            <span>{tCol("deselectAll")}</span>
          </Button>
        </div>
      </div>

      {/* Mebellar ro'yxati */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collection.products.map((product) => {
          const isChecked = selectedIds.has(product.id);
          const title = getProductTitle(product);
          const coverImage = product.images[0];

          return (
            <Card
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={cn(
                "relative cursor-pointer transition-all border-2 overflow-hidden hover:border-primary/60",
                isChecked ? "border-primary bg-primary/[0.02]" : "border-border opacity-70"
              )}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10 stroke-1" />
                  </div>
                )}

                {/* Checkbox overlay */}
                <div
                  className="absolute top-3 left-3 rounded-md bg-background/90 p-1 backdrop-blur shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                </div>

                {/* Stock status badge */}
                <Badge
                  variant={product.stockStatus === "IN_STOCK" ? "success" : "secondary"}
                  className="absolute top-3 right-3 shadow-sm backdrop-blur"
                >
                  {product.stockStatus === "IN_STOCK" ? tCat("inStock") : tCat("madeToOrder")}
                </Badge>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-xs font-medium text-primary">
                  {product.categoryName}
                </div>
                <h3 className="font-semibold text-base leading-snug line-clamp-2">
                  {title}
                </h3>

                {(product.dimensions || product.material) && (
                  <div className="text-xs text-muted-foreground space-y-0.5 pt-1 border-t">
                    {product.dimensions && (
                      <div>
                        <span className="font-medium text-foreground">{tCat("dimensions")}: </span>
                        {product.dimensions}
                      </div>
                    )}
                    {product.material && (
                      <div>
                        <span className="font-medium text-foreground">{tCat("material")}: </span>
                        {product.material}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tanlov bo'yicha harakat paneli */}
      <div className="sticky bottom-6 z-40 rounded-2xl border bg-card/95 p-4 shadow-xl backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {selectedIds.size}
            </div>
            <div>
              <p className="font-bold text-base">
                {selectedIds.size} {tCol("selectedCount")}
              </p>
              <p className="text-xs text-muted-foreground">
                {collectionTitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Telegram orqali butun komplektga buyurtma */}
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2"
              )}
            >
              <Send className="h-4 w-4 text-sky-500" />
              <span>{tCol("orderFullSetViaTelegram")}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>

            {/* Tanlangan mebellar bo'yicha saytdan ariza qoldirish */}
            <Button
              type="button"
              size="lg"
              disabled={selectedIds.size === 0}
              onClick={() => setLeadModalOpen(true)}
              className="gap-2 shadow-md"
            >
              <span>{tCol("orderSelected")}</span>
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-bold">
                {selectedIds.size}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Ariza Modali */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        customItemsSummary={selectedSummary}
      />
    </div>
  );
}
