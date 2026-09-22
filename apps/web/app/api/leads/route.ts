import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { leadSchema } from "@mebel-salon/shared";
import { sendLeadTelegramNotification } from "@/lib/telegram/channel-notify";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        notes: data.notes || null,
        telegramId: data.telegramId || null,
        source: "WEB",
        itemsSummary: data.itemsSummary,
      },
    });

    // Telegram zavod kanaliga bildirishnoma jo'natish (fon rejimida)
    void sendLeadTelegramNotification({
      customerName: lead.customerName,
      phone: lead.phone,
      address: lead.address,
      notes: lead.notes,
      itemsSummary: lead.itemsSummary,
      source: "WEB",
      createdAt: lead.createdAt,
    });

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
