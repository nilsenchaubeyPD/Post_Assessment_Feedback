import { describe, expect, it } from "vitest";
import { canSubmit } from "./canSubmit";

const base = { reasonIds: [] as string[], lowRatingMax: 3 };

describe("canSubmit", () => {
  it("blocks when no rating is chosen", () => {
    const result = canSubmit({ ...base, rating: null });
    expect(result.ok).toBe(false);
    expect(result.hint).toBe("Choose a rating to submit");
  });

  it.each([1, 2, 3])(
    "blocks rating %i (Very Bad/Bad/Okay) when no reason is selected",
    (rating) => {
      const result = canSubmit({ ...base, rating, reasonIds: [] });
      expect(result.ok).toBe(false);
      expect(result.hint).toBe("Pick at least one reason");
    },
  );

  it.each([1, 2, 3])("allows rating %i once a reason is selected", (rating) => {
    const result = canSubmit({ ...base, rating, reasonIds: ["time"] });
    expect(result).toEqual({ ok: true, hint: "" });
  });

  it.each([1, 2, 3])(
    "allows rating %i when only 'Other' is selected, with no text at all",
    (rating) => {
      const result = canSubmit({ ...base, rating, reasonIds: ["other"] });
      expect(result).toEqual({ ok: true, hint: "" });
    },
  );

  it("allows multiple reasons selected together", () => {
    const result = canSubmit({ ...base, rating: 1, reasonIds: ["time", "other"] });
    expect(result).toEqual({ ok: true, hint: "" });
  });

  it.each([4, 5])("allows rating %i (Good/Excellent) with no reasons selected", (rating) => {
    const result = canSubmit({ ...base, rating, reasonIds: [] });
    expect(result).toEqual({ ok: true, hint: "" });
  });

  it("ignores stale reasons left over on a high rating", () => {
    const result = canSubmit({ ...base, rating: 5, reasonIds: [] });
    expect(result).toEqual({ ok: true, hint: "" });
  });
});
