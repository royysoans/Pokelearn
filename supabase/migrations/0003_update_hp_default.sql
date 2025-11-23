-- Reset tables to apply new defaults cleanly
drop table if exists public.battles cascade;
drop table if exists public.lobbies cascade;

-- Create lobbies table
create table public.lobbies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  host_id uuid not null,
  status text default 'waiting'::text check (status in ('waiting', 'active', 'finished')),
  topic text,
  player_1_pokemon jsonb,
  player_2_pokemon jsonb,
  player_1_id uuid,
  player_2_id uuid
);

-- Create battles table with new default HP of 10
create table public.battles (
  id uuid default gen_random_uuid() primary key,
  lobby_id uuid references public.lobbies(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  current_turn uuid, -- Kept for compatibility but will be less used in race mode
  player_1_hp integer default 10, -- UPDATED: Default HP is now 10
  player_2_hp integer default 10, -- UPDATED: Default HP is now 10
  questions jsonb default '[]'::jsonb,
  current_question_index integer default 0,
  winner_id uuid,
  player_1_id uuid,
  player_2_id uuid
);

-- Enable Realtime
alter publication supabase_realtime add table public.lobbies;
alter publication supabase_realtime add table public.battles;

-- Policies
alter table public.lobbies enable row level security;
create policy "Enable read access for all users" on public.lobbies for select using (true);
create policy "Enable insert for all users" on public.lobbies for insert with check (true);
create policy "Enable update for all users" on public.lobbies for update using (true);

alter table public.battles enable row level security;
create policy "Enable read access for all users" on public.battles for select using (true);
create policy "Enable insert for all users" on public.battles for insert with check (true);
create policy "Enable update for all users" on public.battles for update using (true);
