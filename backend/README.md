# Sahtk Backend API

FastAPI backend for [sahtk.shop](https://sahtk.shop) — orders, CAPI events, Google Sheets webhook.

## Deploy (EasyPanel)

| Setting | Value |
|---------|-------|
| Repo | `https://github.com/ezzahraouiachraf136-cpu/backend.git` |
| Domain | `api.sahtk.shop` |
| Port | `8000` |

### Environment variables

Copy from `.env.example`. Required:

```
DATABASE_URL=postgresql://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable
APP_ENV=production
APP_SECRET=<random-long-string>
CORS_ORIGINS=https://sahtk.shop
```

> `postgres://` also works — the app normalizes it to `postgresql://` automatically.

### Health check

```
GET /health → {"status":"ok"}
```

## Local development

```bash
docker compose up --build backend
```

Or from this folder:

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
