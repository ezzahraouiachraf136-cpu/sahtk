import catalog from "@/data/products.json";

export type OfferCode = "single" | "double" | "triple";

export interface Offer {
  offerCode: OfferCode;
  labelAr: string;
  quantity: number;
  priceSar: number;
  compareAtSar: number;
  badgeAr?: string;
  isDefault?: boolean;
}

export interface Product {
  slug: string;
  nameAr: string;
  nameEn: string;
  positioning: string;
  heroHeadline: string;
  heroSubheadline: string;
  rating: number;
  reviewCount: number;
  scarcityText: string;
  basePriceSar: number;
  defaultOffer: OfferCode;
  benefits: string[];
  howItWorks: string[];
  forWho: string[];
  ingredientsHighlight: string[];
  images: string[];
  upsellSlug: string;
  metaTitle: string;
  metaDescription: string;
  offers: Offer[];
}

const sharedOffers: Offer[] = catalog.offers.map((o) => ({
  offerCode: o.offer_code as OfferCode,
  labelAr: o.label_ar,
  quantity: o.quantity,
  priceSar: o.price_sar,
  compareAtSar: o.compare_at_sar,
  badgeAr: o.badge_ar,
  isDefault: o.is_default,
}));

export const UPSELL_PRICE_SAR = catalog.upsell_price_sar;
export const UPSELL_TIMEOUT_MS = catalog.upsell_timeout_ms;

export const PRODUCTS: Product[] = catalog.products.map((p) => ({
  slug: p.slug,
  nameAr: p.name_ar,
  nameEn: p.name_en,
  positioning: p.positioning,
  heroHeadline: p.hero_headline,
  heroSubheadline: p.hero_subheadline,
  rating: p.rating,
  reviewCount: p.review_count,
  scarcityText: p.scarcity_text,
  basePriceSar: 199,
  defaultOffer: (catalog.default_offer_code as OfferCode) || "double",
  benefits: p.benefits,
  howItWorks: p.how_it_works,
  forWho: p.for_who,
  ingredientsHighlight: p.ingredients_highlight,
  images: p.images,
  upsellSlug: p.upsell_slug,
  metaTitle: p.meta_title,
  metaDescription: p.meta_description,
  offers: sharedOffers,
}));

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getUpsellSlug(primarySlug: string): string | undefined {
  return getProduct(primarySlug)?.upsellSlug;
}
