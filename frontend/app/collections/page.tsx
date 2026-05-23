import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "المجموعة",
  description: "اكتشفي مجموعة نما للجمال — عناية فاخرة بعروض حصرية",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-center">مجموعة نما للجمال</h1>
      <p className="mt-3 text-center text-brand-muted max-w-xl mx-auto">
        ثلاث منتجات تكمّل روتينكِ — عروض 199 / 279 / 349 ر.س ودفع عند الاستلام
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
