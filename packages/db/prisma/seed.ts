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
