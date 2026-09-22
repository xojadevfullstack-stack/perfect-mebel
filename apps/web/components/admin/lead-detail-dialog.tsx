"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Calendar, FileText, Globe, Bot, Navigation } from "lucide-react";

export interface LeadItem {
  id: string;
  customerName: string;
  phone: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  telegramId?: string | null;
  source: "WEB" | "BOT";
  itemsSummary: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadDetailDialogProps {
  lead: LeadItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailDialog({
  lead,
  isOpen,
  onClose,
}: LeadDetailDialogProps): React.JSX.Element {
  const t = useTranslations("admin.leads");

  if (!lead) return <React.Fragment />;

  const formattedDate = new Date(lead.createdAt).toLocaleString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <DialogTitle>{t("detailsTitle")}</DialogTitle>
            <Badge variant={lead.source === "WEB" ? "default" : "secondary"}>
              {lead.source === "WEB" ? (
                <Globe className="h-3 w-3 mr-1" />
              ) : (
                <Bot className="h-3 w-3 mr-1" />
              )}
              {lead.source === "WEB" ? t("sourceWeb") : t("sourceBot")}
            </Badge>
          </div>
          <DialogDescription>{t("detailsSubtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Mijoz ismi */}
          <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/20 p-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground">{t("customerName")}</span>
              <p className="text-sm font-semibold text-foreground">{lead.customerName}</p>
            </div>
          </div>

          {/* Telefon */}
          <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/20 p-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground">{t("phone")}</span>
              <p className="text-sm font-semibold text-foreground">
                <a href={`tel:${lead.phone}`} className="hover:underline text-primary">
                  {lead.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Manzil */}
          <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/20 p-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground">{t("address")}</span>
              <p className="text-sm text-foreground">
                {lead.address || <span className="text-muted-foreground italic">{t("notSpecified")}</span>}
              </p>
              {lead.latitude && lead.longitude && (
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3 mr-1" />
                  {t("location")}: {lead.latitude}, {lead.longitude}
                </p>
              )}
            </div>
          </div>

          {/* Tanlangan mebellar */}
          <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/20 p-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="w-full">
              <span className="text-xs text-muted-foreground">{t("itemsSummary")}</span>
              <p className="text-sm font-medium text-foreground whitespace-pre-wrap mt-0.5">
                {lead.itemsSummary}
              </p>
            </div>
          </div>

          {/* Izoh */}
          {lead.notes && (
            <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/20 p-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground">{t("notes")}</span>
                <p className="text-sm text-foreground whitespace-pre-wrap">{lead.notes}</p>
              </div>
            </div>
          )}

          {/* Telegram ID (agar bor bo'lsa) */}
          {lead.telegramId && (
            <div className="flex items-start space-x-3 rounded-lg border border-border bg-muted/20 p-3">
              <Bot className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground">{t("telegramId")}</span>
                <p className="text-sm font-mono text-foreground">{lead.telegramId}</p>
              </div>
            </div>
          )}

          {/* Sana */}
          <div className="flex items-center space-x-2 px-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{t("date")}: {formattedDate}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
