import { z } from "zod";

export const collectionSchema = z.object({
  slug: z
    .string()
    .max(150, "Slug 150 belgidan oshmasligi kerak")
    .regex(/^[a-z0-9-]*$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional()
    .or(z.literal("")),
  titleUz: z.string().min(1, "O'zbekcha sarlavha kiritilishi shart").max(200, "Sarlavha 200 belgidan oshmasligi kerak"),
  titleRu: z.string().max(200, "Sarlavha 200 belgidan oshmasligi kerak").optional().or(z.literal("")),
  titleEn: z.string().max(200, "Sarlavha 200 belgidan oshmasligi kerak").optional().or(z.literal("")),
  descUz: z.string().nullable().optional().or(z.literal("")),
  descRu: z.string().nullable().optional().or(z.literal("")),
  descEn: z.string().nullable().optional().or(z.literal("")),
  images: z.array(z.string().min(1, "Rasm manzili bo'sh bo'lishi mumkin emas")),
  productIds: z.array(z.string().uuid("Mahsulot identifikatori noto'g'ri")).optional(),
});

export const updateCollectionSchema = collectionSchema.partial();

export const attachProductsSchema = z.object({
  productIds: z.array(z.string().uuid("Mahsulot identifikatori noto'g'ri")),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
export type UpdateCollectionFormData = z.infer<typeof updateCollectionSchema>;
export type AttachProductsData = z.infer<typeof attachProductsSchema>;
