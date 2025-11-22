import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";
import { ShareButtons } from "./ShareButtons";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Trophy, Sparkles, Zap, Flame, Droplets, Leaf, Bug, Ghost, Skull, Mountain, Star } from "lucide-react";
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

export function Pokedex() {
  const { gameState, setCurrentPage } = useGame();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
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
                  layoutId={`pokemon-${pokemon.id}`}
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
                      {pokemon.rarity === "legendary" && <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />}
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
                layoutId={`pokemon-${selectedPokemon.id}`}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
