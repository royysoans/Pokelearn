import { PixelButton } from "./PixelButton";
import { useGame } from "@/contexts/GameContext";
import { UserPokemonChart } from "./UserPokemonChart";
import { ShareButtons } from "./ShareButtons";

export function Leaderboard() {
  const { gameState, setCurrentPage } = useGame();

  return (
    <div className="min-h-screen p-4" style={{ backgroundImage: 'url(/Lead.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-6xl mb-4 text-primary text-shadow-pixel animate-bounce-slow">
            Leaderboard
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-foreground/80 leading-relaxed max-w-md mx-auto mb-6">
            See how you stack up against other trainers!
          </p>
        </div>

        <UserPokemonChart />

        <div className="text-center mt-8 space-y-4">
          <ShareButtons
            message={`I caught ${gameState.pokemon.length} Pokémon! Think you can catch up?`}
          />
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
