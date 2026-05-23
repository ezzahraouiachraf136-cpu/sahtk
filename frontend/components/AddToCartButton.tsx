"use client";

import type { OfferCode, Product } from "@/lib/products";
import { trackEvent } from "@/lib/tracking";
import { useCart } from "@/store/cart";

interface Props {
  product: Product;
  offerCode: OfferCode;
  className?: string;
  label?: string;
}

export function AddToCartButton({ product, offerCode, className, label }: Props) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  const offer = product.offers.find((o) => o.offerCode === offerCode)!;

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addItem({
          productSlug: product.slug,
          productNameAr: product.nameAr,
          offerCode: offer.offerCode,
          offerLabelAr: offer.labelAr,
          quantity: offer.quantity,
          priceSar: offer.priceSar,
          compareAtSar: offer.compareAtSar,
        });
        trackEvent("AddToCart", {
          value: offer.priceSar,
          productIds: [product.slug],
        });
        openCart();
      }}
    >
      {label || "أضيفي العرض للسلة واطّلعي على العروض ✨"}
    </button>
  );
}
