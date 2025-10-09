import { useGame } from "@/contexts/GameContext";
import { starters } from "@/data/pokemon";
import { PixelButton } from "./PixelButton";

export function StarterSelection() {
  const { setCurrentPage, addPokemon } = useGame();

  const handleSelectStarter = (starter: typeof starters[0]) => {
    addPokemon(starter);
    setCurrentPage("regions");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl mb-8 text-primary text-shadow-pixel">
          Choose Your Starter Pokémon
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {starters.map((starter) => (
            <button
              key={starter.id}
              onClick={() => handleSelectStarter(starter)}
              className="group bg-card border-4 border-border p-6 rounded transition-all hover:scale-105 hover:border-primary"
            >
              <img
                src={starter.image}
                alt={starter.name}
                className="pixelated w-32 h-32 mx-auto mb-4 group-hover:animate-bounce-slow"
              />
              <h3 className="text-xl font-bold mb-2" style={{ color: starter.color }}>{starter.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{starter.desc}</p>
              <span className={`inline-block px-3 py-1 text-xs rounded ${
                starter.type === "Fire" ? "bg-orange-500" :
                starter.type === "Water" ? "bg-blue-500" :
                "bg-green-500"
              } text-white`}>
                {starter.type}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
