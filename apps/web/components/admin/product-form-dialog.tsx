"use client";

import * as React from "react";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema, type ProductFormData } from "@mebel-salon/shared";
import { slugify } from "@/lib/utils";
import { Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import { type CategoryItem } from "./category-form-dialog";

export interface ProductItem {
  id: string;
  categoryId: string;
  collectionId?: string | null;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descUz?: string | null;
  descRu?: string | null;
  descEn?: string | null;
  dimensions?: string | null;
  material?: string | null;
  warranty?: string | null;
  stockStatus: "IN_STOCK" | "MADE_TO_ORDER";
  images: string[];
  category?: CategoryItem;
  createdAt: string;
}

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ProductItem | null;
  categories: CategoryItem[];
}

export function ProductFormDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  categories,
}: ProductFormDialogProps): React.JSX.Element {
  const t = useTranslations("admin.products");
  const tCommon = useTranslations("admin.common");
  const isEditing = Boolean(initialData);

  const [newImageUrl, setNewImageUrl] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: "",
      titleUz: "",
      titleRu: "",
      titleEn: "",
      slug: "",
      descUz: "",
      descRu: "",
      descEn: "",
      dimensions: "",
      material: "",
      warranty: "",
      stockStatus: "IN_STOCK",
      images: [],
    },
  });

  const titleUzValue = watch("titleUz");
  const currentImages = watch("images") || [];
  const selectedCategoryId = watch("categoryId");
  const selectedStockStatus = watch("stockStatus");

  // Slug avtomatik generatsiya
  React.useEffect(() => {
    if (!isEditing && titleUzValue) {
      setValue("slug", slugify(titleUzValue), { shouldValidate: true });
    }
  }, [titleUzValue, isEditing, setValue]);

  // initialData o'zgarganda formani to'ldirish
  React.useEffect(() => {
    if (initialData) {
      reset({
        categoryId: initialData.categoryId,
        collectionId: initialData.collectionId,
        slug: initialData.slug,
        titleUz: initialData.titleUz,
        titleRu: initialData.titleRu,
        titleEn: initialData.titleEn,
        descUz: initialData.descUz || "",
        descRu: initialData.descRu || "",
        descEn: initialData.descEn || "",
        dimensions: initialData.dimensions || "",
        material: initialData.material || "",
        warranty: initialData.warranty || "",
        stockStatus: initialData.stockStatus,
        images: initialData.images || [],
      });
    } else {
      reset({
        categoryId: categories[0]?.id || "",
        slug: "",
        titleUz: "",
        titleRu: "",
        titleEn: "",
        descUz: "",
        descRu: "",
        descEn: "",
        dimensions: "",
        material: "",
        warranty: "",
        stockStatus: "IN_STOCK",
        images: [],
      });
    }
    setNewImageUrl("");
  }, [initialData, categories, reset]);

  const handleAddImage = (): void => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (currentImages.includes(trimmed)) {
      toast.error(t("imageAlreadyAdded"));
      return;
    }
    setValue("images", [...currentImages, trimmed], { shouldValidate: true });
    setNewImageUrl("");
  };

  const handleRemoveImage = (indexToRemove: number): void => {
    const filtered = currentImages.filter((_, idx) => idx !== indexToRemove);
    setValue("images", filtered, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormData): Promise<void> => {
    try {
      const url = isEditing && initialData
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
          {/* Kategoriya tanlash */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("category")} <span className="text-destructive">*</span>
            </label>
            <Select
              value={selectedCategoryId}
              onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameUz} ({cat.nameRu})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

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
                {t("titleRu")} <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("titleRu")}
                placeholder={t("placeholderTitleRu")}
                disabled={isSubmitting}
              />
              {errors.titleRu && (
                <p className="text-xs text-destructive">{errors.titleRu.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("titleEn")} <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("titleEn")}
                placeholder={t("placeholderTitleEn")}
                disabled={isSubmitting}
              />
              {errors.titleEn && (
                <p className="text-xs text-destructive">{errors.titleEn.message}</p>
              )}
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

          {/* Xususiyatlar: O'lcham, Material, Kafolat */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("dimensions")}
              </label>
              <Input
                {...register("dimensions")}
                placeholder={t("placeholderDimensions")}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("material")}
              </label>
              <Input
                {...register("material")}
                placeholder={t("placeholderMaterial")}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("warranty")}
              </label>
              <Input
                {...register("warranty")}
                placeholder={t("placeholderWarranty")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Stock holati */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("stockStatus")}
            </label>
            <Select
              value={selectedStockStatus}
              onValueChange={(val: "IN_STOCK" | "MADE_TO_ORDER") =>
                setValue("stockStatus", val, { shouldValidate: true })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_STOCK">{t("inStock")}</SelectItem>
                <SelectItem value="MADE_TO_ORDER">{t("madeToOrder")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rasm URL lari va Preview */}
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3.5">
            <label className="text-xs font-semibold text-foreground">
              {t("images")}
            </label>
            <p className="text-xs text-muted-foreground">{t("imageUploadHint")}</p>

            <div className="flex space-x-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder={t("imageAddPlaceholder")}
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddImage}
                disabled={isSubmitting || !newImageUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>{t("addImage")}</span>
              </Button>
            </div>

            {/* Rasm Preview galereyasi */}
            {currentImages.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {currentImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Preview ${index + 1}`}
                      width={120}
                      height={120}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      title={t("removeImage")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 py-2 text-xs text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>{t("noImages")}</span>
              </div>
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
