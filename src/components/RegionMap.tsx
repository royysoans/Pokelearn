import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { regions } from "@/data/regions";
import { PixelButton } from "./PixelButton";


export function RegionMap() {
    const { setCurrentPage, setCurrentRegion, hasDefeatedGymLeader } = useGame();


    const getRegionColor = (regionName: string) => {
        // Uniform color for regions instead of individual border colors
        return "primary";
    };

    const handleSelectRegion = (region: typeof regions[0], index: number) => {
        // Check if this is the first region or if previous gym leader was defeated
        if (index === 0 || hasDefeatedGymLeader(regions[index - 1].name)) {
            setCurrentRegion(region);
            setCurrentPage("gyms");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundImage: `url(/bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="w-full max-w-6xl">
                <h2 className="text-xl sm:text-2xl md:text-4xl mb-8 text-center text-primary text-shadow-pixel">
                    🗺️ Journey Through the Regions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {regions.map((region, index) => {
                        const isUnlocked = index === 0 || hasDefeatedGymLeader(regions[index - 1].name);
                        const isCompleted = hasDefeatedGymLeader(region.name);

                        return (
                            <div
                                key={region.name}
                                onClick={() => handleSelectRegion(region, index)}
                                className={`relative rounded-lg overflow-hidden ${isUnlocked ? 'cursor-pointer hover:scale-105 shadow-lg shadow-primary/20 hover:shadow-primary/50' : 'cursor-not-allowed opacity-50'} transition-all`}
                                style={{
                                    backgroundImage: isUnlocked
                                        ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${region.background})`
                                        : `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${region.background})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    filter: "none",
                                    minHeight: "200px",
                                }}
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40">
                                    {isCompleted && (
                                        <div className="absolute top-2 right-2 text-2xl">✅</div>
                                    )}
                                    {!isUnlocked && (
                                        <div className="absolute top-2 left-2 text-2xl">🔒</div>
                                    )}
                                    <span className="text-3xl sm:text-4xl md:text-5xl mb-2">{region.symbol}</span>
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-white text-shadow-pixel">
                                        {region.name}
                                    </span>
                                    <span className="text-xs sm:text-sm text-white/80">{region.type}</span>
                                    {!isUnlocked && (
                                        <p className="text-xs text-white/60 mt-2 text-center break-words max-w-full">
                                            Defeat {regions[index - 1].name} Gym Leader
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center space-x-4 flex flex-wrap justify-center gap-y-4 mt-8">
                    <PixelButton onClick={() => setCurrentPage("mastery")} variant="success">
                        Learning Dashboard
                    </PixelButton>
                    <PixelButton onClick={() => setCurrentPage("ai-training" as any)} variant="primary">
                        AI Training Center
                    </PixelButton>

                    <PixelButton onClick={() => setCurrentPage("pokedex")}>
                        View Pokédex
                    </PixelButton>
                    <PixelButton onClick={() => setCurrentPage("leaderboard")}>
                        Leaderboard
                    </PixelButton>
                    <PixelButton onClick={() => setCurrentPage("multiplayer")} variant="fire">
                        Multiplayer Battle
                    </PixelButton>
                    <PixelButton onClick={() => setCurrentPage("home")} variant="secondary">
                        Home
                    </PixelButton>
                </div>
            </div>


        </div>
    );
}