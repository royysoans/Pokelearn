import { useGame } from "@/contexts/GameContext";
import { regions } from "@/data/regions";
import { PixelButton } from "./PixelButton";

export function RegionMap() {
  const { setCurrentPage, setCurrentRegion } = useGame();

  const handleSelectRegion = (region: typeof regions[0]) => {
    setCurrentRegion(region);
    setCurrentPage("gyms");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-6xl text-center">
        <h2 className="text-2xl md:text-3xl mb-8 text-primary text-shadow-pixel">
          Select a Region to Explore
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {regions.map((region) => (
            <PixelButton
              key={region.name}
              variant="primary"
              onClick={() => handleSelectRegion(region)}
              className="text-base md:text-lg py-6 flex flex-col items-center gap-2"
            >
              <span className="text-3xl">{region.symbol}</span>
              <span>{region.name}</span>
              <span className="text-xs opacity-80">{region.type}</span>
            </PixelButton>
          ))}
        </div>

        <PixelButton onClick={() => setCurrentPage("starter")}>
          Back to Starter
        </PixelButton>
      </div>
    </div>
  );
}
