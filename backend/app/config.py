from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgres://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable"
    )
    app_env: str = "development"
    app_secret: str = "change-me"
    cors_origins: str = "https://sahtk.shop,http://localhost:3000"

    sheets_webhook_url: str = ""
    sheets_webhook_secret: str = ""
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

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
