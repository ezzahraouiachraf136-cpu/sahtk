"use client";

import type { Offer, OfferCode } from "@/lib/products";
import { cn, formatSar } from "@/lib/utils";

interface Props {
  offers: Offer[];
  selected: OfferCode;
  onSelect: (code: OfferCode) => void;
}

export function OfferSelector({ offers, selected, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {offers.map((offer) => {
        const savings = offer.compareAtSar - offer.priceSar;
        const active = selected === offer.offerCode;
        return (
          <button
            key={offer.offerCode}
            type="button"
            onClick={() => onSelect(offer.offerCode)}
            className={cn(
              "relative rounded-2xl border-2 p-4 text-right transition",
              active
                ? "border-brand bg-brand-light shadow-md"
                : "border-slate-200 bg-white hover:border-brand/50"
            )}
          >
            {offer.badgeAr && (
              <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-2 py-0.5 text-xs font-bold text-brand-dark">
                {offer.badgeAr}
              </span>
            )}
            <p className="font-heading font-bold text-brand-dark">{offer.labelAr}</p>
            <p className="mt-2 text-2xl font-bold text-brand">{formatSar(offer.priceSar)}</p>
            {savings > 0 && (
              <p className="mt-1 text-sm text-brand-muted line-through">
                {formatSar(offer.compareAtSar)}
              </p>
            )}
            {savings > 0 && (
              <p className="text-sm font-semibold text-brand">وفّري {formatSar(savings)}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
