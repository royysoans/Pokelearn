import { useEffect, useRef, useState } from "react";

// Simple HTMLAudio-based BGM with mute toggle and volume control
export function useAudioBgm(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    return localStorage.getItem("bgmMuted") === "true";
  });
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem("bgmVolume");
    return saved ? Math.min(1, Math.max(0, parseFloat(saved))) : 0.2;
  });
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio.muted = muted;
    audioRef.current = audio;

    const onCanPlay = () => setIsReady(true);
    audio.addEventListener("canplay", onCanPlay);

    if (!muted) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onCanPlay);
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem("bgmVolume", volume.toString());
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
      localStorage.setItem("bgmMuted", String(muted));
    }
  }, [muted]);

  const toggleMute = async () => {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (audio) {
      audio.muted = next;
      if (!next) {
        try { await audio.play(); } catch {}
      }
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.min(1, Math.max(0, val));
    setVolumeState(clamped);
    if (clamped > 0 && muted) {
      setMuted(false);
    }
  };

  return { muted, volume, isReady, toggleMute, setVolume };
}





