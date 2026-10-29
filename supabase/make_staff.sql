-- Make an existing account an Auxesis staff member (full access to every farm and batch).
--
-- 1. Create the account first: Supabase dashboard > Authentication > Users > Add user.
--    Enter the email and a password, and tick "Auto Confirm User".
-- 2. Replace you@example.com below with that same email.
-- 3. Run this in the SQL Editor. It should say "Success. 1 row" if the account was found.
--
-- To remove someone's staff access later:
--   delete from public.staff where user_id = (select id from auth.users where email = 'person@example.com');

insert into public.staff (user_id, note)
select id, 'Auxesis staff'
from auth.users
where lower(email) = lower('you@example.com')
on conflict (user_id) do nothing;
