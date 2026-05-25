-- YardCraft: bootstrap first admin user
-- Run in Supabase Dashboard → SQL Editor (runs as postgres, bypasses RLS).
--
-- Login after running:
--   Email:    admin@admin123.com
--   Password: admin123.com

create extension if not exists pgcrypto with schema extensions;

do $$
declare
  v_email text := 'admin@admin123.com';
  v_password text := 'admin123.com';
  v_user_id uuid;
  v_encrypted_pw text;
begin
  select id into v_user_id
  from auth.users
  where lower(email) = lower(v_email)
  limit 1;

  if v_user_id is null then
    v_user_id := gen_random_uuid();
    v_encrypted_pw := crypt(v_password, gen_salt('bf'));

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      v_user_id,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      v_user_id::text,
      now(),
      now(),
      now()
    );
  else
    -- Ensure password matches (re-hash if user already existed)
    update auth.users
    set
      encrypted_password = crypt(v_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at = now()
    where id = v_user_id;
  end if;

  insert into public.profiles (id, role)
  values (v_user_id, 'admin')
  on conflict (id) do update set role = 'admin';
end $$;

-- Verify
select u.id, u.email, p.role
from auth.users u
join public.profiles p on p.id = u.id
where lower(u.email) = 'admin@admin123.com';
