# Share Price Component - Test Cases Documentation

## Component Overview
**Component:** Share Price Component  
**User Story:** US-815 - Share Price - handle different content for other sites (e.g. India)  
**Test Page:** Footer section of any page  
**Related Requirements:** Requirement-815

## Requirements Summary
The Share Price component must support:
1. Global share information (DAX market - without € symbol for DAX)
2. India-specific information with switching control
3. Option to disable stock price display entirely
4. CMS configuration for site-specific settings

## DOM Structure (From Live Inspection)
Based on staging site verification:
```html
<!-- Current Implementation (Global) -->
<div class="share-price-container">
  <!-- Bayer Stock -->
  <div class="stock-item">
    <span>Bayer</span>
    <span>December 30, 2025 14:11 CEST</span>
    <span>€37.01</span>
    <span>+1.63%</span>
  </div>
  
  <!-- DAX Index -->
  <div class="stock-item">
    <span>DAX</span>
    <span>December 30, 2025 17:50 CEST</span>
    <span>24,490.41</span>
    <span>+0.57%</span>
  </div>
</div>
```

---

## 🧪 FUNCTIONAL TEST CASES

### TC-SP001: Global Share Price Display (Default)
**Priority:** High  
**Requirement:** AC1 - Global share information by default  
**Tags:** @Functional @SharePrice @Critical

**Preconditions:**
- Site configured for global share price display
- User accesses any page on the site

**Test Steps:**
1. Navigate to test page
2. Scroll to footer section
3. Verify share price component is visible
4.Verify global option is selected by default

**Expected Results:**
- SharePrice component is visible in footer left section
-Global option should be selected by default


**Test Data:**
- Expected elements: Bayer stock, DAX index
- Currency: € for Bayer only
- Time zone: CEST

---

### TC-SP002: India-Specific Share Price Display
**Priority:** High  
**Requirement:** AC2 - India-specific information   
**Tags:** @Functional @SharePrice @India @Critical

**Preconditions:**
- Site configured for India-specific share price display
- User accesses any page on Indian site

**Test Steps:**
1. Navigate to  test page
2. Scroll to footer section
3. Verify India stock information displayed
4. Select the india stock

**Expected Results:**
- India-specific stock listing displayed
- Indian market timestamp (IST format expected)
- Indian currency symbols (₹ expected)
- Switching control visible to toggle to global view

**Test Data:**
- Expected market: Indian stock exchange
- Currency: ₹ (Indian Rupee)
- Time zone: IST

---

### TC-SP003: Share Price Switching Functionality
**Priority:** High  
**Requirement:** AC3 - Switch between India and global information  
**Tags:** @Functional @SharePrice @Switching @Critical

**Preconditions:**
- Site configured for India-specific display with switching enabled
- User on Indian site with switching control visible

**Test Steps:**
1. Navigate to Indian site
2. Verify global stock information displayed by default
3. Click switching control to toggle to India stock information view
4. Verify India stock information displayed
5. Click switching control to toggle back to Global stock view

**Expected Results:**
- Default view shows Global-specific stocks
- Switching control toggles between India and global markets
- Data updates appropriately for each market
- Switching control state reflects current view
- No page reload required for switching

---

### TC-SP005: Real-time Data Updates
**Priority:** Medium  
**Requirement:** General functionality - live data display  
**Tags:** @Functional @SharePrice @RealTime

**Test Steps:**
1. Navigate to test page
2. Record initial stock values and timestamps
3. Wait for data refresh interval
4. Verify data updates reflect current market status

**Expected Results:**
- Timestamps update to current time
- Stock values refresh with latest market data
- Percentage changes update accordingly
- No manual refresh required

---

## 🎨 VISUAL TEST CASES

### TC-SP006: Share Price Typography - XL Viewport
**Priority:** Medium  
**Requirement:** Visual consistency across viewports  
**Tags:** @Visual @SharePrice @Typography @XL

**Viewport:** 1440px width
**Figma Reference:** node-id=7873:22327

**Test Elements:**
- India/Global switcher buttons
- Company label (e.g., "Bayer Cropscience Ltd. India")
- Stock names (BSE, DAX)
- Price values (₹ 4530.00, etc.)
- Percentage change indicators (0.15%)
- Timestamp text

**Expected Visual Properties:**
- **Switcher Buttons:** Font: Bayer Sans, Size: 14px, Weight: 400, Line Height: 20px, Color: rgba(16, 56, 79, 1)
- **Company Label:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(96, 113, 139, 1)
- **Stock Names:** Font: Bayer Sans, Size: 12px, Weight: 700, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Timestamp:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Price Values:** Font: Bayer Sans, Size: 36px, Weight: 400, Line Height: 36px, Letter Spacing: -1.08px, Color: rgba(16, 56, 79, 1)
- **Percentage Change:** Font: Bayer Sans, Size: 16px, Weight: 400, Line Height: 24px, Color: rgba(16, 56, 79, 1)

