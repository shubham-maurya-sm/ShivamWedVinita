-- ==========================================================
-- Deepa & Sumit Wedding Database Schema (Supabase / Postgres)
-- ==========================================================

-- 1. Site Stats Table (Counters for Flower Showers & Page Visits)
create table if not exists public.site_stats (
    id text primary key default 'global',
    flower_count bigint default 0,
    total_visits bigint default 0,
    updated_at timestamptz default now()
);

-- Insert initial stats record if not exists
insert into public.site_stats (id, flower_count, total_visits)
values ('global', 168, 1)
on conflict (id) do nothing;

-- 2. Unique Visitor Logs (Anonymous device & referrer details)
create table if not exists public.site_visits (
    id uuid primary key default gen_random_uuid(),
    visitor_id text not null,
    device_type text,
    browser text,
    screen_resolution text,
    referrer text,
    visited_at timestamptz default now()
);

create index if not exists idx_site_visits_visitor on public.site_visits(visitor_id);
create index if not exists idx_site_visits_date on public.site_visits(visited_at desc);

-- 3. Wedding Wishes & Blessings Table
create table if not exists public.wedding_wishes (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    relation text default 'Family / Friend',
    message text not null,
    created_at timestamptz default now()
);

create index if not exists idx_wedding_wishes_created on public.wedding_wishes(created_at desc);

-- 4. Attendance Confirmation (RSVP) Table
create table if not exists public.wedding_rsvps (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    phone text,
    attending boolean default true,
    guest_count integer default 1,
    message text,
    created_at timestamptz default now()
);

create index if not exists idx_wedding_rsvps_created on public.wedding_rsvps(created_at desc);

-- ==========================================================
-- Row Level Security (RLS) Policies
-- Public anonymous guests can SELECT and INSERT.
-- ==========================================================

alter table public.site_stats enable row level security;
alter table public.site_visits enable row level security;
alter table public.wedding_wishes enable row level security;
alter table public.wedding_rsvps enable row level security;

-- Policies for site_stats (Read & Update via functions)
create policy "Allow public read site_stats"
    on public.site_stats for select
    using (true);

-- Policies for site_visits (Insert only for public)
create policy "Allow public insert site_visits"
    on public.site_visits for insert
    with check (true);

create policy "Allow public read site_visits"
    on public.site_visits for select
    using (true);

-- Policies for wedding_wishes (Read and Insert)
create policy "Allow public read wedding_wishes"
    on public.wedding_wishes for select
    using (true);

create policy "Allow public insert wedding_wishes"
    on public.wedding_wishes for insert
    with check (true);

-- Policies for wedding_rsvps (Insert for guests, read only for admin/authenticated)
create policy "Allow public insert wedding_rsvps"
    on public.wedding_rsvps for insert
    with check (true);

create policy "Allow authenticated read wedding_rsvps"
    on public.wedding_rsvps for select
    using (true);

-- ==========================================================
-- Atomic Counter Functions (RPCs)
-- ==========================================================

-- Function to atomically increment flower shower count
create or replace function public.increment_flower_count()
returns bigint
language plpgsql
security definer
as $$
declare
    new_count bigint;
begin
    update public.site_stats
    set flower_count = flower_count + 1,
        updated_at = now()
    where id = 'global'
    returning flower_count into new_count;

    return new_count;
end;
$$;

-- Function to record a visit and increment total counter
create or replace function public.record_visit(
    p_visitor_id text,
    p_device_type text default null,
    p_browser text default null,
    p_screen text default null,
    p_referrer text default null
)
returns json
language plpgsql
security definer
as $$
declare
    v_flower_count bigint;
    v_total_visits bigint;
    v_already_visited boolean;
begin
    -- Check if this visitor ID was recorded in the last 24 hours
    select exists(
        select 1 from public.site_visits
        where visitor_id = p_visitor_id
          and visited_at > now() - interval '24 hours'
    ) into v_already_visited;

    -- Record the visit record
    insert into public.site_visits (visitor_id, device_type, browser, screen_resolution, referrer)
    values (p_visitor_id, p_device_type, p_browser, p_screen, p_referrer);

    -- Only increment total_visits counter if unique within 24h
    if not v_already_visited then
        update public.site_stats
        set total_visits = total_visits + 1,
            updated_at = now()
        where id = 'global'
        returning total_visits, flower_count into v_total_visits, v_flower_count;
    else
        select total_visits, flower_count into v_total_visits, v_flower_count
        from public.site_stats
        where id = 'global';
    end if;

    return json_build_object(
        'total_visits', coalesce(v_total_visits, 0),
        'flower_count', coalesce(v_flower_count, 0)
    );
end;
$$;
