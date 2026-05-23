# صور Placeholder — حتى استبدالها

## المقاسات الموصى بها

| الاستخدام | المقاس | الصيغة |
|-----------|--------|--------|
| Hero منتج | 1200×1200 | WebP |
| معرض (×4) | 1200×1200 | WebP |
| Hero رئيسية | 1920×1080 | WebP |
| UGC | 9:16 (1080×1920) | WebP |
| قبل/بعد | 800×600 | WebP |

## مسارات الملفات

```
frontend/public/
├── placeholders/
│   ├── home-hero.webp
│   ├── lab.webp
│   ├── product.svg          # SVG عام
│   └── ugc-1.webp … ugc-6.webp
└── products/
    ├── platinum-hair-gum/hero.webp, 1.webp …
    ├── anti-freeze-sparkling/…
    └── anti-freeze-powder/…
```

## SVG مؤقت

يمكن للمبرمج إنشاء `product.svg` بلون `#E8DFE4` ونص slug في المنتصف.

## فيديوهات

- TikTok/Snap: embed أو `<video poster="...">` مع lazy load
- لا autoplay صوت على الموبايل
