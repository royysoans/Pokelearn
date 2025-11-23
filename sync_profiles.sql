DO $$
BEGIN
    -- 1. Fix RLS (Ensure everyone can see everyone)
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "User pokemons are viewable by everyone" ON user_pokemons;
    CREATE POLICY "User pokemons are viewable by everyone" ON user_pokemons FOR SELECT USING (true);
    
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_pokemons ENABLE ROW LEVEL SECURITY;

    -- 2. Sync Missing Profiles (Insert users who are in Auth but not in Profiles)
    INSERT INTO public.profiles (id, name, created_at)
    SELECT 
        id, 
        COALESCE(raw_user_meta_data->>'name', 'Trainer ' || substring(id::text from 1 for 4)), 
        created_at
    FROM auth.users
    WHERE id NOT IN (SELECT id FROM public.profiles);

END $$;
