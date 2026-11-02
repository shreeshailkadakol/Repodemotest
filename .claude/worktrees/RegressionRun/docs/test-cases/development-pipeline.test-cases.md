# Test Cases - Development Pipeline Component

**Component**: Development Pipeline (`DevelopmentPipeline` + `DevelopmentPipelineBanner`)
**User Story**: 2600 - Development Pipeline component
**Test Page**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint23/developmentpipeline
**Test Coverage**: 41 test cases (18 Functional + 9 Accessibility + 4 Performance + 10 Visual)
**Date Created**: 2026-06-12
**Status**: Ready for Review

---

## Test Scope

### In Scope (Frontend Validation)
- Banner counters render and auto-calculate (Total / Phase I / II / III / Submission) — AC5 context
- "As of [Date]" timestamp renders and is localized — **AC5**
- Title and intro description render
- Product cards render with Area abbreviation, Title, Subtitle, Modality, Phase; sorted ASC by Title
- Search filters the list (partial + fuzzy) — **AC6**
- Filters: Therapeutic Areas, Modalities, Phases, Types; combined with AND logic — **AC7**
- Filter tooltips display
- "No Results Found" message on empty result set — **AC8**
- Pagination navigation — **AC9**
- Page-size change (10 / 15 / 20 / 50, default 15) — **AC10**
- Reset all clears search + filters — **AC11**
- Expand a product to view details (Compound Number, Trade Name, Description, Program Type, Mode of Action, Clinical Trials, Related Links); multiple expandable; default collapsed — **AC12**
- Links inside expanded product navigate correctly — **AC13**
- Visual design matches Figma (typography, colors, spacing) across XL/LG/MD/SM
- Accessibility compliance (WCAG 2.1 AA)
- Performance metrics (load time, search/filter response time)

### Out of Scope (CMS Functionality)
- **AC1** — Create/edit/delete pipeline component (CMS)
- **AC2** — Create/edit/delete pipeline product (CMS)
- **AC3** — Assign taxonomy values to a product (CMS)
- **AC4** — Manage text labels via Dictionary (CMS)
- Sitecore Search source configuration / indexing
- Localization authoring (EN/DE content management)

---

## Prerequisites

- Test environment: QA (bayer-beyond-qa-uk.vercel.app)
- Authentication: HTTP Basic Auth (`bayercorp` / `beyond2026`), Vercel password (`beyond2026`), cookie banner accepted (handled by BasePage)
- Browser: Chromium (primary)
- Viewports: XL (1440x900), LG (1024x800), MD (768x1024), SM (375x667)
- Figma values: `helpers/utils/figma-values/DevelopmentPipeline_FigmaValues.ts`
- Domain rules (from US comments):
  - Therapeutic Area = single-assignment per product (one color per area)
  - Modalities = multi-assignment per product
  - Program Type = "Type" (same taxonomy)
  - Products sorted ASC by Title
  - Banner counts computed on the frontend from the listing (may briefly show 0 before data loads, ~1s)
- Known risk: a QA comment (2026-06-12) flagged intermittent Sitecore Search indexing issues; listing/search/filter tests may be data-dependent.

### Key DOM anchors (from live inspection)
| Element | Selector |
|---|---|
| Title | `[data-qa="title-component"]` |
| Banner | `[data-qa="development-pipeline-banner"]` |
| Search wrapper | `[data-qa="pipeline-search-input"]` (input child: `aria-label="Search the Pipeline"`) |
| Filter sidebar | `[data-qa="pipeline-sidebar-filters"]` (rendered desktop + mobile) |
| Filter toggle | `[data-qa="pipeline-filter-accordion-toggle"]` |
| Filter groups | `[data-qa="pipeline-filter-group-{therapeutic_area\|phase\|modality\|program_type}"]` |
| Filter chips | `[data-qa^="pipeline-chip-{category}-"]` (GUID suffix; match by text) |
| Product card | `[data-qa="pipeline-product-card"]` (inner fields no data-qa) |
| Pagination | semantic: `button[aria-label="Go to first page"]`, `Previous`, `Next` |
| Page size | button text `15` |

---

## I. Functional Test Cases (@Functional)

