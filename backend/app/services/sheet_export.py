from datetime import datetime
from zoneinfo import ZoneInfo

from app.models.order import Order
from app.services.products import PRODUCTS

COUNTRY = "KSA"
CURRENCY = "SAR"
RIYADH = ZoneInfo("Asia/Riyadh")


def format_order_date(dt: datetime | None = None) -> str:
    value = dt or datetime.now(tz=RIYADH)
    if value.tzinfo is None:
        value = value.replace(tzinfo=RIYADH)
    else:
        value = value.astimezone(RIYADH)
    return value.strftime("%d/%m/%Y")


def generate_order_number() -> str:
    now = datetime.now(tz=RIYADH)
    return f"nama-{now.strftime('%Y%m%d')}-{now.microsecond % 10000:04d}"


def _product_sku(slug: str) -> str:
    product = PRODUCTS.get(slug)
    if not product:
        return slug
    return str(product.get("sku", slug))


def build_sheets_order_payload(order: Order) -> dict:
    names: list[str] = []
    skus: list[str] = []
    quantities: list[str] = []

    for item in order.items:
        names.append(item.product_name_ar)
        skus.append(_product_sku(item.product_slug))
        quantities.append(str(item.quantity))

    return {
        "id": str(order.id),
        "date": format_order_date(order.created_at),
        "order_number": order.order_number,
        "country": COUNTRY,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "products_ar": "/".join(names),
        "skus": "/".join(skus),
        "quantities": "/".join(quantities),
        "total_sar": float(order.total_sar),
        "currency": CURRENCY,
        "status": "",
    }
