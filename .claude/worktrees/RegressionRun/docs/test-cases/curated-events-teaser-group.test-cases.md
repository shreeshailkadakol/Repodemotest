# Curated Events Teaser Group - Test Cases

## Component Information
- **Component Name**: Curated Events Teaser Group
- **User Story**: 1581 (State: QA in progress)
- **Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/curated-events-teaser-group-component
- **Figma URL**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19519-47324
- **Figma Values File**: `helpers/utils/figma-values/CuratedEventsTeaserGroup_FigmaValues.ts` (created in Figma step)
- **DOM Inspection**: `docs/dom-inspection-curated-events-teaser-group.md`
- **Last Updated**: 2026-07-13
- **Test Status**: Ready (documentation) - scripts not yet implemented
- **Scope**: Frontend rendering and behavior only (no CMS authoring/backend)
- **Authentication**: Vercel HTTP basic auth (bayercorp / beyond2026)

---

## Requirements Summary

The Curated Events Teaser Group uses the same compact teaser design as the automated variant, but
the content editor **manually selects 1 to 8 events**; the order of selection determines the display
order. Selected events may be **upcoming, ongoing, or past** (no future-only filter). Each teaser
shows a date (day-tag from the start date), classification tags, an event title, an "Add to Calendar"
control, and - when the event has an Event Page - an arrow link to that page. The group has a title
and an optional "Overview" link to a configured overview page.

Frontend scope validates the rendered output: structure, event count (<= 8), conditional arrow
behaviour, overview presence/navigation, Add-to-Calendar download, typography/colour/spacing vs
Figma, accessibility, and performance. CMS authoring (manual picker, reorder) and publish-propagation
are out of scope.

