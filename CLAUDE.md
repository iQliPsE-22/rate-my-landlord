# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rate My Landlord India — an anonymous landlord review platform for Indian tenants. Tenants can submit anonymous reviews and search landlord reviews before signing a lease. No authentication required for core flows.

## Commands

All commands run from the `frontend/` directory:

```bash
cd frontend
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build (also surfaces TypeScript errors)
npm run start        # Start production server
npm run lint         # Run ESLint
```

No test framework is configured.

## Architecture

This is a **monolithic Next.js application** (App Router) inside `frontend/`. There is no separate backend — API routes in `app/api/` serve as the backend, connecting directly to MongoDB via Mongoose.

### Data flow

```
Client Components (React, "use client")
  → fetch() to /api/* routes
    → Mongoose models → MongoDB
```

### Key directories

- `app/api/` — Backend API routes (reviews, landlords, landlord search/autocomplete, report)
- `app/` — Pages using App Router: home, `/submit`, `/search`, `/landlord/[slug]`
- `models/` — Mongoose schemas (Landlord, Review). Report schema is inline in `app/api/report/route.ts`
- `types/index.ts` — Shared TypeScript interfaces and constants (RED_FLAGS, CITIES, RATING_LABELS)
- `lib/mongodb.ts` — Singleton MongoDB connection with global cache (prevents connection pool exhaustion in serverless)
- `lib/utils.ts` — Helpers: `cn()`, `generateSlug()`, `calculateAggregateScore()`, `getScoreColor()`, `formatDate()`
- `components/ui/` — shadcn/ui primitives (Button, Card, Input, etc.)
- `components/` — Domain components (Header, SearchBar, LandlordCard, StarRating, RedFlagTags, ReviewItem)

### Important patterns

- **All pages are client components** (`"use client"`) that fetch data via `useEffect` + `fetch()`. No React Server Components are used for data fetching currently.
- **Landlord lookup on review submission**: `POST /api/reviews` does fuzzy slug matching to find-or-create a Landlord document, then recalculates aggregate scores and red flag counts.
- **Slug format**: `{name}-{city}-{pincode}-{randomSuffix}` — generated in `lib/utils.ts:generateSlug()`.
- **Autocomplete**: SearchBar uses a debounced (300ms) call to `/api/landlords/autocomplete` returning top 5 matches.
- **Aggregate scores**: Stored on the Landlord document and recalculated on every new review. Overall = average of 4 rating axes (deposit_return, maintenance, behaviour, rent_fairness).

### Database

MongoDB via Mongoose. Connection string in `MONGODB_URI` env var (`.env.local`). The Landlord model has indexes on name, slug (unique), city, pincodes, and a text index on name/city/address/phone_number.

## Styling

- Tailwind CSS 4 with shadcn/ui (Base-Vega style)
- Glass-morphism design: `backdrop-blur` + semi-transparent backgrounds
- Fonts: Inter (body), Manrope (headlines) — applied via `.font-headline`, `.font-body`, `.font-label` classes in `globals.css`
- Framer Motion for scroll-triggered animations on the homepage
- Accent color: `#afc4ff`

## Next.js Version Note

This project uses **Next.js 16** which has breaking changes from training data. When in doubt, check `node_modules/next/dist/docs/` for current API documentation. The AGENTS.md in `frontend/` contains this same warning.

## Environment Variables

Only `MONGODB_URI` is required. Other vars mentioned in README (Upstash Redis, NextAuth, Resend, PostHog) are planned but not yet implemented.
