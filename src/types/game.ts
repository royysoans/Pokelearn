export interface Pokemon {
  id: number;
  name: string;
  type: string;
  rarity: "common" | "uncommon" | "epic" | "legendary";
  image: string;
  desc: string;
  color: string;
  evolutionId?: number;
}

export interface Region {
  name: string;
  symbol: string;
  type: string;
  pokemonIds: number[];
  gyms: string[];
  background: string;
}

export interface Question {
  q: string;
  a: string[];
  c: string;
  e?: string;
}

export interface GameState {
  name: string;
  avatarId?: string;
  bio?: string;
  cardBackground?: string;
  pokemon: Pokemon[];
  badges: string[];
  currentRegion: Region | null;
  completedLevels: Record<string, Record<string, number[]>>; // regionName -> subject -> completed levels [1-10]
  currentPage: GamePage;
  buddyPokemonId: number | null;
}

export type GamePage = 'home' | 'login' | 'signup' | 'starter' | 'regions' | 'gyms' | 'battle' | 'pokedex' | 'badges' | 'leaderboard' | 'mastery' | 'ai-training' | 'ai-battle' | 'multiplayer';
