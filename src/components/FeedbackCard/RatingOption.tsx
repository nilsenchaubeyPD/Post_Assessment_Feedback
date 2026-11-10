import { useState } from "react";
import type { PointerEvent } from "react";
import { EmojiLottie } from "../common/EmojiLottie";
import type { RatingOptionConfig } from "../../types";
import styles from "./Rating.module.css";

function supportsHover(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover)").matches
  );
}

interface RatingOptionProps {
  option: RatingOptionConfig;
  selected: boolean;
  tabIndex: number;
  onSelect: () => void;
  innerRef: (el: HTMLButtonElement | null) => void;
}

export function RatingOption({
  option,
  selected,
  tabIndex,
  onSelect,
  innerRef,
}: RatingOptionProps) {
  const [hoveredByMouse, setHoveredByMouse] = useState(false);
  const [focused, setFocused] = useState(false);

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && supportsHover()) {
      setHoveredByMouse(true);
    }
  };

  const handlePointerLeave = () => {
    setHoveredByMouse(false);
  };

  const showHoverLabel = !selected && (hoveredByMouse || focused);
  const emojiActive = selected || hoveredByMouse;

  const optionClasses = [styles.option, selected ? styles.selected : ""]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    styles.label,
    selected || showHoverLabel ? styles.visible : "",
    selected ? styles.selectedLabel : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={innerRef}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      className={optionClasses}
      onClick={onSelect}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <span className={styles.stage}>
        <span className={styles.well} aria-hidden="true" />
        <span className={styles.halo} aria-hidden="true" />
        <span className={styles.face}>
          <EmojiLottie
            codepoint={option.codepoint}
            restFrame={option.restFrame}
            active={emojiActive}
          />
        </span>
      </span>
      <span className={labelClasses} aria-hidden="true">
        {option.label}
      </span>
    </button>
  );
}
