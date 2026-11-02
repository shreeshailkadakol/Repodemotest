# Tabbed Content Component - Test Cases

## Component Information
- **Component Name:** Tabbed Content Component (TabbedComponent)
- **User Story:** 683 (State: QA in progress)
- **Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/tabbedcomponent
- **Figma URL:** https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=21949-7557&m=dev
- **Last Updated:** 2026-07-22
- **Test Status:** Implemented
- **Scope:** Frontend only (rendering + interaction). CMS authoring is out of scope.

## Requirements Summary
The Tabbed Content Component displays a horizontal tab navigation at the top with tab-related content (Text+Image) rendered below. Each tab represents a distinct content set. When a visitor selects a tab, the corresponding content is displayed while the navigation remains visible and the current tab is highlighted. For many tabs or smaller screens, the tab navigation supports horizontal scrolling. Implementation is comparable to the regular accordion (Radix UI Tabs).

### Acceptance Criteria
- **AC1:** Given a content editor is in the CMS backend, when the editor adds a Tabbed Content Component, then the editor can create, name, and reorder tabs (insert into content dividers 50% or bigger).
- **AC2:** Given a content editor selects a specific tab in the CMS backend, when the editor adds content to the tab, then only Text-Image components can be added for each tab (first tab element auto-created; same logic as accordion).
- **AC3:** When a site visitor views a page containing the component, then the tab navigation is displayed horizontally above the content of the selected tab (default: first tab selected).
- **AC4:** When a site visitor selects a tab, then the selected tab gets highlighted and the content below updates to match the selected tab while the tab navigation remains visible.
- **AC5:** Given the number of tabs exceeds the available horizontal space, when the component is displayed, then a horizontal scrollbar is available to navigate through the tabs.

**Frontend-testability note:** AC1 and AC2 are CMS-backend behaviours (authoring) and are **out of frontend scope**. AC3, AC4, and AC5 are validated by this suite.

## Design Reference Values (Figma node 21949-7554, component sets tab-row / tab-item)
Tab typography (`text-lg/regular`) is consistent across XL/LG/MD/SM.

| Token | Value |
|---|---|
| Tab font-family | Bayer Sans |
| Tab font-size | 18px |
| Tab font-weight | 400 |
| Tab line-height | 28px |
| Tab item padding | 16px 24px |
| Tab list gap | 2px |
| Active tab text color | #FFFFFF / rgba(255,255,255,1) |
| Active tab background | #10384F / rgba(16,56,79,1) |
| Active tab bottom border | 2px solid #FF3162 / rgba(255,49,98,1) |
| Inactive tab text color | #10384F / rgba(16,56,79,1) |
| Tab-row to content gap | 32px |

## Actual DOM Structure (from live inspection)
```html
<section data-qa="tabbed-content" data-testid="tabbed-content">
  <div data-qa="tabbed-component" data-testid="tabbed-component" class="flex w-full flex-col gap-8">
    <div class="relative h-[59px] w-full">
      <div class="h-full w-full overflow-x-auto overflow-y-clip">      <!-- scroll container (AC5) -->
        <div role="tablist" aria-label="Content tabs" class="flex items-center gap-[2px] pr-20">
          <button role="tab" aria-selected="true"  data-state="active"   aria-controls="radix-...-content-..." class="px-6 py-4 text-lg">Austria</button>
          <button role="tab" aria-selected="false" data-state="inactive" aria-controls="radix-...-content-...">Croatia</button>
          <!-- 14 tabs total -->
        </div>
      </div>
      <button aria-label="Scroll tabs right" class="pointer-events-auto absolute ...">
    </div>
    <div role="tabpanel" id="radix-...-content-..." data-state="active"   class="w-full outline-none">
      <section data-qa="text-image-block" data-testid="text-image-block"> ... </section>
    </div>
    <div role="tabpanel" id="radix-...-content-..." data-state="inactive" hidden></div>
    <!-- 14 panels total -->
  </div>
</section>
```
Notes: tablist/tab/tabpanel expose ARIA **roles** but no `data-qa`. Radix element IDs (`radix-*`) are dynamic and must not be hardcoded. Locators use role + scoped CSS (language-agnostic).

## Traceability Matrix
| Test Case ID | AC | Test Type | Status |
|---|---|---|---|
| TC-TC1 | AC3 | Functional | Implemented |
| TC-TC2 | AC3 | Functional | Implemented |
| TC-TC3 | AC3 | Functional | Implemented |
| TC-TC4 | AC4 | Functional | Implemented |
| TC-TC5 | AC4 | Functional | Implemented |
| TC-TC6 | AC5 | Functional | Implemented |
| TC-TC7 | AC4 | Functional | Implemented |
| TC-ATC1 | AC3 | Accessibility | Implemented |
| TC-ATC2 | AC3/AC4 | Accessibility | Implemented |
| TC-ATC3 | AC4 | Accessibility | Implemented |
| TC-ATC4 | AC4 | Accessibility | Implemented |
| TC-VTC1-{XL,LG,MD,SM} | AC4 | Visual | Implemented (per viewport) |
| TC-VTC2-{XL,LG,MD,SM} | AC3 | Visual | Implemented (per viewport) |
| TC-VTC3-{XL,LG,MD,SM} | AC5 | Visual | Implemented (per viewport) |

