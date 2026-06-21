# 🧭 Wanderlust

An interactive travel & culture exploration app. Enter any location and get a
beautifully presented guide to its **attractions, cuisine, customs & history,
and language** — wrapped in a cinematic, glassmorphism UI.

Built with **Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion**.

## ✨ Features

- **Cinematic landing** — full-bleed looping video wallpaper with layered scrims.
- **Glassmorphism UI** — translucent, blurred panels throughout.
- **z.ai Bring-Your-Own-Key gatekeeper** — a key field lives in the top-right of
  the navbar. Until a key is saved, search is **locked**. The key is stored only
  in the visitor's browser (`localStorage`) and attached to requests at call
  time — it never ships with the app.
- **Interactive results dashboard** — animated, tabbed categories with staggered
  reveals: Attractions · Cuisine · Culture & History · Language.
- **Mocked data** — the UI is fully explorable today. Flip one flag to go live.

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, click **Add z.ai key** (top-right), paste any
value to unlock search, then explore a location.

## 🔌 Wiring the real z.ai endpoint

Data currently comes from `lib/mockData.ts`. To go live:

1. Open `lib/fetchGuide.ts` and set `USE_MOCK = false`.
2. Create an API route at `app/api/guide/route.ts` that reads the
   `Authorization: Bearer <key>` header and proxies the request to z.ai,
   returning JSON in the `LocationGuide` shape (`lib/types.ts`).

Keeping the call behind a server route means the user's key isn't broadcast
beyond their own session.

## 🗂️ Project structure

```
app/
  layout.tsx        Root layout, fonts, ApiKeyProvider
  page.tsx          View orchestration (landing → loading → results)
  globals.css       Design tokens + glass utilities
components/
  Navbar.tsx        z.ai BYOK key gatekeeper (top-right)
  VideoBackground.tsx
  SearchHero.tsx    Locked until a key is set
  ResultsDashboard.tsx
  ResultsSkeleton.tsx
context/
  ApiKeyContext.tsx Key state + localStorage persistence
lib/
  types.ts          LocationGuide shape
  mockData.ts       Stand-in data
  fetchGuide.ts     Fetch logic (mock + live paths)
```
