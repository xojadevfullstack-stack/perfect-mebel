import * as React from "react";
import Link from "next/link";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { Armchair, Bed, Sparkles, PhoneCall, ShieldCheck, Box } from "lucide-react";

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({
  params: { locale },
}: HomePageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("navigation");
  const tCatalog = await getTranslations("catalog");

  const sampleCategories = [
    {
      slug: "divanlar",
      icon: Armchair,
      name: locale === "ru" ? "Диваны" : locale === "en" ? "Sofas" : "Divanlar",
      desc:
        locale === "ru"
          ? "Удобные и стильные диваны для гостиной"
          : locale === "en"
            ? "Comfortable and stylish living room sofas"
            : "Mehmonxona uchun qulay va zamonaviy divanlar",
    },
    {
      slug: "krovatlar",
      icon: Bed,
      name: locale === "ru" ? "Кровати" : locale === "en" ? "Beds" : "Krovatlar",
      desc:
        locale === "ru"
          ? "Анатомические кровати для здорового сна"
          : locale === "en"
            ? "Ergonomic beds for healthy sleep"
            : "Sog'lom uyqu uchun qulay krovatlar",
    },
    {
      slug: "shkaflar",
      icon: Box,
      name: locale === "ru" ? "Шкафы" : locale === "en" ? "Wardrobes" : "Shkaflar",
      desc:
        locale === "ru"
          ? "Вместительные гардеробные и купе шкафы"
          : locale === "en"
            ? "Spacious wardrobes and closets"
            : "Keng va ixcham shkaflar to'plami",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Mebel Salon
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {tNav("home")}
            </Link>
            <Link
              href={`/${locale}/catalog`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tNav("catalog")}
            </Link>
            <Link
              href={`/${locale}/collections`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tNav("collections")}
            </Link>
            <Link
              href={`/${locale}/contacts`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tNav("contacts")}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Language links */}
            <div className="flex items-center space-x-1 rounded-md border border-border bg-muted/30 p-1 text-xs font-semibold">
              <Link
                href="/uz"
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  locale === "uz"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                UZ
              </Link>
              <Link
                href="/ru"
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  locale === "ru"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RU
              </Link>
              <Link
                href="/en"
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  locale === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </Link>
            </div>

            <ThemeToggle />

            <Link
              href={`/admin`}
              className="hidden rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:inline-block"
            >
              {tNav("admin")}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center sm:px-8">
            <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>
                {locale === "ru"
                  ? "Прямо с фабрики • Индивидуальный заказ"
                  : locale === "en"
                    ? "Direct from factory • Custom crafted"
                    : "To'g'ridan-to'g'ri zavoddan • Maxsus buyurtma"}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {tCommon("siteTitle")}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {tCommon("siteDescription")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {tCatalog("title")}
              </Link>
              <Link
                href={`/${locale}/contacts`}
                className="inline-flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <span>{tNav("contacts")}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {tCatalog("title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tCatalog("subtitle")}
                </p>
              </div>
              <Link
                href={`/${locale}/catalog`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {tCatalog("allCategories")} &rarr;
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sampleCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.slug}
                    className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {category.desc}
                      </p>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/${locale}/catalog?category=${category.slug}`}
                        className="text-sm font-medium text-primary group-hover:underline"
                      >
                        {tCatalog("viewDetails")} &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Mebel Salon. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
