# Automated Events Teaser Group - Test Cases

## Component Information
- **Component Name**: Automated Events Teaser Group
- **User Story**: 3548 (State: QA in progress)
- **Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/automated-events-teaser-group-component
- **Figma URL**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19519-48255&m=dev
- **Figma Values File**: `helpers/utils/figma-values/EventsTeaserGroup_FigmaValues.ts`
- **DOM Inspection**: `docs/dom-inspection-events-teaser-group.md`
- **Last Updated**: 2026-07-08
- **Test Status**: Ready (documentation) - scripts not yet implemented
- **Scope**: Frontend rendering and behavior only (no CMS authoring/backend)
- **Authentication**: Vercel HTTP basic auth (bayercorp / beyond2026)

---

## Requirements Summary

The Automated Events Teaser Group is a compact horizontal/stacked teaser that automatically
displays up to three upcoming events (start date today or later), sorted ascending by start
date, without manual configuration. Each event shows a date (day-tag), classification tags, an
event title, an "Add to Calendar" control, and - when the event has an Event Page - an arrow link
to that page. The group has a title and an optional "Overview" link to a configured overview page.

Frontend scope validates the rendered output: structure, event count/ordering, conditional arrow
behaviour, overview navigation, Add-to-Calendar download, typography/colour/spacing vs Figma,
accessibility, and performance. CMS authoring and publish-propagation are out of scope.

### Acceptance Criteria (verbatim, condensed)
- **AC1**: Component is available for insertion in the CMS across all content dividers. *(CMS-only - not FE testable)*
- **AC2**: On page load the component auto-retrieves up to three next upcoming/ongoing events (start date today or future), ascending by start date. *(FE testable)*
- **AC3**: If fewer than three events exist, only the available events are shown. *(FE - data-dependent; not exercisable on this test page)*
- **AC4**: The "Add to Calendar" link is displayed. *(FE testable)*
- **AC5**: If an event has an Event Page, clicking the teaser/arrow redirects to the Event Page. *(FE testable)*
- **AC6**: If an event has no Event Page, there is no arrow/link and the teaser is not clickable. *(FE testable)*
- **AC7**: If an overview link is configured, clicking it redirects to the configured page. *(FE testable)*
- **AC8**: If no overview link is configured, it is not shown. *(FE - data-dependent; not exercisable on this test page)*
- **AC9**: Editors set "Overview"/"Add to Calendar" labels centrally (dictionary). *(FE: structural presence only - no text assertion, language-agnostic)*
- **AC10**: Published content changes are reflected immediately. *(CMS/backend - not FE testable)*
- **AC11**: Clicking "Add to Calendar" downloads an ICS file. *(FE testable via download event)*

### Frontend-testability note
FE-covered: AC2, AC4, AC5, AC6, AC7, AC9 (structural), AC11. Excluded as CMS/backend: AC1, AC10.
Not exercisable on the current test page (documented under Known Limitations): AC3, AC8.

---

## Design Reference Values (Figma - "Events Teaser Group / 100% Divider")

Values come from `EventsTeaserGroup_FigmaValues.ts` (never hardcode in specs). Font family "Bayer Sans" throughout.

| Element | XL (1440) | LG (1024) | MD (768) | SM (375) | Weight | Colour |
|---------|-----------|-----------|----------|----------|--------|--------|
| Group title "Calendar" | 48/56 | 48/56 | 30/36 | 30/36 | 700 | #10384F |
| Event title | 24/30 | 24/30 | 20/30 | 20/30 | 700 | #10384F |
| Day number ("08") | 30/36 | 30/36 | 30/36 | 30/36 | 700 | #10384F |
| Month ("APR") | 12/16 | 12/16 | 12/16 | 12/16 | 700 | #D30F4B |
| Year ("2026") | 14/20 | 14/20 | 14/20 | 14/20 | 400 | #406072 |
| Tag chip | 12/16 italic +0.40px | same | same | same | 500 | #0E6801 on #ECF8DD |
| Overview link | 14/20 italic +0.40px | same | same | same | 500 | #10384F |
| Add to Calendar | 14/20 italic +0.40px | same | same | same | 500 | #10384F |

