import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import crypto from "crypto";
import { config } from "../config";

function isSupabaseConfigured(): boolean {
  return Boolean(
    config.supabaseUrl &&
    config.supabaseKey &&
    !config.supabaseUrl.includes("your-project.supabase.co") &&
    !config.supabaseKey.includes("your-key-here")
  );
}

function findWebUploadsDir(): string {
  const fromRoot = path.resolve(process.cwd(), "apps", "web", "public", "uploads");
  if (fsSync.existsSync(path.resolve(process.cwd(), "apps", "web"))) {
    return fromRoot;
  }
  return path.resolve(process.cwd(), "..", "web", "public", "uploads");
}

export async function uploadBufferToStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  const extension = path.extname(fileName) || ".jpg";
  const uniqueFileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;

  if (isSupabaseConfigured()) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(config.supabaseUrl, config.supabaseKey);

    const { data, error } = await supabase.storage
      .from("products")
      .upload(uniqueFileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase yuklash xatosi: ${error.message}`);
    }

    const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.path);
    return urlData.publicUrl;
  }

  // Production rejimida Supabase yo'q bo'lsa xato beramiz
  if (process.env["NODE_ENV"] === "production") {
    throw new Error(
      "Production muhitida Supabase Storage sozlanmagan. NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY kiritilishi shart."
    );
  }

  // Lokal development uchun fallback: web/public/uploads ga yozish
  const uploadsDir = findWebUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, uniqueFileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${uniqueFileName}`;
}
