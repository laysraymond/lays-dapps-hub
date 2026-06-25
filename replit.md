# Lays Dapps Hub

Community-run directory of dApps, tools, and games built around the Ritual AI/crypto ecosystem.

## Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS (dark mode default)
- **ORM**: Prisma (PostgreSQL via Supabase)
- **Wallet**: wagmi + viem, EIP-6963 multi-wallet discovery
- **Session**: iron-session (httpOnly cookie, no Max-Age = browser session)

## Required Secrets (Replit Secrets panel)
- `SUPABASE_DATABASE_URL` — pooled connection (port 6543, PgBouncer)
- `SUPABASE_DIRECT_URL` — direct connection (port 5432, for migrations)
- `SESSION_SECRET` — random 32+ char string for iron-session

## Dev Commands
```bash
npm run dev        # start dev server
npm run db:push    # push schema to DB (uses SUPABASE_DIRECT_URL)
npm run db:seed    # seed the dapps dataset
npm run build      # production build
```

## Important Notes
- Database: Supabase Postgres ONLY — no SQLite ever
- Admin wallet: `0x620b04c69ba313d8cd841a5426646019881aa17c`
- All dApp visit links route through `/go/[id]` (never direct external links)
- Access fee: 0.001 RITUAL testnet token per browser session
- `/about` and `/admin` are NOT gated by the access fee

## User Preferences
- Use Prisma (never Drizzle or any other ORM)
- Use Supabase Postgres from the start (never SQLite)
- Dark mode default, light mode supported
- Design tokens defined in tailwind.config.ts (never hardcoded inline)
