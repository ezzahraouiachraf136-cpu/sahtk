import logging
import time
from typing import Any

import httpx

from app.config import settings
from app.services.hashing import hash_name_meta, hash_phone_meta, hash_phone_tiktok

logger = logging.getLogger(__name__)

EVENT_MAP_META = {
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Lead": "Lead",
    "Purchase": "Purchase",
}


async def send_capi_event(
    *,
    event_id: str,
    event_name: str,
    value: float | None = None,
    currency: str = "SAR",
    phone: str | None = None,
    name: str | None = None,
    url: str | None = None,
    fbp: str | None = None,
    fbc: str | None = None,
    order_id: str | None = None,
    product_ids: list[str] | None = None,
) -> None:
    await _meta_capi(
        event_id=event_id,
        event_name=event_name,
        value=value,
        currency=currency,
        phone=phone,
        name=name,
        url=url,
        fbp=fbp,
        fbc=fbc,
        order_id=order_id,
    )
    await _tiktok_events(
        event_id=event_id,
        event_name=event_name,
        value=value,
        currency=currency,
        phone=phone,
        url=url,
    )


async def _meta_capi(**kwargs: Any) -> None:
    if not settings.meta_pixel_id or not settings.meta_access_token:
        return
    event_name = EVENT_MAP_META.get(kwargs["event_name"])
    if not event_name:
        return

    user_data: dict[str, Any] = {}
    if kwargs.get("phone"):
        user_data["ph"] = [hash_phone_meta(kwargs["phone"])]
    if kwargs.get("name"):
        hashed = hash_name_meta(kwargs["name"])
        if hashed:
            user_data["fn"] = [hashed]
    if kwargs.get("fbp"):
        user_data["fbp"] = kwargs["fbp"]
    if kwargs.get("fbc"):
        user_data["fbc"] = kwargs["fbc"]

    custom_data: dict[str, Any] = {"currency": kwargs.get("currency", "SAR")}
    if kwargs.get("value") is not None:
        custom_data["value"] = kwargs["value"]
    if kwargs.get("order_id"):
        custom_data["order_id"] = kwargs["order_id"]

    event = {
        "event_name": event_name,
        "event_time": int(time.time()),
        "event_id": kwargs["event_id"],
        "action_source": "website",
        "event_source_url": kwargs.get("url") or "https://sahtk.shop",
        "user_data": user_data,
        "custom_data": custom_data,
    }

    payload: dict[str, Any] = {
        "data": [event],
        "access_token": settings.meta_access_token,
    }
    if settings.meta_test_event_code:
        payload["test_event_code"] = settings.meta_test_event_code

    url = f"https://graph.facebook.com/v18.0/{settings.meta_pixel_id}/events"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, json=payload)
            if res.status_code >= 400:
                logger.warning("Meta CAPI error: %s", res.text)
    except Exception as e:
        logger.warning("Meta CAPI failed: %s", e)


TIKTOK_EVENT_MAP = {
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Lead": "SubmitForm",
    "Purchase": "PlaceAnOrder",
}


async def _tiktok_events(**kwargs: Any) -> None:
    if not settings.tiktok_pixel_id or not settings.tiktok_access_token:
        return
    tt_event = TIKTOK_EVENT_MAP.get(kwargs["event_name"])
    if not tt_event:
        return

    user: dict[str, Any] = {}
    if kwargs.get("phone"):
        user["phone"] = hash_phone_tiktok(kwargs["phone"])

    properties: dict[str, Any] = {
        "currency": kwargs.get("currency", "SAR"),
        "contents": [],
    }
    if kwargs.get("value") is not None:
        properties["value"] = kwargs["value"]

    event_body = {
        "event": tt_event,
        "event_id": kwargs["event_id"],
        "timestamp": str(int(time.time())),
        "context": {"page": {"url": kwargs.get("url") or "https://sahtk.shop"}},
        "properties": properties,
    }
    if user:
        event_body["user"] = user

    payload = {
        "pixel_code": settings.tiktok_pixel_id,
        "event_source": "web",
        "event_source_id": settings.tiktok_pixel_id,
        "data": [event_body],
    }

    url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
    headers = {
        "Access-Token": settings.tiktok_access_token,
        "Content-Type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, json=payload, headers=headers)
            if res.status_code >= 400:
                logger.warning("TikTok Events API error: %s", res.text)
    except Exception as e:
        logger.warning("TikTok Events API failed: %s", e)
