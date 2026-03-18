# Email Deliverability Guide — Avoiding Spam

Auth emails (password reset, email confirmation) from Shelvian are sent by **Supabase Auth** using your configured SMTP. If they land in spam (e.g. Gmail), follow these steps.

## 1. Use a Transactional Email Provider (Resend Recommended)

Supabase’s default SMTP has limited deliverability. Use a provider like **Resend**:

1. Sign up at [resend.com](https://resend.com)
2. In Supabase: **Authentication → SMTP Settings**
3. Configure:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SSL)
   - **Username:** `resend`
   - **Password:** Your Resend API key
   - **Sender email:** `noreply@shelvian.co` (or `auth@shelvian.co`)
   - **Sender name:** `Shelvian`

## 2. Verify Your Domain in Resend

1. Resend Dashboard → **Domains** → Add `shelvian.co`
2. Add the DNS records Resend shows (DKIM, SPF, etc.) to your domain
3. Wait for verification (usually a few minutes)

**Tip:** Use a subdomain like `auth.shelvian.co` or `mail.shelvian.co` for auth emails to separate reputation from your main domain.

## 3. Add DNS Records (SPF, DKIM, DMARC)

These records tell Gmail and other providers that your emails are legitimate.

| Type | Name/Host | Value |
|------|-----------|-------|
| **DKIM** | (Resend provides) | (Resend provides) |
| **SPF** | `send` or `@` | `v=spf1 include:resend.com ~all` |
| **DMARC** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@shelvian.co;` |

- Start with `p=none` for DMARC (monitoring only)
- After a few weeks with no issues, move to `p=quarantine` or `p=reject`

## 4. Supabase Email Template Tweaks

In Supabase: **Authentication → Email Templates**

- Avoid spammy wording (e.g. “URGENT”, “Act now”, excessive caps)
- Keep subject lines clear and professional
- Ensure HTML is valid and not overly promotional

## 5. Avoid Link Scanner Issues

Some email scanners follow links and invalidate one-time reset links. Resend recommends:

- Using a redirect page on your domain that then forwards to the Supabase link
- Or ensuring your reset link domain matches your sender domain

## 6. Warm Up New Domains

New sending domains need time to build reputation:

- Start with low volume
- Ask users to mark emails as “Not spam” if they land there
- Avoid sudden spikes in sending

## 7. Check Provider Logs

- **Resend:** Dashboard → Logs — look for bounces, complaints, blocks
- **Supabase:** Auth logs — check for SMTP or delivery errors

## Quick Checklist

- [ ] Resend (or similar) configured as Supabase SMTP
- [ ] Domain verified in Resend
- [ ] SPF record added
- [ ] DKIM record added
- [ ] DMARC record added (start with `p=none`)
- [ ] Email templates reviewed for spam triggers
- [ ] Users can mark “Not spam” to improve future deliverability
