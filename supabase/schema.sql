-- Auxesis Fresh Produce: database schema
-- Run this whole file once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- It is safe to read top to bottom; each section is commented.

-- ---------------------------------------------------------------
-- 1. Types
-- ---------------------------------------------------------------
create type public.batch_stage as enum (
  'planted',
  'growing',
  'harvesting',
  'harvested',
  'grading_packing',
  'ready_for_market',
  'dispatched'
);

-- ---------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------
create table public.farms (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  county      text not null,
  farmer      text,
  is_own_farm boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.production_batches (
  id              uuid primary key default gen_random_uuid(),
  farm_id         uuid not null references public.farms (id) on delete restrict,
  batch_code      text not null unique,
  crop            text not null check (crop in (
                    'Local Cucumber','English Cucumber','Red Capsicum','Yellow Capsicum',
                    'Chillies','Butternuts','Broccoli','Cauliflower','Zucchini')),
  variety         text,
  stage           public.batch_stage not null default 'planted',
  planted_on      date not null,
  expected_harvest date,
  harvested_on    date,
  market_ready_on date,
  quantity_kg     integer not null check (quantity_kg >= 0),
  grade           text,
  notes           text,
  created_at      timestamptz not null default now()
);

create index production_batches_farm_idx  on public.production_batches (farm_id);
create index production_batches_stage_idx on public.production_batches (stage);

-- Wholesale / quote enquiries submitted from the public site (step 10).
create table public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null check (char_length(phone) between 5 and 30),
  email      text check (email is null or char_length(email) <= 200),
  crop       text check (crop is null or char_length(crop) <= 120),
  quantity   text check (quantity is null or char_length(quantity) <= 120),
  delivery_point text check (delivery_point is null or char_length(delivery_point) <= 200),
  message    text check (message is null or char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 3. Who counts as staff
-- Anyone can sign up for an account, but ONLY users listed in this
-- table can change data. You add staff by hand (see the end of file).
-- ---------------------------------------------------------------
create table public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note    text
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------
alter table public.farms              enable row level security;
alter table public.production_batches enable row level security;
alter table public.enquiries          enable row level security;
alter table public.staff              enable row level security;

-- Public tracker: anyone may read farms and batches.
create policy "Public can read farms"
  on public.farms for select using (true);
create policy "Public can read batches"
  on public.production_batches for select using (true);

-- Only staff may add, change or delete farms and batches.
create policy "Staff manage farms"
  on public.farms for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "Staff manage batches"
  on public.production_batches for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Enquiries: the public may submit one (insert only); only staff may read them.
create policy "Public can submit enquiries"
  on public.enquiries for insert to anon, authenticated with check (true);
create policy "Staff read enquiries"
  on public.enquiries for select to authenticated using (public.is_staff());
create policy "Staff delete enquiries"
  on public.enquiries for delete to authenticated using (public.is_staff());

-- Staff table: a signed-in user may only see their own row (used to check
-- "am I staff?"). Nobody can edit it through the website.
create policy "Users see own staff row"
  on public.staff for select to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------
-- 5. Sample data (placeholder names, edit or delete freely)
-- ---------------------------------------------------------------
-- 5a. Farms
insert into public.farms (name, county, farmer, is_own_farm) values
  ('Auxesis Karatina Farm',    'Nyeri',    'Auxesis',        true),
  ('Sample Grower A',          'Kirinyaga','Sample farmer A', false),
  ('Sample Grower B',          'Nakuru',   'Sample farmer B', false),
  ('Sample Grower C',          'Kajiado',  'Sample farmer C', false);

-- 5b. Batches (run after 5a)
insert into public.production_batches
  (farm_id, batch_code, crop, variety, stage, planted_on, expected_harvest,
   harvested_on, market_ready_on, quantity_kg, grade, notes)
select f.id, b.batch_code, b.crop, b.variety, b.stage::public.batch_stage,
       current_date - b.planted_ago, current_date - b.planted_ago + b.cycle_days,
       case when b.harvested_ago is null then null else current_date - b.harvested_ago end,
       case when b.ready_ago     is null then null else current_date - b.ready_ago     end,
       b.qty, b.grade, b.notes
from public.farms f
join (values
  -- farm, code, crop, variety, stage, planted N days ago, cycle days, harvested N days ago, market-ready N days ago, kg, grade, note
  ('Auxesis Karatina Farm','AUX-KAR-001','English Cucumber','Ashley F1','ready_for_market',  95,  54, 39, 37, 1800,'A',  'Sleeved and crated, available at the Marikiti stall.'),
  ('Auxesis Karatina Farm','AUX-KAR-002','Red Capsicum',    'Admiral F1','growing',            40,  60, null,null, 900,'A',  'Under cover, colouring expected soon.'),
  ('Sample Grower A',      'AUX-SMA-001','Local Cucumber',  'Tokyo F1','grading_packing',      60,  52,  6,null,2400,'A/B','Sorting and crating at the collection point.'),
  ('Sample Grower A',      'AUX-SMA-002','Chillies',        'Bird Eye','harvesting',           95,  87, null,null, 350,'A',  'Hand-picking in progress, two pickings per week.'),
  ('Sample Grower C',      'AUX-SMC-001','Yellow Capsicum', 'Golden Sun','planted',            14,  71, null,null, 750,'A',  'Seedlings transplanted to greenhouse block 2.'),
  ('Sample Grower B',      'AUX-SMB-001','Butternuts',      'Waltham','ready_for_market',     115,  90, 23, 15,5200,'A',  'Cured and bagged in 20kg sacks, ready for bulk wholesale.'),
  ('Sample Grower B',      'AUX-SMB-002','Local Cucumber',  'Ashley','dispatched',             80,  55, 23, 21,1600,'B',  'Delivered to Marikiti traders last week.')
) as b(farm, batch_code, crop, variety, stage, planted_ago, cycle_days, harvested_ago, ready_ago, qty, grade, notes)
  on b.farm = f.name;

-- ---------------------------------------------------------------
-- 6. Make yourself staff (do this AFTER you have signed up once on the site)
-- Replace the email with the one you signed up with, then run just this part:
--
--   insert into public.staff (user_id, note)
--   select id, 'Owner' from auth.users where email = 'you@example.com';
-- ---------------------------------------------------------------
