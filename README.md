# Princess Economy

> Reality — but make it aesthetic.

A playful dating market reality calculator. Premium, calm, witty.

## Stack

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Local state (React Context)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel — zero-config deployment.

## Stripe Integration

Paywall modal is scaffolded in `/app/result/page.tsx`.
Replace the `onClick` handler in the "Unlock Now" button with your Stripe Checkout:

```ts
import Stripe from "stripe";

// In your API route: /app/api/checkout/route.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: "YOUR_PRICE_ID", quantity: 1 }],
  success_url: `${process.env.NEXT_PUBLIC_URL}/result?paid=1`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/result`,
});
```

Set env vars in Vercel:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_URL`

## Image Download

Uses `html2canvas`. Already in `package.json`. No extra setup needed.

## Scoring

All logic lives in `/lib/scoring.ts`. Fully documented.
All outputs are clearly labeled "model estimates." No scientific claims.

## Folder Structure

```
princess-economy/
├── app/
│   ├── page.tsx          # Landing
│   ├── calc/page.tsx     # Calculator
│   ├── result/page.tsx   # Results + share card
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── scoring.ts        # Core algorithm
│   ├── regions.ts        # Currency/region utils
│   └── store.tsx         # Global state (React Context)
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```
