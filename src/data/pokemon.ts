import { Pokemon } from "@/types/game";

export const pokemonDB: Record<number, Pokemon> = {
  // Starters
  1: {id:1, name:"Bulbasaur", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif", desc:"Seed on its back.", color: "#78C850"},
  2: {id:2, name:"Charmander", type:"Fire", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/charmander.gif", desc:"Fire on its tail.", color: "#F08030"},
  3: {id:3, name:"Squirtle", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/squirtle.gif", desc:"Shoots water.", color: "#6890F0"},
  
  // KANTO (Gen 1)
  10: {id:10, name:"Pidgey", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pidgey.gif", desc:"A common bird Pokémon.", color: "#A8A878"},
  11: {id:11, name:"Rattata", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/rattata.gif", desc:"Bites anything when it attacks.", color: "#A8A878"},
  12: {id:12, name:"Geodude", type:"Rock", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/geodude.gif", desc:"Found in fields and mountains.", color: "#B8A038"},
  13: {id:13, name:"Growlithe", type:"Fire", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/growlithe.gif", desc:"Very protective of its territory.", color: "#F08030"},
  14: {id:14, name:"Machop", type:"Fighting", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/machop.gif", desc:"Loves to build its muscles.", color: "#C03028"},
  15: {id:15, name:"Poliwag", type:"Water", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/poliwag.gif", desc:"The swirl on its belly is its organs.", color: "#6890F0"},
  16: {id:16, name:"Arcanine", type:"Fire", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/arcanine.gif", desc:"A legendary Chinese Pokémon.", color: "#F08030"},
  17: {id:17, name:"Gengar", type:"Ghost", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gengar.gif", desc:"Under a full moon, this Pokémon likes to mimic the shadows.", color: "#705898"},
  18: {id:18, name:"Lapras", type:"Water", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/lapras.gif", desc:"A gentle soul that can ferry people across the sea.", color: "#6890F0"},
  19: {id:19, name:"Mewtwo", type:"Psychic", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/mewtwo.gif", desc:"A genetically engineered Pokémon.", color: "#A040A0"},
  
  // JOHTO (Gen 2)
  20: {id:20, name:"Sentret", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/sentret.gif", desc:"A very cautious Pokémon.", color: "#A8A878"},
  21: {id:21, name:"Hoothoot", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/hoothoot.gif", desc:"It always stands on one foot.", color: "#A8A878"},
  22: {id:22, name:"Wooper", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/wooper.gif", desc:"This Pokémon lives in cold water.", color: "#6890F0"},
  23: {id:23, name:"Heracross", type:"Bug", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/heracross.gif", desc:"This powerful Pokémon thrusts its prized horn.", color: "#A8B820"},
  24: {id:24, name:"Miltank", type:"Normal", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/miltank.gif", desc:"Its milk is packed with nutrition.", color: "#A8A878"},
  25: {id:25, name:"Phanpy", type:"Ground", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/phanpy.gif", desc:"It swings its long snout around playfully.", color: "#E0C068"},
  26: {id:26, name:"Tyranitar", type:"Rock", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/tyranitar.gif", desc:"Its body can't be harmed by any attack.", color: "#B8A038"},
  27: {id:27, name:"Ampharos", type:"Electric", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/ampharos.gif", desc:"The tail's tip shines brightly.", color: "#F8D030"},
  28: {id:28, name:"Scizor", type:"Bug", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/scizor.gif", desc:"It has a hard, steel-like body.", color: "#A8B820"},
  29: {id:29, name:"Ho-Oh", type:"Fire", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/ho-oh.gif", desc:"A legend says that its body glows in seven colors.", color: "#F08030"},
  
  // HOENN (Gen 3)
  30: {id:30, name:"Zigzagoon", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/zigzagoon.gif", desc:"Walks in a zigzag pattern.", color: "#A8A878"},
  31: {id:31, name:"Wingull", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/wingull.gif", desc:"It makes its nest on steep sea cliffs.", color: "#6890F0"},
  32: {id:32, name:"Lotad", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/lotad.gif", desc:"It looks like an aquatic plant.", color: "#6890F0"},
  33: {id:33, name:"Numel", type:"Fire", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/numel.gif", desc:"The hump on its back stores magma.", color: "#F08030"},
  34: {id:34, name:"Swablu", type:"Normal", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/swablu.gif", desc:"Its wings are like cotton tufts.", color: "#A8A878"},
  35: {id:35, name:"Spinda", type:"Normal", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/spinda.gif", desc:"No two Spinda have the same pattern.", color: "#A8A878"},
  36: {id:36, name:"Salamence", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/salamence.gif", desc:"It's uncontrollable if enraged.", color: "#7038F8"},
  37: {id:37, name:"Gardevoir", type:"Psychic", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gardevoir.gif", desc:"To protect its Trainer, it will expend all its psychic power.", color: "#A040A0"},
  38: {id:38, name:"Metagross", type:"Steel", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/metagross.gif", desc:"It is formed by combining four Beldum.", color: "#B8B8D0"},
  39: {id:39, name:"Rayquaza", type:"Dragon", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/rayquaza.gif", desc:"It lives in the ozone layer.", color: "#7038F8"},
  
  // SINNOH (Gen 4)
  40: {id:40, name:"Bidoof", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bidoof.gif", desc:"With nerves of steel, nothing can perturb it.", color: "#A8A878"},
  41: {id:41, name:"Starly", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/starly.gif", desc:"They flock in great numbers.", color: "#A8A878"},
  42: {id:42, name:"Buizel", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/buizel.gif", desc:"It swims by rotating its two tails.", color: "#6890F0"},
  43: {id:43, name:"Roselia", type:"Grass", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/roselia.gif", desc:"The more healthy the Roselia, the more pleasant its flowers' aroma.", color: "#78C850"},
  44: {id:44, name:"Riolu", type:"Fighting", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/riolu.gif", desc:"It uses the shapes of auras to understand the emotions of people.", color: "#C03028"},
  45: {id:45, name:"Gabite", type:"Dragon", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gabite.gif", desc:"It loves sparkly things.", color: "#7038F8"},
  46: {id:46, name:"Garchomp", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/garchomp.gif", desc:"When it folds up its body, its arms and wings form what look like a jet.", color: "#7038F8"},
  47: {id:47, name:"Lucario", type:"Fighting", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/lucario.gif", desc:"It's said that no foe can remain invisible to Lucario.", color: "#C03028"},
  48: {id:48, name:"Togekiss", type:"Fairy", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/togekiss.gif", desc:"It will never appear where there is strife.", color: "#EE99AC"},
  49: {id:49, name:"Giratina", type:"Ghost", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/giratina.gif", desc:"It was banished for its violence.", color: "#705898"},
  
  // UNOVA (Gen 5)
  50: {id:50, name:"Patrat", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/patrat.gif", desc:"Using food stored in cheek pouches.", color: "#A8A878"},
  51: {id:51, name:"Pidove", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pidove.gif", desc:"These Pokémon live in cities.", color: "#A8A878"},
  52: {id:52, name:"Blitzle", type:"Electric", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/blitzle.gif", desc:"When thunderclouds cover the sky, it will appear.", color: "#F8D030"},
  53: {id:53, name:"Sandile", type:"Ground", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/sandile.gif", desc:"They live buried in the sands of the desert.", color: "#E0C068"},
  54: {id:54, name:"Gothita", type:"Psychic", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/gothita.gif", desc:"Their ribbonlike feelers increase their psychic power.", color: "#A040A0"},
  55: {id:55, name:"Axew", type:"Dragon", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/axew.gif", desc:"They use their tusks to crush the berries they eat.", color: "#7038F8"},
  56: {id:56, name:"Haxorus", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/haxorus.gif", desc:"Their sturdy tusks will stay sharp.", color: "#7038F8"},
  57: {id:57, name:"Chandelure", type:"Ghost", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/chandelure.gif", desc:"The spirits burned up in its ominous flame lose their way.", color: "#705898"},
  58: {id:58, name:"Hydreigon", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/hydreigon.gif", desc:"It responds to movement by attacking.", color: "#7038F8"},
  59: {id:59, name:"Reshiram", type:"Dragon", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/reshiram.gif", desc:"Flames spout from its tail.", color: "#7038F8"},
  
  // KALOS (Gen 6)
  60: {id:60, name:"Fletchling", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/fletchling.gif", desc:"These friendly Pokémon send signals to one another.", color: "#A8A878"},
  61: {id:61, name:"Bunnelby", type:"Normal", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bunnelby.gif", desc:"They use their large ears to dig burrows.", color: "#A8A878"},
  62: {id:62, name:"Skiddo", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/skiddo.gif", desc:"If it has sunshine and water, it doesn't need to eat.", color: "#78C850"},
  63: {id:63, name:"Pancham", type:"Fighting", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pancham.gif", desc:"It does its level best to glare and pull a scary face.", color: "#C03028"},
  64: {id:64, name:"Espurr", type:"Psychic", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/espurr.gif", desc:"The organ that emits its intense psychic power.", color: "#A040A0"},
  65: {id:65, name:"Inkay", type:"Dark", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/inkay.gif", desc:"Opponents who stare at the flashing of the light-emitting spots.", color: "#705848"},
  66: {id:66, name:"Greninja", type:"Water", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/greninja.gif", desc:"It creates throwing stars out of compressed water.", color: "#6890F0"},
  67: {id:67, name:"Goodra", type:"Dragon", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/goodra.gif", desc:"The potent poison created inside its body.", color: "#7038F8"},
  68: {id:68, name:"Aegislash", type:"Steel", rarity:"epic", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/aegislash-shield.gif", desc:"It can detect the innate qualities of leadership.", color: "#B8B8D0"},
  69: {id:69, name:"Xerneas", type:"Fairy", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/xerneas.gif", desc:"Legends say it can share eternal life.", color: "#EE99AC"},
  
  // ALOLA (Gen 7)
  70: {id:70, name:"Pikipek", type:"Normal", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/731.png", desc:"It can peck 16 times a second.", color: "#A8A878"},
  71: {id:71, name:"Yungoos", type:"Normal", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/734.png", desc:"It wanders around in a never-ending search for food.", color: "#A8A878"},
  72: {id:72, name:"Wimpod", type:"Bug", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/767.png", desc:"This Pokémon is a coward.", color: "#A8B820"},
  73: {id:73, name:"Rockruff", type:"Rock", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/744.png", desc:"It's considered to be a good Pokémon for beginners.", color: "#B8A038"},
  74: {id:74, name:"Stufful", type:"Normal", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/759.png", desc:"Despite its adorable appearance, it is dangerous.", color: "#A8A878"},
  75: {id:75, name:"Fomantis", type:"Grass", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/753.png", desc:"During the day, it sleeps with its petals closed.", color: "#78C850"},
  76: {id:76, name:"Lycanroc", type:"Rock", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/745.png", desc:"When properly raised from a young age, it will become a trustworthy partner.", color: "#B8A038"},
  77: {id:77, name:"Mimikyu", type:"Ghost", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/778.png", desc:"Its actual appearance is unknown.", color: "#705898"},
  78: {id:78, name:"Incineroar", type:"Fire", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/727.png", desc:"This Pokémon has a violent, selfish disposition.", color: "#F08030"},
  79: {id:79, name:"Solgaleo", type:"Psychic", rarity:"legendary", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/791.png", desc:"It is said to live in another world.", color: "#A040A0"},
  
  // GALAR (Gen 8)
  80: {id:80, name:"Skwovet", type:"Normal", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/819.png", desc:"Found throughout the Galar region.", color: "#A8A878"},
  81: {id:81, name:"Rookidee", type:"Flying", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/821.png", desc:"It will bravely challenge any opponent.", color: "#A890F0"},
  82: {id:82, name:"Nickit", type:"Dark", rarity:"common", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/827.png", desc:"Aided by the soft pads on its feet.", color: "#705848"},
  83: {id:83, name:"Dreepy", type:"Dragon", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/885.png", desc:"After being reborn as a ghost Pokémon.", color: "#7038F8"},
  84: {id:84, name:"Toxel", type:"Electric", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/848.png", desc:"It stores poison in an internal poison sac.", color: "#F8D030"},
  85: {id:85, name:"Hattrem", type:"Psychic", rarity:"uncommon", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/857.png", desc:"Using the braids on its head, it pummels foes.", color: "#A040A0"},
  86: {id:86, name:"Dragapult", type:"Dragon", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/887.png", desc:"When it isn't battling, it keeps Dreepy in the holes.", color: "#7038F8"},
  87: {id:87, name:"Corviknight", type:"Flying", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/823.png", desc:"With its fierce personality, it battles by stomping.", color: "#A890F0"},
  88: {id:88, name:"Grimmsnarl", type:"Dark", rarity:"epic", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/861.png", desc:"With the hair wrapped around its body helping to enhance its muscles.", color: "#705848"},
  89: {id:89, name:"Zacian", type:"Fairy", rarity:"legendary", image:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/888.png", desc:"Known as a legendary hero, this Pokémon absorbs metal particles.", color: "#EE99AC"},
};

export const starters = [pokemonDB[1], pokemonDB[2], pokemonDB[3]];
