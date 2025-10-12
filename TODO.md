# TODO: Fix Progress Saving Across Logout/Login

## Steps to Complete
- [x] Import pokemonDB and regions in GameContext.tsx
- [x] Enhance loadGameState: Map pokemon_ids to full Pokemon objects using pokemonDB, set currentRegion from regions
- [x] Complete saveGameState: Save pokemons (delete/insert), badges (delete/insert)
- [x] Add useRef for previous user to detect logout
- [x] Modify useEffect: Save on logout before reset, load on login
- [x] Add auto-save useEffect: Save debounced (2 seconds) on gameState changes when user logged in
- [x] Test: Login, make progress, logout, login again - verify persistence (fixed logout save with prevUser)

# TODO: Add Leaderboard Page

## Steps to Complete
- [x] Create Leaderboard.tsx component with bar chart using ui/chart.tsx
- [x] Query Supabase for user names and pokemon counts from profiles and user_pokemons tables
- [x] Add navigation button to Leaderboard from HomePage.tsx
- [x] Update Index.tsx to include leaderboard page routing
- [x] Style Leaderboard with pixel art theme consistent with app
- [x] Test leaderboard data accuracy and display
