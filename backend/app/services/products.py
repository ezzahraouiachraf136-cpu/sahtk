from dataclasses import dataclass
from typing import Literal

OfferCode = Literal["single", "double", "triple", "upsell"]

OFFERS: dict[OfferCode, dict] = {
    "single": {"quantity": 1, "price_sar": 199, "label_ar": "قطعة واحدة"},
    "double": {"quantity": 2, "price_sar": 279, "label_ar": "قطعتان"},
    "triple": {"quantity": 3, "price_sar": 349, "label_ar": "ثلاث قطع"},
    "upsell": {"quantity": 1, "price_sar": 99, "label_ar": "عرض خاص"},
}

PRODUCTS: dict[str, dict] = {
    "platinum-hair-gum": {
        "name_ar": "علكة بلاتينية ضد تساقط الشعر",
        "sku": "7824",
        "upsell_slug": "anti-freeze-powder",
    },
    "anti-freeze-sparkling": {
        "name_ar": "مشروب غازي مضاد للتجمد",
        "sku": "4593",
        "upsell_slug": "platinum-hair-gum",
    },
    "anti-freeze-powder": {
        "name_ar": "بودرة مضادة للتجمد",
        "sku": "3167",
        "upsell_slug": "anti-freeze-sparkling",
    },
}


@dataclass
class LineCalc:
    product_slug: str
    product_name_ar: str
    offer_code: str
    quantity: int
    line_total_sar: float


def get_product(slug: str) -> dict | None:
    return PRODUCTS.get(slug)


def calc_line(product_slug: str, offer_code: str) -> LineCalc:
    product = PRODUCTS.get(product_slug)
    if not product:
        raise ValueError(f"منتج غير معروف: {product_slug}")
    offer = OFFERS.get(offer_code)  # type: ignore
    if not offer:
        raise ValueError(f"عرض غير معروف: {offer_code}")
    return LineCalc(
        product_slug=product_slug,
        product_name_ar=product["name_ar"],
        offer_code=offer_code,
        quantity=offer["quantity"],
        line_total_sar=float(offer["price_sar"]),
    )


def get_upsell_slug(primary_slug: str) -> str | None:
    p = PRODUCTS.get(primary_slug)
    return p.get("upsell_slug") if p else None