---

## Functional Test Cases

### TC-TC1: Component renders with tab navigation and content panel
**AC:** AC3
**Priority:** High
**Tags:** @Functional @Smoke

**Preconditions:**
- Vercel basic auth applied; cookie banner accepted.
- Viewport: default (XL, 1280px).

**Test Steps:**
1. Navigate to the test page.
2. Locate the component container (`[data-qa="tabbed-content"]`).
3. Locate the tab navigation (`[role="tablist"]`).
4. Locate the active content panel (`[role="tabpanel"][data-state="active"]`).
5. Count the tabs.

**Expected Results:**
- Component container is visible (soft).
- Tab navigation is visible (soft).
- Active content panel is visible (soft).
- Tab count is greater than 1 (soft).

---

### TC-TC2: First tab is selected by default
**AC:** AC3
**Priority:** High
**Tags:** @Functional

**Preconditions:**
- Page loaded, no tab interaction performed.

**Test Steps:**
1. Locate the first tab (`[role="tab"]` index 0).
2. Read its `aria-selected` and `data-state` attributes.

**Expected Results:**
- First tab has `aria-selected="true"` (soft).
- First tab has `data-state="active"` (soft).

---

### TC-TC3: Tab navigation renders horizontally above the content panel
**AC:** AC3
**Priority:** Medium
**Tags:** @Functional

**Preconditions:**
- Page loaded at XL viewport.

**Test Steps:**
1. Get the bounding box of the tab list.
2. Get the bounding box of the active panel.
3. Compare vertical positions.

**Expected Results:**
- Both bounding boxes exist (soft).
- Tab list top offset (`y`) is less than the panel top offset — navigation sits above content (soft).

---

### TC-TC4: Selecting another tab moves selection and swaps the content panel
**AC:** AC4
**Priority:** High
**Tags:** @Functional

**Preconditions:**
- Page loaded; first tab active by default.

**Test Steps:**
1. Read the `aria-controls` of the second tab (target panel id).
2. Click the second tab.
3. Re-read selection state of first and second tabs.
4. Read the id of the now-visible active panel.

**Expected Results:**
- Second tab becomes `aria-selected="true"` (soft).
- First tab becomes `aria-selected="false"` (soft).
- Visible panel id equals the second tab's `aria-controls` (soft) — content swapped.

---

### TC-TC5: Exactly one tab panel is visible at a time
**AC:** AC4
**Priority:** Medium
**Tags:** @Functional

**Preconditions:**
- Page loaded.

**Test Steps:**
1. Count visible panels (`[role="tabpanel"]:not([hidden])`).
2. Click the second tab.
3. Count visible panels again.

**Expected Results:**
- Exactly one panel visible by default (soft).
- Exactly one panel visible after switching tabs (soft).

---

### TC-TC6: Tab navigation scrolls horizontally when tabs overflow
**AC:** AC5
**Priority:** High
**Tags:** @Functional

**Preconditions:**
- Page loaded at XL viewport with enough tabs to overflow.

**Test Steps:**
1. Read scroll metrics of the scroll container (`scrollWidth`, `clientWidth`, `scrollLeft`).
2. Set `scrollLeft` to 200px.
3. Re-read scroll metrics.

**Expected Results:**
- `scrollWidth` is greater than `clientWidth` — content overflows (soft).
- After scrolling, `scrollLeft` is greater than 0 — horizontal scroll works (soft).

---

### TC-TC7: Active panel contains the Text-Image content block
**AC:** AC4
**Priority:** Medium
**Tags:** @Functional

**Preconditions:**
- Page loaded; first tab active.

**Test Steps:**
1. Locate the Text-Image block within the active panel (`[data-qa="text-image-block"]`).

**Expected Results:**
- Text-Image block is visible inside the active panel (soft).

---

## Accessibility Test Cases

### TC-ATC1: Tablist exposes role=tablist with an accessible name
**AC:** AC3
**Priority:** High
**Tags:** @Accessibility

**Preconditions:**
- Page loaded.

**Test Steps:**
1. Locate the tab list.
2. Read its `role` and `aria-label`.

**Expected Results:**
- `role="tablist"` (soft).
- `aria-label` is non-empty (soft).

---

### TC-ATC2: Tabs and panels expose correct roles and selection state
**AC:** AC3, AC4
**Priority:** High
**Tags:** @Accessibility

**Preconditions:**
- Page loaded.

