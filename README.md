# Tech Girls Squad Website

The website for **Tech Girls Squad**, an advocacy book published by Tech4Dev in 2025 and delivered through Women Techsters. The book introduces girls across Africa to STEM through story.

**Site:** [techgirlssquad.tech4dev.com](https://techgirlssquad.tech4dev.com) (test site until launch: [tech-girls-squad.netlify.app](https://tech-girls-squad.netlify.app))

**Status:** complete. Built in 2026 by volunteers from the Tech4Dev alumni community, and now maintained by Tech4Dev.

---

## What the site does

- One scrolling page: Hero, About, The Books, Impact (with a photo gallery), Get Involved and a footer.
- **Buy a Copy**, **Gift a Copy** and **Make a Donation**, all paid through Paystack (card, bank transfer and USSD).
- **Order for Your School** and **Partner With Us** enquiries, sent to the shared inbox.
- Confirmation emails to buyers and donors, and an alert to `techgirlssquad@tech4dev.com` for every order, donation and enquiry.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) with React and TypeScript |
| Styling | Tailwind CSS |
| Motion | CSS transitions and GSAP |
| Payments | Paystack (hosted checkout) |
| Email | Resend, sending from `techgirlssquad@tech4dev.com` |
| Database | MongoDB Atlas (order status only, no personal details) |
| Hosting | Netlify |
| Package manager | pnpm |

---

## How it works

### Payments

1. The buyer fills in a form and clicks Proceed to Payment. The form calls `/api/payments/initialize`.
2. The server works out the amount from the number of copies (or the donation amount), creates an order in MongoDB with a reference like `TGS-261126-AB12` and the status `pending`, and starts a Paystack transaction. Amounts sent to Paystack are in kobo (₦1 = 100 kobo).
3. The buyer pays on Paystack's checkout page.
4. Paystack sends a webhook to `/api/webhook/paystack`. The server checks the signature and the amount, marks the order `confirmed` (once only, so a resent webhook does nothing), and sends the buyer's confirmation email and the inbox alert.
5. Paystack sends the buyer back to `/payment/callback`. That page asks `/api/payments/verify/[reference]` for the payment status every 3 seconds, for up to a minute, then shows the order, gift or donation confirmation. A failed payment goes to `/order/failed`.

The buyer's name, phone number and delivery address travel with the Paystack transaction and appear in the order alert. They are not stored in the database. Paystack's dashboard is the record of every payment for Finance.

If something looks wrong, such as a payment that doesn't match the expected amount, the server sends an email starting `[OPS]` to the shared inbox.

### Enquiry forms

Order for Your School and Partner With Us post to `/api/forms/school` and `/api/forms/partner`. The server checks the fields and a hidden spam trap, then emails the details to the shared inbox, with Reply set to the person who filled in the form. Nothing is stored.

### Database

MongoDB Atlas, database `tech_girls_squad`, collection `orders`. Each document holds the reference, order type, copies, expected and received amounts (in kobo), consent, status (`pending`, `confirmed`, `amount_mismatch` or `abandoned`) and Paystack's transaction details. The code creates the indexes; the unique ones on `reference` and `idempotency_key` are what stop duplicate orders, so don't remove them.

---

## Project structure

```
app/
  (website)/page.tsx          The home page
  (pages)/payment/callback/   Payment confirmation page
  (pages)/order/failed/       Payment failed page
  (pages)/api/payments/       Start and check payments
  (pages)/api/webhook/        Paystack webhook
  (pages)/api/forms/          School and partner enquiries
  not-found.tsx               404 page
  robots.ts, sitemap.ts       Search engine files
components/                   Page sections
components/forms/             The five forms
data/                         Text and figures for the sections, gallery list, Nigerian states and LGAs
lib/                          Email templates, orders database, references, form helpers
public/                       Images
next.config.ts                Search engine headers
```

---

## Running it locally

```bash
git clone https://github.com/Tech4Dev-Support/tech-girls-squad-website.git
cd tech-girls-squad-website
pnpm install
pnpm dev
```

