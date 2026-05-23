# النشر — EasyPanel + Docker + GitHub

## البنية على EasyPanel

| خدمة | النطاق | المنفذ |
|------|--------|--------|
| frontend | sahtk.shop | 3000 |
| backend | api.sahtk.shop | 8000 |
| sahtk_database | داخلي فقط | 5432 |

## Docker — Frontend

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAP_PIXEL_ID
ENV NEXT_PUBLIC_*=$NEXT_PUBLIC_*
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## Docker — Backend

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```

## docker-compose (مرجع محلي)

```yaml
services:
  sahtk_database:
    image: postgres:16
    environment:
      POSTGRES_USER: sahtk
      POSTGRES_PASSWORD: sahtk
      POSTGRES_DB: sahtk
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable
    depends_on:
      - sahtk_database
    ports:
      - "8000:8000"

  frontend:
    build: ./backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```

## EasyPanel — خطوات

1. **PostgreSQL:** موجود — رابط الاتصال:
   `postgres://sahtk:sahtk@sahtk_database:5432/sahtk?sslmode=disable`
2. **Backend service:**
   - Build من GitHub `backend/`
   - Domain: `api.sahtk.shop`
   - Env من `backend.env.example`
3. **Frontend service:**
   - Build من `frontend/`
   - Domain: `sahtk.shop`
   - Build args للـ `NEXT_PUBLIC_*`
4. **SSL:** Let's Encrypt تلقائي
5. **CORS:** تأكد `https://sahtk.shop` في backend

## GitHub

```
main branch → EasyPanel auto-deploy (webhook)
```

`.gitignore`:
```
node_modules/
.next/
__pycache__/
.env
*.pyc
.venv/
```

## README جذر المشروع (مختصر للمبرمج)

```markdown
# Sahtk — نما للجمال

## تشغيل محلي
docker compose up --build

## الوثائق
راجع docs/README.md
```

## Health checks

- Frontend: `GET /` → 200
- Backend: `GET /health` → `{"status":"ok"}`

## النسخ الاحتياطي

- جدولة pg_dump يومي من EasyPanel أو cron
