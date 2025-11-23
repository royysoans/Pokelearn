create or replace function handle_wrong_answer(p_battle_id uuid, p_player_id uuid)
returns void
language plpgsql
as $$
declare
  v_wrong_count int;
  v_current_q int;
  v_p1 uuid;
  v_p2 uuid;
begin
  -- Get current state
  select wrong_answer_count, current_question_index, player_1_id, player_2_id
  into v_wrong_count, v_current_q, v_p1, v_p2
  from battles
  where id = p_battle_id;

  -- Decrement HP
  if p_player_id = v_p1 then
    update battles set player_1_hp = player_1_hp - 1 where id = p_battle_id;
  elsif p_player_id = v_p2 then
    update battles set player_2_hp = player_2_hp - 1 where id = p_battle_id;
  end if;

  -- Increment wrong count
  v_wrong_count := v_wrong_count + 1;

  if v_wrong_count >= 2 then
    -- Both wrong, move next
    update battles 
    set wrong_answer_count = 0,
        current_question_index = v_current_q + 1
    where id = p_battle_id;
  else
    -- Just update count
    update battles 
    set wrong_answer_count = v_wrong_count
    where id = p_battle_id;
  end if;
end;
$$;
