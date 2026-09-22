"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ClipboardList, X, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
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

  if (items.length === 0 && !isOpen) {
    return <React.Fragment />;
  }

  return (
    <>
      {/* Floating Action Button */}
      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary/95 focus:outline-none focus:ring-4 focus:ring-primary/30 animate-in fade-in zoom-in-75"
        >
          <ClipboardList className="h-5 w-5" />
          <span>{t("floatingButton")}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-extrabold text-foreground shadow-sm">
            {items.length}
          </span>
        </button>
      )}

      {/* Selections Panel / Modal */}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span>{t("title")}</span>
              </DialogTitle>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {items.length} {t("selectedItemsCount")}
              </span>
            </div>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>

          {items.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/40 stroke-1" />
              <p className="text-sm font-semibold text-foreground">{t("empty")}</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">{t("emptyHint")}</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Mahsulotlar ro'yxati */}
              <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                {items.map((item) => {
                  const coverImage = item.images[0] || null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                          {coverImage ? (
                            <Image
                              src={coverImage}
                              alt={item.titleUz}
                              fill
                              sizes="56px"
                              className="object-cover"
                              unoptimized={coverImage.startsWith("/uploads")}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ShoppingBag className="h-6 w-6 stroke-1" />
                            </div>
                          )}
                        </div>

                        <div className="overflow-hidden">
                          <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                            {item.titleUz}
                          </h4>
                          {item.categoryName && (
                            <span className="text-[11px] text-muted-foreground block">
                              {item.categoryName}
                            </span>
                          )}
                          {item.dimensions && (
                            <span className="text-[10px] text-muted-foreground/80 block">
                              {item.dimensions}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        title="O'chirish"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Pastki tugmalar */}
              <div className="flex items-center justify-between border-t border-border/60 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  <span>{t("clearAll")}</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    setIsLeadModalOpen(true);
                  }}
                  className="px-5 font-semibold"
                >
                  <span>{t("submitLead")}</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ariza Modali */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </>
  );
}
