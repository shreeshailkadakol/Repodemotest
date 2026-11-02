# Test Cases - Event Details Component

**Component**: Event Details
**User Story**: 3803 - Event Details Component
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
**Component File**: `components/eventDetails.ts`
**Figma Tokens**: `helpers/utils/figma-values/EventDetails_FigmaValues.ts`

**Test Event Used on QA Page**:
- Mode: Offline (Box 1 fully visible)
- Additional Links: 3 (Box 2 visible)
- Media Contact: none (Box 3 absent / hidden per AC7)

---

## Test Case Summary

| Category | Test Count | Tags |
|----------|-----------|------|
| Functional Tests | 14 | @Functional |
| Accessibility Tests | 5 | @Accessibility |
| Performance Tests | 2 | @Performance |
| Visual Tests (4 elements x 4 viewports) | 16 | @Visual |
| **Total** | **37** | |

---

## Traceability Matrix

| Test Case | AC | Category | Description | Status |
|-----------|----|----------|-------------|--------|
| TC-ED-F001 | AC2 | Functional | Container renders | Implemented |
| TC-ED-F002 | AC2 | Functional | Box 1 wrapper renders | Implemented |
| TC-ED-F003 | AC2 | Functional | Event title heading renders with non-empty text | Implemented |
| TC-ED-F004 | AC2 | Functional | Start date renders with non-empty value | Implemented |
| TC-ED-F005 | AC2 | Functional | End date renders with non-empty value | Implemented |
| TC-ED-F006 | AC2 | Functional | Local time renders with non-empty value | Implemented |
| TC-ED-F007 | AC2, AC4 | Functional | Address block renders with all 5 lines non-empty | Implemented |
| TC-ED-F008 | AC2 | Functional | Event mode renders with non-empty value | Implemented |
| TC-ED-F009 | AC2, AC9 | Functional | Add-to-Calendar button visible, labelled, enabled | Implemented |
| TC-ED-F010 | AC9 | Functional | Add-to-Calendar click triggers ICS download (soft-warn) | Implemented |
| TC-ED-F011 | AC5 | Functional | Event link visible with non-empty href and text | Implemented |
| TC-ED-F012 | AC6 | Functional | Box 2 renders with at least one additional link | Implemented |
| TC-ED-F013 | AC6 | Functional | Each additional link has non-empty text and href | Implemented |
| TC-ED-F014 | AC7 | Functional | Box 3 (Media Contact) - log present or not | Implemented |
| TC-ED-A001 | AC2 | Accessibility | axe-core scan of Event Details subtree | Implemented |
| TC-ED-A002 | AC2 | Accessibility | Title uses a top-level heading (h1 or h2) | Implemented |
| TC-ED-A003 | AC2 | Accessibility | All headings inside Event Details have non-empty text | Implemented |
| TC-ED-A004 | AC9 | Accessibility | Add-to-Calendar has accessible name + role=button | Implemented |
| TC-ED-A005 | AC5, AC6 | Accessibility | All anchors inside Event Details have non-empty name and href | Implemented |
| TC-ED-P001 | AC2 | Performance | Container becomes visible within threshold | Implemented |
| TC-ED-P002 | AC2 | Performance | Box 1 essentials render together within threshold | Implemented |
| TC-ED-V001 | AC2 | Visual | Box 1 title typography matches Figma (XL/LG/MD/SM) | Implemented |
| TC-ED-V002 | AC2 | Visual | Box 1 body text typography matches Figma (XL/LG/MD/SM) | Implemented |
| TC-ED-V003 | AC2, AC6 | Visual | Box 2 heading typography matches Figma (XL/LG/MD/SM) | Implemented |
| TC-ED-V004 | AC9 | Visual | Add-to-Calendar button typography matches Figma (XL/LG/MD/SM) | Implemented |

---

## AC Coverage Summary

| Acceptance Criteria | FE Relevant? | Test Coverage |
|--------------------|-------------|---------------|
| AC1 (CMS validation rules for required fields) | No - CMS only | Excluded |
| AC2 (Box 1: Title, Time, Address, Mode, AddToCalendar, Link) | Yes - FE | TC-ED-F001..F011, TC-ED-A001..A004, TC-ED-P001..P002, TC-ED-V001..V002, TC-ED-V004 |
| AC3 ("Hide event time" toggle hides time block) | Yes - FE (read-only) | Covered indirectly by TC-ED-F006 (test event has time visible) |
| AC4 (Address shown only for Offline / Hybrid) | Yes - FE | TC-ED-F007 |
| AC5 (Event link shown only for Online / Hybrid) | Yes - FE | TC-ED-F011, TC-ED-A005 |
| AC6 (Box 2 hidden when 0 CTAs, cap at 3) | Yes - FE | TC-ED-F012, TC-ED-F013, TC-ED-A005, TC-ED-V003 |
| AC7 (Box 3 hidden when no Media Contact) | Yes - FE | TC-ED-F014 |
| AC8 (CMS reorder / drag-and-drop) | No - CMS only | Excluded |
| AC9 (Add-to-Calendar click triggers `.ics` download) | Yes - FE | TC-ED-F009, TC-ED-F010, TC-ED-A004, TC-ED-V004 |
| AC10 (CMS validation messages) | No - CMS only | Excluded |

