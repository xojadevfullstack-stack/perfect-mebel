"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { CollectionGrid } from "@/components/admin/collection-grid";
import {
  CollectionFormDialog,
  type CollectionItem,
} from "@/components/admin/collection-form-dialog";
import { type ProductItem } from "@/components/admin/product-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function AdminCollectionsPage(): React.JSX.Element {
  const t = useTranslations("admin.collections");
  const tCommon = useTranslations("admin.common");

  const [collections, setCollections] = React.useState<CollectionItem[]>([]);
  const [availableProducts, setAvailableProducts] = React.useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Qidiruv
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");

  // Pagination
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const limit = 12;

  // Dialoglar
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [editingCollection, setEditingCollection] = React.useState<CollectionItem | null>(null);

  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Qidiruv debounce
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Mahsulotlarni yuklash (komplektga biriktirish uchun)
  const fetchAvailableProducts = React.useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/admin/products?limit=100");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAvailableProducts(json.data);
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    void fetchAvailableProducts();
  }, [fetchAvailableProducts]);

  // Komplektlarni yuklash
  const fetchCollections = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      const res = await fetch(`/api/admin/collections?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setCollections(json.data);
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
  }, [page, debouncedSearch, limit, tCommon]);

  React.useEffect(() => {
    void fetchCollections();
  }, [fetchCollections]);

  const handleOpenCreate = (): void => {
    setEditingCollection(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (collection: CollectionItem): Promise<void> => {
    // To'liq mahsulotlar ro'yxati bilan olish uchun ID bo'yicha fetch
    try {
      const res = await fetch(`/api/admin/collections/${collection.id}`);
      const json = await res.json();
      if (json.success) {
        setEditingCollection(json.data);
      } else {
        setEditingCollection(collection);
      }
    } catch {
      setEditingCollection(collection);
    }
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string): void => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteTargetId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/collections/${deleteTargetId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || tCommon("error"));
        return;
      }

      toast.success(t("deleteSuccess"));
      setDeleteTargetId(null);
      await fetchCollections();
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
                onClick={() => void fetchCollections()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                <span>{tCommon("refresh")}</span>
              </Button>
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                <span>{t("addNew")}</span>
              </Button>
            </div>
          </div>

          {/* Qidiruv Paneli */}
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
          </div>

          {/* Grid ro'yxat */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <CollectionGrid
              collections={collections}
              onEdit={(col) => void handleOpenEdit(col)}
              onDelete={handleOpenDelete}
            />
          )}

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <p>
                {tCommon("total")}: <span className="font-semibold text-foreground">{totalCount}</span> {t("totalCollections")}
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
      <CollectionFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => void fetchCollections()}
        initialData={editingCollection}
        availableProducts={availableProducts}
      />

      {/* O'chirishni tasdiqlash dialogi */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDesc")}
        isLoading={isDeleting}
      />
    </div>
  );
}
