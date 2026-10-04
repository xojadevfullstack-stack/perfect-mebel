"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Ruler, Sparkles, PhoneCall, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickConsultationForm(): React.JSX.Element {
  const t = useTranslations("quickConsultation");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const quickConsultationSchema = React.useMemo(() => {
    return z.object({
      fullName: z.string().min(2, t("fullNameError")),
      phone: z.string().min(7, t("phoneError")),
      room: z.string().optional(),
    });
  }, [t]);

  type QuickConsultationData = z.infer<typeof quickConsultationSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickConsultationData>({
    resolver: zodResolver(quickConsultationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      room: "living",
    },
  });

  const onSubmit = async (data: QuickConsultationData) => {
    try {
      const payload = {
        customerName: data.fullName,
        phone: data.phone.startsWith("+998") ? data.phone : `+998${data.phone.replace(/\D/g, "")}`,
        notes: t("notesPrefix", { room: data.room || "General" }),
        source: "WEB" as const,
        itemsSummary: t("itemsSummary"),
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || t("toastError"));
        return;
      }

      setIsSuccess(true);
      reset();
      toast.success(t("toastSuccess"));
    } catch {
      toast.error(t("networkError"));
    }
  };

  if (isSuccess) {
    return (
      <div className="py-10 text-center space-y-3 animate-in fade-in-50">
        <div className="w-14 h-14 bg-card border border-success/40 text-success flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground">
          {t("successTitle")}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {t("successDesc")}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSuccess(false)}
          className="mt-2 text-xs rounded-none"
        >
          {t("newRequest")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          {t("fullName")}
        </label>
        <input
          {...register("fullName")}
          placeholder={t("fullNamePlaceholder")}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-none text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
        />
        {errors.fullName && (
          <p className="text-[11px] text-destructive mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          {t("phone")}
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 sm:px-3.5 bg-muted/50 border border-r-0 border-border rounded-none text-xs font-semibold text-muted-foreground shrink-0">
            +998
          </span>
          <input
            {...register("phone")}
            placeholder="90 123 45 67"
            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 bg-background border border-border rounded-none text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        {errors.phone && (
          <p className="text-[11px] text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          {t("roomLabel")}
        </label>
        <select
          {...register("room")}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-none text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
        >
          <option value="living" className="bg-card text-foreground">{t("roomLiving")}</option>
          <option value="bedroom" className="bg-card text-foreground">{t("roomBedroom")}</option>
          <option value="dining" className="bg-card text-foreground">{t("roomDining")}</option>
          <option value="custom" className="bg-card text-foreground">{t("roomCustom")}</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3 rounded-none mt-2 transition-all flex items-center justify-center gap-2 shadow-none"
      >
        <span>{isSubmitting ? t("submitting") : t("submit")}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 border-t border-border/60 pt-3 mt-3 text-center">
        <div className="flex flex-col items-center">
          <Ruler className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mb-1" />
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">{t("freeMeasurement")}</span>
        </div>
        <div className="flex flex-col items-center">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mb-1" />
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">{t("project3d")}</span>
        </div>
        <div className="flex flex-col items-center">
          <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mb-1" />
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">{t("quickResponse")}</span>
        </div>
      </div>
    </form>
  );
}
