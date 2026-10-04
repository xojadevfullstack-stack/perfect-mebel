"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mark" | "compact";
  subtitle?: string;
  showSubtitle?: boolean;
  inverted?: boolean;
  className?: string;
}

/**
 * Official Brand Emblem for Perfect Mebel
 * Uses the user's official transparent logo: /logo_nobg_img.png
 */
export function BrandEmblem({
  className = "h-10 w-10",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}): React.JSX.Element {
  return (
    <div className={cn("relative shrink-0 transition-transform duration-300 group-hover:scale-105", className)}>
      <Image
        src="/logo_nobg_img.png"
        alt="Perfect Mebel"
        fill
        sizes="48px"
        className={cn(
          "object-contain transition-all",
          inverted
            ? "brightness-0 invert opacity-90"
            : "dark:brightness-0 dark:invert dark:opacity-90"
        )}
        priority
      />
    </div>
  );
}

export function BrandLogo({
  size = "md",
  variant = "full",
  subtitle = "Atelier Vitrinasi",
  showSubtitle = true,
  inverted = false,
  className,
}: BrandLogoProps): React.JSX.Element {
  const sizeMap = {
    sm: {
      emblem: "h-7 w-7 sm:h-8 sm:w-8",
      title: "text-sm sm:text-base tracking-[0.08em] sm:tracking-[0.1em]",
      subtitle: "text-[7px] sm:text-[7.5px] tracking-[0.2em] sm:tracking-[0.24em] mt-0.5",
      gap: "gap-2 sm:gap-2.5",
    },
    md: {
      emblem: "h-8 w-8 sm:h-10 sm:w-10",
      title: "text-base sm:text-xl tracking-[0.09em] sm:tracking-[0.12em]",
      subtitle: "text-[7.5px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.26em] mt-0.5 sm:mt-1",
      gap: "gap-2 sm:gap-3",
    },
    lg: {
      emblem: "h-11 w-11 sm:h-13 sm:w-13",
      title: "text-lg sm:text-2xl tracking-[0.12em] sm:tracking-[0.14em]",
      subtitle: "text-[8.5px] sm:text-[10px] tracking-[0.24em] sm:tracking-[0.28em] mt-1 sm:mt-1.5",
      gap: "gap-3 sm:gap-3.5",
    },
  };

  const currentSize = sizeMap[size];

  if (variant === "mark") {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <BrandEmblem className={currentSize.emblem} inverted={inverted} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group inline-flex items-center select-none",
        currentSize.gap,
        className
      )}
    >
      <BrandEmblem className={currentSize.emblem} inverted={inverted} />

      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif font-bold uppercase leading-none transition-colors",
            inverted ? "text-footer-foreground" : "text-foreground",
            currentSize.title
          )}
        >
          Perfect Mebel
        </span>

        {showSubtitle && variant === "full" && (
          <span
            className={cn(
              "font-sans uppercase font-semibold leading-none",
              inverted ? "text-footer-muted" : "text-muted-foreground",
              currentSize.subtitle
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
