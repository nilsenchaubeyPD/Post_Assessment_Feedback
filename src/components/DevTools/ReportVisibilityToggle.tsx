import styles from "./ReportVisibilityToggle.module.css";

interface ReportVisibilityToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * TEMPORARY — stakeholder-review control only, not part of the approved
 * design. Lets reviewers flip the "Allow candidate to review their
 * mistake" setting at runtime to compare both states of the View Report
 * section without editing the URL. Delete this component (and its usage
 * in `App.tsx`) once the setting is confirmed and wired to the real
 * backend flag.
 */
export function ReportVisibilityToggle({ checked, onChange }: ReportVisibilityToggleProps) {
  return (
    <div className={styles.bar}>
      <span className={styles.tag}>Temporary</span>
      <label className={styles.label}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={[styles.track, checked ? styles.on : ""].filter(Boolean).join(" ")}
          onClick={() => onChange(!checked)}
        >
          <span className={styles.knob} />
        </button>
        Show View Report button
      </label>
    </div>
  );
}
