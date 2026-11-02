# Global Contact Link - Test Cases

## Component Information
- **Component Name:** Global Contact Link (GlobalContactLink)
- **User Story:** 4883
- **Test Page URL:** `https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/globalcontactlink`
- **Figma URL:** `https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=24443-41740&m=dev`
- **Last Updated:** 2026-07-20
- **Test Status:** Draft
- **Scope:** Frontend only (AC1, AC2 are CMS/editor scope -- out of scope)

## Requirements Summary

The Global Contact Link component is a simple section containing a globe icon, a title text, and a CTA button. Clicking the CTA button opens the location selector overlay, which allows visitors to browse by location. The globe icon is decorative (aria-hidden) and the CTA button uses a chevron indicator alongside its text label.

### Acceptance Criteria (frontend-testable)
- **AC3:** Visitor sees component with icon (theme-based), title, link
- **AC4:** Clicking link opens location selector

## Actual DOM Structure

```html
<section data-testid="global-contactlink" data-qa="global-contactlink" class="bg-background-bg-elevated ...">
  <div class="flex flex-col items-start gap-2 self-stretch">
    <svg aria-hidden="true" class="h-20 w-20"> <!-- Globe icon --> </svg>
    <div class="text-text leading-lg self-stretch text-lg font-bold">{title}</div>
  </div>
  <button type="button" aria-label="{link text}" class="border-border-accented ... border-t pt-4">
    <div class="flex items-center gap-2 self-stretch">
      <div class="text-text-muted leading-base text-base">{link text}</div>
      <svg aria-hidden="true" class="text-icon-icon-primary-acent h-4 w-4"> <!-- chevron --> </svg>
    </div>
  </button>
</section>
<!-- Overlay opened by button click -->
<div data-testid="location-overlay" data-qa="location-overlay" class="fixed ...">
  <button aria-label="Close"> <!-- close button --> </button>
  <h2>Browse by Location</h2>
  <input placeholder="Find your location" aria-label="Find your location" />
</div>
```

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|---|---|---|---|
| TC-GCL01 | AC3 | Functional | Draft |
| TC-GCL02 | AC3 | Functional | Draft |
| TC-GCL03 | AC4 | Functional | Draft |
| TC-GCL04 | AC4 | Functional | Draft |
| TC-GCL05 | AC3 | Functional | Draft |
| TC-GCL06 | AC3 | Functional | Draft |
| TC-AGCL01 | AC3 | Accessibility | Draft |
| TC-AGCL02 | AC3 | Accessibility | Draft |
| TC-AGCL03 | AC3 | Accessibility | Draft |
| TC-AGCL04 | AC4 | Accessibility | Draft |
| TC-VGCL01 | AC3 | Visual | Draft |
| TC-VGCL02 | AC3 | Visual | Draft |
| TC-VGCL03 | AC3 | Visual | Draft |
| TC-VGCL04 | AC3 | Visual | Draft |

## Functional Test Cases

---

### TC-GCL01: Component renders with icon, title, and CTA button
**AC:** AC3
**Priority:** High
**Tags:** @GlobalContactLink @Functional

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the Global Contact Link component container
2. Verify the globe icon SVG is present within the component
3. Verify the title text element is present within the component
4. Verify the CTA button is present within the component

**Expected Results:**
- Component container `[data-testid="global-contactlink"]` is visible
- Globe icon SVG element is rendered inside the component
- Title div with class `font-bold` is visible
- CTA button `button[type="button"]` is visible within the component

---

### TC-GCL02: Globe icon is visible and decorative (aria-hidden)
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Functional

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the globe icon SVG within the component container
2. Verify the SVG is visible
3. Verify the SVG has `aria-hidden="true"` attribute
4. Verify the SVG has expected dimensions (h-20 w-20 classes)

**Expected Results:**
- Globe SVG is visible within the component
- SVG has `aria-hidden="true"`, marking it as decorative
- SVG has dimension classes `h-20` and `w-20`

---

### TC-GCL03: CTA button click opens location selector overlay
**AC:** AC4
**Priority:** High
**Tags:** @GlobalContactLink @Functional

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the CTA button within the component
2. Click the CTA button
3. Wait for the location selector overlay to appear

**Expected Results:**
- Location overlay `[data-testid="location-overlay"]` becomes visible after clicking the CTA button
- Overlay contains a heading and a search input field
- Overlay has `position: fixed` styling (full viewport coverage)

---

### TC-GCL04: Location overlay can be closed via Close button
**AC:** AC4
**Priority:** High
**Tags:** @GlobalContactLink @Functional

**Preconditions:**
- Navigate to the Global Contact Link test page
- Location overlay is open from clicking the CTA button

**Test Steps:**
1. Click the CTA button to open the location overlay
2. Verify the overlay is visible
3. Locate the close button within the overlay
4. Click the close button
5. Verify the overlay is no longer visible

**Expected Results:**
- Close button `button[aria-label="Close"]` within the overlay is clickable
- After clicking close, the location overlay is no longer visible
- The Global Contact Link component remains visible on the page

