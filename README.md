# Auxesis Fresh Produce

Website for Auxesis Fresh Produce: React, TypeScript, Vite, Tailwind CSS and Supabase.

## Run it on your computer

You need **Node.js 20.19 or newer** (22 works too). Check with `node -v`; get it from nodejs.org if needed.

1. Open a terminal in this folder.
2. Install the packages (once):
   ```
   npm install
   ```
3. Create your settings file. Copy `.env.example` to a new file named `.env`, then fill in:
   - `VITE_SUPABASE_URL`: your project URL (Supabase: Settings > API Keys, or the Connect button)
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: the key starting with `sb_publishable_`

   Never put the `secret` or `service_role` key in this file.
4. Start the site:
   ```
   npm run dev
   ```
   Open the address it prints (usually http://localhost:5173). Edit a file and the page updates by itself.

Useful commands: `npm run build` (checks the code and makes the production files in `dist/`), `npm run lint`.

## Where things are

| What | Where |
|---|---|
| Phone, email, addresses, opening hours | `src/config/site.ts` |
| The 9 produce lines (text, pack sizes, growing method) | `src/data/products.ts` |
| Pages | `src/pages/` |
| Header, footer, shared pieces | `src/components/` |
| Colours and fonts | `src/index.css` |
| Database setup (already run in Supabase) | `supabase/schema.sql` |

## Photos

Add your own pictures and they appear automatically:
- Hero background: `public/images/hero.jpg`
- Produce cards: `public/images/produce/<name>.jpg`, for example `red-capsicum.jpg`, `local-cucumber.jpg`, `english-cucumber.jpg`, `yellow-capsicum.jpg`, `chillies.jpg`, `butternuts.jpg`, `broccoli.jpg`, `cauliflower.jpg`, `zucchini.jpg`

## Status

Built so far: layout, Home page, database schema. Other pages currently show a placeholder heading.
