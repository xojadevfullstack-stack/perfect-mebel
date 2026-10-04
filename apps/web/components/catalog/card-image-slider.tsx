"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bookmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardImageSliderProps {
  images: string[];
  title: string;
  href?: string;
  aspectRatio?: string; // e.g. "aspect-[4/5]" or "aspect-[16/10]"
  stockStatus?: "IN_STOCK" | "MADE_TO_ORDER";
  isInSelection?: boolean;
  onToggleSelection?: (e: React.MouseEvent) => void;
  priority?: boolean;
  className?: string;
}

export function CardImageSlider({
  images,
  title,
  href,
  aspectRatio = "aspect-[4/5]",
  isInSelection = false,
  onToggleSelection,
  priority = false,
  className,
}: CardImageSliderProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"];

  const hasMultiple = displayImages.length > 1;

  // Touch swipe support without scroll wheel hijacking
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaX = touchStartX.current - touch.clientX;
    const deltaY = touchStartY.current - touch.clientY;
    touchStartX.current = null;
    touchStartY.current = null;

    // Only swipe if horizontal movement is clearly dominant and > 30px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        // Next slide (wrap around)
        setActiveIndex((prev) => (prev + 1) % displayImages.length);
      } else {
        // Prev slide (wrap around)
        setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      }
    }
  };

  const scrollPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const scrollNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const scrollToSlide = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(index);
  };

  return (
    <div
      className={cn(
        "group/slider relative w-full overflow-hidden bg-muted select-none touch-pan-y",
        aspectRatio,
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Transform-based slider track: Silky smooth swipe/scroll */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-editorial will-change-transform"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {displayImages.map((src, idx) => (
          <div key={idx} className="relative h-full w-full shrink-0">
            {href ? (
              <Link href={href} className="block h-full w-full" tabIndex={-1}>
                <Image
                  src={src}
                  alt={`${title} - Rasm ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={priority && idx === 0}
                  loading={priority && idx === 0 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-1000 ease-editorial group-hover/slider:scale-[1.04]"
                />
              </Link>
            ) : (
              <Image
                src={src}
                alt={`${title} - Rasm ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority && idx === 0}
                loading={priority && idx === 0 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-1000 ease-editorial group-hover/slider:scale-[1.04]"
              />
            )}
          </div>
        ))}
      </div>

      {/* Bookmark Button (Top Right) */}
      {onToggleSelection && (
        <button
          type="button"
          onClick={onToggleSelection}
          title={isInSelection ? "Tanlovdan o'chirish" : "Tanlovga qo'shish"}
          aria-label={isInSelection ? "Tanlovdan o'chirish" : "Tanlovga qo'shish"}
          className={cn(
            "icon-button absolute right-3 top-3 sm:right-3.5 sm:top-3.5 z-10 h-9 w-9 bg-card text-foreground border border-border-strong shadow-whisper-md transition-all duration-300 ease-editorial hover:scale-105 active:scale-95",
            isInSelection && "border-primary bg-primary text-primary-foreground shadow-sm"
          )}
        >
          {isInSelection ? (
            <Check className="h-4 w-4 stroke-[2.5]" />
          ) : (
            <Bookmark className="h-4 w-4 text-foreground/85 hover:text-foreground" />
          )}
        </button>
      )}

      {/* Prev / Next Navigation Arrows (100% Solid & High-Contrast on Any Photo) */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Oldingi rasm"
            className={cn(
              "absolute left-2.5 top-1/2 -translate-y-1/2 z-20",
              "h-10 w-10 flex items-center justify-center",
              "rounded-none bg-card text-foreground border border-border-strong",
              "shadow-whisper-md transition-all duration-300 ease-editorial",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-1 focus:ring-primary"
            )}
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.75]" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Keyingi rasm"
            className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2 z-20",
              "h-10 w-10 flex items-center justify-center",
              "rounded-none bg-card text-foreground border border-border-strong",
              "shadow-whisper-md transition-all duration-300 ease-editorial",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-1 focus:ring-primary"
            )}
          >
            <ChevronRight className="h-5 w-5 stroke-[2.75]" />
          </button>
        </>
      )}

      {/* Subtle Hairline Pagination Indicator Dots */}
      {hasMultiple && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 pointer-events-none">
          {displayImages.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-0.5 rounded-none transition-all duration-500 ease-editorial drop-shadow",
                idx === activeIndex
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-foreground opacity-40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
