import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { User, Trophy, Star, Shield, MapPin, Sparkles } from "lucide-react";

interface TrainerCardProps {
    name?: string;
    bio?: string;
    avatarId?: string;
    cardBackground?: string;
    badges?: string[];
    pokemonCount?: number;
    regionName?: string;
    className?: string;
    pokemonImage?: string;
    id?: string;
}

export const TrainerCard = ({
    name,
    bio,
    avatarId,
    cardBackground,
    badges,
    pokemonCount,
    regionName,
    className,
    pokemonImage,
    id
}: TrainerCardProps = {}) => {
    const { gameState } = useGame();

    // Use props or fallback to gameState
    const displayName = name ?? gameState.name;
    const displayBio = bio ?? gameState.bio;
    const displayBackground = cardBackground ?? gameState.cardBackground;
    const displayBadges = badges ?? gameState.badges;
    const displayPokemonCount = pokemonCount ?? gameState.pokemon.length;
    const displayRegion = regionName ?? gameState.currentRegion?.name ?? "Unknown";

    // Define background styles based on selection
    const getBackgroundStyle = (bgId?: string) => {
        switch (bgId) {
            case 'fire': return "bg-gradient-to-br from-red-600 via-orange-600 to-amber-600";
            case 'water': return "bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-500";
            case 'grass': return "bg-gradient-to-br from-green-700 via-emerald-600 to-lime-600";
            case 'electric': return "bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-400";
            case 'psychic': return "bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-500";
            case 'dark': return "bg-gradient-to-br from-slate-900 via-gray-900 to-black";
            default: return "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500";
        }
    };

    return (
        <motion.div
            id={id}
            initial={{ scale: 0.95, opacity: 0, rotateY: 10 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`w-full max-w-[600px] mx-auto perspective-1000 group ${className}`}
        >
            <div className={`relative aspect-[1.8/1] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-white/20 select-none bg-white ${getBackgroundStyle(displayBackground)}`}>

                {/* HOLOGRAPHIC OVERLAY EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20 mix-blend-overlay animate-pulse" style={{ transform: 'rotate(45deg) scale(2)' }}></div>

                {/* NOISE & TEXTURE */}
                <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

                {/* GLASS CARD CONTENT */}
                <div className="relative h-full z-10 p-8 flex flex-row gap-8">

                    {/* LEFT COLUMN: AVATAR & ID */}
                    <div className="flex flex-col items-center justify-between w-[30%] border-r border-white/20 pr-6">
                        <div className="w-full flex justify-center pt-2">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white/10 shadow-inner flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                {pokemonImage ? (
                                    <img src={pokemonImage} alt="Partner" className="w-full h-full object-contain p-2 drop-shadow-xl" />
                                ) : (
                                    <User className="w-16 h-16 text-white opacity-90" />
                                )}
                                {/* Shine on Avatar */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="text-center w-full bg-black/20 rounded-lg py-2 mt-auto backdrop-blur-md">
                            <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-bold mb-1">Trainer ID</p>
                            <p className="text-sm font-mono text-white tracking-widest">{Date.now().toString().slice(-6)}</p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DETAILS */}
                    <div className="flex-1 flex flex-col h-full text-white min-w-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 mr-4">
                                <h2 className="text-4xl font-black tracking-tight uppercase leading-none truncate" title={displayName}>
                                    {displayName}
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-4 h-4 text-white/70" />
                                    <span className="text-sm font-medium uppercase tracking-wider text-white/80">{displayRegion}</span>
                                </div>
                            </div>
                            <Sparkles className="w-6 h-6 text-yellow-300 opacity-80 flex-shrink-0" />
                        </div>

                        {/* Bio Bubble - Expanded */}
                        <div className="flex-1 bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/10 my-4 flex items-start overflow-hidden relative">
                            <p className="text-sm italic text-white/95 leading-relaxed break-words w-full" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                "{displayBio}"
                            </p>
                        </div>

                        {/* STATS FOOTER */}
                        <div className="grid grid-cols-3 gap-3 mt-auto">
                            <div className="flex flex-col items-center bg-black/20 rounded-lg p-2 backdrop-blur-sm">
                                <span className="text-[10px] uppercase text-white/60 tracking-wider mb-1">Badges</span>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-amber-300" />
                                    <span className="text-lg font-bold">{displayBadges.length}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center bg-black/20 rounded-lg p-2 backdrop-blur-sm">
                                <span className="text-[10px] uppercase text-white/60 tracking-wider mb-1">Pokedex</span>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-cyan-300" />
                                    <span className="text-lg font-bold">{displayPokemonCount}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-white/20 rounded-lg p-2 cursor-help hover:bg-white/30 transition-colors">
                                <Star className="w-5 h-5 text-white fill-white shadow-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
