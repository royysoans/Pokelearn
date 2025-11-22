-- Check all Pokemon records for your user
-- Replace 'YOUR_USER_ID' with your actual user ID

-- 1. See all your current Pokemon
SELECT * FROM user_pokemons 
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC;

-- 2. Count distinct Pokemon IDs (should show 1 currently)
SELECT COUNT(DISTINCT pokemon_id) as distinct_pokemon_count
FROM user_pokemons 
WHERE user_id = 'YOUR_USER_ID';

-- 3. Get your user ID (if you don't know it)
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- 4. Check user_progress table
SELECT * FROM user_progress WHERE user_id = 'YOUR_USER_ID';
