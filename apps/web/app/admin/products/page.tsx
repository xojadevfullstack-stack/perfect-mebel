"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductTable } from "@/components/admin/product-table";
import {
  ProductFormDialog,
  type ProductItem,
} from "@/components/admin/product-form-dialog";
import { type CategoryItem } from "@/components/admin/category-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminProductsPage(): React.JSX.Element {
  const t = useTranslations("admin.products");
  const tCommon = useTranslations("admin.common");

  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Filtrlash va qidiruv
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Pagination
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const limit = 15;

  // Dialoglar
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Qidiruv debounce (300ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Kategoriyalarni yuklash
  const fetchCategories = React.useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/admin/categories?limit=100");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch {
      // categories error fallback
    }
  }, []);

  React.useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  // Mahsulotlarni yuklash
  const fetchProducts = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if (selectedCategory && selectedCategory !== "all") {
        params.set("categoryId", selectedCategory);
      }

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
        if (json.meta) {
          setTotalCount(json.meta.total);
          setTotalPages(Math.max(1, Math.ceil(json.meta.total / limit)));
        }
      } else {
        toast.error(json.error || tCommon("error"));
      }
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, selectedCategory, limit, tCommon]);

  React.useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleOpenCreate = (): void => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: ProductItem): void => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (product: ProductItem): void => {
    setDeleteTarget(product);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || tCommon("error"));
        return;
      }

      toast.success(t("deleteSuccess"));
      setDeleteTarget(null);
      await fetchProducts();
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
          {/* Sahifa bosh qismi */}
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
                onClick={() => void fetchProducts()}
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

          {/* Qidiruv va Toifa Filter Paneli */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="pl-9"
              />
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {t("filterByCategory")}:
              </span>
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories")}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nameUz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mebellar jadvali */}
          <ProductTable
            products={products}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <p>
                {tCommon("total")}: <span className="font-semibold text-foreground">{totalCount}</span> ta mebel
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="font-medium text-foreground">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Qo'shish / Tahrirlash modali */}
      <ProductFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => void fetchProducts()}
        initialData={editingProduct}
        categories={categories}
      />

      {/* O'chirishni tasdiqlash dialogi */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDesc")}
        isLoading={isDeleting}
      />
    </div>
  );
}
