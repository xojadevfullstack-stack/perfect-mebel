"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Edit2, Trash2, Boxes, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CollectionItem } from "./collection-form-dialog";

interface CollectionGridProps {
  collections: CollectionItem[];
  onEdit: (col: CollectionItem) => void;
  onDelete: (id: string) => void;
}

export function CollectionGrid({
  collections,
  onEdit,
  onDelete,
}: CollectionGridProps): React.JSX.Element {
  const t = useTranslations("admin.collections");

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <PackageOpen className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-3 text-base font-semibold text-foreground">{t("empty")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((col) => {
        const coverImage = col.images[0] || null;
        const productsCount = col._count?.products ?? col.products?.length ?? 0;

        return (
          <div
            key={col.id}
            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={col.titleUz}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={coverImage.startsWith("/uploads")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Boxes className="h-10 w-10 stroke-1" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur">
                  {productsCount} {t("unitProducts")}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-bold tracking-tight text-card-foreground line-clamp-1">
                  {col.titleUz}
                </h3>
                {col.titleRu && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {col.titleRu}
                  </p>
                )}
                {col.descUz && (
                  <p className="mt-2 text-xs text-muted-foreground/90 line-clamp-2">
                    {col.descUz}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5">
              <span className="text-[11px] font-mono text-muted-foreground">
                /{col.slug}
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit(col)}
                  title={t("edit")}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => onDelete(col.id)}
                  title={t("deleteConfirmTitle")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
