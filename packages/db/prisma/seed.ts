import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPassword = process.env["ADMIN_INITIAL_PASSWORD"] || "admin123";
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
    {
      slug: "kreslolar",
      nameUz: "Kreslolar",
      nameRu: "Кресла",
      nameEn: "Armchairs",
      order: 6,
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

  // Toifalarni olish
  const divanlarCat = await prisma.category.findUnique({ where: { slug: "divanlar" } });
  const krovatlarCat = await prisma.category.findUnique({ where: { slug: "krovatlar" } });
  const shkaflarCat = await prisma.category.findUnique({ where: { slug: "shkaflar" } });
  const stollarCat = await prisma.category.findUnique({ where: { slug: "stollar" } });
  const stullarCat = await prisma.category.findUnique({ where: { slug: "stullar" } });
  const kreslolarCat = await prisma.category.findUnique({ where: { slug: "kreslolar" } });

  // ========================================================
  // 1. KOMPLEKTLAR (COLLECTIONS) - Kamida 6 ta to'liq komplekt
  // ========================================================
  const collectionsData = [
    {
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
    {
      slug: "kyoto-yotoqxona-toplami",
      titleUz: "Kyoto Yotoqxona To'plami",
      titleRu: "Спальный гарнитур Kyoto",
      titleEn: "Kyoto Bedroom Set",
      descUz: "Yapon minimalizmi va tabiiy eman uyg'unligidagi sokin yotoqxona to'plami.",
      descRu: "Спокойный спальный гарнитур в стиле японского минимализма из дуба.",
      descEn: "Calm Japanese minimalist bedroom ensemble made of solid oak.",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "scandi-oshxona-toplami",
      titleUz: "Scandi Ovqatlanish To'plami",
      titleRu: "Обеденный гарнитур Scandi",
      titleEn: "Scandi Dining Room Set",
      descUz: "Skandinaviya uslubidagi tabiiy yog'och stol va yumshoq ergonomik stullar ansambli.",
      descRu: "Скандинавский ансамбль из деревянного стола и эргономичных стульев.",
      descEn: "Scandinavian ensemble of natural wood dining table and ergonomic chairs.",
      images: [
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "verona-lounge-toplami",
      titleUz: "Verona Lounge Dam Olish To'plami",
      titleRu: "Лаунж гарнитур Verona",
      titleEn: "Verona Lounge Set",
      descUz: "Yumshoq modulli qulay divan, zamonaviy travertin jurnal stoli va orom kreslosi.",
      descRu: "Мягкий модульный диван, столик из травертина и кресло для отдыха.",
      descEn: "Plush modular sofa, travertine coffee table and lounge armchair.",
      images: [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "tokyo-kabinet-toplami",
      titleUz: "Tokyo Ish Kabineti To'plami",
      titleRu: "Кабинетный гарнитур Tokyo",
      titleEn: "Tokyo Workspace Set",
      descUz: "Zamonaviy mualliflik ish stoli, kitob javoni va qulay ofis kreslosi.",
      descRu: "Авторский письменный стол, книжный стеллаж и удобное кресло.",
      descEn: "Designer work desk, bookshelf and ergonomic executive chair.",
      images: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "loft-urban-toplami",
      titleUz: "Loft Urban Yashash To'plami",
      titleRu: "Гостиный гарнитур Loft Urban",
      titleEn: "Loft Urban Living Set",
      descUz: "Haqiqiy charm divan, qora metall karkasli stellaj va mustahkam jurnal stoli.",
      descRu: "Кожаный диван, стеллаж на черном металлокаркасе и журнальный столик.",
      descEn: "Genuine leather sofa, black metal bookcase and industrial coffee table.",
      images: [
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  const createdCollections: Record<string, string> = {};

  for (const cData of collectionsData) {
    const col = await prisma.collection.upsert({
      where: { slug: cData.slug },
      update: {
        titleUz: cData.titleUz,
        titleRu: cData.titleRu,
        titleEn: cData.titleEn,
        descUz: cData.descUz,
        descRu: cData.descRu,
        descEn: cData.descEn,
        images: cData.images,
      },
      create: cData,
    });
    createdCollections[cData.slug] = col.id;
  }

  // ========================================================
  // 2. MAHSULOTLAR (PRODUCTS) - Kamida 20 ta mahsulot
  // ========================================================
  const products = [
    // --- Divanlar ---
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
      collectionId: createdCollections["milano-mehmonxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "verona-modulli-divan",
      titleUz: "Verona Modulli Divan",
      titleRu: "Модульный диван Verona",
      titleEn: "Verona Modular Sofa",
      descUz: "Zamonaviy yumshoq burchakli modulli divan, suv o'tkazmaydigan nano-velur qoplama.",
      descRu: "Современный угловой модульный диван с водоотталкивающим нано-велюром.",
      descEn: "Contemporary sectional modular sofa featuring water-repellent nano-velour.",
      dimensions: "320 × 190 × 82 sm",
      material: "Nano-velur, metall karkas",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: divanlarCat?.id || "",
      collectionId: createdCollections["verona-lounge-toplami"],
      images: [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "oslo-minimalist-divan",
      titleUz: "Oslo Minimalist Divan",
      titleRu: "Диван Oslo",
      titleEn: "Oslo Minimalist Sofa",
      descUz: "To'g'ri chiziqli Skandinaviya uslubidagi yengil divan, tabiiy kulrang zig'ir mato.",
      descRu: "Прямой диван в скандинавском стиле из натурального серого льна.",
      descEn: "Straight Scandinavian style sofa upholstered in natural grey linen.",
      dimensions: "220 × 95 × 75 sm",
      material: "Tabiiy zig'ir, massiv qarag'ay",
      warranty: "2 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: divanlarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "chesterfield-charm-divan",
      titleUz: "Chesterfield Charm Divan",
      titleRu: "Кожаный диван Chesterfield",
      titleEn: "Chesterfield Leather Sofa",
      descUz: "Klassik kapitone naqshli tabiiy jigarrang charm divan, asrlar sinovidan o'tgan mahobat.",
      descRu: "Классический диван из натуральной коричневой кожи с каретной стяжкой.",
      descEn: "Classic button-tufted genuine brown leather sofa with timeless grandeur.",
      dimensions: "240 × 100 × 76 sm",
      material: "Tabiiy Italiya charmi, qattiq eman",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "MADE_TO_ORDER" as const,
      categoryId: divanlarCat?.id || "",
      collectionId: createdCollections["loft-urban-toplami"],
      images: [
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80",
      ],
    },

    // --- Kreslolar ---
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
      categoryId: kreslolarCat?.id || "",
      collectionId: createdCollections["milano-mehmonxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "cloud-aylanma-kreslo",
      titleUz: "Cloud Aylanma Kreslo",
      titleRu: "Вращающееся кресло Cloud",
      titleEn: "Cloud Swivel Armchair",
      descUz: "360 daraja aylanuvchi mexanizm, bulutdek yumshoq bouclé mato va qulay suyanchiq.",
      descRu: "Поворотный механизм на 360 градусов, мягкая ткань букле и комфортная спинка.",
      descEn: "360-degree swivel armchair with cloud-soft bouclé fabric.",
      dimensions: "85 × 85 × 80 sm",
      material: "Bouclé, xromlangan po'lat asos",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: kreslolarCat?.id || "",
      collectionId: createdCollections["verona-lounge-toplami"],
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "executive-ish-kreslosi",
      titleUz: "Executive Ish Kreslosi",
      titleRu: "Кабинетное кресло Executive",
      titleEn: "Executive Office Armchair",
      descUz: "Tabiiy qora charm, yong'oq yog'ochli yon qoplamalar va gazliftli ergonomik moslashuv.",
      descRu: "Натуральная черная кожа, отделка из ореха и эргономичный газлифт.",
      descEn: "Genuine black leather, walnut veneer trim with full ergonomic adjustability.",
      dimensions: "70 × 75 × 115 sm",
      material: "Tabiiy charm, massiv yong'oq",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: kreslolarCat?.id || "",
      collectionId: createdCollections["tokyo-kabinet-toplami"],
      images: [
        "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
      ],
    },

    // --- Krovatlar ---
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
      stockStatus: "IN_STOCK" as const,
      categoryId: krovatlarCat?.id || "",
      collectionId: createdCollections["kyoto-yotoqxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "riviera-premium-krovat",
      titleUz: "Riviera Premium Krovat",
      titleRu: "Кровать Riviera Premium",
      titleEn: "Riviera Luxury Bed",
      descUz: "Baland nafis bosh qismi, qalin ortopedik lamellar va o'rnatilgan ko'tarish mexanizmi.",
      descRu: "Высокое мягкое изголовье, ортопедические ламели и подъемный механизм.",
      descEn: "Tall padded upholstered headboard, orthopedic slats and lift storage.",
      dimensions: "210 × 225 × 130 sm",
      material: "Italiya veluri, metall karkas",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "MADE_TO_ORDER" as const,
      categoryId: krovatlarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "stockholm-loft-krovat",
      titleUz: "Stockholm Loft Krovat",
      titleRu: "Кровать Stockholm Loft",
      titleEn: "Stockholm Loft Bed",
      descUz: "To'q rangli eman daraxti va kukunli bo'yoq bilan qoplangan metall oyoqlar.",
      descRu: "Темный массив дуба и металлические матовые ножки.",
      descEn: "Dark smoked oak paired with matte black powder-coated metal legs.",
      dimensions: "190 × 215 × 100 sm",
      material: "To'q eman, qora metall",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: krovatlarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      ],
    },

    // --- Shkaflar ---
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
      collectionId: createdCollections["kyoto-yotoqxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "linea-shponli-komod",
      titleUz: "Linea Shponli Komod",
      titleRu: "Комод Linea",
      titleEn: "Linea Fluted Dresser",
      descUz: "Riflyoniy chiziqli eman jabhasi, push-to-open sokin ochilish tizimi.",
      descRu: "Рифленый фасад из дуба, система открывания push-to-open.",
      descEn: "Fluted solid oak facade with seamless push-to-open hardware.",
      dimensions: "160 × 48 × 85 sm",
      material: "Tabiiy eman shponi",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: shkaflarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "urban-loft-stellaj",
      titleUz: "Urban Loft Ochiq Stellaj",
      titleRu: "Открытый стеллаж Urban Loft",
      titleEn: "Urban Loft Open Bookcase",
      descUz: "Yaxlit eman javonlari, mustahkam qora kukunli po'lat ramka, 5 qatorli tokcha.",
      descRu: "Полки из массива дуба на прочном стальном каркасе, 5 полок.",
      descEn: "Solid oak shelves supported by matte black structural steel.",
      dimensions: "120 × 38 × 200 sm",
      material: "Massiv eman, qora po'lat",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: shkaflarCat?.id || "",
      collectionId: createdCollections["loft-urban-toplami"],
      images: [
        "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1200&q=80",
      ],
    },

    // --- Stollar ---
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
      collectionId: createdCollections["milano-mehmonxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
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
      collectionId: createdCollections["scandi-oshxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "calacatta-marmar-stol",
      titleUz: "Calacatta Marmar Ovqat Stoli",
      titleRu: "Мраморный стол Calacatta",
      titleEn: "Calacatta Marble Dining Table",
      descUz: "Tabiiy oq Calacatta marmar ustki qismi va bronza qoplamali quyma tayanch.",
      descRu: "Столешница из белого мрамора Calacatta и бронзовое литое основание.",
      descEn: "Natural Italian Calacatta white marble top over cast bronze sculptural base.",
      dimensions: "220 × 100 × 76 sm",
      material: "Calacatta marmar, quyma bronza",
      warranty: "5 yil rasmiy kafolat",
      stockStatus: "MADE_TO_ORDER" as const,
      categoryId: stollarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "tokyo-mualliflik-yozuv-stoli",
      titleUz: "Tokyo Yozuv Stoli",
      titleRu: "Письменный стол Tokyo",
      titleEn: "Tokyo Writing Desk",
      descUz: "Minimalist ish stoli, yashirin sim o'tkazgichlar va qulay qutichalar bilan.",
      descRu: "Минималистичный рабочий стол со скрытыми кабель-каналами и ящиками.",
      descEn: "Minimalist desk featuring integrated cable management and soft-closing drawers.",
      dimensions: "150 × 70 × 76 sm",
      material: "Qora eman, qotishma po'lat",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: stollarCat?.id || "",
      collectionId: createdCollections["tokyo-kabinet-toplami"],
      images: [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
      ],
    },

    // --- Stullar ---
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
      collectionId: createdCollections["scandi-oshxona-toplami"],
      images: [
        "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "wishbone-yogoch-stul",
      titleUz: "Wishbone Eman Stuli",
      titleRu: "Стул Wishbone",
      titleEn: "Wishbone Oak Chair",
      descUz: "Klassik egilgan eman ramkasi va to'qilgan tabiiy ip o'rindiq, abadiy qulaylik.",
      descRu: "Классический гнутый каркас из дуба и плетеное бумажное сиденье.",
      descEn: "Steam-bent solid oak frame with hand-woven paper cord seat.",
      dimensions: "55 × 52 × 75 sm",
      material: "Eman, to'qilgan tabiiy ip",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: stullarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      slug: "monza-charm-stul",
      titleUz: "Monza Charm Ovqat Stuli",
      titleRu: "Кожаный стул Monza",
      titleEn: "Monza Leather Dining Chair",
      descUz: "Tabiiy konyak rang charm qoplama va qora kukunli po'lat oyoqlar.",
      descRu: "Обивка из натуральной кожи цвета коньяк и черные стальные ножки.",
      descEn: "Cognac saddle leather upholstery over tapered black steel legs.",
      dimensions: "49 × 54 × 82 sm",
      material: "Tabiiy charm, qora po'lat",
      warranty: "3 yil rasmiy kafolat",
      stockStatus: "IN_STOCK" as const,
      categoryId: stullarCat?.id || "",
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
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
