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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Globe, Bot, Loader2, Inbox } from "lucide-react";
import { type LeadItem } from "./lead-detail-dialog";

interface LeadTableProps {
  leads: LeadItem[];
  isLoading: boolean;
  onViewDetails: (lead: LeadItem) => void;
}

export function LeadTable({
  leads,
  isLoading,
  onViewDetails,
}: LeadTableProps): React.JSX.Element {
  const t = useTranslations("admin.leads");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center bg-card">
        <Inbox className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-3 text-base font-semibold text-foreground">{t("empty")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[140px]">{t("date")}</TableHead>
            <TableHead>{t("customerName")}</TableHead>
            <TableHead>{t("phone")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("address")}</TableHead>
            <TableHead>{t("source")}</TableHead>
            <TableHead className="hidden lg:table-cell max-w-[220px]">{t("itemsSummary")}</TableHead>
            <TableHead className="w-[80px] text-right">{t("viewDetails")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const formattedDate = new Date(lead.createdAt).toLocaleDateString("uz-UZ", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => onViewDetails(lead)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {formattedDate}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {lead.customerName}
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-primary hover:underline text-xs sm:text-sm"
                  >
                    {lead.phone}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                  {lead.address || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={lead.source === "WEB" ? "default" : "secondary"}
                    className="text-[11px]"
                  >
                    {lead.source === "WEB" ? (
                      <Globe className="h-3 w-3 mr-1" />
                    ) : (
                      <Bot className="h-3 w-3 mr-1" />
                    )}
                    {lead.source === "WEB" ? t("sourceWeb") : t("sourceBot")}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground line-clamp-1 max-w-[220px]">
                  {lead.itemsSummary}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(lead);
                    }}
                    title={t("viewDetails")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
