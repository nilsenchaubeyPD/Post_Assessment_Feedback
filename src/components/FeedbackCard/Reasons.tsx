import { REASONS } from "../../config/config";
import styles from "./Reasons.module.css";

interface ReasonsProps {
  open: boolean;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function Reasons({ open, selectedIds, onToggle }: ReasonsProps) {
  const wrapperClasses = [styles.wrapper, open ? styles.open : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} aria-hidden={!open}>
      <div className={styles.inner}>
        <p className={styles.title}>What went wrong?</p>
        <div className={styles.list} role="group" aria-label="What went wrong?">
          {REASONS.map((reason) => {
            const selected = selectedIds.includes(reason.id);
            return (
              <button
                key={reason.id}
                type="button"
                className={[styles.badge, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => onToggle(reason.id)}
              >
                {reason.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
