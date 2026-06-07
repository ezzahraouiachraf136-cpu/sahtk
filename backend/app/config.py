from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(value: str) -> str:
    if value.startswith("postgres://"):
        return value.replace("postgres://", "postgresql://", 1)
    return value


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgresql://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable"
    )
    app_env: str = "development"
    app_secret: str = "change-me"
    admin_username: str = ""
    admin_password: str = ""
    cors_origins: str = (
        "https://sahtk.shop,http://localhost:3000,http://localhost:3001,http://localhost:3002"
    )

    sheets_webhook_url: str = ""
    order_webhook_url: str = ""

    meta_pixel_id: str = ""
    meta_access_token: str = ""
    meta_test_event_code: str = ""

    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""

    snap_pixel_id: str = ""
    snap_access_token: str = ""

    upsell_timeout_ms: int = 12000
    upsell_price_sar: int = 99

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        return normalize_database_url(value)

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
