-- Add personal Instagram for Felipe and Nicolas only.
-- Run in Supabase SQL Editor. Safe to re-run.

update public.employees
set
  social_links = social_links || '{"personal_instagram":"https://www.instagram.com/felipecolombian?igsh=ZTAwb2g5M2V4c2xm&utm_source=qr"}'::jsonb,
  updated_at = now()
where slug = 'felipe';

update public.employees
set
  social_links = social_links || '{"personal_instagram":"https://www.instagram.com/nicofollowsjesus?igsh=MW4xcnBjcWR2d2xtNg=="}'::jsonb,
  updated_at = now()
where slug = 'nicolas';
