-- Auxesis Fresh Produce: database changes for batch tracing and farmer registration.
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- It is safe to run more than once. Run it BEFORE putting the new site version online.
--
-- Supabase may show a "destructive operation" warning because of the "drop policy if exists"
-- and "drop trigger if exists" lines. They only replace the rules defined in this file.

-- ---------------------------------------------------------------
-- 1. An optional block or field name on each batch (for example "Greenhouse 2").
-- ---------------------------------------------------------------
alter table public.production_batches
  add column if not exists block text check (block is null or char_length(block) <= 60);

-- ---------------------------------------------------------------
-- 2. Stage history: the date each batch reached each stage.
-- Anyone may read it (the tracker is public). Nobody can change it directly;
-- it is filled in automatically whenever a batch changes stage.
-- ---------------------------------------------------------------
create table if not exists public.batch_events (
  id          uuid primary key default gen_random_uuid(),
  batch_id    uuid not null references public.production_batches (id) on delete cascade,
  stage       public.batch_stage not null,
  occurred_on date not null default current_date,
  created_at  timestamptz not null default now(),
  unique (batch_id, stage)
);

alter table public.batch_events enable row level security;

drop policy if exists "Public can read batch events" on public.batch_events;
create policy "Public can read batch events"
  on public.batch_events for select using (true);

-- Belt and braces: no direct writes from the website, whatever the rules say.
revoke insert, update, delete on public.batch_events from anon, authenticated;

create or replace function public.log_batch_stage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date date;
begin
  if tg_op = 'UPDATE' and new.stage is not distinct from old.stage then
    return new;
  end if;

  -- Moving a batch back to an earlier stage removes the later stages from its history.
  if tg_op = 'UPDATE' then
    delete from public.batch_events where batch_id = new.id and stage > new.stage;
  end if;

  -- A new batch always has a planting date.
  if tg_op = 'INSERT' then
    insert into public.batch_events (batch_id, stage, occurred_on)
    values (new.id, 'planted', new.planted_on)
    on conflict (batch_id, stage) do nothing;
  end if;

  v_date := case new.stage
    when 'planted'          then new.planted_on
    when 'harvested'        then coalesce(new.harvested_on, current_date)
    when 'ready_for_market' then coalesce(new.market_ready_on, current_date)
    else current_date
  end;

  insert into public.batch_events (batch_id, stage, occurred_on)
  values (new.id, new.stage, v_date)
  on conflict (batch_id, stage) do update set occurred_on = excluded.occurred_on;

  return new;
end;
$$;

drop trigger if exists log_batch_stage on public.production_batches;
create trigger log_batch_stage
  after insert or update of stage on public.production_batches
  for each row execute function public.log_batch_stage();

-- Fill in history for batches that already exist, using the dates we already know.
insert into public.batch_events (batch_id, stage, occurred_on)
select b.id, 'planted'::public.batch_stage, b.planted_on
from public.production_batches b
on conflict (batch_id, stage) do nothing;

insert into public.batch_events (batch_id, stage, occurred_on)
select b.id, 'harvested'::public.batch_stage, b.harvested_on
from public.production_batches b
where b.harvested_on is not null and b.stage >= 'harvested'
on conflict (batch_id, stage) do nothing;

insert into public.batch_events (batch_id, stage, occurred_on)
select b.id, 'ready_for_market'::public.batch_stage, b.market_ready_on
from public.production_batches b
where b.market_ready_on is not null and b.stage >= 'ready_for_market'
on conflict (batch_id, stage) do nothing;

insert into public.batch_events (batch_id, stage, occurred_on)
select b.id, b.stage, b.created_at::date
from public.production_batches b
on conflict (batch_id, stage) do nothing;

-- ---------------------------------------------------------------
-- 3. Farmer registrations from the "Work with us" page.
-- Anyone may send one (insert only); only staff may read or delete them.
-- ---------------------------------------------------------------
create table if not exists public.farmer_registrations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null check (char_length(phone) between 5 and 30),
  county     text not null check (char_length(county) between 1 and 80),
  crops      text not null check (char_length(crops) between 1 and 200),
  volume     text check (volume is null or char_length(volume) <= 120),
  message    text check (message is null or char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.farmer_registrations enable row level security;

drop policy if exists "Public can register as a farmer" on public.farmer_registrations;
create policy "Public can register as a farmer"
  on public.farmer_registrations for insert to anon, authenticated with check (true);

drop policy if exists "Staff read farmer registrations" on public.farmer_registrations;
create policy "Staff read farmer registrations"
  on public.farmer_registrations for select to authenticated using (public.is_staff());

drop policy if exists "Staff delete farmer registrations" on public.farmer_registrations;
create policy "Staff delete farmer registrations"
  on public.farmer_registrations for delete to authenticated using (public.is_staff());
