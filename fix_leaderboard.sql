DO $$
BEGIN
    -- 1. Profiles: Allow everyone to read names (Essential for Leaderboard)
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

    -- 2. User Pokemons: Allow everyone to read (Essential for counting Pokemon)
    DROP POLICY IF EXISTS "User pokemons are viewable by everyone" ON user_pokemons;
    CREATE POLICY "User pokemons are viewable by everyone" ON user_pokemons FOR SELECT USING (true);

    -- 3. User Badges: Allow everyone to read (Good for future features)
    DROP POLICY IF EXISTS "User badges are viewable by everyone" ON user_badges;
    CREATE POLICY "User badges are viewable by everyone" ON user_badges FOR SELECT USING (true);
    
    -- 4. Enable RLS on tables if not already enabled (Safety check)
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_pokemons ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

END $$;
