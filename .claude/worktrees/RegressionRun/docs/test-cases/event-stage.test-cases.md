# Test Cases - Event Stage Component

**Component**: Event Stage
**User Story**: 3802 - Event Stage
**Test Page**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qamanual/bayerevent/bayerevents/corpevent
**Status**: Implemented
**Last Updated**: 2026-06-11

---

## Test Configuration

**Test Environment**: QA
**Viewport Sizes**:
- XL: 1440px x 900px
- LG: 1024px x 800px
- MD: 768px x 1024px
- SM: 375px x 667px

**Figma Design Reference**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover

**Test File**: `tests/specs/eventStageAndDetails.spec.ts`
**Component File**: `components/eventStage.ts`
**Figma Tokens**: `helpers/utils/figma-values/EventStage_FigmaValues.ts`

---

## Test Case Summary

| Category | Test Count | Tags |
|----------|-----------|------|
| Functional Tests | 7 | @Functional |
| Accessibility Tests | 5 | @Accessibility |
| Performance Tests | 2 | @Performance |
| Visual Tests (4 elements x 4 viewports) | 16 | @Visual |
| **Total** | **30** | |

---

## Traceability Matrix

| Test Case | AC | Category | Description | Status |
|-----------|----|----------|-------------|--------|
| TC-ES-F001 | AC2 | Functional | Component container renders with correct attributes | Implemented |
| TC-ES-F002 | AC2 | Functional | Start Date block is present | Implemented |
| TC-ES-F003 | AC2 | Functional | Event Title renders as `<h1>` | Implemented |
| TC-ES-F004 | AC2 | Functional | Tag list contains at least one tag | Implemented |
| TC-ES-F005 | AC2 | Functional | Each tag has non-empty text | Implemented |
| TC-ES-F006 | AC2 | Functional | Event image renders with alt + src | Implemented |
| TC-ES-F007 | AC2 | Functional | Stage is positioned at top of main content | Implemented |
| TC-ES-A001 | AC2 | Accessibility | axe-core subtree scan (no critical/serious) | Implemented |
| TC-ES-A002 | AC2 | Accessibility | Title element is an `<h1>` | Implemented |
| TC-ES-A003 | AC2 | Accessibility | Image has non-empty `alt` | Implemented |
| TC-ES-A004 | AC2 | Accessibility | `aria-labelledby` references the title id | Implemented |
| TC-ES-A005 | AC2 | Accessibility | Tag list uses `<ul>`/`<li>` semantics | Implemented |
| TC-ES-P001 | AC2 | Performance | Stage becomes visible within threshold | Implemented |
| TC-ES-P002 | AC2 | Performance | Hero image is fully loaded | Implemented |
| TC-ES-V001 | AC2 | Visual | Title typography matches Figma (XL/LG/MD/SM) | Implemented |
| TC-ES-V002 | AC2 | Visual | Date typography matches Figma (XL/LG/MD/SM) | Implemented |
| TC-ES-V003 | AC2 | Visual | First tag typography matches Figma (XL/LG/MD/SM) | Implemented |
| TC-ES-V004 | AC2 | Visual | Image renders with positive dimensions (XL/LG/MD/SM) | Implemented |

---

## AC Coverage Summary

| Acceptance Criteria | FE Relevant? | Test Coverage |
|--------------------|-------------|---------------|
| AC1 (CMS pagebuilder add) | No - CMS only | Excluded |
| AC2 (FE renders Date, Title, Tags, Image at top of Event Page) | Yes - FE rendering | TC-ES-F001 to TC-ES-V004 |
| AC3 (CMS validation rules) | No - CMS only | Excluded |
| AC4 (CMS pagebuilder constraints) | No - CMS only | Excluded |

---

## DOM Structure (Verified)

```html
<section data-qa="event-stage" data-testid="event-stage"
         aria-labelledby="event-stage-title">
  <div data-qa="event-stage-date">
    <svg data-qa="icon"></svg>
    <time>2026-05-06</time>
  </div>
  <h1  data-qa="event-stage-title">BayerSports</h1>
  <ul  data-qa="event-stage-tags" aria-label="Event classification tags">
    <li data-qa="event-stage-tag"><span>Advances in Agriculture</span></li>
    <li data-qa="event-stage-tag"><span>Business and Finance</span></li>
  </ul>
  <div data-qa="event-stage-image">
    <img data-qa="next-image" alt="Zuri Health Photo" src="...">
  </div>
</section>
```

---

## 1. Functional Tests (@Functional)

### TC-ES-F001: Verify Component Container Renders
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional @Smoke
**Spec ID**: `ES-FUNC-001`
**Prerequisites**: Navigate to Event Stage test page with HTTP Basic auth + cookie acceptance

**Test Steps**:
1. Navigate to the Event Stage test page
2. Resolve the root section via SmartLocator
3. Verify the container is visible
4. Verify identifying attributes are present

**Expected Results**:
- Container `section[data-qa="event-stage"]` is visible
- Container has attribute `data-qa="event-stage"`
- Container has attribute `aria-labelledby="event-stage-title"`

