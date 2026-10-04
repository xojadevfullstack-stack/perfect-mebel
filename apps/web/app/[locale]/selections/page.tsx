"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Bookmark,
  Trash2,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Armchair,
  Home,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelectionsStore } from "@/lib/store/selections-store";
import { leadSchema, type LeadFormData } from "@mebel-salon/shared";

export default function SelectionsPage(): React.JSX.Element {
  const locale = useLocale();

  const items = useSelectionsStore((state) => state.items);
  const removeItem = useSelectionsStore((state) => state.removeItem);
  const clearAll = useSelectionsStore((state) => state.clearAll);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [orderCode, setOrderCode] = React.useState("");

  const itemsSummary = items.map((i) => i.titleUz).join(", ") || "Tanlovlar mavjud emas";

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
      itemsSummary,
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      const payload = {
        ...data,
        source: "WEB" as const,
        itemsSummary,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Arizani yuborishda xatolik yuz berdi");
        return;
      }

      const randomCode = Math.floor(10000 + Math.random() * 90000);
      setOrderCode(`#PM-${randomCode}`);
      setIsSuccessModalOpen(true);
      clearAll();
      reset();
      toast.success("Arizangiz muvaffaqiyatli qabul qilindi!");
    } catch {
      toast.error("Tarmoqda xatolik yuz berdi");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* ======================================================== */}
      {/* 1. BREADCRUMB & PAGE HEADER */}
      {/* ======================================================== */}
      <section className="space-y-3">
        <nav className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            Bosh sahifa
          </Link>
          <span>•</span>
          <span className="text-foreground">Tanlovlar &amp; Ariza</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-bold tracking-tight">
            Tanlangan Mebellar &amp; Ariza
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed mt-2">
            Xonadoningiz uchun tanlagan buyumlaringizni ko'rib chiqing va mutaxassisimiz bilan bog'lanish uchun ariza qoldiring.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 2-COLUMN CURATED LAYOUT */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Tanlangan Mebellar Ro'yxati (7 cols) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Mening Tanlovlarim{" "}
              <span className="text-xs font-normal text-muted-foreground font-sans ml-1">
                ({items.length} ta mebel)
              </span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              INDIVIDUAL ATELIER
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-card border border-border rounded-none p-12 text-center space-y-4 shadow-sm">
              <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto stroke-1" />
              <h3 className="font-serif text-xl font-bold text-foreground">
                Hozircha hech qanday mebel tanlanmagan
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Katalogimizdan yoqtirgan modellaringizni <span className="font-semibold text-foreground">"Tanlash"</span> tugmasi orqali shaxsiy vitrinangizga qo'shishingiz mumkin.
              </p>
              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-none transition-colors"
              >
                <span>Katalogga o'tish</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => {
                const coverImage = item.images[0] || null;
                const itemCode = `PM-${100 + (idx * 37 + 19) % 900}`;

                return (
                  <article
                    key={item.id}
                    className="smooth-card bg-card border border-border/80 rounded-none p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-36 aspect-[4/3] sm:aspect-auto sm:h-36 overflow-hidden bg-muted shrink-0 relative group">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={item.titleUz}
                          fill
                          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Armchair className="h-10 w-10 stroke-1" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-foreground">
                              {item.titleUz}
                            </h3>
                            {item.material && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.material}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                            title="Ro'yxatdan o'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {item.stockStatus === "IN_STOCK" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-card text-success border border-success/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-success" />
                              Omborda mavjud
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-card text-warning border border-warning/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                              Buyurtma asosida
                            </span>
                          )}
                          <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
                            KOD: {itemCode}
                          </span>
                        </div>
                      </div>

                      {item.dimensions && (
                        <div className="pt-2.5 mt-2.5 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
                          <span>O'lchami: {item.dimensions}</span>
                          <span className="text-primary font-medium">Bespoke o'lcham mumkin</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

              {/* Note under list */}
              <div className="p-4 rounded-none bg-muted/40 border border-border/80 text-xs text-muted-foreground leading-relaxed">
                Tanlovdagi barcha buyumlar xonadon o'lchamlari va individual materiallar bo'yicha moslashtirilishi mumkin. Shaxsiy me'moriy loyihalar uchun qirralar va furnituralar erkin tanlanadi.
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Ariza Qoldirish Formasi (5 cols) */}
        <section className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-card border border-border rounded-none p-4 sm:p-8 shadow-whisper space-y-5">
            <div className="border-b border-border/80 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary block">
                Eksklyuziv Maslahat
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                Konsultatsiya va Narxni Hisoblash
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Menejerimiz 15 daqiqa ichida siz bilan bog'lanib, tanlangan mebellar narxini xonadoningiz o'lchamlari bo'yicha hisoblab beradi.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Ism */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  To'liq Ismingiz <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("customerName")}
                  placeholder="Jasur Rahimov"
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
                  Telefon Raqamingiz <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("phone")}
                  placeholder="+998 90 123 45 67"
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
                  Manzil / Shahar
                </label>
                <Input
                  {...register("address")}
                  placeholder="Toshkent sh., Yunusobod tumani"
                  disabled={isSubmitting}
                  className="bg-background text-sm"
                />
              </div>

              {/* Izoh */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Qo'shimcha Izoh yoki Maxsus O'lchamlar
                </label>
                <Textarea
                  {...register("notes")}
                  placeholder="Masalan: Mehmonxona 32 kv.m, devorlar och sarg'ish rangda..."
                  rows={3}
                  disabled={isSubmitting}
                  className="bg-background text-sm resize-none"
                />
              </div>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>10 yillik rasmiy kafolat va servis xizmati</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Bepul xonadon o'lchov olish va rang tanlash</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Interyeringiz uchun bepul 3D loyihalashtirish</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <Button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3.5 rounded-none shadow-none flex items-center justify-center gap-2 smooth-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Yuborilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Arizani Yuborish (Narxini bilish)</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <a
                  href="https://t.me/perfectmebel_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-none border border-border-strong hover:border-foreground hover:bg-foreground hover:text-background py-2.5 px-4 text-xs font-semibold text-foreground smooth-btn"
                >
                  <Send className="h-3.5 w-3.5 text-primary" />
                  <span>Telegram Bot Orqali Buyurtma Berish</span>
                </a>
              </div>

              <p className="text-[10px] text-center text-muted-foreground leading-tight pt-1">
                Tugmani bosish orqali siz maxfiylik siyosati va ma'lumotlarni qayta ishlash shartlariga rozilik bildirasiz.
              </p>
            </form>
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* 3. SUCCESS MODAL OVERLAY */}
      {/* ======================================================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300 ease-editorial">
          <div className="bg-card border border-border rounded-none p-6 sm:p-10 max-w-lg w-full text-center space-y-4 shadow-whisper-lg animate-in fade-in-0 zoom-in-95 duration-400 ease-editorial">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 animate-in zoom-in-50 duration-500 ease-editorial">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted border border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>Buyurtma ID: {orderCode}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-foreground">
              Arizangiz muvaffaqiyatli qabul qilindi!
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
              15 daqiqa ichida mebel mutaxassisimiz siz bilan bog'lanadi va tanlangan to'plam bo'yicha xonadoningiz o'lchamlari hamda material namunalarini kelishib oladi.
            </p>

            <div className="space-y-2.5 pt-3">
              <Button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3.5 rounded-none shadow-none smooth-btn"
              >
                Tushunarli / Vitrinaga qaytish
              </Button>

              <a
                href="https://t.me/perfectmebel_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-none border border-border-strong hover:border-foreground hover:bg-foreground hover:text-background py-2.5 px-4 text-xs font-semibold text-foreground smooth-btn"
              >
                <Send className="h-3.5 w-3.5 text-primary" />
                <span>Telegram orqali holatni kuzatish</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
