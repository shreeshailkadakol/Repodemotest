# Image Hotspot - Test Cases

## Component Information
- **Component Name:** Image With Hotspots (ImageWithHotspots)
- **User Story:** 1576
- **Test Page URL:** `https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/imagehotspot`
- **Figma URL:** `https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=7560-30355&m=dev`
- **Last Updated:** 2026-07-17
- **Test Status:** Draft
- **Scope:** Frontend only (CMS/editor ACs 1-4, 6-11 out of scope)

## Requirements Summary

The Image With Hotspots component displays an image with interactive hotspot pins at editor-defined X/Y coordinates. Each hotspot opens an overlay card containing a title, rich-text description, optional image, and optional CTA link. The image scales responsively and hotspot positions are calculated proportionally. On SM breakpoints, the overlay appears over a dark-blue semi-opaque backdrop covering the full viewport.

### Acceptance Criteria (frontend-testable)
- **AC5:** Light or dark hotspot color modes (single component-wide setting)
- **AC12:** Open overlay by click/tap; close with X button or Escape key
- **AC13:** SM breakpoint: overlay on dark-blue semi-opaque full-viewport backdrop
- **AC14:** Overlay stays within viewport bounds

## Actual DOM Structure

```html
<!-- Component container -->
<div data-testid="image-with-hotspots" data-qa="image-with-hotspots" data-component="ImageWithHotspots">
  <!-- Image wrapper -->
  <div data-testid="image-with-hotspots-image-wrapper">
    <img data-testid="next-image" data-qa="image-with-hotspots-image" />
    <!-- Hotspot pins (buttons, positioned via inline left/top %) -->
    <button data-testid="image-with-hotspots-pin" aria-label="View {title} details" style="left:X%;top:Y%">
      <svg><!-- outer white circle --></svg>
      <svg><!-- inner accent circle --></svg>
    </button>
    <!-- ... more pins -->
  </div>
</div>

<!-- Overlay (rendered when pin clicked) -->
<div data-testid="overlay-card-backdrop" class="fixed inset-0 md:hidden" />
<dialog data-testid="overlay-card-dialog" aria-labelledby="..." open>
  <h2 data-qa="title-component">Title</h2>
  <button data-testid="overlay-card-close-button" data-qa="overlay-card-close-button" aria-label="Close modal" />
  <!-- Description (rich text div, no data-qa) -->
  <!-- Image (img, no data-qa) -->
  <!-- CTA link (a, target="_blank", no data-qa) -->
</dialog>
```

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|---|---|---|---|
| TC-IH01 | AC3, AC4 | Functional | Draft |
| TC-IH02 | AC4 | Functional | Draft |
| TC-IH03 | AC12 | Functional | Draft |
| TC-IH04 | AC6, AC7, AC8, AC9, AC10 | Functional | Draft |
| TC-IH05 | AC12 | Functional | Draft |
| TC-IH06 | AC12 | Functional | Draft |
| TC-IH07 | AC9, AC10 | Functional | Draft |
| TC-IH08 | AC13 | Functional | Draft |
| TC-IH09 | AC14 | Functional | Draft |
| TC-IH10 | AC12 | Functional | Draft |
| TC-IH11 | Description | Functional | Pass |
| TC-IH12 | Description | Functional | Pass |
| TC-IH13 | Description | Functional | Pass |
| TC-IH14 | Description | Functional | Pass |
| TC-AIH01 | AC12 | Accessibility | Draft |
| TC-AIH02 | AC12 | Accessibility | Draft |
| TC-AIH03 | AC12 | Accessibility | Draft |
| TC-AIH04 | AC12 | Accessibility | Draft |
| TC-VIH01 | AC5 | Visual | Draft |
| TC-VIH02 | AC12 | Visual | Draft |

## Functional Test Cases

---

### TC-IH01: Component renders with image and hotspot pins
**AC:** AC3, AC4
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Locate the Image Hotspot component container
2. Verify the component image is present and visible
3. Count the number of hotspot pin buttons

**Expected Results:**
- Component container `[data-testid="image-with-hotspots"]` is visible
- Image `[data-qa="image-with-hotspots-image"]` is rendered with a valid `src` attribute
- At least one hotspot pin `[data-testid="image-with-hotspots-pin"]` is present

---

### TC-IH02: Hotspot pins are positioned using percentage-based coordinates
**AC:** AC4
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Locate all hotspot pin buttons
2. Read the inline `style` attribute of each pin
3. Verify each pin has `left` and `top` percentage values

**Expected Results:**
- Each pin has an inline style with `left:X%` and `top:Y%` values
- Pin positions are within the image bounds (0-100% range)

---

### TC-IH03: Clicking a hotspot pin opens the overlay card
**AC:** AC12
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Click on a hotspot pin button
2. Wait for the overlay dialog to appear

