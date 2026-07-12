# Website Revenue Audit — Setup Guide

This document covers all external setup required after the code implementation.

## Neon PostgreSQL

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the **pooled** connection string
4. Set `DATABASE_URL` in Vercel environment variables
5. Run the database migration:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## Google Cloud — PageSpeed Insights API

1. Go to https://console.cloud.google.com
2. Create or select a project
3. Enable the **PageSpeed Insights API**
4. Create an API key (Credentials → Create Credentials → API Key)
5. Restrict the key to the PageSpeed Insights API where practical
6. Set `GOOGLE_PAGESPEED_API_KEY` in Vercel environment variables

## Cloudflare Turnstile

1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
2. Add your production hostname (dev-aditya.com)
3. Obtain the **Site Key** and **Secret Key**
4. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel
5. Confirm server-side verification works in production

## Resend

1. Create a Resend account at https://resend.com
2. Verify your sending domain (dev-aditya.com or a subdomain)
3. Create an API key
4. Set `RESEND_API_KEY` in Vercel
5. Set `AUDIT_FROM_EMAIL` to a verified sender address
6. Set `AUDIT_NOTIFICATION_EMAIL` to the admin notification address
7. Send a production test email to confirm delivery

## Admin Password

1. Run the password hashing script:
   ```bash
   npm run admin:hash-password
   ```
2. Copy the generated hash
3. Set `ADMIN_PASSWORD_HASH` in Vercel environment variables
4. Generate a strong session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. Set `ADMIN_SESSION_SECRET` in Vercel environment variables

## Vercel Deployment

1. Add **all** environment variables for Preview and Production
2. Run the database migration:
   ```bash
   npm run db:migrate
   ```
3. Redeploy
4. Test the audit flow
5. Test the lead email
6. Test admin login at /admin/login
7. Check Vercel Function logs
8. Confirm no secrets are logged

## Vercel Function Configuration

The audit run function may need an increased timeout. In `vercel.json` (if not already set):
```json
{
  "functions": {
    "src/app/api/audits/[auditId]/run/route.ts": {
      "maxDuration": 60
    }
  }
}
```

## Post-Deployment Verification Checklist

- [ ] Audit page loads at /audit
- [ ] Submitting a URL creates an audit
- [ ] Audit processes and shows results
- [ ] Public report shows top 3 findings + scores
- [ ] Unlock form captures lead
- [ ] Full report reveals after unlock
- [ ] Report email is delivered
- [ ] Admin notification email is delivered
- [ ] Admin login works at /admin/login
- [ ] Admin dashboard shows leads
- [ ] Lead detail page works
- [ ] CSV export works
- [ ] Rate limiting is active
- [ ] Turnstile verification works
- [ ] No secrets in client output
- [ ] No horizontal overflow on mobile
- [ ] Existing pages still work correctly

## Known Limitations

- Only one submitted public page is analyzed per audit
- This is not a penetration test
- Automated accessibility checks are incomplete
- Conversion feedback contains labelled heuristics
- PageSpeed results can vary between runs
- Real-user field data may be unavailable
- The tool does not guarantee rankings, traffic, enquiries or revenue
