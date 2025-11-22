// POKEMON RECOVERY SCRIPT
// Run this in your browser's DevTools Console while logged into Pokelearn

console.clear();
console.log('='.repeat(60));
console.log('🔍 POKEMON RECOVERY HELPER');
console.log('='.repeat(60));

// Get user ID from localStorage
const keys = Object.keys(localStorage);
const supabaseKey = keys.find(key => key.includes('supabase.auth.token'));

if (!supabaseKey) {
    console.error('❌ No Supabase session found. Please log in first.');
} else {
    const authData = JSON.parse(localStorage.getItem(supabaseKey));
    const userId = authData?.user?.id;
    const email = authData?.user?.email;

    if (userId) {
        console.log('\n✅ USER FOUND!');
        console.log('═'.repeat(60));
        console.log('User ID:', userId);
        console.log('Email:', email);
        console.log('═'.repeat(60));

        // Generate SQL queries
        const sql = `
-- =====================================================
-- POKEMON RECOVERY SQL QUERIES
-- Run these in your Supabase SQL Editor
-- =====================================================

-- 1️⃣ CHECK CURRENT STATE
-- See what Pokemon you currently have
SELECT 
  pokemon_id,
  created_at
FROM user_pokemons 
WHERE user_id = '${userId}'
ORDER BY created_at DESC;

-- Count your current Pokemon
SELECT COUNT(DISTINCT pokemon_id) as current_pokemon_count
FROM user_pokemons 
WHERE user_id = '${userId}';

-- 2️⃣ CHECK YOUR PROGRESS
SELECT * FROM user_progress 
WHERE user_id = '${userId}';

-- 3️⃣ CHECK YOUR BADGES
SELECT * FROM user_badges 
WHERE user_id = '${userId}';

-- =====================================================
-- 🔄 RECOVERY OPTIONS (Choose ONE)
-- =====================================================

-- OPTION A: Restore specific Pokemon IDs
-- If you know which Pokemon you had, list them here
/*
DELETE FROM user_pokemons WHERE user_id = '${userId}';

INSERT INTO user_pokemons (user_id, pokemon_id)
VALUES 
  ('${userId}', 10),
  ('${userId}', 11),
  ('${userId}', 12);
  -- Add more Pokemon IDs as needed
*/

-- OPTION B: Restore a range of Pokemon (10-102)
-- WARNING: This assumes you had all Pokemon from ID 10 to 102
/*
DELETE FROM user_pokemons WHERE user_id = '${userId}';

INSERT INTO user_pokemons (user_id, pokemon_id)
SELECT '${userId}', generate_series(10, 102);
*/

-- OPTION C: Restore specific count (93 Pokemon from 10-102)
-- This will insert the first 93 Pokemon starting from ID 10
/*
DELETE FROM user_pokemons WHERE user_id = '${userId}';

INSERT INTO user_pokemons (user_id, pokemon_id)
SELECT '${userId}', generate_series(10, 102) LIMIT 93;
*/
`;

        console.log('\n📝 SQL QUERIES GENERATED');
        console.log('Copy the SQL below and paste it into Supabase SQL Editor:\n');
        console.log(sql);

        // Copy to clipboard if available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(sql).then(() => {
                console.log('\n✅ SQL copied to clipboard!');
                console.log('You can paste it directly into Supabase SQL Editor.');
            }).catch(() => {
                console.log('\n⚠️ Could not auto-copy. Please manually copy the SQL above.');
            });
        }

        // Show recovery steps
        console.log('\n📋 NEXT STEPS:');
        console.log('═'.repeat(60));
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Run the CHECK queries first to see current state');
        console.log('5. Check Database > Backups for Point-in-Time Recovery');
        console.log('6. If backups unavailable, use one of the RECOVERY OPTIONS');
        console.log('═'.repeat(60));

        // Prompt with user ID for easy copying
        prompt('Your User ID (press Ctrl+C to copy):', userId);

    } else {
        console.error('❌ Could not extract user ID from session.');
    }
}
