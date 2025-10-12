import { Region } from "@/types/game";
import kantoImg from "@/assets/region-kanto.png";
import johtoImg from "@/assets/region-johto.png";
import hoennImg from "@/assets/region-hoenn.png";
import sinnohImg from "@/assets/region-sinnoh.png";
import unovaImg from "@/assets/region-unova.png";
import kalosImg from "@/assets/region-kalos.png";
import alolaImg from "@/assets/region-alola.png";
import galarImg from "@/assets/region-galar.png";

export const regions: Region[] = [
  {
    name: "Kanto",
    symbol: "🟥",
    type: "Gen 1",
    pokemonIds: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], // Common, Uncommon, Epic, Legendary
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: kantoImg,
  },
  {
    name: "Johto",
    symbol: "🟧",
    type: "Gen 2",
    pokemonIds: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: johtoImg,
  },
  {
    name: "Hoenn",
    symbol: "🟨",
    type: "Gen 3",
    pokemonIds: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: hoennImg,
  },
  {
    name: "Sinnoh",
    symbol: "🟩",
    type: "Gen 4",
    pokemonIds: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: sinnohImg,
  },
  {
    name: "Unova",
    symbol: "🟦",
    type: "Gen 5",
    pokemonIds: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: unovaImg,
  },
  {
    name: "Kalos",
    symbol: "🟪",
    type: "Gen 6",
    pokemonIds: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: kalosImg,
  },
  {
    name: "Alola",
    symbol: "⬛",
    type: "Gen 7",
    pokemonIds: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: alolaImg,
  },
  {
    name: "Galar",
    symbol: "⬜",
    type: "Gen 8",
    pokemonIds: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
    gyms: ["Maths Arena", "Science Arena", "Coding Arena", "Gym Leader"],
    background: galarImg,
  },
];