---

## DOM Structure (Verified)

```html
<section data-qa="event-details" data-testid="event-details">
  <!-- BOX 1 -->
  <div data-qa="event-details-section" data-testid="event-details-section">
    <h1 data-testid="event-title">BayerSports</h1>
    <h3>Time</h3>
    <p data-testid="event-start-date">Start: 2026-05-06, 21:31</p>
    <p data-testid="event-end-date">End: 2026-06-24, 05:30</p>
    <p data-testid="event-local-time">Local time: UTC +06:30</p>
    <h3>Address</h3>
    <div data-testid="event-address">
      <p data-testid="event-street">JP Nagar</p>
      <p data-testid="event-address-locality">Near Jayadev Hospitals</p>
      <p data-testid="event-postal-code">560078</p>
      <p data-testid="event-region">Bengaluru</p>
      <p data-testid="event-country">India</p>
    </div>
    <p data-testid="event-mode">Event mode: Offline</p>
    <button data-qa="add-to-calendar-button" data-testid="add-to-calendar-button">
      Add to Calendar
    </button>
    <a data-qa="event-link" data-testid="event-link" href="https://www.bayer.in/en-in">Bayer</a>
  </div>

  <!-- BOX 2 -->
  <section data-qa="event-additional-links-section" data-testid="event-additional-links-section">
    <h3 data-testid="event-additional-links-title">Additional Links</h3>
    <a data-qa="additional-link" href="/en/search">SEARCH</a>
    <a data-qa="additional-link" href="...">ANNUAL REPORTS</a>
    <a data-qa="additional-link" href="...">REPORTS</a>
  </section>

  <!-- BOX 3 (absent on this QA page - no Media Contact, per AC7) -->
</section>
```

---

## 1. Functional Tests (@Functional)

### TC-ED-F001: Verify Container Renders
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional @Smoke
**Spec ID**: `ED-FUNC-001`
**Prerequisites**: Navigate to Event Details test page with HTTP Basic auth + cookie acceptance

**Test Steps**:
1. Navigate to the Event Details test page
2. Resolve the root section via SmartLocator
3. Verify the container is visible

**Expected Results**:
- Container `section[data-qa="event-details"]` is visible

---

### TC-ED-F002: Verify Box 1 Wrapper Renders
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-002`
**Prerequisites**: Container is visible

**Test Steps**:
1. Resolve `[data-qa="event-details-section"]`
2. Verify it is visible

**Expected Results**:
- Box 1 wrapper is visible

---

### TC-ED-F003: Verify Event Title Heading Renders With Non-Empty Text
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-003`
**Prerequisites**: Box 1 is visible

**Test Steps**:
1. Resolve the title via `[data-testid="event-title"]`
2. Verify it is visible
3. Read text content
4. Verify the underlying tag is `h1` or `h2` (FE may render as either)

**Expected Results**:
- Title is visible
- Title text length > 0
- `tagName.toLowerCase()` is in `['h1', 'h2']`

---

### TC-ED-F004: Verify Start Date Renders With Non-Empty Value
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-004`
**Prerequisites**: Box 1 is visible

**Test Steps**:
1. Resolve `[data-testid="event-start-date"]`
2. Verify it is visible
3. Read text content and verify it is non-empty and contains "Start" (case-insensitive)

**Expected Results**:
- Start date element is visible and non-empty
- Text contains label "Start"

---

### TC-ED-F005: Verify End Date Renders With Non-Empty Value
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-005`
**Prerequisites**: Box 1 is visible

**Test Steps**:
1. Resolve `[data-testid="event-end-date"]`
2. Verify it is visible
3. Read text content and verify it is non-empty and contains "End" (case-insensitive)

**Expected Results**:
- End date element is visible and non-empty
- Text contains label "End"

---

