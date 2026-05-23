# نظام التصميم — نما للجمال

## فلسفة بصرية

**فاخر · أنثوي · سعودي معاصر** — يشبه علامة عناية premium وليس متجراً رخيصاً.

## الألوان

| Token | Hex | الاستخدام |
|-------|-----|-----------|
| brand-primary | `#7A3E5C` | دائرة S، أزرار رئيسية |
| brand-primary-dark | `#5E2F47` | hover |
| brand-accent | `#C9A962` | شارات، نجوم، تمييز |
| brand-bg | `#FBF8F5` | خلفية الصفحة |
| brand-surface | `#FFFFFF` | بطاقات |
| brand-text | `#2D2A2A` | نص |
| brand-muted | `#6B6565` | ثانوي |
| brand-success | `#2D6A4F` | COD، نجاح |
| brand-urgency | `#B84C3A` | ندرة (باعتدال) |

## Tailwind config

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        primary: "#7A3E5C",
        "primary-dark": "#5E2F47",
        accent: "#C9A962",
        bg: "#FBF8F5",
        muted: "#6B6565",
      },
    },
    fontFamily: {
      sans: ["var(--font-tajawal)", "sans-serif"],
      heading: ["var(--font-tajawal)", "sans-serif"],
    },
    borderRadius: {
      card: "1rem",
      pill: "9999px",
    },
  },
},
```

## Typography

| العنصر | الحجم | الوزن |
|--------|-------|-------|
| H1 Hero | 2rem–2.5rem | 700 |
| H2 Section | 1.5rem | 700 |
| Body | 1rem | 400 |
| Small trust | 0.875rem | 500 |

## المكونات

### OfferSelector
- بطاقة محددة: border-primary + shadow
- شارة `الأكثر طلباً` على double — `bg-brand-accent text-brand-text`

### ProductCard
- صورة 1:1، rounded-card
- نجوم ذهبية
- سعر من `199 ر.س`

### أزرار
- Primary: `bg-brand-primary text-white rounded-full px-8 py-4`
- Secondary: outline primary

### CartDrawer
- عرض من اليمين `translate-x` RTL
- عرض 100% موبايل، max-w-md ديسكتوب

## Placeholders

`public/placeholders/product.svg` — مستطيل `#E8DFE4` مع نص slug.

## Responsive breakpoints

- mobile: < 768 — عمود واحد، sticky CTA
- tablet: 768–1024
- desktop: > 1024 — أقسام متناوبة

## الحركة

- `transition` على hover البطاقات
- عدّاد upsell: progress bar
- لا parallax ثقيل (أداء)

## أيقونات

Lucide-react أو SVG inline — COD، شحن، درع، نجمة.
