# Supabase setup — Speedgate Logistics

Project ref: `uhkasicofnopccurzqqh`  
REST base: `https://uhkasicofnopccurzqqh.supabase.co`

## 1. Run SQL migrations (in order)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Run **`migrations/001_initial.sql`** (contact form, newsletter, hero searches).
3. Run **`migrations/002_admin_cms_auth.sql`** (admins, CMS tables, storage, seed data).
4. Run **`migrations/003_blog_seo_meta.sql`** (blog `meta_description` for SEO).

## 2. Enable email login

**Authentication → Providers → Email** → enable Email provider (confirm email can be off for internal admins).

## 3. Configure the website

Set `window.SUPABASE_ANON_KEY` in **`js/supabase-config.js`** (Project Settings → API → anon public key).

Never put the **service_role** key in frontend code.

## 4. Admin accounts (created by migration 002)

| Email | Password |
|-------|----------|
| speedgateauto@gmail.com | `#speedgateauto` |
| johnkamau.maestro@gmail.com | `#speedgateauto` |

**Change these passwords after first login** (Authentication → Users → user → reset password).

## 5. Admin dashboard

Open **`admin.html`** on your site (or click **Login** in the main nav).

Admins can manage:

- **Cars** — listings with image upload to Storage
- **Blog posts** — title, slug, excerpt, full content, images
- **Import services**, **features**, **process steps**, **why choose us**
- **Site text** — hero and about copy (`site_settings`)
- **Inquiries** & **newsletter** — view and delete submissions

The public site (`index.html`) loads published content via `js/public-content.js`.

## 6. Storage

Migration creates public bucket **`website-media`** (max 5MB per image). Admins upload via the dashboard; URLs are saved on car/blog records.

## 7. Tables overview

| Table | Public | Admin |
|-------|--------|-------|
| `cars`, `blog_posts`, `import_services`, … | Read published | Full CRUD |
| `site_settings` | Read all keys | Update |
| `inquiries`, `newsletter_subscribers` | Insert only | Read / delete |
| `admin_users` | — | Linked to Auth users |

## 8. Troubleshooting

- **Invalid login**: Run migration 002 again or create users under Authentication → Users with the same emails, then ensure rows exist in `public.admin_users`.
- **Permission denied on save**: User must be signed in and listed in `admin_users` with `active = true`.
- **Upload fails**: Confirm bucket `website-media` exists and storage policies were applied (re-run migration 002).
