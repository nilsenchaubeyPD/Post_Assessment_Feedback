import { useLayoutEffect, useRef } from "react";
import styles from "./CommentBox.module.css";

interface CommentBoxProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Starts tight at 80px; grows with content as the user types multiple
// lines; caps at 120px, beyond which the field scrolls internally
// instead of growing further.
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 120;

/**
 * Always-optional comment field. There is no required/mandatory state
 * here — not for any rating value, and not for any "What went wrong?"
 * reason selection (including "Other"). The visible label is folded into
 * the textarea's own placeholder to match the approved design (no
 * separate label row above the field) — a real, visually-hidden <label>
 * is kept so the field still has an accessible name for assistive tech.
 */
export function CommentBox({ id, label, value, onChange, disabled = false }: CommentBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow: measure the content's natural height (scrollHeight) and
  // clamp it between MIN_HEIGHT and MAX_HEIGHT. Re-collapsing to "auto"
  // first lets it shrink back down when text is deleted, not just grow.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${next}px`;
  }, [value]);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        className={styles.textarea}
        placeholder={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
