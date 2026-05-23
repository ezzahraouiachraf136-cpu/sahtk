# Google Sheets + Webhook

## الهدف

كل طلب جديد (وتحديث upsell) يُرسل إلى Google Apps Script → صف جديد في ورقة «الطلبات».

## إعداد الورقة

1. أنشئ Google Sheet باسم **Sahtk Orders**
2. استورد الأعمدة من [data/orders-sheet-template.csv](./data/orders-sheet-template.csv)
3. Extensions → Apps Script → الصق `sheets/order-webhook.gs`
4. Deploy → **Web app**
   - Execute as: Me
   - Who has access: **Anyone** (للاستقبال من API — يُؤمَّن بـ secret)
5. انسخ URL إلى `SHEETS_WEBHOOK_URL` في backend

## أعمدة الورقة

| العمود | الوصف |
|--------|--------|
| timestamp | وقت الاستلام |
| order_id | UUID |
| order_number | NM-20260519-0001 |
| customer_name | الاسم |
| phone | 9665... |
| items_json | JSON للعناصر |
| subtotal_sar | |
| total_sar | |
| status | pending_confirmation |
| upsell_accepted | true/false |
| utm_source | |
| utm_campaign | |
| source_url | |

## أمان Webhook

**Header من Backend:**

```
X-Webhook-Secret: <SHEETS_WEBHOOK_SECRET>
```

**في Apps Script:** رفض إذا لا يطابق.

## Payload من Backend

```json
{
  "secret": "optional-if-not-header",
  "order": {
    "id": "uuid",
    "order_number": "NM-20260519-4821",
    "customer_name": "نورة",
    "phone": "966501234567",
    "items": [
      {
        "product_slug": "platinum-hair-gum",
        "offer_code": "double",
        "quantity": 2,
        "line_total_sar": 279
      }
    ],
    "subtotal_sar": 279,
    "total_sar": 279,
    "status": "pending_confirmation",
    "upsell_accepted": false,
    "utm_source": "tiktok",
    "source_url": "https://sahtk.shop/..."
  }
}
```

## تحديث Upsell

نفس endpoint — إذا `upsell_accepted: true` ابحث عن `order_id` وحدّث الصف أو أضف صف «تعديل».

## CSV للاستيراد الأولي

استخدم `data/orders-sheet-template.csv` — صف عناوين فقط.

## اختبار

```bash
curl -X POST "$SHEETS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret" \
  -d @docs/data/sample-order-payload.json
```

الكود الكامل: [../sheets/order-webhook.gs](../sheets/order-webhook.gs)
