# NEON OS

NEON OS is a mobile-first POS, inventory, analytics, cash, and accounting web app for **NEON Drinks & Snacks**. It is optimized for weekend peak-hour operation with large touch targets, an offline-first order flow, and a dark neon interface that works outdoors.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- shadcn/ui-style component system
- Zustand
- React Hook Form + Zod
- Recharts
- Supabase + PostgreSQL
- Vercel deployment target
- Progressive Web App with service worker caching

## Features

- Ultra-fast 6-step POS flow
- Multi-item and combined orders
- Offline-safe order capture with local persistence
- Automatic inventory deduction from sales
- Daily/weekly/monthly analytics
- Active flavor and tank assignment
- Cash opening and closing
- Expense and loan payment tracking
- Demo mode that runs locally without Supabase
- Supabase sync routes for orders, inventory, flavors, cash, expenses, and loan payments

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env variables:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

Demo credentials:

- `operator@neon.local` / `123456`
- `admin@neon.local` / `123456`

## Supabase setup

1. Create a new Supabase project.
2. Run the SQL migration in [supabase/migrations/202605080001_init_neon_os.sql](/C:/Users/pibey/Documents/Neon/Aplicacion/supabase/migrations/202605080001_init_neon_os.sql:1).
3. Run the seed file in [supabase/seed.sql](/C:/Users/pibey/Documents/Neon/Aplicacion/supabase/seed.sql:1).
4. Add the credentials to `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Add the same Supabase environment variables.
3. Deploy with the default Next.js settings.

### Supabase

1. Apply the migration and seed SQL.
2. Enable email/password auth in Supabase Auth if you want live authentication.
3. Create matching rows in `public.users` for your staff accounts.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run format`

## Notes

- Without Supabase env vars, the app runs in **demo offline mode** using persisted local data.
- Orders and admin mutations are stored locally first and then synchronized when connectivity is available.
- The service worker caches the app shell for installable PWA behavior.
