import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PixelButton } from "./PixelButton";
import { useGame } from "@/contexts/GameContext";

interface LeaderboardData {
  name: string;
  pokemonCount: number;
}

const chartConfig = {
  pokemonCount: {
    label: "Pokémon Count",
    color: "hsl(var(--chart-1))",
  },
};

export function Leaderboard() {
  const { setCurrentPage } = useGame();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Query to get user names and their pokemon counts
        const { data, error } = await supabase
          .from("user_pokemons")
          .select(`
            user_id,
            profiles!inner(name)
          `);

        if (error) {
          console.error("Error fetching leaderboard:", error);
          return;
        }

        // Count pokemon per user
        const userCounts: { [key: string]: { name: string; count: number } } = {};

        data.forEach((item: any) => {
          const userId = item.user_id;
          const name = item.profiles.name;

          if (!userCounts[userId]) {
            userCounts[userId] = { name, count: 0 };
          }
          userCounts[userId].count += 1;
        });

        // Convert to array and sort by count descending
        const sortedData = Object.values(userCounts)
          .map(({ name, count }) => ({ name, pokemonCount: count }))
          .sort((a, b) => b.pokemonCount - a.pokemonCount);

        setLeaderboardData(sortedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl mb-4 text-primary text-shadow-pixel">Loading Leaderboard...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-6xl mb-4 text-primary text-shadow-pixel animate-bounce-slow">
            Leaderboard
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-foreground/80 leading-relaxed max-w-md mx-auto mb-6">
            See how you stack up against other trainers!
          </p>
        </div>

        {leaderboardData.length > 0 ? (
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart data={leaderboardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="pokemonCount"
                  fill="var(--color-pokemonCount)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-muted-foreground">No data available yet. Be the first to catch some Pokémon!</p>
          </div>
        )}

        <div className="text-center mt-8">
          <PixelButton
            variant="secondary"
            onClick={() => setCurrentPage("regions")}
          >
            Back to Regions
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
