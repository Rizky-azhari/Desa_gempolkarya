-- Create Enums
create type public.user_role as enum (
  'super_admin',
  'admin_desa',
  'kepala_desa',
  'sekretaris_desa'
);

create type public.user_status as enum (
  'Aktif',
  'Nonaktif'
);

create type public.complaint_status as enum (
  'Dikirim',
  'Diproses',
  'Ditindaklanjuti',
  'Selesai',
  'Ditolak'
);

create type public.publication_status as enum (
  'draft',
  'published',
  'archived'
);

-- Create Profiles Table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'admin_desa',
  status public.user_status not null default 'Aktif',
  fixed boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Create Village Profile Table
create table public.village_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slogan text,
  address text,
  phone text,
  whatsapp text,
  email text,
  service_hours text,
  history text,
  vision text,
  mission text,
  geography text,
  north_boundary text,
  south_boundary text,
  east_boundary text,
  west_boundary text,
  area_size text,
  population_total integer default 0,
  family_total integer default 0,
  rt_total integer default 0,
  rw_total integer default 0,
  male_total integer default 0,
  female_total integer default 0,
  latitude double precision,
  longitude double precision,
  map_embed_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.village_profile enable row level security;

-- Create Services Table
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  requirements text[] default '{}',
  estimated_time text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

-- Create News Table
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  excerpt text,
  content text,
  image_url text,
  status public.publication_status not null default 'published',
  published_at date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;

-- Create Officials Table
create table public.officials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  task_area text,
  phone text,
  photo_url text,
  category text,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.officials enable row level security;

-- Create RT/RW Locations Table
create table public.rtrw_locations (
  id uuid primary key default gen_random_uuid(),
  rw text not null,
  rt text not null,
  leader_name text not null,
  phone text,
  area_name text,
  address text,
  latitude double precision,
  longitude double precision,
  map_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rtrw_locations enable row level security;

-- Create Complaints Table
create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  reporter_name text,
  whatsapp text,
  address text,
  rt_rw text,
  category text not null,
  title text not null,
  description text not null,
  incident_location text,
  photo_url text,
  is_anonymous boolean not null default false,
  status public.complaint_status not null default 'Dikirim',
  officer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.complaints enable row level security;

-- Create UMKM Table
create table public.umkm (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  owner_name text not null,
  category text not null,
  description text,
  price text,
  location text,
  whatsapp text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.umkm enable row level security;

-- Create Gallery Table
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_url text not null,
  event_date date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

-- Create Potentials Table
create table public.potentials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  image_url text,
  summary_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.potentials enable row level security;

-- Create Demographics Table
create table public.demographics (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  label text not null,
  value integer not null default 0,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.demographics enable row level security;


-- ==================================================
-- RLS POLICIES
-- ==================================================

-- Village Profile Read
create policy "Public can read village profile"
on public.village_profile
for select
to anon, authenticated
using (true);

-- Village Profile CRUD for authenticated staff
create policy "Authenticated users can update village profile"
on public.village_profile
for update
to authenticated
using (true)
with check (true);

-- Services Read
create policy "Public can read active services"
on public.services
for select
to anon, authenticated
using (is_active = true);

-- Services CRUD for authenticated staff
create policy "Authenticated users can CRUD services"
on public.services
for all
to authenticated
using (true)
with check (true);

-- News Read
create policy "Public can read published news"
on public.news
for select
to anon, authenticated
using (status = 'published');

-- News CRUD for authenticated staff
create policy "Authenticated users can CRUD news"
on public.news
for all
to authenticated
using (true)
with check (true);

-- Officials Read
create policy "Public can read officials"
on public.officials
for select
to anon, authenticated
using (true);

-- Officials CRUD for authenticated staff
create policy "Authenticated users can CRUD officials"
on public.officials
for all
to authenticated
using (true)
with check (true);

-- RT/RW Locations Read
create policy "Public can read RT RW locations"
on public.rtrw_locations
for select
to anon, authenticated
using (is_active = true);

-- RT/RW Locations CRUD for authenticated staff
create policy "Authenticated users can CRUD RT RW locations"
on public.rtrw_locations
for all
to authenticated
using (true)
with check (true);

-- UMKM Read
create policy "Public can read active UMKM"
on public.umkm
for select
to anon, authenticated
using (is_active = true);

-- UMKM CRUD for authenticated staff
create policy "Authenticated users can CRUD UMKM"
on public.umkm
for all
to authenticated
using (true)
with check (true);

-- Gallery Read
create policy "Public can read gallery"
on public.gallery
for select
to anon, authenticated
using (true);

-- Gallery CRUD for authenticated staff
create policy "Authenticated users can CRUD gallery"
on public.gallery
for all
to authenticated
using (true)
with check (true);

-- Potentials Read
create policy "Public can read potentials"
on public.potentials
for select
to anon, authenticated
using (true);

-- Potentials CRUD for authenticated staff
create policy "Authenticated users can CRUD potentials"
on public.potentials
for all
to authenticated
using (true)
with check (true);

-- Demographics Read
create policy "Public can read demographics"
on public.demographics
for select
to anon, authenticated
using (true);

-- Demographics CRUD for authenticated staff
create policy "Authenticated users can CRUD demographics"
on public.demographics
for all
to authenticated
using (true)
with check (true);

-- Complaints Insert
create policy "Public can submit complaints"
on public.complaints
for insert
to anon, authenticated
with check (true);

-- Complaints Select
create policy "Authenticated internal users can read complaints"
on public.complaints
for select
to authenticated
using (true);

-- Complaints Update
create policy "Authenticated internal users can update complaints"
on public.complaints
for update
to authenticated
using (true)
with check (true);

-- Profiles Select: any authenticated user can read their own profile (non-recursive)
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Profiles Select All: any authenticated user can read all profiles (role enforcement done at app layer)
create policy "Authenticated users can read all profiles"
on public.profiles
for select
to authenticated
using (true);

-- Profiles Update: users can update their own profile fields
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Profiles Admin Full Access: service_role has unrestricted access (used by server-side admin operations)
create policy "Service role full access profiles"
on public.profiles
for all
to service_role
using (true)
with check (true);
