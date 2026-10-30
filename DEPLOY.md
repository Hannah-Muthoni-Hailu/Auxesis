# Putting the Auxesis site online with Cloudflare

This guide takes the site from your computer to a live web address, then connects your own domain. Hosting is free. Allow about 30 minutes for the first deploy, plus waiting time for the domain.

Cloudflare sometimes renames menu items. If something here does not match your screen, tell Claude what you see and we will adjust.

## What you need first

- The project folder on your computer, unzipped from the latest zip.
- Your `.env` file in that folder, with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` filled in. The site only works live if these were present when you built it.
- Node.js already installed (it is, since `npm run dev` works).
- On Windows, use **Command Prompt** for every command below (not PowerShell), or type `npm.cmd` and `npx.cmd`.

## Part 1: Create a Cloudflare account (5 minutes)

1. Go to **dash.cloudflare.com/sign-up** and sign up with your email and a strong password.
2. Open the confirmation email and click the link.
3. If asked what you want to do, you can skip past any "add a domain" prompts for now.

## Part 2: Deploy the site (10 minutes)

Open Command Prompt in the project folder (the one with `package.json`).

1. Log in to Cloudflare from the terminal:
   ```
   npx wrangler login
   ```
   A browser tab opens. Click **Allow**. Go back to the terminal when it says you are logged in.
2. Build and publish:
   ```
   npm run deploy
   ```
3. The first time, Cloudflare asks you to choose a name for your free address area. Pick something short such as `auxesis`. When it finishes, it prints your live address, which looks like `https://auxesis.YOURNAME.workers.dev`.
4. Open that address in your browser. The site is live.

## Part 3: Check the live site

Go through this list on the live address, ideally on your phone as well:

- [ ] Home and Produce pages load, and the Produce filters and search work.
- [ ] **Farm Tracker** shows your 7 sample batches (4 farms, 2 ready, 13,000 kg).
- [ ] Open `/produce` directly in the address bar, then refresh. It should still load (not an error page).
- [ ] Send a test quote request at `/quote`, then sign in and check it appears under **My batches > Quote enquiries**. Delete the test.
- [ ] Sign in at `/auth` as yourself. Add a test batch, move it one stage, then delete it.
- [ ] Sign in as a farmer account and confirm they see only their own farm.

If the tracker shows "not connected" or no data, see Troubleshooting at the end.

## Part 4: Supabase settings for the live site

1. In Supabase, open **Authentication > URL Configuration**.
2. Set **Site URL** to your live address (use the `workers.dev` one for now, and change it to your domain later).
3. While you are in Authentication, confirm **Allow new users to sign up** is still switched off.

## Part 5: Your own domain

Until you have a domain, the `workers.dev` address works fine for testing and for showing farmers.

1. **Buy a domain**, for example `auxesisproduce.co.ke`, from any KeNIC-accredited registrar. Compare the renewal price, not only the first-year price. Expect roughly KES 400 to 1,500 in year one, and KES 1,200 to 2,500 a year after.
2. **Add the domain to Cloudflare**: in the Cloudflare dashboard choose **Add a domain**, enter it, and pick the **Free** plan.
3. Cloudflare shows you two **nameservers**. Log in to your registrar and replace the domain's nameservers with those two. This can take from a few minutes to a day.
4. When Cloudflare says the domain is active, open **Workers & Pages**, click your `auxesis` project, then **Settings > Domains & Routes > Add > Custom domain**. Add both `auxesisproduce.co.ke` and `www.auxesisproduce.co.ke` (use your own domain).
5. Tell the site its address. Add this line to your `.env` file (no slash at the end):
   ```
   VITE_SITE_URL=https://auxesisproduce.co.ke
   ```
   Then run `npm run deploy` again. This turns on the sharing preview, sitemap and Google business details.
6. Back in Supabase, change **Site URL** to your domain.

Optional: Cloudflare **Email Routing** (free) can forward `sales@yourdomain` to your Gmail, so the email address on the site works. Sending replies from that address needs a separate email service.

## Part 6: Avoid annoying "are you human?" checks

In the Cloudflare dashboard, open your domain, then **Security > Settings**:

- Set **Security level** to **Low**.
- Make sure **Bot Fight Mode** is **off** (it is usually under **Security > Bots**).

Normal visitors should then never see a captcha. If a buyer or farmer ever reports one, tell Claude.

## Part 7: Updating the site later

Each time Claude sends a new zip:

1. Unzip it over your project folder (your `.env` stays).
2. Run `npm install` only if Claude says new packages were added.
3. Run `npm run deploy`. The new version is live in about a minute.

## Troubleshooting

- **The tracker says it is not connected, or shows no data.** The Supabase values were missing when you built. Check your `.env` file has both values, then run `npm run deploy` again. These keys are baked in when you build, so changing `.env` does nothing until you redeploy.
- **Refreshing a page like `/produce` shows an error.** Check that `wrangler.jsonc` is in the project folder, then redeploy.
- **"Running scripts is disabled" in PowerShell.** Use Command Prompt instead.
- **The login browser tab does not open.** Copy the link `wrangler login` prints into your browser by hand.
- **Everything worked, then the site stopped loading data.** On Supabase's free plan, a project with no activity for about a week can pause. Open your project in the Supabase dashboard and click **Restore**. The paid plan avoids this.
- **A farmer forgot their password.** In Supabase, open **Authentication > Users** and look for the option to change that user's password. The site has no password-reset page yet, so if your dashboard only offers an emailed reset link, tell Claude and we will add a reset page.

## What this setup includes

- Free hosting with no monthly cap on static traffic (check Cloudflare's current free plan terms).
- Page refresh and direct links work on every page.
- Security headers: blocks the site from being shown inside another site, restricts what scripts and connections the pages may use, and keeps built files cached for speed.
