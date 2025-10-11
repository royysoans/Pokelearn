import { PixelButton } from "./PixelButton";
import { useGame } from "@/contexts/GameContext";

export function HomePage() {
  const { setCurrentPage } = useGame();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center animate-slide-in-up">
        <h1 className="text-2xl sm:text-4xl md:text-6xl mb-6 text-primary text-shadow-pixel animate-bounce-slow">
          PokéLearn
        </h1>
        <p className="mb-8 text-sm sm:text-base md:text-xl text-foreground/80 leading-relaxed max-w-sm sm:max-w-md mx-auto">
          Turn learning into an adventure!
        </p>
        <PixelButton
          variant="primary"
          className="text-lg sm:text-xl md:text-2xl animate-pulse-glow"
          onClick={() => setCurrentPage("starter")}
        >
          Start Journey
        </PixelButton>
      </div>
    </div>
  );
}