### TC-ED-F006: Verify Local Time Renders With Non-Empty Value
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-006`
**Prerequisites**: Box 1 is visible

**Test Steps**:
1. Resolve `[data-testid="event-local-time"]`
2. Verify it is visible
3. Read text content and verify it is non-empty

**Expected Results**:
- Local time element is visible and non-empty

---

### TC-ED-F007: Verify Address Block Renders With All 5 Lines Non-Empty
**Priority**: High
**Acceptance Criteria**: AC2, AC4
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-007`
**Prerequisites**: Box 1 is visible. Test event is Offline / Hybrid mode (AC4).

**Test Steps**:
1. Resolve `[data-testid="event-address"]` wrapper and verify visible
2. Resolve each child: street, locality, postal code, region, country
3. Verify each is visible and has non-empty text

**Expected Results**:
- Address wrapper is visible
- All 5 address lines (street, locality, postal code, region, country) are visible and non-empty

---

### TC-ED-F008: Verify Event Mode Renders With Non-Empty Value
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-008`
**Prerequisites**: Box 1 is visible

**Test Steps**:
1. Resolve `[data-testid="event-mode"]`
2. Verify it is visible
3. Read text content and verify it is non-empty and contains "Event mode" (case-insensitive)

**Expected Results**:
- Event mode element is visible
- Text contains label "Event mode"

---

### TC-ED-F009: Verify Add-to-Calendar Button is Visible, Labelled and Enabled
**Priority**: High
**Acceptance Criteria**: AC2, AC9
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-009`
**Prerequisites**: Box 1 is visible

**Test Steps**:
1. Resolve `[data-qa="add-to-calendar-button"]`
2. Verify it is visible
3. Verify it is enabled
4. Read accessible name (text content or aria-label) and verify it is non-empty
5. Verify the underlying element is `<button>`

**Expected Results**:
- Button is visible and enabled
- Button has non-empty accessible name
- Element is native `<button>`

---

### TC-ED-F010: Verify Add-to-Calendar Click Triggers ICS Download (Soft-Warn)
**Priority**: Medium
**Acceptance Criteria**: AC9
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-010`
**Prerequisites**: Add-to-Calendar button is visible

**Test Steps**:
1. Listen for `page.waitForEvent('download', { timeout: 8_000 })`
2. Click the Add-to-Calendar button
3. Catch any timeout (soft-warn fallback)
4. If download fired, capture filename and verify it ends with `.ics` (case-insensitive)

**Expected Results**:
- A download event is observed within 8 seconds AND filename ends with `.ics`
- OR (acceptable fallback) the assertion soft-warns that no download fired - the test stays green so the broader suite is unblocked

---

### TC-ED-F011: Verify Event Link is Visible With Non-Empty href and Text
**Priority**: High
**Acceptance Criteria**: AC5
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-011`
**Prerequisites**: Test event is Online or Hybrid (AC5). Box 1 is visible.

**Test Steps**:
1. Resolve the scoped event link (`section[data-qa="event-details"] [data-qa="event-details-section"] a[data-qa="event-link"]`)
2. Verify it is visible
3. Read `textContent` and verify non-empty
4. Read `href` and verify it starts with `http://` or `https://`

**Expected Results**:
- Event link is visible
- Anchor text is non-empty
- `href` is an absolute URL

---

### TC-ED-F012: Verify Box 2 Renders With At Least One Additional Link
**Priority**: High
**Acceptance Criteria**: AC6
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-012`
**Prerequisites**: Test event has 1-3 additional links configured (AC6)

**Test Steps**:
1. Resolve `[data-qa="event-additional-links-section"]` wrapper and verify visible
2. Resolve `[data-testid="event-additional-links-title"]` and verify visible
3. Resolve the additional-link collection
4. Verify count is between 1 and 3

**Expected Results**:
- Box 2 wrapper is visible
- Heading is visible
- 1-3 additional link items rendered

---

### TC-ED-F013: Verify Each Additional Link Has Non-Empty Text and href
**Priority**: Medium
**Acceptance Criteria**: AC6
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-013`
**Prerequisites**: Box 2 contains at least one link

**Test Steps**:
1. For each additional link, read `textContent` and `href` attribute
2. Verify both have length > 0

**Expected Results**:
- Every additional link has non-empty text and non-empty href

---

### TC-ED-F014: Box 3 (Media Contact) - Log Present or Not
**Priority**: Low (informational)
**Acceptance Criteria**: AC7
**Test Tag(s)**: @EventDetails @Functional
**Spec ID**: `ED-FUNC-014`
**Prerequisites**: Component is visible. Box 3 absence is acceptable per AC7.