### TC-DP-F001: Verify Development Pipeline component renders on the page
**Priority**: P0 - Critical · **AC**: Render
**Steps**:
1. Navigate to the test page; accept cookies.
2. Locate the title (`[data-qa="title-component"]`) and the banner (`[data-qa="development-pipeline-banner"]`).
**Expected**:
- Title is visible and not empty.
- Banner is visible.
- Product list container renders at least one product card.

### TC-DP-F002: Verify banner counters render with numeric values
**Priority**: P0 · **AC**: AC5 context
**Steps**:
1. Wait for the listing to load (banner may briefly show 0).
2. Read Total / Phase I / Phase II / Phase III / Submission counters in the banner.
**Expected**:
- Five counters are visible with labels (Total, Phase I, Phase II, Phase III, Submission).
- Each counter value is numeric and >= 0.
- Total equals the sum of the phase/submission breakdown (structural, language-agnostic).

### TC-DP-F003: Verify "As of [Date]" timestamp renders
**Priority**: P1 · **AC**: AC5
**Steps**:
1. Locate the "as of [date]" text near the header/intro.
**Expected**:
- Timestamp element is visible and not empty.
- Contains a parseable date (date format follows page locale).

### TC-DP-F004: Verify product card structure (Area, Title, Subtitle, Modality, Phase)
**Priority**: P0 · **AC**: Render
**Steps**:
1. Locate the first `[data-qa="pipeline-product-card"]`.
2. Inspect inner content.
**Expected**:
- Card displays an area abbreviation (e.g., ONC/CVD/NRD/IMM/OTH).
- Card displays a Title and Subtitle.
- Card displays Modality and Phase labels.
- Card is an interactive element (button/expandable).

### TC-DP-F005: Verify products are sorted ascending by Title
**Priority**: P1 · **AC**: Description
**Steps**:
1. Collect visible product card titles on page 1.
2. Compare against the same list sorted ascending (case-insensitive).
**Expected**:
- Displayed order matches ascending title order.

### TC-DP-F006: Verify search filters the list (full term)
**Priority**: P0 · **AC**: AC6
**Steps**:
1. Note initial product count.
2. Enter a known product title term in the search input.
3. Wait for the list to update.
**Expected**:
- List updates to show only matching products.
- Matching product(s) remain visible; non-matching removed.

### TC-DP-F007: Verify partial search returns matches
**Priority**: P1 · **AC**: AC6
**Steps**:
1. Enter a partial substring of a known product title/attribute.
2. Wait for results.
**Expected**:
- Products containing the partial term are shown.

### TC-DP-F008: Verify fuzzy search returns relevant matches
**Priority**: P2 · **AC**: AC6
**Steps**:
1. Enter a search term with a minor typo of a known product term.
2. Wait for results.
**Expected**:
- Relevant product(s) are still returned (fuzzy behavior via Sitecore Search).

### TC-DP-F009: Verify search across multiple attributes (Subtitle / Trade Name / Compound Number / Description / Program Type)
**Priority**: P1 · **AC**: AC6
**Steps**:
1. Enter a term known to match a non-title attribute.
2. Wait for results.
**Expected**:
- Products matching the attribute are shown.

### TC-DP-F010: Verify filter by a single Therapeutic Area
**Priority**: P0 · **AC**: AC7
**Steps**:
1. Open filters (toggle if collapsed).
2. Select one Therapeutic Area chip (e.g., Oncology).
3. Wait for results.
**Expected**:
- Only products in the selected area are shown.
- Result count is <= initial count.

### TC-DP-F011: Verify filter by Phase
**Priority**: P0 · **AC**: AC7
**Steps**:
1. Select a Phase chip (e.g., PHASE I).
2. Wait for results.
**Expected**:
- Only products in the selected phase are shown.

### TC-DP-F012: Verify filter by Modality
**Priority**: P1 · **AC**: AC7
**Steps**:
1. Select a Modality chip (e.g., Small Molecule).
2. Wait for results.
**Expected**:
- Only products with the selected modality are shown.

### TC-DP-F013: Verify filter by Type (Program Type)
**Priority**: P1 · **AC**: AC7
**Steps**:
1. Select a Type option (e.g., New Molecular Entity).
2. Wait for results.
**Expected**:
- Only products of the selected type are shown.

### TC-DP-F014: Verify combined filters use AND logic across categories
**Priority**: P0 · **AC**: AC7
**Steps**:
1. Select one Therapeutic Area AND one Phase.
2. Wait for results.
**Expected**:
- Only products matching BOTH selected filters are shown.

