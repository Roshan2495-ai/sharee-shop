-- ==============================================================================
-- HERO BANNER STORAGE SETUP
-- Run this script in the Supabase SQL Editor to configure the hero banner storage.
-- ==============================================================================

-- 1. Create the 'hero-banners' bucket
insert into storage.buckets (id, name, public)
values ('hero-banners', 'hero-banners', true)
on conflict (id) do nothing;

-- 2. Enable Public Read Access (Select)
drop policy if exists "Public Access Hero Banners" on storage.objects;
create policy "Public Access Hero Banners"
  on storage.objects for select
  using ( bucket_id = 'hero-banners' );

-- 3. Enable Public Upload Access (Insert)
drop policy if exists "Public Upload Hero Banners" on storage.objects;
create policy "Public Upload Hero Banners"
  on storage.objects for insert
  with check ( bucket_id = 'hero-banners' );

-- 4. Enable Public Update Access (Update)
-- This allows overwriting the existing banner file
drop policy if exists "Public Update Hero Banners" on storage.objects;
create policy "Public Update Hero Banners"
  on storage.objects for update
  using ( bucket_id = 'hero-banners' );