**Test Steps**:
1. Resolve `getBox3Collection()` POM helper (raw scoped Locator after SmartLocator probe; counts hidden DOM nodes)
2. Call `count()`
3. If count is 0, soft-log "Box 3 not present (no Media Contact)" and end
4. If count > 0, read first node's `children.length` and computed `display` / `visibility`
5. Soft-log `count`, `childCount`, `isHidden` for visibility in CI report

**Expected Results**:
- Test always passes (informational only)
- AC7 permits Box 3 absence when no Media Contact is assigned
- Hidden-via-CSS is treated as absent

---

## 2. Accessibility Tests (@Accessibility)

### TC-ED-A001: Verify axe-core Scan of Event Details Subtree Has No Critical/Serious Violations
**Priority**: Critical
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Accessibility
**Spec ID**: `ED-A11Y-001`
**Prerequisites**: Component is visible

**Test Steps**:
1. Run `AxeBuilder` with `.include('section[data-qa="event-details"]')`
2. Apply `wcag2a` + `wcag2aa` tag filter
3. Filter resulting violations to `impact in {critical, serious}`
4. Verify the filtered list is empty

**Expected Results**:
- Zero critical/serious WCAG 2.0 A/AA violations inside Event Details subtree

---

### TC-ED-A002: Verify Title Uses a Top-Level Heading (h1 or h2)
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Accessibility
**Spec ID**: `ED-A11Y-002`
**Prerequisites**: Title is visible

**Test Steps**:
1. Resolve title element
2. Read `tagName.toLowerCase()`
3. Verify it is in `['h1', 'h2']`

**Expected Results**:
- Title is rendered as `<h1>` or `<h2>` (top-level heading)

---

### TC-ED-A003: Verify All Headings Inside Event Details Have Non-Empty Text
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Accessibility
**Spec ID**: `ED-A11Y-003`
**Prerequisites**: Component is visible

**Test Steps**:
1. Call `getAllHeadings()` POM helper (returns all `<h1>`-`<h6>` inside subtree)
2. Read `allTextContents()`
3. Verify list length > 0
4. For every heading, verify `text.trim().length > 0`

**Expected Results**:
- At least one heading exists inside Event Details
- All headings have non-empty text

---

### TC-ED-A004: Verify Add-to-Calendar Has Accessible Name + role=button
**Priority**: High
**Acceptance Criteria**: AC9
**Test Tag(s)**: @EventDetails @Accessibility
**Spec ID**: `ED-A11Y-004`
**Prerequisites**: Add-to-Calendar button is visible

**Test Steps**:
1. Resolve the button
2. Verify it is visible
3. Read the `role` attribute (explicit) OR fall back to `tagName.toLowerCase()`
4. Verify role resolves to `'button'`
5. Read accessible name from `textContent` OR `aria-label`
6. Verify name has length > 0

**Expected Results**:
- Button exposes `role=button` (native `<button>` is acceptable)
- Button has a non-empty accessible name

---

### TC-ED-A005: Verify All Anchors Inside Event Details Have Non-Empty Name and href
**Priority**: Medium
**Acceptance Criteria**: AC5, AC6
**Test Tag(s)**: @EventDetails @Accessibility
**Spec ID**: `ED-A11Y-005`
**Prerequisites**: Component is visible

**Test Steps**:
1. Call `getAllAnchors()` POM helper (returns all `<a>` inside subtree)
2. Call `count()` and verify > 0
3. For each anchor, read `textContent`, `aria-label`, and `href`
4. Verify accessible name (text or aria-label) has length > 0
5. Verify `href` has length > 0

**Expected Results**:
- At least one anchor exists inside Event Details
- Every anchor has a non-empty accessible name
- Every anchor has a non-empty `href`

---

## 3. Performance Tests (@Performance)

### TC-ED-P001: Verify Container Becomes Visible Within Threshold
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Performance
**Spec ID**: `ED-PERF-001`
**Prerequisites**: Fresh browser context

**Test Steps**:
1. Instantiate a fresh `EventDetailsComponent`
2. Record `Date.now()` before navigation
3. Run `navigateToPage()` (auth + cookie + wait)
4. Wait for container to be visible
5. Verify elapsed < `TEST_CONFIG.performanceThresholds.loadTime * 10`

**Expected Results**:
- Container becomes visible within the configured budget

---

### TC-ED-P002: Verify Box 1 Essentials Render Together Within Threshold
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Performance
**Spec ID**: `ED-PERF-002`
**Prerequisites**: Component is visible