---

### TC-SP007: Share Price Typography - LG Viewport
**Priority:** Medium  
**Requirement:** Visual consistency across viewports  
**Tags:** @Visual @SharePrice @Typography @LG

**Viewport:** 1024px width
**Figma Reference:** node-id=7873:22339

**Test Elements:**
- India/Global switcher buttons
- Company label
- Stock names
- Price values
- Percentage change indicators
- Timestamp text

**Expected Visual Properties:**
- **Switcher Buttons:** Font: Bayer Sans, Size: 14px, Weight: 400, Line Height: 20px, Color: rgba(16, 56, 79, 1)
- **Company Label:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(96, 113, 139, 1)
- **Stock Names:** Font: Bayer Sans, Size: 12px, Weight: 700, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Timestamp:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Price Values:** Font: Bayer Sans, Size: 36px, Weight: 400, Line Height: 36px, Letter Spacing: -1.08px, Color: rgba(16, 56, 79, 1)
- **Percentage Change:** Font: Bayer Sans, Size: 16px, Weight: 400, Line Height: 24px, Color: rgba(16, 56, 79, 1)

---

### TC-SP008: Share Price Typography - MD Viewport
**Priority:** Medium  
**Requirement:** Visual consistency across viewports  
**Tags:** @Visual @SharePrice @Typography @MD

**Viewport:** 768px width
**Figma Reference:** node-id=7873:22331

**Test Elements:**
- India/Global switcher buttons
- Company label
- Stock names
- Price values
- Percentage change indicators
- Timestamp text

**Expected Visual Properties:**
- **Switcher Buttons:** Font: Bayer Sans, Size: 14px, Weight: 400, Line Height: 20px, Color: rgba(16, 56, 79, 1)
- **Company Label:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(96, 113, 139, 1)
- **Stock Names:** Font: Bayer Sans, Size: 12px, Weight: 700, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Timestamp:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Price Values:** Font: Bayer Sans, Size: 36px, Weight: 400, Line Height: 36px, Letter Spacing: -1.08px, Color: rgba(16, 56, 79, 1)
- **Percentage Change:** Font: Bayer Sans, Size: 16px, Weight: 400, Line Height: 24px, Color: rgba(16, 56, 79, 1)

---

### TC-SP009: Share Price Typography - SM Viewport
**Priority:** Medium  
**Requirement:** Visual consistency across viewports  
**Tags:** @Visual @SharePrice @Typography @SM

**Viewport:** 375px width
**Figma Reference:** node-id=7873:22335

**Test Elements:**
- India/Global switcher buttons
- Company label
- Stock names
- Price values
- Percentage change indicators
- Timestamp text

**Expected Visual Properties:**
- **Switcher Buttons:** Font: Bayer Sans, Size: 14px, Weight: 400, Line Height: 20px, Color: rgba(16, 56, 79, 1)
- **Company Label:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(96, 113, 139, 1)
- **Stock Names:** Font: Bayer Sans, Size: 12px, Weight: 700, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Timestamp:** Font: Bayer Sans, Size: 12px, Weight: 400, Line Height: 16px, Color: rgba(16, 56, 79, 1)
- **Price Values:** Font: Bayer Sans, Size: 36px, Weight: 400, Line Height: 36px, Letter Spacing: -1.08px, Color: rgba(16, 56, 79, 1)
- **Percentage Change:** Font: Bayer Sans, Size: 16px, Weight: 400, Line Height: 24px, Color: rgba(16, 56, 79, 1)

---

### TC-SP010: Currency Symbol Display Validation
**Priority:** High  
**Requirement:** AC1 - DAX without € symbol, Bayer with € symbol  
**Tags:** @Visual @SharePrice @Currency @Critical

**Test Steps:**
1. Navigate to global site
2. Verify Bayer stock displays with € symbol
3. Verify DAX index displays without € symbol
4. Check India site (if available)
5. Verify Indian stocks display with ₹ symbol

**Expected Results:**
- Global Bayer: €XX.XX format
- Global DAX: XXXXX.XX format (no currency symbol)
- India stocks: ₹XX.XX format (if applicable)

---

### TC-SP011: Percentage Change Visual Indicators
**Priority:** Medium  
**Requirement:** Visual indication of positive/negative changes  
**Tags:** @Visual @SharePrice @Indicators

**Test Steps:**
1. Identify positive percentage changes
2. Verify positive changes have appropriate visual styling
3. Identify negative percentage changes
4. Verify negative changes have appropriate visual styling

**Expected Results:**
- Positive changes: Green color, upward indicator
- Negative changes: Red color, downward indicator
- Color contrast meets WCAG standards

