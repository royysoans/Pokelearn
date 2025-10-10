import { useEffect, useRef, useState } from "react";

// Simple HTMLAudio-based BGM with mute toggle
export function useAudioBgm(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.2;
    audio.muted = true; // start muted to satisfy autoplay policies
    audioRef.current = audio;

    const onCanPlay = () => setIsReady(true);
    audio.addEventListener("canplay", onCanPlay);

    // Try autoplay muted; browsers may allow muted autoplay
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onCanPlay);
      audioRef.current = null;
    };
  }, [src]);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
    if (!next) {
      // ensure playback after user gesture
      try { await audio.play(); } catch {}
    }
  };

  return { muted, isReady, toggleMute };
}




