-- Add customization columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_id TEXT DEFAULT 'trainer-1',
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Ready to become a Pokémon Master!',
ADD COLUMN IF NOT EXISTS card_background TEXT DEFAULT 'default';
