"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { LeadTable } from "@/components/admin/lead-table";
import {
  LeadDetailDialog,
  type LeadItem,
} from "@/components/admin/lead-detail-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLeadsPage(): React.JSX.Element {
  const t = useTranslations("admin.leads");
  const tCommon = useTranslations("admin.common");

  const [leads, setLeads] = React.useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Filtrlash va qidiruv
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");
  const [sourceFilter, setSourceFilter] = React.useState<string>("all");

  // Pagination
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const limit = 20;

  // Tafsilot modali
  const [selectedLead, setSelectedLead] = React.useState<LeadItem | null>(null);

  // Qidiruv debounce (300ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Arizalarni yuklash
  const fetchLeads = React.useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }

      if (sourceFilter && sourceFilter !== "all") {
        params.set("source", sourceFilter);
      }

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setLeads(json.data);
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
  }, [page, debouncedSearch, sourceFilter, limit, tCommon]);

  React.useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

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
                onClick={() => void fetchLeads()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                <span>{tCommon("refresh")}</span>
              </Button>
            </div>
          </div>

          {/* Qidiruv va Manba Filter Paneli */}
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
                {t("filterBySource")}:
              </span>
              <Select
                value={sourceFilter}
                onValueChange={(val) => {
                  setSourceFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("allSources")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allSources")}</SelectItem>
                  <SelectItem value="WEB">{t("sourceWeb")}</SelectItem>
                  <SelectItem value="BOT">{t("sourceBot")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Arizalar jadvali */}
          <LeadTable
            leads={leads}
            isLoading={isLoading}
            onViewDetails={(lead) => setSelectedLead(lead)}
          />

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <p>
                {tCommon("total")}: <span className="font-semibold text-foreground">{totalCount}</span> ta ariza
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

      {/* Ariza tafsilotlari dialogi */}
      <LeadDetailDialog
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
