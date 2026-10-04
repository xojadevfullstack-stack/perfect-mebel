"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Bookmark, Trash2, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelectionsStore } from "@/lib/store/selections-store";
import { LeadModal } from "@/components/lead/lead-modal";

interface FloatingSelectionsWidgetProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export function FloatingSelectionsWidget({
  externalOpen,
  onExternalOpenChange,
}: FloatingSelectionsWidgetProps): React.JSX.Element {
  const locale = useLocale();
  const t = useTranslations("selections");

  const items = useSelectionsStore((state) => state.items);
  const removeItem = useSelectionsStore((state) => state.removeItem);
  const clearAll = useSelectionsStore((state) => state.clearAll);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (onExternalOpenChange) {
      onExternalOpenChange(val);
    } else {
      setInternalOpen(val);
    }
  };

  const getItemTitle = (item: (typeof items)[0]) => {
    if (locale === "ru" && item.titleRu) return item.titleRu;
    if (locale === "en" && item.titleEn) return item.titleEn;
    return item.titleUz;
  };

  if (items.length === 0 && !isOpen) {
    return <React.Fragment />;
  }

  return (
    <>
      {/* Stitch-style Floating Action Widget */}
      {items.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2.5 sm:gap-3 rounded-none bg-primary px-3.5 py-2.5 sm:px-5 sm:py-3 text-primary-foreground shadow-2xl transition-all duration-200 hover:bg-primary-hover focus:outline-none border border-primary-hover"
          >
            <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 fill-current shrink-0" />
            <div className="text-left">
              <span className="text-xs sm:text-sm font-semibold block leading-tight">
                {t("floatingBadge", { count: items.length })}
              </span>
              <span className="text-[10px] sm:text-[11px] text-primary-foreground/90 block font-normal">
                {t("getEstimate")}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Selections Panel Modal */}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-lg w-[calc(100vw-2rem)] sm:w-full overflow-y-auto p-4 sm:p-8 bg-card border-border shadow-whisper-lg rounded-none">
          <DialogHeader className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary fill-primary/20" />
                <span>{t("title")}</span>
              </DialogTitle>
              <span className="border border-border bg-background px-2.5 py-0.5 text-xs font-bold text-primary">
                {t("itemsCountBadge", { count: items.length })}
              </span>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {t("floatingNotice")}
            </DialogDescription>
          </DialogHeader>

          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/30 stroke-1" />
              <p className="text-sm font-semibold text-foreground">{t("noItemsSelected")}</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {t("emptyHint")}
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Product list */}
              <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                {items.map((item) => {
                  const coverImage = item.images[0] || null;
                  const itemTitle = getItemTitle(item);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border border-border bg-background p-3 hover:border-foreground/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-muted border border-border/60">
                          {coverImage ? (
                            <Image
                              src={coverImage}
                              alt={itemTitle}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              Foto
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate text-xs font-bold text-foreground">
                            {itemTitle}
                          </p>
                          {item.material && (
                            <p className="truncate text-[11px] text-muted-foreground">
                              {item.material}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider border border-border bg-card text-muted-foreground">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.stockStatus === "IN_STOCK" ? "bg-success" : "bg-warning"
                                }`}
                              />
                              {item.stockStatus === "IN_STOCK" ? t("inStockReady") : t("madeToOrder")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-muted"
                        title={t("removeFromSelection")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5 pt-3 border-t border-border/80">
                <Button
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 text-xs uppercase tracking-wider font-semibold rounded-none flex items-center justify-center gap-2 shadow-none"
                  onClick={() => {
                    setOpen(false);
                    setIsLeadModalOpen(true);
                  }}
                >
                  <span>{t("submitButton")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/selections`}
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 px-3 rounded-none border border-border-strong bg-card hover:bg-foreground hover:text-background text-xs font-semibold uppercase tracking-wider text-foreground transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t("viewFull")}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-destructive rounded-none uppercase tracking-wider"
                  >
                    {t("clearAll")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Direct Lead Inquiry Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </>
  );
}