**Soft Assertions**:
```typescript
await expect.soft(container).toBeVisible();
await expect.soft(container).toHaveAttribute('data-qa', 'event-stage');
await expect.soft(container).toHaveAttribute('aria-labelledby', 'event-stage-title');
```

---

### TC-ES-F002: Verify Start Date Block is Present
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional
**Spec ID**: `ES-FUNC-002`
**Prerequisites**: Component is visible

**Test Steps**:
1. Resolve `[data-qa="event-stage-date"]`
2. Resolve the inner `<time>` element (scoped, no data-qa on `<time>`)
3. Verify both are visible
4. Verify `<time>` text content is non-empty

**Expected Results**:
- Date block wrapper is visible
- `<time>` element is visible
- `<time>` text content has length > 0

---

### TC-ES-F003: Verify Event Title Renders as `<h1>`
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional
**Spec ID**: `ES-FUNC-003`
**Prerequisites**: Component is visible

**Test Steps**:
1. Resolve `[data-qa="event-stage-title"]`
2. Verify visibility and non-empty text
3. Verify the underlying element is `<h1>`

**Expected Results**:
- Title element is visible and non-empty
- `tagName.toLowerCase() === 'h1'`

---

### TC-ES-F004: Verify Tag List Contains At Least One Tag
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional
**Spec ID**: `ES-FUNC-004`
**Prerequisites**: Component is visible

**Test Steps**:
1. Resolve `ul[data-qa="event-stage-tags"]`
2. Verify the wrapper is a `<ul>` element and visible
3. Resolve all `<li data-qa="event-stage-tag">` items
4. Verify count >= 1

**Expected Results**:
- Tags wrapper is visible
- Tags wrapper is a `<ul>` element
- At least 1 `<li>` tag item is rendered

---

### TC-ES-F005: Verify Each Tag Has Non-Empty Text
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional
**Spec ID**: `ES-FUNC-005`
**Prerequisites**: At least one tag is rendered

**Test Steps**:
1. Resolve all `<li>` tag items
2. For each item, read `textContent.trim()`
3. Verify length > 0

**Expected Results**:
- No empty tag chips are rendered

---

### TC-ES-F006: Verify Event Image Renders With `alt` and `src`
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional
**Spec ID**: `ES-FUNC-006`
**Prerequisites**: Component is visible

**Test Steps**:
1. Resolve `[data-qa="event-stage-image"]` wrapper and verify visible
2. Resolve inner `<img>` (scoped, NOT by reused `data-qa="next-image"`)
3. Read `alt` and `src` attributes
4. Verify both are non-empty

**Expected Results**:
- Image wrapper is visible
- `<img>` element has non-empty `alt` attribute
- `<img>` element has non-empty `src` attribute

---

### TC-ES-F007: Verify Stage Is Positioned at Top of Main Content
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Functional
**Spec ID**: `ES-FUNC-007`
**Prerequisites**: Component is visible

**Test Steps**:
1. Read container `boundingBox()`
2. Read viewport `height`
3. Verify `boundingBox.y < (viewport.height * 1.5)`

**Expected Results**:
- Event Stage hero sits within the first 1.5 viewport heights from the top

---

## 2. Accessibility Tests (@Accessibility)

### TC-ES-A001: Verify axe-core Subtree Scan Has No Critical/Serious Violations
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Accessibility
**Spec ID**: `ES-A11Y-001`
**Prerequisites**: Component is visible

**Test Steps**:
1. Run `AxeBuilder` with `.include('section[data-qa="event-stage"]')`
2. Apply `wcag2a` + `wcag2aa` tag filter
3. Filter resulting violations to `impact in {critical, serious}`
4. Verify the filtered list is empty

**Expected Results**:
- Zero critical/serious WCAG 2.0 A/AA violations inside Event Stage subtree

---

### TC-ES-A002: Verify Title Element is `<h1>`
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Accessibility
**Spec ID**: `ES-A11Y-002`
**Prerequisites**: Title is visible

**Test Steps**:
1. Resolve the title element
2. Read `tagName.toLowerCase()`
3. Verify it equals `'h1'`

**Expected Results**:
- Title is rendered as `<h1>` (single page-level heading)

---

### TC-ES-A003: Verify Image Has Non-Empty `alt`
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Accessibility
**Spec ID**: `ES-A11Y-003`
**Prerequisites**: Image is visible

**Test Steps**:
1. Resolve `<img>`
2. Read `alt` attribute
3. Verify `alt.trim().length > 0`

**Expected Results**:
- Hero image has a non-empty `alt` attribute (not decorative `alt=""`)

---

### TC-ES-A004: Verify `aria-labelledby` References the Title Id
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Accessibility
**Spec ID**: `ES-A11Y-004`
**Prerequisites**: Container is visible

**Test Steps**:
1. Read container `aria-labelledby` attribute value
2. In the page evaluate, confirm `document.getElementById(value)` OR `[data-qa="<value>"]` exists

**Expected Results**:
- The referenced element exists so the landmark has an accessible name

---

### TC-ES-A005: Verify Tag List Uses `<ul>`/`<li>` Semantics
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Accessibility
**Spec ID**: `ES-A11Y-005`
**Prerequisites**: Tags list is visible

