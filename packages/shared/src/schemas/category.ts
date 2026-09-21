import { z } from "zod";

export const categorySchema = z.object({
  nameUz: z.string().min(1, "O'zbekcha nom kiritilishi shart").max(100, "Nom 100 belgidan oshmasligi kerak"),
  nameRu: z.string().max(100, "Nom 100 belgidan oshmasligi kerak").optional().or(z.literal("")),
  nameEn: z.string().max(100, "Nom 100 belgidan oshmasligi kerak").optional().or(z.literal("")),
  slug: z
    .string()
    .max(100, "Slug 100 belgidan oshmasligi kerak")
    .regex(/^[a-z0-9-]*$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional()
    .or(z.literal("")),
  order: z.coerce.number().int("Tartib raqami butun son bo'lishi kerak"),
});

export const updateCategorySchema = categorySchema.partial();

export type CategoryFormData = z.infer<typeof categorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
