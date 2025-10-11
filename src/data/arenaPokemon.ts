// Fixed Pokemon assignments for each arena and difficulty by region
export const arenaPokemonMap: Record<string, Record<string, number>> = {
  // KANTO
  "Kanto": {
    "Maths Arena-1": 10,    // Pidgey
    "Maths Arena-2": 11,   // Rattata
    "Maths Arena-3": 12,    // Geodude
    "Maths Arena-4": 13,   // Growlithe
    "Maths Arena-5": 14, // Machop
    "Maths Arena-6": 15,  // Poliwag
    "Maths Arena-7": 16,     // Arcanine
    "Maths Arena-8": 17,   // Gengar
    "Maths Arena-9": 18,    // Lapras
    "Maths Arena-10": 19,         // Mewtwo
    "Science Arena-1": 20,    // Sentret
    "Science Arena-2": 21,   // Furret
    "Science Arena-3": 22,    // Hoothoot
    "Science Arena-4": 23,   // Noctowl
    "Science Arena-5": 24, // Ledyba
    "Science Arena-6": 25,  // Ledian
    "Science Arena-7": 26,     // Spinarak
    "Science Arena-8": 27,   // Ariados
    "Science Arena-9": 28,    // Crobat
    "Science Arena-10": 29,         // Chinchou
    "Coding Arena-1": 30,    // Zigzagoon
    "Coding Arena-2": 31,   // Linoone
    "Coding Arena-3": 32,    // Wurmple
    "Coding Arena-4": 33,   // Silcoon
    "Coding Arena-5": 34, // Beautifly
    "Coding Arena-6": 35,  // Cascoon
    "Coding Arena-7": 36,     // Dustox
    "Coding Arena-8": 37,   // Lotad
    "Coding Arena-9": 38,    // Lombre
    "Coding Arena-10": 39,         // Ludicolo
    "Kanto-Leader": 40,         // Seedot
  },
  // JOHTO
  "Johto": {
    "Maths Arena-1": 41,     // Chikorita
    "Maths Arena-2": 42,   // Bayleef
    "Maths Arena-3": 43,    // Meganium
    "Maths Arena-4": 44,   // Cyndaquil
    "Maths Arena-5": 45, // Quilava
    "Maths Arena-6": 46,  // Typhlosion
    "Maths Arena-7": 47,     // Totodile
    "Maths Arena-8": 48,   // Croconaw
    "Maths Arena-9": 49,    // Feraligatr
    "Maths Arena-10": 50,         // Sentret
    "Science Arena-1": 51,     // Furret
    "Science Arena-2": 52,   // Hoothoot
    "Science Arena-3": 53,    // Noctowl
    "Science Arena-4": 54,   // Ledyba
    "Science Arena-5": 55, // Ledian
    "Science Arena-6": 56,  // Spinarak
    "Science Arena-7": 57,     // Ariados
    "Science Arena-8": 58,   // Crobat
    "Science Arena-9": 59,    // Chinchou
    "Science Arena-10": 60,         // Lanturn
    "Coding Arena-1": 61,     // Pichu
    "Coding Arena-2": 62,   // Cleffa
    "Coding Arena-3": 63,    // Igglybuff
    "Coding Arena-4": 64,   // Togepi
    "Coding Arena-5": 65, // Togetic
    "Coding Arena-6": 66,  // Natu
    "Coding Arena-7": 67,     // Xatu
    "Coding Arena-8": 68,   // Mareep
    "Coding Arena-9": 69,    // Flaaffy
    "Coding Arena-10": 70,         // Ampharos
    "Johto-Leader": 71,         // Bellossom
  },
  // HOENN
  "Hoenn": {
    "Maths Arena-1": 72,     // Treecko
    "Maths Arena-2": 73,   // Grovyle
    "Maths Arena-3": 74,    // Sceptile
    "Maths Arena-4": 75,   // Torchic
    "Maths Arena-5": 76, // Combusken
    "Maths Arena-6": 77,  // Blaziken
    "Maths Arena-7": 78,     // Mudkip
    "Maths Arena-8": 79,   // Marshtomp
    "Maths Arena-9": 80,    // Swampert
    "Maths Arena-10": 81,         // Poochyena
    "Science Arena-1": 82,     // Mightyena
    "Science Arena-2": 83,   // Zigzagoon
    "Science Arena-3": 84,    // Linoone
    "Science Arena-4": 85,   // Wurmple
    "Science Arena-5": 86, // Silcoon
    "Science Arena-6": 87,  // Beautifly
    "Science Arena-7": 88,     // Cascoon
    "Science Arena-8": 89,   // Dustox
    "Science Arena-9": 90,    // Lotad
    "Science Arena-10": 91,         // Lombre
    "Coding Arena-1": 92,     // Ludicolo
    "Coding Arena-2": 93,   // Seedot
    "Coding Arena-3": 94,    // Nuzleaf
    "Coding Arena-4": 95,   // Shiftry
    "Coding Arena-5": 96, // Taillow
    "Coding Arena-6": 97,  // Swellow
    "Coding Arena-7": 98,     // Wingull
    "Coding Arena-8": 99,   // Pelipper
    "Coding Arena-9": 100,    // Ralts
    "Coding Arena-10": 101,         // Kirlia
    "Hoenn-Leader": 102,         // Gardevoir
  },
  // SINNOH
  "Sinnoh": {
    "Maths Arena-1": 103,     // Turtwig
    "Maths Arena-2": 104,   // Grotle
    "Maths Arena-3": 105,    // Torterra
    "Maths Arena-4": 106,   // Chimchar
    "Maths Arena-5": 107, // Monferno
    "Maths Arena-6": 108,  // Infernape
    "Maths Arena-7": 109,     // Piplup
    "Maths Arena-8": 110,   // Prinplup
    "Maths Arena-9": 111,    // Empoleon
    "Maths Arena-10": 112,        // Starly
    "Science Arena-1": 113,     // Staravia
    "Science Arena-2": 114,   // Staraptor
    "Science Arena-3": 115,    // Bidoof
    "Science Arena-4": 116,   // Bibarel
    "Science Arena-5": 117, // Kricketot
    "Science Arena-6": 118,  // Kricketune
    "Science Arena-7": 119,     // Shinx
    "Science Arena-8": 120,   // Luxio
    "Science Arena-9": 121,    // Luxray
    "Science Arena-10": 122,        // Budew
    "Coding Arena-1": 123,     // Roserade
    "Coding Arena-2": 124,   // Cranidos
    "Coding Arena-3": 125,    // Rampardos
    "Coding Arena-4": 126,   // Shieldon
    "Coding Arena-5": 127, // Bastiodon
    "Coding Arena-6": 128,  // Burmy
    "Coding Arena-7": 129,     // Wormadam
    "Coding Arena-8": 130,   // Mothim
    "Coding Arena-9": 131,    // Combee
    "Coding Arena-10": 132,        // Vespiquen
    "Sinnoh-Leader": 133,        // Pachirisu
  },
  // UNOVA
  "Unova": {
    "Maths Arena-1": 134,     // Patrat
    "Maths Arena-2": 135,     // Pidove
    "Maths Arena-3": 136,     // Lillipup
    "Maths Arena-4": 137,     // Roggenrola
    "Maths Arena-5": 138,     // Herdier
    "Maths Arena-6": 139,     // Tranquill
    "Maths Arena-7": 140,     // Boldore
    "Maths Arena-8": 141,     // Swoobat
    "Maths Arena-9": 142,     // Haxorus
    "Maths Arena-10": 143,    // Chandelure
    "Science Arena-1": 144,    // Woobat
    "Science Arena-2": 145,    // Tympole
    "Science Arena-3": 146,    // Sewaddle
    "Science Arena-4": 147,    // Venipede
    "Science Arena-5": 148,    // Whirlipede
    "Science Arena-6": 149,    // Zebstrika
    "Science Arena-7": 150,    // Scraggy
    "Science Arena-8": 151,    // Darumaka
    "Science Arena-9": 152,    // Volcarona
    "Science Arena-10": 153,   // Krookodile
    "Coding Arena-1": 154,     // Pansage
    "Coding Arena-2": 155,     // Pansear
    "Coding Arena-3": 156,     // Panpour
    "Coding Arena-4": 157,     // Blitzle
    "Coding Arena-5": 158,     // Minccino
    "Coding Arena-6": 159,     // Gothita
    "Coding Arena-7": 160,     // Solosis
    "Coding Arena-8": 161,     // Sandile
    "Coding Arena-9": 162,     // Conkeldurr
    "Coding Arena-10": 163,    // Zoroark
    "Unova-Leader": 164,       // Zekrom
  },
  // KALOS
  "Kalos": {
    "Maths Arena-1": 165,     // Shroomish
    "Maths Arena-2": 166,     // Cleffa
    "Maths Arena-3": 167,     // Baltoy
    "Maths Arena-4": 168,     // Clamperl
    "Maths Arena-5": 169,     // Lileep
    "Maths Arena-6": 170,     // Solrock
    "Maths Arena-7": 171,     // Solosis
    "Maths Arena-8": 172,     // Gothita
    "Maths Arena-9": 173,     // Milotic
    "Maths Arena-10": 174,    // Absol
    "Science Arena-1": 166,    // Cleffa
    "Science Arena-2": 167,    // Baltoy
    "Science Arena-3": 168,    // Clamperl
    "Science Arena-4": 169,    // Lileep
    "Science Arena-5": 170,    // Solrock
    "Science Arena-6": 171,    // Solosis
    "Science Arena-7": 172,    // Gothita
    "Science Arena-8": 173,    // Milotic
    "Science Arena-9": 174,    // Absol
    "Science Arena-10": 175,   // Regice
    "Coding Arena-1": 167,     // Baltoy
    "Coding Arena-2": 168,     // Clamperl
    "Coding Arena-3": 169,     // Lileep
    "Coding Arena-4": 170,     // Solrock
    "Coding Arena-5": 171,     // Solosis
    "Coding Arena-6": 172,     // Gothita
    "Coding Arena-7": 173,     // Milotic
    "Coding Arena-8": 174,     // Absol
    "Coding Arena-9": 175,     // Regice
    "Coding Arena-10": 165,    // Shroomish
    "Kalos-Leader": 175,       // Regice
  },
  // ALOLA
  "Alola": {
    "Maths Arena-1": 176,     // Poliwag
    "Maths Arena-2": 177,     // Ekans
    "Maths Arena-3": 178,     // Shellder
    "Maths Arena-4": 179,     // Seaking
    "Maths Arena-5": 180,     // Seadra
    "Maths Arena-6": 181,     // Mr-mime
    "Maths Arena-7": 182,     // Dragonite
    "Maths Arena-8": 183,     // Gyarados
    "Maths Arena-9": 184,     // Scyther
    "Maths Arena-10": 185,    // Articuno
    "Science Arena-1": 176,     // Poliwag
    "Science Arena-2": 177,     // Ekans
    "Science Arena-3": 178,     // Shellder
    "Science Arena-4": 179,     // Seaking
    "Science Arena-5": 180,     // Seadra
    "Science Arena-6": 181,     // Mr-mime
    "Science Arena-7": 182,     // Dragonite
    "Science Arena-8": 183,     // Gyarados
    "Science Arena-9": 184,     // Scyther
    "Science Arena-10": 185,    // Articuno
    "Coding Arena-1": 176,     // Poliwag
    "Coding Arena-2": 177,     // Ekans
    "Coding Arena-3": 178,     // Shellder
    "Coding Arena-4": 179,     // Seaking
    "Coding Arena-5": 180,     // Seadra
    "Coding Arena-6": 181,     // Mr-mime
    "Coding Arena-7": 182,     // Dragonite
    "Coding Arena-8": 183,     // Gyarados
    "Coding Arena-9": 184,     // Scyther
    "Coding Arena-10": 185,    // Articuno
    "Alola-Leader": 186,       // Articuno
  },
  // GALAR
  "Galar": {
    "Maths Arena-1": 187,     // Koffing
    "Maths Arena-2": 188,     // Rhyhorn
    "Maths Arena-3": 189,     // Drowzee
    "Maths Arena-4": 190,     // Pinsir
    "Maths Arena-5": 191,     // Marowak
    "Maths Arena-6": 192,     // Kabutops
    "Maths Arena-7": 193,     // Golem
    "Maths Arena-8": 194,     // Alakazam
    "Maths Arena-9": 195,     // Kingdra
    "Maths Arena-10": 196,    // Zapdos
    "Science Arena-1": 187,     // Koffing
    "Science Arena-2": 188,     // Rhyhorn
    "Science Arena-3": 189,     // Drowzee
    "Science Arena-4": 190,     // Pinsir
    "Science Arena-5": 191,     // Marowak
    "Science Arena-6": 192,     // Kabutops
    "Science Arena-7": 193,     // Golem
    "Science Arena-8": 194,     // Alakazam
    "Science Arena-9": 195,     // Kingdra
    "Science Arena-10": 196,    // Zapdos
    "Coding Arena-1": 187,     // Koffing
    "Coding Arena-2": 188,     // Rhyhorn
    "Coding Arena-3": 189,     // Drowzee
    "Coding Arena-4": 190,     // Pinsir
    "Coding Arena-5": 191,     // Marowak
    "Coding Arena-6": 192,     // Kabutops
    "Coding Arena-7": 193,     // Golem
    "Coding Arena-8": 194,     // Alakazam
    "Coding Arena-9": 195,     // Kingdra
    "Coding Arena-10": 196,    // Zapdos
    "Galar-Leader": 197,       // Zapdos
  },
};
