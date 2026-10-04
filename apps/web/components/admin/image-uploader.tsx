"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImagePlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 10,
}: ImageUploaderProps): React.JSX.Element {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} tagacha rasm yuklash mumkin`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: Faqat rasm fayllari ruxsat etilgan`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: Rasm hajmi 5MB dan oshmasligi kerak`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          toast.error(json.error || `${file.name} ni yuklab bo'lmadi`);
        } else {
          uploadedUrls.push(json.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} ta rasm muvaffaqiyatli yuklandi`);
      }
    } catch {
      toast.error("Rasm yuklashda kutilmagan xatolik yuz berdi");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const cover = images[index];
    if (!cover) return;
    const rest = images.filter((_, i) => i !== index);
    onChange([cover, ...rest]);
    toast.success("Asosiy (muqova) rasm o'zgartirildi");
  };

  return (
    <div className="space-y-4">
      {/* Upload button area */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || images.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || images.length >= maxFiles}
          className="flex items-center gap-2 border-dashed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Yuklanmoqda...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Rasm yuklash (maks 5MB)</span>
            </>
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          {images.length} / {maxFiles} ta rasm (birinchi rasm muqova hisoblanadi)
        </span>
      </div>

      {/* Thumbnails grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/40 shadow-sm"
            >
              <Image
                src={url}
                alt={`Uploaded image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                unoptimized={url.startsWith("/uploads")}
              />

              {/* Cover badge */}
              {idx === 0 && (
                <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Asosiy</span>
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-footer/60 backdrop-blur-[2px] opacity-0 transition-opacity group-hover:opacity-100">
                {idx !== 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleSetCover(idx)}
                    title="Asosiy rasm qilish"
                  >
                    Asosiy
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="h-7 w-7 p-0"
                  onClick={() => handleRemove(idx)}
                  title="O'chirish"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-6 text-center text-muted-foreground">
          <ImagePlus className="h-8 w-8 stroke-1 text-muted-foreground/60" />
          <p className="mt-2 text-xs">Hech qanday rasm yuklanmagan</p>
        </div>
      )}
    </div>
  );
}
