# 🏠 Rate My Landlord India

> Anonymous landlord reviews for Indian tenants. Think Glassdoor, but for the person who holds your deposit.

---

## What Is This?

Tenants in India sign leases with zero information about who they're dealing with. Deposits get withheld. Maintenance gets ignored. There's no platform in their corner.

**Rate My Landlord India** fixes that. Two things and two things only:

- A tenant who got burned can **submit an anonymous review**
- A tenant about to sign can **search a landlord's name and read reviews**

That's it. No listings. No maps. No broker tools. One sharp problem, solved cleanly.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR is critical — every landlord profile page must be Google-indexable |
| Styling | Tailwind CSS + shadcn/ui | Fast to build, consistent, already familiar |
| Database | MongoDB Atlas | Flexible schema for reviews + tags. Free tier covers MVP |
| Search | MongoDB Atlas Search | Full-text search on landlord names and pincodes. Built-in, no extra infra |
| Rate Limiting | Upstash Redis | Prevent review spam. Serverless, generous free tier |
| Auth | NextAuth.js (Email OTP) | Optional only — for "verified tenant" badge. No forced login anywhere |
| Hosting | Vercel | Zero config Next.js deploys |
| Analytics | PostHog (free tier) | Track search queries, submission funnel, drop-off points |
| Email | Resend | OTP emails for optional verification |

---

## Folder Structure

