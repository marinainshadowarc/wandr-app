-- ============================================================
-- Wandr — Seed Data + RLS
-- All tables already exist. This script only adds RLS policies
-- and inserts seed data using the exact column names.
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Row Level Security ───────────────────────────────────────

alter table public.trips           enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.budget          enable row level security;
alter table public.packing_items   enable row level security;
alter table public.trip_members    enable row level security;
alter table public.profiles        enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'trips','itinerary_items','budget','packing_items','trip_members','profiles'
  ] loop
    execute format(
      'create policy "Auth users full access" on public.%I
       for all to authenticated using (true) with check (true);', tbl);
  end loop;
end $$;

-- ── Fix profile trigger ──────────────────────────────────────
-- The earlier trigger used wrong column names. This replaces it.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (auth_id, name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

-- ── Seed Data ────────────────────────────────────────────────

-- Trip
insert into public.trips (id, name, destination, start_date, end_date, cover_color)
values ('11111111-1111-1111-1111-111111111111', 'Tokyo & Kyoto', 'Japan', '2026-03-12', '2026-03-26', '#e8d5b7');

-- Itinerary items
-- Columns: trip_id, day_number, time, title, type, location, cost, currency,
--          is_booked, notes, flight_number, airline, departure_airport, arrival_airport, confirmation_number
insert into public.itinerary_items
  (trip_id, day_number, time, title, type, location, cost, currency, is_booked, notes, flight_number, airline, departure_airport, arrival_airport, confirmation_number)
values
('11111111-1111-1111-1111-111111111111', 1, '08:00', 'Flight to Tokyo',        'flight',   null,       820, 'USD', true,  'JL 047 — SFO → NRT',           'JL047', 'Japan Airlines', 'SFO', 'NRT', null         ),
('11111111-1111-1111-1111-111111111111', 1, '18:30', 'Check-in: Trunk Hotel',  'hotel',    'Shibuya',  210, 'USD', true,  '3 nights',                     null,    null,             null,  null,  'TRUNK-2026' ),
('11111111-1111-1111-1111-111111111111', 1, '20:00', 'Dinner at Ichiran Ramen','food',     'Shibuya',   18, 'USD', false, 'Solo-booth ramen experience',  null,    null,             null,  null,  null         ),
('11111111-1111-1111-1111-111111111111', 2, '09:00', 'TeamLab Planets',                'activity', 'Toyosu',   32, 'USD', true,  'Tickets pre-booked',         null, null, null, null, 'TLP-8821'),
('11111111-1111-1111-1111-111111111111', 2, '13:00', 'Lunch — Tsukiji Market',         'food',     'Tsukiji',  25, 'USD', false, 'Fresh sushi + tamagoyaki',   null, null, null, null, null      ),
('11111111-1111-1111-1111-111111111111', 2, '19:00', 'Shibuya Crossing & Rooftop Bar', 'activity', 'Shibuya',  15, 'USD', false, 'No reservation needed',      null, null, null, null, null      ),
('11111111-1111-1111-1111-111111111111', 3, '07:30', 'Meiji Shrine',               'activity', 'Harajuku',  0, 'USD', false, 'Free entry — arrive early',  null, null, null, null, null       ),
('11111111-1111-1111-1111-111111111111', 3, '12:00', 'Harajuku & Takeshita St',    'activity', 'Harajuku', 40, 'USD', false, 'Shopping budget',             null, null, null, null, null       ),
('11111111-1111-1111-1111-111111111111', 3, '19:30', 'Omakase at Sushi Yoshitake', 'food',     'Ginza',   250, 'USD', true,  '3-star Michelin — prepaid',  null, null, null, null, 'YOSHI-339');

-- Budget (flat rows — one per category)
-- Columns: trip_id, category, total_amount, spent_amount, currency, description, paid_by
insert into public.budget (trip_id, category, total_amount, spent_amount, currency, description, paid_by)
values
('11111111-1111-1111-1111-111111111111', 'Flights',    1800, 1640, 'USD', 'Round-trip flights SFO–NRT',     null),
('11111111-1111-1111-1111-111111111111', 'Hotels',     1500, 1260, 'USD', 'Trunk Hotel + Kyoto inn',        null),
('11111111-1111-1111-1111-111111111111', 'Food',        800,  680, 'USD', 'Restaurants and street food',    null),
('11111111-1111-1111-1111-111111111111', 'Activities',  600,  480, 'USD', 'Attractions and tours',          null),
('11111111-1111-1111-1111-111111111111', 'Transport',   200,  160, 'USD', 'IC card + taxis',                null),
('11111111-1111-1111-1111-111111111111', 'Shopping',   1100,  100, 'USD', 'Souvenirs and gifts',            null);

-- Packing items
-- Columns: trip_id, name, category, assigned_to (uuid — null for seed), is_packed, notes
insert into public.packing_items (trip_id, name, category, assigned_to, is_packed, notes)
values
('11111111-1111-1111-1111-111111111111', 'Passport',                         'Documents', null, true,  null),
('11111111-1111-1111-1111-111111111111', 'Travel insurance',                 'Documents', null, true,  null),
('11111111-1111-1111-1111-111111111111', 'Hotel confirmations',              'Documents', null, false, null),
('11111111-1111-1111-1111-111111111111', 'Japan Rail Pass',                  'Documents', null, false, null),
('11111111-1111-1111-1111-111111111111', 'Universal adapter (Japan Type A)', 'Tech',      null, true,  null),
('11111111-1111-1111-1111-111111111111', 'Portable charger',                 'Tech',      null, true,  null),
('11111111-1111-1111-1111-111111111111', 'Camera + spare battery',           'Tech',      null, false, null),
('11111111-1111-1111-1111-111111111111', 'Noise-cancelling headphones',      'Tech',      null, false, null),
('11111111-1111-1111-1111-111111111111', 'Light rain jacket',                'Clothing',  null, false, null),
('11111111-1111-1111-1111-111111111111', 'Comfortable walking shoes',        'Clothing',  null, false, null),
('11111111-1111-1111-1111-111111111111', 'Layers for cold temples',          'Clothing',  null, false, null),
('11111111-1111-1111-1111-111111111111', 'Medications (2-week supply)',      'Health',    null, true,  null),
('11111111-1111-1111-1111-111111111111', 'Blister plasters',                 'Health',    null, false, null),
('11111111-1111-1111-1111-111111111111', 'Sunscreen SPF50',                  'Health',    null, false, null);

-- trip_members: user_id references profiles.id — add yourself after signing up.
-- Example (replace with your real profile id):
-- insert into public.trip_members (trip_id, user_id, role)
-- values ('11111111-1111-1111-1111-111111111111', '<your-profile-id>', 'Owner');
