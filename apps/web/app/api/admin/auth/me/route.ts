import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: session.sub,
      name: session.name,
      username: session.username,
    },
  });
}
