-- =============================================================================
-- Blog SEO: meta_description for Google preview (slug already exists in 002)
-- Run in Supabase SQL Editor after 002_admin_cms_auth.sql
-- =============================================================================

alter table public.blog_posts
  add column if not exists meta_description text;

comment on column public.blog_posts.slug is 'URL path segment, e.g. blog.html?slug=duty-free-imports-kenya';
comment on column public.blog_posts.meta_description is 'SEO meta description (~150–160 chars for search snippets).';

-- Backfill meta from excerpt where empty
update public.blog_posts
set meta_description = left(excerpt, 160)
where meta_description is null
  and excerpt is not null
  and excerpt <> '';
