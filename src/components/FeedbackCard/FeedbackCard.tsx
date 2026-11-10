import { useId, useState } from "react";
import { CardShell } from "../common/CardShell";
import { Button } from "../common/Button";
import { ThankYou } from "../common/ThankYou";
import { RatingRow } from "./RatingRow";
import { Reasons } from "./Reasons";
import { CommentBox } from "./CommentBox";
import { canSubmit } from "../../lib/canSubmit";
import { track } from "../../lib/analytics";
import { createResponseId, saveResponse } from "../../lib/storage";
import { useFocusOnChange } from "../../lib/useFocusOnChange";
import { LOW_RATING_MAX, REASONS, SESSION, TAXONOMY_VERSION } from "../../config/config";
import type { SelectedReason } from "../../types";
import styles from "./FeedbackCard.module.css";

interface FeedbackCardProps {
  /** Bumped by the parent on every navigation away from and back to this
   * card (e.g. a trip to the report page), so focus can return to the
   * right heading even though the card itself never unmounts. */
  focusSeq: number;
}

export function FeedbackCard({ focusSeq }: FeedbackCardProps) {
  const titleId = useId();
  const [rating, setRating] = useState<number | null>(null);
  const [reasonIds, setReasonIds] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const showReasons = rating !== null && rating <= LOW_RATING_MAX;

  // Very Bad/Bad/Okay additionally need at least one reason (any single
  // one, including "Other" by itself — no text requirement). Good/
  // Excellent need nothing beyond the rating. The comment box is never
  // required either way.
  const result = canSubmit({ rating, reasonIds, lowRatingMax: LOW_RATING_MAX });

  const headingRef = useFocusOnChange<HTMLHeadingElement>(
    `${focusSeq}:${submitted ? "thankyou" : "form"}`,
  );

  const handleRatingChange = (value: number) => {
    setRating(value);
    // Moving to a 4-5 rating hides the reasons section — clear any
    // selection right here so stale reasons never linger or leak into a
    // later submission.
    if (value > LOW_RATING_MAX) {
      setReasonIds([]);
    }
    track("rating_selected", { rating: value });
  };

  const handleReasonToggle = (id: string) => {
    setReasonIds((prev) => {
      const selected = prev.includes(id);
      const next = selected ? prev.filter((r) => r !== id) : [...prev, id];
      track("reason_toggled", { id, selected: !selected });
      return next;
    });
  };

  const handleSubmit = () => {
    if (!result.ok || rating == null) return;

    const selectedReasons: SelectedReason[] = REASONS.filter((r) =>
      reasonIds.includes(r.id),
    ).map((r) => ({ id: r.id, label: r.label, bucket: r.bucket }));

    const trimmedText = text.trim();
    const id = createResponseId();

    saveResponse({
      id,
      type: "feedback",
      submittedAt: new Date().toISOString(),
      assessmentId: SESSION.assessmentId,
      userId: SESSION.userId,
      rating,
      reasons: selectedReasons,
      text: trimmedText,
      taxonomyVersion: TAXONOMY_VERSION,
    });

    track("feedback_submitted", {
      id,
      rating,
      reasons: selectedReasons.map((r) => r.id),
      hasText: trimmedText.length > 0,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <CardShell centered>
        <ThankYou
          headingRef={headingRef}
          title="Thank you for your feedback"
          text="Your response goes to the team that handles it. You can close this window now."
        />
      </CardShell>
    );
  }

  const commentDisabled = rating == null;
  const hintId = `${titleId}-hint`;

  return (
    <CardShell>
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className={styles.title}>
        Rate your overall experience
      </h2>

      <RatingRow value={rating} onChange={handleRatingChange} titleId={titleId} />

      <Reasons open={showReasons} selectedIds={reasonIds} onToggle={handleReasonToggle} />

      <CommentBox
        id={`${titleId}-comment`}
        label="Anything else you want to tell us?"
        value={text}
        onChange={setText}
        disabled={commentDisabled}
      />

      <div>
        <Button
          type="button"
          fullWidth
          disabled={!result.ok}
          aria-describedby={hintId}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <p id={hintId} className="visually-hidden" aria-live="polite">
          {result.hint}
        </p>
      </div>
    </CardShell>
  );
}