**Layout / spacing**: frame padding XL 80/96 | LG 64/40 | MD 64/32 | SM 48/20. Container gap 32px;
event-item gap 16px; content gap 16px; tag gap 10px; headline gap 14px; day-tag width 64px.
XL/LG arrange items in a row; MD/SM stack in a column.

---

## Actual DOM Structure (from live inspection)

```html
<section data-qa="event-teaser-group" data-testid="event-teaser-group">
  <h2 data-qa="title-component">Calendar</h2>
  <a data-qa="Link" href="/en/about-us-english">Overview <svg data-qa="icon"/></a>
  <div data-qa="event-teaser-items" data-testid="event-teaser-items">   <!-- lg:flex-row -->

    <!-- Event 1: NO event page (AC6 state) -->
    <section data-qa="event-teaser-list-item" data-testid="event-teaser-list-item">
      <time data-qa="day-tag" data-testid="day-tag" aria-label="July 8, 2026">
        <div data-testid="day-tag-day">08</div>          <!-- day number: data-testid only -->
        <!-- month + year sub-elements (no data-qa) -->
      </time>
      <div>
        <ul data-qa="tags" data-testid="tags" aria-label="Tags: 2 items">
          <li data-qa="tag-chip">Advances in Agriculture</li>
          <li data-qa="tag-chip">Business &amp; Finance</li>
        </ul>
        <h2 data-qa="title-component" class="... cursor-pointer">BayerEvents</h2>
        <button data-qa="add-to-calendar-button" data-testid="add-to-calendar-button">
          Add to Calendar <svg data-qa="icon"/>
        </button>
      </div>
      <!-- NO wrapping <a> event-page link for this item -->
    </section>

    <!-- Event 2 / Event 3: HAVE event page (AC5 state) -->
    <section data-qa="event-teaser-list-item" data-testid="event-teaser-list-item">
      <time data-qa="day-tag" ... > ... </time>
      <div>
        <ul data-qa="tags" ...> <li data-qa="tag-chip">...</li> ... </ul>
        <h2 data-qa="title-component">Bayer Crop Science Investor Event</h2>
        <button data-qa="add-to-calendar-button" ...>Add to Calendar</button>
      </div>
      <!-- event-page link: NO data-qa; aria-label = event title, href = event page -->
      <a aria-label="Bayer Crop Science Investor Event"
         href="https://www.bayer.com/en/investors/bayer-crop-science-investor-event"> ... </a>
    </section>

  </div>
</section>
```

**Locator notes:**
- The event-page arrow link has **no `data-qa`** - locate structurally: an `<a>` inside the item whose `aria-label` equals the item's title text. SmartLocator with fallbacks required.
- The day number carries `data-testid="day-tag-day"` only (no `data-qa`).
- "Add to Calendar" is a `<button>` (JS-triggered ICS), not an `<a>` with a static `.ics` href.

---

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|--------------|----|-----------|--------|
| TC-ETG1 | AC2 | Functional | Ready |
| TC-ETG2 | AC2, AC3 | Functional | Ready |
| TC-ETG3 | AC2 | Functional | Ready |
| TC-ETG4 | AC2 | Functional | Ready |
| TC-ETG5 | AC4 | Functional | Ready |
| TC-ETG6 | AC5 | Functional | Ready |
| TC-ETG7 | AC6 | Functional | Ready |
| TC-ETG8 | AC7 | Functional | Ready |
| TC-ETG9 | AC11 | Functional | Ready |
| TC-ETG10 | AC2 | Functional | Ready |
| TC-ETG11 | AC9 | Functional | Ready |
| TC-AETG1 | AC2-AC7 | Accessibility | Ready |
| TC-AETG2 | AC5, AC7, AC11 | Accessibility | Ready |
| TC-AETG3 | AC2 | Accessibility | Ready |
| TC-AETG4 | - | Accessibility | Ready |
| TC-AETG5 | AC5 | Accessibility | Ready |
| TC-VETG1 | Design | Visual | Ready |
| TC-VETG2 | Design | Visual | Ready |
| TC-VETG3 | Design | Visual | Ready |
| TC-VETG4 | Design | Visual | Ready |
| TC-VETG5 | Design | Visual | Ready |
| TC-VETG6 | Design | Visual | Ready |
| TC-VETG7 | Design | Visual | Ready |
| TC-PETG1 | - | Performance | Ready |
| TC-PETG2 | AC11 | Performance | Ready |

