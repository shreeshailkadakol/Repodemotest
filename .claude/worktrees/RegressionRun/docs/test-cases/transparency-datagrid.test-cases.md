# Transparency Datagrid Component - Comprehensive Test Cases
**Generated:** June 4, 2026  
**Component:** Transparency Datagrid  
**Story:** 2593  
**Figma:** https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=19090-79362&m=dev

## Test Categories Overview
This document outlines comprehensive test cases for the Transparency Datagrid component validation across multiple testing dimensions:

1. **Functional Testing** (8 test cases)
2. **Responsive Testing** (2 test cases)
3. **Accessibility Testing** (2 test cases)
4. **Performance Testing** (2 test cases)
5. **Visual & Typography Testing** (21 test cases)

**Total Test Cases: 35**

---

## 1. FUNCTIONAL TESTING (8 Test Cases)

### 1.1 Data Loading & Display

**TC-TDG-F001: Data loads and displays in grid @Functional @Smoke**
- Verify data rows are visible in the grid (at least 1 row)
- Verify grid structure has data (columns > 0)
- Verify pagination controls are visible
- **Expected:** Grid displays data from API with pagination

**TC-TDG-F002: Verify column filter functionality @Functional**
- Apply Division filter (select "Crop Science")
- Verify filtered results show data and count <= initial
- Clear filters and verify data restores to initial count
- **Expected:** Checkbox filter narrows results; clearing restores all

**TC-TDG-F003: Verify multi-filter AND logic @Functional**
- Apply first filter (Division = "Pharmaceuticals")
- Apply second filter (Clms_Status = "Active")
- Verify AND logic reduces results further
- Clear all filters and verify data restores
- **Expected:** Multiple filters apply AND logic; clearing restores all

### 1.2 Search Functionality

**TC-TDG-F004: Verify search functionality @Functional**
- Search for a known term ("Pharmaceuticals")
- Verify search returns results > 0 and <= initial count
- Clear search and verify data restores
- **Expected:** Search filters across all columns; clearing restores all

### 1.3 Pagination

**TC-TDG-F005: Verify pagination functionality @Functional**
- Verify page size selector is visible
- Change page size to 5 → verify rows <= 5
- Change page size to 10 → verify rows <= 10
- Change page size to 20 → verify rows <= 20
- Navigate to next page → verify data present
- **Expected:** Page size controls limit displayed rows; navigation works

### 1.4 Export

**TC-TDG-F006: Verify XLSX export functionality @Functional**
- Click export button
- Verify download is triggered
- Verify downloaded file has .xlsx extension
- Verify file size > 0
- **Expected:** Export produces valid XLSX file

### 1.5 Component Structure

**TC-TDG-F009: Verify component structure and rendering @Functional @Smoke**
- Verify datagrid container is visible
- Verify headline is visible
- Verify export button is visible
- Verify page size selector is visible
- **Expected:** All structural elements render correctly

### 1.6 Data Integrity

**TC-TDG-F010: Verify data integrity and formatting @Functional**
- Verify data integrity (first row has non-empty ID, Division, Status)
- Verify column headers contain "ID", "Division", "Status"
- Verify first row ID matches pattern `^C\d+$`
- Verify status value is "Active" or "Inactive"
- **Expected:** Data follows expected schema and formatting

---

## 2. RESPONSIVE TESTING (2 Test Cases)

**TC-TDG-R007: Verify responsive filter behavior @Functional @Responsive**
- XL viewport (1440px): Table visible, filter toggle hidden
- LG viewport (1024px): Filter toggle visible, table hidden
- MD viewport (768px): Filter toggle visible
- SM viewport (375px): Filter toggle visible
- **Expected:** Filters transition from inline (desktop) to toggle panel (mobile)

**TC-TDG-R008: Verify rows transform to cards on mobile @Functional @Responsive**
- XL viewport (1440px): Table layout visible
- LG viewport (1024px): Card layout visible, table hidden
- MD viewport (768px): Card layout visible
- SM viewport (375px): Card layout visible
- **Expected:** Table transforms to card-based layout below XL breakpoint

---

## 3. ACCESSIBILITY TESTING (2 Test Cases)

