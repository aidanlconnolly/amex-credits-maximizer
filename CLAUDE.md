# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

`node` is at `/opt/homebrew/bin/node` and is not on PATH by default — prefix all npm commands:

```bash
PATH=/opt/homebrew/bin:$PATH npm run dev      # dev server at http://localhost:5175
PATH=/opt/homebrew/bin:$PATH npm run build    # tsc -b && vite build → dist/
PATH=/opt/homebrew/bin:$PATH npm run lint     # ESLint
```

No test suite. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) is enforced at build time — `npm run build` is the type-check. Prefix unused parameters with `_`.

## Architecture

**Single localStorage SPA.** All state lives in `localStorage` under the key `amex-credits.v1`. No backend, no API calls.

### Data flow

```
src/data/benefits.ts          ← static source of truth (credit definitions, fees)
src/types.ts                  ← all shared types
src/lib/credits.ts            ← pure business logic (period keys, status, ROI, past-period helpers)
src/lib/storage.ts            ← load/save StoredState to localStorage
src/hooks/useCredits.ts       ← single hook; owns all state; exposes granular updaters
src/App.tsx                   ← tab shell; wires hook → components
src/components/               ← presentational components; no direct state access
```

### Key types (`src/types.ts`)

- **`StoredState`** — everything persisted: `cards`, `creditStatus`, `enrolled`, `cardStartDates`, `totalSpend`
- **`creditStatus`** — `Record<periodKey, Record<creditId, CreditUsageEntry>>`. Period keys are strings like `"2025-05"` (monthly), `"2025-Q2"` (quarterly), `"2025-H1"` (semiannual), `"2025-annual"` (annual).
- **`cardStartDates`** — `Record<CardType, 'YYYY-MM'>`. Used to compute "Used Since Start" from the correct origin date.

### Period key scheme (`src/lib/credits.ts`)

`getPeriodKey(credit, date)` generates the storage key for any credit at any date. `getPeriodsFromStartToNow(credit, startDate, now)` returns all period keys from card open date to today — used for both the annual ROI tally and past-period history chips. `getPastPeriodLabels(credit, cardStartDate, now)` returns the same list minus the current period (for the chip UI).

Semiannual credits use **fixed halves** (`period: 'H1'` or `'H2'` on the credit object) — `saks_h1` and `saks_h2` are separate credit entries, not one credit with two periods.

### Adding or changing a credit

Edit `src/data/benefits.ts` only. The rest of the system derives everything from the credit definition. Fields that matter:
- `resetPeriod`: `'monthly' | 'quarterly' | 'annual' | 'semiannual'`
- `period`: only set for semiannual credits (`'H1'` or `'H2'`)
- `requiresEnrollment`: gates the toggle behind enrollment confirmation

After adding a credit, also update **`src/components/CardTradeoffs.tsx`** (`KEY_CREDITS` array) so it appears in the Card Guide tab.

## Styling

Tailwind v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**. All theme tokens live in `src/index.css` under `@theme { }`. Key custom tokens: `text-gold` / `bg-gold` (`#C9A84C`), `font-display` (Playfair Display serif), `font-sans` (DM Sans). Always-dark — `html.dark` is set in `index.html`; there is no light mode toggle.

shadcn was used only to initialize CSS variables and base styles. No shadcn UI primitive components (`Card`, `Button`, etc.) are installed — all component styling uses raw Tailwind classes.

## Deployment

Vercel auto-deploys on push to `main` → `amex-credits-maximizer.vercel.app`. The build output is `dist/` (Vite SPA). There is no `vercel.json` — Vercel is configured via the dashboard to rewrite `/* → /index.html` for client-side routing.
