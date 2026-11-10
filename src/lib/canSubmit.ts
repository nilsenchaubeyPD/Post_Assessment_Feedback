/**
 * Pure submit-eligibility rule for the feedback card. No DOM, no React —
 * easy to unit test and to reason about in isolation.
 *
 * Rules:
 * - A rating is always required.
 * - Very Bad / Bad / Okay (rating <= lowRatingMax) additionally require at
 *   least one "What went wrong?" reason to be selected — any single reason
 *   is enough, including "Other" by itself.
 * - Good / Excellent (rating > lowRatingMax) need nothing beyond the
 *   rating itself.
 * - The comment box is NEVER required, for any rating or reason
 *   combination (including "Other") — there is no text-length check here
 *   at all.
 */
export interface CanSubmitInput {
  /** Chosen rating value (1-5), or null when nothing is chosen yet. */
  rating: number | null;
  /** Ids of currently selected "what went wrong" reasons. */
  reasonIds: string[];
  /** Ratings at or below this value require at least one reason. */
  lowRatingMax: number;
}

export interface CanSubmitResult {
  ok: boolean;
  /** Empty string when ok. Otherwise the hidden hint to announce. */
  hint: string;
}

export function canSubmit({ rating, reasonIds, lowRatingMax }: CanSubmitInput): CanSubmitResult {
  if (rating == null) {
    return { ok: false, hint: "Choose a rating to submit" };
  }

  // Reasons only matter for low ratings. Any reasons left selected from a
  // previous low rating are stale and must be ignored once the rating is
  // above lowRatingMax.
  if (rating <= lowRatingMax && reasonIds.length === 0) {
    return { ok: false, hint: "Pick at least one reason" };
  }

  return { ok: true, hint: "" };
}
