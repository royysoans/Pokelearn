-- Fix ambiguous column reference in get_daily_quests
create or replace function get_daily_quests()
returns table (
  quest_id text,
  title text,
  description text,
  target_count integer,
  progress integer,
  completed boolean,
  reward_xp integer
) language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid();
begin
  -- Initialize if not exists for today
  -- Use explicit aliases to avoid ambiguity with output parameter 'quest_id'
  insert into public.user_quest_progress (user_id, quest_id, date)
  select v_user_id, dq.id, current_date
  from public.daily_quests dq
  where not exists (
    select 1 from public.user_quest_progress uqp
    where uqp.user_id = v_user_id 
    and uqp.quest_id = dq.id 
    and uqp.date = current_date
  );

  return query
  select 
    dq.id,
    dq.title,
    dq.description,
    dq.target_count,
    coalesce(uqp.progress, 0),
    coalesce(uqp.completed, false),
    dq.reward_xp
  from public.daily_quests dq
  left join public.user_quest_progress uqp 
    on dq.id = uqp.quest_id 
    and uqp.user_id = v_user_id 
    and uqp.date = current_date;
end;
$$;
