import { NextResponse } from "next/server";
import { prisma, type LeadSource } from "@mebel-salon/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim();
    const source = searchParams.get("source")?.toUpperCase();

    const where: {
      source?: LeadSource;
      OR?: Array<{
        customerName?: { contains: string; mode: "insensitive" };
        phone?: { contains: string; mode: "insensitive" };
        address?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (source === "WEB" || source === "BOT") {
      where.source = source as LeadSource;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      meta: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
