# Event List - Test Cases

## Component Information
- **Component Name**: Event List (automated)
- **User Story**: 1582 (State: QA in progress)
- **Test Page URL**: Sitecore XM Cloud **preview / editing host** (Vercel currently renders no events)
  `https://xmc-5w8kyifj4ay9xisr7dk5sx-eh.sitecorecloud.io/api/editing/render?sc_itemid=3b8959b6-365e-4442-aa40-047a90c11833&sc_lang=en&sc_site=bayer-uk-qa&sc_layoutKind=final&mode=preview&secret=***&route=%2Fdevelop%2Ftest-catalyst-page%2Fcontent-catalyst-page%2Fqadontdelete%2Fqamanual%2Fsprint24%2Feventlist&tenant_id=***&sc_version=1`
- **Authentication**: reuse `.auth/sitecore-editing.json` via Playwright `storageState`. The editing host sits behind its own "Editing Host Protection" Auth0 login — the portal session (`.auth/sitecore.json`) does NOT grant access. Capture with the one-time headed login through the preview URL.
- **Figma URL**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19519-46985
- **Last Updated**: 2026-07-09
- **Test Status**: Ready
- **Scope**: Frontend only (rendering/interaction). CMS authoring/data-model ACs are out of scope.

## Requirements Summary
The Event List component displays a chronological list of events sourced from the Event Datamodel. It shows future & ongoing events by default (end date ≥ today), grouped by year and sorted ascending by start date. A "Past Events" toggle switches to an archive view (past events, descending by start date), with a "Future Events" toggle to return. Content Editors may optionally pre-filter by Event Category and/or Classification Tag (ANY-OF), configure pagination (on/off) and item count, set the component title, and edit central dictionary labels ("Past Events", "Future Events", "Online", "Add to Calendar").

Each event renders: a simple date block (month abbreviation + day + year), the event title, meta rows (date range, location), an "Add to Calendar" (ICS) action, optional classification tags, and — only when an Event Page is configured — an arrow link to that page. Location renders per mode: Offline → icon + address; Online → icon + "Online"; Hybrid → icon + "Online" + address.

### Acceptance Criteria
- **AC1**: Editor can create/update/delete Events List in 50%+ content dividers. — *CMS authoring, not FE-testable*
- **AC2**: Editor can optionally select Event Category and/or Classification Tag prefilters. — *CMS authoring, not FE-testable*
- **AC3**: No prefilters → all future & ongoing events shown (end date ≥ today). — **FE-testable**
- **AC4**: Prefilters applied → only events matching selected filters (ANY-OF). — *Partially FE (needs a prefiltered instance; not on this test page)*
- **AC5**: Event with no ICS override → "Add to Calendar" provides an auto-generated ICS download. — **FE-testable**
- **AC6**: Event with ICS override → "Add to Calendar" provides the override ICS download. — **FE-testable (structure)**
- **AC8**: Click "Past Events →" → past events shown, reverse chronological (DESC by start date). — **FE-testable**
- **AC9**: Event with Event Page configured → arrow icon links to the Event Page. — **FE-testable**
- **AC10**: Event with no Event Page → no arrow icon, no link, not clickable. — **FE-testable**
- **AC11**: Editor can choose full dataset with pagination vs. only recent matching events (ASC by start date). — *ASC FE-testable; pagination ON not present on this instance*
- **AC12**: Editor can set item count (items per page / total). — *CMS config; FE shows the resulting count*
- **AC13**: Editable central labels for "Past Events", "Future Events", "Online", "Add to Calendar". — *Drives the language-agnostic assertion rule (never assert exact label text)*
- **AC14**: Publishing new/updated data reflects immediately. — *CMS/data, not FE-testable in isolation*

**Frontend-testability note**: AC1, AC2, AC12 (config), AC14 are CMS/authoring concerns and are out of scope. AC4 and AC11-pagination-ON require a differently-configured instance and are documented as limitations. Everything else is covered below. Per AC13, all labels are dictionary-driven, so tests validate **structure/attributes**, not literal text.

## Actual DOM Structure (from live inspection)