### TC-DP-F015: Verify "No Results Found" message on empty result set
**Priority**: P0 · **AC**: AC8
**Steps**:
1. Enter a search term that matches no product (e.g., a random string).
2. Wait for the list to update.
**Expected**:
- A "No Results Found" message is displayed.
- No product cards are shown.

### TC-DP-F016: Verify pagination navigation
**Priority**: P0 · **AC**: AC9
**Steps**:
1. Confirm pagination controls are visible (more products than page size).
2. Click page 2 (or Next).
3. Wait for the list to update.
**Expected**:
- A different set of product cards is displayed.
- Active page indicator updates.
- Previous/Next enable/disable appropriately at boundaries.

### TC-DP-F017: Verify page-size change updates the list
**Priority**: P1 · **AC**: AC10
**Steps**:
1. Note default page size (15) and visible card count.
2. Change page size (e.g., to 50).
3. Wait for the list to update.
**Expected**:
- Visible card count reflects the new page size (capped by total).
- Pagination recalculates page count.

### TC-DP-F018: Verify Reset All clears search and filters
**Priority**: P0 · **AC**: AC11
**Steps**:
1. Apply a search term and at least one filter.
2. Click "Reset all".
3. Wait for the list to update.
**Expected**:
- Search input is cleared.
- All filter selections are cleared.
- List returns to the full default result set.

### TC-DP-F019: Verify product expand reveals detail fields and multiple can be expanded
**Priority**: P0 · **AC**: AC12
**Steps**:
1. Confirm all products are collapsed by default.
2. Click a product card to expand.
3. Inspect expanded detail fields.
4. Expand a second product.
**Expected**:
- Expanded card shows detail fields: Compound Number, Trade Name, Description, Program Type, Mode of Action, Clinical Trials, Related Links (those authored).
- Multiple products can be expanded simultaneously.
- Collapsing returns to the default state.

### TC-DP-F020: Verify links in an expanded product navigate correctly
**Priority**: P1 · **AC**: AC13
**Steps**:
1. Expand a product that has Related Links / Clinical Trials.
2. Inspect the link `href` and target.
**Expected**:
- Links have a valid `href`.
- Clicking navigates to the expected destination (new tab/external as configured); no broken link.

> Note: TC count above lists 18 Functional headline cases (AC-focused); TC-DP-F019/F020 cover AC12/AC13. Adjust numbering as needed during script generation.

### TC-DP-F021: Verify filter tooltips display
**Priority**: P2 · **AC**: Description
**Steps**:
1. Hover/focus the information trigger next to a filter group (e.g., "Therapeutic Areas information").
**Expected**:
- A tooltip with explanatory text is displayed.

---

## II. Accessibility Test Cases (@Accessibility)

### TC-DP-A001: Keyboard navigation through interactive elements
**WCAG**: 2.1.1
- Tab order reaches search input, filter chips, product cards, pagination, page-size control in a logical order; all operable via keyboard.

### TC-DP-A002: Visible focus indicators
**WCAG**: 2.4.7
- All interactive elements show a visible focus indicator.

### TC-DP-A003: Search input has accessible name
**WCAG**: 4.1.2 / 3.3.2
- Search input exposes `aria-label`/label ("Search the Pipeline") and a placeholder.

### TC-DP-A004: Filter controls are accessible
**WCAG**: 4.1.2
- Filter chips/radios have accessible names and pressed/checked state exposed to assistive tech.

### TC-DP-A005: Product cards expose expand/collapse state
**WCAG**: 4.1.2
- Expandable product control exposes `aria-expanded` (or equivalent) reflecting state.

### TC-DP-A006: Pagination controls are accessible
**WCAG**: 4.1.2
- Pagination buttons expose accessible names (e.g., "Go to first page", "Go to last page", Previous, Next).

### TC-DP-A007: Semantic heading structure
**WCAG**: 1.3.1
- Title uses a heading element; filter group labels use headings; logical hierarchy maintained.

### TC-DP-A008: Color contrast compliance (WCAG 2.1 AA)
**WCAG**: 1.4.3
- Text and interactive elements meet 4.5:1 (normal) / 3:1 (large) contrast. Run axe-core; report violations as soft assertions.

