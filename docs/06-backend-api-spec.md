# مواصفات الواجهة الخلفية — FastAPI

## Stack

- Python 3.11+
- FastAPI + Uvicorn
- SQLAlchemy 2 + Alembic
- asyncpg أو psycopg2
- Pydantic v2
- httpx (webhooks + CAPI)

## هيكل المجلد

```
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   └── order.py
│   ├── schemas/
│   │   └── order.py
│   ├── routers/
│   │   ├── orders.py
│   │   ├── tracking.py
│   │   └── health.py
│   ├── services/
│   │   ├── phone_hash.py
│   │   ├── capi_meta.py
│   │   ├── capi_tiktok.py
│   │   ├── capi_snap.py
│   │   └── sheets_webhook.py
│   └── migrations/   # Alembic
├── alembic.ini
├── Dockerfile
├── requirements.txt
└── .env.example
```

## تشغيل Migrations عند البدء

```python
# main.py lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    run_alembic_upgrade()  # subprocess أو programmatic
    yield
```

**EasyPanel:** أمر التشغيل `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000`

## DATABASE_URL

```
postgresql://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable
```

داخل Docker network اسم الخدمة: `sahtk_database`.

---

## Endpoints

### `GET /health`

```json
{ "status": "ok", "db": "connected" }
```

### `POST /api/orders`

**Request:**

```json
{
  "customer_name": "نورة العتيبي",
  "phone": "0501234567",
  "items": [
    { "product_slug": "platinum-hair-gum", "offer_code": "double" }
  ],
  "source_url": "https://sahtk.shop/products/platinum-hair-gum",
  "lead_event_id": "uuid",
  "utm_source": "tiktok",
  "utm_medium": null,
  "utm_campaign": null,
  "utm_content": null,
  "fbp": "fb.1.xxx",
  "fbc": null
}
```

**Logic:**
1. تحقق `phone` → تطبيع سعودي
2. احسب `subtotal_sar`, `total_sar` من `products` config
3. أنشئ `order` + `order_items`
4. `order_number` = `NM-{YYYYMMDD}-{4digits}`
5. أرسل CAPI (Lead + Purchase) — انظر 08
6. أرسل `SHEETS_WEBHOOK_URL` (Google Apps Script)
7. أرسل `ORDER_WEBHOOK_URL` إن وُجد (Zapier/CRM)

**Response 201:**

```json
{
  "id": "uuid",
  "order_number": "NM-20260519-4821",
  "total_sar": 279,
  "status": "pending_confirmation",
  "upsell_available": true,
  "upsell_product_slug": "anti-freeze-powder"
}
```

### `POST /api/orders/{order_id}/upsell`

```json
{
  "product_slug": "anti-freeze-powder",
  "accept": true
}
```

- إذا `accept` ولم يُستخدم upsell: أضف سطر 99 ر.س، حدّث total، CAPI Purchase إضافي، webhook تحديث

### `POST /api/tracking/capi`

يستدعيه Frontend أيضاً لأحداث mid-funnel (مع dedup `event_id`).

```json
{
  "event_id": "uuid",
  "event_name": "AddToCart",
  "value": 279,
  "currency": "SAR",
  "product_ids": ["platinum-hair-gum"],
  "phone": "0501234567",
  "name": "نورة",
  "url": "https://sahtk.shop/...",
  "fbp": "...",
  "fbc": "..."
}
```

---

## نموذج DB

### `orders`

| column | type |
|--------|------|
| id | UUID PK |
| order_number | VARCHAR unique |
| customer_name | VARCHAR |
| phone | VARCHAR (مخزن E.164 normalized) |
| phone_hash_meta | VARCHAR nullable |
| subtotal_sar | NUMERIC |
| total_sar | NUMERIC |
| status | ENUM pending_confirmation, confirmed, shipped, cancelled |
| upsell_accepted | BOOLEAN default false |
| utm_* | VARCHAR nullable |
| fbp, fbc | VARCHAR nullable |
| source_url | TEXT |
| created_at | TIMESTAMPTZ |

### `order_items`

| column | type |
|--------|------|
| id | UUID |
| order_id | FK |
| product_slug | VARCHAR |
| offer_code | VARCHAR |
| quantity | INT |
| line_total_sar | NUMERIC |

---

## CORS

```python
allow_origins=["https://sahtk.shop", "http://localhost:3000"]
allow_methods=["GET", "POST", "OPTIONS"]
allow_headers=["*"]
```

---

## الأمان

- Rate limit على `POST /orders` (مثلاً 10/دقيقة/IP)
- Sheets webhook: رابط `SHEETS_WEBHOOK_URL` فقط (بدون سر)
- لا تسجّل أرقام كاملة في logs — mask `9665******67`
- Hash phone على الخادم فقط لـ CAPI

---

## requirements.txt (حد أدنى)

```
fastapi>=0.110
uvicorn[standard]>=0.29
sqlalchemy>=2.0
alembic>=1.13
psycopg2-binary>=2.9
pydantic>=2.7
pydantic-settings>=2.2
httpx>=0.27
python-dotenv>=1.0
```

انظر [templates/backend.env.example](./templates/backend.env.example)
