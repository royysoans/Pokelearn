import { Region } from "@/types/game";
import battleCourt from "@/assets/battle-court.jpg";
import battleCave from "@/assets/battle-cave.jpg";
import battleGrass from "@/assets/battle-grass.jpg";
import battleSnow from "@/assets/battle-snow.jpg";
import battleDesert from "@/assets/battle-desert.jpg";

export const regions: Region[] = [
  {
    name: "Kanto",
    symbol: "⚡",
    type: "Electric",
    pokemonIds: [4, 5, 6, 7, 24],
    gyms: ["Math", "Science", "Coding", "Champion"],
    background: battleCourt,
  },
  {
    name: "Johto",
    symbol: "🔥",
    type: "Fire",
    pokemonIds: [8, 9, 10, 25],
    gyms: ["Math", "Science", "Coding", "Champion"],
    background: battleDesert,
  },
  {
    name: "Hoenn",
    symbol: "💧",
    type: "Water",
    pokemonIds: [11, 12, 13],
    gyms: ["Math", "Science", "Coding", "Champion"],
    background: battleGrass,
  },
  {
    name: "Sinnoh",
    symbol: "🌿",
    type: "Grass",
    pokemonIds: [14, 15, 16],
    gyms: ["Math", "Science", "Coding", "Champion"],
    background: battleGrass,
  },
  {
    name: "Unova",
    symbol: "❄️",
    type: "Ice",
    pokemonIds: [17, 18, 19],
    gyms: ["Math", "Science", "Coding", "Champion"],
    background: battleSnow,
  },
  {
    name: "Kalos",
    symbol: "🌟",
    type: "Psychic",
    pokemonIds: [20, 21, 22, 23],
    gyms: ["Math", "Science", "Coding", "Champion"],
    background: battleCave,
  },
];
