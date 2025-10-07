import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";

interface GymSelectionProps {
  onStartBattle: (gym: string) => void;
}

export function GymSelection({ onStartBattle }: GymSelectionProps) {
  const { gameState, setCurrentPage } = useGame();
  const region = gameState.currentRegion;

  if (!region) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-2xl md:text-4xl mb-4 text-primary text-shadow-pixel">
          {region.symbol} {region.name} Gyms
        </h2>
        <p className="text-muted-foreground mb-8">Choose a gym to challenge!</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {region.gyms.map((gym) => (
            <PixelButton
              key={gym}
              variant={gym === "Champion" ? "secondary" : "success"}
              onClick={() => onStartBattle(gym)}
              className="text-base md:text-lg py-6"
            >
              {gym}
            </PixelButton>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <PixelButton variant="primary" onClick={() => setCurrentPage("pokedex")}>
            Pokédex ({gameState.pokemon.length})
          </PixelButton>
          <PixelButton onClick={() => setCurrentPage("regions")}>
            Back to Map
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
