import { ReportUnlockCTA } from "./ReportUnlockCTA";
import styles from "./Banner.module.css";

interface BannerProps {
  /** "Allow candidate to review their mistake" setting, resolved one level
   * up (config default / URL override, currently also live-toggleable via
   * the temporary `ReportVisibilityToggle` — see `App.tsx`). When false,
   * the entire View Report section (button + countdown) is hidden — not
   * shown by default, and never rendered half-way (e.g. no bare button
   * with no countdown). */
  showReportCta: boolean;
  onViewReport: () => void;
}

export function Banner({ showReportCta, onViewReport }: BannerProps) {
  return (
    <div className={styles.banner}>
      <h1 className={styles.title}>Thank you for attempting the assessment</h1>
      <p className={styles.subtitle}>We’ll get in touch with you shortly</p>
      {showReportCta ? <ReportUnlockCTA onViewReport={onViewReport} /> : null}
    </div>
  );
}
