/**
 * Minimal analytics shim. Swap the body of `track` for the real analytics
 * SDK in production — every call site in the app stays unchanged.
 */
export type AnalyticsPayload = Record<string, unknown>;

export function track(eventName: string, payload: AnalyticsPayload = {}): void {
  if (typeof window !== "undefined" && window.localStorage) {
    // eslint-disable-next-line no-console
    console.log("[analytics]", eventName, payload);
  }
}
