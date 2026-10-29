-- Auxesis Fresh Produce: farmer access (run AFTER schema.sql)
-- Run this whole file once: Supabase dashboard > SQL Editor > New query > paste > Run.
--
-- What it does:
--   * Adds a table linking each farmer's login to the farm(s) they belong to.
--   * Lets a farmer add and update batches ONLY for their own farm(s).
--   * Lets Auxesis staff link or unlink farmers, and see who is linked.
-- Public visitors still only read the tracker. Staff rules from schema.sql are unchanged.

-- ---------------------------------------------------------------
-- 1. Which farmer belongs to which farm
-- ---------------------------------------------------------------
create table if not exists public.farm_members (
  user_id uuid not null references auth.users (id) on delete cascade,
  farm_id uuid not null references public.farms (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, farm_id)
);

create index if not exists farm_members_farm_idx on public.farm_members (farm_id);

alter table public.farm_members enable row level security;

-- ---------------------------------------------------------------
-- 2. Helper: the farms the signed-in user belongs to
-- ---------------------------------------------------------------
create or replace function public.my_farm_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select farm_id from public.farm_members where user_id = auth.uid();
$$;

revoke all on function public.my_farm_ids() from public, anon;
grant execute on function public.my_farm_ids() to authenticated;

-- ---------------------------------------------------------------
-- 3. Security rules
-- ---------------------------------------------------------------
-- A signed-in user can see their own membership rows; staff can see all.
drop policy if exists "Users see own farm links" on public.farm_members;
create policy "Users see own farm links"
  on public.farm_members for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- Farmers add batches only to their own farm(s).
drop policy if exists "Farmers add own batches" on public.production_batches;
create policy "Farmers add own batches"
  on public.production_batches for insert to authenticated
  with check (farm_id in (select public.my_farm_ids()));

-- Farmers change batches only on their own farm(s), and cannot move a batch to another farm.
drop policy if exists "Farmers update own batches" on public.production_batches;
create policy "Farmers update own batches"
  on public.production_batches for update to authenticated
  using (farm_id in (select public.my_farm_ids()))
  with check (farm_id in (select public.my_farm_ids()));

-- Note: farmers cannot delete batches. Only staff can (existing "Staff manage batches" rule).

-- ---------------------------------------------------------------
-- 3b. Automatic batch codes, so farmers never have to invent one.
-- A new batch with no code gets e.g. AUX-KAR-100 (first three letters of the farm name).
-- ---------------------------------------------------------------
create sequence if not exists public.batch_code_seq start 100;

create or replace function public.set_batch_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_abbr text;
begin
  if new.batch_code is null or btrim(new.batch_code) = '' then
    select nullif(upper(left(regexp_replace(name, '[^A-Za-z]', '', 'g'), 3)), '')
      into v_abbr from public.farms where id = new.farm_id;
    new.batch_code := 'AUX-' || coalesce(v_abbr, 'FRM') || '-' ||
                      lpad(nextval('public.batch_code_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists set_batch_code on public.production_batches;
create trigger set_batch_code
  before insert on public.production_batches
  for each row execute function public.set_batch_code();

-- ---------------------------------------------------------------
-- 4. Staff tools: link a farmer's login to a farm by email
-- ---------------------------------------------------------------
create or replace function public.link_farmer(p_email text, p_farm_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
begin
  if not public.is_staff() then
    raise exception 'Only Auxesis staff can link farmers';
  end if;

  select id into v_user from auth.users where lower(email) = lower(trim(p_email));
  if v_user is null then
    raise exception 'No account found for that email. Create the account in Supabase first.';
  end if;

  if not exists (select 1 from public.farms where id = p_farm_id) then
    raise exception 'That farm does not exist';
  end if;

  insert into public.farm_members (user_id, farm_id) values (v_user, p_farm_id)
  on conflict do nothing;
end;
$$;

create or replace function public.unlink_farmer(p_user_id uuid, p_farm_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Only Auxesis staff can unlink farmers';
  end if;
  delete from public.farm_members where user_id = p_user_id and farm_id = p_farm_id;
end;
$$;

-- Who is linked to which farm (with their email). Staff only.
create or replace function public.list_farm_members()
returns table (farm_id uuid, user_id uuid, email text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Only Auxesis staff can list farmers';
  end if;
  return query
    select m.farm_id, m.user_id, u.email::text
    from public.farm_members m
    join auth.users u on u.id = m.user_id
    order by u.email;
end;
$$;

revoke all on function public.link_farmer(text, uuid) from public, anon;
revoke all on function public.unlink_farmer(uuid, uuid) from public, anon;
revoke all on function public.list_farm_members() from public, anon;
grant execute on function public.link_farmer(text, uuid) to authenticated;
grant execute on function public.unlink_farmer(uuid, uuid) to authenticated;
grant execute on function public.list_farm_members() to authenticated;