---

## ♿ ACCESSIBILITY TEST CASES

### TC-SP012: Screen Reader Compatibility
**Priority:** High  
**Requirement:** WCAG 2.1 AA compliance  
**Tags:** @Accessibility @SharePrice @ScreenReader @Critical

**Test Steps:**
1. Navigate to test page using screen reader
2. Tab to share price component
3. Verify all stock information is readable
4. Test switching controls (if present) with screen reader

**Expected Results:**
- All text content announced correctly
- Stock names, prices, and changes clearly articulated
- Switching controls have appropriate aria-labels
- Logical tab order maintained

---

### TC-SP013: Keyboard Navigation
**Priority:** High  
**Requirement:** WCAG 2.1 AA compliance  
**Tags:** @Accessibility @SharePrice @Keyboard @Critical

**Test Steps:**
1. Navigate to test page
2. Use Tab key to reach share price component
3. Test switching controls using Enter/Space keys
4. Verify focus indicators visible throughout

**Expected Results:**
- All interactive elements reachable via keyboard
- Clear focus indicators on all focusable elements
- Switching controls operable via keyboard
- No keyboard traps present

---

### TC-SP014: Color Contrast Validation
**Priority:** Medium  
**Requirement:** WCAG 2.1 AA compliance  
**Tags:** @Accessibility @SharePrice @ColorContrast

**Test Steps:**
1. Measure contrast ratio of stock name text
2. Measure contrast ratio of price values
3. Measure contrast ratio of percentage change indicators
4. Test with different themes (if applicable)

**Expected Results:**
- All text meets WCAG AA contrast ratio (4.5:1 minimum)
- Color indicators for positive/negative changes distinguishable
- Information conveyed by color also available through other means

---

### TC-SP015: Alternative Text and Labels
**Priority:** Medium  
**Requirement:** WCAG 2.1 AA compliance  
**Tags:** @Accessibility @SharePrice @Labels

**Test Steps:**
1. Verify aria-labels present for stock information
2. Check alt text for any visual indicators
3. Validate form labels for switching controls

**Expected Results:**
- Descriptive aria-labels for all stock data
- Switching controls have clear labels
- Visual indicators have text alternatives

---

## ⚡ PERFORMANCE TEST CASES

### TC-SP016: Share Price Component Load Time
**Priority:** Medium  
**Requirement:** Performance optimization  
**Tags:** @Performance @SharePrice @LoadTime

**Test Steps:**
1. Clear browser cache
2. Navigate to test page
3. Measure time for share price component to appear
4. Measure time for stock data to populate

**Expected Results:**
- Component appears within 2 seconds
- Stock data loads within 3 seconds
- No blocking of other page elements

---

### TC-SP017: Data Refresh Performance
**Priority:** Medium  
**Requirement:** Efficient real-time updates  
**Tags:** @Performance @SharePrice @DataRefresh

**Test Steps:**
1. Monitor network requests during data refresh
2. Measure refresh interval timing
3. Verify no unnecessary requests made

**Expected Results:**
- Minimal data transfer for updates
- Consistent refresh intervals
- No memory leaks during extended use

---

### TC-SP018: Cross-Browser Performance
**Priority:** Medium  
**Requirement:** Consistent performance across browsers  
**Tags:** @Performance @SharePrice @CrossBrowser

**Browsers:** Chrome, Firefox, Safari, Edge

**Test Steps:**
1. Test component load time in each browser
2. Verify data refresh performance
3. Check switching functionality performance

**Expected Results:**
- Consistent load times across browsers
- No browser-specific performance issues
- Switching responds within 1 second

---

### TC-SP019: Mobile Performance
**Priority:** Medium  
**Requirement:** Optimized mobile experience  
**Tags:** @Performance @SharePrice @Mobile

**Test Steps:**
1. Test on mobile devices/simulators
2. Measure touch response for switching controls
3. Verify data loading on slower connections

**Expected Results:**
- Touch controls respond within 300ms
- Acceptable performance on 3G connections
- No horizontal scrolling required

---

## 📱 RESPONSIVE TEST CASES

### TC-SP020: Layout Adaptation - XL to LG
**Priority:** Medium  
**Requirement:** Responsive design consistency  
**Tags:** @Responsive @SharePrice @Layout

**Test Steps:**
1. Load page at 1440px width
2. Gradually reduce to 1024px width
3. Verify component adapts appropriately

**Expected Results:**
- No content overflow or truncation
- Maintains readability at all breakpoints
- Switching controls remain accessible

---

### TC-SP021: Layout Adaptation - MD to SM
**Priority:** Medium  
**Requirement:** Mobile responsive design  
**Tags:** @Responsive @SharePrice @Mobile