### TC-DP-A009: "No Results Found" message is announced
**WCAG**: 4.1.3
- Empty-state message is in a live region / programmatically announced when triggered.

---

## III. Performance Test Cases (@Performance)

### TC-DP-P001: Initial component load time
- Component (banner + first page of products) renders within < 3s on QA.

### TC-DP-P002: Search response time
- After entering a term, the list updates within < 1s (allowing for Sitecore Search latency).

### TC-DP-P003: Filter response time
- After selecting a filter, the list updates within < 1s.

### TC-DP-P004: Pagination response time
- Navigating to another page updates the list within < 1s.

---

## IV. Visual Test Cases (@Visual)

> All visual values imported from `DevelopmentPipeline_FigmaValues.ts` via `getValuesByViewport()`. No hardcoded design values. All four viewports (XL/LG/MD/SM) execute even if one fails (soft assertions).

### TC-DP-V001: Title typography
- font-family `Bayer Sans`, weight 700; size/line-height 48/56 (XL/LG/MD), 30/36 (SM); color `rgba(16,56,79,1)`.

### TC-DP-V002: Intro description typography
- 20/30, weight 400, color `rgba(64,96,114,1)`.

### TC-DP-V003: "As of [Date]" typography
- 20/30, weight 700, color `rgba(96,113,139,1)`.

### TC-DP-V004: Banner counter typography
- Value 60/70 weight 700 white; unit 30/36 weight 400 white; label 20/30 weight 700 white; phase label 18/28 weight 400 `rgba(202,213,226,1)`.

### TC-DP-V005: Search field typography
- Label 16/24 weight 700 navy; placeholder 16/24 weight 400 `rgba(96,113,139,1)`.

### TC-DP-V006: Filter group heading typography
- 16/24 weight 700 color `rgba(16,56,79,1)`.

### TC-DP-V007: Filter chip typography and therapeutic-area colors
- Chip 12/16 weight 500, letter-spacing 0.4px.
- Area colors: ONC `rgba(0,85,115,1)`, CVD `rgba(211,15,75,1)`, NRD `rgba(14,104,1,1)`, IMM `rgba(59,44,59,1)`, OTH `rgba(49,65,88,1)`.

### TC-DP-V008: Product card title/subtitle typography
- Title 18/28 weight 700 navy; subtitle 16/24 weight 400 `rgba(96,113,139,1)`.

### TC-DP-V009: Expanded detail field typography
- Detail label 12/16 weight 400 `rgba(96,113,139,1)`; value 16/24 weight 400 navy.

### TC-DP-V010: Responsive layout across viewports
- Banner, sidebar filters, product list, and pagination render correctly at XL/LG/MD/SM; SM uses larger filter toggle (18/28) and smaller title; layout adapts without overflow.

---

## Traceability Matrix

| AC | Description | Test Cases |
|---|---|---|
| AC5 | "As of [Date]" timestamp | TC-DP-F003, TC-DP-V003 |
| AC6 | Search (partial + fuzzy + multi-attribute) | TC-DP-F006, F007, F008, F009 |
| AC7 | Filters with AND logic | TC-DP-F010, F011, F012, F013, F014 |
| AC8 | No Results Found | TC-DP-F015, TC-DP-A009 |
| AC9 | Pagination navigation | TC-DP-F016, TC-DP-P004 |
| AC10 | Page-size change | TC-DP-F017 |
| AC11 | Reset all | TC-DP-F018 |
| AC12 | Expand product details | TC-DP-F019 |
| AC13 | Links in expanded product | TC-DP-F020 |
| Render/Description | Component, banner, cards, sort, tooltips | TC-DP-F001, F002, F004, F005, F021 |
| Visual (Figma) | Typography, colors, spacing, responsive | TC-DP-V001–V010 |
| Accessibility (WCAG 2.1 AA) | Keyboard, focus, names, contrast, announcements | TC-DP-A001–A009 |
| Performance | Load + interaction response | TC-DP-P001–P004 |

| AC (CMS — excluded) | Reason |
|---|---|
| AC1, AC2, AC3, AC4 | CMS authoring — not frontend-validatable |

---

*Test cases ready for review. Upon approval, scripts will be generated in Step 5 using SmartLocator (min. 3 fallbacks per element, soft assertions, Figma-imported visual values).*
