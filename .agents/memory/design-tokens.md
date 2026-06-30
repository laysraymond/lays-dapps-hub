---
name: Design system tokens
description: Current Tailwind color palette and design decisions for Lays Dapps Hub
---

Primary accent: `#16C784` (Ritual emerald green) — replaces old teal `#0F6E56`

Backgrounds:
- bg-dark: `#050505`
- surface-dark: `#0f0f0f`
- surface-dark-2: `#161616`
- surface-dark-3: `#1c1c1c`

Borders: `border-dark: #1f1f1f`, `border-dark-2: #2a2a2a`

Text: primary `#FAFAFA`, secondary `#A1A1AA`, muted `#52525B`

Status: verified = `#16C784`, unverified = `#F59E0B`, reported = `#EF4444`

Card style: `bg-surface-dark border border-border-dark rounded-xl shadow-inner-glow` — NOT glassmorphism (backdrop-filter) in Tailwind classes, use `.glass` CSS class instead.

Button primary: emerald bg + shadow-glow-sm + text-bg-dark (black text on green)

**Why:** User requested premium Web3 look matching Stripe/Vercel/Linear quality with Ritual brand colors.
