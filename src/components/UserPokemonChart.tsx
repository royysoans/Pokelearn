import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserPokemonData {
  name: string;
  pokemonCount: number;
}

export function UserPokemonChart() {
  const [chartData, setChartData] = useState<UserPokemonData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // First, get all user pokemons
      const { data: pokemonData, error: pokemonError } = await supabase
        .from("user_pokemons")
        .select("user_id, pokemon_id");

      if (pokemonError) {
        console.error("Error fetching pokemon data:", pokemonError);
        return;
      }

      // Get all profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name");

      if (profileError) {
        console.error("Error fetching profile data:", profileError);
        return;
      }

      // Create a map of user_id to name
      const userMap: { [key: string]: string } = {};
      profileData.forEach((profile: any) => {
        userMap[profile.id] = profile.name;
      });

      // Count distinct pokemon per user
      const userCounts: { [key: string]: { name: string; pokemonIds: Set<number> } } = {};

      pokemonData.forEach((item: any) => {
        const userId = item.user_id;
        const name = userMap[userId] || "Unknown User";

        if (!userCounts[userId]) {
          userCounts[userId] = { name, pokemonIds: new Set() };
        }
        userCounts[userId].pokemonIds.add(item.pokemon_id);
      });

      // Convert to array with count of distinct pokemon
      const sortedData = Object.values(userCounts)
        .map(({ name, pokemonIds }) => ({ name, pokemonCount: pokemonIds.size }))
        .sort((a, b) => b.pokemonCount - a.pokemonCount);

      setChartData(sortedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription for user_pokemons table
    const subscription = supabase
      .channel('user_pokemons_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_pokemons' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchData(); // Refetch data on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-primary">User Progress</h3>
      {chartData.length > 0 ? (
        <div className="space-y-2">
          {chartData.map((user, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-foreground">{user.name}</span>
              <span className="text-primary font-bold">{user.pokemonCount} Pokémon</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No data available yet. Be the first to catch some Pokémon!</p>
        </div>
      )}
    </div>
  );
}
