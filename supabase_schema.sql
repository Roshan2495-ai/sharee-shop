-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create SERVICES table
create table if not exists public.services (
  id text primary key,
  name text not null,
  image text,
  description text,
  price_range text,
  status text check (status in ('Active', 'Inactive')) default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create APPOINTMENTS table
create table if not exists public.appointments (
  id text primary key,
  service_id text references public.services(id),
  customer_name text not null,
  phone text not null,
  appointment_date text not null,
  appointment_time text not null,
  notes text,
  admin_notes text,
  status text check (status in ('Booked', 'Received', 'In Progress', 'Completed', 'Delivered')) default 'Booked',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  saree_image text,
  fabric_type text,
  pleating_type text,
  waist_size text,
  pickup_method text
);

-- 4. Enable Row Level Security (RLS) for Tables
alter table public.services enable row level security;
alter table public.appointments enable row level security;

-- 5. Create Security Policies for Tables
drop policy if exists "Enable all access for services" on public.services;
create policy "Enable all access for services" on public.services
  for all using (true) with check (true);

drop policy if exists "Enable all access for appointments" on public.appointments;
create policy "Enable all access for appointments" on public.appointments
  for all using (true) with check (true);

-- 6. Seed Default Data (Only if empty)
insert into public.services (id, name, image, description, price_range, status)
values 
('srv-fold-01', 'Box Folding', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop', 'Expert box folding service. We fold your saree into a compact, wrinkle-free shape perfect for storage or travel.', '₹50 - ₹100', 'Active'),
('srv-pleat-02', 'Floppy Pleatings', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop', 'Professional pre-pleating service. We create perfect, ironed pleats (patli) that make draping your saree taking only 1 minute.', '₹150 - ₹250', 'Active')
on conflict (id) do nothing;

-- ==========================================
-- 7. STORAGE BUCKET SETUP
-- ==========================================

-- Create a public bucket named 'saree-images' if it doesn't exist
insert into storage.buckets (id, name, public)
values ('saree-images', 'saree-images', true)
on conflict (id) do nothing;

-- 8. STORAGE POLICIES (Allow Public Read/Write)
-- Note: In a stricter app, you would limit 'insert' to authenticated users, 
-- but for a public booking form, we allow public uploads.

-- Allow Public View (Select)
drop policy if exists "Public Access Saree Images" on storage.objects;
create policy "Public Access Saree Images"
  on storage.objects for select
  using ( bucket_id = 'saree-images' );

-- Allow Public Upload (Insert)
drop policy if exists "Public Upload Saree Images" on storage.objects;
create policy "Public Upload Saree Images"
  on storage.objects for insert
  with check ( bucket_id = 'saree-images' );

-- Allow Public Update/Delete (Optional, primarily for Admin dashboard)
drop policy if exists "Public Update Saree Images" on storage.objects;
create policy "Public Update Saree Images"
  on storage.objects for update
  using ( bucket_id = 'saree-images' );

drop policy if exists "Public Delete Saree Images" on storage.objects;
create policy "Public Delete Saree Images"
  on storage.objects for delete
  using ( bucket_id = 'saree-images' );
