import { useEffect } from "react";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"
];

export function useKonami(onUnlock: () => void) {
  useEffect(() => {
    const buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();
      for (let i = 0; i < KONAMI.length; i++) {
        const target = KONAMI[i];
        const input = buffer[i];
        if ((target.length === 1 ? target : target) !== input) {
          return;
        }
      }
      if (buffer.length === KONAMI.length) {
        onUnlock();
        buffer.length = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onUnlock]);
}





