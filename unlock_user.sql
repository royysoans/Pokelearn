DO $$
DECLARE
  target_user_id UUID := '7873403e-fce1-4d88-9db1-3b525688b242';
  region_names TEXT[] := ARRAY['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar'];
  subjects TEXT[] := ARRAY['math', 'science', 'coding'];
  r TEXT;
  s TEXT;
  i INTEGER;
  json_build JSONB := '{}'::JSONB;
  region_json JSONB;
BEGIN
  -- 0. CLEAN SLATE: Delete all badges for this user to remove duplicates/bad data
  DELETE FROM user_badges WHERE user_id = target_user_id;

  -- 1. Insert All Pokemon (1 to 316 based on pokemon.ts)
  FOR i IN 1..316 LOOP
    INSERT INTO user_pokemons (user_id, pokemon_id)
    VALUES (target_user_id, i)
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- 2. Insert Region Badges
  FOREACH r IN ARRAY region_names LOOP
    -- Arena Badges (e.g., kanto-math-arena)
    FOREACH s IN ARRAY subjects LOOP
      INSERT INTO user_badges (user_id, badge)
      VALUES (target_user_id, lower(r) || '-' || s || '-arena')
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Leader Badge (e.g., kanto-leader) - FIXED CASING
    INSERT INTO user_badges (user_id, badge)
    VALUES (target_user_id, lower(r) || '-leader')
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- 3. Insert Collection Badges
  FOR i IN 5..50 BY 5 LOOP
    INSERT INTO user_badges (user_id, badge) VALUES (target_user_id, 'common-' || i) ON CONFLICT DO NOTHING;
  END LOOP;
  FOR i IN 5..25 BY 5 LOOP
    INSERT INTO user_badges (user_id, badge) VALUES (target_user_id, 'uncommon-' || i) ON CONFLICT DO NOTHING;
  END LOOP;

  -- 4. Build Completed Levels JSON
  FOREACH r IN ARRAY region_names LOOP
    region_json := '{}'::JSONB;
    FOREACH s IN ARRAY subjects LOOP
      region_json := jsonb_set(region_json, ARRAY[s], '[1,2,3,4,5,6,7,8,9,10]'::JSONB);
    END LOOP;
    json_build := jsonb_set(json_build, ARRAY[r], region_json);
  END LOOP;

  -- 5. Update User Progress
  INSERT INTO user_progress (user_id, coins, completed_levels, current_page, updated_at)
  VALUES (target_user_id, 99999, json_build, 'home', NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    coins = 99999,
    completed_levels = json_build,
    updated_at = NOW();

END $$;