```html
<section data-qa="event-list" data-testid="event-list">
  <div>                                              <!-- header block (no data-qa) -->
    <h2 data-qa="title-component"><span>Bayer Upcoming</span><span data-qa="stage-headline-text">Events</span></h2>
    <button><span>Past Events</span></button>        <!-- future<->past toggle: NO data-qa -->
  </div>
  <div>                                              <!-- year group -->
    <div><span>2026</span><hr></div>                 <!-- year header: NO data-qa -->
    <section data-qa="event-list-item" data-testid="event-list-item">
      <div>
        <time data-qa="day-tag" data-testid="day-tag" aria-label="June 4, 2026">
          <div><div>Jun</div><div data-testid="day-tag-day">04</div></div>
          <div>2026</div>
        </time>
        <div>
          <h2 data-qa="title-component">onlinewithoutlink</h2>       <!-- event title -->
          <div>
            <div data-qa="meta-tag" data-testid="meta-tag"><svg data-qa="icon"/><span>4 June 2026 – 14 April 2027</span></div>
            <div data-qa="meta-tag" data-testid="meta-tag"><svg data-qa="icon"/><span>Online</span></div>
          </div>
          <ul data-qa="tags" data-testid="tags" aria-label="Tags: 2 items">…</ul>   <!-- optional -->
          <div><span>
            <button data-qa="add-to-calendar-button" data-testid="add-to-calendar-button">
              <svg data-qa="icon"/><span>Add to Calendar</span>
            </button>
          </span></div>
        </div>
      </div>
      <a href="…" aria-label="View event: …">…</a>   <!-- arrow link: NO data-qa; ONLY when event page configured -->
    </section>
    <hr>
    <!-- … more event-list-item sections … -->
  </div>
</section>
```

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|--------------|----|-----------|--------|
| TC-EL001 | AC3 | Functional | Ready |
| TC-EL002 | AC13 | Functional | Ready |
| TC-EL003 | AC3 | Functional | Ready |
| TC-EL004 | AC3 | Functional | Ready |
| TC-EL005 | AC3 | Functional | Ready |
| TC-EL006 | AC3 | Functional | Ready |
| TC-EL007 | AC13 | Functional | Ready |
| TC-EL008 | AC5, AC6 | Functional | Ready |
| TC-EL009 | AC5 | Functional | Ready |
| TC-EL010 | AC9 | Functional | Ready |
| TC-EL011 | AC10 | Functional | Ready |
| TC-EL012 | AC2 | Functional | Ready |
| TC-EL013 | AC8, AC13 | Functional | Ready |
| TC-EL014 | AC11 | Functional | Ready |
| TC-AEL001 | AC13 | Accessibility | Ready |
| TC-AEL002 | AC3 | Accessibility | Ready |
| TC-AEL003 | AC5 | Accessibility | Ready |
| TC-AEL004 | AC9 | Accessibility | Ready |
| TC-AEL005 | AC3 | Accessibility | Ready |
| TC-VEL001 | AC3 | Visual | Ready |
| TC-VEL002 | AC3 | Visual | Ready |
| TC-VEL003 | AC13 | Visual | Ready |
| TC-VEL004 | AC3 | Visual | Ready |
| TC-PEL001 | AC3 | Performance | Ready |

---

## Functional Test Cases

### TC-EL001: Event List container renders with correct structure
**AC**: AC3
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- `storageState` `.auth/sitecore-editing.json` applied to the context
- Cookie/consent banner accepted if shown
- Preview URL navigated, `networkidle` reached

**Test Steps**:
1. Navigate to the Event List preview URL with the saved editing-host session.
2. Accept the cookie banner if present.
3. Wait for the component to load.
4. Locate the container `[data-qa="event-list"]`.
5. Verify its tag name is `section`.

**Expected Results** (soft assertions):
- `[data-qa="event-list"]` exists and is visible.
- Container is a semantic `<section>`.
- Component renders without console errors blocking layout.

---

### TC-EL002: Component title renders
**AC**: AC13
**Priority**: Medium
**Tags**: @EventList @Functional

**Preconditions**:
- Event List container is visible (TC-EL001).

**Test Steps**:
1. Within `[data-qa="event-list"]` header, locate the first `[data-qa="title-component"]`.
2. Verify it is an `<h2>`.
3. Verify it is visible and non-empty.

**Expected Results** (soft assertions):
- The component title is present, an `<h2>`, and non-empty.
- No assertion on the literal title text (dictionary/editor-driven, AC13).

---

### TC-EL003: Event cards render (future events shown by default)
**AC**: AC3
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- Event List container is visible.
- Default view (no prefilter, future events).

