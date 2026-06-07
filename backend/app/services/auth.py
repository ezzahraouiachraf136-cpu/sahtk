from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

security = HTTPBearer(auto_error=False)
TOKEN_TTL_HOURS = 24


def create_admin_token() -> str:
    payload = {
        "sub": "admin",
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS),
        "iat": datetime.now(tz=timezone.utc),
    }
    return jwt.encode(payload, settings.app_secret, algorithm="HS256")


def verify_admin_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="مطلوب تسجيل الدخول",
        )
    try:
        payload = jwt.decode(
            credentials.credentials, settings.app_secret, algorithms=["HS256"]
        )
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=401, detail="رمز غير صالح")
        return credentials.credentials
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="انتهت الجلسة") from exc


def verify_admin_credentials(username: str, password: str) -> bool:
    if not settings.admin_username or not settings.admin_password:
        return False
    return (
        username == settings.admin_username and password == settings.admin_password
    )
