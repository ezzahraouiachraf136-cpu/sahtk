from datetime import date, datetime, time, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent
from app.models.order import Order, OrderItem
from app.services.phone import phone_display_national


def _date_range_bounds(date_from: date, date_to: date) -> tuple[datetime, datetime]:
    start = datetime.combine(date_from, time.min)
    end = datetime.combine(date_to + timedelta(days=1), time.min)
    return start, end


def _count_events(
    db: Session, event_name: str, start: datetime, end: datetime
) -> int:
    return (
        db.scalar(
            select(func.count())
            .select_from(AnalyticsEvent)
            .where(
                AnalyticsEvent.event_name == event_name,
                AnalyticsEvent.created_at >= start,
                AnalyticsEvent.created_at < end,
            )
        )
        or 0
    )


def get_metrics(db: Session, date_from: date, date_to: date) -> dict:
    start, end = _date_range_bounds(date_from, date_to)

    page_views = _count_events(db, "PageView", start, end)
    product_views = _count_events(db, "ViewContent", start, end)
    add_to_cart = _count_events(db, "AddToCart", start, end)
    checkout_starts = _count_events(db, "InitiateCheckout", start, end)
    leads = _count_events(db, "Lead", start, end)
    purchases = _count_events(db, "Purchase", start, end)

    orders_q = select(Order).where(
        Order.created_at >= start, Order.created_at < end
    )
    orders = list(db.scalars(orders_q).all())
    orders_count = len(orders)
    revenue = sum(float(o.total_sar) for o in orders)
    aov = revenue / orders_count if orders_count else 0.0
    upsell_count = sum(1 for o in orders if o.upsell_accepted)
    upsell_rate = (upsell_count / orders_count * 100) if orders_count else 0.0
    conversion = (orders_count / page_views * 100) if page_views else 0.0

    top_products_rows = db.execute(
        select(
            OrderItem.product_name_ar,
            func.count(OrderItem.id).label("cnt"),
            func.sum(OrderItem.line_total_sar).label("rev"),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.created_at >= start, Order.created_at < end)
        .group_by(OrderItem.product_name_ar)
        .order_by(func.count(OrderItem.id).desc())
        .limit(5)
    ).all()
    top_products = [
        {
            "name": row.product_name_ar,
            "orders": int(row.cnt),
            "revenue_sar": float(row.rev or 0),
        }
        for row in top_products_rows
    ]

    top_utm_rows = db.execute(
        select(Order.utm_source, func.count(Order.id).label("cnt"))
        .where(
            Order.created_at >= start,
            Order.created_at < end,
            Order.utm_source.isnot(None),
            Order.utm_source != "",
        )
        .group_by(Order.utm_source)
        .order_by(func.count(Order.id).desc())
        .limit(5)
    ).all()
    top_utm = [
        {"source": row.utm_source or "direct", "orders": int(row.cnt)}
        for row in top_utm_rows
    ]

    daily = []
    cursor = date_from
    while cursor <= date_to:
        d_start, d_end = _date_range_bounds(cursor, cursor)
        day_orders = [
            o for o in orders if o.created_at and d_start <= o.created_at < d_end
        ]
        daily.append(
            {
                "date": cursor.isoformat(),
                "orders": len(day_orders),
                "revenue_sar": sum(float(o.total_sar) for o in day_orders),
            }
        )
        cursor += timedelta(days=1)

    return {
        "date_from": date_from,
        "date_to": date_to,
        "page_views": page_views,
        "product_views": product_views,
        "add_to_cart": add_to_cart,
        "checkout_starts": checkout_starts,
        "leads": leads,
        "purchases": purchases,
        "orders": orders_count,
        "revenue_sar": round(revenue, 2),
        "average_order_value_sar": round(aov, 2),
        "conversion_rate_pct": round(conversion, 2),
        "upsell_acceptance_rate_pct": round(upsell_rate, 2),
        "top_products": top_products,
        "top_utm_sources": top_utm,
        "daily_orders": daily,
    }


def serialize_admin_order(order: Order) -> dict:
    upsell_total = 0.0
    if order.upsell_accepted:
        upsell_total = float(order.total_sar) - float(order.subtotal_sar)
    return {
        "id": order.id,
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "phone_e164": order.phone,
        "phone_national": phone_display_national(order.phone),
        "status": order.status,
        "subtotal_sar": float(order.subtotal_sar),
        "upsell_total_sar": upsell_total,
        "total_sar": float(order.total_sar),
        "upsell_accepted": order.upsell_accepted,
        "upsell_product_slug": order.upsell_product_slug,
        "source_url": order.source_url,
        "utm_source": order.utm_source,
        "utm_medium": order.utm_medium,
        "utm_campaign": order.utm_campaign,
        "utm_content": order.utm_content,
        "utm_term": order.utm_term,
        "created_at": order.created_at,
        "items": [
            {
                "product_slug": i.product_slug,
                "product_name_ar": i.product_name_ar,
                "offer_code": i.offer_code,
                "quantity": i.quantity,
                "line_total_sar": float(i.line_total_sar),
            }
            for i in order.items
        ],
    }
