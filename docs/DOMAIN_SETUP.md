# Domain setup — dev-aditya.com

This document describes the manual steps to point the custom domain
`dev-aditya.com` at the Vercel deployment and keep `work@dev-aditya.com`
email working. The site code already treats `https://dev-aditya.com` as the
canonical origin (see `src/config/site.ts` and `FALLBACK_BASE_URL` in
`src/app/layout.tsx`).

## 1. Add the domain in Vercel

1. Open [Vercel](https://vercel.com) and select this project.
2. Go to **Settings → Domains**.
3. Add `dev-aditya.com`.
4. Add `www.dev-aditya.com`.
5. Set **`dev-aditya.com` as the primary domain**.
6. Configure **`www.dev-aditya.com` to redirect to `dev-aditya.com`** (the apex),
   so there is a single canonical host.

## 2. Add the DNS records Vercel shows

Vercel displays the exact records to add once the domains are attached. Add
them at your DNS provider (the registrar or wherever the `dev-aditya.com` zone
is hosted):

- **Apex (`dev-aditya.com`)** — add the A record(s) Vercel lists, or an
  ALIAS/ANAME record if your provider supports apex flattening.
- **`www` subdomain** — add the CNAME **value that Vercel assigns for this
  project**. Do not copy a CNAME value from anywhere else — Vercel assigns it
  per-project, so use the value shown in your project's Domains screen.

Wait for DNS propagation (usually minutes, occasionally longer). Vercel marks
each domain **Valid** once it resolves.

## 3. Preserve existing email (MX / SPF / DKIM / DMARC)

`work@dev-aditya.com` email is delivered by whatever mail provider hosts the
mailbox, **not** by Vercel. When editing DNS:

- **Do not remove or overwrite** any existing `MX` records.
- **Do not remove** the `TXT` records used for **SPF**, **DKIM**, or **DMARC**.
- Only add the web records from step 2. The web (A/CNAME) records and the mail
  (MX/TXT) records coexist in the same zone and do not conflict.

If the mailbox does not exist yet, create it with your email provider and add
their required MX/SPF/DKIM/DMARC records **before** relying on the address.

## 4. Verify HTTPS

Vercel provisions a TLS certificate automatically once DNS is valid. Confirm:

- `https://dev-aditya.com` loads with a valid certificate (no warning).
- `https://www.dev-aditya.com` redirects to `https://dev-aditya.com`.

## 5. Test both domain versions

- Visit `http://dev-aditya.com` → should upgrade to `https://`.
- Visit `https://www.dev-aditya.com` → should redirect to the apex.
- Visit `https://dev-aditya.com` directly → should serve the site.
- Confirm `https://dev-aditya.com/sitemap.xml` and `/robots.txt` resolve and
  reference the custom domain.

## 6. Test email

- Send an email **to** `work@dev-aditya.com` from an external account and
  confirm it arrives.
- Send an email **from** `work@dev-aditya.com` and confirm it is delivered and
  not marked as spam (SPF/DKIM/DMARC aligned).

## 7. After the domain is live

- Confirm social previews use the new domain: re-scrape the URL in the
  LinkedIn Post Inspector and X Card Validator so the Open Graph / Twitter
  image is fetched from `https://dev-aditya.com`.
- Submit `https://dev-aditya.com/sitemap.xml` in Google Search Console for the
  new property.
