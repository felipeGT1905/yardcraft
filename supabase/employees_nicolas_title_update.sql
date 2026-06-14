-- Update Nicolas Gomez job title (card page + VCF both read job_title from DB)
-- Run in Supabase SQL Editor. Safe to re-run.

update public.employees
set
  job_title = 'Managing Partner',
  updated_at = now()
where slug = 'nicolas';
