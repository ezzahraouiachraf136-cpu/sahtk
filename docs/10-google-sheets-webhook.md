# Google Sheets + Webhook

## الهدف

كل طلب جديد (وتحديث upsell) يُرسل إلى Google Apps Script → صف في ورقة **الورقة1** بالأعمدة العربية.

## إعداد الورقة

1. أنشئ Google Sheet (أو استخدم الملف الحالي)
2. الصف الأول — العناوين من [data/orders-sheet-template.csv](./data/orders-sheet-template.csv)
3. Extensions → Apps Script → الصق `sheets/order-webhook.gs`
4. إن كان اسم الورقة مختلفاً عن `الورقة1`، عدّل `SHEET_NAME` في السكربت
5. Deploy → **Web app**
   - Execute as: Me
   - Who has access: **Anyone**
6. انسخ رابط النشر إلى `SHEETS_WEBHOOK_URL` في EasyPanel (backend)

**لا حاجة لكلمة سر** — الرابط فقط.

## أعمدة الورقة

| العمود | مثال |
|--------|------|
| التاريخ | 01/05/2026 |
| رقم الطلب | nama-20260501-4821 |
| الدولة | المملكة العربية السعودية |
| الاسم | نورة |
| رقم الهاتف | 96650475233 |
| المنتج | علكة بلاتينية/بودرة مضادة للتجمد |
| رمز المنتج | 7824/3167 |
| الكمية | 2/1 |
| السعر الإجمالي | 378 |
| العملة | ريال سعودي |
| الحالة | *(فارغ)* |

## Payload من Backend

```json
{
  "order": {
    "id": "uuid",
    "order_number": "nama-20260501-4821",
    "date": "01/05/2026",
    "country": "المملكة العربية السعودية",
    "customer_name": "نورة",
    "phone": "966501234567",
    "products_ar": "علكة بلاتينية ضد تساقط الشعر",
    "skus": "7824",
    "quantities": "2",
    "total_sar": 279,
    "currency": "ريال سعودي",
    "status": ""
  }
}
```

## رموز المنتجات (SKU)

| المنتج | الرمز |
|--------|-------|
| علكة بلاتينية | 7824 |
| مشروب غازي | 4593 |
| بودرة مضادة للتجمد | 3167 |

## تحديث Upsell

عند قبول العرض الإضافي يُحدَّث نفس الصف (نفس `order_number`) بالمنتجات والكميات والسعر الجديد.

## اختبار

```bash
curl -X POST "$SHEETS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"order":{"order_number":"nama-test-0001","date":"01/05/2026","country":"المملكة العربية السعودية","customer_name":"اختبار","phone":"966501234567","products_ar":"علكة بلاتينية","skus":"7824","quantities":"2","total_sar":279,"currency":"ريال سعودي","status":""}}'
```

الكود: [../sheets/order-webhook.gs](../sheets/order-webhook.gs)
