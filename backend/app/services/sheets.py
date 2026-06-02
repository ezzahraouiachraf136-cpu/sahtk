import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def send_order_to_sheets(order_payload: dict) -> None:
    if not settings.sheets_webhook_url:
        return
    headers = {"Content-Type": "application/json"}
    body = {"order": order_payload}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(
                settings.sheets_webhook_url, json=body, headers=headers
            )
            res.raise_for_status()
    except Exception as e:
        logger.warning("Sheets webhook failed: %s", e)


async def send_order_webhook(order_payload: dict) -> None:
    if not settings.order_webhook_url:
        return
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            await client.post(settings.order_webhook_url, json=order_payload)
    except Exception as e:
        logger.warning("Order webhook failed: %s", e)
