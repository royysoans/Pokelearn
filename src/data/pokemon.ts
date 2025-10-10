import { Pokemon } from "@/types/game";

export const pokemonDB: Record<number, Pokemon> = {
  // Starters
  1: {id:1, name:"Bulbasaur", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif", desc:"The seed Pokémon that grows stronger with sunlight.", color: "#78C850"},
  2: {id:2, name:"Charmander", type:"Fire", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/charmander.gif", desc:"A fiery lizard whose tail flame shows its spirit.", color: "#F08030"},
  3: {id:3, name:"Squirtle", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/squirtle.gif", desc:"The tiny turtle that blasts water with big energy.", color: "#6890F0"},
  4: {id:4, name:"Pikachu", type:"Electric", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif", desc:"The electric mouse that powers hearts worldwide.", color: "#F8D030"},
  
  // KANTO (Gen 1)
  10: {id:10, name:"Pidgey", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pidgey.gif", desc:"The humble bird that starts every trainer's journey.", color: "#A8A878"},
  11: {id:11, name:"Rattata", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/rattata.gif", desc:"Small but scrappy, always nibbling on something.", color: "#A8A878"},
  12: {id:12, name:"Geodude", type:"Rock", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/geodude.gif", desc:"A floating rock with fists of fury.", color: "#B8A038"},
  13: {id:13, name:"Growlithe", type:"Fire", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/growlithe.gif", desc:"Loyal pup with a fiery heart.", color: "#F08030"},
  14: {id:14, name:"Machop", type:"Fighting", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/machop.gif", desc:"Training daily to become a muscle master.", color: "#C03028"},
  15: {id:15, name:"Poliwag", type:"Water", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/poliwag.gif", desc:"Cute tadpole that spins its tail nonstop.", color: "#6890F0"},
  16: {id:16, name:"Arcanine", type:"Fire", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/arcanine.gif", desc:"The majestic flame guardian of legends.", color: "#F08030"},
  17: {id:17, name:"Gengar", type:"Ghost", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gengar.gif", desc:"The mischievous ghost that loves a good scare.", color: "#705898"},
  18: {id:18, name:"Lapras", type:"Water", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/lapras.gif", desc:"The gentle sea ride of the Pokémon world.", color: "#6890F0"},
  19: {id:19, name:"Mewtwo", type:"Psychic", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/mewtwo.gif", desc:"A clone born of science, stronger than nature itself.", color: "#A040A0"},
  
  // JOHTO (Gen 2)
  20: {id:20, name:"Sentret", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/sentret.gif", desc:"The lookout that's always on high alert.", color: "#A8A878"},
  21: {id:21, name:"Hoothoot", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/hoothoot.gif", desc:"A one-footed owl that keeps perfect time.", color: "#A8A878"},
  22: {id:22, name:"Wooper", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/wooper.gif", desc:"Smiles through life with no arms, no worries.", color: "#6890F0"},
  23: {id:23, name:"Heracross", type:"Bug", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/heracross.gif", desc:"A beetle warrior with unstoppable strength.", color: "#A8B820"},
  24: {id:24, name:"Miltank", type:"Normal", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/miltank.gif", desc:"Produces milk, but can roll you over too.", color: "#A8A878"},
  25: {id:25, name:"Phanpy", type:"Ground", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/phanpy.gif", desc:"The cutest little elephant full of energy.", color: "#E0C068"},
  26: {id:26, name:"Tyranitar", type:"Rock", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/tyranitar.gif", desc:"A walking mountain that crushes landscapes.", color: "#B8A038"},
  27: {id:27, name:"Ampharos", type:"Electric", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/ampharos.gif", desc:"A shining beacon that lights up the night.", color: "#F8D030"},
  28: {id:28, name:"Scizor", type:"Bug", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/scizor.gif", desc:"Sharp, sleek, and faster than a flash.", color: "#A8B820"},
  29: {id:29, name:"Ho-Oh", type:"Fire", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/ho-oh.gif", desc:"The rainbow phoenix of eternal hope.", color: "#F08030"},
  
  // HOENN (Gen 3)
  30: {id:30, name:"Zigzagoon", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/zigzagoon.gif", desc:"Zigzags through life with endless curiosity.", color: "#A8A878"},
  31: {id:31, name:"Wingull", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/wingull.gif", desc:"Seaside messenger riding the ocean breeze.", color: "#6890F0"},
  32: {id:32, name:"Lotad", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/lotad.gif", desc:"The lily pad Pokémon that loves calm waters.", color: "#6890F0"},
  33: {id:33, name:"Numel", type:"Fire", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/numel.gif", desc:"A lazy camel storing lava instead of water.", color: "#F08030"},
  34: {id:34, name:"Swablu", type:"Normal", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/swablu.gif", desc:"A fluff cloud that loves staying spotless.", color: "#A8A878"},
  35: {id:35, name:"Spinda", type:"Normal", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/spinda.gif", desc:"No two spins are ever the same.", color: "#A8A878"},
  36: {id:36, name:"Salamence", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/salamence.gif", desc:"The dream of flight turned into dragon fury.", color: "#7038F8"},
  37: {id:37, name:"Gardevoir", type:"Psychic", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gardevoir.gif", desc:"A graceful protector with psychic elegance.", color: "#A040A0"},
  38: {id:38, name:"Metagross", type:"Steel", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/metagross.gif", desc:"A supercomputer of steel and strategy.", color: "#B8B8D0"},
  39: {id:39, name:"Rayquaza", type:"Dragon", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/rayquaza.gif", desc:"The sky serpent that keeps balance above all.", color: "#7038F8"},
  
  // SINNOH (Gen 4)
  40: {id:40, name:"Bidoof", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bidoof.gif", desc:"The meme legend with simple charm.", color: "#A8A878"},
  41: {id:41, name:"Starly", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/starly.gif", desc:"A brave little bird with big dreams.", color: "#A8A878"},
  42: {id:42, name:"Buizel", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/buizel.gif", desc:"Swims fast with twin tails spinning like propellers.", color: "#6890F0"},
  43: {id:43, name:"Roselia", type:"Grass", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/roselia.gif", desc:"Thorns and beauty in perfect balance.", color: "#78C850"},
  44: {id:44, name:"Riolu", type:"Fighting", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/riolu.gif", desc:"Trains hard to evolve through pure aura.", color: "#C03028"},
  45: {id:45, name:"Gabite", type:"Dragon", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gabite.gif", desc:"Treasure-hoarding dragon with sharp ambition.", color: "#7038F8"},
  46: {id:46, name:"Garchomp", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/garchomp.gif", desc:"The land shark that rules the skies.", color: "#7038F8"},
  47: {id:47, name:"Lucario", type:"Fighting", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/lucario.gif", desc:"Aura-sensing fighter with noble heart.", color: "#C03028"},
  48: {id:48, name:"Togekiss", type:"Fairy", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/togekiss.gif", desc:"The bringer of blessings and gentle peace.", color: "#EE99AC"},
  49: {id:49, name:"Giratina", type:"Ghost", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/giratina.gif", desc:"The ruler of distortion and shadowed worlds.", color: "#705898"},
  
  // UNOVA (Gen 5)
  50: {id:50, name:"Patrat", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/patrat.gif", desc:"Always on lookout duty with twitchy nerves.", color: "#A8A878"},
  51: {id:51, name:"Pidove", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pidove.gif", desc:"The city dove that never loses heart.", color: "#A8A878"},
  52: {id:52, name:"Blitzle", type:"Electric", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/blitzle.gif", desc:"Sparks fly wherever this zebra runs.", color: "#F8D030"},
  53: {id:53, name:"Sandile", type:"Ground", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/sandile.gif", desc:"Desert croc with a mischievous grin.", color: "#E0C068"},
  54: {id:54, name:"Gothita", type:"Psychic", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gothita.gif", desc:"A tiny psychic obsessed with style.", color: "#A040A0"},
  55: {id:55, name:"Axew", type:"Dragon", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/axew.gif", desc:"Sharp-tusked dragon-in-training.", color: "#7038F8"},
  56: {id:56, name:"Haxorus", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/haxorus.gif", desc:"Slices through steel with pure might.", color: "#7038F8"},
  57: {id:57, name:"Chandelure", type:"Ghost", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/chandelure.gif", desc:"A haunting light that burns souls bright.", color: "#705898"},
  58: {id:58, name:"Hydreigon", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/hydreigon.gif", desc:"Three heads, one unending rampage.", color: "#7038F8"},
  59: {id:59, name:"Reshiram", type:"Dragon", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/reshiram.gif", desc:"The dragon of truth and blazing ideals.", color: "#7038F8"},
  
  // KALOS (Gen 6)
  60: {id:60, name:"Fletchling", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/fletchling.gif", desc:"Chirpy and fast, the spark of every team.", color: "#A8A878"},
  61: {id:61, name:"Bunnelby", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bunnelby.gif", desc:"Digs its way to success with big ears.", color: "#A8A878"},
  62: {id:62, name:"Skiddo", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/skiddo.gif", desc:"A gentle goat that loves mountain air.", color: "#78C850"},
  63: {id:63, name:"Pancham", type:"Fighting", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pancham.gif", desc:"Fights with swagger and pure attitude.", color: "#C03028"},
  64: {id:64, name:"Espurr", type:"Psychic", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/espurr.gif", desc:"Looks cute but hides psychic power.", color: "#A040A0"},
  65: {id:65, name:"Inkay", type:"Dark", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/inkay.gif", desc:"A squid that flips the world upside down.", color: "#705848"},
  66: {id:66, name:"Greninja", type:"Water", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/greninja.gif", desc:"The silent shadow that strikes like water.", color: "#6890F0"},
  67: {id:67, name:"Goodra", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/goodra.gif", desc:"Gooey dragon with a heart of gold.", color: "#7038F8"},
  68: {id:68, name:"Aegislash", type:"Steel", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/aegislash-shield.gif", desc:"The royal blade that chooses its master.", color: "#B8B8D0"},
  69: {id:69, name:"Xerneas", type:"Fairy", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/xerneas.gif", desc:"The life-giver that glows with eternal grace.", color: "#EE99AC"},
  
  // ALOLA (Gen 7)
  70: {id:70, name:"Pikipek", type:"Normal", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/731.png", desc:"Pecking wood with rhythm and flair.", color: "#A8A878"},
  71: {id:71, name:"Yungoos", type:"Normal", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/734.png", desc:"Always hungry, never satisfied.", color: "#A8A878"},
  72: {id:72, name:"Wimpod", type:"Bug", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/767.png", desc:"Runs from everything—until it doesn't.", color: "#A8B820"},
  73: {id:73, name:"Rockruff", type:"Rock", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/744.png", desc:"Loyal pup that evolves with your bond.", color: "#B8A038"},
  74: {id:74, name:"Stufful", type:"Normal", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/759.png", desc:"Cute but dangerously strong hugger.", color: "#A8A878"},
  75: {id:75, name:"Fomantis", type:"Grass", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/753.png", desc:"Soaks in sunlight to sharpen its blades.", color: "#78C850"},
  76: {id:76, name:"Lycanroc", type:"Rock", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/745.png", desc:"Howls with pride under sun or moon.", color: "#B8A038"},
  77: {id:77, name:"Mimikyu", type:"Ghost", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/778.png", desc:"Hides behind a disguise to be loved.", color: "#705898"},
  78: {id:78, name:"Incineroar", type:"Fire", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/727.png", desc:"The wrestling cat that fights with fire.", color: "#F08030"},
  79: {id:79, name:"Solgaleo", type:"Psychic", rarity:"legendary", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/791.png", desc:"The radiant lion that channels the sun's power.", color: "#A040A0"},
  
  // GALAR (Gen 8)
  80: {id:80, name:"Skwovet", type:"Normal", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/819.png", desc:"Always stuffing its cheeks for later.", color: "#A8A878"},
  81: {id:81, name:"Rookidee", type:"Flying", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/821.png", desc:"Fearless bird that never backs down.", color: "#A890F0"},
  82: {id:82, name:"Nickit", type:"Dark", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/827.png", desc:"A sly fox with quick feet and clean getaways.", color: "#705848"},
  83: {id:83, name:"Dreepy", type:"Dragon", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/885.png", desc:"A ghostly missile waiting to grow up.", color: "#7038F8"},
  84: {id:84, name:"Toxel", type:"Electric", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/848.png", desc:"A baby rocker with shocking attitude.", color: "#F8D030"},
  85: {id:85, name:"Hattrem", type:"Psychic", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/857.png", desc:"Silences negativity with psychic calm.", color: "#A040A0"},
  86: {id:86, name:"Dragapult", type:"Dragon", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/887.png", desc:"Launches its young like ghostly darts.", color: "#7038F8"},
  87: {id:87, name:"Corviknight", type:"Flying", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/823.png", desc:"The armored raven that rules Galar skies.", color: "#A890F0"},
  88: {id:88, name:"Grimmsnarl", type:"Dark", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/861.png", desc:"Twisted fairy with power and menace.", color: "#705848"},
  89: {id:89, name:"Zacian", type:"Fairy", rarity:"legendary", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/888.png", desc:"The heroic sword that cuts through legends.", color: "#EE99AC"},
};

export const starters = [pokemonDB[1], pokemonDB[2], pokemonDB[3]];
