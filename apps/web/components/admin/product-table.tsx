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
import { Badge } from "@/components/ui/badge";
import { type ProductItem } from "./product-form-dialog";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";

interface ProductTableProps {
  products: ProductItem[];
  isLoading: boolean;
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
}

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps): React.JSX.Element {
  const t = useTranslations("admin.products");
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

  if (products.length === 0) {
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
            <TableHead className="w-16">{t("image")}</TableHead>
            <TableHead>{t("titleUz")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("category")}</TableHead>
            <TableHead className="text-center">{t("stockStatus")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("dimensions")}</TableHead>
            <TableHead className="w-28 text-right">{tCommon("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border text-foreground text-sm">
          {products.map((product) => {
            const firstImage = product.images?.[0];
            return (
              <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="h-12 w-12 overflow-hidden rounded-md border border-border bg-muted flex items-center justify-center">
                    {firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={firstImage}
                        alt={product.titleUz}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground opacity-50" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">{product.titleUz}</p>
                    <p className="font-mono text-xs text-muted-foreground">{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {product.category?.nameUz || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {product.stockStatus === "IN_STOCK" ? (
                    <Badge variant="success">{t("inStock")}</Badge>
                  ) : (
                    <Badge variant="warning">{t("madeToOrder")}</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {product.dimensions || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title={tCommon("edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title={tCommon("delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
