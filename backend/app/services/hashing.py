import hashlib
import re


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def hash_phone_meta(phone_digits: str) -> str:
    """Meta: digits only with country code, no + e.g. 966501234567"""
    digits = re.sub(r"\D", "", phone_digits)
    return sha256_hex(digits)


def hash_phone_tiktok(phone_digits: str) -> str:
    """TikTok: E.164 with + before hash"""
    digits = re.sub(r"\D", "", phone_digits)
    e164 = f"+{digits}"
    return sha256_hex(e164)


def hash_name_meta(full_name: str) -> str:
    first = full_name.strip().split()[0].lower() if full_name.strip() else ""
    return sha256_hex(first) if first else ""
