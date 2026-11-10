/**
 * Single source of truth for product content & taxonomy.
 * Changing labels, order, org identity, or copy must only require editing
 * this file — never a component.
 */
import orgLogo from "../assets/brand/org-logo.svg";
import topinLogo from "../assets/brand/topin-logo.svg";
import type {
  ReasonConfig,
  RatingOptionConfig,
  TerminationAnswerConfig,
} from "../types";

export const TAXONOMY_VERSION = "v2";
export const LOW_RATING_MAX = 3;
export const OTHER_REASON_ID = "other";

/** Rating scale, in display order. restFrame is the Lottie frame shown
 * whenever the emoji is not hovered/selected (i.e. not actively animating). */
export const RATING_OPTIONS: RatingOptionConfig[] = [
  { value: 1, label: "Very Bad", codepoint: "1f625", restFrame: 165 },
  { value: 2, label: "Bad", codepoint: "1f61e", restFrame: 128 },
  { value: 3, label: "Okay", codepoint: "1f610", restFrame: 0 },
  { value: 4, label: "Good", codepoint: "1f60a", restFrame: 90 },
  { value: 5, label: "Excellent", codepoint: "1f929", restFrame: 0 },
];

/** "What went wrong?" reasons, in fixed display order. Reasons are saved in
 * this order regardless of click order. */
export const REASONS: ReasonConfig[] = [
  { id: "irrelevant_questions", label: "Irrelevant Questions", bucket: "Exam fit" },
  { id: "incorrect_questions", label: "Incorrect Questions", bucket: "Content" },
  { id: "exam_terminated", label: "Exam Terminated", bucket: "Student termination" },
  { id: "camera_mic_problem", label: "Camera or Mic Problem", bucket: "Platform stability" },
  { id: "couldnt_run_or_submit", label: "Couldn't Run or Submit", bucket: "Platform stability" },
  { id: "page_timer_froze", label: "Page or Timer Froze", bucket: "Platform stability" },
  { id: "internet_or_power", label: "Internet or Power Issue", bucket: "Platform stability" },
  { id: OTHER_REASON_ID, label: "Other", bucket: "Other" },
];

/** Who triages each bucket of feedback. Used for routing in production. */
export const BUCKET_OWNERS: Record<string, string> = {
  "Exam fit": "assessment-design@topin.tech",
  Content: "content-ops@topin.tech",
  "Platform stability": "platform-reliability@topin.tech",
  "Student termination": "proctoring-ops@topin.tech",
  Other: "support@topin.tech",
};

export const TERMINATION_ANSWERS: TerminationAnswerConfig[] = [
  { id: "agree", label: "Yes, that\u2019s what happened" },
  { id: "disagree", label: "No, I was working on the exam" },
  { id: "unclear", label: "I don\u2019t understand why this happened" },
];

export const TERMINATION_BUCKET = "Student termination";

export const ORG = {
  name: "NVIDIA",
  logo: orgLogo,
  logoWidth: 123,
  logoHeight: 23,
};

export const TOPIN = {
  logo: topinLogo,
  logoHeight: 20,
  url: "https://topin.tech",
};

export const LINKEDIN_URL = "https://www.linkedin.com/company/topin-tech2/";

/** Static for now; wire to the real connection-quality signal later.
 * Supported values: "Excellent" | "Good" | "Poor". */
export const CONNECTION = {
  quality: "Excellent" as "Excellent" | "Good" | "Poor",
};

export const CONNECTION_ICON_COLOR: Record<string, string> = {
  Excellent: "var(--success-icon)",
  Good: "var(--warning-dot)",
  Poor: "var(--danger)",
};

export const USER = {
  name: "Isaac",
};

/** Demo-only identifiers; a real deployment resolves these from the
 * assessment session. */
export const SESSION = {
  assessmentId: "demo-assessment",
  userId: "demo-user",
};

/**
 * Mirrors the assessment-level "Allow candidate to review their mistake"
 * setting. In production `enabled` is resolved per-assessment from the
 * backend; here it defaults to on but can be forced either way for
 * demo/testing via `?allowReview=0` / `?allowReview=1` in the URL.
 *
 * When disabled, the entire View Report section (button + countdown) on
 * the post-assessment thank-you screen is hidden — not just the button.
 * When enabled, the button starts locked with a countdown and unlocks
 * automatically once `unlockDelaySeconds` has elapsed.
 */
function readAllowReportReview(defaultValue: boolean): boolean {
  if (typeof window === "undefined") return defaultValue;
  const param = new URLSearchParams(window.location.search).get("allowReview");
  if (param === "0") return false;
  if (param === "1") return true;
  return defaultValue;
}

export const REPORT_REVIEW = {
  enabled: readAllowReportReview(true),
  unlockDelaySeconds: 60,
};
