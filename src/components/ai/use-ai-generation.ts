import { useCallback, useEffect, useRef, useState } from "react";

export type GenStatus = "idle" | "thinking" | "streaming" | "done";

/** Simulates a streamed AI response: short "thinking" pause, then text appears progressively. */
export function streamText(full: string, onUpdate: (t: string) => void, onDone: () => void, delay = 700) {
  let i = 0;
  let interval: ReturnType<typeof setInterval> | undefined;
  const step = Math.max(3, Math.ceil(full.length / 110));
  const timer = setTimeout(() => {
    interval = setInterval(() => {
      i = Math.min(full.length, i + step);
      onUpdate(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(interval);
        onDone();
      }
    }, 18);
  }, delay);
  return () => {
    clearTimeout(timer);
    if (interval) clearInterval(interval);
  };
}

export function useAiGeneration() {
  const [status, setStatus] = useState<GenStatus>("idle");
  const [text, setText] = useState("");
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelRef.current?.(), []);

  const run = useCallback((full: string) => {
    cancelRef.current?.();
    setText("");
    setStatus("thinking");
    cancelRef.current = streamText(
      full,
      (t) => {
        setStatus("streaming");
        setText(t);
      },
      () => setStatus("done"),
    );
  }, []);

  return { status, text, setText, run, busy: status === "thinking" || status === "streaming" };
}
