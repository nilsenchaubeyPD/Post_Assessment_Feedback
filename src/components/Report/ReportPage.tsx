import { ArrowLeft, FileText } from "lucide-react";
import { CardShell } from "../common/CardShell";
import { useFocusOnChange } from "../../lib/useFocusOnChange";
import type { Scenario } from "../../types";
import styles from "./ReportPage.module.css";

const SECTIONS = ["Aptitude", "Verbal ability", "Coding", "Technical MCQs"];

interface ReportPageProps {
  scenario: Scenario;
  focusSeq: number;
  onBack: () => void;
}

export function ReportPage({ scenario, focusSeq, onBack }: ReportPageProps) {
  const headingRef = useFocusOnChange<HTMLHeadingElement>(`report-${focusSeq}`);

  return (
    <CardShell>
      <button type="button" className={styles.back} onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </button>

      <div className={styles.headRow}>
        <h1 ref={headingRef} tabIndex={-1} className={styles.pageTitle}>
          Your report
        </h1>
        {scenario === "terminated" ? (
          <span className={`${styles.badge} ${styles.badgeTerminated}`}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Terminated
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeCompleted}`}>
            Completed
          </span>
        )}
      </div>

      <div className={styles.scoreRow}>
        <span className={styles.scoreIconWell} aria-hidden="true">
          <FileText size={20} strokeWidth={1.75} color="var(--primary)" />
        </span>
        <div>
          <div className={styles.scoreLabel}>Overall score</div>
          <div className={styles.scoreValue}>— / 100</div>
        </div>
      </div>

      <div className={styles.sections}>
        {SECTIONS.map((section) => (
          <div key={section} className={styles.sectionRow}>
            <span>{section}</span>
            <span className={styles.sectionScore}>— / 25</span>
          </div>
        ))}
      </div>

      <p className={styles.note}>
        Placeholder. The full report is out of scope for this prototype.
      </p>
    </CardShell>
  );
}
