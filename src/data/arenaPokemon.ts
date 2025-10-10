// Fixed Pokemon assignments for each arena and difficulty by region
export const arenaPokemonMap: Record<string, Record<string, number>> = {
  // KANTO
  "Kanto": {
    "Maths Arena-easy": 10,    // Pidgey
    "Science Arena-easy": 11,   // Rattata
    "Coding Arena-easy": 12,    // Geodude
    "Maths Arena-medium": 13,   // Growlithe
    "Science Arena-medium": 14, // Machop
    "Coding Arena-medium": 15,  // Poliwag
    "Maths Arena-hard": 16,     // Arcanine
    "Science Arena-hard": 17,   // Gengar
    "Coding Arena-hard": 18,    // Lapras
    "Kanto-Leader": 19,         // Mewtwo
  },
  // JOHTO
  "Johto": {
    "Maths Arena-easy": 20,     // Sentret
    "Science Arena-easy": 21,   // Hoothoot
    "Coding Arena-easy": 22,    // Wooper
    "Maths Arena-medium": 23,   // Heracross
    "Science Arena-medium": 24, // Miltank
    "Coding Arena-medium": 25,  // Phanpy
    "Maths Arena-hard": 26,     // Tyranitar
    "Science Arena-hard": 27,   // Ampharos
    "Coding Arena-hard": 28,    // Scizor
    "Johto-Leader": 29,         // Ho-Oh
  },
  // HOENN
  "Hoenn": {
    "Maths Arena-easy": 30,     // Zigzagoon
    "Science Arena-easy": 31,   // Wingull
    "Coding Arena-easy": 32,    // Lotad
    "Maths Arena-medium": 33,   // Numel
    "Science Arena-medium": 34, // Swablu
    "Coding Arena-medium": 35,  // Spinda
    "Maths Arena-hard": 36,     // Salamence
    "Science Arena-hard": 37,   // Gardevoir
    "Coding Arena-hard": 38,    // Metagross
    "Hoenn-Leader": 39,         // Rayquaza
  },
  // SINNOH
  "Sinnoh": {
    "Maths Arena-easy": 40,     // Bidoof
    "Science Arena-easy": 41,   // Starly
    "Coding Arena-easy": 42,    // Buizel
    "Maths Arena-medium": 43,   // Roselia
    "Science Arena-medium": 44, // Riolu
    "Coding Arena-medium": 45,  // Gabite
    "Maths Arena-hard": 46,     // Garchomp
    "Science Arena-hard": 47,   // Lucario
    "Coding Arena-hard": 48,    // Togekiss
    "Sinnoh-Leader": 49,        // Giratina
  },
  // UNOVA
  "Unova": {
    "Maths Arena-easy": 50,     // Patrat
    "Science Arena-easy": 51,   // Pidove
    "Coding Arena-easy": 52,    // Blitzle
    "Maths Arena-medium": 53,   // Sandile
    "Science Arena-medium": 54, // Gothita
    "Coding Arena-medium": 55,  // Axew
    "Maths Arena-hard": 56,     // Haxorus
    "Science Arena-hard": 57,   // Chandelure
    "Coding Arena-hard": 58,    // Hydreigon
    "Unova-Leader": 59,         // Reshiram
  },
  // KALOS
  "Kalos": {
    "Maths Arena-easy": 60,     // Fletchling
    "Science Arena-easy": 61,   // Bunnelby
    "Coding Arena-easy": 62,    // Skiddo
    "Maths Arena-medium": 63,   // Pancham
    "Science Arena-medium": 64, // Espurr
    "Coding Arena-medium": 65,  // Inkay
    "Maths Arena-hard": 66,     // Greninja
    "Science Arena-hard": 67,   // Goodra
    "Coding Arena-hard": 68,    // Aegislash
    "Kalos-Leader": 69,         // Xerneas
  },
  // ALOLA
  "Alola": {
    "Maths Arena-easy": 70,     // Pikipek
    "Science Arena-easy": 71,   // Yungoos
    "Coding Arena-easy": 72,    // Wimpod
    "Maths Arena-medium": 73,   // Rockruff
    "Science Arena-medium": 74, // Stufful
    "Coding Arena-medium": 75,  // Fomantis
    "Maths Arena-hard": 76,     // Lycanroc
    "Science Arena-hard": 77,   // Mimikyu
    "Coding Arena-hard": 78,    // Incineroar
    "Alola-Leader": 79,         // Solgaleo
  },
  // GALAR
  "Galar": {
    "Maths Arena-easy": 80,     // Skwovet
    "Science Arena-easy": 81,   // Rookidee
    "Coding Arena-easy": 82,    // Nickit
    "Maths Arena-medium": 83,   // Dreepy
    "Science Arena-medium": 84, // Toxel
    "Coding Arena-medium": 85,  // Hattrem
    "Maths Arena-hard": 86,     // Dragapult
    "Science Arena-hard": 87,   // Corviknight
    "Coding Arena-hard": 88,    // Grimmsnarl
    "Galar-Leader": 89,         // Zacian
  },
};
