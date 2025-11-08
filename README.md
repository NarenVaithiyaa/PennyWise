# PennyWise

Personal finance dashboard built with React, TypeScript, and Supabase. Track daily spending and income, monitor balances, set monthly limits, and review savings insights from any device.

## Features
- Supabase-backed authentication with persistent session handling and secure CRUD APIs
- Unified dashboard that aggregates income, expenses, balances, and limit warnings with interactive charts
- Expense and income trackers featuring category filters (including "Others"), search, inline edits, and deletion flows
- Savings view that surfaces trends, goal progress, and actionable spending suggestions
- Responsive UI with dark mode, installable PWA shell, and mobile-friendly navigation drawer

## Tech Stack
- React 18 + TypeScript
- Vite 7 for development/build tooling
- Tailwind CSS for utility-first styling
- Recharts for visualisations
- Supabase (Postgres + Auth) as the backend service

## Quick Start
1. **Install dependencies**
   ```powershell
   npm install
   ```
2. **Create an environment file** named `.env` or `.env.local` in the project root.
3. **Populate Supabase credentials** (see [Environment](#environment)).
4. **Run the Vite dev server**
   ```powershell
   npm run dev
   ```
5. Open the printed localhost URL to start using PennyWise. Hot module reload keeps the session fresh during development.

## Environment
Configure the following environment variables for both development and production builds:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="public-anon-key"
```

These values come from your Supabase project dashboard. The client is created in `src/lib/supabase.ts` and expects both variables at startup.

## Available Scripts
- `npm run dev` – start the Vite development server
- `npm run build` – create an optimized production bundle
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint over the project source

## Project Structure
```
src/
  components/        // Auth flow, dashboards, charts, trackers, navigation, common UI
  contexts/          // Theme context for dark mode toggle
  hooks/             // Custom hooks (authentication, PWA helpers)
  lib/               // Supabase client and generated database types
  services/          // SupabaseService abstraction for database access
  utils/             // Calculations, storage helpers, PWA utilities
public/
  manifest.json      // PWA manifest
  sw.js              // Custom service worker
supabase/
  migrations/        // SQL migrations for managing schema
```

## Database Notes
Supabase migrations live under `supabase/migrations`. Apply them to your project database with the Supabase CLI:

```powershell
supabase db push
```

The generated TypeScript definitions in `src/lib/database.types.ts` must stay in sync with your database schema (`supabase gen types typescript --linked`). Update both the schema and types whenever migrations change.

## Progressive Web App
The project ships with a registered service worker (`public/sw.js`) and manifest. Vite's PWA-friendly configuration plus the in-app `InstallPrompt` component enable install reminders on compatible devices. Remember to run `npm run build` and serve the `dist` output over HTTPS when testing PWA behaviour.

## Contributing
1. Fork the repository and create a feature branch.
2. Run `npm run lint` before pushing changes.
3. Open a pull request describing your updates and any Supabase migrations that accompany them.

## License
License information has not been provided. Add a `LICENSE` file if you intend to distribute the project publicly.
