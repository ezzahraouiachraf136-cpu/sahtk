from fastapi import APIRouter

from app.schemas.order import CapiEventIn
from app.services.capi import send_capi_event
from app.services.phone import validate_saudi_phone

router = APIRouter(prefix="/api", tags=["events"])


@router.post("/events")
async def track_event(body: CapiEventIn):
    phone = None
    if body.phone:
        try:
            phone = validate_saudi_phone(body.phone)
        except ValueError:
            phone = None

    await send_capi_event(
        event_id=body.event_id,
        event_name=body.event_name,
        value=body.value,
        currency=body.currency,
        phone=phone,
        name=body.name,
        url=body.url,
        fbp=body.fbp,
        fbc=body.fbc,
        order_id=body.order_id,
        product_ids=body.product_ids,
    )
    return {"ok": True}