**Expected Results:**
- Overlay dialog `[data-testid="overlay-card-dialog"]` becomes visible with `open` attribute
- The dialog contains content (title, description)

---

### TC-IH04: Overlay displays title, description, image, and CTA link
**AC:** AC6, AC7, AC8, AC9, AC10
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page
- Click on a hotspot pin that has all content fields populated

**Test Steps:**
1. Click a hotspot pin
2. Verify overlay title is present
3. Verify overlay description text is present
4. Verify overlay image is present
5. Verify CTA link is present

**Expected Results:**
- Title `h2[data-qa="title-component"]` is visible and non-empty
- Description text area contains content
- Image element within overlay has a valid `src`
- CTA link (`a` element) is present and visible

---

### TC-IH05: Close overlay using the X (close) button
**AC:** AC12
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Overlay is open from clicking a hotspot pin

**Test Steps:**
1. Click on a hotspot pin to open the overlay
2. Verify the overlay is visible
3. Click the close button
4. Verify the overlay is no longer visible

**Expected Results:**
- Close button `[data-testid="overlay-card-close-button"]` is clickable
- After clicking close, the overlay dialog is removed from the DOM
- The hotspot image remains visible

---

### TC-IH06: Close overlay using the Escape key
**AC:** AC12
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Overlay is open from clicking a hotspot pin

**Test Steps:**
1. Click on a hotspot pin to open the overlay
2. Verify the overlay is visible
3. Press the Escape key
4. Verify the overlay is no longer visible

**Expected Results:**
- After pressing Escape, the overlay dialog is removed from the DOM
- The hotspot image remains visible

---

### TC-IH07: CTA link in overlay has target="_blank"
**AC:** AC9, AC10
**Priority:** Medium
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Overlay is open from clicking a hotspot pin with a CTA link

**Test Steps:**
1. Click on a hotspot pin to open the overlay
2. Locate the CTA link element
3. Verify the link attributes

**Expected Results:**
- CTA link has `target="_blank"` attribute
- CTA link has `rel="noopener noreferrer"` for security
- CTA link has a valid `href` value

---

### TC-IH08: SM viewport - overlay backdrop covers full viewport
**AC:** AC13
**Priority:** High
**Tags:** @ImageHotspot @Functional @Responsive

**Preconditions:**
- Set viewport to SM breakpoint (375x812)
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Click on a hotspot pin
2. Verify the backdrop element is visible
3. Verify the backdrop covers the full viewport

**Expected Results:**
- Backdrop `[data-testid="overlay-card-backdrop"]` is visible on SM viewport
- Backdrop has `position: fixed` and `inset: 0px` (full viewport coverage)
- Backdrop has dark gradient styling (gradient classes present)
- Overlay dialog is visible on top of the backdrop

---

### TC-IH09: Overlay stays within viewport bounds
**AC:** AC14
**Priority:** High
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Click on hotspot pins at different positions (edges and center)
2. For each opened overlay, check its bounding box

**Expected Results:**
- Overlay dialog's bounding box is fully within the viewport
- No part of the overlay extends beyond the viewport edges

---

### TC-IH10: Multiple hotspots can be opened sequentially
**AC:** AC12
**Priority:** Medium
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Click on the first hotspot pin
2. Verify the overlay opens
3. Close the overlay (X or Escape)
4. Click on a different hotspot pin
5. Verify the overlay opens with different content

**Expected Results:**
- Each hotspot opens its own overlay with corresponding content
- Closing one overlay and opening another works without errors
- The overlay title changes based on which hotspot was clicked

---

### TC-IH11: Image wrapper scales responsively across breakpoints
**AC:** Story description (responsive scaling)
**Priority:** High
**Tags:** @ImageHotspot @Functional @Responsive

**Preconditions:**
- Navigate to the Image Hotspot test page at default (XL) viewport

**Test Steps:**
1. Get the image wrapper bounding box width at XL viewport
2. Resize viewport to SM (375x812)
3. Get the image wrapper bounding box width at SM viewport

**Expected Results:**
- Image wrapper is narrower on SM than on XL viewport
- Image wrapper is still visible (width > 0) on SM

---

### TC-IH12: Hotspot positions maintain proportional CSS coordinates on resize
**AC:** Story description (proportional repositioning)
**Priority:** High
**Tags:** @ImageHotspot @Functional @Responsive

**Preconditions:**
- Navigate to the Image Hotspot test page at default viewport

**Test Steps:**
1. Read CSS left% and top% from a visible pin's inline style at XL viewport
2. Resize viewport to SM (375x812)
3. Read CSS left% and top% from the same pin's inline style at SM viewport

**Expected Results:**
- Pin's left% is identical at both XL and SM viewports
- Pin's top% is identical at both XL and SM viewports
- Percentage-based positioning ensures proportional layout at all sizes

---

### TC-IH13: Hotspot pin size adapts between viewports
**AC:** Story description (responsive pin sizing)
**Priority:** Medium
**Tags:** @ImageHotspot @Functional @Responsive

