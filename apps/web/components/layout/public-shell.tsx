"use client";

import * as React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { FloatingSelectionsWidget } from "@/components/selections/floating-selections-widget";
import { Toaster } from "sonner";

interface PublicShellProps {
  children: React.ReactNode;
}

export function PublicShell({ children }: PublicShellProps): React.JSX.Element {
  const [selectionsOpen, setSelectionsOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header onOpenSelections={() => setSelectionsOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSelectionsWidget
        externalOpen={selectionsOpen}
        onExternalOpenChange={setSelectionsOpen}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}
