"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { Loader2, CheckCircle2, ShoppingBag } from "lucide-react";

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
  const t = useTranslations("lead");
  const tCommon = useTranslations("common");

  const selectedItems = useSelectionsStore((state) => state.items);
  const clearAllSelections = useSelectionsStore((state) => state.clearAll);

  // Tanlangan mebellar matni
  const resolvedItemsSummary =
    customItemsSummary ||
    selectedItems.map((item) => item.titleUz).join(", ") ||
    "Umumiy konsultatsiya so'rovi";

  const [isSubmittedSuccess, setIsSubmittedSuccess] = React.useState(false);

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

      setIsSubmittedSuccess(true);
      toast.success(t("successTitle"));

      // Agar savatchadan yuborilgan bo'lsa, tozalaymiz
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modalTitle")}</DialogTitle>
          <DialogDescription>{t("modalSubtitle")}</DialogDescription>
        </DialogHeader>

        {isSubmittedSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">{t("successTitle")}</h3>
            <p className="text-xs text-muted-foreground max-w-xs">{t("successDesc")}</p>
            <Button onClick={onClose} className="mt-4">
              {tCommon("cancel")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
            {/* Tanlangan mebellar xulosasi */}
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
              <div className="flex items-center space-x-2 font-semibold text-foreground">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>{t("selectedItems")}</span>
              </div>
              <p className="mt-1 font-medium text-primary line-clamp-3">
                {resolvedItemsSummary}
              </p>
            </div>

            {/* Ism */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("name")}
              </label>
              <Input
                {...register("customerName")}
                placeholder={t("namePlaceholder")}
                disabled={isSubmitting}
              />
              {errors.customerName && (
                <p className="text-xs text-destructive">{errors.customerName.message}</p>
              )}
            </div>

            {/* Telefon */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("phone")}
              </label>
              <Input
                {...register("phone")}
                placeholder={t("phonePlaceholder")}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Manzil */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("address")}
              </label>
              <Input
                {...register("address")}
                placeholder={t("addressPlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            {/* Izoh */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("notes")}
              </label>
              <Textarea
                {...register("notes")}
                placeholder={t("notesPlaceholder")}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>{t("submitting")}</span>
                  </>
                ) : (
                  <span>{t("submit")}</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
