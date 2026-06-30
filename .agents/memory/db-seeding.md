---
name: DB seeding pattern
description: How to reliably seed the Supabase Postgres DB in this Replit environment
---

**Working method:** Write a plain `.js` file in `prisma/`, run with `node prisma/seed.js` from project root.

Use `prisma.dapp.createMany({ data: [...], skipDuplicates: true })` — single round-trip, fast.

**Why ts-node / tsx fail:** Both time out in the Replit bash environment (90s limit). The TypeScript compilation step adds too much overhead over the Supabase connection latency.

**Why:** ts-node timed out multiple times; compiled-JS approach works consistently under 30s.

**How to apply:** Any future seed work: write plain JS, require `../node_modules/@prisma/client` directly, run with `node`.
