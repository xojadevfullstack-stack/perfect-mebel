"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle(): React.JSX.Element {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-none border border-border bg-card p-2 text-foreground opacity-50 shadow-sm"
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-none border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform hover:rotate-45 text-warning" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:-rotate-12 text-primary" />
      )}
    </button>
  );
}
