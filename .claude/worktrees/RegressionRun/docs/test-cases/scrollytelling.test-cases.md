# Scrollytelling Component - Test Cases

## Component Overview
**Component:** Scrollytelling
**User Story:** 2183
**Status:** Ready for UAT
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint23/scrollytelling
**Figma Design:** https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=7619-68075&m=dev

## Scope
**Front-end validation ONLY** — component rendering, content display, layout, interactive behaviour (step navigation), visual fidelity vs Figma, accessibility (WCAG 2.1 AA) and performance.
**Excluded:** all CMS authoring functionality.

## Content Model Structure
Based on requirements from User Story 2183:
- **Steps:** Ordered collection of panels, each with a step label, title (with highlighted span), description and image.
- **Pagination / stepper:** One indicator per step plus Previous / Next arrows.
- **Image placement:** Full-width or reduced (positioned) per step.

> **Note:** Scroll-driven step changes and sticky pagination (motion design) are **deferred to #3319** and are not implemented on the current test page.

## Layout Variants (Figma)
Four layout variants exist; typography is **identical** across all of them (verified
via `figma-extractor.ts`). The test page authors **all four variants on one page —
one per step** — so they are validated directly (TC-ST13–TC-ST17). Only text
alignment (left/right) and image placement (full-screen/half) differ.

| Variant | Step on test page | XL | LG | MD | SM |
|---------|-------------------|----|----|----|----|
| Text right + image full-screen | Crop Science | 7619-68075 | 7619-68077 | 7619-68083 | 7619-68069 |
| Text left + image full-screen | Consumer Health | 7619-68073 | 7619-68078 | 7619-68084 | 7619-68071 |
| Text right + image half | Pharmaceuticals | 7619-68076 | 7619-68079 | 7619-68081 | 7619-68070 |
| Text left + image half | Divisions | 7619-68074 | 7619-68080 | 7619-68082 | 7619-68072 |

## Test Case Coverage Matrix

| Category | Test Count | Tags | Priority |
|----------|------------|------|----------|
| Functional | 17 | @Functional | High |
| Accessibility | 5 | @Accessibility | High |
| Performance | 3 | @Performance | Medium |
| Visual | 4 | @Visual | High |
| **Total** | **29** | | |

> 2 functional cases (TC-ST04 sticky stepper, TC-ST10 scroll-driven step change) are marked `test.fixme` pending #3319.

---

## FUNCTIONAL TEST CASES

### TC-ST01: Component loads and is visible
**Priority:** High
**Tags:** @Functional @Smoke

**Test Steps:**
1. Navigate to the Scrollytelling test page (with authentication + cookies handled).
2. Wait for page to load completely.
3. Verify the component container is visible.

**Expected Results:**
- Component `[data-qa="scrollytelling"]` is visible and rendered without layout shift.

---

### TC-ST02: All configured steps render (>= 2)
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Navigate to the component page.
2. Count the rendered step indicators / panels.

**Expected Results:**
- At least 2 steps render and each has a corresponding pagination indicator.

---

### TC-ST03: Active step renders title (with highlight span) and description
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Navigate to the component page.
2. Read the active step title and description.

**Expected Results:**
- Active title is non-empty and contains a highlighted `<span>`.
- Active description is non-empty.

---

### TC-ST04: Stepper / pagination is sticky
**Priority:** Medium
**Tags:** @Functional
**Status:** `test.fixme` — motion design deferred to **#3319**.

**Test Steps:**
1. Scroll through the component.
2. Verify the pagination stays pinned within the viewport.

**Expected Results:**
- Pagination remains sticky/fixed while the component is in view. *(Not yet implemented on test page.)*

---

### TC-ST05: One indicator per step
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Navigate to the component page.
2. Compare indicator count to step count.

**Expected Results:**
- The number of pagination indicators equals the number of steps.

---

### TC-ST06: Clicking a step indicator activates that step
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Click a non-active step indicator.
2. Verify the active step changes to the clicked step.

**Expected Results:**
- Clicked step becomes active (`aria-current="true"`); title/description/image update accordingly.

---

### TC-ST07: Next arrow advances to the following step
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. From a non-last step, click the Next arrow.
2. Verify the active step index increments.

**Expected Results:**
- Active step advances by one.

---

### TC-ST08: Previous arrow goes back and is disabled on the first step
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Advance one step, then click the Previous arrow.
2. Navigate to the first step and inspect the Previous arrow state.

