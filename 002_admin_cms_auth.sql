-- =============================================================================
-- Speedgate Logistics — Admin auth, CMS tables, storage, RLS
-- Run AFTER 001_initial.sql in Supabase Dashboard → SQL Editor
--
-- Admins (email / password — change after first login in production):
--   speedgateauto@gmail.com          / #speedgateauto
--   johnkamau.maestro@gmail.com      / #speedgateauto
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Admin registry (must match auth.users email)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Whitelisted admin emails linked to Supabase Auth users.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.active = true
      and lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- CMS: cars, blogs, services, features, process steps, why choose, settings
-- ---------------------------------------------------------------------------
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  year int,
  fuel_type text,
  mileage text,
  price_display text not null,
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.import_services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  icon_html text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.site_features (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  icon_class text not null default 'fas fa-star',
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  step_number int not null,
  title text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  unique (step_number)
);

create table if not exists public.why_choose_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  icon_class text not null default 'fas fa-check',
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is 'Key/value copy for hero, about, section headings, etc.';

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cars_updated_at on public.cars;
create trigger cars_updated_at before update on public.cars
  for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists import_services_updated_at on public.import_services;
create trigger import_services_updated_at before update on public.import_services
  for each row execute function public.set_updated_at();

drop trigger if exists site_features_updated_at on public.site_features;
create trigger site_features_updated_at before update on public.site_features
  for each row execute function public.set_updated_at();

drop trigger if exists process_steps_updated_at on public.process_steps;
create trigger process_steps_updated_at before update on public.process_steps
  for each row execute function public.set_updated_at();

drop trigger if exists why_choose_items_updated_at on public.why_choose_items;
create trigger why_choose_items_updated_at before update on public.why_choose_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: public read published; admins full CRUD
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.cars enable row level security;
alter table public.blog_posts enable row level security;
alter table public.import_services enable row level security;
alter table public.site_features enable row level security;
alter table public.process_steps enable row level security;
alter table public.why_choose_items enable row level security;
alter table public.site_settings enable row level security;

-- admin_users: admins can read own list
drop policy if exists "Admins read admin_users" on public.admin_users;
create policy "Admins read admin_users"
  on public.admin_users for select to authenticated
  using (public.is_admin());

-- cars
drop policy if exists "Public read published cars" on public.cars;
create policy "Public read published cars"
  on public.cars for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage cars" on public.cars;
create policy "Admins manage cars"
  on public.cars for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- blog_posts
drop policy if exists "Public read published blogs" on public.blog_posts;
create policy "Public read published blogs"
  on public.blog_posts for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage blogs" on public.blog_posts;
create policy "Admins manage blogs"
  on public.blog_posts for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- import_services
drop policy if exists "Public read published services" on public.import_services;
create policy "Public read published services"
  on public.import_services for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage services" on public.import_services;
create policy "Admins manage services"
  on public.import_services for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- site_features
drop policy if exists "Public read published features" on public.site_features;
create policy "Public read published features"
  on public.site_features for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage features" on public.site_features;
create policy "Admins manage features"
  on public.site_features for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- process_steps
drop policy if exists "Public read published steps" on public.process_steps;
create policy "Public read published steps"
  on public.process_steps for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage steps" on public.process_steps;
create policy "Admins manage steps"
  on public.process_steps for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- why_choose_items
drop policy if exists "Public read published why" on public.why_choose_items;
create policy "Public read published why"
  on public.why_choose_items for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins manage why" on public.why_choose_items;
create policy "Admins manage why"
  on public.why_choose_items for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- site_settings: public read all keys (marketing copy only)
drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings"
  on public.site_settings for select to anon, authenticated
  using (true);

drop policy if exists "Admins manage site_settings" on public.site_settings;
create policy "Admins manage site_settings"
  on public.site_settings for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- inquiries & newsletter: admin read/delete
drop policy if exists "Admins read inquiries" on public.inquiries;
create policy "Admins read inquiries"
  on public.inquiries for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins delete inquiries" on public.inquiries;
create policy "Admins delete inquiries"
  on public.inquiries for delete to authenticated
  using (public.is_admin());

drop policy if exists "Admins read newsletter" on public.newsletter_subscribers;
create policy "Admins read newsletter"
  on public.newsletter_subscribers for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins delete newsletter" on public.newsletter_subscribers;
create policy "Admins delete newsletter"
  on public.newsletter_subscribers for delete to authenticated
  using (public.is_admin());

-- Keep anon insert on inquiries / newsletter / hero_searches (from 001)

-- ---------------------------------------------------------------------------
-- Storage bucket for car/blog/service images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read website media" on storage.objects;
create policy "Public read website media"
  on storage.objects for select to public
  using (bucket_id = 'website-media');

drop policy if exists "Admins upload website media" on storage.objects;
create policy "Admins upload website media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'website-media' and public.is_admin());

drop policy if exists "Admins update website media" on storage.objects;
create policy "Admins update website media"
  on storage.objects for update to authenticated
  using (bucket_id = 'website-media' and public.is_admin());

