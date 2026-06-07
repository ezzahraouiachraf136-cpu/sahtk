from datetime import date, datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.order import Order
from app.schemas.admin import (
    AdminLoginIn,
    AdminLoginOut,
    AdminOrderOut,
    AdminOrdersPageOut,
    MetricsOut,
    UpdateOrderStatusIn,
)
from app.services.admin_metrics import get_metrics, serialize_admin_order
from app.services.auth import create_admin_token, verify_admin_credentials, verify_admin_token

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=AdminLoginOut)
def admin_login(body: AdminLoginIn):
    if not verify_admin_credentials(body.username, body.password):
        raise HTTPException(status_code=401, detail="اسم المستخدم أو كلمة المرور غير صحيحة")
    return AdminLoginOut(token=create_admin_token())


@router.get("/me")
def admin_me(_token: str = Depends(verify_admin_token)):
    return {"ok": True, "role": "admin"}


@router.get("/metrics", response_model=MetricsOut)
def admin_metrics(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    db: Session = Depends(get_db),
    _token: str = Depends(verify_admin_token),
):
    today = date.today()
    if not date_to:
        date_to = today
    if not date_from:
        date_from = date_to - timedelta(days=29)
    return get_metrics(db, date_from, date_to)


@router.get("/orders", response_model=AdminOrdersPageOut)
def admin_list_orders(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _token: str = Depends(verify_admin_token),
):
    today = date.today()
    if not date_to:
        date_to = today
    if not date_from:
        date_from = date_to - timedelta(days=29)

    start = datetime.combine(date_from, datetime.min.time())
    end = datetime.combine(date_to + timedelta(days=1), datetime.min.time())

    filters = [Order.created_at >= start, Order.created_at < end]
    if status:
        filters.append(Order.status == status)
    if search:
        term = f"%{search.strip()}%"
        filters.append(
            or_(
                Order.customer_name.ilike(term),
                Order.phone.ilike(term),
                Order.order_number.ilike(term),
            )
        )

    total = db.scalar(select(func.count(Order.id)).where(*filters)) or 0
    orders = db.scalars(
        select(Order)
        .options(joinedload(Order.items))
        .where(*filters)
        .order_by(Order.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    ).unique().all()

    return AdminOrdersPageOut(
        total=total,
        page=page,
        limit=limit,
        orders=[AdminOrderOut(**serialize_admin_order(o)) for o in orders],
    )


@router.get("/orders/{order_id}", response_model=AdminOrderOut)
def admin_get_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    _token: str = Depends(verify_admin_token),
):
    order = db.scalar(
        select(Order).options(joinedload(Order.items)).where(Order.id == order_id)
    )
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")
    return AdminOrderOut(**serialize_admin_order(order))


@router.patch("/orders/{order_id}/status", response_model=AdminOrderOut)
def admin_update_order_status(
    order_id: UUID,
    body: UpdateOrderStatusIn,
    db: Session = Depends(get_db),
    _token: str = Depends(verify_admin_token),
):
    order = db.scalar(
        select(Order).options(joinedload(Order.items)).where(Order.id == order_id)
    )
    if not order:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")
    order.status = body.status
    db.commit()
    db.refresh(order)
    return AdminOrderOut(**serialize_admin_order(order))
