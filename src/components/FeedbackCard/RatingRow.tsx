import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { RATING_OPTIONS } from "../../config/config";
import { RatingOption } from "./RatingOption";
import styles from "./Rating.module.css";

interface RatingRowProps {
  value: number | null;
  onChange: (value: number) => void;
  titleId: string;
}

export function RatingRow({ value, onChange, titleId }: RatingRowProps) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = RATING_OPTIONS.findIndex((o) => o.value === value);
  const activeIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const focusAndSelect = (index: number) => {
    const option = RATING_OPTIONS[index];
    optionRefs.current[index]?.focus();
    onChange(option.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = RATING_OPTIONS.length;
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (activeIndex + 1) % count;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (activeIndex - 1 + count) % count;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusAndSelect(nextIndex);
  };

  // Reserve extra bottom space ONLY once a rating is actually selected —
  // never on hover. Hover must never resize the row (that visibly shoves
  // the comment field up/down), while an actual click already changes
  // the layout anyway (e.g. revealing the reasons chips), so reserving
  // space at that point is expected, not jarring.
  const rowClasses = [styles.row, value != null ? styles.hasSelection : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rowClasses}
      role="radiogroup"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
    >
      {RATING_OPTIONS.map((option, index) => {
        const selected = option.value === value;
        return (
          <RatingOption
            key={option.value}
            option={option}
            selected={selected}
            tabIndex={index === activeIndex ? 0 : -1}
            onSelect={() => onChange(option.value)}
            innerRef={(el) => {
              optionRefs.current[index] = el;
            }}
          />
        );
      })}
    </div>
  );
}
