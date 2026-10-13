# Deploying Forklift Theory LMS

About 30 minutes, start to finish. Everything here works on free tiers while you test.

You'll set up three services, in this order:

1. **Supabase** — database and logins
2. **Stripe** — payments (test mode first)
3. **Vercel** — hosts the website, deploying from GitHub `doolan12/lms`

Keep a note open as you go. You'll collect six values:

| Value | From |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase — **secret** |
| `STRIPE_SECRET_KEY` | Stripe — **secret** |
| `STRIPE_WEBHOOK_SECRET` | Stripe — **secret** |
| `NEXT_PUBLIC_SITE_URL` | Vercel |

> Never paste the secret values into chat, email or a public file. They go only into Vercel's environment variables (and your own `.env.local` if you run it locally).

---

## 1. Supabase (≈10 min)

1. Sign up at [supabase.com](https://supabase.com) and click **New project**.
   - Name: `forklift-lms`
   - Database password: generate one and save it in your password manager
   - Region: **Sydney (ap-southeast-2)**
2. Wait for the project to finish setting up (1–2 minutes).
3. Go to **SQL Editor → New query**. Open [`supabase/setup.sql`](supabase/setup.sql) on GitHub, click **Copy raw file**, paste it in, and click **Run**. You should see "Success. No rows returned".
4. Check it worked: go to **Table Editor → lessons**. You should see 23 lessons.
5. Go to **Project Settings → API keys** (or **Settings → API**) and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click Reveal) → `SUPABASE_SERVICE_ROLE_KEY`

You'll come back to Supabase once more in step 4 to set the site URL.

---

## 2. Stripe (≈5 min now, 2 min later)

1. Sign up at [stripe.com](https://stripe.com). You can stay in **test mode** (the toggle at the top) — no business details needed yet.
2. Go to **Developers → API keys** and copy the **Secret key** (`sk_test_…`) → `STRIPE_SECRET_KEY`.

The webhook secret comes in step 4, once the site has a web address.

---

## 3. Vercel (≈5 min)

1. Sign up at [vercel.com](https://vercel.com) **with your GitHub account**.
2. Click **Add New → Project**, find **doolan12/lms** and click **Import**.
   - If it's not listed, click **Adjust GitHub App Permissions** and give Vercel access to `lms`.
3. Leave the framework as **Next.js** and the build settings as they are.
4. Open **Environment Variables** and add the five values you have so far. For `NEXT_PUBLIC_SITE_URL`, put a placeholder for now: `https://example.com`.
5. Click **Deploy**. When it finishes, copy your site's address, e.g. `https://lms-abc123.vercel.app`.
6. Go to **Settings → Environment Variables**, set `NEXT_PUBLIC_SITE_URL` to that address (no trailing slash), then **Deployments → ⋯ → Redeploy**.

---

## 4. Connect the pieces (≈5 min)

**Stripe webhook** — this is how a payment unlocks the course.

1. In Stripe: **Developers → Webhooks → Add endpoint** (in newer dashboards: **Workbench → Webhooks → Create an event destination**).
2. Endpoint URL: `https://YOUR-SITE.vercel.app/api/stripe/webhook`
3. Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Save, then reveal the **Signing secret** (`whsec_…`) → add it in Vercel as `STRIPE_WEBHOOK_SECRET`, and **Redeploy**.

**Supabase login emails**

1. In Supabase: **Authentication → URL Configuration**.
2. **Site URL**: `https://YOUR-SITE.vercel.app`
3. **Redirect URLs**: add `https://YOUR-SITE.vercel.app/auth/callback`

---

## 5. Test it end to end

1. Open your site → **Sign in → Create an account**. Confirm the email Supabase sends you.
2. Open the course → **Buy course**. Pay with Stripe's test card **4242 4242 4242 4242**, any future expiry date, any CVC, any postcode.
3. You should land back on the course with access unlocked. Complete a lesson, then take a quiz.
4. In Stripe → **Webhooks**, the endpoint should show a successful (200) delivery.

If anything fails, Vercel → your project → **Logs** shows the error.

---

## Going live (when you're ready to sell)

- **Stripe:** activate your account (ABN, bank details), switch to **live mode**, create a live webhook the same way, and replace `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel with the live values.
- **Email:** Supabase's built-in email sender is rate-limited and meant for testing. Before launch, add your own SMTP provider (e.g. Resend or Postmark) in **Authentication → SMTP Settings**.
- **Domain:** add your own domain in Vercel → **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL`, the Supabase Site URL and redirect URL, and the Stripe webhook URL.
- **Content:** get your RTO / qualified trainer to sign off the course content and `docs/curriculum-coverage.md`.

## Updating the database later

`supabase/setup.sql` is for a **new, empty** project only. When a new migration is added (e.g. `0005_….sql`), run just that file in the SQL editor.