**Test Steps:**
1. Load page at 768px width
2. Reduce to 375px width
3. Verify mobile optimization

**Expected Results:**
- Component stacks appropriately on small screens
- All information remains accessible
- Touch targets meet minimum size requirements

---

## 🌐 LOCALIZATION TEST CASES

### TC-SP022: Multi-Language Support
**Priority:** Medium  
**Requirement:** Internationalization support  
**Tags:** @Localization @SharePrice @MultiLanguage

**Test Steps:**
1. Test component in available languages
2. Verify stock names translate appropriately
3. Check date/time formatting per locale

**Expected Results:**
- Stock information displays correctly in all languages
- Date/time formats match locale expectations
- Currency symbols appropriate for region

---

### TC-SP023: India-Specific Localization
**Priority:** High  
**Requirement:** AC2, AC3 - India market support  
**Tags:** @Localization @SharePrice @India @Critical

**Test Steps:**
1. Access Indian site configuration
2. Verify Indian stock names in local language
3. Test currency display (₹)
4. Validate IST timezone formatting

**Expected Results:**
- Indian stock names in appropriate language
- ₹ symbol used for Indian stocks
- IST timezone clearly indicated
- Switching labels in local language

---

## Test Coverage Summary

| Category | Test Cases | Coverage |
|----------|------------|----------|
| Functional | TC-SP001 to TC-SP005 | Core functionality |
| Visual | TC-SP006 to TC-SP011 | All viewports + currency |
| Accessibility | TC-SP012 to TC-SP015 | WCAG 2.1 AA compliance |
| Performance | TC-SP016 to TC-SP019 | Load time + responsiveness |
| Responsive | TC-SP020 to TC-SP021 | Breakpoint adaptation |
| Localization | TC-SP022 to TC-SP023 | Multi-language + India |

**Total Test Cases:** 23  
**Critical Test Cases:** 8  
**Coverage Areas:** 6

---

## Traceability Matrix

| Requirement | Test Cases | Status |
|-------------|------------|---------|
| AC1 - Global share info by default | TC-SP001, TC-SP010 | Ready |
| AC2 - India-specific by default | TC-SP002, TC-SP023 | Ready |
| AC3 - India/Global switching | TC-SP003 | Ready |
| AC4 - Disabled stock price | TC-SP004 | Ready |
| Visual Design Compliance | TC-SP006 to TC-SP011 | Ready |
| Accessibility Requirements | TC-SP012 to TC-SP015 | Ready |
| Performance Requirements | TC-SP016 to TC-SP019 | Ready |

---

*Test cases created on: December 31, 2025*  
*Based on DOM inspection and User Story 815 requirements*  
*Figma values extracted and cross-checked on: December 31, 2025*  
*Next Steps: Generate test scripts with corrected Figma values*

## ⚠️ **Important Note: Figma Values Cross-Check Completed**

**Key Finding:** SharePrice component uses **consistent typography across all viewports** - NO responsive scaling.

**Corrected Values (All Viewports):**
- **Price Values:** 36px/36px/-1.08px (consistent across XL, LG, MD, SM)
- **Percentage Change:** 16px/24px (consistent across all viewports)
- **Switcher Buttons:** 14px/20px (consistent across all viewports)
- **Stock Names:** 12px/16px/700 (consistent across all viewports)
- **Timestamps:** 12px/16px (consistent across all viewports)
- **Company Labels:** 12px/16px (consistent across all viewports)

**Test Implication:** Visual tests should validate **consistency** rather than responsive scaling for this component.
2. Check integration with footer layout: `[data-qa="footer-block"]`
3. Validate component doesn't interfere with other footer elements
4. Test footer scrolling behavior with SharePrice visible

### Expected Results:
- SharePrice positioned correctly in footer left section
- Proper spacing and alignment with other footer content
- No layout conflicts or overlapping elements
- Component maintains position during page interactions

---

## Additional Validation Points

### Data-QA Attributes for Automation:
- Primary: `[data-qa="stock-price"]`
- Footer: `[data-qa="footer-block"]`
- Icons: `[data-qa="icon"]`

### Figma Design Validation:
- Compare visual implementation with Figma designs
- Verify typography, spacing, and color specifications
- Validate component responsive behavior matches design

### WebSocket Configuration:
- Endpoint: `wss://stockdataexchange.bayer.com`
- Verify connection status and data flow
- Test reconnection logic if applicable

### Critical User Journeys:
1. **Information Consumption**: User can quickly view current stock prices
2. **Change Recognition**: User can identify price increases/decreases
3. **Time Context**: User understands when data was last updated
4. **Accessibility**: Screen reader users can access all information

These test cases provide comprehensive coverage of functional, visual, accessibility, and performance aspects of the SharePrice component, following the DOM-first approach and utilizing the identified data-qa attributes.