**TC-TDG-A001: Verify ARIA labels and semantic HTML @Accessibility**
- Export button has `aria-label` containing "Download Excel"
- Headline is a proper `<h2>` heading element
- Page size selector has `id` attribute
- Pagination nav has `aria-label="Pagination"`
- **Expected:** All interactive elements have proper ARIA attributes

**TC-TDG-A002: Verify keyboard navigation @Accessibility**
- Export button is focusable via keyboard
- Page size selector is focusable via keyboard
- Search input is focusable via keyboard
- **Expected:** All interactive elements are keyboard accessible

---

## 4. PERFORMANCE TESTING (2 Test Cases)

**TC-TDG-P001: Verify component loads within acceptable time @Performance**
- Reload page and measure time until data rows visible
- **Expected:** Component loads within 30 seconds (includes auth + API)

**TC-TDG-P002: Verify page interaction is responsive @Performance**
- Change page size and measure response time
- **Expected:** Interaction responds within 5 seconds

---

## 5. VISUAL & TYPOGRAPHY TESTING (21 Test Cases)

### 5.1 Core Typography

**TC-TDG-V001: Verify headline typography @Visual**
- Font size: 48px
- Font weight: 700 (bold)
- Text content: "Disclosure details"
- **Figma:** Container > Headline (Node: 19090-79097)

**TC-TDG-V002: Verify search input styling @Visual**
- Search input visible after clicking trigger
- Placeholder: "Search"
- aria-label: "Search"
- **Figma:** Container > flexible-input > Input Container > Input Text

**TC-TDG-V003: Verify table header styling @Visual**
- First column header text: "ID"
- Font weight >= 600 (semibold+)
- Header visible and properly structured
- **Figma:** Container > Table > Header Row > table cells

**TC-TDG-V004: Verify table cell styling @Visual**
- First cell visible in table body
- Font size: 18px (per Figma `tableCell.fontSize`)
- **Figma:** Container > Table > Data Row > table cells

**TC-TDG-V005: Verify pagination styling @Visual**
- Pagination visible
- Active page button font weight >= 700 (bold)
- **Figma:** Pagination > Number Item

### 5.2 Responsive Visual

**TC-TDG-V006: Verify responsive card layout styling @Visual @Responsive**
- Cards visible at mobile viewport (768px)
- Cards contain label-value pairs with field labels
- **Figma:** SM viewport card layout

### 5.3 Layout & Spacing

**TC-TDG-V007: Verify spacing and layout @Visual**
- Table header has padding
- Column widths are consistent
- **Figma:** tableHeader padding: "16px 12px"

**TC-TDG-V008: Verify font consistency across elements @Visual**
- Headline uses sans-serif font family
- Table header uses sans-serif font family
- Both use consistent font family
- **Figma:** "Bayer Sans", sans-serif

### 5.4 Filter Badge Visual Tests

**TC-TDG-V009: Verify filter badge appears when filter applied @Visual**
- Badge NOT visible before any filter applied
- Apply filter → badge appears on column header
- **Figma:** table cells > multiselect number (Node: I19090:79360;29334:15732)

**TC-TDG-V010: Verify filter badge count matches selected filters @Visual**
- Single filter → badge shows "1"
- Two filters on same column → badge shows "2"
- **Figma:** filter-count badge data-testid pattern

