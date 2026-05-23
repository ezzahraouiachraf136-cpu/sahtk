import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageClient } from "@/components/ProductPageClient";
import { getProduct, PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "منتج غير موجود" };
  return {
    title: product.metaTitle,
    description: product.metaDescription,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
