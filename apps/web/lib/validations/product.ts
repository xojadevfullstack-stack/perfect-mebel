import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.string().uuid("Kategoriya ID to'g'ri UUID formatda bo'lishi shart"),
  collectionId: z.string().uuid("Kolleksiya ID to'g'ri UUID formatda bo'lishi shart").nullable().optional(),
  slug: z
    .string()
    .min(1, "Slug kiritilishi shart")
    .regex(/^[a-z0-9-]+$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional(),
  titleUz: z.string().min(1, "O'zbekcha sarlavha kiritilishi shart"),
  titleRu: z.string().min(1, "Ruscha sarlavha kiritilishi shart"),
  titleEn: z.string().min(1, "Inglizcha sarlavha kiritilishi shart"),
  descUz: z.string().nullable().optional(),
  descRu: z.string().nullable().optional(),
  descEn: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  warranty: z.string().nullable().optional(),
  stockStatus: z.enum(["IN_STOCK", "MADE_TO_ORDER"]).optional().default("IN_STOCK"),
  images: z.array(z.string().min(1, "Rasm manzili bo'sh bo'lishi mumkin emas")).optional().default([]),
});

export const updateProductSchema = z.object({
  categoryId: z.string().uuid("Kategoriya ID to'g'ri UUID formatda bo'lishi shart").optional(),
  collectionId: z.string().uuid("Kolleksiya ID to'g'ri UUID formatda bo'lishi shart").nullable().optional(),
  slug: z
    .string()
    .min(1, "Slug bo'sh bo'lishi mumkin emas")
    .regex(/^[a-z0-9-]+$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional(),
  titleUz: z.string().min(1, "O'zbekcha sarlavha bo'sh bo'lishi mumkin emas").optional(),
  titleRu: z.string().min(1, "Ruscha sarlavha bo'sh bo'lishi mumkin emas").optional(),
  titleEn: z.string().min(1, "Inglizcha sarlavha bo'sh bo'lishi mumkin emas").optional(),
  descUz: z.string().nullable().optional(),
  descRu: z.string().nullable().optional(),
  descEn: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  warranty: z.string().nullable().optional(),
  stockStatus: z.enum(["IN_STOCK", "MADE_TO_ORDER"]).optional(),
  images: z.array(z.string().min(1)).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
