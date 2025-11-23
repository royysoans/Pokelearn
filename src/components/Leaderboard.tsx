import { useEffect, useState, useRef, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { motion, useAnimation } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Crown, ArrowLeft, Star, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LeaderboardEntry {
  name: string;
  pokemonCount: number;
  rank: number;
  userId: string;
  rankChange?: number; // positive = moved up, negative = moved down, 0 = no change
}

// Floating Orb Background Component
function FloatingOrb({ delay = 0, duration = 20, size = 100, index = 0 }: { delay?: number; duration?: number; size?: number; index?: number }) {

  // Calculate waypoints once and store them - use index for better distribution
  const waypoints = useMemo(() => {
    // Distribute orbs in a grid-like pattern to avoid clustering
    const gridX = (index % 4) * 25 + 10; // 4 columns: 10%, 35%, 60%, 85%
    const gridY = Math.floor(index / 4) * 40 + 10; // 2 rows: 10%, 50%

    // Add some randomness to the grid positions
    const startX = gridX + (Math.random() * 10 - 5);
    const startY = gridY + (Math.random() * 10 - 5);

    return {
      x: [
        `${startX}vw`,
        `${Math.random() * 60 + 20}vw`,
        `${Math.random() * 60 + 20}vw`,
        `${Math.random() * 60 + 20}vw`,
        `${startX}vw`
      ],
      y: [
        `${startY}vh`,
        `${Math.random() * 60 + 20}vh`,
        `${Math.random() * 60 + 20}vh`,
        `${Math.random() * 60 + 20}vh`,
        `${startY}vh`
      ],
      startX,
      startY
    };
  }, []);

  const color = useMemo(() => [
    'rgba(139, 92, 246, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(251, 146, 60, 0.8)'
  ][Math.floor(Math.random() * 4)], []);

  return (
    <motion.div
      initial={{
        x: waypoints.x[0],
        y: waypoints.y[0],
        opacity: 0.9
      }}
      animate={{
        x: waypoints.x,
        y: waypoints.y,
        opacity: [0.9, 0.9, 0.9, 0.9, 0.9]
      }}
      transition={{
        duration: duration * 1.5,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute pointer-events-none rounded-full blur-xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
      }}
    />
  );
}

export function Leaderboard() {
  const { gameState, setCurrentPage } = useGame();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const previousRanksRef = useRef<Map<string, number>>(new Map());

  const fetchData = async () => {
    try {
      // Query the leaderboard_view which does server-side aggregation
      // This avoids the 1000-row limit issue with user_pokemons
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("leaderboard_view")
        .select("user_id, name, pokemon_count");

      if (leaderboardError) throw leaderboardError;

      const sortedData = (leaderboardData || [])
        .map((entry: any) => ({
          name: entry.name || "Unknown Trainer",
          pokemonCount: entry.pokemon_count || 0,
          userId: entry.user_id,
          rank: 0,
          rankChange: 0
        }))
        .sort((a, b) => b.pokemonCount - a.pokemonCount)
        .map((entry, index) => {
          const newRank = index + 1;
          const oldRank = previousRanksRef.current.get(entry.userId);
          const rankChange = oldRank ? oldRank - newRank : 0;

          previousRanksRef.current.set(entry.userId, newRank);

          return { ...entry, rank: newRank, rankChange };
        });

      setLeaderboardData(sortedData);

      // Find current user rank
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const myEntry = sortedData.find(e => e.userId === user.id);
        if (myEntry) setCurrentUserRank(myEntry.rank);
      }

    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel('leaderboard_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_pokemons' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const maxPokemon = leaderboardData.length > 0 ? leaderboardData[0].pokemonCount : 1;
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  const getRankChangeIcon = (rankChange: number) => {
    if (rankChange > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (rankChange < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[url('/grid-pattern.png')] bg-fixed relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Gradient Orbs */}
        {[...Array(8)].map((_, i) => (
          <FloatingOrb
            key={`orb-${i}`}
            index={i}
            delay={i * 2}
            duration={20 + Math.random() * 10}
            size={100 + Math.random() * 150}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-bold text-primary text-shadow-pixel mb-2"
            >
              Leaderboard
            </motion.h1>
            <p className="text-muted-foreground">
              Top trainers from around the world
            </p>
          </div>

          <PixelButton onClick={() => setCurrentPage('regions')} variant="secondary">
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Map
            </span>
          </PixelButton>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Podium Display for Top 3 */}
            {top3.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <motion.h2
                  className="text-2xl font-bold text-center mb-6 text-white flex items-center justify-center gap-2"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(255,255,255,0.8)",
                      "0 0 10px rgba(255,255,255,0.5)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Top Champions
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </motion.h2>

                <div className="flex items-end justify-center gap-4 mb-8">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center flex-1 max-w-[180px]"
                    >
                      <div className="relative mb-3 group/silver">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center border-4 border-gray-400 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <Medal className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-sm border-2 border-white">
                          2
                        </div>
                        {/* Silver sparkles on hover */}
                        <motion.div
                          className="absolute -inset-4 opacity-0 group-hover/silver:opacity-100"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <Sparkles className="absolute top-0 left-0 w-4 h-4 text-gray-300 animate-pulse" />
                          <Sparkles className="absolute top-0 right-0 w-4 h-4 text-gray-300 animate-pulse" style={{ animationDelay: "0.2s" }} />
                          <Sparkles className="absolute bottom-0 left-0 w-4 h-4 text-gray-300 animate-pulse" style={{ animationDelay: "0.4s" }} />
                          <Sparkles className="absolute bottom-0 right-0 w-4 h-4 text-gray-300 animate-pulse" style={{ animationDelay: "0.6s" }} />
                        </motion.div>
                      </div>
                      <motion.div
                        className="w-full bg-gradient-to-t from-gray-400/30 to-gray-400/20 border-2 border-gray-400/50 rounded-t-xl p-4 text-center backdrop-blur-md"
                        style={{ height: '140px' }}
                        whileHover={{ scale: 1.05, borderColor: "rgba(156, 163, 175, 0.8)" }}
                      >
                        <p className="font-bold text-white mb-1 truncate">{top3[1].name}</p>
                        <p className="text-2xl font-bold text-gray-300 mb-2">{top3[1].pokemonCount}</p>
                        <p className="text-xs text-gray-400">Pokémon</p>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col items-center flex-1 max-w-[200px]"
                    >
                      <div className="relative mb-3 group/crown">
                        <motion.div
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center border-4 border-yellow-400 shadow-xl"
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(251, 191, 36, 0.5)",
                              "0 0 40px rgba(251, 191, 36, 0.8)",
                              "0 0 20px rgba(251, 191, 36, 0.5)",
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          whileHover={{ scale: 1.15, rotate: [0, -15, 15, 0] }}
                        >
                          <Crown className="w-10 h-10 text-white" />
                        </motion.div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-white text-lg border-2 border-white">
                          1
                        </div>
                        {/* Floating sparkles on hover */}
                        <motion.div
                          className="absolute -inset-4 opacity-0 group-hover/crown:opacity-100"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <Sparkles className="absolute top-0 left-0 w-4 h-4 text-yellow-300 animate-pulse" />
                          <Sparkles className="absolute top-0 right-0 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: "0.2s" }} />
                          <Sparkles className="absolute bottom-0 left-0 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: "0.4s" }} />
                          <Sparkles className="absolute bottom-0 right-0 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: "0.6s" }} />
                        </motion.div>
                      </div>
                      <motion.div
                        className="w-full bg-gradient-to-t from-yellow-500/30 to-yellow-500/20 border-2 border-yellow-500/60 rounded-t-xl p-4 text-center backdrop-blur-md"
                        style={{ height: '180px' }}
                        whileHover={{ scale: 1.05, borderColor: "rgba(234, 179, 8, 1)" }}
                      >
                        <p className="font-bold text-white mb-1 truncate">{top3[0].name}</p>
                        <p className="text-3xl font-bold text-yellow-400 mb-2">{top3[0].pokemonCount}</p>
                        <p className="text-xs text-yellow-200">Pokémon</p>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mt-2" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center flex-1 max-w-[180px]"
                    >
                      <div className="relative mb-3 group/bronze">
                        <motion.div
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border-4 border-amber-600 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <Medal className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-sm border-2 border-white">
                          3
                        </div>
                        {/* Bronze sparkles on hover */}
                        <motion.div
                          className="absolute -inset-4 opacity-0 group-hover/bronze:opacity-100"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <Sparkles className="absolute top-0 left-0 w-4 h-4 text-amber-400 animate-pulse" />
                          <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                          <Sparkles className="absolute bottom-0 left-0 w-4 h-4 text-amber-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
                          <Sparkles className="absolute bottom-0 right-0 w-4 h-4 text-amber-400 animate-pulse" style={{ animationDelay: "0.6s" }} />
                        </motion.div>
                      </div>
                      <motion.div
                        className="w-full bg-gradient-to-t from-amber-600/30 to-amber-600/20 border-2 border-amber-600/50 rounded-t-xl p-4 text-center backdrop-blur-md"
                        style={{ height: '120px' }}
                        whileHover={{ scale: 1.05, borderColor: "rgba(217, 119, 6, 0.8)" }}
                      >
                        <p className="font-bold text-white mb-1 truncate">{top3[2].name}</p>
                        <p className="text-2xl font-bold text-amber-400 mb-2">{top3[2].pokemonCount}</p>
                        <p className="text-xs text-amber-200">Pokémon</p>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Rest of Leaderboard */}
            {rest.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-muted-foreground mb-4">Other Trainers</h3>
                {rest.map((entry, index) => {
                  const isCurrentUser = currentUserRank === entry.rank;

                  return (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        x: 10,
                        boxShadow: isCurrentUser
                          ? "0 0 30px rgba(var(--primary-rgb), 0.5)"
                          : "0 0 20px rgba(255, 255, 255, 0.2)"
                      }}
                      className={`relative p-4 rounded-xl border ${isCurrentUser ? "border-primary bg-primary/20" : "border-white/20 bg-white/10"
                        } backdrop-blur-md shadow-lg transition-all duration-300 group`}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 text-center font-bold text-xl text-white flex justify-center">
                          #{entry.rank}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-lg ${isCurrentUser ? "text-primary" : "text-white"}`}>
                                {entry.name} {isCurrentUser && "(You)"}
                              </span>
                              {/* Rank Change Indicator */}
                              {entry.rankChange !== 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1"
                                >
                                  {getRankChangeIcon(entry.rankChange!)}
                                  <span className={`text-xs font-bold ${entry.rankChange! > 0 ? "text-green-400" : "text-red-400"
                                    }`}>
                                    {Math.abs(entry.rankChange!)}
                                  </span>
                                </motion.div>
                              )}
                            </div>
                            <span className="text-white/90 font-semibold">
                              {entry.pokemonCount} <span className="text-xs text-white/60">Caught</span>
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(entry.pokemonCount / maxPokemon) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                              className={`absolute top-0 left-0 h-full rounded-full ${isCurrentUser ? "bg-primary" : "bg-gradient-to-r from-blue-400 to-purple-400"}`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Share Section */}
            <div className="mt-12 text-center">
              <ShareButtons
                message={`I'm ranked #${currentUserRank || '?'} on the PokéLearn Leaderboard with ${gameState.pokemon.length} Pokémon! 🏆`}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
