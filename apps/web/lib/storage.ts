import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function uploadImageFile(file: File): Promise<{ url: string }> {
  if (!file) {
    throw new Error("Fayl tanlanmagan");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
    throw new Error("Faqat rasm fayllari (JPG, PNG, WebP, GIF) qabul qilinadi");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Rasm hajmi 5MB dan oshmasligi kerak");
  }

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || process.env["SUPABASE_SERVICE_ROLE_KEY"];

  // 1. Agar Supabase to'g'ri sozlangan bo'lsa
  if (
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("your-project.supabase.co") &&
    !supabaseKey.includes("your-key-here")
  ) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const extension = path.extname(file.name) || ".webp";
      const uniqueFileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { data, error } = await supabase.storage
        .from("products")
        .upload(uniqueFileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        throw new Error(`Supabase yuklash xatosi: ${error.message}`);
      }

      const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.path);
      return { url: urlData.publicUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Supabase storage xatosi";
      process.stderr.write(`Supabase upload error, falling back to local: ${message}\n`);
    }
  }

  // 2. Lokal saqlash (development va mustaqil ishlash uchun)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.name) || ".webp";
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const filePath = path.join(uploadsDir, uniqueName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  return { url: `/uploads/${uniqueName}` };
}
