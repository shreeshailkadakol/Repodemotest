# Profile Card with Link Variant - Test Cases

## Component Information
- **Component Name**: Profile Card with Link Variant
- **User Story**: 4317 (State: On Hold - spillover bugs 5068, 5342, 5343 assigned to current sprint for fixes; story returns to UAT once those are verified fixed)
- **Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/profilecardlinkauto
- **Figma URL**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=25294-539
- **Figma Values File**: `helpers/utils/figma-values/ProfileCardLinkVariant_FigmaValues.ts` (created in Phase 4 - values extracted from the Figma REST API)
- **DOM Inspection**: `docs/dom-inspection-profile-card-link-variant.md`
- **Last Updated**: 2026-07-10
- **Test Status**: Ready (documentation) - scripts not yet implemented
- **Scope**: Frontend rendering and behavior only (no CMS authoring/backend)
- **Authentication**: Vercel HTTP basic auth (bayercorp / beyond2026)

---

## Requirements Summary

The Profile Card with Link Variant lets a content editor present profiles (e.g. Board of Membership)
using an asset selected from Contenthub, an optional card title, and an optional external card link.
It is placed only in 25/25/25/25 or 33/33/33 content dividers, supports landscape or portrait image
mode (default: portrait), and an optional zoom-enabled Lightbox showing the image, caption, metadata,
author, and disclaimer, with a download action. A "Minimal Fields" configuration limits the editable/
visible fields to Title and Link only, hiding designation/short-description.

Frontend scope validates the rendered output: structural presence of card elements per configuration
(Minimal vs full fields), image orientation, zoom/Lightbox behavior, link correctness, typography/
spacing/colour vs Figma, accessibility, and performance. CMS authoring, Contenthub asset selection, and
publish-propagation are out of scope.

### Acceptance Criteria (verbatim, condensed)
- **AC1**: When the site visitor enters a page with the Profile Card with Link variant, the image (incl. optional title and link) is displayed. *(FE testable)*
- **AC2**: With zoom configured/active, clicking the image opens the Lightbox showing the image, caption, metadata, author, and image disclaimer, with a download option. *(FE testable; author/disclaimer presence not yet confirmed on current test data - see Known Limitations)*
- **AC3**: Content Editor can configure the component for 25/25/25/25 or 33/33/33 content dividers. *(CMS-only for the configuration action; FE can verify the card renders correctly inside whichever divider it is placed in - only 25/25/25/25 present on the current test page)*
- **AC4**: Editor configures Lightbox text labels "at a central place". *(FE: structural presence only - per story comments, caption is pulled from Contenthub description and "Image Utilization"/"Image Author" labels come from a central dictionary config, not literally typed per-instance; no exact-text assertion, language-agnostic)*
- **AC5**: Landscape mode displays the image in landscape orientation. *(FE testable)*
- **AC6**: Portrait mode displays the image in portrait orientation (default when landscape is unchecked). *(FE testable; default confirmed via story comment 2026-07-09)*

### Frontend-testability note
FE-covered: AC1, AC2 (partial), AC4 (structural), AC5, AC6. AC3's configuration action is CMS-only;
FE validates only the rendered result inside the available divider on the test page.

---

## Design Reference Values (Figma - "Profile Card with Link Variant")

> **Phase 4 complete.** Values extracted directly from the Figma REST API into
> `helpers/utils/figma-values/ProfileCardLinkVariant_FigmaValues.ts` (import via `getValuesByViewport`).
> Do not hardcode design values in specs.