**Preconditions:**
- Navigate to the Image Hotspot test page at default viewport

**Test Steps:**
1. Get a visible pin's rendered width at XL viewport
2. Resize viewport to SM (375x812)
3. Get the same pin's rendered width at SM viewport

**Expected Results:**
- Pin has a visible bounding box on SM (width > 0)
- Pin rendered width differs between XL and SM viewports (responsive adaptation)

---

### TC-IH14: Image displays in original aspect ratio
**AC:** Story description (aspect ratio preservation)
**Priority:** Medium
**Tags:** @ImageHotspot @Functional

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Get the image's natural (intrinsic) width and height
2. Get the image's rendered bounding box width and height
3. Compare natural aspect ratio to rendered aspect ratio

**Expected Results:**
- Natural width and height are > 0
- Rendered bounding box exists
- Difference between natural and rendered aspect ratios is < 0.05

---

## Accessibility Test Cases

---

### TC-AIH01: Hotspot pins have descriptive aria-labels
**AC:** AC12
**Priority:** High
**Tags:** @ImageHotspot @Accessibility

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Locate all hotspot pin buttons
2. Verify each has an `aria-label` attribute

**Expected Results:**
- Each pin button has `aria-label` following pattern "View {title} details"
- Pin SVG icons have `aria-hidden="true"`

---

### TC-AIH02: Overlay dialog uses semantic dialog element with aria-labelledby
**AC:** AC12
**Priority:** High
**Tags:** @ImageHotspot @Accessibility

**Preconditions:**
- Open a hotspot overlay

**Test Steps:**
1. Click a hotspot pin
2. Verify the overlay uses the `<dialog>` HTML element
3. Verify `aria-labelledby` references the title element

**Expected Results:**
- Overlay is a `<dialog>` element (not just a `<div>`)
- `aria-labelledby` attribute is present and references the title `h2` id
- Dialog has `open` attribute when visible

---

### TC-AIH03: Close button has accessible label
**AC:** AC12
**Priority:** Medium
**Tags:** @ImageHotspot @Accessibility

**Preconditions:**
- Open a hotspot overlay

**Test Steps:**
1. Click a hotspot pin
2. Locate the close button
3. Verify its accessible attributes

**Expected Results:**
- Close button has `aria-label="Close modal"`
- Close button contains an icon SVG

---

### TC-AIH04: Keyboard navigation - Tab to hotspots, Enter to open, Escape to close
**AC:** AC12
**Priority:** High
**Tags:** @ImageHotspot @Accessibility @Keyboard

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Tab through the page to reach hotspot pins
2. Press Enter on a focused hotspot pin
3. Verify the overlay opens
4. Press Escape to close

**Expected Results:**
- Hotspot pins are focusable via Tab key
- Enter key on a focused pin opens the overlay
- Escape key closes the overlay
- Focus returns appropriately after closing

---

## Visual Test Cases

---

### TC-VIH01: Hotspot pin styling matches design spec
**AC:** AC5
**Priority:** Medium
**Tags:** @ImageHotspot @Visual

**Preconditions:**
- Navigate to the Image Hotspot test page

**Test Steps:**
1. Locate hotspot pins
2. Verify pin styling (colors, sizes)

**Expected Results:**
- Outer circle uses permanent-light background color
- Inner circle uses primary-accent fill color
- Pin dimensions match Figma spec (XL: 40px, SM: 28px)

---

### TC-VIH02: Overlay card typography and spacing match design spec
**AC:** AC12
**Priority:** Medium
**Tags:** @ImageHotspot @Visual

**Preconditions:**
- Open a hotspot overlay

**Test Steps:**
1. Click a hotspot pin
2. Verify overlay title typography
3. Verify overlay description typography
4. Verify card spacing and dimensions

**Expected Results:**
- Title: bold, text-xl (lg: text-2xl)
- Description: text-lg (lg: text-xl), toned color
- Card width: 20.9375rem (335px)
- Padding: px-5 py-6 (md: px-8)

---

## Prerequisites
- QA environment accessible with Vercel auth (`bayercorp` / configured password)
- Chromium browser project configured
- `TEST_ENV=qa` set

## Assumptions and Notes
- 2 hotspot pins at position `left:0%;top:0%` with empty aria-labels appear to be content issues (empty hotspot entries in CMS)
- CTA link has no `data-qa` attribute; targeted via `a` tag within dialog
- Overlay description and image within dialog have no `data-qa` attributes
- Light/dark hotspot mode (AC5) requires content variation to fully test; only light mode observed on test page

## Known Limitations
- CMS/editor acceptance criteria (AC1-4, AC6-11) are not testable from the frontend
- AC11 (editor preview of mobile hotspot overlap) is a CMS-only feature
- Dark hotspot mode not available on current test page to verify AC5 fully
