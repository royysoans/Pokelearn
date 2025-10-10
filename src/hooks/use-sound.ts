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
  };
}





