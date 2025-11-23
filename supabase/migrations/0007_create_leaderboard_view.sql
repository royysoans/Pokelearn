-- Create a view to efficiently calculate leaderboard data
-- This avoids the 1000-row query limit issue by doing aggregation on the database side

CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    p.id as user_id,
    p.name,
    COUNT(DISTINCT up.pokemon_id) as pokemon_count
FROM profiles p
LEFT JOIN user_pokemons up ON p.id = up.user_id
GROUP BY p.id, p.name;

-- Grant access to all roles
GRANT SELECT ON leaderboard_view TO anon, authenticated, service_role;
