-- PIC Control Center - Supabase schema and RLS
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- DEVICES
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null default 'My Device',
  device_uid text unique not null,
  device_secret_hash text not null,
  status text not null default 'offline',
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

-- SETTINGS (1:1 with device)
create table if not exists public.device_settings (
  device_id uuid primary key references public.devices(id) on delete cascade,
  mode text not null default 'ECO',
  t_set numeric not null default 8,
  t_band numeric not null default 1,
  max_duty numeric not null default 0.8,
  min_batt_v numeric not null default 11.6,
  max_heater_w numeric not null default 60,
  updated_at timestamptz not null default now()
);

-- PAIRING CODES
create table if not exists public.device_pairing_codes (
  code text primary key,
  device_uid text not null references public.devices(device_uid) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- COMMANDS
create table if not exists public.device_commands (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references public.devices(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  command_type text not null,
  payload jsonb not null,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

-- TELEMETRY
create table if not exists public.device_telemetry (
  id bigserial primary key,
  device_id uuid references public.devices(id) on delete cascade,
  ts timestamptz not null default now(),
  t_internal numeric,
  t_external numeric,
  humidity numeric,
  v_batt numeric,
  i_heater numeric,
  duty numeric,
  state text,
  raw jsonb
);

create index if not exists device_telemetry_device_ts
  on public.device_telemetry (device_id, ts desc);

create index if not exists device_commands_payload_msgid
  on public.device_commands ((payload ->> 'msgId'));

-- Trigger: ensure profile exists after auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.device_settings enable row level security;
alter table public.device_pairing_codes enable row level security;
alter table public.device_commands enable row level security;
alter table public.device_telemetry enable row level security;

-- Policies: profiles
drop policy if exists "profiles are self" on public.profiles;
create policy "profiles are self"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert"
on public.profiles
for insert
with check (auth.uid() = id);

-- Policies: devices
drop policy if exists "devices: owner read" on public.devices;
create policy "devices: owner read"
on public.devices
for select
using (auth.uid() = owner_id);

drop policy if exists "devices: owner update" on public.devices;
create policy "devices: owner update"
on public.devices
for update
using (auth.uid() = owner_id);

drop policy if exists "devices: owner insert" on public.devices;
create policy "devices: owner insert"
on public.devices
for insert
with check (auth.uid() = owner_id);

-- Policies: settings
drop policy if exists "settings: owner read" on public.device_settings;
create policy "settings: owner read"
on public.device_settings
for select
using (
  exists (
    select 1 from public.devices d
    where d.id = device_settings.device_id and d.owner_id = auth.uid()
  )
);

drop policy if exists "settings: owner update" on public.device_settings;
create policy "settings: owner update"
on public.device_settings
for update
using (
  exists (
    select 1 from public.devices d
    where d.id = device_settings.device_id and d.owner_id = auth.uid()
  )
);

drop policy if exists "settings: owner insert" on public.device_settings;
create policy "settings: owner insert"
on public.device_settings
for insert
with check (
  exists (
    select 1 from public.devices d
    where d.id = device_settings.device_id and d.owner_id = auth.uid()
  )
);

-- Policies: commands
drop policy if exists "commands: owner read" on public.device_commands;
create policy "commands: owner read"
on public.device_commands
for select
using (auth.uid() = owner_id);

drop policy if exists "commands: owner insert" on public.device_commands;
create policy "commands: owner insert"
on public.device_commands
for insert
with check (auth.uid() = owner_id);

-- Policies: telemetry
drop policy if exists "telemetry: owner read" on public.device_telemetry;
create policy "telemetry: owner read"
on public.device_telemetry
for select
using (
  exists (
    select 1 from public.devices d
    where d.id = device_telemetry.device_id and d.owner_id = auth.uid()
  )
);

-- Pairing codes should be managed with service_role only.
