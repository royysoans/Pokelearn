-- Add buddy_pokemon_id to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS buddy_pokemon_id INTEGER;

-- Add comment
COMMENT ON COLUMN user_progress.buddy_pokemon_id IS 'ID of the Pokemon selected as the user buddy';