---

## Functional Test Cases

### TC-ETG1: Group structure renders correctly
**AC**: AC2
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**:
- Navigate to test page with Vercel auth applied.
- Cookie banner accepted.
- Default (XL/LG) viewport.

**Test Steps**:
1. Wait for the page to fully load.
2. Verify the group container `[data-qa="event-teaser-group"]` is visible.
3. Verify the group title `[data-qa="event-teaser-group"] [data-qa="title-component"]` exists and is non-empty.
4. Verify the items wrapper `[data-qa="event-teaser-items"]` is visible.
5. For each `[data-qa="event-teaser-list-item"]`, verify it contains: a `[data-qa="day-tag"]`, a `[data-qa="tags"]`, a title `[data-qa="title-component"]`, and an `[data-qa="add-to-calendar-button"]`.

**Expected Results**:
- Group container and items wrapper are visible (soft assertions).
- Group title is present and not empty (no exact-text assertion - language-agnostic).
- Every event item exposes the mandatory sub-elements: day-tag, title, and add-to-calendar. The classification tags list is OPTIONAL (an event may have no tags) and is validated separately in TC-ETG10.

---

### TC-ETG2: At most three events are displayed
**AC**: AC2, AC3
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Count elements matching `[data-qa="event-teaser-list-item"]`.
2. Assert the count is between 1 and 3 inclusive.

**Expected Results**:
- Event count `>= 1` and `<= 3` (soft assertion). On the current test page this is expected to be exactly 3.

---

### TC-ETG3: Events are sorted ascending by start date
**AC**: AC2
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded; at least two events present.

**Test Steps**:
1. For each event, read the machine-readable date from `[data-qa="day-tag"]` (the `datetime` attribute if present, else the `aria-label`).
2. Parse each into a comparable date value.
3. Verify the sequence is non-decreasing (each event's date `>=` the previous event's date).

**Expected Results**:
- Parsed dates are in ascending (non-decreasing) order (soft assertion).
- Note: on the current test page all three events share the same date, so this validates "not out of order" rather than strict ordering; retains value if data changes.

---

### TC-ETG4: Each displayed event's date is today or in the future
**AC**: AC2
**Priority**: Medium
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. For each event, parse the start date from `[data-qa="day-tag"]`.
2. Compare each against the current date (date-only, ignore time).

**Expected Results**:
- Every event date is `>=` today (soft assertion).

---

### TC-ETG5: "Add to Calendar" control present on each event
**AC**: AC4
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. For each `[data-qa="event-teaser-list-item"]`, locate the child `[data-qa="add-to-calendar-button"]`.
2. Verify it is visible and enabled.

**Expected Results**:
- Each event exposes a visible, enabled Add-to-Calendar control (soft assertion).

---

### TC-ETG6: Event with an Event Page - arrow present and navigates
**AC**: AC5
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded; at least one event has an Event Page (events 2 and 3 on the test page).

**Test Steps**:
1. Identify an event item that contains a wrapping `<a>` whose `aria-label` matches its title.
2. Verify the anchor has a non-empty `href`.
3. Click the arrow/anchor.
4. Wait for navigation and capture the resulting URL.

**Expected Results**:
- The anchor exists with a valid `href` (soft assertion).
- After click, the browser navigates away from the test page to the event's `href` target.

---

### TC-ETG7: Event without an Event Page - no arrow, not clickable
**AC**: AC6
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded; at least one event has no Event Page (event 1 "BayerEvents" on the test page).

