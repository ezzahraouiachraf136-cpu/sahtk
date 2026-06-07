# Sahtk Frontend

Next.js storefront for [sahtk.shop](https://sahtk.shop) — Arabic RTL, COD checkout, pixel tracking.

## Deploy (EasyPanel)

| Setting | Value |
|---------|-------|
| Repo | `https://github.com/ezzahraouiachraf136-cpu/frontend.git` |
| Domain | `sahtk.shop` |
| Port | `3000` |

### Build args (required)

```
NEXT_PUBLIC_API_URL=https://api.sahtk.shop
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=966500000000
```

Copy other vars from `.env.example` as needed.

## Admin dashboard

URL: `/admin` — login with backend `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Or via Docker from project root:

```bash
docker compose up --build frontend
```
