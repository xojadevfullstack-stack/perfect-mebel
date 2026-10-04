import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { prisma } from "@mebel-salon/db";
import {
  ProductDetailView,
  type DetailedProduct,
} from "@/components/catalog/product-detail-view";
import { type ProductCardData } from "@/components/catalog/product-card";
import { ATELIER_PRODUCTS } from "@/lib/catalog-data";

interface ProductDetailPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: ProductDetailPageProps): Promise<Metadata> {
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    select: { titleUz: true, titleRu: true, titleEn: true, descUz: true, descRu: true, descEn: true },
  });

  const fallback = ATELIER_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  const data = dbProduct || fallback;

  if (!data) {
    return { title: "Mebel topilmadi — Perfect Mebel" };
  }

  const title =
    locale === "ru" && data.titleRu
      ? data.titleRu
      : locale === "en" && data.titleEn
      ? data.titleEn
      : data.titleUz;

  const desc =
    locale === "ru" && data.descRu
      ? data.descRu
      : locale === "en" && data.descEn
      ? data.descEn
      : data.descUz;

  return {
    title: `${title} — Perfect Mebel Atelyesi`,
    description: desc || "Zamonaviy mualliflik mebellari",
  };
}

export default async function ProductDetailPage({
  params: { locale, slug },
}: ProductDetailPageProps): Promise<React.JSX.Element> {
  unstable_setRequestLocale(locale);

  // 1. Check Database
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
      },
    },
  });

  // 2. Check Fallback Atelier Products
  const fallback = ATELIER_PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  if (!dbProduct && !fallback) {
    notFound();
  }

  let product: DetailedProduct;

  if (dbProduct) {
    const catName =
      locale === "ru" && dbProduct.category.nameRu
        ? dbProduct.category.nameRu
        : locale === "en" && dbProduct.category.nameEn
        ? dbProduct.category.nameEn
        : dbProduct.category.nameUz;

    product = {
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
  } else if (fallback) {
    product = {
      id: fallback.id,
      slug: fallback.slug,
      titleUz: fallback.titleUz,
      titleRu: fallback.titleRu,
      titleEn: fallback.titleEn,
      descUz: fallback.descUz,
      descRu: fallback.descRu,
      descEn: fallback.descEn,
      dimensions: fallback.dimensions,
      material: fallback.material,
      warranty: fallback.warranty,
      stockStatus: fallback.stockStatus,
      article: fallback.article,
      images: fallback.images,
      categoryName: fallback.categoryName,
      categorySlug: fallback.categorySlug,
      colors: fallback.colors,
      characteristics: fallback.characteristics,
    };
  } else {
    notFound();
  }

  // Related products (from other items in ATELIER_PRODUCTS)
  const relatedProducts: ProductCardData[] = ATELIER_PRODUCTS.filter(
    (p) => p.slug !== slug && p.id !== slug
  ).map((p) => ({
    id: p.id,
    slug: p.slug,
    titleUz: p.titleUz,
    titleRu: p.titleRu,
    titleEn: p.titleEn,
    descUz: p.descUz,
    descRu: p.descRu,
    descEn: p.descEn,
    dimensions: p.dimensions,
    material: p.material,
    warranty: p.warranty,
    stockStatus: p.stockStatus,
    images: p.images,
    article: p.article,
    colors: p.colors,
    category: {
      id: p.categorySlug,
      slug: p.categorySlug,
      nameUz: p.categoryName,
      nameRu: p.categoryName,
      nameEn: p.categoryName,
    },
  }));

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
