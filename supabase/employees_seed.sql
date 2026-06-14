-- YardCraft: seed published employee business cards
-- Run in Supabase Dashboard → SQL Editor after employees_phase2.sql.
-- Safe to re-run: upserts on slug.

with shared as (
  select
    $notes$YardCraft | Crafting Your Outdoor Dream

Company: YardCraft

Services:
Landscaping
Landscape Design & Renovations
Hardscaping
Outdoor Living & Transformations
Backyard & Front Yard Renovations
Property Cleanups
Mulch Installation
Planting, Garden Beds & Shrub Installation
Trimming, Pruning & Weeding
Lawn Care & Mowing
Spring & Fall Cleanups
Leaf Removal
Power Washing
Drainage Solutions
Patios, Walkways & Decks
Fences
Retaining Walls
Property Maintenance

Serving Arlington, McLean, Falls Church, Alexandria, Fairfax, Vienna, Tysons, Washington DC, Maryland, and the DMV Area.

Built on faith, integrity, and excellence.

"Whatever you do, work heartily, as for the Lord and not for men." — Colossians 3:23$notes$::text as notes,
    '{"website":"https://www.yardcraft.us/","instagram":"https://www.instagram.com/yardcraftus","google_reviews":"https://maps.app.goo.gl/FQyEFfFCnRYPWYXq5"}'::jsonb as social_links
),
rows as (
  select *
  from (
    values
      ('felipe', 'Felipe Gomez', 'Growth Director', '+15717740966', 'felipe@yardcraft.us', '/images/employees/felipe.png'),
      ('javier', 'Javier Perez', 'Project Director', '+17033039064', 'javier@yardcraft.us', '/images/employees/javier.png'),
      ('nicolas', 'Nicolas Gomez', 'Managing Partner', '+15715764992', 'support@yardcraft.us', '/images/employees/nicolas.png'),
      ('ricardo', 'Ricardo Perez', 'Relationship Manager', '+15712439764', 'support@yardcraft.us', null),
      ('steven', 'Steven Perez', 'Strategic Operations', '+15714381525', 'support@yardcraft.us', '/images/employees/steven.png')
  ) as v(slug, display_name, job_title, direct_phone, email, photo_url)
)
insert into public.employees (
  slug,
  display_name,
  job_title,
  office_phone,
  direct_phone,
  email,
  location,
  photo_url,
  social_links,
  notes,
  is_published
)
select
  r.slug,
  r.display_name,
  r.job_title,
  '+15715833321',
  r.direct_phone,
  r.email,
  'Arlington, VA',
  r.photo_url,
  case r.slug
    when 'felipe' then
      s.social_links || '{"personal_instagram":"https://www.instagram.com/felipecolombian?igsh=ZTAwb2g5M2V4c2xm&utm_source=qr"}'::jsonb
    when 'nicolas' then
      s.social_links || '{"personal_instagram":"https://www.instagram.com/nicofollowsjesus?igsh=MW4xcnBjcWR2d2xtNg=="}'::jsonb
    else s.social_links
  end,
  s.notes,
  true
from rows r
cross join shared s
on conflict (slug) do update set
  display_name = excluded.display_name,
  job_title = excluded.job_title,
  office_phone = excluded.office_phone,
  direct_phone = excluded.direct_phone,
  email = excluded.email,
  location = excluded.location,
  photo_url = excluded.photo_url,
  social_links = excluded.social_links,
  notes = excluded.notes,
  is_published = excluded.is_published,
  updated_at = now();