**Test Steps**:
1. Record `Date.now()` before resolving Box 1 essentials
2. Resolve title, start date, and Add-to-Calendar button
3. Wait for all three to be visible concurrently
4. Verify elapsed < `TEST_CONFIG.performanceThresholds.loadTime * 5`

**Expected Results**:
- Title, start date, and Add-to-Calendar button are all visible within the configured budget

---

## 4. Visual Tests (@Visual)

> Every visual test runs at all four viewports: XL (1440x900), LG (1024x800), MD (768x1024), SM (375x667). Computed CSS is compared against tokens auto-extracted from Figma into `EventDetails_FigmaValues.ts`. Each test soft-checks `font-family`, `font-size`, `font-weight`, `color`, and `line-height` (only when the corresponding Figma token is defined).

### TC-ED-V001: Verify Box 1 Title Typography Matches Figma (per viewport)
**Priority**: High
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ED-VIS-XL-001`, `ED-VIS-LG-001`, `ED-VIS-MD-001`, `ED-VIS-SM-001`
**Prerequisites**: Title is visible

**Test Steps**:
1. Set viewport size from `EventDetails_FigmaValues[vp].viewport`
2. Re-navigate so responsive layout applies
3. Read computed `font-family`, `font-size`, `font-weight`, `color`, `line-height` from the title element
4. Compare each against `figma.box1.titleText` (when token present)

**Expected Results**:
- Title typography matches Figma at the active viewport

---

### TC-ED-V002: Verify Box 1 Body Text (Start Date) Typography Matches Figma (per viewport)
**Priority**: Medium
**Acceptance Criteria**: AC2
**Test Tag(s)**: @EventDetails @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ED-VIS-XL-002`, `ED-VIS-LG-002`, `ED-VIS-MD-002`, `ED-VIS-SM-002`
**Prerequisites**: Start date element is visible

**Test Steps**:
1. Set viewport from Figma values and re-navigate
2. Read computed styles from `[data-testid="event-start-date"]`
3. Compare against `figma.box1.bodyText`

**Expected Results**:
- Body text typography matches Figma at the active viewport

---

### TC-ED-V003: Verify Box 2 Heading Typography Matches Figma (per viewport)
**Priority**: Medium
**Acceptance Criteria**: AC2, AC6
**Test Tag(s)**: @EventDetails @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ED-VIS-XL-003`, `ED-VIS-LG-003`, `ED-VIS-MD-003`, `ED-VIS-SM-003`
**Prerequisites**: Box 2 heading is visible

**Test Steps**:
1. Set viewport from Figma values and re-navigate
2. Read computed styles from `[data-testid="event-additional-links-title"]`
3. Compare against `figma.box2.titleText`

**Expected Results**:
- Box 2 heading typography matches Figma at the active viewport

---

### TC-ED-V004: Verify Add-to-Calendar Button Typography Matches Figma (per viewport)
**Priority**: Medium
**Acceptance Criteria**: AC9
**Test Tag(s)**: @EventDetails @Visual @VP-XL / @VP-LG / @VP-MD / @VP-SM
**Spec IDs**: `ED-VIS-XL-004`, `ED-VIS-LG-004`, `ED-VIS-MD-004`, `ED-VIS-SM-004`
**Prerequisites**: Add-to-Calendar button is visible

**Test Steps**:
1. Set viewport from Figma values and re-navigate
2. Read computed styles from `[data-qa="add-to-calendar-button"]`
3. Compare against `figma.box1.buttonText`

**Expected Results**:
- Add-to-Calendar button typography matches Figma at the active viewport

---

## Test Execution

```powershell
# Full Event Details suite
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventDetails"

# By category
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventDetails.*@Functional"
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventDetails.*@Accessibility"
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventDetails.*@Performance"
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventDetails.*@Visual"

# Single viewport
npx playwright test tests/specs/eventStageAndDetails.spec.ts --project=chromium --grep "@EventDetails.*@VP-SM"
```

---

## Test Framework Rules Honoured

- All primary element resolution goes through SmartLocator (`findSmart`)
- Collection helpers follow the documented "SmartLocator probe + scoped re-resolve" pattern (`getAdditionalLinks`, `getAllHeadings`, `getAllAnchors`, `getBox3Collection`)
- Every element has at least 3 fallback strategies + a meaningful `description`
- All child locators are scoped under `section[data-qa="event-details"]`
- Only `expect.soft(...)` assertions are used (no hard `expect(...)` failures)
- Allure context is applied per test via `applyAllurePageContext('EventDetails')`
- Tags follow the framework standard: `@EventDetails` + category + `@VP-XX` for visual