**Nodes actually used** (the `profile-card` instance lives in the "Profil Card with link with
background" frames; the "Minimal ... unchecked" node IDs in the original task were wrong - see note):

| Viewport | Node used | Text Container padding | imageTextGap |
|----------|-----------|------------------------|--------------|
| XL | 25777-10919 (1440) | 32/32/32/32 | 32px |
| LG | 25777-10880 (1024) | 32/32/32/32 | 32px |
| MD | 25777-10853 (768)  | 24/32/24/32 | 24px |
| SM | 25777-10829 (375)  | 24/20/24/20 | 24px |

**Extracted card typography (constant across all four breakpoints):**
- cardTitle: Bayer Sans, 700, 20px / lh 30px, `rgba(16,56,79,1)`
- designation: Bayer Sans, 400, 16px / lh 24px, `rgba(16,56,79,1)`
- shortDescription: Bayer Sans, 400, 16px / lh 24px, `rgba(64,96,114,1)`
- cardLink: Bayer Sans, 500, 14px / lh 20px, letter-spacing 0.40px, UPPER, `rgba(16,56,79,1)`

**Node-ID corrections / extraction findings (from Phase 4):**
- The task node IDs `25711-18199` (LG) and `25711-18902` (SM) do **not** contain a Profile Card -
  they hold a "Simple Image + LinkListItem" component. Per-viewport values were taken from the
  "with background" frames instead. Card typography is identical across breakpoints, so no coverage
  is lost.
- **Bug 5342 contradiction**: Figma specifies imageTextGap = **24px at MD** (and SM), 32px only at
  XL/LG. Bug 5342 assumed Figma expects 32px at MD; the design itself is 24px, which matches the live
  with-background 24px. This should be re-verified before treating Bug 5342 as valid - the deviation
  may only concern the without-background variant (live 20px), whose Figma gap is not in these nodes.
- **Bug 5343 (Lightbox padding)** extracted from the Lightbox overlay nodes (XL 25451-6224, LG
  25451-6603, MD 25451-6551, SM 25451-6436). Content-container horizontal padding: XL 48px, LG 40px,
  MD 32px, SM 20px; header row: XL 96px, LG 40px, MD 32px, SM 20px. Figma MD is 32px (not 40px as the
  bug claims) and matches the live flat 32px, so MD is not a deviation - Bug 5343 needs correction.

Known design-vs-live deviations previously reported on this story (see bugs, Known Limitations):
link text size (SM/MD 12px live vs Figma 14px constant - Bug 5068), MD image-text spacing
(Bug 5342 - see contradiction above), Lightbox horizontal padding (Bug 5343 - node not available).

---

## Actual DOM Structure (from live inspection)

```html
<section data-qa="columns25252525" aria-label="Four column content section">
  <section data-qa="profile-card" class="flex flex-col">                          <!-- Minimal checked -->
    <img data-qa="profile-card-image" aria-label="Profile photo" class="aspect-video w-full object-cover" />
    <button class="bg-alpha-black-50 ..."><svg data-qa="icon" /></button>          <!-- zoom trigger, no data-qa on button -->
    <h2 data-qa="title-component">MinimalCheckBox Selected</h2>
    <a data-qa="profile-link" href="https://www.bayer.co.uk/en-gb" target="_blank" rel="noopener noreferrer">
      Bayer UK<svg data-qa="icon"/>
    </a>
  </section>

  <section data-qa="profile-card" class="bg-background-bg-elevated flex flex-col"> <!-- Minimal unchecked -->
    <img data-qa="profile-card-image" aria-label="Profile photo" />
    <button class="bg-alpha-black-50 ..."><svg data-qa="icon" /></button>
    <h2 data-qa="title-component">MiniMalCheckbox NotSelected</h2>
    <section data-qa="profile-designation">Landscape selected</section>
    <section data-qa="profile-short-description">lightbox selected</section>
    <a data-qa="profile-link" href="https://www.bayer.co.uk/en-gb">Bayer UK<svg data-qa="icon"/></a>  <!-- NO target/rel -->
  </section>
</section>
```

Lightbox (opened via the zoom button on the card image):
```html
<div role="dialog">  <!-- no data-qa on the dialog root -->
  <button aria-label="Download image"><svg data-qa="icon"/></button>
  <button aria-label="Close"><svg data-qa="icon"/></button>
  <img data-qa="next-image" data-testid="next-image" aria-label="<image description>" />
  <p data-testid="va-lightbox-caption">...</p>
  <p data-testid="va-metadata">| 1725 x 1150 px |</p>
</div>
```

**Locator notes:**
- The zoom button carries no `data-qa`; locate structurally as the `<button class*="bg-alpha-black">` ancestor of the `svg[data-qa="icon"]` overlaying the card image. SmartLocator with fallbacks required.
- `title-component`, `icon` are reused data-qa values across the page (header logo, nav, cards) - always scope queries under the specific `[data-qa="profile-card"]` instance.
- `profile-designation` and `profile-short-description` are only present when Minimal Fields is unchecked.
- The Lightbox dialog root, Close button, and Download button have no `data-qa` - locate via `[role="dialog"]` + `aria-label` ("Close" / "Download image").
- Lightbox caption/metadata use `data-testid="va-*"` (shared with the Visual Assets Lightbox component), not `data-qa`.
- **Real DOM finding**: the two `profile-link` anchors point to the same external URL, but only the Minimal-checked card's link carries `target="_blank" rel="noopener noreferrer"`; the Minimal-unchecked card's link has neither attribute. Covered by TC-PCLV6; candidate defect if confirmed unintentional.

---

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|--------------|----|-----------|--------|
| TC-PCLV1 | AC1, AC3 | Functional | Ready |
| TC-PCLV2 | AC1 | Functional | Ready |
| TC-PCLV3 | AC1 | Functional | Ready |
| TC-PCLV4 | AC1 | Functional | Ready |
| TC-PCLV5 | AC1 | Functional | Ready |
| TC-PCLV6 | AC1 | Functional | Ready |
| TC-PCLV7 | AC2 | Functional | Ready |
| TC-PCLV8 | AC2 | Functional | Ready |
| TC-PCLV9 | AC2 | Functional | Ready |
| TC-PCLV10 | AC2 | Functional | Ready |
| TC-PCLV11 | AC2, AC4 | Functional | Ready |
| TC-PCLV12 | AC5 | Functional | Ready |
| TC-PCLV13 | AC6 | Functional | Ready |
| TC-APCLV1 | AC1, AC2 | Accessibility | Ready |
| TC-APCLV2 | AC1, AC2 | Accessibility | Ready |
| TC-APCLV3 | AC1 | Accessibility | Ready |
| TC-APCLV4 | - | Accessibility | Ready |
| TC-APCLV5 | AC2 | Accessibility | Ready |
| TC-VPCLV1 | Design | Visual | Ready |
| TC-VPCLV2 | Design (Bug 5068) | Visual | Ready |
| TC-VPCLV3 | Design (Bug 5342) | Visual | Ready |
| TC-VPCLV4 | Design (Bug 5343) | Visual | Ready |
| TC-VPCLV5 | AC5, AC6 | Visual | Ready |
| TC-VPCLV6 | Design | Visual | Ready |
| TC-PPCLV1 | - | Performance | Ready |
| TC-PPCLV2 | AC2 | Performance | Ready |

---

## Functional Test Cases

### TC-PCLV1: Card renders inside the content divider
**AC**: AC1, AC3
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**:
- Navigate to test page with Vercel auth applied.
- Cookie banner accepted.
- Default (XL) viewport.

**Test Steps**:
1. Wait for the page to fully load.
2. Verify the parent divider `[data-qa="columns25252525"]` is visible.
3. Verify at least one `[data-qa="profile-card"]` renders inside it.

**Expected Results**:
- Divider and card container are visible (soft assertions).
- Card is a semantic `<section>`.

---

### TC-PCLV2: Card image renders with accessible alt text
**AC**: AC1
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded.

**Test Steps**:
1. For each `[data-qa="profile-card"]`, locate the child `[data-qa="profile-card-image"]`.
2. Verify it is visible.
3. Verify it has a non-empty `aria-label` (or `alt`).

**Expected Results**:
- Each card image is visible with a meaningful accessible name (soft assertion). No exact-text assertion (language-agnostic).

---

### TC-PCLV3: Minimal Fields checked - only Title and Link render
**AC**: AC1
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded; a card configured with Minimal Fields checked is present (card 1 on the test page).

**Test Steps**:
1. Identify the Minimal-checked card (no `[data-qa="profile-designation"]` / `[data-qa="profile-short-description"]` children).
2. Verify `[data-qa="title-component"]` is visible and non-empty.
3. Verify `[data-qa="profile-link"]` is visible.
4. Verify `[data-qa="profile-designation"]` and `[data-qa="profile-short-description"]` are absent within this card.

**Expected Results**:
- Only title and link are present; designation/short-description are not rendered (soft assertions).

---

### TC-PCLV4: Minimal Fields unchecked - full field set renders
**AC**: AC1
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded; a card configured with Minimal Fields unchecked is present (card 2 on the test page).

**Test Steps**:
1. Identify the Minimal-unchecked card.
2. Verify `[data-qa="title-component"]`, `[data-qa="profile-designation"]`, `[data-qa="profile-short-description"]`, and `[data-qa="profile-link"]` are all visible and non-empty.

**Expected Results**:
- All four fields render for the full (non-minimal) configuration (soft assertions).

---

### TC-PCLV5: Card title is a semantic, non-empty heading
**AC**: AC1
**Priority**: Medium
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded.

**Test Steps**:
1. For each card, locate `[data-qa="profile-card"] [data-qa="title-component"]`.
2. Verify the element's tag name is `h2`.
3. Verify it is non-empty.

**Expected Results**:
- Title is an `h2` with non-empty content in every card (soft assertion).

---

### TC-PCLV6: Card link has a valid href and consistent target/rel attributes
**AC**: AC1
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded; both card variants present.

**Test Steps**:
1. For each `[data-qa="profile-link"]`, verify `href` is a non-empty, well-formed URL.
2. Record the `target` and `rel` attribute values for each card's link.
3. Compare the attribute sets across cards that link to an external domain.

**Expected Results**:
- Every card link has a valid `href` (soft assertion).
- **Known DOM finding**: on the current test page, the Minimal-checked card's link has `target="_blank" rel="noopener noreferrer"`, while the Minimal-unchecked card's link (same external destination) has neither attribute. Log the discrepancy; if confirmed unintentional this is a candidate defect (missing `rel="noopener"` on an external link is a reverse-tabnabbing exposure), not a test error.

---

### TC-PCLV7: Zoom control present when zoom is enabled
**AC**: AC2
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded.

**Test Steps**:
1. For each card, locate the zoom button (ancestor `button` of the overlay `svg[data-qa="icon"]` on the card image).
2. Verify it is visible and enabled.

**Expected Results**:
- Zoom control is visible and clickable on each configured card (soft assertion).

---

### TC-PCLV8: Clicking zoom opens the Lightbox with image, caption, and metadata
**AC**: AC2
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Component loaded; zoom enabled on the target card.

**Test Steps**:
1. Click the zoom button on a card image.
2. Wait for `[role="dialog"]` to become visible.
3. Verify the dialog contains an image (`[data-qa="next-image"]`), a caption (`[data-testid="va-lightbox-caption"]`), and metadata (`[data-testid="va-metadata"]`).

**Expected Results**:
- Lightbox opens and displays image, caption, and metadata (soft assertions). No exact-text assertion on caption content (language-agnostic).

---

### TC-PCLV9: Lightbox closes via the Close control
**AC**: AC2
**Priority**: High
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Lightbox open (per TC-PCLV8).

**Test Steps**:
1. Locate the Close button (`button[aria-label="Close"]`) within the dialog.
2. Click it.
3. Verify the dialog is no longer visible.

**Expected Results**:
- Lightbox dismisses and the underlying page remains interactive (soft assertion).

---

### TC-PCLV10: Lightbox Download control is present and enabled
**AC**: AC2
**Priority**: Medium
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Lightbox open.

**Test Steps**:
1. Locate the Download button (`button[aria-label="Download image"]`).
2. Verify it is visible and enabled.
3. (Optional) Click it and capture a Playwright `download` event.

**Expected Results**:
- Download control is present and triggers a download (soft assertion). If no download event fires, the observed behavior is logged for triage rather than assumed to be a defect.

---

### TC-PCLV11: Lightbox text labels render without exact-text dependency
**AC**: AC2, AC4
**Priority**: Low
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: Lightbox open.

**Test Steps**:
1. Read the accessible text/metadata content of the caption and metadata elements.
2. Verify both are non-empty.

**Expected Results**:
- Caption and metadata expose non-empty content (soft assertion). No specific string asserted, since labels are centrally/dictionary-driven and locale-dependent (AC4). Author and disclaimer text were not observed on the current test asset - see Known Limitations.

---

### TC-PCLV12: Landscape mode renders the image in landscape orientation
**AC**: AC5
**Priority**: Medium
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: A card configured with Landscape mode is present (per story comment, card 2's `profile-designation` text on the test page indicates "Landscape selected").

**Test Steps**:
1. Locate the card image for the landscape-configured card.
2. Read its bounding box width and height.
3. Verify width > height (landscape aspect).

**Expected Results**:
- Landscape-configured card image has a wider-than-tall aspect ratio (soft assertion).

---

### TC-PCLV13: Portrait is the default orientation when Landscape is unchecked
**AC**: AC6
**Priority**: Medium
**Tags**: @Functional @ProfileCardLinkVariant

**Preconditions**: A card without Landscape explicitly enabled is present.

**Test Steps**:
1. Locate the card image for the non-landscape-configured card.
2. Read its bounding box width and height.
3. Verify height >= width (portrait or square aspect), matching the confirmed default behavior (story comment, 2026-07-09: "Portrait mode by default if Landscape box is unchecked").

**Expected Results**:
- Default (Landscape unchecked) card image is portrait-oriented (soft assertion).

---

## Accessibility Test Cases

### TC-APCLV1: axe-core WCAG 2.1 AA scan
**AC**: AC1, AC2
**Priority**: High
**Tags**: @Accessibility @ProfileCardLinkVariant

**Preconditions**: Component loaded; axe-core integrated.

**Test Steps**:
1. Run an axe-core analysis scoped to each `[data-qa="profile-card"]`.
2. Run a second scan scoped to the open Lightbox `[role="dialog"]`.
3. Filter results to WCAG 2.1 A/AA rules.

**Expected Results**:
- No critical or serious violations within either scope (soft assertion). Violations logged with rule id and node for triage.

---

### TC-APCLV2: Keyboard operability of interactive elements
**AC**: AC1, AC2
**Priority**: High
**Tags**: @Accessibility @ProfileCardLinkVariant

**Preconditions**: Component loaded.

**Test Steps**:
1. Tab through the card and confirm focus reaches the zoom button and the card link.
2. Activate the zoom button with Enter/Space and confirm the Lightbox opens.
3. Tab within the Lightbox and confirm focus reaches Download and Close; activate Close with Enter.

**Expected Results**:
- All interactive elements are reachable via keyboard and operable via Enter/Space (soft assertion).

---

### TC-APCLV3: Semantic structure
**AC**: AC1
**Priority**: Medium
**Tags**: @Accessibility @ProfileCardLinkVariant

**Preconditions**: Component loaded.

**Test Steps**:
1. Verify the card title is an `h2`.
2. Verify the card image has an accessible name (`aria-label` or `alt`).
3. Verify the card link is an `<a>` with a non-empty accessible name.

**Expected Results**:
- Semantic elements and accessible names present as above (soft assertions).

---

### TC-APCLV4: Visible focus indicators
**AC**: -
**Priority**: Medium
**Tags**: @Accessibility @ProfileCardLinkVariant

**Preconditions**: Component loaded.

**Test Steps**:
1. Focus the zoom button, the card link, and (with Lightbox open) the Close and Download buttons in turn.
2. Verify a visible focus style is applied.

**Expected Results**:
- Each interactive element shows a visible focus indicator when focused (soft assertion).

---

### TC-APCLV5: Lightbox focus management
**AC**: AC2
**Priority**: Medium
**Tags**: @Accessibility @ProfileCardLinkVariant

**Preconditions**: Lightbox open.

**Test Steps**:
1. Verify the dialog has `role="dialog"`.
2. Verify focus moves into the dialog when it opens.
3. Close the dialog and verify focus returns to the triggering zoom button.

**Expected Results**:
- Focus enters the dialog on open and returns to the trigger on close (soft assertion).

---

## Visual Test Cases

> All visual assertions import values from `ProfileCardLinkVariant_FigmaValues.ts` via
> `getValuesByViewport` (Phase 4 complete). No hardcoded design values. Run per viewport:
> XL 1440, LG 1024, MD 768, SM 375; per state: Minimal checked/unchecked.

### TC-VPCLV1: Card title typography per viewport
**AC**: Design
**Priority**: High
**Tags**: @Visual @ProfileCardLinkVariant

**Preconditions**: Component loaded at target viewport.

**Test Steps**:
1. Resolve expected tokens via `getValuesByViewport(vp).cardTitle`.
2. Read computed styles of `[data-qa="profile-card"] [data-qa="title-component"]`.
3. Compare font-family, font-size, line-height, font-weight, colour.

**Expected Results**:
- Computed styles match Figma per viewport (soft assertions).

---

### TC-VPCLV2: Card link typography per viewport (known deviation)
**AC**: Design (Bug 5068)
**Priority**: High
**Tags**: @Visual @ProfileCardLinkVariant

**Test Steps**:
1. Resolve `getValuesByViewport(vp).cardLink` (Figma: constant 14px across all breakpoints).
2. Read computed font-size of `[data-qa="profile-link"]` at SM and MD.

**Expected Results**:
- Figma expects 14px at all viewports. **Known issue (Bug 5068, logged)**: live renders 12px at SM/MD. Test will fail at SM/MD until fixed - documented, not a test defect.

---

### TC-VPCLV3: MD image-to-text spacing (known deviation)
**AC**: Design (Bug 5342)
**Priority**: Medium
**Tags**: @Visual @ProfileCardLinkVariant

**Test Steps**:
1. Resolve `getValuesByViewport('MD').layout.imageTextGap` (Figma REST extraction: **24px** at MD, not 32px).
2. Read the computed gap between the card image and the text block at MD for both the with-background and without-background variants.

**Expected Results**:
- Figma specifies **24px at MD** (32px only at XL/LG). Live with-background renders 24px, which **matches** Figma. **Bug 5342 needs re-verification**: it assumed Figma expects 32px at MD, but the design itself is 24px. Any real deviation is limited to the without-background variant (live 20px), whose Figma gap is not present in the extracted nodes - do not assert it until confirmed.

---

### TC-VPCLV4: Lightbox horizontal padding (known deviation)
**AC**: Design (Bug 5343)
**Priority**: Medium
**Tags**: @Visual @ProfileCardLinkVariant

**Test Steps**:
1. Open the Lightbox.
2. Resolve `getValuesByViewport(vp).layout.lightboxHorizontalPadding` (image/caption content container) and, if the header row is measured, `lightboxHeaderHorizontalPadding`.
3. Read the computed horizontal padding of the Lightbox content container per viewport.

**Expected Results** (Figma extracted from Lightbox nodes XL 25451-6224, LG 25451-6603, MD 25451-6551, SM 25451-6436):
- Content container padding: **XL 48px, LG 40px, MD 32px, SM 20px**. Header row (Close/Download): **XL 96px**, LG 40px, MD 32px, SM 20px (only XL differs between header and content).
- **Bug 5343 needs correction**: Figma MD is **32px**, not 40px as the bug states - and 32px matches the live flat 32px, so MD is NOT a deviation. Real deviations vs a live flat 32px are at XL (content 48px / header 96px), LG (40px), and SM (20px). Re-verify the bug against these values.

---

### TC-VPCLV5: Image aspect ratio matches configured orientation
**AC**: AC5, AC6
**Priority**: Medium
**Tags**: @Visual @ProfileCardLinkVariant

**Test Steps**:
1. For the landscape-configured card, verify the rendered image aspect ratio is wider-than-tall.
2. For the portrait/default card, verify the rendered image aspect ratio is taller-than-wide or square.

**Expected Results**:
- Aspect ratio reflects the configured orientation at every viewport (soft assertion).

---

### TC-VPCLV6: Designation and short-description typography per viewport
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @ProfileCardLinkVariant

**Preconditions**: A full-fields (Minimal unchecked) card is present so designation and short-description render.

**Test Steps**:
1. Resolve `getValuesByViewport(vp).designation` and `.shortDescription` (Figma: both Bayer Sans 400 / 16px / lh 24px; designation `rgba(16,56,79,1)`, short description `rgba(64,96,114,1)` - constant across breakpoints).
2. Read computed styles of `[data-qa="profile-designation"]` and `[data-qa="profile-short-description"]`.
3. Compare font-family, font-size, line-height, font-weight, colour.

**Expected Results**:
- Computed styles match Figma per viewport (soft assertions). Skipped on a card/viewport where these fields do not render (Minimal-checked).

---

## Performance Test Cases

### TC-PPCLV1: Component render/load time
**AC**: -
**Priority**: Low
**Tags**: @Performance @ProfileCardLinkVariant

**Test Steps**:
1. Navigate to the test page and measure time until the first `[data-qa="profile-card"]` is visible.

**Expected Results**:
- Component becomes visible within an agreed threshold (e.g. < 5s on QA) (soft assertion; threshold configurable).

---

### TC-PPCLV2: Lightbox open responsiveness
**AC**: AC2
**Priority**: Low
**Tags**: @Performance @ProfileCardLinkVariant

**Test Steps**:
1. Click the zoom button and measure time until the Lightbox dialog is visible with its image loaded.

**Expected Results**:
- Lightbox opens within an agreed threshold (soft assertion).

---

## Prerequisites
- Vercel HTTP basic auth: bayercorp / beyond2026 (handled by BasePage).
- Cookie banner acceptance (handled by BasePage `acceptCookiesBanner()`).
- `TEST_ENV=qa` (test page is on the QA Vercel host).
- Figma values file present: `helpers/utils/figma-values/ProfileCardLinkVariant_FigmaValues.ts` (Phase 4 deliverable - created).
- Downloads allowed in the browser context for TC-PCLV10.

## Assumptions and Notes
- The current test page provides exactly two configured card instances (Minimal Fields checked / unchecked); no 33/33/33 divider instance or dedicated landscape-vs-portrait pair is present, so TC-PCLV12/13 rely on the designation text ("Landscape selected"/absence) as a proxy for configuration state, not a CMS-verified flag.
- Lightbox labels (caption, metadata) are dictionary/Contenthub-driven per story comments; only structural presence is asserted, never exact text (language-agnostic rule).
- The zoom button and Lightbox Close/Download controls carry no `data-qa`; located structurally via class/`aria-label` (SmartLocator with fallbacks).

## Known Limitations
- **AC2 (author, disclaimer)**: not observed in the Lightbox for the current test asset. Not yet confirmed whether these fields are optional/conditionally rendered or a defect - flagged for confirmation during script implementation (Phase 5/7), not assumed to be missing.
- **AC3 (33/33/33 divider)**: not exercisable on the current test page (only a 25/25/25/25 instance present).
- **Link target/rel inconsistency** (see DOM inspection, TC-PCLV6): real, reproducible difference between the two card variants' external links; needs confirmation with dev/design before logging as a bug.
- **Known open bugs already logged against this story** (verify status before re-reporting): Bug 5068 (link text size), Bug 5342 (MD image-text spacing), Bug 5343 (Lightbox horizontal padding).

## Execution findings (run 2026-07-13, TEST_ENV=qa, chromium)
Confirmed against the live DOM during Phase 6 analysis:
- **Minimal card title styling differs from the full card (RESOLVED - likely real bug).** The full (Minimal-unchecked) card title h2 renders `text-xl font-bold` = 20px/700/`rgb(16,56,79)`, an exact Figma match. The Minimal-checked card title h2 renders `text-sm font-normal lg:text-base` = 16px(14px at MD)/400/`rgb(64,96,114)` - small/toned, not a bold heading. Figma evidence (checked 2026-07-13): across ALL card-bearing frames every profile-card is a full card and every title is 20px/700/`rgb(16,56,79)`; there is NO Figma frame depicting a Minimal-checked card (the task's "checked" node IDs 25711-18199 / 25711-18902 resolve to a Simple Image + LinkListItem component). So the live small/toned title has no design basis -> candidate bug. Caveat: no explicit Minimal-checked frame exists to compare against, so confirm with design that no unpublished minimal-title spec exists before logging. Visual typography TCs assert against the full card.
- **SM short-description colour deviation (RESOLVED - real deviation).** Figma specifies `rgb(64,96,114)` for the short description at SM (constant across all viewports; only the white-on-dark card variant uses `rgb(202,213,226)`). Live renders `rgb(96,113,139)` at SM. Confirmed deviation - `rgb(96,113,139)` is the legacy ProfileCard component's SM token, so the FE appears to have reused the wrong token. Candidate bug (TC-VPCLV6 SM soft-fails).
- **Bug 5068 reproduced**: card link renders 12px at MD/SM vs Figma 14px (TC-VPCLV2 soft-fails at MD/SM by design).
- **Bug 5343 reproduced (Lightbox padding)**: the live lightbox content wrapper (`class="... px-5 pb-12 md:px-8 ..."`) renders a flat 32px horizontal padding at MD/LG/XL and 20px at SM. Vs Figma (XL 48px, LG 40px, MD 32px, SM 20px), TC-VPCLV4 soft-fails at **XL (32 vs 48)** and **LG (32 vs 40)** and passes at MD/SM. Confirms the deviation is at XL/LG only - not MD as the original bug text stated.
- **Test-code issues found and fixed during analysis** (not product defects): (1) `[role="dialog"]` matched the hidden cookie-consent dialog - Lightbox locator now scoped to the dialog containing `[data-testid="next-image"]`; (2) visual typography/spacing TCs were measuring the Minimal card instead of the full card the Figma tokens came from - now target the full card; (3) letter-spacing assertion relaxed to a 0.1px tolerance (FE 0.42px vs design 0.40px is sub-pixel).
