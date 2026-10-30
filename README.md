# Auxesis Fresh Produce

Website and farmer portal for Auxesis Fresh Produce: React, TypeScript, Vite, Tailwind CSS and Supabase.

- **Public visitors** can browse the site and the live farm tracker.
- **Farmers** sign in to add batches and move them from planting to market, for their own farm only.
- **Auxesis staff** can manage every farm and batch and link farmer accounts to farms.

There is no public sign-up. Accounts are created by Auxesis.

## Run it on your computer

You need **Node.js 20.19 or newer** (22 works too). Check with `node -v`.

On Windows, if PowerShell blocks `npm`, use Command Prompt instead, or type `npm.cmd` in place of `npm`.

1. Open a terminal in this folder and run `npm install` (once).
2. Copy `.env.example` to a new file named `.env` and fill in:
   - `VITE_SUPABASE_URL`: your project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: the key starting with `sb_publishable_`

   Never put the `secret` or `service_role` key in this file.
3. Start the site with `npm run dev` and open the address it prints (usually http://localhost:5173).

Other commands: `npm test` (runs the automated tests), `npm run build` (checks the code and makes the production files in `dist/`), `npm run lint`.

## One-time Supabase setup (in this order)

Run each SQL file in the Supabase dashboard: **SQL Editor > New query > paste > Run**.

1. `supabase/schema.sql`: tables, public-read rules and sample data. *(Already done.)*
2. `supabase/002_farmer_access.sql`: farmer access, automatic batch codes, and the staff tools. Safe to run more than once.
3. Create your own login: **Authentication > Users > Add user**. Enter your email and a password and tick **Auto Confirm User**.
4. Edit `supabase/make_staff.sql`, put your email in it, and run it. This makes you Auxesis staff.
5. Turn off public sign-up: **Authentication**, then the sign-in settings, then switch off **Allow new users to sign up**. (Do this *after* step 3.) If adding farmer accounts is refused while sign-up is off, switch it on briefly, add the account, then switch it off again.

## Adding a farmer

1. In Supabase: **Authentication > Users > Add user**, with the farmer's email, a password, and **Auto Confirm User** ticked.
2. Sign in to the site, open **My batches > Farms & farmers**, and add the farm if it is not listed yet.
3. Under that farm, type the farmer's email and press **Link farmer**.
4. Give the farmer their email and password. They sign in from the **Sign in** link.

A farmer can add and update batches only on the farm(s) they are linked to. They cannot delete batches or see other farms' controls. Staff can do everything.

## Quote requests

Visitors fill in the form at `/quote` (also linked from Produce, Contact and the footer; each produce card pre-selects its crop). Requests are saved to the `enquiries` table.

Staff read them in **My batches > Quote enquiries**, where each request has Call and WhatsApp buttons and a Delete button. Only staff can read or delete enquiries; visitors can only add one. A hidden bot-trap field stops most spam. If spam ever gets through, tell us and we will add a stronger check.

## Putting it online

See `DEPLOY.md` for the step-by-step Cloudflare guide. In short: `npx wrangler login` once, then `npm run deploy` each time.

## Search and sharing settings

Each page sets its own browser-tab title and search description (the `usePageMeta` line at the top of each page file). Sign-in and portal pages ask search engines to skip them. When the site goes live, set `VITE_SITE_URL` (for example `https://www.auxesisproduce.co.ke`) where the site is built; the build then writes `sitemap.xml`, `robots.txt` and the business details search engines read, and the WhatsApp/Facebook sharing preview works. The sharing picture is `public/og-image.png` (1200 x 630); replace it with a photo whenever you like.

## Where things are

| What | Where |
|---|---|
| Phone, email, addresses, opening hours | `src/config/site.ts` |
| The 9 produce lines (text, pack sizes, growing method) | `src/data/products.ts` |
| Pages | `src/pages/` (farmer and staff screens in `src/pages/portal/`) |
| Header, footer, batch form, shared pieces | `src/components/` |
| Sign-in logic | `src/auth/` |
| Colours and fonts | `src/index.css` |
| Database setup | `supabase/` |
| Automated tests | `*.test.ts` and `*.test.tsx` files next to the code they test |

## Photos

Add your own pictures and they appear automatically:
- Hero background: `public/images/hero.jpg`
- Produce cards: `public/images/produce/<name>.jpg`, for example `red-capsicum.jpg`, `local-cucumber.jpg`, `english-cucumber.jpg`, `yellow-capsicum.jpg`, `chillies.jpg`, `butternuts.jpg`, `broccoli.jpg`, `cauliflower.jpg`, `zucchini.jpg`
- Greenhouse gallery on the Produce page: `public/images/greenhouse/1.jpg` to `4.jpg`

## Status

Built: layout, Home, Produce, Farm Tracker, About, Contact, quote enquiry form and staff inbox, sign-in, farmer portal, staff farm management, database rules.
Ready to deploy: see `DEPLOY.md`.
