import { z } from "zod";

export const productSchema = z.object({
  categoryId: z.string().uuid("Kategoriya tanlanishi shart"),
  collectionId: z.string().uuid("Kolleksiya formati noto'g'ri").nullable().optional(),
  slug: z
    .string()
    .max(150, "Slug 150 belgidan oshmasligi kerak")
    .regex(/^[a-z0-9-]*$/, "Slug faqat kichik lotin harflari, sonlar va defisdan iborat bo'lishi kerak")
    .optional()
    .or(z.literal("")),
  titleUz: z.string().min(1, "O'zbekcha sarlavha kiritilishi shart").max(200, "Sarlavha 200 belgidan oshmasligi kerak"),
  titleRu: z.string().min(1, "Ruscha sarlavha kiritilishi shart").max(200, "Sarlavha 200 belgidan oshmasligi kerak"),
  titleEn: z.string().min(1, "Inglizcha sarlavha kiritilishi shart").max(200, "Sarlavha 200 belgidan oshmasligi kerak"),
  descUz: z.string().nullable().optional().or(z.literal("")),
  descRu: z.string().nullable().optional().or(z.literal("")),
  descEn: z.string().nullable().optional().or(z.literal("")),
  dimensions: z.string().max(100, "O'lcham 100 belgidan oshmasligi kerak").nullable().optional().or(z.literal("")),
  material: z.string().max(150, "Material 150 belgidan oshmasligi kerak").nullable().optional().or(z.literal("")),
  warranty: z.string().max(50, "Kafolat 50 belgidan oshmasligi kerak").nullable().optional().or(z.literal("")),
  stockStatus: z.enum(["IN_STOCK", "MADE_TO_ORDER"]),
  images: z.array(z.string().min(1, "Rasm manzili bo'sh bo'lishi mumkin emas")),
});

export const updateProductSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
