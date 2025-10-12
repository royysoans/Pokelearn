import { useEffect } from "react";

const KONAMI = [
  "arrowup","arrowup","arrowdown","arrowdown",
  "arrowleft","arrowright","arrowleft","arrowright","b","a"
];

export function useKonami(onUnlock: () => void) {
  useEffect(() => {
    const buffer: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      if (!e.key) return;
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();
      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();

      const isMatch = KONAMI.every((k, i) => k === buffer[i]);
      if (isMatch) {
        onUnlock();
        buffer.length = 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onUnlock]);
}
