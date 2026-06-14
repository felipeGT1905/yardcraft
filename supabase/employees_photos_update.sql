-- YardCraft: set profile photos for employees
-- Run after employees_seed.sql. Safe to re-run.
-- Images are served from /public/images/employees/

update public.employees
set
  photo_url = '/images/employees/javier.png',
  updated_at = now()
where slug = 'javier';

update public.employees
set
  photo_url = '/images/employees/steven.png',
  updated_at = now()
where slug = 'steven';

update public.employees
set
  photo_url = '/images/employees/nicolas.png',
  updated_at = now()
where slug = 'nicolas';

update public.employees
set
  photo_url = '/images/employees/felipe.png',
  updated_at = now()
where slug = 'felipe';