**Test Steps:**
1. Locate the first tab; read `role` and `aria-selected`.
2. Count tabpanels and tabs.

**Expected Results:**
- Tab has `role="tab"` (soft).
- Tab exposes `aria-selected` of `true` or `false` (soft).
- Panel count equals tab count (soft).

---

### TC-ATC3: Active tab aria-controls references the visible panel
**AC:** AC4
**Priority:** Medium
**Tags:** @Accessibility

**Preconditions:**
- Page loaded; first tab active.

**Test Steps:**
1. Read the active tab's `aria-controls`.
2. Read the active panel's `id`.

**Expected Results:**
- Active tab `aria-controls` is truthy (soft).
- Active panel `id` equals the active tab's `aria-controls` (soft).

---

### TC-ATC4: Tab navigation is keyboard operable
**AC:** AC4
**Priority:** High
**Tags:** @Accessibility

**Preconditions:**
- Page loaded; first tab active.

**Test Steps:**
1. Read the active (first) tab's `tabindex` on load.
2. Click the first tab to place keyboard focus on the tablist.
3. Press ArrowRight.
4. Read the second tab's selection state.

**Expected Results (soft):**
- Active tab has `tabindex="0"` so keyboard users can Tab into the tablist (ARIA APG Tabs pattern).
- After ArrowRight, the second tab becomes `aria-selected="true"` — arrow-key navigation works.

**Note:** As-implemented, all tabs carry `tabindex="-1"` on load (active tab included), so the tablist is not reachable via the Tab key until a tab is otherwise focused. Arrow-key navigation itself works once a tab has focus.

---

## Visual Test Cases

> Visual tests are **parameterized across all four viewports** — XL (1280x720), LG (1024x768), MD (768x1024), SM (375x720). Each viewport produces its own test id suffix, e.g. `TC-VTC1-XL`, `TC-VTC1-SM`. Figma tab typography/spacing values are consistent across viewports.

### TC-VTC1-{XL,LG,MD,SM}: Active tab typography, highlight and padding match Figma
**AC:** AC4
**Priority:** High
**Tags:** @Visual

**Preconditions:**
- Page loaded; viewport set to the target size; Figma values imported.

**Test Steps:**
1. Set the viewport to the target size.
2. Locate the active tab.
3. Read computed font-size, font-weight, line-height, color, background-color, border-bottom-width, border-bottom-color, padding.

**Expected Results (soft, against Figma, at each viewport):**
- font-size = 18px; font-weight = 400; line-height = 28px.
- text color = rgba(255,255,255,1); background = rgba(16,56,79,1).
- bottom-border width = 2px; bottom-border color = rgba(255,49,98,1).
- padding = 16px 24px.

---

### TC-VTC2-{XL,LG,MD,SM}: Inactive tab colour and inter-element spacing match Figma
**AC:** AC3
**Priority:** Medium
**Tags:** @Visual

**Preconditions:**
- Page loaded; viewport set to the target size.

**Test Steps:**
1. Set the viewport to the target size.
2. Read the inactive tab (index 1) computed font-size and color.
3. Read the tab list computed `column-gap`.
4. Read the inner wrapper computed `row-gap` (tab-row to content spacing).

**Expected Results (soft, against Figma, at each viewport):**
- Inactive tab font-size = 18px; text color = rgba(16,56,79,1).
- Tab list gap = 2px.
- Tab-row to content gap = 32px.

---

### TC-VTC3-{XL,LG,MD,SM}: Tab bar remains horizontally scrollable
**AC:** AC5
**Priority:** Medium
**Tags:** @Visual

**Preconditions:**
- Page loaded; viewport set to the target size.

**Test Steps:**
1. Set the viewport to the target size.
2. Confirm the tab list is visible.
3. Read scroll metrics of the scroll container.

**Expected Results (soft, at each viewport):**
- Tab list is visible.
- `scrollWidth` greater than `clientWidth` — the tab bar is scrollable.

---

## Prerequisites
- Vercel basic auth handled by `navigateWithAuthentication` (BasePage).
- Cookie banner accepted via `acceptCookiesBanner` in `beforeEach`.
- Figma values file: `helpers/utils/figma-values/TabbedComponent_FigmaValues.ts`.

## Assumptions and Notes
- Implementation is Radix UI Tabs; selection follows focus (automatic activation).
- Tab labels are treated as content and never asserted (language-agnostic).
- Radix element IDs are dynamic; tests rely on roles/attributes, not IDs.
- The test page provides 14 tabs, sufficient to trigger horizontal overflow (AC5) at XL and SM.

## Known Limitations
- CMS authoring (AC1/AC2) is out of frontend scope and not covered.
- Theme variants (dark theme) are not covered; the QA page renders the light theme.
- Keyboard test assumes Radix default automatic activation; if the build uses manual activation, TC-ATC4 would require an explicit Enter/Space press.
