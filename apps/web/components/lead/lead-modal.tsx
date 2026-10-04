"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { leadSchema, type LeadFormData } from "@mebel-salon/shared";
import { useSelectionsStore } from "@/lib/store/selections-store";
import { Loader2, CheckCircle2, Bookmark, Send, ShieldCheck, ArrowRight, Check } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  customItemsSummary?: string;
  onSuccess?: () => void;
}

export function LeadModal({
  isOpen,
  onClose,
  customItemsSummary,
  onSuccess,
}: LeadModalProps): React.JSX.Element {
  const locale = useLocale();
  const tLead = useTranslations("lead");
  const tCommon = useTranslations("common");

  const selectedItems = useSelectionsStore((state) => state.items);
  const clearAllSelections = useSelectionsStore((state) => state.clearAll);

  const getItemTitle = (item: (typeof selectedItems)[0]) => {
    if (locale === "ru" && item.titleRu) return item.titleRu;
    if (locale === "en" && item.titleEn) return item.titleEn;
    return item.titleUz;
  };

  const resolvedItemsSummary =
    customItemsSummary ||
    selectedItems.map((item) => getItemTitle(item)).join(", ") ||
    tLead("defaultSummary");

  const [isSubmittedSuccess, setIsSubmittedSuccess] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      notes: "",
      source: "WEB",
      itemsSummary: resolvedItemsSummary,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      setIsSubmittedSuccess(false);
      reset({
        customerName: "",
        phone: "",
        address: "",
        notes: "",
        source: "WEB",
        itemsSummary: resolvedItemsSummary,
      });
    }
  }, [isOpen, resolvedItemsSummary, reset]);

  const onSubmit = async (data: LeadFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        source: "WEB" as const,
        itemsSummary: resolvedItemsSummary,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || tCommon("error"));
        return;
      }

      const randomCode = Math.floor(10000 + Math.random() * 90000);
      setOrderId(`#PM-${randomCode}`);
      setIsSubmittedSuccess(true);
      toast.success(tLead("successTitle"));

      if (!customItemsSummary) {
        clearAllSelections();
      }

      onSuccess?.();
    } catch {
      toast.error(tCommon("error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-[calc(100vw-2rem)] sm:w-full p-4 sm:p-8 bg-card border-border shadow-whisper-lg rounded-none max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300 ease-editorial">
        {isSubmittedSuccess ? (
          /* ======================================================== */
          /* SUCCESS MODAL VIEW */
          /* ======================================================== */
          <div className="text-center py-4 space-y-4 animate-in fade-in-0 zoom-in-95 duration-400 ease-editorial">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 animate-in zoom-in-50 duration-500 ease-editorial">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted border border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>{tLead("orderId")}: {orderId}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground">
              {tLead("successTitle")}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
              {tLead("successModalDesc")}
            </p>

            {/* Submission Summary Pill Box */}
            <div className="bg-background border border-border p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
                  {tLead("selectedItemsSummary")}
                </span>
                <span className="font-bold text-primary inline-flex items-center gap-1">
                  <span>{tLead("received")}</span>
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </div>
              <p className="text-foreground font-medium line-clamp-2">{resolvedItemsSummary}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3.5 shadow-none rounded-none smooth-btn"
              >
                {tLead("backToShowcase")}
              </Button>

              <a
                href="https://t.me/perfectmebel_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-border-strong hover:border-foreground hover:bg-foreground hover:text-background py-2.5 px-4 text-xs font-semibold text-foreground smooth-btn"
              >
                <Send className="h-3.5 w-3.5 text-primary" />
                <span>{tLead("trackViaTelegram")}</span>
              </a>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* FORM VIEW */
          /* ======================================================== */
          <div className="space-y-4">
            <DialogHeader className="border-b border-border/80 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary block">
                {tLead("modalEyebrow")}
              </span>
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                {tLead("formTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {tLead("formSubtitle")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              {/* Tanlangan mebellar xulosasi */}
              <div className="border border-border bg-muted/40 p-3 text-xs">
                <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground mb-1">
                  <Bookmark className="h-3.5 w-3.5 text-primary" />
                  <span>{tLead("requestedItems")}</span>
                </div>
                <p className="font-medium text-foreground line-clamp-2">
                  {resolvedItemsSummary}
                </p>
              </div>

              {/* Ism */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {tLead("fullName")} <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("customerName")}
                  placeholder={tLead("fullNamePlaceholder")}
                  disabled={isSubmitting}
                  className="bg-background text-sm"
                />
                {errors.customerName && (
                  <p className="text-[11px] text-destructive mt-1">{errors.customerName.message}</p>
                )}
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {tLead("phone")} <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("phone")}
                  placeholder={tLead("phonePlaceholder")}
                  disabled={isSubmitting}
                  className="bg-background text-sm"
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Manzil */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {tLead("addressLabel")}
                </label>
                <Input
                  {...register("address")}
                  placeholder={tLead("addressFieldPlaceholder")}
                  disabled={isSubmitting}
                  className="bg-background text-sm"
                />
              </div>

              {/* Izoh */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {tLead("notesLabel")}
                </label>
                <Textarea
                  {...register("notes")}
                  placeholder={tLead("notesFieldPlaceholder")}
                  rows={2}
                  disabled={isSubmitting}
                  className="bg-background text-sm resize-none"
                />
              </div>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {tLead("warranty10")}
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" />
                  {tLead("free3d")}
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-primary stroke-[2.5]" />
                  {tLead("freeMeasurement")}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  {tLead("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-none shadow-none flex items-center gap-2 smooth-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{tLead("submitting")}</span>
                    </>
                  ) : (
                    <>
                      <span>{tLead("submit")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
