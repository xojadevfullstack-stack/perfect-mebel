import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPassword = process.env["ADMIN_INITIAL_PASSWORD"];
  if (!adminPassword) {
    throw new Error("ADMIN_INITIAL_PASSWORD muhit o'zgaruvchisi kiritilishi shart!");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Tizim Administratori",
    },
  });

  const categories = [
    {
      slug: "divanlar",
      nameUz: "Divanlar",
      nameRu: "Диваны",
      nameEn: "Sofas",
      order: 1,
    },
    {
      slug: "krovatlar",
      nameUz: "Krovatlar",
      nameRu: "Кровати",
      nameEn: "Beds",
      order: 2,
    },
    {
      slug: "shkaflar",
      nameUz: "Shkaflar",
      nameRu: "Шкафы",
      nameEn: "Wardrobes",
      order: 3,
    },
    {
      slug: "stollar",
      nameUz: "Stollar",
      nameRu: "Столы",
      nameEn: "Tables",
      order: 4,
    },
    {
      slug: "stullar",
      nameUz: "Stullar",
      nameRu: "Стулья",
      nameEn: "Chairs",
      order: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        nameUz: cat.nameUz,
        nameRu: cat.nameRu,
        nameEn: cat.nameEn,
        order: cat.order,
      },
      create: cat,
    });
  }

  // Kategoriyalarni olish
  const divanlarCat = await prisma.category.findUnique({ where: { slug: "divanlar" } });
  const krovatlarCat = await prisma.category.findUnique({ where: { slug: "krovatlar" } });
  const shkaflarCat = await prisma.category.findUnique({ where: { slug: "shkaflar" } });
  const stollarCat = await prisma.category.findUnique({ where: { slug: "stollar" } });
  const stullarCat = await prisma.category.findUnique({ where: { slug: "stullar" } });

  // 1. Kolleksiya (Komplekt)
  const collection = await prisma.collection.upsert({
    where: { slug: "milano-mehmonxona-toplami" },
    update: {},
    create: {
      slug: "milano-mehmonxona-toplami",
      titleUz: "Milano Mehmonxona To'plami",
      titleRu: "Гостиный гарнитур Milano",
      titleEn: "Milano Living Room Set",
      descUz: "Premium toifadagi yashash xonasi uchun to'liq muvozanatli kompozitsiya.",
      descRu: "Премиальная сбалансированная композиция для гостиной комнаты.",
      descEn: "Premium balanced living room furniture collection.",
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  });

  // 2. Mahsulotlar (Narxsiz, PRD v2.0 bo'yicha)
  const products = [
    {
      slug: "soprano-divan",
      titleUz: "Soprano Divan",
      titleRu: "Диван Soprano",
      titleEn: "Soprano Sofa",
      descUz: "Bouclé mato, erkin qayrilma shakl, eman ichki tayanch va oliy darajadagi anatomik qulaylik.",
      descRu: "Ткань букле, свободная изогнутая форма, внутренний каркас из массива дуба.",
      descEn: "Bouclé upholstery, sculptural silhouette, solid oak internal frame, ergonomic comfort.",
      dimensions: "280 × 160 × 78 sm",
      material: "Bouclé, tabiiy eman karkas",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: divanlarCat?.id || "",
      collectionId: collection.id,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "zen-kreslo",
      titleUz: "Zen Kreslo",
      titleRu: "Кресло Zen",
      titleEn: "Zen Armchair",
      descUz: "Tabiiy zig'ir mato, massiv eman karkas, ergonomik vazminlik va yapon minimalizmi ruhiyati.",
      descRu: "Натуральный лен, каркас из массива дуба, эргономичное спокойствие и минимализм.",
      descEn: "Natural linen, solid oak structural silhouette, ergonomic balance and understated craft.",
      dimensions: "82 × 90 × 76 sm",
      material: "Tabiiy zig'ir, massiv eman",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: divanlarCat?.id || "",
      collectionId: collection.id,
      images: [
        "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "elegance-jurnal-stoli",
      titleUz: "Elegance Jurnal Stoli",
      titleRu: "Журнальный столик Elegance",
      titleEn: "Elegance Coffee Table",
      descUz: "Yaxlit eman daraxti va sayqallangan Italiya travertin toshining benuqson hamohangligi.",
      descRu: "Безупречная гармония массива дуба и натурального итальянского травертина.",
      descEn: "Fluted solid oak base paired with hand-finished Italian Roman travertine stone slab.",
      dimensions: "120 × 70 × 38 sm",
      material: "Tabiiy Italiya travertini, eman",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: stollarCat?.id || "",
      collectionId: collection.id,
      images: [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "kyoto-yotoqxona-krovati",
      titleUz: "Kyoto Krovat",
      titleRu: "Кровать Kyoto",
      titleEn: "Kyoto Bed",
      descUz: "Yapon minimalizmi uslubidagi past profil, yaxlit eman karkas va yumshoq bosh qismi.",
      descRu: "Низкий профиль в стиле японского минимализма, массив дуба и мягкое изголовье.",
      descEn: "Low profile Japanese minimalist bed crafted from solid oak with padded headboard.",
      dimensions: "200 × 220 × 95 sm",
      material: "Massiv eman, yumshoq velur",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "MADE_TO_ORDER" as const,
      categoryId: krovatlarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "monolit-shkaf",
      titleUz: "Monolit Garderob Shkafi",
      titleRu: "Гардеробный шкаф Monolit",
      titleEn: "Monolit Wardrobe",
      descUz: "Shiftgacha yaxlit dizayn, ichki LED yoritgichlar va sokin yopiluvchi tizim.",
      descRu: "Потолочный монолитный дизайн, встроенная LED подсветка и доводчики.",
      descEn: "Floor-to-ceiling sleek design with integrated LED lighting and soft-close mechanisms.",
      dimensions: "240 × 60 × 270 sm",
      material: "MDF shpon, bo'yalgan eman ramka",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "MADE_TO_ORDER" as const,
      categoryId: shkaflarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "nordic-ovqat-stoli",
      titleUz: "Nordic Ovqat Stoli",
      titleRu: "Обеденный стол Nordic",
      titleEn: "Nordic Dining Table",
      descUz: "Skandinaviya uslubidagi keng oilaviy ovqat stoli, tabiiy daraxt fakturasi.",
      descRu: "Обеденный стол в скандинавском стиле с естественной текстурой дерева.",
      descEn: "Scandinavian style spacious dining table with natural wood grain texture.",
      dimensions: "180 × 90 × 75 sm",
      material: "Yaxlit yong'oq daraxti",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: stollarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "velvet-ovqat-stuli",
      titleUz: "Velvet Ovqat Stuli",
      titleRu: "Обеденный стул Velvet",
      titleEn: "Velvet Dining Chair",
      descUz: "Metall oltinrang oyoqlar, yumshoq baxmal qoplama va mustahkam konstruksiya.",
      descRu: "Металлические золотистые ножки, мягкая бархатная обивка.",
      descEn: "Gold-accent metal legs with soft velvet upholstery.",
      dimensions: "52 × 55 × 84 sm",
      material: "Baxmal, metall karkas",
      warranty: "2 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: stullarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  for (const prod of products) {
    if (!prod.categoryId) continue;
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        titleUz: prod.titleUz,
        titleRu: prod.titleRu,
        titleEn: prod.titleEn,
        descUz: prod.descUz,
        descRu: prod.descRu,
        descEn: prod.descEn,
        dimensions: prod.dimensions,
        material: prod.material,
        warranty: prod.warranty,
        stockStatus: prod.stockStatus,
        images: prod.images,
        categoryId: prod.categoryId,
        collectionId: prod.collectionId,
      },
      create: prod,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.stdout.write("Database seed successfully finished.\n");
    process.exit(0);
  })
  .catch(async (error: unknown) => {
    await prisma.$disconnect();
    const errorMessage = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Database seed error: ${errorMessage}\n`);
    process.exit(1);
  });