```
rate-my-landlord/
├── app/
│   ├── page.tsx                  # Homepage — search bar + submit CTA
│   ├── submit/
│   │   └── page.tsx              # Review submission form
│   ├── landlord/
│   │   └── [slug]/
│   │       └── page.tsx          # Landlord profile page (SSR, SEO-indexed)
│   ├── search/
│   │   └── page.tsx              # Search results page
│   └── api/
│       ├── reviews/
│       │   └── route.ts          # POST /api/reviews — submit a review
│       ├── landlords/
│       │   ├── route.ts          # GET /api/landlords — search landlords
│       │   └── [id]/
│       │       └── route.ts      # GET /api/landlords/:id — landlord profile
│       └── report/
│           └── route.ts          # POST /api/report — flag a review
├── components/
│   ├── ReviewForm.tsx            # The submission form
│   ├── LandlordCard.tsx          # Card used in search results
│   ├── LandlordProfile.tsx       # Full profile with all reviews
│   ├── StarRating.tsx            # Reusable star rating component
│   ├── RedFlagTags.tsx           # Tag selector / display
│   ├── ReviewItem.tsx            # Single review display
│   └── SearchBar.tsx             # Homepage search input
├── lib/
│   ├── mongodb.ts                # MongoDB connection singleton
│   ├── ratelimit.ts              # Upstash Redis rate limiting helper
│   └── utils.ts                  # Shared helpers (slug gen, score calc, etc.)
├── models/
│   ├── Landlord.ts               # Mongoose schema
│   └── Review.ts                 # Mongoose schema
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## Data Models

### Landlord

```ts
{
  _id: ObjectId,
  name: string,                  // "Rakesh Sharma"
  slug: string,                  // "rakesh-sharma-delhi-110092" (URL-safe, unique)
  city: string,
  pincodes: string[],            // landlord can have properties in multiple pincodes
  review_count: number,
  aggregate_score: {
    overall: number,             // 1.0 to 5.0
    deposit_return: number,
    maintenance: number,
    behaviour: number,
    rent_fairness: number,
  },
  red_flag_counts: {
    withheld_deposit: number,
    no_maintenance: number,
    harassment: number,
    illegal_entry: number,
    arbitrary_hike: number,
    ghost_landlord: number,
  },
  created_at: Date,
  updated_at: Date,
}
```

### Review

```ts
{
  _id: ObjectId,
  landlord_id: ObjectId,         // ref to Landlord
  city: string,
  pincode: string,
  tenancy_period: string,        // "2021-2023" (user typed, not enforced)
  ratings: {
    deposit_return: number,      // 1 to 5
    maintenance: number,
    behaviour: number,
    rent_fairness: number,
  },
  red_flags: string[],           // ["withheld_deposit", "no_maintenance"]
  text: string,                  // optional free text review
  is_verified_tenant: boolean,   // true if email OTP completed
  reviewer_email_hash: string,   // SHA-256 of email, never stored raw
  is_flagged: boolean,
  flag_reason: string,
  created_at: Date,
}
```

---

## Core API Routes

### `POST /api/reviews`
Submit a new review. No auth required.

**Body:**
```json
{
  "landlord_name": "Rakesh Sharma",
  "city": "Delhi",
  "pincode": "110092",
  "tenancy_period": "2022-2024",
  "ratings": {
    "deposit_return": 1,
    "maintenance": 2,
    "behaviour": 1,
    "rent_fairness": 3
  },
  "red_flags": ["withheld_deposit", "harassment"],
  "text": "Kept full 2 month deposit. No response to maintenance for 4 months.",
  "reviewer_email": "optional@email.com"
}
```

**Logic:**
1. Rate limit by IP via Upstash (max 3 submissions per 24h per IP)
2. Fuzzy match landlord name + city to find or create a Landlord document
3. Insert Review document
4. Recalculate and update aggregate scores on Landlord document
5. Return the landlord slug for redirect

---

### `GET /api/landlords?q=rakesh&city=delhi&pincode=110092`
Search landlords. Powered by MongoDB Atlas Search.

Returns array of landlord cards sorted by review count descending.

---

### `GET /api/landlords/:id`
Full landlord profile with paginated reviews.

---

### `POST /api/report`
Flag a review as fake or malicious. Queued for manual review.

---

## Pages

### `/` — Homepage
- Big search bar front and centre: "Search your landlord's name"
- Secondary CTA: "Had a bad experience? Write a review"
- Minimal. Fast. No clutter.

### `/submit` — Review Form
- Step 1: Landlord name + city + pincode
- Step 2: Star ratings for all 4 axes
- Step 3: Red flag tag selection (multi-select chips)
- Step 4: Optional text + optional email for verified badge
- No login. No account. Submit and done.

### `/landlord/[slug]` — Landlord Profile
- Server-side rendered (critical for SEO)
- Aggregate score card at the top
- Red flag summary (e.g. "4 out of 6 reviewers reported withheld deposit")
- Timeline of all reviews, newest first
- Each review shows: ratings, tags, text, date, verified badge if applicable
- "Flag this review" link on each review

### `/search` — Search Results
- Grid of LandlordCards matching the query
- Each card: name, city, overall score, top red flags, review count
- Filter by pincode

---

## Red Flag Tags (MVP Set)

```ts
const RED_FLAGS = [
  { id: "withheld_deposit",  label: "Withheld Deposit" },
  { id: "no_maintenance",    label: "Ignored Maintenance" },
  { id: "harassment",        label: "Harassment" },
  { id: "illegal_entry",     label: "Entered Without Notice" },
  { id: "arbitrary_hike",    label: "Arbitrary Rent Hike" },
  { id: "ghost_landlord",    label: "Unreachable / Ghost" },
]
```

---

## Spam Prevention

Using Upstash Redis for serverless rate limiting:

```ts
// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "24 h"), // 3 reviews per IP per day
})
```

Applied on `POST /api/reviews` before any DB write.

---

## SEO Strategy

Every landlord profile is a static-ish SSR page at `/landlord/[slug]`. The slug is formatted as:

```
rakesh-sharma-delhi-110092
```

This means Google indexes pages for queries like:
- "rakesh sharma landlord delhi review"
- "landlord review 110092"
- "is rakesh sharma a good landlord"

These are zero-competition queries with real search intent. This is the organic growth engine.

Use `generateMetadata` in Next.js App Router on the profile page:

```ts
export async function generateMetadata({ params }) {
  const landlord = await getLandlord(params.slug)
  return {
    title: `${landlord.name} Landlord Reviews — ${landlord.city} | Rate My Landlord`,
    description: `Read ${landlord.review_count} tenant reviews for ${landlord.name} in ${landlord.city}.`,
  }
}
```

---

## Environment Variables

```env
MONGODB_URI=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXTAUTH_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## MVP Build Plan (6 Weeks)

```
Week 1-2   Scaffold, MongoDB schemas, API routes (submit + search), basic components
Week 3-4   Review form UI, landlord profile page, search results page, mobile responsive
Week 5     Rate limiting, abuse report flow, QA pass, performance check
Week 6     Deploy to Vercel, custom domain, analytics, soft launch
```

---

## What Is NOT in MVP

To keep this shippable in 6 weeks, these are explicitly deferred:

- Email OTP verification (V1.1)
- Landlord claim and response feature (V1.1)
- Chrome extension overlay on MagicBricks / 99acres (V1.2)
- City leaderboards (V2)
- Paid landlord badge / monetization (V2)
- Broker reviews (V2)
- WhatsApp share card (V2)

---

## Running Locally

```bash
git clone https://github.com/iQliPsE-22/rate-my-landlord
cd rate-my-landlord
npm install
cp .env.example .env.local
# fill in your env vars
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Contributing

This is a two-person build for now. Before starting any feature:

1. Check the MVP scope above — if it's not listed, it's not in scope yet
2. Create a branch: `feature/your-feature-name`
3. Keep components small and typed
4. No feature flags needed at this stage — ship clean or don't ship

---

*Built by Deepak. If a tenant in India can find one bad landlord before signing, this worked.*