**Test Steps**:
1. Locate all `[data-qa="event-list-item"]` under `[data-qa="event-list"]`.
2. Count the cards.
3. Verify at least one card is rendered and visible.

**Expected Results** (soft assertions):
- One or more `[data-qa="event-list-item"]` cards are visible.
- Card count is greater than zero (all future/ongoing events for the instance).

---

### TC-EL004: Each event card shows a date block
**AC**: AC3
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- Event cards are rendered (TC-EL003).

**Test Steps**:
1. For each `[data-qa="event-list-item"]`, locate the date block `[data-qa="day-tag"]`.
2. Verify it is a `<time>` element.
3. Verify it exposes an `aria-label` (accessible full date).
4. Verify the day number `[data-testid="day-tag-day"]` exists and is non-empty.

**Expected Results** (soft assertions):
- Every card has a visible `[data-qa="day-tag"]` `<time>` element.
- `aria-label` is present and non-empty on the date block.
- `[data-testid="day-tag-day"]` day number is present and non-empty.

---

### TC-EL005: Each event card shows an event title
**AC**: AC3
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- Event cards are rendered.

**Test Steps**:
1. For each `[data-qa="event-list-item"]`, locate the scoped title `[data-qa="event-list-item"] [data-qa="title-component"]`.
2. Verify it is visible and non-empty.

**Expected Results** (soft assertions):
- Every card has exactly one visible, non-empty title.
- Title is scoped inside the card (not the component header title).

---

### TC-EL006: Each event card shows the date meta row
**AC**: AC3
**Priority**: Medium
**Tags**: @EventList @Functional

**Preconditions**:
- Event cards are rendered.

**Test Steps**:
1. For each card, locate `[data-qa="meta-tag"]` rows.
2. Verify at least one meta row exists (the date range).
3. Verify each meta row contains an icon `[data-qa="icon"]` and a non-empty text span.

**Expected Results** (soft assertions):
- Every card has ≥ 1 `[data-qa="meta-tag"]` row.
- The first meta row (date) is non-empty and paired with an icon.

---

### TC-EL007: Location meta row renders per event mode
**AC**: AC13
**Priority**: Medium
**Tags**: @EventList @Functional

**Preconditions**:
- Cards include online, hybrid, and offline events.

**Test Steps**:
1. For cards that have a location meta row (2nd `[data-qa="meta-tag"]`), verify it is visible with an icon and non-empty text.
2. Structurally confirm the location row is optional (offline-without-address cards may omit it).

**Expected Results** (soft assertions):
- Where present, the location meta row is visible, has an icon, and non-empty text.
- No assertion on literal label text (Online/Hybrid/address are dictionary/data-driven, AC13).
- **Known observation**: hybrid card renders "Hybrid" rather than the AC-specified "Online" (+ address). See Known Limitations — validated structurally, flagged for analysis.

---

### TC-EL008: "Add to Calendar" (ICS) action present on every card
**AC**: AC5, AC6
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- Event cards are rendered.

**Test Steps**:
1. For each `[data-qa="event-list-item"]`, locate `[data-qa="add-to-calendar-button"]`.
2. Verify it is a `<button>`, visible and enabled.

**Expected Results** (soft assertions):
- Every card exposes a visible, enabled `[data-qa="add-to-calendar-button"]`.
- Count of buttons equals count of cards.

---

### TC-EL009: "Add to Calendar" triggers an ICS download
**AC**: AC5
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- At least one event card with an Add to Calendar button.

**Test Steps**:
1. Register a Playwright `download` event listener (or capture the request).
2. Click the first `[data-qa="add-to-calendar-button"]`.
3. Capture the resulting download / response.

**Expected Results** (soft assertions):
- A download (or `.ics` response) is initiated on click.
- The downloaded resource is an ICS/calendar payload (content-type or `.ics` suffix).
- If no download is produced, record it as a defect candidate (do not hard-fail the suite).

---

### TC-EL010: Arrow link present and navigable when Event Page is configured
**AC**: AC9
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- At least one card has an Event Page configured (an `<a>` inside the card).

**Test Steps**:
1. Identify cards containing a child `[data-qa="event-list-item"] > a` (arrow link).
2. Verify the link has a non-empty `href`.
3. Verify the link is visible and focusable.

**Expected Results** (soft assertions):
- Cards with an event page expose a child `<a>` with a non-empty `href`.
- Link is visible and keyboard-focusable.

---

