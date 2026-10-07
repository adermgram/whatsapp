# Shop dashboard

The owner's back office: log in, manage products (sizes, prices, stock, photos), and later orders, chats and
settings. It is a Next.js app that talks to the NestJS API in `../api`.

## Run it

1. Start the API (from `apps/api`): `npm run bot` (real WhatsApp) or `npm run start:dev` (API only).
2. Start the dashboard (from `apps/dashboard`): `npm run dev`
3. Open http://localhost:3001 and log in. The demo shop's login is `demo@shopbot.local` / `demo1234`
   (run `npm run seed` in `apps/api` to create it). **Change that password** under your account as soon as you log in.

## How it is wired

- The browser only ever talks to this app. `next.config.ts` forwards `/api/*` to the API, so everything is one
  origin: the login cookie is `HttpOnly` + `SameSite=Lax` and there is no CORS to configure.
- **`API_URL` is read when the dashboard is built** (`npm run build`), not when it starts. If your API is not at
  `http://localhost:3000`, set `API_URL` before building: `API_URL=https://api.example.com npm run build`.
- In the API's `.env`, `DASHBOARD_ORIGIN` must be this app's address (default `http://localhost:3001`). The API
  refuses state-changing requests that claim to come from any other website.
- `proxy.ts` sends visitors with no login cookie to `/login`. That is only a convenience; the API checks the
  signed login on every request.

## Next.js 16 notes

This version has breaking changes from older Next.js (see `AGENTS.md` and `node_modules/next/dist/docs/`). The ones
that shaped this app: middleware is now `proxy.ts`; pages that read the URL or `params` must do so behind
`<Suspense>` (cache components are on); photos are uploaded one at a time because the proxy buffers request
bodies up to `proxyClientMaxBodySize`.

## Photos

Photos are shrunk in the browser first (phone pictures are often 5-10 MB), then the API re-checks the bytes,
re-encodes to a clean JPEG of at most 1280px, and strips hidden data. Only JPG, PNG and WebP are accepted.