### Acceptance Criteria (verbatim, condensed)
- **AC1**: The "Curated Event Teaser Group" is available for insertion in the CMS across all content dividers (no restriction). *(CMS-only - not FE testable)*
- **AC2**: When a visitor enters the page, the component displays up to 8 manually configured events, in the configured order. *(FE testable)*
- **AC3**: If fewer than 8 events are selected, only the configured event(s) appear. *(FE testable - 6 events on this page)*
- **AC4**: When the event teaser renders, the "Add to Calendar" link is displayed. *(FE testable)*
- **AC5**: If an event has an Event Page, clicking the teaser/arrow icon navigates to the Event Page. *(FE testable)*
- **AC6**: If an event has no Event Page, there is no arrow link and the teaser is not clickable. *(FE testable)*
- **AC7**: If an overview link is configured, clicking it redirects to the configured link. *(FE testable - overview link now configured on this page; target is external http://google.com)*
- **AC8**: If no overview link is configured, the overview link is not shown. *(FE testable - TC-CETG8 adapts to page state)*
- **AC9**: Editors set "Overview"/"Add to Calendar" labels centrally (dictionary). *(FE: structural presence only - no text assertion, language-agnostic)*
- **AC10**: Published content changes are reflected immediately. *(CMS/backend - not FE testable)*
- **AC11**: Clicking "Add to Calendar" downloads an ICS file (ICS override preferred over auto-generated). *(FE testable via download event)*

### Frontend-testability note
FE-covered: AC2, AC3, AC4, AC5, AC6, AC7/AC8 (overview - single adaptive test), AC9 (structural), AC11.
Excluded as CMS/backend: AC1, AC10. The overview link is now configured on the test page, so TC-CETG8
covers AC7 (present + navigates) - with the caveat that its configured target is the external host
google.com, which the test sandbox cannot resolve (see Known Limitations). If a page has no overview
link, the same test validates AC8 (not shown).

---

## Design Reference Values (Figma - "Events Teaser Group / compact teaser")

Values are sourced from `CuratedEventsTeaserGroup_FigmaValues.ts` (never hardcode in specs). The curated
variant reuses the shared compact-teaser design tokens. Font family "Bayer Sans" throughout. Table below
is the expected reference pending confirmation against the Figma node during the Figma-values step.

| Element | XL (1440) | LG (1024) | MD (768) | SM (375) | Weight | Colour |
|---------|-----------|-----------|----------|----------|--------|--------|
| Group title "Title" | 48/56 | 48/56 | 30/36 | 30/36 | 700 | #10384F |
| Event title | 24/30 | 24/30 | 20/30 | 20/30 | 700 | #10384F |
| Day number ("09") | 30/36 | 30/36 | 30/36 | 30/36 | 700 | #10384F |
| Month ("Jul") | 12/16 | 12/16 | 12/16 | 12/16 | 700 | #D30F4B |
| Year ("2026") | 14/20 | 14/20 | 14/20 | 14/20 | 400 | #406072 |
| Tag chip | 12/16 italic +0.40px | same | same | same | 500 | #0E6801 on #ECF8DD |
| Overview link | 14/20 italic +0.40px | same | same | same | 500 | #10384F |
| Add to Calendar | 14/20 italic +0.40px | same | same | same | 500 | #10384F |

**Layout / spacing**: container gap 32px (`gap-8`); event-item gap 16px; content gap 16px; tag gap 10px.
Items wrapper uses a **CSS grid**: 1 column at SM/MD, **2 columns at LG/XL** (`grid-cols-1 lg:grid-cols-2`,
`gap-8`). Frame padding per viewport per the content-divider tokens. Exact values confirmed in the
Figma-values step.

---

## Actual DOM Structure (from live inspection)

```html
<section data-qa="curated-event-teaser-group" data-testid="curated-event-teaser-group"
         class="flex w-full flex-col gap-8">
  <h2 data-qa="title-component">Title</h2>                <!-- group title -->
  <a data-qa="Link" href="http://google.com">Overview</a> <!-- overview link (AC7), sibling to title, outside items -->
  <div data-qa="curated-event-teaser-items" data-testid="curated-event-teaser-items"
       class="grid grid-cols-1 gap-8 lg:grid-cols-2">      <!-- 6 event items on this page -->

    <!-- Event WITH an Event Page (AC5 state) -->
    <section data-qa="event-teaser-list-item" data-testid="event-teaser-list-item">
      <time data-qa="day-tag" data-testid="day-tag" aria-label="July 9, 2026">
        <div data-testid="day-tag-day">09</div>            <!-- day number: data-testid only -->
        <!-- month + year sub-elements (no data-qa) -->
      </time>
      <div>
        <ul data-qa="tags" data-testid="tags" aria-label="Tags: 3 items">
          <li data-qa="tag-chip">Working at Bayer</li>
          <li data-qa="tag-chip">Events</li>
          <li data-qa="tag-chip">Community Impact</li>
        </ul>
        <h2 data-qa="title-component" class="... cursor-pointer">Annual Stockholders' Meeting 2026</h2>
        <button data-qa="add-to-calendar-button" data-testid="add-to-calendar-button">
          Add to Calendar <svg data-qa="icon"/>
        </button>
      </div>
      <!-- event-page arrow link: NO data-qa; aria-label = event title, href = event page -->
      <a aria-label="Annual Stockholders' Meeting 2026"
         href="https://www.bayer.com/en/investors/ir-team"
         class="flex shrink-0 flex-col items-end self-stretch"> <svg data-qa="icon"/> </a>
    </section>

    <!-- Event WITHOUT an Event Page (AC6 state) - e.g. "BayerEvents", "Hybrid without address" -->
    <section data-qa="event-teaser-list-item" data-testid="event-teaser-list-item">
      <time data-qa="day-tag" ...> ... </time>
      <div>
        <!-- tags optional; may be absent -->
        <h2 data-qa="title-component">BayerEvents</h2>
        <button data-qa="add-to-calendar-button" ...>Add to Calendar</button>
      </div>
      <!-- NO wrapping <a> event-page link for this item -->
    </section>

  </div>
</section>
```

**Locator notes:**
- The event-page arrow link has **no `data-qa`** - locate structurally: an `<a>` inside the item whose `aria-label` equals the item's title text. SmartLocator with fallbacks required.
- The day number carries `data-testid="day-tag-day"` only (no `data-qa`).
- "Add to Calendar" is a `<button>` (JS-triggered ICS), not an `<a>` with a static `.ics` href.
- The classification `tags` list is optional per event (some items on this page have no `tags` list).
- Items with an Event Page have 3 direct children under `event-teaser-list-item` (date, content, anchor); items without have 2 (date, content).

### Per-event breakdown (this page)
| # | Event title | Arrow link? | href | AC |
|---|-------------|-------------|------|----|
| 1 | Annual Stockholders' Meeting 2026 | Yes | https://www.bayer.com/en/investors/ir-team | AC5 |
| 2 | Bayer Crop Science Investor Event | Yes | https://www.bayer.com/en/investors/bayer-crop-science-investor-event | AC5 |
| 3 | BayerEvents | No | - | AC6 |
| 4 | BayerEvents test | Yes | http://google.com | AC5 |
| 5 | BayerSports | Yes | https://www.bayer.in/en-in | AC5 |
| 6 | Hybrid without address | No | - | AC6 |

Dates on this page (today = 2026-07-13): Jul 9 / Jul 8 / Jul 8 / Jul 8 (past), Aug 13 / Jul 30 (future) -
confirms the curated variant displays past events (no future-only filter).

---

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|--------------|----|-----------|--------|
| TC-CETG1 | AC2 | Functional | Ready |
| TC-CETG2 | AC2, AC3 | Functional | Ready |
| TC-CETG3 | AC2 | Functional | Ready |
| TC-CETG4 | AC2 | Functional | Ready |
| TC-CETG5 | AC4 | Functional | Ready |
| TC-CETG6 | AC5 | Functional | Ready |
| TC-CETG7 | AC6 | Functional | Ready |
| TC-CETG8 | AC7, AC8 | Functional | Ready |
| TC-CETG9 | AC11 | Functional | Ready |
| TC-CETG10 | AC2 | Functional | Ready |
| TC-CETG11 | AC9 | Functional | Ready |
| TC-ACETG1 | AC2-AC8 | Accessibility | Ready |
| TC-ACETG2 | AC5, AC11 | Accessibility | Ready |
| TC-ACETG3 | AC2 | Accessibility | Ready |
| TC-ACETG4 | - | Accessibility | Ready |
| TC-ACETG5 | AC5 | Accessibility | Ready |
| TC-VCETG1 | Design | Visual | Ready |
| TC-VCETG2 | Design | Visual | Ready |
| TC-VCETG3 | Design | Visual | Ready |
| TC-VCETG4 | Design | Visual | Ready |
| TC-VCETG5 | Design | Visual | Ready |
| TC-VCETG6 | Design | Visual | Ready |
| TC-VCETG7 | Design | Visual | Ready |
| TC-PCETG1 | - | Performance | Ready |
| TC-PCETG2 | AC11 | Performance | Ready |

---

## Functional Test Cases

### TC-CETG1: Group structure renders correctly
**AC**: AC2
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**:
- Navigate to test page with Vercel auth applied.
- Cookie banner accepted.
- Default (XL/LG) viewport.

**Test Steps**:
1. Wait for the page to fully load.
2. Verify the group container `[data-qa="curated-event-teaser-group"]` is visible.
3. Verify the group title `[data-qa="curated-event-teaser-group"] [data-qa="title-component"]` exists and is non-empty.
4. Verify the items wrapper `[data-qa="curated-event-teaser-items"]` is visible.
5. For each `[data-qa="event-teaser-list-item"]`, verify it contains a `[data-qa="day-tag"]`, a title `[data-qa="title-component"]`, and an `[data-qa="add-to-calendar-button"]`.

**Expected Results**:
- Group container and items wrapper are visible (soft assertions).
- Group title is present and not empty (no exact-text assertion - language-agnostic).
- Every event item exposes the mandatory sub-elements: day-tag, title, and add-to-calendar. The classification tags list is OPTIONAL (an event may have no tags) and is validated separately in TC-CETG10.

---

### TC-CETG2: At most eight events are displayed
**AC**: AC2, AC3
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Count elements matching `[data-qa="curated-event-teaser-group"] [data-qa="event-teaser-list-item"]`.
2. Assert the count is between 1 and 8 inclusive.

**Expected Results**:
- Event count `>= 1` and `<= 8` (soft assertion). On the current test page this is expected to be exactly 6.

---

### TC-CETG3: Past, ongoing and future events are all displayed (no date filter)
**AC**: AC2
**Priority**: Medium
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded; at least one event present.

**Test Steps**:
1. For each event, read the machine-readable date from `[data-qa="day-tag"]` (the `datetime` attribute if present, else the `aria-label`).
2. Parse each into a comparable date value.
3. Verify events are rendered regardless of whether their date is before or after today (i.e. no future-only filtering is applied - unlike the automated variant).

**Expected Results**:
- All configured events render irrespective of date (soft assertion).
- Curated-specific: the presence of at least one past-dated event on this page confirms past events are not filtered out. No ascending-order assertion is made (curated order = configured order, not date-sorted).

---

### TC-CETG4: Each event's date (day-tag) renders
**AC**: AC2
**Priority**: Medium
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. For each `[data-qa="event-teaser-list-item"]`, locate the child `[data-qa="day-tag"]`.
2. Verify it is a `<time>` element with a non-empty `aria-label`.
3. Verify the day-number sub-element `[data-testid="day-tag-day"]` is present and numeric.

**Expected Results**:
- Each event exposes a day-tag with an accessible date label and a numeric day value (soft assertions). No month-name text assertion (language-agnostic).

---

### TC-CETG5: "Add to Calendar" control present on each event
**AC**: AC4
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. For each `[data-qa="event-teaser-list-item"]`, locate the child `[data-qa="add-to-calendar-button"]`.
2. Verify it is visible and enabled.

**Expected Results**:
- Each event exposes a visible, enabled Add-to-Calendar control (soft assertion).
- The count of Add-to-Calendar buttons equals the count of event items.

---

### TC-CETG6: Event with an Event Page - arrow present and navigates
**AC**: AC5
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded; at least one event has an Event Page (events 1, 2, 4, 5 on the test page).

**Test Steps**:
1. Identify an event item that contains a wrapping `<a>` whose `aria-label` matches its title.
2. Verify the anchor has a non-empty `href`.
3. Click the arrow/anchor.
4. Wait for navigation and capture the resulting URL.

**Expected Results**:
- The anchor exists with a valid `href` (soft assertion).
- After click, the browser navigates away from the test page toward the event's `href` target.

---

### TC-CETG7: Event without an Event Page - no arrow, not clickable
**AC**: AC6
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded; at least one event has no Event Page (events 3 "BayerEvents" and 6 "Hybrid without address").

**Test Steps**:
1. Identify an event item that has no wrapping `<a>` with an `aria-label` matching its title.
2. Verify there is no event-page anchor within that item.
3. (Optional) Confirm clicking the title does not cause navigation.

**Expected Results**:
- No event-page anchor is present for that item (soft assertion).
- Clicking does not navigate away from the test page.

---

### TC-CETG8: Overview link behaviour - present and navigates, or absent
**AC**: AC7, AC8
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded. Test adapts to whether an overview link is configured on the page.

**Test Steps**:
1. Within the group scope `[data-qa="curated-event-teaser-group"]`, locate the overview anchor - the `a[data-qa="Link"]` that sits outside the items wrapper (the per-event arrow anchors have no `data-qa`).
2. If no overview link is present: assert absence (AC8) and finish.
3. If present (AC7): assert it is visible and has a non-empty `href`.
4. Determine whether `href` is same-origin as the test page.
5. Click the overview link and wait briefly.
6. If same-origin: assert the URL changed. If external and the URL did not change (host unresolvable in-sandbox): record a soft observation (link + href already validated).

**Expected Results**:
- AC8 branch: no overview link rendered at group level (soft assertion).
- AC7 branch: overview link visible with a non-empty `href` (soft assertions). Navigation is asserted for same-origin targets; for an external target that the sandbox cannot resolve (`ERR_NAME_NOT_RESOLVED`), link presence + valid href is the deterministic evidence and the final navigation is logged as a soft observation (see Known Limitations).

---

### TC-CETG9: "Add to Calendar" click triggers an ICS download
**AC**: AC11
**Priority**: High
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded; downloads permitted in the browser context.

**Test Steps**:
1. Set up a Playwright `download` event listener (`waitForEvent('download')`).
2. Click an event's `[data-qa="add-to-calendar-button"]`.
3. Capture the download and read its suggested filename.

**Expected Results**:
- A download event fires (soft assertion).
- The suggested filename ends with `.ics` (case-insensitive).
- If the control instead opens a new tab / calls an API without a download, the test logs the observed behaviour for triage (see Known Limitations).

---

### TC-CETG10: Classification tags render per event (when present)
**AC**: AC2
**Priority**: Medium
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. For each event item, check for `[data-qa="tags"]`.
2. Where present, count child `[data-qa="tag-chip"]` elements and compare against the `aria-label` count (e.g. "Tags: N items").

**Expected Results**:
- Where a tags list exists, at least one `tag-chip` renders and the chip count matches the `aria-label` count (soft assertion). Tags are optional per event; absence is not a failure. No exact tag-text assertion (language-agnostic).

---

### TC-CETG11: Overview / Add-to-Calendar labels render with accessible text
**AC**: AC9
**Priority**: Low
**Tags**: @Functional @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Read the accessible name/text of an Add-to-Calendar button.
2. If an overview link is configured, read its accessible name/text.

**Expected Results**:
- The control exposes non-empty accessible text (soft assertion). No specific string is asserted - only that a label is rendered (labels are dictionary-driven and locale-dependent). The Overview link label is also asserted when an overview link is configured on the page.

---

## Accessibility Test Cases

### TC-ACETG1: axe-core WCAG 2.1 AA scan
**AC**: AC2-AC8
**Priority**: High
**Tags**: @Accessibility @CuratedEventsTeaserGroup

**Preconditions**: Component loaded; axe-core integrated.

**Test Steps**:
1. Run an axe-core analysis scoped to `[data-qa="curated-event-teaser-group"]`.
2. Filter results to WCAG 2.1 A/AA rules.

**Expected Results**:
- No critical or serious violations within the component scope (soft assertion). Violations are logged with rule id and node for triage.

---

### TC-ACETG2: Keyboard operability of interactive elements
**AC**: AC5, AC11
**Priority**: High
**Tags**: @Accessibility @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Tab through the component and confirm focus reaches each Add-to-Calendar button and each event-page arrow.
2. Activate a focused arrow with Enter; activate an Add-to-Calendar button with Enter/Space.

**Expected Results**:
- All interactive elements are reachable via keyboard and operable via Enter/Space (soft assertion).

---

### TC-ACETG3: Semantic structure
**AC**: AC2
**Priority**: Medium
**Tags**: @Accessibility @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Verify the day-tag is a `<time>` element with an `aria-label` describing the full date.
2. Verify each tags list (where present) is a `<ul>` with an `aria-label` (e.g. "Tags: N items").
3. Verify event titles are heading elements (h2).

**Expected Results**:
- Semantic elements and ARIA labels present as above (soft assertions).

---

### TC-ACETG4: Visible focus indicators
**AC**: -
**Priority**: Medium
**Tags**: @Accessibility @CuratedEventsTeaserGroup

**Preconditions**: Component loaded.

**Test Steps**:
1. Focus an arrow and an Add-to-Calendar button in turn.
2. Verify a visible focus style is applied (e.g. focus-visible ring / outline).

**Expected Results**:
- Each interactive element shows a visible focus indicator when focused (soft assertion).

---

### TC-ACETG5: Event-page arrow link has an accessible name
**AC**: AC5
**Priority**: Medium
**Tags**: @Accessibility @CuratedEventsTeaserGroup

**Preconditions**: Component loaded; an event with an Event Page present.

**Test Steps**:
1. Locate an event-page anchor.
2. Read its accessible name (`aria-label`).

**Expected Results**:
- The anchor exposes a non-empty accessible name equal to (or containing) the event title (soft assertion).

---

## Visual Test Cases

> All visual assertions import values from `CuratedEventsTeaserGroup_FigmaValues.ts` via `getValuesByViewport`. No hardcoded design values. Run per viewport: XL 1440, LG 1024, MD 768, SM 375.

### TC-VCETG1: Group title typography per viewport
**AC**: Design
**Priority**: High
**Tags**: @Visual @CuratedEventsTeaserGroup

**Preconditions**: Component loaded at target viewport.

**Test Steps**:
1. Resolve expected tokens via `getValuesByViewport(vp).groupTitle`.
2. Read computed styles of `[data-qa="curated-event-teaser-group"] > [data-qa="title-component"]`.
3. Compare font-family, font-size, line-height, font-weight, colour.

**Expected Results**:
- Computed styles match Figma (XL/LG 48/56; MD/SM 30/36; weight 700; #10384F) (soft assertions).

---

### TC-VCETG2: Event title typography
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @CuratedEventsTeaserGroup

**Test Steps**:
1. Resolve `getValuesByViewport(vp).eventTitle`.
2. Read computed styles of an event item's `[data-qa="title-component"]`.
3. Compare font-family, size, line-height, weight, colour.

**Expected Results**:
- Matches Figma (XL/LG 24/30; MD/SM 20/30; weight 700; #10384F) (soft assertions).

---

### TC-VCETG3: Day-tag typography (day / month / year)
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @CuratedEventsTeaserGroup

**Test Steps**:
1. Resolve `dayNumber`, `monthLabel`, `yearLabel` tokens.
2. Read computed styles of the day number (`[data-testid="day-tag-day"]`), month, and year sub-elements.
3. Compare size/line-height/weight/colour for each.

**Expected Results**:
- Day 30/36 #10384F; month 12/16 #D30F4B; year 14/20 #406072 (soft assertions).

---

### TC-VCETG4: Tag-chip typography and colours
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @CuratedEventsTeaserGroup

**Test Steps**:
1. Resolve `getValuesByViewport(vp).tagChip`.
2. Read computed styles of a `[data-qa="tag-chip"]`.
3. Compare font-size, line-height, weight, letter-spacing, text colour and background colour.

**Expected Results**:
- 12/16, weight 500, +0.40px, text #0E6801 on background #ECF8DD (soft assertions).

---

### TC-VCETG5: Add-to-Calendar label typography
**AC**: Design
**Priority**: Low
**Tags**: @Visual @CuratedEventsTeaserGroup

**Test Steps**:
1. Resolve the `addToCalendar` tokens.
2. Read computed styles of an Add-to-Calendar button label.
3. Compare size/line-height/weight/letter-spacing/colour/text-transform.

**Expected Results**:
- 14/20, weight 500, +0.40px, uppercase, italic, #10384F (soft assertions).

---

### TC-VCETG6: Spacing and layout tokens
**AC**: Design
**Priority**: Low
**Tags**: @Visual @CuratedEventsTeaserGroup

**Test Steps**:
1. Resolve `getValuesByViewport(vp).layout`.
2. Read computed gaps/padding of the group container, items wrapper, event item, tags list.
3. Read the day-tag block width.

**Expected Results**:
- Container gap 32px; items grid gap 32px; content gap 16px; tag gap 10px; frame padding per viewport (soft assertions). Values asserted from the Figma-values file.

---

### TC-VCETG7: Responsive arrangement (grid columns)
**AC**: Design
**Priority**: Medium
**Tags**: @Visual @CuratedEventsTeaserGroup

**Test Steps**:
1. At SM and MD, verify the items wrapper `[data-qa="curated-event-teaser-items"]` renders as a single-column grid (`grid-template-columns` resolves to 1 track).
2. At LG and XL, verify it renders as a two-column grid (2 tracks).

**Expected Results**:
- 1 column at SM/MD, 2 columns at LG/XL (soft assertions). Note: curated uses a CSS grid (`grid-cols-1 lg:grid-cols-2`), distinct from the automated variant's flex row.

---

## Performance Test Cases

### TC-PCETG1: Component render/load time
**AC**: -
**Priority**: Low
**Tags**: @Performance @CuratedEventsTeaserGroup

**Test Steps**:
1. Navigate to the test page and measure time until `[data-qa="curated-event-teaser-group"]` is visible.

**Expected Results**:
- Component becomes visible within an agreed threshold (e.g. < 5s on QA) (soft assertion; threshold configurable).

---

### TC-PCETG2: Add-to-Calendar interaction responsiveness
**AC**: AC11
**Priority**: Low
**Tags**: @Performance @CuratedEventsTeaserGroup

**Test Steps**:
1. Click an Add-to-Calendar button and measure time to the download event (or observed response).

**Expected Results**:
- The download/response occurs within an agreed threshold (soft assertion).

---

## Prerequisites
- Vercel HTTP basic auth: bayercorp / beyond2026 (handled by BasePage).
- Cookie banner acceptance (handled by BasePage `acceptCookiesBanner()`).
- `TEST_ENV=qa` (test page is on the QA Vercel host).
- Figma values file present: `helpers/utils/figma-values/CuratedEventsTeaserGroup_FigmaValues.ts`.
- Downloads allowed in the browser context for TC-CETG9.

## Assumptions and Notes
- Labels ("Overview", "Add to Calendar") are dictionary-driven and locale-dependent; only structural presence is asserted, never exact text (language-agnostic rule).
- The event-page arrow link has no `data-qa`; located structurally by `aria-label` matching the event title (SmartLocator with fallbacks).
- "Add to Calendar" is a `<button>` invoking a JS ICS download, not an anchor with a `.ics` href.
- Curated order = configured selection order; no date-sort or future-only filter is applied, so past events are expected to appear.
- The classification tags list is optional per event.

## Known Limitations
- **AC7 (overview link present and navigates)** is now covered - an overview link is configured on the test page. However its configured target is the **external host `http://google.com`, which the test sandbox cannot resolve** (`net::ERR_NAME_NOT_RESOLVED`), so the browser does not complete navigation and `page.url()` does not change. TC-CETG8 therefore asserts the deterministic evidence (link visible + non-empty href) and treats the external navigation as a soft observation. For a hard end-to-end navigation assertion, configure the overview link to a same-origin/resolvable target, or run in an environment with external network access. (The same constraint affects any event-page arrow whose href is an unreachable external host; TC-CETG6 uses the first arrow, which targets a resolvable bayer.com URL.)
- **AC8 (overview not shown)** is exercised only when no overview link is configured; TC-CETG8 adapts to either state.
- **AC1, AC10** are CMS/backend concerns and out of frontend scope.
- **AC11**: if the Add-to-Calendar control opens a tab or calls an API without a browser download, TC-CETG9 will be adjusted after observing actual behaviour during implementation.
- Figma design tokens in "Design Reference Values" are the shared compact-teaser reference and are confirmed against the Figma node in the Figma-values step; the FigmaValues file is the source of truth for the specs.
