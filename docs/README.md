# نما للجمال — حزمة وثائق المشروع (Sahtk)

> **الغرض:** تسليم مبرمج الذكاء الاصطناعي كل ما يلزم لبناء متجر DTC سعودي عالي التحويل لعلامة **نما للجمال** (`YOUR HELT`) على `sahtk.shop`.

## ابدأ هنا

| الترتيب | الملف | المحتوى |
|--------|------|---------|
| 0 | [00-MASTER-BRIEF.md](./00-MASTER-BRIEF.md) | ملخص تنفيذي + قرارات ثابتة |
| 1 | [01-brand-and-positioning.md](./01-brand-and-positioning.md) | العلامة، الجمهور، التموضع |
| 2 | [02-site-architecture.md](./02-site-architecture.md) | خريطة الموقع، الأقسام، RTL |
| 3 | [03-copywriting-saudi.md](./03-copywriting-saudi.md) | نصوص جاهزة باللهجة السعودية |
| 4 | [04-products-and-offers.md](./04-products-and-offers.md) | المنتجات، العروض، الـ upsell |
| 5 | [05-frontend-spec.md](./05-frontend-spec.md) | Next.js، المكونات، القواعد |
| 6 | [06-backend-api-spec.md](./06-backend-api-spec.md) | FastAPI، DB، الطلبات |
| 7 | [07-checkout-conversion-flow.md](./07-checkout-conversion-flow.md) | السلة → الدفع → شكر |
| 8 | [08-tracking-pixels-capi.md](./08-tracking-pixels-capi.md) | Meta/TikTok/Snap + CAPI |
| 9 | [09-deployment-easypanel.md](./09-deployment-easypanel.md) | Docker، EasyPanel، GitHub |
| 10 | [10-google-sheets-webhook.md](./10-google-sheets-webhook.md) | ورقة العمل + Apps Script |
| 11 | [11-design-system.md](./11-design-system.md) | ألوان، خطوط، UI |
| 12 | [12-legal-trust-pages.md](./12-legal-trust-pages.md) | سياسات، ثقة، امتثال |

## بيانات جاهزة للاستيراد

- [data/products.json](./data/products.json)
- [data/testimonials.json](./data/testimonials.json)
- [data/faq.json](./data/faq.json)
- [data/home-sections.json](./data/home-sections.json)
- [data/orders-sheet-template.csv](./data/orders-sheet-template.csv)

## قوالب للنشر

- [templates/frontend.env.example](./templates/frontend.env.example)
- [templates/backend.env.example](./templates/backend.env.example)
- [../sheets/order-webhook.gs](../sheets/order-webhook.gs) — كود Google Apps Script

## تعليمات المبرمج

**انسخ المحتوى كاملاً من:** [PROMPT-FOR-AI-DEVELOPER.md](./PROMPT-FOR-AI-DEVELOPER.md)

## تنبيه مهم عن الكود الحالي

مجلد `frontend/` الموجود يحتوي على **مسودة قديمة** (عملة MAD، أرقام مغربية، منتجات مختلفة). **يجب استبدالها بالكامل** وفق هذه الوثائق — لا تدمج المسودة القديمة.

## النطاقات والبنية

| الخدمة | العنوان |
|--------|---------|
| المتجر | `https://sahtk.shop` |
| API | `https://api.sahtk.shop` |
| قاعدة البيانات | `postgres://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable` |
| اسم DB | `Sahtk` |
