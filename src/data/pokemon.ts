import { Pokemon } from "@/types/game";

export const pokemonDB: Record<number, Pokemon> = {
  // Starters
  1: {id:1, name:"Bulbasaur", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif", desc:"Seed on its back."},
  2: {id:2, name:"Charmander", type:"Fire", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/charmander.gif", desc:"Fire on its tail."},
  3: {id:3, name:"Squirtle", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/squirtle.gif", desc:"Shoots water."},
  // Electric
  4: {id:4, name:"Pikachu", type:"Electric", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif", desc:"Electric mouse."},
  5: {id:5, name:"Magnemite", type:"Electric", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/magnemite.gif", desc:"A floating magnet."},
  6: {id:6, name:"Voltorb", type:"Electric", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/voltorb.gif", desc:"Resembles a Poké Ball."},
  7: {id:7, name:"Jolteon", type:"Electric", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/jolteon.gif", desc:"Can generate 10,000-volt bolts."},
  // Fire
  8: {id:8, name:"Vulpix", type:"Fire", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/vulpix.gif", desc:"Has six beautiful tails."},
  9: {id:9, name:"Ponyta", type:"Fire", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/ponyta.gif", desc:"Its hooves are 10x harder than diamond."},
  10: {id:10, name:"Flareon", type:"Fire", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/flareon.gif", desc:"Its body temperature exceeds 1,650 degrees."},
  // Water
  11: {id:11, name:"Psyduck", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/psyduck.gif", desc:"Plagued by chronic headaches."},
  12: {id:12, name:"Poliwag", type:"Water", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/poliwag.gif", desc:"The swirl on its belly is its organs."},
  13: {id:13, name:"Vaporeon", type:"Water", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/vaporeon.gif", desc:"Its body is 90% water."},
  // Grass
  14: {id:14, name:"Oddish", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/oddish.gif", desc:"Walks on its roots at night."},
  15: {id:15, name:"Bellsprout", type:"Grass", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/bellsprout.gif", desc:"A walking plant Pokémon."},
  16: {id:16, name:"Tangela", type:"Grass", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/tangela.gif", desc:"Covered in blue vines."},
  // Ice
  17: {id:17, name:"Snorunt", type:"Ice", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/snorunt.gif", desc:"Found in icy caves."},
  18: {id:18, name:"Spheal", type:"Ice", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/spheal.gif", desc:"Rolls everywhere it goes."},
  19: {id:19, name:"Glaceon", type:"Ice", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/glaceon.gif", desc:"Can freeze its fur into sharp needles."},
  // Psychic
  20: {id:20, name:"Abra", type:"Psychic", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/abra.gif", desc:"Sleeps for 18 hours a day."},
  21: {id:21, name:"Drowzee", type:"Psychic", rarity:"common", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/drowzee.gif", desc:"Eats the dreams of its foes."},
  22: {id:22, name:"Espeon", type:"Psychic", rarity:"uncommon", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/espeon.gif", desc:"Predicts foes' moves with its fur."},
  // Legendaries
  23: {id:23, name:"Mewtwo", type:"Psychic", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/mewtwo.gif", desc:"A genetically engineered Pokémon."},
  24: {id:24, name:"Zapdos", type:"Electric", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/zapdos.gif", desc:"The legendary bird of lightning."},
  25: {id:25, name:"Moltres", type:"Fire", rarity:"legendary", image:"https://img.pokemondb.net/sprites/black-white/anim/normal/moltres.gif", desc:"The legendary bird of fire."},
};

export const starters = [pokemonDB[1], pokemonDB[2], pokemonDB[3]];