**Expected Results:**
- Previous arrow returns to the prior step.
- Previous arrow is disabled on the first step.

---

### TC-ST09: Next arrow is disabled on the last step
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Navigate to the last step.
2. Inspect the Next arrow state.

**Expected Results:**
- Next arrow is disabled on the last step.

---

### TC-ST10: Scrolling updates the active step
**Priority:** Medium
**Tags:** @Functional
**Status:** `test.fixme` — motion design deferred to **#3319**.

**Test Steps:**
1. Scroll through the component in increments.
2. Verify the active step changes as scroll position progresses.

**Expected Results:**
- Active step updates with scroll position. *(Not yet implemented on test page — all panels render simultaneously.)*

---

### TC-ST11: Step image renders for the active step
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Navigate to the component page.
2. Verify the active step image element is present and visible.

**Expected Results:**
- Active step image `img[data-qa="next-image"]` is visible.

---

### TC-ST12: Image placement is rendered (full-width or reduced)
**Priority:** Medium
**Tags:** @Functional

**Test Steps:**
1. Inspect the image placement for the active step.

**Expected Results:**
- Image placement resolves to either full-width or reduced (positioned) layout.

---

### TC-ST13: All four layout variants are rendered (full/half × left/right)
**Priority:** High
**Tags:** @Functional

**Test Steps:**
1. Read the static layout of every content panel.
2. Collect the placement (full/half) × text-side (left/right) combinations.

**Expected Results:**
- All four combinations are present: `full-right`, `full-left`, `half-right`, `half-left`.

---

### TC-ST14: Crop Science panel — full-screen image with text container right
**Priority:** High
**Tags:** @Functional

**Expected Results:**
- Crop Science panel uses a full-screen background image with the text container on the right.

---

### TC-ST15: Consumer Health panel — full-screen image with text container left
**Priority:** High
**Tags:** @Functional

**Expected Results:**
- Consumer Health panel uses a full-screen background image with the text container on the left.

---

### TC-ST16: Pharmaceuticals panel — half image with text container right
**Priority:** High
**Tags:** @Functional

**Expected Results:**
- Pharmaceuticals panel uses a half (reduced/positioned) image with the text container on the right.

---

### TC-ST17: Divisions panel — half image with text container left
**Priority:** High
**Tags:** @Functional

**Expected Results:**
- Divisions panel uses a half (reduced/positioned) image with the text container on the left.

---

## ACCESSIBILITY TEST CASES

### TC-ST-A11Y01: No critical axe-core violations on the component
**Priority:** High
**Tags:** @Accessibility
**Requirements:** WCAG 2.1 A / AA

**Test Steps:**
1. Run an axe-core scan scoped to `[data-qa="scrollytelling"]`.
2. Check for serious/critical violations.

**Expected Results:**
- Zero serious/critical violations.

**Known finding:** Inactive stepper labels (`pagination-item-N`, `aria-current="false"`, dimmed grey `#90A1B9`) currently fail `color-contrast` (< 4.5:1) — flagged for a design/build fix.

---

### TC-ST-A11Y02: Step indicators expose accessible names
**Priority:** High
**Tags:** @Accessibility

**Test Steps:**
1. Inspect each step indicator for an accessible name (`aria-label`).

**Expected Results:**
- Every indicator exposes a meaningful accessible name.

---

### TC-ST-A11Y03: Step indicators are keyboard operable (Tab + Enter)
**Priority:** High
**Tags:** @Accessibility

**Test Steps:**
1. Tab to a step indicator.
2. Activate it with Enter.

**Expected Results:**
- Indicator is reachable by keyboard and activating it changes the active step.

---

### TC-ST-A11Y04: Prev/Next arrows are keyboard operable
**Priority:** High
**Tags:** @Accessibility

**Test Steps:**
1. Focus the Next/Previous arrows via keyboard.
2. Activate them with Enter.

**Expected Results:**
- Arrows are focusable and operable by keyboard, changing the active step.

---

### TC-ST-A11Y05: Step images provide alt text
**Priority:** Medium
**Tags:** @Accessibility

**Test Steps:**
1. Inspect the active step image `alt` attribute.

**Expected Results:**
- Step images expose non-empty, meaningful alternative text.

---

## PERFORMANCE TEST CASES

### TC-ST-PERF01: Component becomes visible within threshold
**Priority:** Medium
**Tags:** @Performance

