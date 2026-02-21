-- Function: submit_battle_answer
-- Handles answer submission, race conditions, HP updates, and win conditions atomically.

create or replace function submit_battle_answer(
  p_battle_id uuid,
  p_player_id uuid,
  p_current_question_index int,
  p_is_correct boolean
) returns json as $$
declare
  v_battle record;
  v_opponent_id uuid;
  v_new_hp int;
  v_damage int := 1; -- Fixed damage, no type advantage
  v_result json;
begin
  -- 1. Lock the battle row to prevent race conditions
  select * into v_battle
  from battles
  where id = p_battle_id
  for update;

  if not found then
    return json_build_object('status', 'error', 'message', 'Battle not found');
  end if;

  -- 2. Check for "Too Slow" (Race Condition)
  -- If the question index in DB is higher than what the player submitted,
  -- it means someone else already answered this question (or the game moved on).
  if v_battle.current_question_index > p_current_question_index then
    return json_build_object('status', 'too_slow');
  end if;

  -- 3. Determine Opponent and Current HP
  if v_battle.player_1_id = p_player_id then
    v_opponent_id := v_battle.player_2_id;
  elsif v_battle.player_2_id = p_player_id then
    v_opponent_id := v_battle.player_1_id;
  else
    return json_build_object('status', 'error', 'message', 'Player not in battle');
  end if;

  -- 4. Handle Correct Answer
  if p_is_correct then
    -- Apply Damage to Opponent
    -- Check Win Condition
    if v_new_hp <= 0 then
       -- Atomic Update for Win
       if v_battle.player_1_id = p_player_id then
          update battles 
          set player_2_hp = v_new_hp,
              current_question_index = current_question_index + 1,
              wrong_answer_count = 0,
              winner_id = p_player_id
          where id = p_battle_id;
       else
          update battles 
          set player_1_hp = v_new_hp,
              current_question_index = current_question_index + 1,
              wrong_answer_count = 0,
              winner_id = p_player_id
          where id = p_battle_id;
       end if;

       -- Update Quests: Victor & Arena Challenger
       -- Note: We can't easily call another RPC from here if it uses auth.uid() and we are in security definer context
       -- But submit_battle_answer is security definer, so auth.uid() should be the caller (the player)
       
       -- Update 'victor' quest
       perform update_quest_progress('victor', 1);
       
       -- Update 'arena_challenger' quest (Win counts as playing)
       perform update_quest_progress('arena_challenger', 1);

       return json_build_object('status', 'game_over', 'winner_id', p_player_id);
    else
       -- Normal Update
       if v_battle.player_1_id = p_player_id then
          update battles 
          set player_2_hp = v_new_hp,
              current_question_index = current_question_index + 1,
              wrong_answer_count = 0
          where id = p_battle_id;
       else
          update battles 
          set player_1_hp = v_new_hp,
              current_question_index = current_question_index + 1,
              wrong_answer_count = 0
          where id = p_battle_id;
       end if;

       -- Update 'daily_learner' quest
       perform update_quest_progress('daily_learner', 1);

       return json_build_object('status', 'correct', 'damage', v_damage, 'new_hp', v_new_hp);
    end if;

  else
    -- 5. Handle Wrong Answer (Self Damage)
    if v_battle.player_1_id = p_player_id then
       v_new_hp := v_battle.player_1_hp - 1;
    else
       v_new_hp := v_battle.player_2_hp - 1;
    end if;

     -- Check Self-KO
    if v_new_hp <= 0 then
       -- Atomic Update for Self-KO
       if v_battle.player_1_id = p_player_id then
          update battles 
          set player_1_hp = v_new_hp,
              winner_id = v_opponent_id
          where id = p_battle_id;
       else
          update battles 
          set player_2_hp = v_new_hp,
              winner_id = v_opponent_id
          where id = p_battle_id;
       end if;
       
       -- Opponent won (v_opponent_id), but we can't update their quest progress easily here 
       -- because auth.uid() is the current player (loser).
       -- We'll just update 'arena_challenger' for the loser since they played.
       perform update_quest_progress('arena_challenger', 1);

       return json_build_object('status', 'game_over', 'winner_id', v_opponent_id);
    else
       -- Normal Self-Damage Update
       if v_battle.player_1_id = p_player_id then
          update battles set player_1_hp = v_new_hp where id = p_battle_id;
       else
          update battles set player_2_hp = v_new_hp where id = p_battle_id;
       end if;
       return json_build_object('status', 'wrong', 'self_damage', 1, 'new_hp', v_new_hp);
    end if;
  end if;

end;
$$ language plpgsql security definer;