### TC-EL011: No arrow link when Event Page is not configured
**AC**: AC10
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- At least one card has no Event Page configured.

**Test Steps**:
1. Identify cards without a child `<a>` arrow link.
2. Verify no navigable anchor exists directly inside such a card body.

**Expected Results** (soft assertions):
- Cards without an event page have no child arrow `<a>` and are not clickable to a detail page.
- Confirms AC10 (no icon/link, not clickable).

---

### TC-EL012: Classification tags render when configured
**AC**: AC2
**Priority**: Low
**Tags**: @EventList @Functional

**Preconditions**:
- At least one card has classification tags.

**Test Steps**:
1. For cards containing `[data-qa="tags"]`, verify the `<ul>` is visible.
2. Verify it has an `aria-label` describing the item count.
3. Verify at least one tag item is present and non-empty.

**Expected Results** (soft assertions):
- Where present, `[data-qa="tags"]` is visible with a non-empty `aria-label`.
- Tags are optional (cards without tags simply omit the element).

---

### TC-EL013: "Past Events" toggle switches to the archive view
**AC**: AC8, AC13
**Priority**: High
**Tags**: @EventList @Functional

**Preconditions**:
- Default (future) view is shown.
- The toggle button exists in the component header.

**Test Steps**:
1. Locate the toggle button inside `[data-qa="event-list"]` header (no data-qa — located by role within the container).
2. Capture the current first event's date.
3. Click the toggle.
4. Wait for the list to re-render.
5. Capture the new set of cards and their dates.

**Expected Results** (soft assertions):
- Clicking the toggle re-renders the list (card set changes).
- After toggling, a return toggle ("Future Events") is available.
- Past view ordering is reverse-chronological (DESC by start date) — validated by comparing card dates.
- No assertion on the literal button label (AC13 dictionary-driven).

---

### TC-EL014: Events grouped by year and ordered ascending by start date
**AC**: AC11
**Priority**: Medium
**Tags**: @EventList @Functional

**Preconditions**:
- Default (future) view with multiple events.

**Test Steps**:
1. Read each card's date via `[data-qa="day-tag"]` `aria-label` (accessible full date).
2. Parse the dates and verify non-decreasing order (ASC by start date).
3. Verify a year-group header is rendered (structural; note it lacks a data-qa).

**Expected Results** (soft assertions):
- Card dates are in ascending order in the default view.
- A year grouping header is present in the DOM.
- **Known limitation**: year header has no data-qa; grouping is validated by text/position, not by attribute.

---

## Accessibility Test Cases

### TC-AEL001: No critical axe-core violations
**AC**: AC13
**Priority**: High
**Tags**: @EventList @Accessibility

**Preconditions**:
- Component fully loaded; cookie banner dismissed.

**Test Steps**:
1. Run `AxeBuilder` scoped to `[data-qa="event-list"]`.
2. Filter results to WCAG 2.1 A/AA.

**Expected Results** (soft assertions):
- No critical/serious violations within the component scope.
- Any violations are reported (not silently ignored).

---

### TC-AEL002: Date block exposes an accessible date
**AC**: AC3
**Priority**: Medium
**Tags**: @EventList @Accessibility

**Test Steps**:
1. For each `[data-qa="day-tag"]`, read its `aria-label`.
2. Verify the value is non-empty.

**Expected Results** (soft assertions):
- Every date block `<time>` has a non-empty `aria-label` (accessible full date).

---

### TC-AEL003: "Add to Calendar" button is keyboard-accessible with a name
**AC**: AC5
**Priority**: Medium
**Tags**: @EventList @Accessibility

**Test Steps**:
1. Focus the first `[data-qa="add-to-calendar-button"]` via keyboard (Tab).
2. Verify it is focusable and has a non-empty accessible name.

**Expected Results** (soft assertions):
- The button is reachable by keyboard and exposes a non-empty accessible name.

---

### TC-AEL004: Arrow link exposes an accessible name
**AC**: AC9
**Priority**: Medium
**Tags**: @EventList @Accessibility

**Test Steps**:
1. For each card arrow link `[data-qa="event-list-item"] > a`, read its accessible name (aria-label or text).
2. Verify the accessible name is non-empty.

**Expected Results** (soft assertions):
- Every arrow link has a non-empty accessible name.
- **Known observation**: some cards render the arrow link without an `aria-label` — expected to fail here; flagged as an a11y defect candidate for analysis.

