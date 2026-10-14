# Eljaya Trading Co. — Website

Marketing site for Eljaya Trading Co. Limited (branded merchandise & eco packaging, Nairobi).
The business owner edits everything (photos, slideshow, services, portfolio, news, testimonials, FAQs,
contact details, announcement bar) from a built-in admin panel at **`/studio`**, without touching code.

Built by **Avinaya Solutions Ltd** · +254 797 033 513

**Stack:** Next.js 16 (App Router) · Sanity CMS · Tailwind CSS 4 · Motion · Resend · Vercel

## How content works

- Content lives in **Sanity**. Pages are static and refresh automatically when the owner hits **Publish**
  (via a webhook), or within 5 minutes at most.
- Until Sanity is connected, the site runs on built-in content in [`lib/fallback.ts`](lib/fallback.ts)
  (migrated from the old static site), so it always works.
- Contact-form enquiries are **emailed** to the team (Resend) **and** filed in the admin under
  **Enquiries**, with a status (New → Contacted → Quoted → Won).

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in values (all optional for a first look)
npm run dev                         # http://localhost:3000
```

## Going live: one-time setup

1. **Create the Sanity project.** Go to https://www.sanity.io/manage → *Create project* (free plan is plenty).
   Copy the **Project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. **API settings** (in the Sanity project → *API*):
   - *CORS origins*: add `http://localhost:3000` and `https://eljayatradingco.com`, both **with credentials**.
   - *Tokens*: create an **Editor** token → `SANITY_API_WRITE_TOKEN`.
3. **Import the existing content and photos:** `npm run seed` (use `npm run seed -- --force` to overwrite).
4. **Deploy to Vercel**: import the GitHub repo, add every variable from `.env.local.example` under
   *Settings → Environment Variables*, deploy.
5. **Instant updates webhook** (Sanity → *API* → *Webhooks* → *Create*):
   - URL: `https://eljayatradingco.com/api/revalidate`
   - Dataset: `production`, Trigger on: create / update / delete, Filter: `_type != "enquiry"`
   - Secret: any long random string, which also goes in `SANITY_REVALIDATE_SECRET`.
6. **Email notifications**: create a free https://resend.com account, verify the `eljayatradingco.com`
   domain, then set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`.
7. **Invite the owner**: Sanity → *Members* → invite their email as **Editor**. They log in at
   `https://eljayatradingco.com/studio` (or `/admin`).
8. **Domain**: in Vercel → *Domains*, add `eljayatradingco.com` and `www.eljayatradingco.com`,
   then update DNS at the registrar as Vercel instructs. Old `.html` URLs 301-redirect to the new pages.

## Owner's guide (what's editable where)

| In the admin | Controls |
| --- | --- |
| **Enquiries** | Messages from the website form. Change status, add internal notes |
| **Homepage** | Hero slideshow (photos + headings), scrolling words, intro, eco section, bottom CTA |
| **About page** | Story, photos, values, the 4-step process (also shown on the homepage) |
| **Business details & announcements** | Phone, WhatsApp, email, address, hours, socials, Google rating, headline numbers, **announcement bar**, Google title/description |
| **Products & services** | Each product page: photos, price-from, turnaround, minimum order, features, “show on homepage” |
| **Portfolio** | Projects with cover, gallery, story and “show on homepage” |
| **News & blog** | Posts with cover photo, rich text, tables, tip boxes and inline photos |
| **Testimonials · Industries · FAQs · Client logos** | As named. Client logos appear as a scrolling strip once added |

Tip for photos: after uploading, click the **crop icon** and drag the focal point onto the product, so
it stays in frame on phones.

## Project structure

```
app/(site)/        public pages (home, services, portfolio, about, news, contact, legal)
app/studio/        the embedded Sanity admin
app/api/           contact form + revalidation webhook
components/        UI (hero slideshow, animated sections, gallery lightbox, forms…)
lib/content.ts     data access: Sanity with fallback to lib/fallback.ts
lib/sanity/        client, env, GROQ queries
sanity/schemas/    admin panel content model
scripts/seed.ts    imports fallback content + public/images into Sanity
```
