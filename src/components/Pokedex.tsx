import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";

export function Pokedex() {
  const { gameState, setCurrentPage } = useGame();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-4xl mb-4 text-center text-primary text-shadow-pixel">
          Pokédex
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {gameState.pokemon.length} Pokémon Caught
        </p>

        {gameState.pokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-6">
              No Pokémon caught yet! Start battling to catch them all!
            </p>
            <PixelButton onClick={() => setCurrentPage("regions")}>
              Go to Regions
            </PixelButton>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {gameState.pokemon.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="bg-card border-4 border-border rounded p-4 text-center hover:border-primary transition-colors"
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="pixelated w-24 h-24 mx-auto mb-3"
                  />
                  <h3 className="text-lg font-bold mb-1" style={{ color: pokemon.color }}>{pokemon.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{pokemon.desc}</p>
                  <div className="flex gap-2 justify-center text-xs">
                    <span className={`px-2 py-1 rounded ${
                      pokemon.type === "Fire" ? "bg-orange-500" :
                      pokemon.type === "Water" ? "bg-blue-500" :
                      pokemon.type === "Grass" ? "bg-green-500" :
                      pokemon.type === "Electric" ? "bg-yellow-500 text-gray-900" :
                      pokemon.type === "Ice" ? "bg-cyan-500" :
                      pokemon.type === "Psychic" ? "bg-purple-500" :
                      "bg-gray-500"
                    } text-white`}>
                      {pokemon.type}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      pokemon.rarity === "legendary" ? "bg-purple-600" :
                      pokemon.rarity === "uncommon" ? "bg-blue-600" :
                      "bg-gray-600"
                    } text-white`}>
                      {pokemon.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <PixelButton onClick={() => setCurrentPage("gyms")}>
                Back to Gyms
              </PixelButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
