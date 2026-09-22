import { z } from "zod";

export const leadSchema = z.object({
  customerName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak").max(100, "Ism 100 belgidan oshmasligi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri").max(20, "Telefon raqami 20 belgidan oshmasligi kerak"),
  address: z.string().max(300, "Manzil 300 belgidan oshmasligi kerak").optional().nullable().or(z.literal("")),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  notes: z.string().max(500, "Izoh 500 belgidan oshmasligi kerak").optional().nullable().or(z.literal("")),
  telegramId: z.string().optional().nullable().or(z.literal("")),
  source: z.enum(["WEB", "BOT"]).default("WEB"),
  itemsSummary: z.string().min(1, "Tanlangan mebellar ro'yxati ko'rsatilishi shart"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
