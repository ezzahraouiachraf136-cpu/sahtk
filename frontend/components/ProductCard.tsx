import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatSar } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const defaultOffer =
    product.offers.find((o) => o.isDefault) || product.offers[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-brand-light bg-white shadow-sm">
      <div className="aspect-[4/3] bg-gradient-to-br from-brand-light to-[#E8DFE4]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 text-amber-500 text-sm">
          ★★★★★ <span className="text-brand-muted">{product.rating}</span>
        </div>
        <p className="text-xs text-brand-muted">+{product.reviewCount} تقييم</p>
        <h3 className="mt-2 font-heading text-lg font-bold text-brand-dark">
          {product.nameAr}
        </h3>
        <p className="mt-1 text-sm text-brand-muted">{product.positioning}</p>
        <p className="mt-3 font-semibold text-brand">
          من {formatSar(defaultOffer.priceSar)}
        </p>
        <span className="mt-2 inline-block w-fit rounded-full bg-brand-light px-3 py-1 text-xs text-brand">
          الدفع عند الاستلام
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="mt-4 block rounded-xl bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark"
        >
          اختاري العرض
        </Link>
      </div>
    </article>
  );
}
