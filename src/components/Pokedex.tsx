import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Trophy, Sparkles, Zap, Flame, Droplets, Leaf, Bug, Ghost, Skull, Mountain, Star, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pokemon } from "@/types/game";

// Helper to get type icon
const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "electric": return <Zap className="w-4 h-4" />;
    case "fire": return <Flame className="w-4 h-4" />;
    case "water": return <Droplets className="w-4 h-4" />;
    case "grass": return <Leaf className="w-4 h-4" />;
    case "bug": return <Bug className="w-4 h-4" />;
    case "ghost": return <Ghost className="w-4 h-4" />;
    case "poison": return <Skull className="w-4 h-4" />;
    case "ground": return <Mountain className="w-4 h-4" />;
    case "rock": return <Mountain className="w-4 h-4" />;
    default: return <Star className="w-4 h-4" />;
  }
};

// Helper for rarity colors
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary": return "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400";
    case "epic": return "bg-gradient-to-r from-orange-400 to-red-500 border-orange-400";
    case "uncommon": return "bg-gradient-to-r from-blue-400 to-cyan-500 border-blue-400";
    default: return "bg-gradient-to-r from-slate-400 to-slate-500 border-slate-400";
  }
};

import { useSound } from "@/hooks/use-sound";

export function Pokedex() {
  const { gameState, setCurrentPage, evolvePokemon, setBuddy, buddyPokemon } = useGame();
  const { playEvolutionStart, playEvolutionSuccess } = useSound();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);
  const [evolvedPokemon, setEvolvedPokemon] = useState<Pokemon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  // Get unique types and rarities for filters
  const types = useMemo(() => [...new Set(gameState.pokemon.map(p => p.type))].sort(), [gameState.pokemon]);
  const rarities = useMemo(() => ["common", "uncommon", "epic", "legendary"], []);

  // Filter logic
  const filteredPokemon = useMemo(() => {
    return gameState.pokemon.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType ? p.type === selectedType : true;
      const matchesRarity = selectedRarity ? p.rarity === selectedRarity : true;
      return matchesSearch && matchesType && matchesRarity;
    });
  }, [gameState.pokemon, searchQuery, selectedType, selectedRarity]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[url('/grid-pattern.png')] bg-fixed">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-bold text-primary text-shadow-pixel mb-2"
            >
              Pokédex
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start"
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-mono text-lg">{gameState.pokemon.length} Caught</span>
            </motion.p>
          </div>

          <div className="flex gap-2">
            <PixelButton onClick={() => setCurrentPage("gyms")} variant="secondary">
              Gyms
            </PixelButton>
            <PixelButton onClick={() => setCurrentPage("home")}>
              Home
            </PixelButton>
          </div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-4 mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
              {selectedType && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground gap-1 pl-2"
                  onClick={() => setSelectedType(null)}
                >
                  {selectedType} <X className="w-3 h-3" />
                </Badge>
              )}
              {selectedRarity && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground gap-1 pl-2"
                  onClick={() => setSelectedRarity(null)}
                >
                  {selectedRarity} <X className="w-3 h-3" />
                </Badge>
              )}

              <div className="h-6 w-px bg-border mx-2" />

              {/* Type Filter Dropdown/List could go here, for now simple badges */}
              {types.map(type => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pokemon Grid */}
        {filteredPokemon.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-muted-foreground"
            >
              <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No Pokémon found matching your criteria.</p>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPokemon.map((pokemon, index) => (
                <motion.div
                  key={pokemon.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 cursor-pointer overflow-hidden hover:border-primary/50 transition-colors"
                >
                  {/* Rarity Glow Background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${getRarityColor(pokemon.rarity)}`} />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-background/50 text-[10px] uppercase tracking-wider">
                        {pokemon.type}
                      </Badge>
                      <div className="flex gap-1">
                        {buddyPokemon?.id === pokemon.id && <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />}
                        {pokemon.rarity === "legendary" && <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />}
                      </div>
                    </div>

                    <div className="relative h-32 mb-4 group-hover:scale-110 transition-transform duration-300 ease-spring">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-full h-full object-contain pixelated drop-shadow-xl"
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-lg truncate" style={{ color: pokemon.color }}>
                        {pokemon.name}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize">{pokemon.rarity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Detailed View Modal */}
        <AnimatePresence>
          {selectedPokemon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPokemon(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-card border-2 border-primary/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent" />

                <button
                  onClick={() => setSelectedPokemon(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-48 h-48 mb-6 relative"
                  >
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <img
                      src={selectedPokemon.image}
                      alt={selectedPokemon.name}
                      className="w-full h-full object-contain pixelated relative z-10"
                    />
                  </motion.div>

                  <h2 className="text-3xl font-bold mb-2" style={{ color: selectedPokemon.color }}>
                    {selectedPokemon.name}
                  </h2>

                  <div className="flex gap-2 mb-6">
                    <Badge className="gap-1 pl-1 pr-3 py-1 text-sm">
                      <div className="p-1 bg-white/20 rounded-full">
                        {getTypeIcon(selectedPokemon.type)}
                      </div>
                      {selectedPokemon.type}
                    </Badge>
                    <Badge variant="outline" className={`capitalize ${getRarityColor(selectedPokemon.rarity)} bg-opacity-20 border-opacity-50`}>
                      {selectedPokemon.rarity}
                    </Badge>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 w-full mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Description</h4>
                    <p className="text-sm leading-relaxed">
                      {selectedPokemon.desc}
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <span className="text-xs text-muted-foreground block">ID</span>
                      <span className="font-mono text-lg">#{String(selectedPokemon.id).padStart(3, '0')}</span>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <span className="text-xs text-muted-foreground block">Caught At</span>
                      <span className="font-mono text-sm">Unknown</span>
                    </div>
                  </div>
                </div>

                {selectedPokemon.evolutionId && !isEvolving && !showEvolutionAnimation && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      setIsEvolving(true);
                      playEvolutionStart();
                      // Wait for animation start
                      await new Promise(resolve => setTimeout(resolve, 3000));

                      const evolved = await evolvePokemon(selectedPokemon.id);

                      if (evolved) {
                        setEvolvedPokemon(evolved);
                        setShowEvolutionAnimation(true);
                        playEvolutionSuccess();
                        // Celebration animation duration
                        await new Promise(resolve => setTimeout(resolve, 4000));
                        setSelectedPokemon(evolved);
                        setIsEvolving(false);
                        setShowEvolutionAnimation(false);
                        setEvolvedPokemon(null);
                      } else {
                        setIsEvolving(false);
                      }
                    }}
                    className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all relative z-10"
                  >
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Evolve Pokémon
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setBuddy(selectedPokemon.id);
                    // Optional: Show a toast or feedback
                  }}
                  className={`w-full mt-3 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all relative z-10 ${buddyPokemon?.id === selectedPokemon.id
                    ? "bg-red-100 text-red-600 border-2 border-red-500"
                    : "bg-white text-black border-2 border-gray-200 hover:border-red-400 hover:text-red-500"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${buddyPokemon?.id === selectedPokemon.id ? "fill-red-500" : ""}`} />
                  {buddyPokemon?.id === selectedPokemon.id ? "Your Buddy" : "Set as Buddy"}
                </motion.button>

                {isEvolving && !showEvolutionAnimation && (
                  <div className="mt-6 text-center relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-primary font-bold text-xl"
                    >
                      What? {selectedPokemon.name} is evolving!
                    </motion.div>
                  </div>
                )}

                {showEvolutionAnimation && evolvedPokemon && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-2xl overflow-hidden"
                  >
                    {/* Flash Effect */}
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-white z-30 pointer-events-none"
                    />

                    {/* Burst Particles */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0 }}
                        animate={{
                          x: (Math.random() - 0.5) * 400,
                          y: (Math.random() - 0.5) * 400,
                          scale: [0, 1, 0],
                          opacity: [1, 0]
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full z-10"
                      />
                    ))}

                    <motion.div
                      initial={{ scale: 0, rotate: 180, filter: "brightness(2)" }}
                      animate={{ scale: 1, rotate: 0, filter: "brightness(1)" }}
                      transition={{ type: "spring", damping: 12 }}
                      className="relative w-48 h-48 mb-4"
                    >
                      <div className="absolute inset-0 bg-yellow-500/40 blur-3xl rounded-full animate-pulse" />
                      <img
                        src={evolvedPokemon.image}
                        alt={evolvedPokemon.name}
                        className="w-full h-full object-contain pixelated relative z-10"
                      />
                    </motion.div>
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-3xl font-bold text-white mb-2 text-shadow-pixel"
                    >
                      Congratulations!
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-white/80 text-lg"
                    >
                      Your Pokémon evolved into <span className="text-yellow-400 font-bold">{evolvedPokemon.name}</span>!
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Screen Evolution Overlay */}
        <AnimatePresence>
          {(isEvolving || showEvolutionAnimation) && selectedPokemon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -1000],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear",
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: "100%",
                    }}
                  />
                ))}
              </div>

              {/* Evolution Sequence */}
              <div className="relative z-10 flex flex-col items-center">
                {!showEvolutionAnimation ? (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="relative w-64 h-64 mb-8"
                    >
                      {/* Energy Rings */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.5],
                            opacity: [0.5, 0],
                            borderWidth: ["4px", "0px"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.6,
                            ease: "easeOut",
                          }}
                          className="absolute inset-0 rounded-full border-white"
                        />
                      ))}

                      <img
                        src={selectedPokemon.image}
                        alt={selectedPokemon.name}
                        className="w-full h-full object-contain pixelated relative z-10"
                      />
                    </motion.div>
                    <motion.h2
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
                    >
                      What? <br />
                      <span style={{ color: selectedPokemon.color }}>{selectedPokemon.name}</span> is evolving!
                    </motion.h2>
                  </>
                ) : (
                  evolvedPokemon && (
                    <>
                      {/* Flash Effect */}
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        className="fixed inset-0 bg-white z-50 pointer-events-none"
                      />

                      {/* Burst Particles */}
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={`burst-${i}`}
                          initial={{ x: 0, y: 0, scale: 0 }}
                          animate={{
                            x: (Math.random() - 0.5) * 800,
                            y: (Math.random() - 0.5) * 800,
                            scale: [0, Math.random() + 0.5, 0],
                            opacity: [1, 0],
                            rotate: Math.random() * 360,
                          }}
                          transition={{ duration: 2.5, ease: "easeOut" }}
                          className="absolute w-4 h-4 bg-white rounded-full z-0"
                          style={{
                            backgroundColor: [selectedPokemon.color, evolvedPokemon.color, "#fff"][Math.floor(Math.random() * 3)]
                          }}
                        />
                      ))}

                      <motion.div
                        initial={{ scale: 0, rotate: 180, filter: "brightness(0)" }}
                        animate={{ scale: 1, rotate: 0, filter: "brightness(1)" }}
                        transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                        className="relative w-80 h-80 mb-8"
                      >
                        <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full animate-pulse" />
                        <img
                          src={evolvedPokemon.image}
                          alt={evolvedPokemon.name}
                          className="w-full h-full object-contain pixelated relative z-10 drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                      >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-pixel">
                          Congratulations!
                        </h2>
                        <p className="text-xl md:text-2xl text-white/80">
                          Your Pokémon evolved into <span style={{ color: evolvedPokemon.color }} className="font-bold">{evolvedPokemon.name}</span>!
                        </p>

                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2 }}
                          onClick={() => {
                            setSelectedPokemon(evolvedPokemon);
                            setIsEvolving(false);
                            setShowEvolutionAnimation(false);
                            setEvolvedPokemon(null);
                          }}
                          className="mt-12 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                        >
                          Continue
                        </motion.button>
                      </motion.div>
                    </>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
