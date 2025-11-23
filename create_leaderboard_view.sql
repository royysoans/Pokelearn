DO $$
BEGIN
    -- Create a view to aggregate pokemon counts per user
    -- This avoids fetching thousands of rows to the client and hitting the 1000 row limit
    CREATE OR REPLACE VIEW leaderboard_view AS
    SELECT 
        p.id as user_id,
        p.name,
        COUNT(up.pokemon_id) as pokemon_count
    FROM profiles p
    LEFT JOIN user_pokemons up ON p.id = up.user_id
    GROUP BY p.id, p.name;

    -- Grant access to the view (since we disabled RLS on tables, view should be accessible, but good to be explicit)
    GRANT SELECT ON leaderboard_view TO anon, authenticated, service_role;
END $$;
