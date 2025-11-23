DO $$
BEGIN
    -- Disable RLS on user_pokemons to allow full access
    -- This confirms if RLS policies were the issue
    ALTER TABLE user_pokemons DISABLE ROW LEVEL SECURITY;
    
    -- Also ensure profiles are visible
    ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
END $$;
