import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import { ArrowRight, Layers } from "lucide-react";

interface CollectionsPageProps {
  params: { locale: string };
}

export default async function CollectionsPage({
  params: { locale },
}: CollectionsPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        select: { id: true, titleUz: true },
      },
    },
  });

  // Editorial fallback collections if DB is not yet populated
  const fallbackCollections = [
    {
      id: "col-nordic-living",
      slug: "nordic-yashash-xonasi",
      titleUz: "Nordic Yashash Xonasi To'plami",
      titleRu: "Гостиный гарнитур Nordic",
      titleEn: "Nordic Living Room Set",
      descUz: "Iliq krem boucle divan, yaxlit eman oval jurnal stoli va suzuvchi TV konsol ansambli.",
      descRu: "Теплый диван букле, журнальный столик из дуба и парящая ТВ-консоль.",
      descEn: "Warm cream boucle sofa, solid oak oval coffee table and floating media console.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATnyonbIkv8ZAc6afuYQB25mX2C4CMBJi0udEuFwc9BOZo357mX1Teegjh1r1vN2VyR8U9DzS0gWXZXr9g8YDpshD1c0agf5QT1QnECZ1ytSryK7fZJ8Pj8L4_bSFWNK5iTEhxUZ7wOKXIGiGHzgUYq4-OjiRPIZrfouy7DvgiZm-jKl7s26_fFc1h32vRbVtMgLEoGOcXYKAnDV3juGl5RyBIySeKRG9YslIE4p7xETuhfkf-WCYLSArkvMX-tHO8Lm8xwrXqtNQ",
      ],
      products: [{ id: "1", titleUz: "Divan" }, { id: "2", titleUz: "Jurnal stoli" }, { id: "3", titleUz: "TV konsol" }],
    },
    {
      id: "col-kyoto-bedroom",
      slug: "kyoto-yotoqxona-toplami",
      titleUz: "Venetsiya Yotoqxona To'plami",
      titleRu: "Спальный гарнитур Венеция",
      titleEn: "Venice Bedroom Set",
      descUz: "Suzuvchi platformali boucle krovat, tabiiy travertin qoplamali 2 ta tumba va yaxlit eman shkafi.",
      descRu: "Кровать с парящей платформой, 2 тумбы с травертином и шкаф из дуба.",
      descEn: "Floating platform boucle bed, 2 travertine-topped nightstands, and solid oak wardrobe.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcDYSRzNE0rrW_Po8KOGmWeFj0Le5F2yCM-hkdAfBF825NkJLjakp8T9MNNlLdYWBG9ik8jPcdcwkj0-HUAUuGZbfW9IJW-FXkDM0bnL6sVB5KeY4IesTLOf3ASiqBT9Sg3VSP__3QFsMLWpuUJSVUerUIEc-VRVzpbd5usKe9YxQ_G0CgmQb8DR9x75S3dDB8C10k8MOvcMPoYH_S3TSax005YrqLafmogujVZuf3B6bExpjcwnoz1rIo6DLJCL7Ot16Pn2Zb-LE",
      ],
      products: [{ id: "4", titleUz: "Krovat" }, { id: "5", titleUz: "2 tumba" }, { id: "6", titleUz: "Shkaf" }],
    },
    {
      id: "col-milano-dining",
      slug: "milano-ovqatlanish-toplami",
      titleUz: "Milano Ovqatlanish To'plami",
      titleRu: "Обеденный гарнитур Milano",
      titleEn: "Milano Dining Room Set",
      descUz: "Qora yong'oqdan ishlangan katta ovqatlanish stoli va 6 ta ergonomik qulay stul ansambli.",
      descRu: "Большой обеденный стол из ореха и 6 эргономичных стульев.",
      descEn: "Solid walnut dining table accompanied by 6 sculptural upholstered dining chairs.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAvG1FELOfv6qU5qk8w7fjYgJfcJwAhtUElBQAm_ozXUCpFbD2Cz2ycaQgDJ8UWZAWR0TJwlArzpb88hNMbeYV9n9u0UNCizVwjWig111eCS59BJT8g-nWi7ulFh_Yxt3moil7qm6pwM0yo5wo3cRDedRvF3nXpwO5rtKiYvTQaijW4122HU4558GtTQrijheGi3wF8OKcmOBNx4JXzXKR0Ygh4XDsE_O5bq3D6dEQzHmDVSURaakNrojs90170bmKflp1gDoaSnks",
      ],
      products: [{ id: "7", titleUz: "Katta stol" }, { id: "8", titleUz: "6 stul" }, { id: "9", titleUz: "Komod" }],
    },
  ];

  const displayCollections = collections.length > 0 ? collections : fallbackCollections;

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Header */}
      <section className="bg-muted/30 border-b border-border/80 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mb-2 block">
              Yaxlit Me'moriy Ansambllar
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold tracking-tight mb-4">
              Mukammal To'plamlar &amp; Komplektlar
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
              Xonani yagona uslub va ranglar uyg'unligida jihozlash uchun saralangan ansambllar. Komplekt ichidagi har bir mebelni alohida belgilab, o'zingizga kerakli qismlar bo'yicha ariza yuborishingiz mumkin.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayCollections.map((col) => {
            const title =
              locale === "ru" && "titleRu" in col && col.titleRu
                ? col.titleRu
                : locale === "en" && "titleEn" in col && col.titleEn
                ? col.titleEn
                : col.titleUz;

            const desc =
              locale === "ru" && "descRu" in col && col.descRu
                ? col.descRu
                : locale === "en" && "descEn" in col && col.descEn
                ? col.descEn
                : col.descUz;

            const coverImage = col.images.length > 0 ? col.images[0] : null;

            return (
              <Link
                key={col.id}
                href={`/${locale}/collections/${col.slug}`}
                className="group smooth-card flex flex-col justify-between overflow-hidden rounded-none border border-border bg-card block"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 ease-editorial group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Layers className="h-12 w-12 stroke-1" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-card text-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-border shadow-sm">
                      {col.products.length} ta mebel
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="eyebrow block">
                      Yaxlit Ansambl
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 ease-editorial">
                      {title}
                    </h2>
                    {desc && (
                      <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed pt-1">
                        {desc}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
