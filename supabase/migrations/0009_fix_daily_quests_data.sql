-- Enable RLS on daily_quests (good practice)
alter table public.daily_quests enable row level security;

-- Allow everyone to read daily_quests
drop policy if exists "Enable read access for all users" on public.daily_quests;
create policy "Enable read access for all users" on public.daily_quests for select using (true);

-- Re-insert quests to ensure they exist (Upsert)
insert into public.daily_quests (id, title, description, target_count, reward_xp) values
  ('daily_learner', 'Daily Learner', 'Answer 10 questions correctly', 10, 100),
  ('arena_challenger', 'Arena Challenger', 'Play 1 Multiplayer Battle', 1, 150),
  ('gym_climber', 'Gym Climber', 'Complete 1 Level in any Gym', 1, 200),
  ('victor', 'Victor', 'Win 1 Battle', 1, 200),
  ('brainiac', 'Brainiac', 'Get a streak of 5 correct answers', 5, 150),
  ('subject_master', 'Subject Master', 'Answer 5 questions correctly in the daily subject', 5, 100)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  target_count = excluded.target_count,
  reward_xp = excluded.reward_xp;