It runs at `http://localhost:3000`. Create a `.env.local` file with the variables below, using Paystack **test** keys and your own MongoDB database user.

Paystack's test card is `4084 0840 8408 4081`, CVV `408`, any future expiry date. No real money moves.

Paystack can't send webhooks to your computer, so locally the confirmation page works but no emails are sent and orders stay `pending`. Test emails on the test site instead.

---

## Environment variables

Set in Netlify under Site configuration → Environment variables. **Never commit them to the repository.**

| Name | What it's for | Secret |
|---|---|---|
| `SITE_URL` | The site's address, used for Paystack's return link, `robots.txt` and the sitemap | No |
| `PAYSTACK_SECRET_KEY` | Paystack secret key: `sk_test_…` on the test site, `sk_live_…` at launch (Production only) | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string for the site's database user | Yes |
| `MONGODB_DB` | Database name. Defaults to `tech_girls_squad` | No |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |
| `EMAIL_FROM` | Sender, in the form `Tech Girls Squad <techgirlssquad@tech4dev.com>` | No |
| `EMAIL_ALERTS` | Inbox that receives alerts: `techgirlssquad@tech4dev.com` | No |
| `PRICE_PER_COPY_NAIRA` | Price per copy charged by the server. Defaults to `5000` | No |
| `MIN_DONATION_NAIRA` | Minimum donation checked by the server. Defaults to `1000` | No |
| `DISPATCH_DAYS` | Working days quoted in the order email. Set to `7` | No |
| `ALLOW_INDEXING` | Set to `true` at launch so search engines can list the site | No |
| `SECRETS_SCAN_OMIT_PATHS` | Netlify only: `.netlify/.next/cache`, so Netlify's secret scanner doesn't block deploys | No |

---

## Deployment

Netlify builds and publishes the site every time something is merged into `main`. It installs packages with pnpm (it reads `pnpm-lock.yaml`) and runs `npm run build`.

The Paystack webhook is set in the Paystack dashboard under Settings → API Keys & Webhooks, as `{SITE_URL}/api/webhook/paystack`. Test mode and live mode each have their own webhook URL.

### Search engines

Until `ALLOW_INDEXING` is set to `true`, every page tells search engines not to list it. After that, only the home page is listed; the payment and order pages are always hidden. `robots.txt` and `sitemap.xml` are generated from `SITE_URL`.

---

## Common changes

| To change | Where |
|---|---|
| Section text and figures | `data/` (for example `impact_stats_data.ts` for the Impact figures), or the section's file in `components/` |
| Email wording | `lib/emailService.ts` |
| Alerts inbox | `EMAIL_ALERTS` in Netlify |
| Price per copy | `PRICE_PER_COPY_NAIRA` in Netlify, **and** `PRICE_PER_COPY` in `components/forms/GetCopyModal.tsx` and `GiftCopyModal.tsx`, **and** the card headings in `data/ways_to_help_data.ts` |
| Minimum donation | `MIN_DONATION_NAIRA` in Netlify, **and** the message and hint in `components/forms/DonateModal.tsx` |
| Dispatch time | `DISPATCH_DAYS` in Netlify, **and** the "7 working days" line in `app/(pages)/payment/callback/page.tsx` |
| Gallery photos | Add the photo to `public/gallery_images/advocacy_visits/` or `book_launch/`, then list it in `data/gallery_images.ts`. Compress photos first: about 2,000 pixels wide and under 500 KB |

After any change, place a test order on the test site before it goes live.

---

## Contributing

`main` is protected: every change goes through a pull request, and merging it deploys the site.

- **Branches:** `feature/short-description` or `fix/short-description`.
- **Commits:** start with the type of change: `feat:`, `fix:`, `docs:`, `style:`, `refactor:` or `chore:`.
- **Packages:** add them with `pnpm add`, so `pnpm-lock.yaml` stays correct.
- **Secrets:** keys and connection strings belong in Netlify only. A key that reaches GitHub, even briefly, has to be replaced.

---

## Questions

Email `techgirlssquad@tech4dev.com`.