**Test Steps:**
1. Measure time from navigation to the component becoming visible.

**Expected Results:**
- Component becomes visible within the agreed performance threshold.

---

### TC-ST-PERF02: Active step image finishes loading (naturalWidth > 0)
**Priority:** Medium
**Tags:** @Performance

**Test Steps:**
1. Wait for the active step image to load.
2. Read its `naturalWidth`.

**Expected Results:**
- Image fully loads (`naturalWidth > 0`).

---

### TC-ST-PERF03: Step transition settles after navigation
**Priority:** Medium
**Tags:** @Performance

**Test Steps:**
1. Navigate to another step.
2. Verify the transition completes and the new step is stable.

**Expected Results:**
- Transition settles without lingering animation or layout instability.

---

## VISUAL TEST CASES

### TC-ST-VIS01: Title typography matches Figma (XL)
**Priority:** High
**Tags:** @Visual
**Requirements:** Figma node-id=7619-68075

**Test Steps:**
1. Set viewport to XL (1440x900).
2. Compare computed title typography against Figma values.

**Expected Results:**
- Font family `Bayer Sans`, size `30px`, weight `700`, line-height `36px`, colour `rgba(16, 56, 79, 1)` (within tolerance).

---

### TC-ST-VIS02: Description typography matches Figma (XL)
**Priority:** High
**Tags:** @Visual

**Test Steps:**
1. Set viewport to XL.
2. Compare computed description typography against Figma values.

**Expected Results:**
- Font size `18px`, weight `400`, line-height `28px` (within tolerance).

---

### TC-ST-VIS03: Title highlight span uses a gradient/clipped fill
**Priority:** Medium
**Tags:** @Visual

**Test Steps:**
1. Inspect the highlighted `<span>` inside the active title.

**Expected Results:**
- Highlight uses a gradient / `background-clip: text` (transparent text fill) treatment.

---

### TC-ST-VIS04: Title typography is responsive across XL/LG/MD/SM
**Priority:** High
**Tags:** @Visual

**Test Steps:**
1. For each viewport (XL 1440x900, LG 1180x820, MD 834x1112, SM 390x844), measure the rendered title font-size and colour.
2. Compare against the per-viewport Figma values.

**Expected Results:**
- XL/LG/MD title `30px` (line-height `36px`); SM title `24px` (line-height `30px`); colour `rgba(16, 56, 79, 1)`.

**Known finding:** SM renders `30px` instead of the Figma `24px` (mobile title not scaled down) — flagged for a design/build fix.

---

## Test Execution Strategy

### Test Tags Usage
```bash
# Run the whole suite
npx cross-env TEST_ENV=qa npx playwright test tests/specs/scrollytellingComponent.spec.ts --project=chromium --reporter=list

# Run by category
npx playwright test tests/specs/scrollytellingComponent.spec.ts --grep "@Functional"
npx playwright test tests/specs/scrollytellingComponent.spec.ts --grep "@Accessibility"
npx playwright test tests/specs/scrollytellingComponent.spec.ts --grep "@Performance"
npx playwright test tests/specs/scrollytellingComponent.spec.ts --grep "@Visual"
```

### Viewport Testing Matrix
| Viewport | Width | Height | Device Type | Priority |
|----------|-------|--------|-------------|----------|
| XL | 1440px | 900px | Desktop Large | High |
| LG | 1180px | 820px | Desktop Standard | High |
| MD | 834px | 1112px | Tablet | Medium |
| SM | 390px | 844px | Mobile | High |

---

## Review Checklist

Before implementation, verify:
- [x] Front-end-only scope (no CMS authoring)
- [x] DOM inspection findings incorporated (data-qa attributes verified)
- [x] All interactions resolved via SmartLocator with ≥3 ordered fallbacks
- [x] Soft assertions used throughout
- [x] Proper test case IDs (TC-ST01-17, TC-ST-A11Y01-05, TC-ST-PERF01-03, TC-ST-VIS01-04)
- [x] Required tags present (@Functional, @Accessibility, @Performance, @Visual)
- [x] Figma specifications referenced
- [x] Motion-design cases (TC-ST04, TC-ST10) deferred to #3319

---

**Total Test Cases:** 29
**Coverage:** Functional (17), Accessibility (5), Performance (3), Visual (4)
**Ready for Implementation:** 
**Next Step:** Generate test automation scripts (done — `tests/specs/scrollytellingComponent.spec.ts`)
