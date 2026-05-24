# Sahtk — نما للجمال (YOUR HELT)

متجر DTC سعودي — `sahtk.shop` | API: `api.sahtk.shop`

## الوثائق (ابدأ هنا)

**[docs/README.md](./docs/README.md)** — فهرس كامل للمبرمج.

**تعليمات جاهزة للنسخ:** [docs/PROMPT-FOR-AI-DEVELOPER.md](./docs/PROMPT-FOR-AI-DEVELOPER.md)

## الحالة الحالية

| المكون | الحالة |
|--------|--------|
| docs/ | ✅ جاهز |
| sheets/order-webhook.gs | ✅ جاهز |
| frontend/ | ✅ محدّث (SAR، 3 منتجات، جوال سعودي) |
| backend/ | ✅ FastAPI + Alembic + CAPI + Sheets webhook |

## تشغيل محلي (بعد اكتمال المبرمج)

```bash
docker compose up --build
```

## قاعدة البيانات (EasyPanel)

```
postgresql://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable
```

## Google Sheets

1. أنشئ ورقة من `docs/data/orders-sheet-template.csv`
2. انشر `sheets/order-webhook.gs`
3. ضع URL في `SHEETS_WEBHOOK_URL`
