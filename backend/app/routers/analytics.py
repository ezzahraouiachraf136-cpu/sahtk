from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analytics import AnalyticsEvent
from app.schemas.admin import AnalyticsTrackIn

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/track")
def track_event(body: AnalyticsTrackIn, db: Session = Depends(get_db)):
    event = AnalyticsEvent(
        event_name=body.event_name,
        page_url=body.page_url,
        product_slug=body.product_slug,
        session_id=body.session_id,
        utm_source=body.utm_source,
        utm_medium=body.utm_medium,
        utm_campaign=body.utm_campaign,
        value=body.value,
        order_id=body.order_id,
    )
    db.add(event)
    db.commit()
    return {"ok": True}
