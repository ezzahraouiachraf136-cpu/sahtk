# المنتجات والعروض

## العروض (موحّدة لكل المنتجات)

| offer_code | quantity | price_sar | compare_at_sar | badge_ar | default |
|------------|----------|-----------|----------------|----------|---------|
| single | 1 | 199 | 199 | — | |
| double | 2 | 279 | 398 | الأكثر طلباً | ✓ |
| triple | 3 | 349 | 597 | أفضل قيمة | |

**العملة:** `SAR` — العرض للمستخدم: `199 ر.س`

## Upsell (مرة واحدة — 99 ر.س)

| طلب رئيسي | منتج upsell |
|-----------|-------------|
| platinum-hair-gum | anti-freeze-powder |
| anti-freeze-sparkling | platinum-hair-gum |
| anti-freeze-powder | anti-freeze-sparkling |

- السعر: **99 ر.س** — `offer_code: upsell`
- المدة: **12 ثانية** (قابل للتعديل 10–15)
- **لا يُعرض خصم 99 في أي مكان آخر**

## Slugs والأسماء

| slug | name_ar | name_en |
|------|---------|---------|
| platinum-hair-gum | علكة بلاتينية ضد تساقط الشعر | Platinum Hair Support Gum |
| anti-freeze-sparkling | مشروب غازي مضاد للتجمد | Anti-Freeze Sparkling |
| anti-freeze-powder | بودرة مضادة للتجمد | Anti-Freeze Powder |

## صور Placeholder

ضع في `frontend/public/products/{slug}/`:
- `hero.webp` — 1200×1200
- `1.webp` … `4.webp` — معرض

حتى التوفير: استخدم `/placeholders/product.svg` مع نص slug.

## منطق السلة

```typescript
interface CartLine {
  id: string; // uuid
  productSlug: string;
  offerCode: "single" | "double" | "triple";
  quantity: number; // من العرض (1/2/3)
  unitPriceSar: number; // سعر العرض الكامل للسطر
}
```

- نفس المنتج + نفس العرض → دمج أو استبدال (اختر: **استبدال** عند تغيير العرض)
- السعر = `offer.price_sar` وليس `quantity * 199`

## ترقية في السلة (AOV)

عند `single` فقط، اعرض:
> «وفّري 80 ر.س — حوّلي لعرض قطعتين بـ 279 ر.س»

زر يحدّث `offerCode` إلى `double`.

## API payload عنصر

```json
{
  "product_slug": "platinum-hair-gum",
  "offer_code": "double",
  "quantity": 2,
  "line_total_sar": 279
}
```

## Upsell payload

```json
{
  "parent_order_id": "uuid",
  "product_slug": "anti-freeze-powder",
  "offer_code": "upsell",
  "line_total_sar": 99
}
```

البيانات الكاملة في: [data/products.json](./data/products.json)
