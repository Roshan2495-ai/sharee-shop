-- ==============================================================================
-- STORAGE SETUP & MIGRATION SCRIPT
-- Run this script in the Supabase SQL Editor to configure file storage.
-- This handles both the 'saree-images' bucket and the new 'hero-banners' bucket.
-- ==============================================================================

-- 1. SAREE IMAGES BUCKET
-- Used for uploading service/product images
insert into storage.buckets (id, name, public)
values ('saree-images', 'saree-images', true)
on conflict (id) do nothing;

-- Policies for saree-images
-- We drop existing policies first to avoid "policy already exists" errors during migration

drop policy if exists "Public Access Saree Images" on storage.objects;
create policy "Public Access Saree Images"
  on storage.objects for select
  using ( bucket_id = 'saree-images' );

drop policy if exists "Public Upload Saree Images" on storage.objects;
create policy "Public Upload Saree Images"
  on storage.objects for insert
  with check ( bucket_id = 'saree-images' );

drop policy if exists "Public Update Saree Images" on storage.objects;
create policy "Public Update Saree Images"
  on storage.objects for update
  using ( bucket_id = 'saree-images' );

drop policy if exists "Public Delete Saree Images" on storage.objects;
create policy "Public Delete Saree Images"
  on storage.objects for delete
  using ( bucket_id = 'saree-images' );


-- 2. HERO BANNERS BUCKET
-- Used for the dynamic homepage banner
insert into storage.buckets (id, name, public)
values ('hero-banners', 'hero-banners', true)
on conflict (id) do nothing;

-- Policies for hero-banners

drop policy if exists "Public Access Hero Banners" on storage.objects;
create policy "Public Access Hero Banners"
  on storage.objects for select
  using ( bucket_id = 'hero-banners' );

drop policy if exists "Public Upload Hero Banners" on storage.objects;
create policy "Public Upload Hero Banners"
  on storage.objects for insert
  with check ( bucket_id = 'hero-banners' );

drop policy if exists "Public Update Hero Banners" on storage.objects;
create policy "Public Update Hero Banners"
  on storage.objects for update
  using ( bucket_id = 'hero-banners' );

-- NOTE: The frontend (React) is configured to look for a file named 'hero-banner' 
-- inside the 'hero-banners' bucket. If this file does not exist, it falls back 
-- to the default Unsplash image automatically.
