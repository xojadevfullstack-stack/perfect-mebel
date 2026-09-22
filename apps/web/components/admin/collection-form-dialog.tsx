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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { collectionSchema, type CollectionFormData } from "@mebel-salon/shared";
import { slugify } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { type ProductItem } from "./product-form-dialog";

export interface CollectionItem {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descUz?: string | null;
  descRu?: string | null;
  descEn?: string | null;
  images: string[];
  products?: Array<{
    id: string;
    titleUz: string;
    images: string[];
    stockStatus: "IN_STOCK" | "MADE_TO_ORDER";
  }>;
  _count?: {
    products: number;
  };
  createdAt: string;
}

interface CollectionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CollectionItem | null;
  availableProducts: ProductItem[];
}

export function CollectionFormDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  availableProducts,
}: CollectionFormDialogProps): React.JSX.Element {
  const t = useTranslations("admin.collections");
  const tCommon = useTranslations("admin.common");
  const isEditing = Boolean(initialData);

  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      titleUz: "",
      titleRu: "",
      titleEn: "",
      slug: "",
      descUz: "",
      descRu: "",
      descEn: "",
      images: [],
      productIds: [],
    },
  });

  const titleUzValue = watch("titleUz");
  const currentImages = watch("images") || [];

  // Slug avtomatik generatsiya
  React.useEffect(() => {
    if (!isEditing && titleUzValue) {
      setValue("slug", slugify(titleUzValue), { shouldValidate: true });
    }
  }, [titleUzValue, isEditing, setValue]);

  // initialData o'zgarganda formani to'ldirish
  React.useEffect(() => {
    if (initialData) {
      const prodIds = initialData.products?.map((p) => p.id) || [];
      setSelectedProductIds(prodIds);
      reset({
        slug: initialData.slug,
        titleUz: initialData.titleUz,
        titleRu: initialData.titleRu,
        titleEn: initialData.titleEn,
        descUz: initialData.descUz || "",
        descRu: initialData.descRu || "",
        descEn: initialData.descEn || "",
        images: initialData.images || [],
        productIds: prodIds,
      });
    } else {
      setSelectedProductIds([]);
      reset({
        slug: "",
        titleUz: "",
        titleRu: "",
        titleEn: "",
        descUz: "",
        descRu: "",
        descEn: "",
        images: [],
        productIds: [],
      });
    }
  }, [initialData, reset]);

  const toggleProduct = (productId: string) => {
    const next = selectedProductIds.includes(productId)
      ? selectedProductIds.filter((id) => id !== productId)
      : [...selectedProductIds, productId];
    setSelectedProductIds(next);
    setValue("productIds", next, { shouldValidate: true });
  };

  const onSubmit = async (data: CollectionFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        productIds: selectedProductIds,
      };

      const url = isEditing && initialData
        ? `/api/admin/collections/${initialData.id}`
        : "/api/admin/collections";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || tCommon("error"));
        return;
      }

      toast.success(isEditing ? t("updateSuccess") : t("createSuccess"));
      onSuccess();
      onClose();
    } catch {
      toast.error(tCommon("error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("edit") : t("addNew")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Sarlavhalar (3 tilda) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("titleUz")} <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("titleUz")}
                placeholder={t("placeholderTitleUz")}
                disabled={isSubmitting}
              />
              {errors.titleUz && (
                <p className="text-xs text-destructive">{errors.titleUz.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("titleRu")}
              </label>
              <Input
                {...register("titleRu")}
                placeholder={t("placeholderTitleRu")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("titleEn")}
              </label>
              <Input
                {...register("titleEn")}
                placeholder={t("placeholderTitleEn")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("slug")}
            </label>
            <Input
              {...register("slug")}
              placeholder={t("placeholderSlug")}
              disabled={isSubmitting}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Tavsiflar (3 tilda) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("descUz")}
              </label>
              <Textarea
                {...register("descUz")}
                placeholder={t("placeholderDescUz")}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("descRu")}
              </label>
              <Textarea
                {...register("descRu")}
                placeholder={t("placeholderDescRu")}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("descEn")}
              </label>
              <Textarea
                {...register("descEn")}
                placeholder={t("placeholderDescEn")}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Rasm yuklash va galereya */}
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3.5">
            <label className="text-xs font-semibold text-foreground">
              {t("images")}
            </label>
            <ImageUploader
              images={currentImages}
              onChange={(imgs) => setValue("images", imgs, { shouldValidate: true })}
            />
          </div>

          {/* Tarkibdagi mebellarni biriktirish */}
          <div className="space-y-2 rounded-lg border border-border bg-muted/10 p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                {t("products")} ({selectedProductIds.length} ta tanlandi)
              </label>
              <span className="text-[11px] text-muted-foreground">
                {t("selectProducts")}
              </span>
            </div>

            {availableProducts.length > 0 ? (
              <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {availableProducts.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleProduct(prod.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-md border p-2 text-xs transition-colors ${
                        isChecked
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-background"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{prod.titleUz}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {prod.category?.nameUz || ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Mavjud mebellar topilmadi. Avval mebellar bo&apos;limida mahsulot qo&apos;shing.
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
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
                  <span>{tCommon("saving")}</span>
                </>
              ) : (
                <span>{tCommon("save")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