**Test Steps**:
1. Verify tags wrapper element is `<ul>`
2. For every tag item, verify it is `<li>`

**Expected Results**:
- Screen readers announce the chips as a list with item count

---

## 3. Performance Tests (@Performance)

### TC-ES-P001: Verify Stage Becomes Visible Within Threshold
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Performance
**Spec ID**: `ES-PERF-001`
**Prerequisites**: Fresh browser context

**Test Steps**:
1. Record `Date.now()` before navigation
2. Run `navigateToPage()` (auth + cookie + wait)
3. Wait for container to be visible
4. Verify elapsed < `TEST_CONFIG.performanceThresholds.loadTime * 10`

**Expected Results**:
- Hero becomes visible within the configured budget (multiplier accounts for HTTP Basic auth + cookie acceptance overhead)

---

### TC-ES-P002: Verify Hero Image Is Fully Loaded
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Performance
**Spec ID**: `ES-PERF-002`
**Prerequisites**: Image element is visible

**Test Steps**:
1. Resolve `<img>` and wait for visibility
2. Read `complete` and `naturalWidth` from the `HTMLImageElement`
3. Verify `complete === true` and `naturalWidth > 0`

**Expected Results**:
- Hero image finished decoding (no broken/lazy placeholder)

---

## 4. Visual Tests (@Visual)

> Every visual test runs at all four viewports: XL (1440x900), LG (1024x800), MD (768x1024), SM (375x667). Computed CSS is compared against tokens auto-extracted from Figma into `EventStage_FigmaValues.ts`. Colour comparisons are normalised so `rgb(R,G,B)` and `rgba(R,G,B,1)` count as equal.

### TC-ES-V001: Verify Title Typography Matches Figma (per viewport)
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ES-VIS-XL-001`, `ES-VIS-LG-001`, `ES-VIS-MD-001`, `ES-VIS-SM-001`
**Prerequisites**: Title is visible

**Test Steps**:
1. Set viewport size from `EventStage_FigmaValues[vp].viewport`
2. Re-navigate so responsive layout applies
3. Read `font-family`, `font-size`, `font-weight`, `color`, `line-height` from the `<h1>` title element
4. Compare each against the matching Figma token (when token is present)

**Expected Results**:
- Title typography matches design at the active viewport

---

### TC-ES-V002: Verify Date Typography Matches Figma (per viewport)
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ES-VIS-XL-002`, `ES-VIS-LG-002`, `ES-VIS-MD-002`, `ES-VIS-SM-002`
**Prerequisites**: `<time>` element is visible

**Test Steps**:
1. Set viewport from Figma values
2. Re-navigate
3. Read computed styles from the inner `<time>` element (NOT the wrapper div, which only carries layout)
4. Compare `font-family`, `font-size`, `font-weight`, `color`, `line-height` against Figma

**Expected Results**:
- Date label typography matches design at the active viewport

---

### TC-ES-V003: Verify First Tag Typography Matches Figma (per viewport)
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ES-VIS-XL-003`, `ES-VIS-LG-003`, `ES-VIS-MD-003`, `ES-VIS-SM-003`
**Prerequisites**: At least one tag is visible

**Test Steps**:
1. Set viewport from Figma values
2. Re-navigate
3. Resolve the inner `<span>` of the first `<li>` (chip text)
4. Compare `font-family`, `font-size`, `font-weight`, `color`, `line-height` against Figma

**Expected Results**:
- Tag chip text style matches design at the active viewport

**Known Observation**: SmartLocator surfaces an informational WARN for this element because the styled `<span>` has no `data-qa`. A future FE ticket could add `data-qa="event-stage-tag-text"` to silence this warning.

---

### TC-ES-V004: Verify Image Renders With Positive Intrinsic Dimensions (per viewport)
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventStage @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ES-VIS-XL-004`, `ES-VIS-LG-004`, `ES-VIS-MD-004`, `ES-VIS-SM-004`
**Prerequisites**: Image element is visible

**Test Steps**:
1. Set viewport from Figma values
2. Re-navigate
3. From the `<img>` read `naturalWidth`, `naturalHeight`, plus `getBoundingClientRect()` width/height
4. Verify all four are `> 0`

**Expected Results**:
- Image paints at usable dimensions on every viewport

---

## Test Execution

```powershell
# Full Event Stage suite
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventStage"

# By category
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventStage.*@Functional"
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventStage.*@Accessibility"
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventStage.*@Performance"
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventStage.*@Visual"

# Single viewport
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventStage.*@VP-XL"
```

---

## Test Framework Rules Honoured

- All primary element resolution goes through SmartLocator (`findSmart`)
- Every element has at least 3 fallback strategies + a meaningful `description`
- All child locators are scoped under `section[data-qa="event-stage"]`
- Only `expect.soft(...)` assertions are used (no hard `expect(...)` failures)
- Allure context is applied per test via `applyAllurePageContext('EventStage')`
- Tags follow the framework standard: `@EventStage` + category + `@VP-XX` for visual
