# تعليمات المبرمج — انسخ من هنا إلى محرر الذكاء الاصطناعي

---

## المهمة

ابنِ متجر DTC سعودي كامل لعلامة **نما للجمال** (`YOUR HELT`) على النطاق `sahtk.shop` مع API على `api.sahtk.shop`.  
**اقرأ كل الملفات في مجلد `docs/` قبل كتابة أي كود.**  
**استبدل بالكامل** أي كود قديم في `frontend/` (عملة MAD، جوال مغربي، منتجات خاطئة).

---

## المخرجات المطلوبة

```
sahtk/
├── docs/                 # موجود — لا تحذف
├── frontend/             # Next.js 14 + TS + Tailwind + Zustand
├── backend/              # FastAPI + PostgreSQL + Alembic
├── sheets/order-webhook.gs
├── README.md
└── .gitignore
```

لكل من `frontend/` و `backend/`:
- `Dockerfile`
- `.env.example` (من `docs/templates/`)
- جاهز للنشر على EasyPanel + GitHub

---

## العلامة

- شعار: دائرة `#7A3E5C` + حرف **S** + «نما للجمال» + `YOUR HELT`
- RTL عربي، لهجة سعودية من `docs/03-copywriting-saudi.md`
- 3 منتجات من `docs/data/products.json`
- عروض: 199 / 279 / 349 ر.س — upsell **99 ر.س فقط** بعد الطلب (12 ثانية)

---

## تدفق التحويل (إلزامي)

1. صفحة منتج → اختيار عرض → CTA **يفتح السلة** (لا checkout مباشر)
2. السلة تعرض العروض + ترقية AOV
3. إتمام → `CheckoutModal`: اسم + **جوال سعودي** (`docs/07-checkout-conversion-flow.md`)
4. `POST /api/orders` → Upsell modal → Thank you
5. Webhook إلى Google Sheets (`sheets/order-webhook.gs`)

---

## Backend

- FastAPI، DB: `postgresql://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable`
- **Alembic upgrade عند التشغيل**
- Endpoints: `docs/06-backend-api-spec.md`
- CAPI: Meta + TikTok + Snap — **تجزئة SHA256 للهاتف على الخادم فقط**
  - Meta `ph`: `9665XXXXXXXX` بدون `+` ثم SHA256
  - TikTok: `+9665XXXXXXXX` ثم SHA256
  - Dedup: نفس `event_id` من Pixel والـ API

---

## Tracking

- Pixels **مؤجلة** بعد load + requestIdleCallback (`docs/08-tracking-pixels-capi.md`)
- `DeferredPixels.tsx` + queue في `tracking.ts`
- لا hash في frontend

---

## الصفحات

`/`, `/collections`, `/products/[slug]`, `/about`, `/contact`, `/thank-you`, policies  
هيكل كل صفحة: `docs/02-site-architecture.md`  
تصميم: `docs/11-design-system.md`

---

## بيانات

استورد من:
- `docs/data/products.json`
- `docs/data/testimonials.json`
- `docs/data/faq.json`
- `docs/data/home-sections.json`

صور: placeholders حتى `docs/data/placeholders-images.md`

---

## اختبارات قبول

- [ ] جوال `0501234567` يُقبل؛ `0612345678` يرفض
- [ ] CTA يفتح السلة مع العرض المختار
- [ ] Upsell 99 ر.س مرة واحدة ثم thank-you
- [ ] صف منتبق في Google Sheet
- [ ] Purchase في Meta/TikTok مع dedup
- [ ] Docker build ينجح
- [ ] أقسام منتج: نص/صورة متناوبة على desktop

---

## ترتيب التنفيذ

1. Backend + migrations + orders API
2. Frontend shell + products + cart/checkout/upsell
3. Tracking + CAPI
4. Docker + env examples + README
5. Polish + responsive

**لا تتوقف عند المسودة القديمة — طابق الوثائق 100%.**

---
