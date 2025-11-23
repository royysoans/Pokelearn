DO $$
BEGIN
    -- ---------------------------------------------------------
    -- 1. PROFILES
    -- ---------------------------------------------------------
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Drop ALL existing policies to ensure a clean slate
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    
    -- Re-create Policies
    -- READ: Everyone can see everyone
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
    
    -- WRITE: Users can only manage their own profile
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);


    -- ---------------------------------------------------------
    -- 2. USER POKEMONS
    -- ---------------------------------------------------------
    ALTER TABLE user_pokemons ENABLE ROW LEVEL SECURITY;

    -- Drop ALL existing policies
    DROP POLICY IF EXISTS "User pokemons are viewable by everyone" ON user_pokemons;
    DROP POLICY IF EXISTS "Users can insert their own pokemon" ON user_pokemons;
    DROP POLICY IF EXISTS "Users can update own pokemon" ON user_pokemons;
    DROP POLICY IF EXISTS "Users can delete own pokemon" ON user_pokemons;
    DROP POLICY IF EXISTS "Enable read access for all users" ON user_pokemons;
    DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_pokemons;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_pokemons;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_pokemons;

    -- Re-create Policies
    -- READ: Everyone can see everyone (for Leaderboard)
    CREATE POLICY "User pokemons are viewable by everyone" ON user_pokemons FOR SELECT USING (true);

    -- WRITE: Users can only manage their own pokemon
    CREATE POLICY "Users can manage their own pokemon" ON user_pokemons FOR ALL USING (auth.uid() = user_id);

END $$;
