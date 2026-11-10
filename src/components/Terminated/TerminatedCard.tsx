import { useId, useState } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { CardShell } from "../common/CardShell";
import { Button } from "../common/Button";
import { ThankYou } from "../common/ThankYou";
import { CommentBox } from "../FeedbackCard/CommentBox";
import { track } from "../../lib/analytics";
import { createResponseId, saveResponse } from "../../lib/storage";
import { useFocusOnChange } from "../../lib/useFocusOnChange";
import {
  SESSION,
  TAXONOMY_VERSION,
  TERMINATION_ANSWERS,
  TERMINATION_BUCKET,
} from "../../config/config";
import styles from "./TerminatedCard.module.css";

interface TerminatedCardProps {
  /** Bumped by the parent on every navigation away from and back to this
   * card (e.g. a trip to the report page), so focus can return to the
   * right heading even though the card itself never unmounts. */
  focusSeq: number;
  onViewReport: () => void;
}

export function TerminatedCard({ focusSeq, onViewReport }: TerminatedCardProps) {
  const titleId = useId();
  const groupName = useId();
  const [answer, setAnswer] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Termination's submit rule is simpler than feedback's: just "is an
  // answer chosen?" — no reason/other-text branching applies here.
  const canSubmitTerminated = answer != null;
  const hint = canSubmitTerminated ? "" : "Choose an option to submit";

  const headingRef = useFocusOnChange<HTMLHeadingElement>(
    `${focusSeq}:${submitted ? "thankyou" : "form"}`,
  );

  const handleSubmit = () => {
    if (!canSubmitTerminated || !answer) return;

    const id = createResponseId();
    const trimmedText = text.trim();

    saveResponse({
      id,
      type: "termination",
      submittedAt: new Date().toISOString(),
      assessmentId: SESSION.assessmentId,
      userId: SESSION.userId,
      answer,
      text: trimmedText,
      bucket: TERMINATION_BUCKET,
      taxonomyVersion: TAXONOMY_VERSION,
    });

    track("termination_answered", {
      id,
      answer,
      hasText: trimmedText.length > 0,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <CardShell centered>
        <ThankYou
          headingRef={headingRef}
          title="Thank you for telling us"
          text="Your response goes to the team that reviews terminations. You can close this window now."
        >
          <Button
            variant="secondary"
            icon={<FileText size={16} strokeWidth={1.5} aria-hidden="true" />}
            onClick={onViewReport}
          >
            View your report
          </Button>
        </ThankYou>
      </CardShell>
    );
  }

  const hintId = `${titleId}-hint`;

  return (
    <CardShell>
      <div className={styles.head}>
        <span className={styles.iconWell} aria-hidden="true">
          <AlertTriangle size={22} strokeWidth={1.75} color="var(--warning-text)" />
        </span>
        <h1 id={titleId} ref={headingRef} tabIndex={-1} className={styles.title}>
          Your exam was terminated
        </h1>
        <p className={styles.text}>Tell us what happened so we can look into it</p>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className="visually-hidden">What happened?</legend>
        {TERMINATION_ANSWERS.map((option) => {
          const checked = answer === option.id;
          return (
            <label
              key={option.id}
              className={[styles.row, checked ? styles.checked : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                type="radio"
                name={groupName}
                className={styles.input}
                checked={checked}
                onChange={() => setAnswer(option.id)}
              />
              <span className={styles.radioCircle} aria-hidden="true">
                <span className={styles.radioDot} />
              </span>
              <span className={styles.rowLabel}>{option.label}</span>
            </label>
          );
        })}
      </fieldset>

      <CommentBox
        id={`${titleId}-comment`}
        label="Tell us more"
        value={text}
        onChange={setText}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          fullWidth
          disabled={!canSubmitTerminated}
          aria-describedby={hintId}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          icon={<FileText size={16} strokeWidth={1.5} aria-hidden="true" />}
          onClick={onViewReport}
        >
          View your report
        </Button>
        <p id={hintId} className="visually-hidden" aria-live="polite">
          {hint}
        </p>
      </div>
    </CardShell>
  );
}
