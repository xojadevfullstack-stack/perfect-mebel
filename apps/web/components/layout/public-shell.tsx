"use client";

import * as React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { FloatingSelectionsWidget } from "@/components/selections/floating-selections-widget";
import { LeadModal } from "@/components/lead/lead-modal";
import { Toaster } from "sonner";

interface PublicShellProps {
  children: React.ReactNode;
}

export function PublicShell({ children }: PublicShellProps): React.JSX.Element {
  const [selectionsOpen, setSelectionsOpen] = React.useState(false);
  const [inquiryOpen, setInquiryOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground w-full">
      <Header
        onOpenSelections={() => setSelectionsOpen(true)}
        onOpenInquiry={() => setInquiryOpen(true)}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSelectionsWidget
        externalOpen={selectionsOpen}
        onExternalOpenChange={setSelectionsOpen}
      />
      <LeadModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        customItemsSummary="Umumiy arxitektura va mebel maslahati"
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}
