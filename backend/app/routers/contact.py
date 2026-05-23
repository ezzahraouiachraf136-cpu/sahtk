from fastapi import APIRouter, HTTPException

from app.schemas.order import ContactIn
from app.services.phone import validate_saudi_phone
from app.services.sheets import send_order_webhook

router = APIRouter(prefix="/api", tags=["contact"])


@router.post("/contact")
async def contact(body: ContactIn):
    try:
        phone = validate_saudi_phone(body.phone)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    await send_order_webhook(
        {
            "type": "contact",
            "name": body.name,
            "phone": phone,
            "message": body.message,
        }
    )
    return {"ok": True}