---

### TC-GCL05: Title text is present and non-empty
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Functional

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the title text element within the component container
2. Read the text content of the title element
3. Verify the text content is not empty

**Expected Results:**
- Title element (div with `font-bold` class) is present within the component
- Title text content has length greater than 0
- Title text content is not whitespace-only

---

### TC-GCL06: CTA button text is present and non-empty
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Functional

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the CTA button within the component
2. Read the text content of the button label element
3. Verify the text content is not empty

**Expected Results:**
- CTA button is present within the component
- Button label text (div with `text-text-muted` class) has length greater than 0
- Button label text is not whitespace-only

---

## Accessibility Test Cases

---

### TC-AGCL01: Globe SVG has aria-hidden="true"
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Accessibility

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the globe icon SVG within the component
2. Verify it has the `aria-hidden` attribute
3. Verify the attribute value is `"true"`

**Expected Results:**
- Globe SVG element has `aria-hidden="true"` attribute
- The icon is excluded from the accessibility tree as a decorative element

---

### TC-AGCL02: CTA button has aria-label attribute
**AC:** AC3
**Priority:** High
**Tags:** @GlobalContactLink @Accessibility

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the CTA button within the component
2. Verify it has an `aria-label` attribute
3. Verify the `aria-label` value is non-empty

**Expected Results:**
- CTA button has an `aria-label` attribute
- The `aria-label` value is a non-empty string matching the visible button text
- Screen readers can identify the button purpose from the label

---

### TC-AGCL03: Chevron SVG has aria-hidden="true"
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Accessibility

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the chevron SVG within the CTA button
2. Verify it has the `aria-hidden` attribute
3. Verify the attribute value is `"true"`

**Expected Results:**
- Chevron SVG element inside the CTA button has `aria-hidden="true"`
- The decorative chevron icon is excluded from the accessibility tree
- SVG has dimension classes `h-4` and `w-4`

---

### TC-AGCL04: CTA button is keyboard-focusable and activatable with Enter
**AC:** AC4
**Priority:** High
**Tags:** @GlobalContactLink @Accessibility @Keyboard

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Tab through the page to reach the CTA button within the component
2. Verify the button receives focus
3. Press Enter on the focused button
4. Verify the location selector overlay opens

**Expected Results:**
- CTA button is focusable via Tab key
- Button shows visible focus indicator when focused
- Pressing Enter on the focused button opens the location overlay `[data-testid="location-overlay"]`
- The overlay content is accessible for further keyboard navigation

---

## Visual Test Cases

---

### TC-VGCL01: Title typography matches Figma
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Visual

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the title text element within the component
2. Read computed CSS properties: fontSize, fontWeight, lineHeight, color

**Expected Results:**
- Font size matches Figma spec (text-lg class)
- Font weight is bold (700)
- Line height matches Figma spec (leading-lg class)
- Text color uses the `text-text` design token

---

### TC-VGCL02: CTA text typography matches Figma
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Visual

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the CTA button text element within the component
2. Read computed CSS properties: fontSize, fontWeight, color

**Expected Results:**
- Font size matches Figma spec (text-base class)
- Line height matches Figma spec (leading-base class)
- Text color uses the `text-text-muted` design token

---

### TC-VGCL03: Icon dimensions match Figma spec
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Visual

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the globe icon SVG within the component
2. Measure the rendered width and height of the SVG

**Expected Results:**
- Globe icon rendered dimensions match Figma spec (h-20 w-20 classes, 80x80px)
- Icon color uses the theme-based icon token

---

### TC-VGCL04: Section background color and padding match Figma
**AC:** AC3
**Priority:** Medium
**Tags:** @GlobalContactLink @Visual

**Preconditions:**
- Navigate to the Global Contact Link test page

**Test Steps:**
1. Locate the component section element
2. Read computed CSS properties: backgroundColor, padding
3. Verify the CTA button has a top border separator

**Expected Results:**
- Section background color uses the `bg-background-bg-elevated` design token
- Section padding values match Figma spec
- CTA button area has a top border (`border-t` class) with `border-border-accented` color
- CTA button area has top padding (`pt-4` class)

---

## Prerequisites
- QA environment accessible with Vercel auth (`bayercorp` / configured password)
- Chromium browser project configured
- `TEST_ENV=qa` set

## Assumptions and Notes
- Component has no `data-component` attribute
- The CTA is a `<button>`, not an `<a>` link -- interaction opens location selector overlay, not a page navigation
- No responsive breakpoint style differences observed (same styles at XL, LG, MD, SM)
- Location overlay data may not load in Vercel auth-embedded URL contexts (fetch API limitation)
- AC1, AC2 are CMS/editor scope and out of scope for frontend testing
- Only light theme variant observed on test page

## Known Limitations
- CMS/editor acceptance criteria (AC1, AC2) are not testable from the frontend
- Dark theme variant not available on current test page; only light theme observed
- Location overlay search results depend on API data availability, which may be limited in QA environment
