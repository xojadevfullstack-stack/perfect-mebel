"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryTable } from "@/components/admin/category-table";
import {
  CategoryFormDialog,
  type CategoryItem,
} from "@/components/admin/category-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function AdminCategoriesPage(): React.JSX.Element {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("admin.common");

  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const fetchCategories = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories?limit=100");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      } else {
        toast.error(json.error || tCommon("error"));
      }
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsLoading(false);
    }
  }, [tCommon]);

  React.useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = (): void => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem): void => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category: CategoryItem): void => {
    setDeleteTarget(category);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || tCommon("error"));
        return;
      }

      toast.success(t("deleteSuccess"));
      setDeleteTarget(null);
      await fetchCategories();
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Sahifa bosh qismi: sarlavha va tugmalar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void fetchCategories()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                <span>{tCommon("loading") === "Yuklanmoqda..." ? "Yangilash" : "Refresh"}</span>
              </Button>
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                <span>{t("addNew")}</span>
              </Button>
            </div>
          </div>

          {/* Kategoriyalar jadvali */}
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        </div>
      </main>

      {/* Qo'shish / Tahrirlash modali */}
      <CategoryFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => void fetchCategories()}
        initialData={editingCategory}
      />

      {/* O'chirishni tasdiqlash dialogi */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={t("deleteConfirmTitle")}
        description={
          deleteTarget?._count && deleteTarget._count.products > 0
            ? t("deleteErrorHasProducts")
            : t("deleteConfirmDesc")
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
