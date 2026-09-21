import { z } from "zod";

export const createCategorySchema = z.object({
  nameUz: z.string().min(1, "O'zbekcha nom kiritilishi shart"),
  nameRu: z.string().min(1, "Ruscha nom kiritilishi shart"),
  nameEn: z.string().min(1, "Inglizcha nom kiritilishi shart"),
  slug: z
    .string()
    .min(1, "Slug kiritilishi shart")
    .regex(/^[a-z0-9-]+$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional(),
  order: z.number().int().optional().default(0),
});

export const updateCategorySchema = z.object({
  nameUz: z.string().min(1, "O'zbekcha nom bo'sh bo'lishi mumkin emas").optional(),
  nameRu: z.string().min(1, "Ruscha nom bo'sh bo'lishi mumkin emas").optional(),
  nameEn: z.string().min(1, "Inglizcha nom bo'sh bo'lishi mumkin emas").optional(),
  slug: z
    .string()
    .min(1, "Slug bo'sh bo'lishi mumkin emas")
    .regex(/^[a-z0-9-]+$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional(),
  order: z.number().int().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
