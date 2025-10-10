import { useEffect, useRef, useState } from "react";

// Lightweight chiptune-like background loop using WebAudio
export function useBgm() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function stopInternal() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
  }

  function start() {
    try {
      stopInternal();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      // Simple melody (in Hz) inspired by retro vibe
      const melody = [523, 587, 659, 698, 659, 587, 523, 392]; // C5 D5 E5 F5 E5 D5 C5 G4
      let step = 0;
      timerRef.current = window.setInterval(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = melody[step % melody.length];
        gain.gain.value = 0.03; // very soft
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        osc.start(now);
        osc.stop(now + 0.18);
        step++;
      }, 240); // tempo
      setIsPlaying(true);
    } catch {
      // ignore
    }
  }

  function stop() {
    stopInternal();
    setIsPlaying(false);
  }

  useEffect(() => () => stopInternal(), []);

  return { isPlaying, start, stop };
}





