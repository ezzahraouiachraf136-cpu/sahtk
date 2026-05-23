# مواصفات الواجهة الأمامية

## Stack

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 14.x | App Router, `output: 'standalone'` للـ Docker |
| React | 18 | مكونات |
| TypeScript | 5 | صارم |
| Tailwind CSS | 3.4 | تصميم |
| Zustand | 4 | سلة + UI checkout |
| react-hook-form + zod | | نموذج الطلب |
| uuid | | event_id للتتبع |

## هيكل المجلد المطلوب

```
frontend/
├── app/
│   ├── layout.tsx          # RTL, fonts, DeferredPixels
│   ├── page.tsx            # Home
│   ├── collections/page.tsx
│   ├── products/[slug]/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── thank-you/page.tsx
│   └── {policies}/page.tsx
├── components/
│   ├── Header.tsx, Footer.tsx, Logo.tsx
│   ├── CartDrawer.tsx, CheckoutModal.tsx, UpsellModal.tsx
│   ├── OfferSelector.tsx, ProductCard.tsx
│   ├── ProductPageClient.tsx
│   ├── DeferredPixels.tsx
│   ├── Testimonials.tsx, FaqAccordion.tsx
│   └── TrustBar.tsx, StickyMobileCta.tsx
├── lib/
│   ├── products.ts         # من data/products.json أو مضمّن
│   ├── phone.ts            # تحقق سعودي
│   ├── tracking.ts
│   ├── api.ts
│   └── utm.ts
├── store/cart.ts
├── public/products/...
├── Dockerfile
├── .env.example
└── next.config.js
```

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { remotePatterns: [] },
};
module.exports = nextConfig;
```

## RTL والخطوط

```tsx
// layout.tsx
<html lang="ar" dir="rtl">
```

Google Fonts:
- `Tajawal` — نصوص
- `Amiri` أو `Playfair Display` — عناوين (heading)

```css
/* globals.css */
:root {
  --brand-primary: #7A3E5C;
  --brand-primary-dark: #5E2F47;
  --brand-accent: #C9A962;
  --brand-bg: #FBF8F5;
  --brand-text: #2D2A2A;
  --brand-muted: #6B6565;
}
```

## Logo component

```tsx
// دائرة + S + نص
<div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white font-bold">
    S
  </motion.div>
  <motion.div>
    <span className="font-heading text-lg font-bold">نما للجمال</span>
    <span className="block text-[10px] tracking-widest text-brand-muted">YOUR HELT</span>
  </motion.div>
</div>
```

## OfferSelector

- 3 بطاقات راديو كبيرة
- عرض السعر + `compare_at` مشطوب
- شارة على `double`
- عند الاختيار: يخزن في state الصفحة + يُستخدم عند CTA

## CTA صفحة المنتج (سلوك إلزامي)

```typescript
function handlePrimaryCta() {
  addToCart({ productSlug, offerCode: selectedOffer });
  openCart(); // يفتح CartDrawer فوراً
  trackEvent("AddToCart", { value: price, productIds: [slug] });
}
```

## CartDrawer

- عرض العروض الترويجية لكل منتج في السلة
- أزرار ترقية عرض
- subtotal = مجموع `line_total_sar`
- زر إتمام → `openCheckout()`

## CheckoutModal

- z-index فوق السلة
- حقول: `customerName`, `phone`
- تحقق zod سعودي (انظر `07-checkout`)
- onSuccess: `createOrder` → `openUpsell` → لا redirect قبل upsell

## UpsellModal

- `setTimeout` 12000ms للإغلاق التلقائي
- قبول: `POST /orders/{id}/upsell`
- رفض أو انتهاء: `router.push(/thank-you?order_id=)`

## Sticky CTA (موبايل)

- يظهر بعد scroll 400px
- نفس سلوك CTA الرئيسي

## الصور المتناوبة

مكوّن `AlternatingSection`:

```tsx
<section className={`grid md:grid-cols-2 gap-8 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
  <div>{image}</motion.div>
  <div>{children}</motion.div>
</section>
```

## الأداء

- صور: `next/image` + WebP
- خطوط: `next/font/google`
- Pixels: **لا تحمّل في SSR** — `DeferredPixels` فقط
- Lazy load فيديوهات UGC

## متغيرات البيئة

انظر [templates/frontend.env.example](./templates/frontend.env.example)

## استبدال المسودة الحالية

احذف/استبدل:
- `priceMad` → `priceSar`
- `moroccanPhoneRegex` → سعودي
- منتجات massager/posture → الثلاث منتجات الجديدة
