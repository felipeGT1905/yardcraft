-- YardCraft Phase 1 (Auth + RBAC + Designs policies)
-- Run in Supabase SQL editor.

-- 1) Profiles table for RBAC
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can see their own profile; admins can see all
-- Drop any legacy/recursive policies from earlier iterations.
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_admin_select_all" on public.profiles;
drop policy if exists "profiles_admin_read_all" on public.profiles;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- IMPORTANT:
-- Do not add a policy like “admins can select all profiles” using a subquery back into
-- public.profiles here — that causes infinite recursion in Postgres RLS.
-- For Phase 1, we only need to read the current user's role (own row).

-- 2) Designs table policies
-- Ensure table exists (if you already created it, this is safe)
create table if not exists public.designs (
  slug text primary key,
  before_image text,
  after_image text,
  created_at timestamptz not null default now()
);

alter table public.designs enable row level security;

-- Public can read designs (homeowner pages)
drop policy if exists "designs_select_public" on public.designs;
create policy "designs_select_public"
on public.designs
for select
to anon, authenticated
using (true);

-- Only admins can insert/update designs
drop policy if exists "designs_write_admin" on public.designs;
create policy "designs_write_admin"
on public.designs
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- 3) Optional audit fields (ops visibility)
alter table public.designs
  add column if not exists updated_at timestamptz not null default now();

alter table public.designs
  add column if not exists updated_by uuid null references auth.users(id);

-- Keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_designs_updated_at on public.designs;
create trigger trg_designs_updated_at
before update on public.designs
for each row
execute function public.set_updated_at();

