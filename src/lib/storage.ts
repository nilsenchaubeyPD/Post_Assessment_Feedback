import type { SavedResponse } from "../types";

const STORAGE_KEY = "topin_feedback_responses";

/**
 * Prototype persistence. Replace with a real API call in production; the
 * shape of `SavedResponse` is the contract to preserve.
 */
export function saveResponse(entry: SavedResponse): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: SavedResponse[] = raw ? JSON.parse(raw) : [];
    list.push(entry);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage can throw in private-browsing / storage-full situations.
    // Swallow it — losing the local copy must never block the thank-you UI.
  }
}

export function createResponseId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `resp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
