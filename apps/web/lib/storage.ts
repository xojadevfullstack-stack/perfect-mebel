import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function uploadImageFile(file: File): Promise<{ url: string }> {
  if (!file) {
    throw new Error("Fayl tanlanmagan");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Faqat rasm fayllari (JPG, PNG, WebP, GIF) qabul qilinadi");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Rasm hajmi 5MB dan oshmasligi kerak");
  }

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const serviceKey =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (supabaseUrl && serviceKey) {
    try {
      const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : file.type === "image/jpeg" ? ".jpg" : ".webp");
      const uniqueFileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadUrl = `${supabaseUrl}/storage/v1/object/products/${uniqueFileName}`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": file.type,
        },
        body: buffer,
      });

      if (uploadRes.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${uniqueFileName}`;
        return { url: publicUrl };
      }

      const errorText = await uploadRes.text();
      console.error("Supabase Storage upload error:", uploadRes.status, errorText);
      throw new Error(`Supabase yuklash xatosi (${uploadRes.status}): ${errorText}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Supabase storage xatosi";
      if (process.env["NODE_ENV"] === "production") {
        throw new Error(message);
      }
      console.warn("Supabase upload failed, falling back to local:", message);
    }
  }

  // Fallback faqat lokal development uchun
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".webp";
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  const bytes = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(bytes));

  return { url: `/uploads/${uniqueName}` };
}
