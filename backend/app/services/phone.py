import re

SAUDI_MOBILE = re.compile(r"^966(5[013456789][0-9]{7})$")


def normalize_saudi_phone(raw: str) -> str:
    d = re.sub(r"[\s\-().]", "", raw.strip())
    if d.startswith("+"):
        d = d[1:]
    if d.startswith("00"):
        d = d[2:]
    if d.startswith("0") and len(d) == 10:
        d = "966" + d[1:]
    if d.startswith("5") and len(d) == 9:
        d = "966" + d
    return d


def validate_saudi_phone(raw: str) -> str:
    normalized = normalize_saudi_phone(raw)
    if not SAUDI_MOBILE.match(normalized):
        raise ValueError("أدخل رقم جوال سعودي صحيح يبدأ بـ 05")
    return normalized


def phone_display_national(normalized: str) -> str:
    if normalized.startswith("966") and len(normalized) == 12:
        return "0" + normalized[3:]
    return normalized