drop policy if exists "Admins delete website media" on storage.objects;
create policy "Admins delete website media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'website-media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed default content (matches current static site)
-- ---------------------------------------------------------------------------
insert into public.cars (title, year, fuel_type, mileage, price_display, image_url, sort_order)
select * from (values
  ('TOYOTA HARRIER'::text, 2020, 'Hybrid'::text, '38,000 km'::text, 'KES 3,450,000'::text, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80'::text, 1),
  ('SUBARU FORESTER', 2019, 'Petrol', '45,000 km', 'KES 2,134,241', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80', 2),
  ('MERCEDES GLE', 2020, 'Diesel', '49,800 km', 'KES 8,236,934', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80', 3)
) as v(title, year, fuel_type, mileage, price_display, image_url, sort_order)
where not exists (select 1 from public.cars limit 1);

insert into public.blog_posts (title, slug, excerpt, content, sort_order) values
  ('Duty-Free Imports in Kenya', 'duty-free-imports-kenya', 'Who qualifies and the required documents to process your duty-free vehicle import.', 'Full article content — edit in admin dashboard.', 1),
  ('Japan vs UK Imports', 'japan-vs-uk-imports', 'Choosing the right source market for your budget and vehicle preference in Kenya.', 'Full article content — edit in admin dashboard.', 2),
  ('KRA Duty Breakdown', 'kra-duty-breakdown', 'Understanding all the landed cost line items and how duties are calculated in Kenya.', 'Full article content — edit in admin dashboard.', 3)
on conflict (slug) do nothing;

insert into public.import_services (title, description, icon_html, sort_order)
select * from (values
  ('Japan Car Imports', 'Quality used cars direct from Japan', '<i class="fas fa-flag"></i>', 1),
  ('UK Car Imports', 'Premium cars from the UK', '<i class="fas fa-flag"></i>', 2),
  ('Duty-Free Imports', 'Save on duties legally', '<i class="fas fa-percent"></i>', 3),
  ('Returning Resident', 'Import under RR scheme', '<i class="fas fa-plane-arrival"></i>', 4),
  ('PWD Imports', 'Special imports for PWDs', '<i class="fas fa-wheelchair"></i>', 5),
  ('Car Clearance', 'Smooth clearance at Mombasa', '<i class="fas fa-file-signature"></i>', 6),
  ('Vehicle Inspection', 'Pre-shipment & inspection', '<i class="fas fa-clipboard-check"></i>', 7),
  ('Delivery Kenya', 'Nationwide safe delivery', '<i class="fas fa-shipping-fast"></i>', 8)
) as v(title, description, icon_html, sort_order)
where not exists (select 1 from public.import_services limit 1);

insert into public.site_features (title, description, icon_class, sort_order)
select * from (values
  ('Transparent Pricing', 'No hidden charges', 'fas fa-tags', 1),
  ('Verified Vehicles', 'Quality checked', 'fas fa-shield-alt', 2),
  ('Secure Payments', '100% safe transactions', 'fas fa-lock', 3),
  ('Nationwide Delivery', 'Across Kenya', 'fas fa-truck', 4)
) as v(title, description, icon_class, sort_order)
where not exists (select 1 from public.site_features limit 1);

insert into public.process_steps (step_number, title, sort_order)
select * from (values
  (1, 'Choose Your Car', 1),
  (2, 'Request Quotation', 2),
  (3, 'Confirm Order', 3),
  (4, 'Shipping & Tracking', 4),
  (5, 'Port Arrival', 5),
  (6, 'Clearance & Registration', 6),
  (7, 'Delivery', 7)
) as v(step_number, title, sort_order)
where not exists (select 1 from public.process_steps limit 1);

insert into public.why_choose_items (title, description, icon_class, sort_order)
select * from (values
  ('Expert Team', 'Dedicated advisors from quotation through delivery.', 'fas fa-users', 1),
  ('Clear Landed Costs', 'Upfront breakdown of all costs before you commit.', 'fas fa-calculator', 2),
  ('Trusted Network', 'Established partners in Japan, UK, and at Mombasa port.', 'fas fa-handshake', 3),
  ('After-Sales Support', 'Registration help and post-delivery assistance.', 'fas fa-headset', 4)
) as v(title, description, icon_class, sort_order)
where not exists (select 1 from public.why_choose_items limit 1);

insert into public.site_settings (key, value) values
  ('hero_title', 'Import Your Dream Car to Kenya with Confidence'),
  ('hero_subtitle', 'Transparent, reliable and hassle-free car importation services from Japan, UK, Thailand and other markets to Kenya.'),
  ('about_title', 'About Speedgate Logistics'),
  ('about_body', 'Speedgate Logistics helps Kenyans import dream cars with confidence from Japan, the UK, Thailand, and beyond.')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Create admin auth users + link admin_users (idempotent by email)
-- ---------------------------------------------------------------------------
create or replace function public.seed_admin_user(admin_email text, admin_password text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  existing_id uuid;
  new_id uuid := gen_random_uuid();
begin
  select id into existing_id from auth.users where lower(email) = lower(admin_email) limit 1;

  if existing_id is not null then
    insert into public.admin_users (user_id, email, active)
    values (existing_id, lower(admin_email), true)
    on conflict (email) do update set user_id = excluded.user_id, active = true;
    return existing_id;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    is_sso_user,
    is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    lower(admin_email),
    extensions.crypt(admin_password, extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false,
    false
  );

  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    new_id::text,
    new_id,
    jsonb_build_object('sub', new_id::text, 'email', lower(admin_email)),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.admin_users (user_id, email, active)
  values (new_id, lower(admin_email), true)
  on conflict (email) do update set user_id = excluded.user_id, active = true;

  return new_id;
end;
$$;

select public.seed_admin_user('speedgateauto@gmail.com', '#speedgateauto');
select public.seed_admin_user('johnkamau.maestro@gmail.com', '#speedgateauto');

drop function if exists public.seed_admin_user(text, text);

-- Enable Email provider in Dashboard → Authentication → Providers if not already on.
