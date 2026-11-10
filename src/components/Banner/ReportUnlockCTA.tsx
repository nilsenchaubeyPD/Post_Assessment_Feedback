import { REPORT_REVIEW } from "../../config/config";
import { formatCountdown, useCountdown } from "../../lib/useCountdown";
import styles from "./ReportUnlockCTA.module.css";

interface ReportUnlockCTAProps {
  onViewReport: () => void;
}

/**
 * The locked/unlocked "View Report" affordance shown under the banner on
 * the completed-assessment thank-you screen. Rendering of this component
 * at all is gated by the `REPORT_REVIEW.enabled` setting one level up
 * (see `Banner.tsx`) — this component only owns the locked -> unlocked
 * countdown behaviour once it's known the section should show.
 */
export function ReportUnlockCTA({ onViewReport }: ReportUnlockCTAProps) {
  const remaining = useCountdown(REPORT_REVIEW.unlockDelaySeconds);
  const unlocked = remaining <= 0;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={[styles.cta, unlocked ? styles.unlocked : styles.locked].join(" ")}
        disabled={!unlocked}
        onClick={onViewReport}
      >
        View Report
      </button>

      <p className={styles.caption}>
        {unlocked ? (
          "Your report is ready to view"
        ) : (
          <>
            Your report will be available in <strong>{formatCountdown(remaining)}</strong>
          </>
        )}
      </p>

      {/* Announced once, only on the locked -> unlocked transition — the
          visible caption above updates every second, which would be far
          too noisy to also pipe through to assistive tech. */}
      <p className="visually-hidden" aria-live="polite">
        {unlocked ? "Report unlocked. You can now view your report." : ""}
      </p>
    </div>
  );
}