---

### TC-AEL005: Event titles use heading semantics
**AC**: AC3
**Priority**: Low
**Tags**: @EventList @Accessibility

**Test Steps**:
1. For each card title, verify it is a heading element (`h2`).
2. Verify heading order is not broken within the component.

**Expected Results** (soft assertions):
- Event titles are semantic headings.
- Heading levels are consistent within the component.

---

## Visual Test Cases

> Design values are extracted from Figma into `helpers/utils/figma-values/EventList_FigmaValues.ts` (Step 4). Assertions compare computed CSS against those values — never hardcoded. Run per viewport (XL/LG/MD/SM).

### TC-VEL001: Event title typography matches Figma
**AC**: AC3
**Priority**: Medium
**Tags**: @EventList @Visual

**Test Steps**:
1. Read computed `font-family`, `font-size`, `font-weight`, `line-height`, `color` of a card `[data-qa="title-component"]`.
2. Compare against `EventList_FigmaValues` for the active viewport.

**Expected Results** (soft assertions):
- Typography values match Figma within tolerance.

---

### TC-VEL002: Date block sizing/typography matches Figma
**AC**: AC3
**Priority**: Medium
**Tags**: @EventList @Visual

**Test Steps**:
1. Read computed styles of `[data-qa="day-tag"]` and the day number.
2. Verify the date block respects the max-width constraint (requirement: max-width 102px).
3. Compare typography against Figma values.

**Expected Results** (soft assertions):
- Date block width ≤ the Figma/requirement max (102px) and typography matches.

---

### TC-VEL003: Meta row typography/color matches Figma
**AC**: AC13
**Priority**: Low
**Tags**: @EventList @Visual

**Test Steps**:
1. Read computed styles of `[data-qa="meta-tag"] span`.
2. Compare font and color against Figma values.

**Expected Results** (soft assertions):
- Meta row text styling matches Figma within tolerance.

---

### TC-VEL004: "Add to Calendar" button styling matches Figma
**AC**: AC3
**Priority**: Low
**Tags**: @EventList @Visual

**Test Steps**:
1. Read computed styles of `[data-qa="add-to-calendar-button"]` (text color, border, spacing).
2. Compare against Figma values.

**Expected Results** (soft assertions):
- Button styling matches Figma within tolerance.

---

## Performance Test Cases

### TC-PEL001: Component renders within budget
**AC**: AC3
**Priority**: Low
**Tags**: @EventList @Performance

**Test Steps**:
1. Measure time from navigation to `[data-qa="event-list"]` visible.
2. Record against a soft budget.

**Expected Results** (soft assertions):
- Component becomes visible within the agreed soft budget.
- Timing recorded in the report (informational, non-blocking).

---

## Prerequisites
- Node dependencies installed (`npm install`), Playwright browsers available.
- A valid editing-host session captured at `.auth/sitecore-editing.json` (one-time headed login through the preview URL; MFA-approved).
- The Event List preview page is reachable and renders events (Vercel currently does not — use the preview/editing host).
- Figma token/node IDs available for visual tests (Step 4).

## Assumptions and Notes
- All labels ("Past Events", "Future Events", "Online", "Add to Calendar") are dictionary-driven (AC13); assertions are structural/attribute-based and language-agnostic — never assert literal label text.
- Soft assertions only; a single element failure must not abort the whole run.
- All child element queries are scoped under `[data-qa="event-list-item"]` (parent → child), since `title-component`/`icon` are reused elsewhere on the page.

## Known Limitations
1. **Missing data-qa on key elements** — the Past/Future toggle, the year-group header, and the per-card arrow link have no `data-qa`. They are located by role/structure; recommend adding data-qa for stable automation.
2. **Arrow-link aria-label inconsistency** — some event cards render the arrow link without an `aria-label` (others include `View event: …`). Covered by TC-AEL004; flagged as an a11y defect candidate.
3. **Hybrid location label** — the hybrid card renders "Hybrid" rather than the AC-specified "Online" (+ address). Covered structurally by TC-EL007; flagged for analysis.
4. **Event Category label** — the requirement lists a per-event Event Category label; the current DOM renders only Classification Tags. No distinct category element found — flagged for analysis.
5. **Pagination ON / prefilters** — this preview instance shows all 7 future events with pagination off and no prefilter, so AC4 and AC11 (pagination-ON) cannot be exercised here; a differently-configured instance is required.
