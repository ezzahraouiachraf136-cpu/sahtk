from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.order import Order, OrderItem
from app.schemas.order import CreateOrderIn, OrderOut, UpsellIn
from app.services.capi import send_capi_event
from app.services.phone import phone_display_national, validate_saudi_phone
from app.services.products import (
    PRODUCTS,
    calc_line,
    get_product,
    get_upsell_slug,
)
from app.services.sheets import send_order_to_sheets, send_order_webhook

router = APIRouter(prefix="/api/orders", tags=["orders"])


def _order_number() -> str:
    return f"NM-{datetime.utcnow().strftime('%Y%m%d')}-{datetime.utcnow().microsecond % 10000:04d}"


def _serialize_order(order: Order) -> OrderOut:
    upsell_slug = order.upsell_product_slug
    upsell_product = get_product(upsell_slug) if upsell_slug else None
    upsell_total = (
        float(settings.upsell_price_sar) if order.upsell_accepted else 0.0
    )
    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        phone_e164=order.phone,
        phone_national=phone_display_national(order.phone),
        status=order.status,
        subtotal_sar=float(order.subtotal_sar),
        upsell_total_sar=upsell_total,
        total_sar=float(order.total_sar),
        upsell_available=not order.upsell_accepted and upsell_slug is not None,
        upsell_product_slug=upsell_slug,
        upsell_product_name_ar=upsell_product["name_ar"] if upsell_product else None,
        upsell_price_sar=float(settings.upsell_price_sar),
        items=[
            {
                "product_slug": i.product_slug,
                "product_name_ar": i.product_name_ar,
                "offer_code": i.offer_code,
                "quantity": i.quantity,
                "line_total_sar": float(i.line_total_sar),
            }
            for i in order.items
        ],
    )


def _order_to_sheet(order: Order) -> dict:
    return {
        "id": str(order.id),
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "items": [
            {
                "product_slug": i.product_slug,
                "offer_code": i.offer_code,
                "quantity": i.quantity,
                "line_total_sar": float(i.line_total_sar),
            }
            for i in order.items
        ],
        "subtotal_sar": float(order.subtotal_sar),
        "total_sar": float(order.total_sar),
        "status": order.status,
        "upsell_accepted": order.upsell_accepted,
        "utm_source": order.utm_source,
        "utm_medium": order.utm_medium,
        "utm_campaign": order.utm_campaign,
        "utm_content": order.utm_content,
        "source_url": order.source_url,
    }


@router.post("", response_model=OrderOut, status_code=201)
async def create_order(body: CreateOrderIn, db: Session = Depends(get_db)):
    try:
        phone = validate_saudi_phone(body.phone)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    lines = []
    for item in body.items:
        try:
            lines.append(calc_line(item.product_slug, item.offer_code))
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e)) from e

    subtotal = sum(l.line_total_sar for l in lines)
    primary_slug = body.items[0].product_slug
    upsell_slug = get_upsell_slug(primary_slug)

    order = Order(
        order_number=_order_number(),
        customer_name=body.customer_name.strip(),
        phone=phone,
        subtotal_sar=subtotal,
        total_sar=subtotal,
        upsell_product_slug=upsell_slug,
        source_url=body.source_url,
        utm_source=body.utm_source,
        utm_medium=body.utm_medium,
        utm_campaign=body.utm_campaign,
        utm_content=body.utm_content,
        utm_term=body.utm_term,
        fbp=body.fbp,
        fbc=body.fbc,
        lead_event_id=body.lead_event_id,
    )
    db.add(order)
    db.flush()

    for line in lines:
        db.add(
            OrderItem(
                order_id=order.id,
                product_slug=line.product_slug,
                product_name_ar=line.product_name_ar,
                offer_code=line.offer_code,
                quantity=line.quantity,
                line_total_sar=line.line_total_sar,
            )
        )

    db.commit()
    db.refresh(order)

    event_id = body.lead_event_id or str(order.id)
    await send_capi_event(
        event_id=event_id,
        event_name="Lead",
        value=float(subtotal),
        phone=phone,
        name=body.customer_name,
        url=body.source_url,
        fbp=body.fbp,
        fbc=body.fbc,
        order_id=str(order.id),
    )

    sheet_payload = _order_to_sheet(order)
    await send_order_to_sheets(sheet_payload)
    await send_order_webhook(sheet_payload)

    return _serialize_order(order)


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: UUID, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")
    return _serialize_order(order)


@router.patch("/{order_id}/upsell", response_model=OrderOut)
async def patch_upsell(
    order_id: UUID, body: UpsellIn, db: Session = Depends(get_db)
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")
    if order.upsell_accepted:
        return _serialize_order(order)

    if body.accept and order.upsell_product_slug:
        slug = order.upsell_product_slug
        product = PRODUCTS.get(slug)
        if product:
            line = calc_line(slug, "upsell")
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_slug=line.product_slug,
                    product_name_ar=line.product_name_ar,
                    offer_code="upsell",
                    quantity=1,
                    line_total_sar=line.line_total_sar,
                )
            )
            order.total_sar = float(order.total_sar) + line.line_total_sar
            order.upsell_accepted = True

    db.commit()
    db.refresh(order)

    sheet_payload = _order_to_sheet(order)
    await send_order_to_sheets(sheet_payload)

    return _serialize_order(order)


@router.post("/{order_id}/finalize", response_model=OrderOut)
async def finalize_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    x_purchase_event_id: str | None = Header(default=None),
):
    purchase_event_id = x_purchase_event_id
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")

    if not order.purchase_sent:
        event_id = purchase_event_id or str(order.id)
        await send_capi_event(
            event_id=event_id,
            event_name="Purchase",
            value=float(order.total_sar),
            phone=order.phone,
            name=order.customer_name,
            url=order.source_url,
            fbp=order.fbp,
            fbc=order.fbc,
            order_id=str(order.id),
        )
        order.purchase_sent = True
        db.commit()
        db.refresh(order)

    return _serialize_order(order)
