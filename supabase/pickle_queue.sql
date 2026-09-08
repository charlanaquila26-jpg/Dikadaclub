-- Dinkada Club: Pickle Queue winner tracking
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.pickle_queue_sessions (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Pickle Queue',
  venue_name text,
  status text not null default 'active' check (status in ('active','finished')),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.pickle_queue_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.pickle_queue_sessions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  joined_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table if not exists public.pickle_queue_matches (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.pickle_queue_sessions(id) on delete cascade,
  court_label text,
  winner_team text check (winner_team in ('A','B')),
  team_a_score integer,
  team_b_score integer,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.pickle_queue_match_players (
  match_id uuid not null references public.pickle_queue_matches(id) on delete cascade,
  player_id uuid not null references public.pickle_queue_players(id) on delete cascade,
  team text not null check (team in ('A','B')),
  slot smallint not null check (slot in (1,2)),
  primary key (match_id, player_id),
  unique (match_id, team, slot)
);

create index if not exists pqs_created_by_idx on public.pickle_queue_sessions(created_by);
create index if not exists pqp_session_idx on public.pickle_queue_players(session_id);
create index if not exists pqm_session_idx on public.pickle_queue_matches(session_id);
create index if not exists pqmp_player_idx on public.pickle_queue_match_players(player_id);

create or replace view public.pickle_queue_player_stats as
select
  p.session_id,
  p.id as player_id,
  p.display_name,
  count(mp.match_id) filter (where m.completed_at is not null)::int as games_played,
  count(mp.match_id) filter (where m.completed_at is not null and mp.team = m.winner_team)::int as wins,
  count(mp.match_id) filter (where m.completed_at is not null and mp.team <> m.winner_team)::int as losses
from public.pickle_queue_players p
left join public.pickle_queue_match_players mp on mp.player_id = p.id
left join public.pickle_queue_matches m on m.id = mp.match_id
group by p.session_id, p.id, p.display_name;

create or replace function public.complete_pickle_queue_match(
  p_match_id uuid,
  p_winner_team text
)
returns public.pickle_queue_matches
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_match public.pickle_queue_matches;
begin
  if p_winner_team not in ('A','B') then
    raise exception 'Winner must be team A or B';
  end if;

  update public.pickle_queue_matches
  set winner_team = p_winner_team,
      completed_at = now()
  where id = p_match_id
  returning * into v_match;

  if v_match.id is null then
    raise exception 'Match not found';
  end if;

  return v_match;
end;
$$;

alter table public.pickle_queue_sessions enable row level security;
alter table public.pickle_queue_players enable row level security;
alter table public.pickle_queue_matches enable row level security;
alter table public.pickle_queue_match_players enable row level security;

-- Everyone signed in can see queue sessions. Session creators manage their own sessions.
drop policy if exists "queue sessions readable by authenticated" on public.pickle_queue_sessions;
create policy "queue sessions readable by authenticated"
on public.pickle_queue_sessions for select
to authenticated
using (true);

drop policy if exists "queue sessions insert own" on public.pickle_queue_sessions;
create policy "queue sessions insert own"
on public.pickle_queue_sessions for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "queue sessions update own" on public.pickle_queue_sessions;
create policy "queue sessions update own"
on public.pickle_queue_sessions for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "queue players readable by authenticated" on public.pickle_queue_players;
create policy "queue players readable by authenticated"
on public.pickle_queue_players for select
to authenticated
using (true);

drop policy if exists "queue players managed by session owner" on public.pickle_queue_players;
create policy "queue players managed by session owner"
on public.pickle_queue_players for all
to authenticated
using (exists (
  select 1 from public.pickle_queue_sessions s
  where s.id = session_id and s.created_by = auth.uid()
))
with check (exists (
  select 1 from public.pickle_queue_sessions s
  where s.id = session_id and s.created_by = auth.uid()
));

drop policy if exists "queue matches readable by authenticated" on public.pickle_queue_matches;
create policy "queue matches readable by authenticated"
on public.pickle_queue_matches for select
to authenticated
using (true);

drop policy if exists "queue matches managed by session owner" on public.pickle_queue_matches;
create policy "queue matches managed by session owner"
on public.pickle_queue_matches for all
to authenticated
using (exists (
  select 1 from public.pickle_queue_sessions s
  where s.id = session_id and s.created_by = auth.uid()
))
with check (exists (
  select 1 from public.pickle_queue_sessions s
  where s.id = session_id and s.created_by = auth.uid()
));

drop policy if exists "match players readable by authenticated" on public.pickle_queue_match_players;
create policy "match players readable by authenticated"
on public.pickle_queue_match_players for select
to authenticated
using (true);

drop policy if exists "match players managed by session owner" on public.pickle_queue_match_players;
create policy "match players managed by session owner"
on public.pickle_queue_match_players for all
to authenticated
using (exists (
  select 1
  from public.pickle_queue_matches m
  join public.pickle_queue_sessions s on s.id = m.session_id
  where m.id = match_id and s.created_by = auth.uid()
))
with check (exists (
  select 1
  from public.pickle_queue_matches m
  join public.pickle_queue_sessions s on s.id = m.session_id
  where m.id = match_id and s.created_by = auth.uid()
));
