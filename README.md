# topin-feedback

Post-assessment feedback experience for Topin, built with Vite + React 18 +
TypeScript + plain CSS (CSS Modules + global design tokens, no Tailwind, no
UI kit), per the design spec.

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # type-check + production build
npm run preview     # preview the production build
npm run test        # run the canSubmit unit tests (vitest)
npm run lint         # oxlint
```

## Trying both scenarios

There's no backend, so the scenario is picked with a URL query param:

- `/` or `/?scenario=completed` — the rating → reasons → comment → submit
  flow (screens 01–05).
- `/?scenario=terminated` — the termination flow (screens 06–09).

The header's **Report** button, and the **View your report** buttons in the
terminated flow, open the report stub (`§6` in the spec) from either
scenario.

On the **completed** scenario, the banner also shows a gated **View
Report** CTA with a 60-second unlock countdown — see "Conditional report
review" below.

## Project layout

- `src/styles/tokens.css` — every colour, shadow, radius, spacing and motion
  value from the spec, as CSS custom properties. Components only ever
  reference tokens, never literals.
- `src/config/config.ts` — single source of truth for copy/taxonomy: rating
  scale, reasons (labels/order/buckets), termination answers, org identity,
  user name, connection quality, links. Changing any of this never requires
  touching a component.
- `src/lib/canSubmit.ts` — pure submit-eligibility rule, fully unit tested in
  `canSubmit.test.ts` (16 cases covering the matrix in spec §5.5).
- `src/lib/analytics.ts`, `src/lib/storage.ts` — thin seams to swap for a
  real analytics SDK / API; `storage.ts` currently persists to
  `localStorage` under `topin_feedback_responses`.
- `src/lib/useFocusOnChange.ts` — moves focus to a screen's heading whenever
  the user causes a screen change, skipped on first load.
- `src/components/common/EmojiLottie.tsx` — lazy-loads each Noto emoji
  Lottie JSON (one chunk per emoji via `import.meta.glob`), clones the data
  per player, and only plays while hovered-by-mouse or selected, never under
  `prefers-reduced-motion`.
- `src/App.module.css` sets `container: app / inline-size` on the page root;
  every component queries `@container app (max-width: 640px)` for its mobile
  layout, so the design also responds inside embedded frames.

## Assets

- `src/assets/brand/org-logo.svg` and `topin-logo.svg` were exported
  directly from the Figma file (`7yNkrBSTvTIjKCBt6lNq5A`, node `15:15`) via
  the Figma MCP server — not redrawn.
- `src/assets/noto/*.json` are the real Noto Emoji Animation Lottie files
  fetched from `fonts.gstatic.com` for the five rating codepoints. **CC BY
  4.0 — credit Google** wherever these ship.

## Conditional report review

The banner on the completed scenario includes a **View Report** section
gated by the assessment-level "Allow candidate to review their mistake"
setting (`REPORT_REVIEW.enabled` in `config.ts`):

- **Setting off** — the entire section (button + countdown caption) is
  hidden; nothing renders in its place.
- **Setting on** — the button renders locked (grey, lock icon, disabled)
  with a caption counting down from `01:00`. Once it reaches `00:00`, the
  button switches to its unlocked state (soft-blue, document icon,
  clickable) and the caption changes to "Your report is ready to view".
  Clicking it opens the same report stub as the header's Report button.

There's no real settings backend, so for demo/testing purposes the
setting can be forced either way via `?allowReview=0` (off) or
`?allowReview=1` (on) in the URL, e.g.
`/?scenario=completed&allowReview=0`. The countdown duration lives in
`REPORT_REVIEW.unlockDelaySeconds` and the timer logic in
`src/lib/useCountdown.ts` (wall-clock based, so it stays accurate even if
the tab is backgrounded).

**⚠️ Temporary:** there's also a live **"Show View Report button"** toggle
rendered at the very top of the completed scenario
(`src/components/DevTools/ReportVisibilityToggle.tsx`), seeded from the
setting above, for stakeholders to flip the state at runtime without
touching the URL. It's intentionally styled as an obvious dev-only bar
(dashed border, "Temporary" tag) and is **not part of the approved
design** — delete it and its usage in `App.tsx` once the real setting is
confirmed and wired to a backend flag.

## Decisions made without a live design review

The spec listed five open items (§13) and asked to confirm with design
before shipping. Since no reviewer was available, each was resolved by
checking the live Figma file directly via MCP:

1. **Chat button** — removed (matches the latest Figma).
2. **User name** — "Isaac" (confirmed live in the Header component).
3. **Banner colours/padding** — resolved in **Figma's favour**: title
   `#475569` / subtitle `#64748B` (tokens `--banner-title` /
   `--banner-subtitle`), `40px 16px` top-and-bottom padding — confirmed
   directly against the Banner component in Figma (`121:6818` and others),
   not the spec body's stated `#1F2937`/`#6B7280`/`40px 16px 8px` default.
   The title copy also matches Figma's actual casing, "...attending the
   **a**ssessment" (lower-case).
4. **LinkedIn wordmark** — built as described in §7 (text + a small coloured
   "in" badge), confirmed to be exactly how the real Figma component is
   built — not an approximation.
5. **Connection quality** — left static ("Excellent") from `config.ts`,
   with `Good`/`Poor` colour tokens already wired up for whenever a real
   signal is available.

**Note on an inconsistency found between Figma frames**: the interaction-state
frames at `121:6816` (hover/typing states) show the banner title at 30px/36px
line-height, while the primary flow at `15:15` (the node named in the
original brief) matches the written spec's 28px/1.3. Kept 28px since that
node is the one explicitly cited as ground truth — flagging here in case
that's actually meant to be 30px.
