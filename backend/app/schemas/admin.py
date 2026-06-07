from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class AdminLoginIn(BaseModel):
    username: str
    password: str


class AdminLoginOut(BaseModel):
    token: str
    expires_in_hours: int = 24


class MetricsOut(BaseModel):
    date_from: date
    date_to: date
    page_views: int
    product_views: int
    add_to_cart: int
    checkout_starts: int
    leads: int
    purchases: int
    orders: int
    revenue_sar: float
    average_order_value_sar: float
    conversion_rate_pct: float
    upsell_acceptance_rate_pct: float
    top_products: list[dict]
    top_utm_sources: list[dict]
    daily_orders: list[dict]


class AdminOrderItemOut(BaseModel):
    product_slug: str
    product_name_ar: str
    offer_code: str
    quantity: int
    line_total_sar: float

    model_config = {"from_attributes": True}


class AdminOrderOut(BaseModel):
    id: UUID
    order_number: str
    customer_name: str
    phone_e164: str
    phone_national: str
    status: str
    subtotal_sar: float
    upsell_total_sar: float
    total_sar: float
    upsell_accepted: bool
    upsell_product_slug: str | None
    source_url: str | None
    utm_source: str | None
    utm_medium: str | None
    utm_campaign: str | None
    utm_content: str | None
    utm_term: str | None
    created_at: datetime
    items: list[AdminOrderItemOut]

    model_config = {"from_attributes": True}


class AdminOrdersPageOut(BaseModel):
    total: int
    page: int
    limit: int
    orders: list[AdminOrderOut]


class UpdateOrderStatusIn(BaseModel):
    status: Literal["pending_confirmation", "confirmed", "shipped", "cancelled"]


class AnalyticsTrackIn(BaseModel):
    event_name: str
    page_url: str | None = None
    product_slug: str | None = None
    session_id: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    value: float | None = None
    order_id: str | None = None
