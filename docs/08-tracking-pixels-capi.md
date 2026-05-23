# التتبع: Pixels + CAPI

## المبدأ: Dedup + تأجيل + تجزئة على الخادم

1. **كل حدث تحويل** يولّد `event_id` (UUID) واحداً.
2. **Pixel (ويب)** يرسل نفس `event_id` عبر `eventID` / `event_id`.
3. **CAPI (خادم)** يرسل نفس `event_id` + بيانات مجزّأة.
4. **لا تجزئة في المتصفح** — أرسل `phone` و `name` خاماً إلى API فقط عبر HTTPS.

---

## تأجيل تحميل Pixels (Core Web Vitals)

```tsx
// DeferredPixels.tsx — بعد window.load + requestIdleCallback أو 2.5s
useEffect(() => {
  const load = () => { injectMeta(); injectTikTok(); injectSnap(); flushEventQueue(); };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 2500 });
  } else {
    setTimeout(load, 2500);
  }
}, []);
```

- **لا** تضع scripts في `<head>` مباشرة.
- استخدم `tracking.ts` → `enqueue()` حتى يجهز Pixel.

---

## أحداث مطلوبة

| الحدث | Pixel Meta | TikTok | Snap | CAPI |
|-------|------------|--------|------|------|
| PageView | ✓ | page | PAGE_VIEW | اختياري |
| ViewContent | ✓ | ViewContent | VIEW_CONTENT | ✓ |
| AddToCart | ✓ | AddToCart | ADD_CART | ✓ |
| InitiateCheckout | ✓ | InitiateCheckout | START_CHECKOUT | ✓ |
| Lead | ✓ | SubmitForm | SIGN_UP | ✓ |
| Purchase | ✓ | PlaceAnOrder | PURCHASE | ✓ |

**العملة:** `SAR` في كل المنصات.

---

## Meta Pixel (ويب)

```javascript
fbq('track', 'Purchase', { value: 279, currency: 'SAR' }, { eventID: eventId });
```

**Dedup:** نفس `event_id` في CAPI payload:

```json
{
  "event_name": "Purchase",
  "event_time": 1716123456,
  "event_id": "same-uuid",
  "action_source": "website",
  "user_data": {
    "ph": ["<sha256>"],
    "fn": ["<sha256>"],
    "client_ip_address": "...",
    "client_user_agent": "...",
    "fbc": "...",
    "fbp": "..."
  },
  "custom_data": {
    "currency": "SAR",
    "value": 279
  }
}
```

---

## تجزئة الهاتف — Meta (CAPI)

**المصدر:** [Meta Customer Information Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/)

| خطوة | قاعدة Meta |
|------|------------|
| 1 | أزل الرموز والحروف والأصفار البادئة الزائدة |
| 2 | **رقم الهاتف مع رمز الدولة بدون +** |
| 3 | SHA-256 hex lowercase |

**مثال سعودي:**

```
إدخال: 0501234567
بعد التطبيع للتخزين: 966501234567
قبل الهاش (Meta ph): 966501234567
SHA256: <hex>
```

```python
import hashlib
import re

def normalize_phone_meta(phone_e164_digits: str) -> str:
    # phone_e164_digits = "966501234567" (بدون +)
    return re.sub(r"\D", "", phone_e164_digits)

def hash_meta(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

def hash_phone_meta(phone_normalized: str) -> str:
    return hash_meta(normalize_phone_meta(phone_normalized))
```

**الاسم (`fn`):** lowercase، بدون ترقيم — أول اسم فقط إن أمكن.

```python
def hash_name_meta(full_name: str) -> str:
    first = full_name.strip().split()[0].lower()
    return hash_meta(first)
```

---

## TikTok Events API

**الهاتف:** يقبل E.164 **مع +** أو بدون — للمطابقة الأفضل استخدم:

```
+966501234567
```

```python
def phone_for_tiktok(phone_digits: str) -> str:
    # phone_digits = 966501234567
    return f"+{phone_digits}"

def hash_tiktok_phone(phone: str) -> str:
    # TikTok: SHA-256 of normalized phone; with + per their docs
    return hashlib.sha256(phone.encode("utf-8")).hexdigest()
```

**إرسال مزدوج (اختياري آمن):** جرّب `phone` hashed مع `+966...` — راقب EMQ في TikTok Events Manager.

**event_id:** نفس UUID بين Pixel و Events API.

---

## Snapchat CAPI

- استخدم `client_dedup_id` = `event_id`
- `hashed_phone_number`: SHA-256 بعد E.164 مع `+` (تحقق من Snap docs — غالباً مشابه لـ Meta)
- `currency`: `SAR`

---

## Endpoint Backend `POST /api/tracking/capi`

```python
async def send_all_capi(payload: CapiPayload):
    if settings.META_PIXEL_ID and settings.META_ACCESS_TOKEN:
        await meta_capi.send(payload)
    if settings.TIKTOK_PIXEL_ID and settings.TIKTOK_ACCESS_TOKEN:
        await tiktok_events.send(payload)
    if settings.SNAP_PIXEL_ID and settings.SNAP_ACCESS_TOKEN:
        await snap_capi.send(payload)
```

**لا تكرار:** إذا فشل منصة، سجّل الخطأ — لا تعيد إرسال نفس `event_id` (idempotency في DB اختياري).

---

## متغيرات البيئة

انظر `templates/backend.env.example`:
- `META_PIXEL_ID`, `META_ACCESS_TOKEN`, `META_TEST_EVENT_CODE` (staging)
- `TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN`
- `SNAP_PIXEL_ID`, `SNAP_ACCESS_TOKEN`

Frontend:
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
- `NEXT_PUBLIC_SNAP_PIXEL_ID`
- `NEXT_PUBLIC_API_URL=https://api.sahtk.shop`

---

## UTM وحفظها

```typescript
// utm.ts — عند أول زيارة
const keys = ["utm_source","utm_medium","utm_campaign","utm_content"];
sessionStorage + إرسال مع الطلب
```

---

## قائمة تحقق قبل الإطلاق

- [ ] Test Events في Meta مع `TEST_EVENT_CODE`
- [ ] TikTok Test mode
- [ ] Snap Pixel Helper
- [ ] Dedup: نفس purchase لا يظهر مرتين في Events Manager
- [ ] Pixels تُحمّل بعد 2.5s — LCP < 2.5s على 4G
- [ ] لا يوجد hash في bundle الويب (ابحث عن `sha256` في frontend — يجب ألا يوجد)
