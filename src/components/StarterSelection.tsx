import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { starters } from "@/data/pokemon";
import { pokemonDB } from "@/data/pokemon";
import { PixelButton } from "./PixelButton";

export function StarterSelection() {
  const { setCurrentPage, addPokemon } = useGame();
  const [showPikachu, setShowPikachu] = useState(false);

  const handleSelectStarter = (starter: typeof starters[0]) => {
    addPokemon(starter);
    setCurrentPage("regions");
  };

  if (showPikachu) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-6 text-primary text-shadow-pixel animate-pulse">
            A wild Pikachu appeared! ⚡
          </h2>

          <div className="bg-card border-4 border-border p-4 sm:p-8 rounded mb-6">
            <img
              src={pokemonDB[4].image}
              alt="Pikachu"
              className="pixelated w-32 sm:w-40 h-32 sm:h-40 mx-auto mb-4 animate-bounce-slow"
            />
            <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: pokemonDB[4].color }}>
              {pokemonDB[4].name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{pokemonDB[4].desc}</p>
            <span className="inline-block px-3 py-1 text-xs rounded bg-yellow-500 text-white">
              Electric
            </span>
          </div>

          <div className="flex gap-4 justify-center">
            <PixelButton
              variant="primary"
              onClick={() => handleSelectStarter(pokemonDB[4])}
            >
              Choose Pikachu
            </PixelButton>
            <PixelButton
              variant="secondary"
              onClick={() => setShowPikachu(false)}
            >
              Flee
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl mb-8 text-primary text-shadow-pixel">
          Choose Your Starter Pokémon
          <button
            onClick={() => setShowPikachu(true)}
            className="ml-2 sm:ml-3 text-2xl sm:text-3xl hover:scale-125 transition-transform inline-block"
            aria-label="Special surprise"
          >
            ⚡
          </button>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {starters.map((starter) => (
            <button
              key={starter.id}
              onClick={() => handleSelectStarter(starter)}
              className="group bg-card border-4 border-border p-4 sm:p-6 rounded transition-all hover:scale-105 hover:border-primary"
            >
              <img
                src={starter.image}
                alt={starter.name}
                className="pixelated w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-4 group-hover:animate-bounce-slow"
              />
              <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: starter.color }}>{starter.name}</h3>
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
