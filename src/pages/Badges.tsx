import { useGame } from "@/contexts/GameContext";

const allBadges = [
  // Gym Leader Badges
  { id: 'kanto-leader', name: 'Kanto Gym Leader', desc: 'Defeated the Kanto Gym Leader' },
  { id: 'johto-leader', name: 'Johto Gym Leader', desc: 'Defeated the Johto Gym Leader' },
  { id: 'hoenn-leader', name: 'Hoenn Gym Leader', desc: 'Defeated the Hoenn Gym Leader' },
  { id: 'sinnoh-leader', name: 'Sinnoh Gym Leader', desc: 'Defeated the Sinnoh Gym Leader' },
  { id: 'unova-leader', name: 'Unova Gym Leader', desc: 'Defeated the Unova Gym Leader' },
  { id: 'kalos-leader', name: 'Kalos Gym Leader', desc: 'Defeated the Kalos Gym Leader' },
  { id: 'alola-leader', name: 'Alola Gym Leader', desc: 'Defeated the Alola Gym Leader' },
  { id: 'galar-leader', name: 'Galar Gym Leader', desc: 'Defeated the Galar Gym Leader' },

  // Arena Badges
  { id: 'kanto-math-arena', name: 'Kanto Maths Arena', desc: 'Cleared Maths Arena of Kanto' },
  { id: 'kanto-science-arena', name: 'Kanto Science Arena', desc: 'Cleared Science Arena of Kanto' },
  { id: 'kanto-coding-arena', name: 'Kanto Coding Arena', desc: 'Cleared Coding Arena of Kanto' },
  { id: 'johto-math-arena', name: 'Johto Maths Arena', desc: 'Cleared Maths Arena of Johto' },
  { id: 'johto-science-arena', name: 'Johto Science Arena', desc: 'Cleared Science Arena of Johto' },
  { id: 'johto-coding-arena', name: 'Johto Coding Arena', desc: 'Cleared Coding Arena of Johto' },
  { id: 'hoenn-math-arena', name: 'Hoenn Maths Arena', desc: 'Cleared Maths Arena of Hoenn' },
  { id: 'hoenn-science-arena', name: 'Hoenn Science Arena', desc: 'Cleared Science Arena of Hoenn' },
  { id: 'hoenn-coding-arena', name: 'Hoenn Coding Arena', desc: 'Cleared Coding Arena of Hoenn' },
  { id: 'sinnoh-math-arena', name: 'Sinnoh Maths Arena', desc: 'Cleared Maths Arena of Sinnoh' },
  { id: 'sinnoh-science-arena', name: 'Sinnoh Science Arena', desc: 'Cleared Science Arena of Sinnoh' },
  { id: 'sinnoh-coding-arena', name: 'Sinnoh Coding Arena', desc: 'Cleared Coding Arena of Sinnoh' },
  { id: 'unova-math-arena', name: 'Unova Maths Arena', desc: 'Cleared Maths Arena of Unova' },
  { id: 'unova-science-arena', name: 'Unova Science Arena', desc: 'Cleared Science Arena of Unova' },
  { id: 'unova-coding-arena', name: 'Unova Coding Arena', desc: 'Cleared Coding Arena of Unova' },
  { id: 'kalos-math-arena', name: 'Kalos Maths Arena', desc: 'Cleared Maths Arena of Kalos' },
  { id: 'kalos-science-arena', name: 'Kalos Science Arena', desc: 'Cleared Science Arena of Kalos' },
  { id: 'kalos-coding-arena', name: 'Kalos Coding Arena', desc: 'Cleared Coding Arena of Kalos' },
  { id: 'alola-math-arena', name: 'Alola Maths Arena', desc: 'Cleared Maths Arena of Alola' },
  { id: 'alola-science-arena', name: 'Alola Science Arena', desc: 'Cleared Science Arena of Alola' },
  { id: 'alola-coding-arena', name: 'Alola Coding Arena', desc: 'Cleared Coding Arena of Alola' },
  { id: 'galar-math-arena', name: 'Galar Maths Arena', desc: 'Cleared Maths Arena of Galar' },
  { id: 'galar-science-arena', name: 'Galar Science Arena', desc: 'Cleared Science Arena of Galar' },
  { id: 'galar-coding-arena', name: 'Galar Coding Arena', desc: 'Cleared Coding Arena of Galar' },

  // Pokémon Badges
  { id: 'common-5', name: 'Common Collector I', desc: 'Captured 5 Common Pokémon' },
  { id: 'common-10', name: 'Common Collector II', desc: 'Captured 10 Common Pokémon' },
  { id: 'common-15', name: 'Common Collector III', desc: 'Captured 15 Common Pokémon' },
  { id: 'common-20', name: 'Common Collector IV', desc: 'Captured 20 Common Pokémon' },
  { id: 'common-25', name: 'Common Collector V', desc: 'Captured 25 Common Pokémon' },
  { id: 'common-30', name: 'Common Collector VI', desc: 'Captured 30 Common Pokémon' },
  { id: 'common-35', name: 'Common Collector VII', desc: 'Captured 35 Common Pokémon' },
  { id: 'common-40', name: 'Common Collector VIII', desc: 'Captured 40 Common Pokémon' },
  { id: 'common-45', name: 'Common Collector IX', desc: 'Captured 45 Common Pokémon' },
  { id: 'common-50', name: 'Common Collector X', desc: 'Captured 50 Common Pokémon' },
  { id: 'uncommon-5', name: 'Uncommon Collector I', desc: 'Captured 5 Uncommon Pokémon' },
  { id: 'uncommon-10', name: 'Uncommon Collector II', desc: 'Captured 10 Uncommon Pokémon' },
  { id: 'uncommon-15', name: 'Uncommon Collector III', desc: 'Captured 15 Uncommon Pokémon' },
  { id: 'uncommon-20', name: 'Uncommon Collector IV', desc: 'Captured 20 Uncommon Pokémon' },
  { id: 'uncommon-25', name: 'Uncommon Collector V', desc: 'Captured 25 Uncommon Pokémon' },
];

export function Badges() {
  const { gameState, setCurrentPage } = useGame();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl mb-8 text-primary text-shadow-pixel">
          🏆 Badges
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allBadges
            .sort((a, b) => {
              const aEarned = gameState.badges.includes(a.id);
              const bEarned = gameState.badges.includes(b.id);
              if (aEarned && !bEarned) return -1;
              if (!aEarned && bEarned) return 1;
              return 0;
            })
            .map((badge) => {
            const earned = gameState.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`border-4 rounded-lg p-4 text-center transition-transform hover:scale-105 ${
                  earned
                    ? 'border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg'
                    : 'border-gray-400 bg-gradient-to-br from-gray-200 to-gray-300 opacity-75'
                }`}
              >
                <div className="text-3xl mb-2 pixelated">{earned ? '🏆' : '🔒'}</div>
                <h3 className={`text-sm font-bold mb-1 ${earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {badge.name}
                </h3>
                <p className={`text-xs ${earned ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {badge.desc}
                </p>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setCurrentPage('gyms')}
          className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Back to Gyms
        </button>
      </div>
    </div>
  );
}
