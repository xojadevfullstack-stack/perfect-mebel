"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type CategoryItem } from "./category-form-dialog";
import { Edit, Trash2 } from "lucide-react";

interface CategoryTableProps {
  categories: CategoryItem[];
  isLoading: boolean;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

export function CategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoryTableProps): React.JSX.Element {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("admin.common");

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>{tCommon("loading")}</span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40 text-xs uppercase font-semibold">
          <TableRow>
            <TableHead className="w-16 text-center">{t("order")}</TableHead>
            <TableHead>{t("nameUz")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("nameRu")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("nameEn")}</TableHead>
            <TableHead className="hidden lg:table-cell">{t("slug")}</TableHead>
            <TableHead className="text-center">{t("productsCount")}</TableHead>
            <TableHead className="w-28 text-right">{tCommon("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border text-foreground text-sm">
          {categories.map((cat) => (
            <TableRow key={cat.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                {cat.order}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {cat.nameUz}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {cat.nameRu}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {cat.nameEn}
              </TableCell>
              <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                {cat.slug}
              </TableCell>
              <TableCell className="text-center font-medium">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {cat._count?.products ?? 0} {tCommon("unitItem")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(cat)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title={tCommon("edit")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(cat)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    title={tCommon("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
