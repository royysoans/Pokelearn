import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "@/components/PixelButton";
import { ShareButtons } from "@/components/ShareButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Shield, Crown, Lock, Star, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const regions = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar"];
const arenas = ["Maths", "Science", "Coding"];

// Generate all badges programmatically to ensure completeness
const allBadges = [
  // Gym Leader Badges
  ...regions.map(region => ({
    id: `${region.toLowerCase()}-leader`,
    name: `${region} Champion`,
    desc: `Defeated the ${region} Gym Leader`,
    type: 'gym',
    region: region
  })),

  // Arena Badges
  ...regions.flatMap(region =>
    arenas.map(arena => ({
      id: `${region.toLowerCase()}-${arena.toLowerCase()}-arena`,
      name: `${region} ${arena === 'Maths' ? 'Math Whiz' : arena === 'Science' ? 'Scientist' : 'Coder'}`,
      desc: `Cleared ${arena} Arena of ${region}`,
      type: 'arena',
      region: region
    }))
  ),

  // Pokémon Badges
  { id: 'common-5', name: 'Novice Collector', desc: 'Captured 5 Common Pokémon', type: 'collector' },
  { id: 'common-10', name: 'Rookie Collector', desc: 'Captured 10 Common Pokémon', type: 'collector' },
  { id: 'common-15', name: 'Amateur Collector', desc: 'Captured 15 Common Pokémon', type: 'collector' },
  { id: 'common-20', name: 'Dedicated Collector', desc: 'Captured 20 Common Pokémon', type: 'collector' },
  { id: 'common-25', name: 'Pro Collector', desc: 'Captured 25 Common Pokémon', type: 'collector' },
  { id: 'common-30', name: 'Expert Collector', desc: 'Captured 30 Common Pokémon', type: 'collector' },
  { id: 'common-35', name: 'Veteran Collector', desc: 'Captured 35 Common Pokémon', type: 'collector' },
  { id: 'common-40', name: 'Master Collector', desc: 'Captured 40 Common Pokémon', type: 'collector' },
  { id: 'common-45', name: 'Grandmaster Collector', desc: 'Captured 45 Common Pokémon', type: 'collector' },
  { id: 'common-50', name: 'Legendary Collector', desc: 'Captured 50 Common Pokémon', type: 'collector' },

  { id: 'uncommon-5', name: 'Rare Hunter I', desc: 'Captured 5 Uncommon Pokémon', type: 'collector' },
  { id: 'uncommon-10', name: 'Rare Hunter II', desc: 'Captured 10 Uncommon Pokémon', type: 'collector' },
  { id: 'uncommon-15', name: 'Rare Hunter III', desc: 'Captured 15 Uncommon Pokémon', type: 'collector' },
  { id: 'uncommon-20', name: 'Rare Hunter IV', desc: 'Captured 20 Uncommon Pokémon', type: 'collector' },
  { id: 'uncommon-25', name: 'Rare Hunter V', desc: 'Captured 25 Uncommon Pokémon', type: 'collector' },
];

export function Badges() {
  const { gameState, setCurrentPage } = useGame();

  const earnedCount = gameState.badges.length;
  const totalCount = allBadges.length;
  const progress = Math.min((earnedCount / totalCount) * 100, 100); // Cap at 100%

  const getBadgeIcon = (type: string, earned: boolean) => {
    if (!earned) return <Lock className="w-8 h-8 text-muted-foreground" />;
    switch (type) {
      case 'gym': return <Crown className="w-8 h-8 text-yellow-500" />;
      case 'arena': return <Medal className="w-8 h-8 text-blue-400" />;
      case 'collector': return <Trophy className="w-8 h-8 text-purple-400" />;
      default: return <Shield className="w-8 h-8 text-gray-400" />;
    }
  };

  const BadgeCard = ({ badge }: { badge: typeof allBadges[0] }) => {
    const earned = gameState.badges.includes(badge.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
        className={`relative group p-4 rounded-xl border-2 transition-all duration-300 ${earned
            ? "bg-card/60 backdrop-blur-md border-primary/30 hover:border-primary hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
            : "bg-muted/20 border-white/5 grayscale opacity-60"
          }`}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`p-4 rounded-full ${earned ? 'bg-primary/10' : 'bg-black/20'} relative`}>
            {getBadgeIcon(badge.type, earned)}
            {earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin-slow" />
              </motion.div>
            )}
          </div>

          <div>
            <h3 className={`font-bold text-sm mb-1 ${earned ? 'text-primary' : 'text-muted-foreground'}`}>
              {badge.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-tight">
              {badge.desc}
            </p>
          </div>

          {earned && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary border-primary/20">
              Earned
            </Badge>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[url('/grid-pattern.png')] bg-fixed">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-bold text-primary text-shadow-pixel mb-2"
            >
              Trophy Case
            </motion.h1>
            <p className="text-muted-foreground">
              Showcase your achievements and milestones
            </p>
          </div>

          <PixelButton onClick={() => setCurrentPage('gyms')} variant="secondary">
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Gyms
            </span>
          </PixelButton>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-white">{earnedCount}</span>
              <span className="text-muted-foreground text-sm ml-2">/ {totalCount} Badges Earned</span>
            </div>
            <span className="text-xl font-mono text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-black/40" />
        </motion.div>

        {/* Tabs & Grid */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8 bg-black/40 backdrop-blur-md border border-white/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="gym">Gyms</TabsTrigger>
            <TabsTrigger value="arena">Arenas</TabsTrigger>
            <TabsTrigger value="collector">Collector</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {['all', 'gym', 'arena', 'collector'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {allBadges
                    .filter(b => tab === 'all' || b.type === tab)
                    .sort((a, b) => {
                      const aEarned = gameState.badges.includes(a.id);
                      const bEarned = gameState.badges.includes(b.id);
                      return (aEarned === bEarned) ? 0 : aEarned ? -1 : 1;
                    })
                    .map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 w-full max-w-2xl mx-auto"
        >
          <ShareButtons
            message={`I've earned ${earnedCount} badges in PokéLearn! Can you beat my collection? 🏆`}
          />
        </motion.div>

      </div>
    </div>
  );
}
