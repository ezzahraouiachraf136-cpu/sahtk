# Google Sheets + Webhook

## Sheet columns (Sheet1)

| Column | Example |
|--------|---------|
| date | 01/05/2026 |
| orders | nama-20260501-4821 |
| country | KSA |
| name | Noura |
| phons | 96650475233 |
| product | علكة بلاتينية/بودرة مضادة للتجمد |
| sku | 7824/3167 |
| quantity | 2/1 |
| total price | 378 |
| currency | SAR |
| status | *(empty)* |

## Setup

1. Create Google Sheet — tab name **Sheet1** (or change `SHEET_NAME` in script)
2. Row 1 headers from [orders-sheet-template.csv](./data/orders-sheet-template.csv)
3. Extensions → Apps Script → paste `sheets/order-webhook.gs`
4. Deploy → Web app → Execute as Me → **Anyone**
5. Copy URL to `SHEETS_WEBHOOK_URL` in backend (no secret)

## Product SKUs

| Product | SKU |
|---------|-----|
| علكة بلاتينية | 7824 |
| مشروب غازي | 4593 |
| بودرة مضادة للتجمد | 3167 |

## Payload

```json
{
  "order": {
    "date": "01/05/2026",
    "order_number": "nama-20260501-4821",
    "country": "KSA",
    "customer_name": "Noura",
    "phone": "966501234567",
    "products_ar": "علكة بلاتينية ضد تساقط الشعر",
    "skus": "7824",
    "quantities": "2",
    "total_sar": 279,
    "currency": "SAR",
    "status": ""
  }
}
```

Upsell updates the same row (matched by `order_number`).