**Test Steps**:
1. Identify the event item that has no wrapping `<a>` with an `aria-label` matching its title.
2. Verify there is no event-page anchor within that item.
3. (Optional) Confirm clicking the title does not cause navigation.

**Expected Results**:
- No event-page anchor is present for that item (soft assertion).
- Clicking does not navigate away from the test page.

---

### TC-ETG8: Overview link present and navigates
**AC**: AC7
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded; overview link configured (present on the test page).

**Test Steps**:
1. Locate the Overview link within the group header (`[data-qa="event-teaser-group"]` scope).
2. Verify it is visible and has a non-empty `href`.
3. Click it and wait for navigation.

**Expected Results**:
- Overview link visible with valid `href` (soft assertion).
- Click navigates to the configured overview URL.

---

### TC-ETG9: "Add to Calendar" click triggers an ICS download
**AC**: AC11
**Priority**: High
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded; downloads permitted in the browser context.

**Test Steps**:
1. Set up a Playwright `download` event listener (waitForEvent('download')).
2. Click an event's `[data-qa="add-to-calendar-button"]`.
3. Capture the download and read its suggested filename.

**Expected Results**:
- A download event fires (soft assertion).
- The suggested filename ends with `.ics` (case-insensitive).
- If the control instead opens a new tab / calls an API without a download, the test logs the observed behaviour for triage (see Known Limitations).

---

### TC-ETG10: Classification tags render per event
**AC**: AC2
**Priority**: Medium
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. For each event item, locate `[data-qa="tags"]`.
2. Count child `[data-qa="tag-chip"]` elements.

**Expected Results**:
- Each event's tags list is present; where tags exist, at least one `tag-chip` renders (soft assertion). No exact tag-text assertion (language-agnostic).

---

### TC-ETG11: Overview / Add-to-Calendar labels render with accessible text
**AC**: AC9
**Priority**: Low
**Tags**: @Functional @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Read the accessible name/text of the Overview link.
2. Read the accessible name/text of an Add-to-Calendar button.

**Expected Results**:
- Both controls expose non-empty accessible text (soft assertion). No specific string is asserted - only that a label is rendered (labels are dictionary-driven and locale-dependent).

---

## Accessibility Test Cases

### TC-AETG1: axe-core WCAG 2.1 AA scan
**AC**: AC2-AC7
**Priority**: High
**Tags**: @Accessibility @EventsTeaserGroup

**Preconditions**: Component loaded; axe-core integrated.

**Test Steps**:
1. Run an axe-core analysis scoped to `[data-qa="event-teaser-group"]`.
2. Filter results to WCAG 2.1 A/AA rules.

**Expected Results**:
- No critical or serious violations within the component scope (soft assertion). Violations are logged with rule id and node for triage.

---

### TC-AETG2: Keyboard operability of interactive elements
**AC**: AC5, AC7, AC11
**Priority**: High
**Tags**: @Accessibility @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Tab through the component and confirm focus reaches the Overview link, each Add-to-Calendar button, and each event-page arrow.
2. Activate the focused Overview link and an arrow with Enter; activate an Add-to-Calendar button with Enter/Space.

**Expected Results**:
- All interactive elements are reachable via keyboard and operable via Enter/Space (soft assertion).

---

### TC-AETG3: Semantic structure
**AC**: AC2
**Priority**: Medium
**Tags**: @Accessibility @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Verify the day-tag is a `<time>` element with an `aria-label` describing the full date.
2. Verify the tags list is a `<ul>` with an `aria-label` (e.g. "Tags: N items").
3. Verify event titles are heading elements (h2).

**Expected Results**:
- Semantic elements and ARIA labels present as above (soft assertions).

---

### TC-AETG4: Visible focus indicators
**AC**: -
**Priority**: Medium
**Tags**: @Accessibility @EventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Focus the Overview link, an arrow, and an Add-to-Calendar button in turn.
2. Verify a visible focus style is applied (e.g. focus-visible ring / outline).

