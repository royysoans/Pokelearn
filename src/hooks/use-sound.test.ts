import { describe, it, expect, beforeEach } from 'vitest';
import { getSfxVolume, setSfxVolume, isSfxMuted, setSfxMuted } from './use-sound';

describe('useSound volume utilities', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });


  it('defaults SFX volume to 0.5 when unconfigured', () => {
    expect(getSfxVolume()).toBe(0.5);
    expect(isSfxMuted()).toBe(false);
  });

  it('persists and clamps updated SFX volume', () => {
    setSfxVolume(0.8);
    expect(getSfxVolume()).toBe(0.8);

    setSfxVolume(1.5); // Should clamp to 1
    expect(getSfxVolume()).toBe(1);

    setSfxVolume(-0.2); // Should clamp to 0
    expect(getSfxVolume()).toBe(0);
  });

  it('persists SFX muted state', () => {
    setSfxMuted(true);
    expect(isSfxMuted()).toBe(true);

    setSfxMuted(false);
    expect(isSfxMuted()).toBe(false);
  });
});
