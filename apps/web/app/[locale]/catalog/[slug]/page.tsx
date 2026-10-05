import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import {
  ProductDetailView,
  type DetailedProduct,
} from "@/components/catalog/product-detail-view";
import { type ProductCardData } from "@/components/catalog/product-card";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true },
      take: 20,
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

interface ProductDetailPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: ProductDetailPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "productDetail" });
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { titleUz: true, titleRu: true, titleEn: true, descUz: true, descRu: true, descEn: true },
  });

  if (!product) {
    return { title: t("notFoundTitle") };
  }

  const title =
    locale === "ru" && product.titleRu
      ? product.titleRu
      : locale === "en" && product.titleEn
      ? product.titleEn
      : product.titleUz;

  const desc =
    locale === "ru" && product.descRu
      ? product.descRu
      : locale === "en" && product.descEn
      ? product.descEn
      : product.descUz;

  return {
    title: t("metaTitle", { title }),
    description: desc || t("metaDescription"),
  };
}

export default async function ProductDetailPage({
  params: { locale, slug },
}: ProductDetailPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
      },
    },
  });

  if (!dbProduct) {
    notFound();
  }

  const catName =
    locale === "ru" && dbProduct.category.nameRu
      ? dbProduct.category.nameRu
      : locale === "en" && dbProduct.category.nameEn
      ? dbProduct.category.nameEn
      : dbProduct.category.nameUz;

  const product: DetailedProduct = {
    id: dbProduct.id,
    slug: dbProduct.slug,
    titleUz: dbProduct.titleUz,
    titleRu: dbProduct.titleRu,
    titleEn: dbProduct.titleEn,
    descUz: dbProduct.descUz,
    descRu: dbProduct.descRu,
    descEn: dbProduct.descEn,
    dimensions: dbProduct.dimensions,
    material: dbProduct.material,
    warranty: dbProduct.warranty,
    stockStatus: dbProduct.stockStatus,
    images: dbProduct.images,
    categoryName: catName,
    categorySlug: dbProduct.category.slug,
  };

  // Tegishli mebellar: avval shu kategoriyadan, yetmasa boshqalardan
  const related = await prisma.product.findMany({
    where: { id: { not: dbProduct.id } },
    orderBy: [{ createdAt: "desc" }],
    take: 12,
    include: {
      category: {
        select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
      },
    },
  });

  const sameCategory = related.filter((p) => p.categoryId === dbProduct.categoryId);
  const others = related.filter((p) => p.categoryId !== dbProduct.categoryId);
  const relatedProducts: ProductCardData[] = [...sameCategory, ...others].slice(0, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
