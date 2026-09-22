import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadImageFile } from "@/lib/storage";

export async function POST(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Fayl yuklanmadi yoki form-data dagi 'file' maydoni bo'sh" },
        { status: 400 }
      );
    }

    const result = await uploadImageFile(file);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rasm yuklashda xatolik yuz berdi";
    const status = message.includes("Production") || message.includes("Supabase") ? 500 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
