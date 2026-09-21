import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  if (!text) return "";

  const normalized = text
    .toString()
    .replace(/[oO]['`ʻ’]/g, "o")
    .replace(/[gG]['`ʻ’]/g, "g")
    .replace(/ў/g, "o")
    .replace(/Ў/g, "o")
    .replace(/ғ/g, "g")
    .replace(/Ғ/g, "g")
    .replace(/қ/g, "q")
    .replace(/Қ/g, "q")
    .replace(/ҳ/g, "h")
    .replace(/Ҳ/g, "h");

  return slugifyLib(normalized, {
    lower: true,
    strict: true,
    trim: true,
  });
}
