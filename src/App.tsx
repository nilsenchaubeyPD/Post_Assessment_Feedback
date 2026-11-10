import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Banner } from "./components/Banner/Banner";
import { Footer } from "./components/Footer/Footer";
import { FeedbackCard } from "./components/FeedbackCard/FeedbackCard";
import { TerminatedCard } from "./components/Terminated/TerminatedCard";
import { ReportPage } from "./components/Report/ReportPage";
import { ReportVisibilityToggle } from "./components/DevTools/ReportVisibilityToggle";
import { REPORT_REVIEW } from "./config/config";
import type { Scenario, View } from "./types";
import styles from "./App.module.css";

function readScenario(): Scenario {
  if (typeof window === "undefined") return "completed";
  const param = new URLSearchParams(window.location.search).get("scenario");
  return param === "terminated" ? "terminated" : "completed";
}

function App() {
  const [scenario] = useState<Scenario>(readScenario);
  const [view, setView] = useState<View>("main");
  // Bumped on every explicit navigation between the main card and the
  // report page. Both panes stay mounted (see below), so each pane's own
  // internal state changes (e.g. submitted) aren't enough on their own to
  // signal "the user just navigated here" — this sequence number is
  // combined with that internal state to form each heading's focus key.
  const [navSeq, setNavSeq] = useState(0);

  // TEMPORARY — stakeholder-review state only (see ReportVisibilityToggle).
  // Seeded from the real setting/URL override so the toggle starts in
  // whatever state the setting would otherwise produce, but can then be
  // flipped live for comparison. Remove alongside the toggle component.
  const [showReportCta, setShowReportCta] = useState<boolean>(() => REPORT_REVIEW.enabled);

  const goToReport = () => {
    setView("report");
    setNavSeq((n) => n + 1);
  };

  const goToMain = () => {
    setView("main");
    setNavSeq((n) => n + 1);
  };

  const showBanner = scenario === "completed" && view === "main";

  return (
    <div className={styles.page}>
      {scenario === "completed" ? (
        <ReportVisibilityToggle checked={showReportCta} onChange={setShowReportCta} />
      ) : null}

      <Header onReportClick={goToReport} />

      {showBanner ? (
        <Banner showReportCta={showReportCta} onViewReport={goToReport} />
      ) : null}

      <main className={showBanner ? `${styles.main} ${styles.afterBanner}` : styles.main}>
        {/* Both panes stay mounted and are toggled with `hidden` rather
            than being swapped in/out of the tree, so a trip to the report
            page and back never discards in-progress rating/reason/comment
            state or a just-submitted thank-you screen. */}
        <div hidden={view !== "main"}>
          {scenario === "completed" ? (
            <FeedbackCard focusSeq={navSeq} />
          ) : (
            <TerminatedCard focusSeq={navSeq} onViewReport={goToReport} />
          )}
        </div>
        <div hidden={view !== "report"}>
          <ReportPage scenario={scenario} focusSeq={navSeq} onBack={goToMain} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
