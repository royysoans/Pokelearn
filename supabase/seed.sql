-- Insert sample users and profiles
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'trainer1@example.com', '$2a$10$dummy.hash.for.demo', NOW(), NOW(), NOW(), '{"name": "Ash Ketchum"}'),
  ('550e8400-e29b-41d4-a716-446655440001', 'trainer2@example.com', '$2a$10$dummy.hash.for.demo', NOW(), NOW(), NOW(), '{"name": "Misty Waterflower"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'trainer3@example.com', '$2a$10$dummy.hash.for.demo', NOW(), NOW(), NOW(), '{"name": "Brock Slate"}');

-- Insert sample user_pokemons (distinct Pokemon for each user)
INSERT INTO public.user_pokemons (user_id, pokemon_id, created_at)
VALUES
  -- Ash has 5 distinct Pokemon
  ('550e8400-e29b-41d4-a716-446655440000', 1, NOW()), -- Bulbasaur
  ('550e8400-e29b-41d4-a716-446655440000', 4, NOW()), -- Charmander
  ('550e8400-e29b-41d4-a716-446655440000', 7, NOW()), -- Squirtle
  ('550e8400-e29b-41d4-a716-446655440000', 25, NOW()), -- Pikachu
  ('550e8400-e29b-41d4-a716-446655440000', 39, NOW()), -- Jigglypuff

  -- Misty has 3 distinct Pokemon
  ('550e8400-e29b-41d4-a716-446655440001', 7, NOW()), -- Squirtle
  ('550e8400-e29b-41d4-a716-446655440001', 54, NOW()), -- Psyduck
  ('550e8400-e29b-41d4-a716-446655440001', 60, NOW()), -- Poliwag

  -- Brock has 2 distinct Pokemon
  ('550e8400-e29b-41d4-a716-446655440002', 74, NOW()), -- Geodude
  ('550e8400-e29b-41d4-a716-446655440002', 95, NOW()); -- Onix

-- Insert sample user_progress
INSERT INTO public.user_progress (user_id, current_region, level, xp, xp_to_next_level, completed_levels, coins, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'kanto', 5, 150, 200, '{}', 100, NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'kanto', 3, 80, 100, '{}', 75, NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'kanto', 2, 45, 50, '{}', 50, NOW());
