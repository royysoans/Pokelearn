export interface Pokemon {
  id: number;
  name: string;
  type: string;
  rarity: "common" | "uncommon" | "legendary";
  image: string;
  desc: string;
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
}

export interface GameState {
  name: string;
  coins: number;
  pokemon: Pokemon[];
  badges: string[];
  currentRegion: Region | null;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export type GamePage = 'home' | 'starter' | 'regions' | 'gyms' | 'battle' | 'pokedex';
