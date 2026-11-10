import { useEffect, useState } from "react";

/**
 * Counts down from `durationSeconds` to 0, in whole seconds.
 *
 * The target end time is computed once (wall-clock based, not a naive
 * per-tick decrement), so the countdown stays accurate even if the tab is
 * backgrounded or the timer callback is delayed/throttled.
 */
export function useCountdown(durationSeconds: number): number {
  const [endAt] = useState(() => Date.now() + durationSeconds * 1000);
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((endAt - Date.now()) / 1000)),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(next);
      // Reached zero — nothing left to tick down, so stop polling.
      if (next <= 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [endAt]);

  return remaining;
}

/** Formats whole seconds as `mm:ss`, e.g. 58 -> "00:58", 125 -> "02:05". */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
