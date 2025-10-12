import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";

export function LevelBar() {
  const { gameState } = useGame();
  const { level, xp, xpToNextLevel } = gameState;
  
  const progress = (xp / xpToNextLevel) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Progress
            value={progress}
            className="h-5 bg-black border-2 border-yellow-700"
            style={{
              '--progress-background': 'yellow',
            } as React.CSSProperties}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold min-w-[120px]">
          <span className="text-foreground/80">Level {level}</span>
          <span className="text-muted-foreground">({xp}/{xpToNextLevel})</span>
        </div>
      </div>
    </div>
  );
}
