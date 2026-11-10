export type Scenario = "completed" | "terminated";

export type View = "main" | "report";

export interface ReasonConfig {
  id: string;
  label: string;
  bucket: string;
}

export interface SelectedReason {
  id: string;
  label: string;
  bucket: string;
}

export interface RatingOptionConfig {
  value: number;
  label: string;
  codepoint: string;
  restFrame: number;
}

export interface TerminationAnswerConfig {
  id: string;
  label: string;
}

export interface FeedbackResponse {
  id: string;
  type: "feedback";
  submittedAt: string;
  assessmentId: string;
  userId: string;
  rating: number;
  reasons: SelectedReason[];
  text: string;
  taxonomyVersion: string;
}

export interface TerminationResponse {
  id: string;
  type: "termination";
  submittedAt: string;
  assessmentId: string;
  userId: string;
  answer: string;
  text: string;
  bucket: string;
  taxonomyVersion: string;
}

export type SavedResponse = FeedbackResponse | TerminationResponse;