**Expected Results**:
- Each interactive element shows a visible focus indicator when focused (soft assertion).

---

### TC-AETG5: Event-page arrow link has an accessible name
**AC**: AC5
**Priority**: Medium
**Tags**: @Accessibility @EventsTeaserGroup

**Preconditions**: Component loaded; an event with an Event Page present.

**Test Steps**:
1. Locate an event-page anchor.
2. Read its accessible name (`aria-label`).

**Expected Results**:
- The anchor exposes a non-empty accessible name equal to (or containing) the event title (soft assertion).

---

## Visual Test Cases

> All visual assertions import values from `EventsTeaserGroup_FigmaValues.ts` via `getValuesByViewport`. No hardcoded design values. Run per viewport: XL 1440, LG 1024, MD 768, SM 375.

### TC-VETG1: Group title typography per viewport
**AC**: Design
**Priority**: High
**Tags**: @Visual @EventsTeaserGroup

**Preconditions**: Component loaded at target viewport.

**Test Steps**:
1. Resolve expected tokens via `getValuesByViewport(vp).groupTitle`.
2. Read computed styles of `[data-qa="event-teaser-group"] > [data-qa="title-component"]`.
3. Compare font-family, font-size, line-height, font-weight, colour.

**Expected Results**:
- Computed styles match Figma (XL/LG 48/56; MD/SM 30/36; weight 700; #10384F) (soft assertions).

---

### TC-VETG2: Event title typography
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @EventsTeaserGroup

**Test Steps**:
1. Resolve `getValuesByViewport(vp).eventTitle`.
2. Read computed styles of an event item's `[data-qa="title-component"]`.
3. Compare font-family, size, line-height, weight, colour.

**Expected Results**:
- Matches Figma (XL/LG 24/30; MD/SM 20/30; weight 700; #10384F) (soft assertions).

---

### TC-VETG3: Day-tag typography (day / month / year)
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @EventsTeaserGroup

**Test Steps**:
1. Resolve `dayNumber`, `monthLabel`, `yearLabel` tokens.
2. Read computed styles of the day number (`[data-testid="day-tag-day"]`), month, and year sub-elements.
3. Compare size/line-height/weight/colour for each.

**Expected Results**:
- Day 30/36 #10384F; month 12/16 #D30F4B; year 14/20 #406072 (soft assertions).

---

### TC-VETG4: Tag-chip typography and colours
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @EventsTeaserGroup

**Test Steps**:
1. Resolve `getValuesByViewport(vp).tagChip`.
2. Read computed styles of a `[data-qa="tag-chip"]`.
3. Compare font-size, line-height, weight, letter-spacing, text colour and background colour.

**Expected Results**:
- 12/16, weight 500, +0.40px, text #0E6801 on background #ECF8DD (soft assertions).

---

### TC-VETG5: Overview + Add-to-Calendar label typography
**AC**: Design
**Priority**: Low
**Tags**: @Visual @EventsTeaserGroup

**Test Steps**:
1. Resolve `overviewLink` and `addToCalendar` tokens.
2. Read computed styles of the Overview link and an Add-to-Calendar button label.
3. Compare size/line-height/weight/letter-spacing/colour/text-transform.

**Expected Results**:
- 14/20, weight 500, +0.40px, uppercase, italic, #10384F (soft assertions).

---

### TC-VETG6: Spacing and layout tokens
**AC**: Design
**Priority**: Low
**Tags**: @Visual @EventsTeaserGroup

**Test Steps**:
1. Resolve `getValuesByViewport(vp).layout`.
2. Read computed gaps/padding of the group container, items wrapper, event item, tags list.
3. Read the day-tag block width.

**Expected Results**:
- Container gap 32px; item gap 16px; content gap 16px; tag gap 10px; frame padding per viewport; day-tag width 64px (soft assertions).
- Note: requirement mentions date "max width 102px" vs Figma 64px - asserting Figma value; flagged for confirmation.

---

### TC-VETG7: Responsive arrangement (row vs column)
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @EventsTeaserGroup

**Test Steps**:
1. At XL and LG, verify the items wrapper lays items out in a row (flex-direction row).
2. At MD and SM, verify items stack in a column (flex-direction column).

**Expected Results**:
- Row layout at XL/LG, column layout at MD/SM (soft assertions).

---

## Performance Test Cases

### TC-PETG1: Component render/load time
**AC**: -
**Priority**: Low
**Tags**: @Performance @EventsTeaserGroup

**Test Steps**:
1. Navigate to the test page and measure time until `[data-qa="event-teaser-group"]` is visible.

**Expected Results**:
- Component becomes visible within an agreed threshold (e.g. < 5s on QA) (soft assertion; threshold configurable).

---

### TC-PETG2: Add-to-Calendar interaction responsiveness
**AC**: AC11
**Priority**: Low
**Tags**: @Performance @EventsTeaserGroup

**Test Steps**:
1. Click an Add-to-Calendar button and measure time to the download event (or observed response).

**Expected Results**:
- The download/response occurs within an agreed threshold (soft assertion).

---

## Prerequisites
- Vercel HTTP basic auth: bayercorp / beyond2026 (handled by BasePage).
- Cookie banner acceptance (handled by BasePage `acceptCookiesBanner()`).
- `TEST_ENV=qa` (test page is on the QA Vercel host).
- Figma values file present: `helpers/utils/figma-values/EventsTeaserGroup_FigmaValues.ts`.
- Downloads allowed in the browser context for TC-ETG9.

## Assumptions and Notes
- Labels ("Overview", "Add to Calendar") are dictionary-driven and locale-dependent; only structural presence is asserted, never exact text (language-agnostic rule).
- The event-page arrow link has no `data-qa`; located structurally by `aria-label` matching the event title (SmartLocator with fallbacks).
- "Add to Calendar" is a `<button>` invoking a JS ICS download, not an anchor with a `.ics` href.
- Date ordering test retains value even though the current test data shares one date.

## Known Limitations
- **AC3 (fewer than three events)** and **AC8 (no overview link configured)** cannot be exercised on the current test page (it always renders 3 events plus an overview link). These require a dedicated test page/variant; not covered until such data is available.
- **AC1, AC10** are CMS/backend concerns and out of frontend scope.
- **AC11**: if the Add-to-Calendar control opens a tab or calls an API without a browser download, TC-ETG9 will be adjusted after observing actual behaviour during implementation.
- **Date max-width**: requirement says 102px; Figma `_day-tag` is 64px. TC-VETG6 asserts the Figma value pending confirmation.

## Findings from execution (visual - candidate defects)
These visual assertions currently fail because the rendered implementation deviates from the Figma
design tokens. They are NOT test errors (locators and expected values were verified against the live
DOM); they are genuine discrepancies to confirm with design/dev and are candidates for ADO bugs
against story 3548. Logged: **bug #5325** (finding 1), **bug #5326** (finding 2).

1. **Group title colour (TC-VETG1, all four viewports).** [ADO #5325] The "Calendar"
   `<h2 data-qa="title-component">` renders in the inherited default colour **black `rgb(0,0,0)`**
   because it carries no text-colour class (only `text-3xl ... lg:text-5xl`). Figma specifies
   **#10384F** (dark blue), and sibling event titles correctly use the `text-text` class. Font
   size/weight/line-height all match Figma. Confidence: HIGH (implementation inconsistency).
2. **Tag-chip text size at XL/LG (TC-VETG4, XL and LG only).** [ADO #5326] The chip text span uses
   `text-xs lg:text-sm` / `leading-xs-tight lg:leading-sm`, rendering **14px/20px at XL/LG** and
   12px/16px at MD/SM. The Figma dev-handover tokens specify **12px/16px across all breakpoints**;
   MD/SM match, XL/LG do not. Confidence: MEDIUM (possible responsive design not captured in the
   dev-handover tokens - confirm design intent).
