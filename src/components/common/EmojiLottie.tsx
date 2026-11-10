import { useEffect, useRef, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web/build/player/lottie_light";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

// Lazy, per-file chunks — each emoji's Lottie JSON is only fetched the
// first time it is actually needed.
const lottieModules = import.meta.glob<{ default: unknown }>(
  "../../assets/noto/*.json",
);

const dataCache = new Map<string, Promise<unknown>>();

function loadEmojiData(codepoint: string): Promise<unknown> {
  let cached = dataCache.get(codepoint);
  if (!cached) {
    const path = `../../assets/noto/${codepoint}.json`;
    const loader = lottieModules[path];
    cached = loader
      ? loader().then((mod) => mod.default)
      : Promise.reject(new Error(`No Lottie asset for codepoint ${codepoint}`));
    dataCache.set(codepoint, cached);
  }
  return cached;
}

interface EmojiLottieProps {
  codepoint: string;
  restFrame: number;
  /** True while the emoji should be actively animating (hovered by a mouse
   * pointer, or the currently selected rating). */
  active: boolean;
}

export function EmojiLottie({ codepoint, restFrame, active }: EmojiLottieProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    loadEmojiData(codepoint).then((raw) => {
      if (cancelled || !containerRef.current) return;
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        // Each player gets its own clone: lottie-web mutates the data
        // object it is given, and five emoji share nothing else.
        animationData: structuredClone(raw),
      });
      animRef.current = anim;
      anim.goToAndStop(restFrame, true);
      setReady(true);
    });

    return () => {
      cancelled = true;
      animRef.current?.destroy();
      animRef.current = null;
    };
    // Re-create only when the emoji identity changes; play/pause is
    // handled by the effect below without reloading the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codepoint]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim || !ready) return;
    if (active && !reducedMotion) {
      anim.play();
    } else {
      anim.goToAndStop(restFrame, true);
    }
  }, [active, reducedMotion, ready, restFrame]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
