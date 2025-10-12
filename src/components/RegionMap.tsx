import { useGame } from "@/contexts/GameContext";
import { regions } from "@/data/regions";
import { PixelButton } from "./PixelButton";
import { LevelBar } from "./LevelBar";

export function RegionMap() {
  const { setCurrentPage, setCurrentRegion, hasDefeatedGymLeader } = useGame();

  const getRegionColor = (regionName: string) => {
    const colors: Record<string, string> = {
      Kanto: "fire",
      Johto: "ground",
      Hoenn: "electric",
      Sinnoh: "grass",
      Unova: "water",
      Kalos: "fairy",
      Alola: "ice",
      Galar: "dark",
    };
    return colors[regionName] || "normal";
  };

  const handleSelectRegion = (region: typeof regions[0], index: number) => {
    // Check if this is the first region or if previous gym leader was defeated
    if (index === 0 || hasDefeatedGymLeader(regions[index - 1].name)) {
      setCurrentRegion(region);
      setCurrentPage("gyms");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-6xl">
        <LevelBar />
        
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
                className={`relative border-4 rounded-lg overflow-hidden ${
                  isUnlocked ? `cursor-pointer hover:scale-105 border-${getRegionColor(region.name)}` : "cursor-not-allowed opacity-50 border-border"
                } transition-transform`}
                style={{
                  backgroundImage: isUnlocked 
                    ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${region.background})`
                    : `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${region.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: isUnlocked ? "none" : "blur(4px)",
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

        <div className="text-center">
          <PixelButton onClick={() => setCurrentPage("pokedex")}>
            View Pokédex
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
