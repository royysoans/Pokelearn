export function useSound() {
  function playTone(frequency: number, durationMs = 180, type: OscillatorType = "square") {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.05; // subtle volume
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
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2.0);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3.0);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          lfo.stop();
          audioCtx.close();
        }, 3000);
      } catch (_) { }
    },
    playEvolutionSuccess: () => {
      // Fanfare: G G G E A G
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const t = ctx.currentTime;

      const play = (freq: number, time: number, dur: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.05, time);
        g.gain.exponentialRampToValueAtTime(0.01, time + dur - 0.05);
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
    }
  };
}





