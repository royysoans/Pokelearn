-- Add missing RLS policies for profiles (SELECT) and user_pokemons (SELECT, DELETE)

-- profiles: allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- user_pokemons: allow users to read their own pokemons
CREATE POLICY "Users can view own pokemons" ON public.user_pokemons
  FOR SELECT USING (auth.uid() = user_id);

-- user_pokemons: allow users to delete their own pokemons (needed for evolution)
CREATE POLICY "Users can delete own pokemons" ON public.user_pokemons
  FOR DELETE USING (auth.uid() = user_id);
