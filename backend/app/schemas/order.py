from uuid import UUID

from pydantic import BaseModel, Field


class OrderItemIn(BaseModel):
    product_slug: str
    offer_code: str


class CreateOrderIn(BaseModel):
    customer_name: str = Field(min_length=2)
    phone: str
    items: list[OrderItemIn] = Field(min_length=1)
    source_url: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_content: str | None = None
    utm_term: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    lead_event_id: str | None = None


class OrderItemOut(BaseModel):
    product_slug: str
    product_name_ar: str
    offer_code: str
    quantity: int
    line_total_sar: float

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: UUID
    order_number: str
    customer_name: str
    phone_e164: str
    phone_national: str
    status: str
    subtotal_sar: float
    upsell_total_sar: float
    total_sar: float
    currency: str = "SAR"
    upsell_available: bool
    upsell_product_slug: str | None
    upsell_product_name_ar: str | None
    upsell_price_sar: float
    items: list[OrderItemOut]

    model_config = {"from_attributes": True}


class UpsellIn(BaseModel):
    accept: bool


class CapiEventIn(BaseModel):
    event_id: str
    event_name: str
    value: float | None = None
    currency: str = "SAR"
    product_ids: list[str] | None = None
    order_id: str | None = None
    phone: str | None = None
    name: str | None = None
    url: str | None = None
    fbp: str | None = None
    fbc: str | None = None


class ContactIn(BaseModel):
    name: str
    phone: str
    message: str
