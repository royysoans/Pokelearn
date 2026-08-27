export function getSfxVolume(): number {
  if (typeof localStorage === "undefined") return 0.5;
  const saved = localStorage.getItem("sfxVolume");
  return saved ? Math.min(1, Math.max(0, parseFloat(saved))) : 0.5;
}

export function setSfxVolume(val: number): void {
  if (typeof localStorage === "undefined") return;
  const clamped = Math.min(1, Math.max(0, val));
  localStorage.setItem("sfxVolume", clamped.toString());
}

export function isSfxMuted(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("sfxMuted") === "true";
}

export function setSfxMuted(muted: boolean): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("sfxMuted", String(muted));
}

export function useSound() {
  function getEffectiveGain(baseGain = 0.05): number {
    if (isSfxMuted()) return 0;
    const vol = getSfxVolume();
    return baseGain * vol;
  }

  function playTone(frequency: number, durationMs = 180, type: OscillatorType = "square") {
    const gainVal = getEffectiveGain(0.1);
    if (gainVal <= 0) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = gainVal;
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, durationMs);
    } catch (_) {
      // ignore audio errors (e.g., autoplay restrictions)
    }
  }

  return {
    getSfxVolume,
    setSfxVolume,
    isSfxMuted,
    setSfxMuted,
    playCorrect: () => {
      // simple ascending chirp
      playTone(660, 120);
      setTimeout(() => playTone(880, 120), 100);
    },
    playWrong: () => {
      // quick descending blip
      playTone(220, 150, "sawtooth");
      setTimeout(() => playTone(160, 120, "sawtooth"), 120);
    },
    playVictory: () => {
      // short victory triad
      playTone(523, 120); // C5
      setTimeout(() => playTone(659, 120), 120); // E5
      setTimeout(() => playTone(783, 200), 240); // G5
    },
    playEvolutionStart: () => {
      const startGain = getEffectiveGain(0.05);
      const endGain = getEffectiveGain(0.1);
      if (startGain <= 0) return;

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 3.0); // Rise over 3s

        // Tremolo effect (fluttering)
        const lfo = audioCtx.createOscillator();
        lfo.type = "square";
        lfo.frequency.value = 15;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();

        gain.gain.setValueAtTime(startGain, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(endGain, audioCtx.currentTime + 2.0);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3.0);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          lfo.stop();
          audioCtx.close();
        }, 3000);
      } catch (_) { /* ignore audio error */ }
    },
    playEvolutionSuccess: () => {
      const baseG = getEffectiveGain(0.08);
      if (baseG <= 0) return;

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const t = ctx.currentTime;

        const play = (freq: number, time: number, dur: number) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = freq;
          g.gain.setValueAtTime(baseG, time);
          g.gain.exponentialRampToValueAtTime(Math.max(0.001, baseG * 0.1), time + dur - 0.05);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + dur);
        };

        play(783.99, t, 0.1); // G5
        play(783.99, t + 0.15, 0.1); // G5
        play(783.99, t + 0.3, 0.1); // G5
        play(1046.50, t + 0.45, 0.4); // C6

        setTimeout(() => ctx.close(), 1000);
      } catch (_) { /* ignore audio error */ }
    },
    playBuddyCry: () => {
      // Cute high-pitched chirp
      playTone(880, 100, "sine");
      setTimeout(() => playTone(1100, 100, "sine"), 80);
      setTimeout(() => playTone(1320, 150, "sine"), 160);
    }
  };
}






