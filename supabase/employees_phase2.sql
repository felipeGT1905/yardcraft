-- YardCraft Phase 2 — Digital business cards (employees data layer)
-- Run in Supabase SQL editor after yardcraft_phase1.sql.

-- 1) Employees table
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null default '',
  job_title text not null default '',
  office_phone text,
  direct_phone text,
  email text,
  location text,
  photo_url text,
  social_links jsonb not null default '{}'::jsonb,
  notes text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_slug_idx on public.employees (slug);
create index if not exists employees_is_published_idx on public.employees (is_published);

alter table public.employees enable row level security;

-- Public can read published employee cards only
drop policy if exists "employees_select_published" on public.employees;
create policy "employees_select_published"
on public.employees
for select
to anon, authenticated
using (is_published = true);

-- Only admins can insert/update/delete employees
drop policy if exists "employees_write_admin" on public.employees;
create policy "employees_write_admin"
on public.employees
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

-- Keep updated_at fresh on updates (reuses public.set_updated_at from phase 1)
drop trigger if exists trg_employees_updated_at on public.employees;
create trigger trg_employees_updated_at
before update on public.employees
for each row
execute function public.set_updated_at();