**TC-TDG-V011: Verify filter badge typography and styling @Visual**
- Font size: 12px (text-xs/bold)
- Font weight: 700
- Line height: 16px
- Text color: rgb(255, 255, 255) (white)
- Background: rgb(16, 56, 79) (dark blue #10384F)
- Border radius: 8px
- **Figma:** table cells > multiselect number > Input Text

### 5.5 Checkbox Visual Tests

**TC-TDG-V012: Verify unselected checkbox appearance @Visual**
- Open filter dropdown to show checkboxes
- Checkbox visible and has size > 10px
- **Figma:** checkbox (19090:74173) - Unselected, Size=sm (20px)

**TC-TDG-V013: Verify selected checkbox appearance @Visual**
- Click checkbox to select
- Verify checked state is true
- Checkbox size ~20px (16-24px range)
- **Figma:** checkbox - Selected, Size=sm (20px)

### 5.6 Manual Issue Tests (Figma Specification Validation)

**TC-TDG-V014: Verify pagination selector typography @Visual @ManualIssue**
- Font size: 18px
- Line height: 30px
- **Figma:** Container > dropdown

**TC-TDG-V015: Verify table column header ID typography @Visual @ManualIssue**
- Font size: 18px
- Font weight: 500 (medium)
- Line height: 28px
- **Figma:** Container > Table > Header Row > table cells (typescale/text-lg/medium)

**TC-TDG-V016: Verify multiselect number badge color @Visual @ManualIssue**
- Badge text color: rgb(255, 255, 255) (white)
- **Figma:** multiselect number - color #FFFFFF

**TC-TDG-V017: Verify dropdown sort ascending font-weight @Visual @ManualIssue**
- Sort ascending option font weight: 700 (bold)
- **Figma:** Node 19090-79340

**TC-TDG-V018: Verify filter number badge in dropdown typography @Visual @ManualIssue**
- Font size: 18px
- Font weight: 500
- Color: rgb(255, 255, 255) (white)
- **Figma:** Node 19090-79360

**TC-TDG-V019: Verify no search results message displays centered @Visual @ManualIssue**
- Enter non-matching search term
- No results message visible
- Message is centered (text-align: center or flex center)
- **Expected:** User sees centered feedback when no results found

### 5.7 Comprehensive Typography Validation

**TC-TDG-V020: Verify all table column headers typography @Visual @Comprehensive**
- Validate font-size, font-weight, line-height for all columns:
  - Bayer_ID, Division, Company_Name, Address, City, Postal_Code, Country, Clms_Status
- Expected values per Figma: fontSize=18px, fontWeight=500, lineHeight=28px
- **Figma:** All column headers in Header Row

**TC-TDG-V021: Verify all pagination elements typography @Visual @Comprehensive**
- Pagination button: font-size 18px, line-height 30px
- Page size selector: font-size 18px, line-height 30px
- **Figma:** Pagination and dropdown elements

---

## Figma Design Specifications

| Element | Font Size | Font Weight | Line Height | Color |
|---------|-----------|-------------|-------------|-------|
| Headline | 48px | 700 | 56px | rgb(16, 56, 79) |
| Search Input | 18px | 400 | 30px | rgb(96, 113, 139) |
| Dropdown | 18px | 400 | 30px | rgb(96, 113, 139) |
| Table Header | 18px | 500 | 28px | rgb(16, 56, 79) |
| Table Cell | 18px | 400 | 28px | rgb(64, 96, 114) |
| Pagination | 18px | 700 | 28px | rgb(16, 56, 79) |
| Filter Badge | 12px | 700 | 16px | rgb(255, 255, 255) |
| Dropdown Item | 18px | 400 | 28px | rgb(64, 96, 114) |

## Viewport Breakpoints

| Viewport | Width | Layout | Key Changes |
|----------|-------|--------|-------------|
| XL | 1440px | Full table | Inline column filters, desktop search |
| LG | 1024px | Cards | Filter toggle button, export button (large) |
| MD | 768px | Cards | Filter toggle, smaller layout |
| SM | 375px | Cards | Compact, headline 30px, font-size 16px |

---

## Component Data Columns

| Column Key | Display Name | Filterable |
|------------|--------------|-----------|
| Bayer_ID | ID | Yes |
| Division | Division | Yes |
| Subject_Of_Collaboration | Subject Of Collaboration | Yes |
| Collaboration_Type | Collaboration Type | Yes |
| Partner_Name | Partner Name | Yes |
| Partner_Country | Partner Country | Yes |
| Country_Of_Legal_Entity | Country Of Legal Entity | Yes |
| Funding_Committed | Funding Committed | Yes |
| Effective_Date | Effective Date | Yes |
| Clms_Status | Status | Yes |

---

## Test Execution Notes

- **Browser:** Chromium (Chrome)
- **Authentication:** Required (handled by `navigateWithAuthentication()`)
- **Data Source:** Live API (results may vary)
- **SmartLocator:** Tests use resilient multi-strategy element location
- **Soft Assertions:** Used throughout to collect all failures without stopping test
