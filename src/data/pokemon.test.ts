import { describe, it, expect } from 'vitest';
import { pokemonDB } from './pokemon';

describe('pokemon database integrity', () => {
  it('contains valid starter Pokémon definitions', () => {
    const bulbasaur = pokemonDB[1];
    const charmander = pokemonDB[2];
    const squirtle = pokemonDB[3];
    const pikachu = pokemonDB[4];

    expect(bulbasaur).toBeDefined();
    expect(bulbasaur.name).toBe('Bulbasaur');
    expect(bulbasaur.type).toBe('Grass');

    expect(charmander).toBeDefined();
    expect(charmander.name).toBe('Charmander');

    expect(squirtle).toBeDefined();
    expect(squirtle.name).toBe('Squirtle');

    expect(pikachu).toBeDefined();
    expect(pikachu.name).toBe('Pikachu');
  });

  it('validates evolution target IDs exist in database', () => {
    const pokemonWithEvolutions = Object.values(pokemonDB).filter(p => p.evolutionId);
    expect(pokemonWithEvolutions.length).toBeGreaterThan(0);

    pokemonWithEvolutions.forEach(p => {
      const evolvedForm = pokemonDB[p.evolutionId!];
      expect(evolvedForm).toBeDefined();
      expect(evolvedForm.id).toBe(p.evolutionId);
    });
  });
});
