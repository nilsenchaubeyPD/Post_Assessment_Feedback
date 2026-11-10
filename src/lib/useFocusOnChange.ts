import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a screen's heading. Whenever `screenKey`
 * changes (because of something the user did), focus moves to that
 * heading. The very first render — the initial page load — is skipped,
 * per the focus-management rule in the spec.
 */
export function useFocusOnChange<T extends HTMLElement>(
  screenKey: string,
): React.RefObject<T> {
  const ref = useRef<T>(null);
  // Track the previous key by value, not a one-shot boolean: a boolean flag
  // would be flipped early by React 18 StrictMode's double-invoked mount
  // effect in development, causing a spurious focus jump on first load.
  const previousKey = useRef(screenKey);

  useEffect(() => {
    if (previousKey.current !== screenKey) {
      ref.current?.focus();
    }
    previousKey.current = screenKey;
  }, [screenKey]);

  return ref;
}
