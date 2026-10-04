"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
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
                Tanlanganlar ({items.length} ta mebel)
              </span>
              <span className="text-[10px] sm:text-[11px] text-primary-foreground/90 block font-normal">
                Loyiha hisobini olish →
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
                <span>Mening Tanlovlarim</span>
              </DialogTitle>
              <span className="border border-border bg-background px-2.5 py-0.5 text-xs font-bold text-primary">
                {items.length} ta mebel
              </span>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Narxlar va yetkazib berish shartlari telefon orqali mutaxassis bilan individual kelishiladi.
            </DialogDescription>
          </DialogHeader>

          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/30 stroke-1" />
              <p className="text-sm font-semibold text-foreground">Hozircha hech qanday mebel tanlanmadi</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Katalogdan yoqqan modellaringizni <span className="font-semibold text-foreground">"Tanlash"</span> tugmasi orqali bu yerga to'plashingiz mumkin.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Product list */}
              <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                {items.map((item) => {
                  const coverImage = item.images[0] || null;
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
                              alt={item.titleUz}
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
                            {item.titleUz}
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
                              {item.stockStatus === "IN_STOCK" ? "Omborda tayyor" : "Buyurtma asosida"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-muted"
                        title="O'chirish"
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
                  <span>Arizani Yuborish (Narxini bilish)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/selections`}
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 px-3 rounded-none border border-border-strong bg-card hover:bg-foreground hover:text-background text-xs font-semibold uppercase tracking-wider text-foreground transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>To'liq ko'rish</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-destructive rounded-none uppercase tracking-wider"
                  >
                    Tozalash
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
