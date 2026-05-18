-- =============================================================================
-- Car Imports 254 — Supabase initial schema (database only, no auth)
-- Project ref: uhkasicofnopccurzqqh
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Enquiries from the website contact form
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  service text not null,
  budget text,
  vehicle_preference text,
  message text,
  source text not null default 'website'
);

comment on table public.inquiries is 'Contact form submissions (no auth; anon insert only via RLS).';

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- Anonymous site visitors may INSERT only (no read/update/delete)
drop policy if exists "Allow anon insert inquiries" on public.inquiries;
create policy "Allow anon insert inquiries"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- Optional: allow authenticated dashboard users full access later
-- (Skip until you add Supabase Auth or use service_role from a backend.)

-- ---------------------------------------------------------------------------
-- 2) Newsletter sign-ups (footer)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null
);

comment on table public.newsletter_subscribers is 'Marketing newsletter emails; anon insert only.';

create unique index if not exists newsletter_subscribers_email_lower_key
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Allow anon insert newsletter" on public.newsletter_subscribers;
create policy "Allow anon insert newsletter"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);

-- ---------------------------------------------------------------------------
-- 3) Optional: hero search intent (no PII beyond make/model)
-- ---------------------------------------------------------------------------
create table if not exists public.hero_searches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  make text,
  model text,
  source text not null default 'website'
);

comment on table public.hero_searches is 'Hero make/model search clicks (optional analytics).';

create index if not exists hero_searches_created_at_idx
  on public.hero_searches (created_at desc);

alter table public.hero_searches enable row level security;

drop policy if exists "Allow anon insert hero_searches" on public.hero_searches;
create policy "Allow anon insert hero_searches"
  on public.hero_searches
  for insert
  to anon
  with check (true);
