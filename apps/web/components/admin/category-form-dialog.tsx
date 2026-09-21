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
import { categorySchema, type CategoryFormData } from "@/lib/schemas/category";
import { slugify } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface CategoryItem {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  order: number;
  _count?: {
    products: number;
  };
}

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CategoryItem | null;
}

export function CategoryFormDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CategoryFormDialogProps): React.JSX.Element {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("admin.common");
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameUz: "",
      nameRu: "",
      nameEn: "",
      slug: "",
      order: 0,
    },
  });

  const nameUzValue = watch("nameUz");

  // Yangi kategoriya kiritilganda slug ni avtomatik yaratish (agar qo'lda o'zgartirilmagan bo'lsa)
  React.useEffect(() => {
    if (!isEditing && nameUzValue) {
      setValue("slug", slugify(nameUzValue), { shouldValidate: true });
    }
  }, [nameUzValue, isEditing, setValue]);

  // initialData o'zgarganda formani to'ldirish
  React.useEffect(() => {
    if (initialData) {
      reset({
        nameUz: initialData.nameUz,
        nameRu: initialData.nameRu,
        nameEn: initialData.nameEn,
        slug: initialData.slug,
        order: initialData.order,
      });
    } else {
      reset({
        nameUz: "",
        nameRu: "",
        nameEn: "",
        slug: "",
        order: 0,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CategoryFormData): Promise<void> => {
    try {
      const url = isEditing && initialData
        ? `/api/admin/categories/${initialData.id}`
        : "/api/admin/categories";
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("edit") : t("addNew")}</DialogTitle>
          <DialogDescription>
            {isEditing ? t("subtitle") : t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* nameUz */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("nameUz")} <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("nameUz")}
              placeholder="Masalan: Divanlar"
              disabled={isSubmitting}
            />
            {errors.nameUz && (
              <p className="text-xs text-destructive">{errors.nameUz.message}</p>
            )}
          </div>

          {/* nameRu */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("nameRu")} <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("nameRu")}
              placeholder="Например: Диваны"
              disabled={isSubmitting}
            />
            {errors.nameRu && (
              <p className="text-xs text-destructive">{errors.nameRu.message}</p>
            )}
          </div>

          {/* nameEn */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("nameEn")} <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("nameEn")}
              placeholder="Example: Sofas"
              disabled={isSubmitting}
            />
            {errors.nameEn && (
              <p className="text-xs text-destructive">{errors.nameEn.message}</p>
            )}
          </div>

          {/* slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("slug")}
            </label>
            <Input
              {...register("slug")}
              placeholder="divanlar"
              disabled={isSubmitting}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* order */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("order")}
            </label>
            <Input
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="1"
              disabled={isSubmitting}
            />
            {errors.order && (
              <p className="text-xs text-destructive">{errors.order.message}</p>
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
