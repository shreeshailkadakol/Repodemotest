# FullWidthContentDivider Component Test Cases

## Overview
This document contains test cases for the FullWidthContentDivider component, which validates two variations of fullwidth content dividers - one with container and one without container.

## Test Environment
- **Base URL**: Retrieved from envUtils.getBaseUrl()
- **Test Page**: `/Develop/Test-Catalyst-Page/QA/QA-Automation/FullWidthContentDivider`
- **Target URL**: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/QA/QA-Automation/FullWidthContentDivider

## Component Requirements
- Two fullwidth content divider components with different variations
- Variation 1: With container structure
- Variation 2: Without container structure
- Both components contain text with image components inside
- Padding differences should be verifiable between variations

## Test Cases

### Functional Tests

#### TC-FWC01: Verify both fullwidth variations exist
- **Objective**: Validate that both fullwidth content divider variations are present on the page
- **Priority**: High
- **Test Steps**:
  1. Navigate to the test page
  2. Accept cookies banner
  3. Update selectors based on page structure
  4. Verify first fullwidth component is visible
  5. Verify second fullwidth component is visible
  6. Verify at least 2 fullwidth components exist
- **Expected Result**: Both fullwidth variations are visible and accessible
- **Status**: Implemented

#### TC-FWC02: Verify padding difference between container and non-container variations
- **Objective**: Validate that there are measurable padding differences between the two variations
- **Priority**: High
- **Tag**: @Creative
- **Test Steps**:
  1. Navigate to the test page
  2. Accept cookies banner
  3. Update selectors based on page structure
  4. Measure padding values for first component (with container)
  5. Measure padding values for second component (without container)
  6. Compare padding values (top, right, bottom, left)
  7. Verify differences exist
- **Expected Result**: Padding values differ between the two variations
- **Status**: Implemented

#### TC-FWC03: Verify container structure differences
- **Objective**: Validate structural differences between container and non-container variations
- **Priority**: Medium
- **Test Steps**:
  1. Navigate to the test page
  2. Accept cookies banner
  3. Update selectors based on page structure
  4. Analyze first component's container structure
  5. Analyze second component's container structure
  6. Verify different container structures
- **Expected Result**: Components have different container structures
- **Status**: Implemented

### Debug Tests

#### TC-FWC04: Inspect and analyze page structure
- **Objective**: Analyze page structure to identify correct selectors for fullwidth components
- **Priority**: Low
- **Tag**: @Debug
- **Test Steps**:
  1. Navigate to the test page
  2. Accept cookies banner
  3. Scan page for elements containing 'fullwidth' or 'full-width'
  4. Log element details (tag, class, data-testid, container status)
  5. Verify at least 2 fullwidth elements found
- **Expected Result**: Page structure analysis completed and logged
- **Status**: Implemented

## Traceability Matrix

| Requirement | Test Case | Status | Priority |
|-------------|-----------|--------|----------|
| Two fullwidth variations exist | TC-FWC01 | ✅ Implemented | High |
| Padding differences validation | TC-FWC02 | ✅ Implemented | High |
| Container structure differences | TC-FWC03 | ✅ Implemented | Medium |
| Page structure analysis | TC-FWC04 | ✅ Implemented | Low |

## Technical Implementation

### Selector Strategy
The component uses a flexible selector approach:
1. **Primary selectors**: `[data-testid*="fullwidth"]`
2. **Fallback selectors**: Multiple alternatives including class-based selectors
3. **Dynamic selector update**: `updateSelectorsBasedOnPageStructure()` method

### Alternative Selectors
- `div[class*="fullwidth"]`
- `section[class*="fullwidth"]`
- `div[class*="full-width"]`
- `section[class*="full-width"]`
- `[data-testid*="full-width"]`
- `.fullwidth-container`
- `.full-width-container`

### Validation Methods
- **Element existence**: Verifies both components are visible
- **Padding measurement**: Uses `getComputedStyle()` to measure actual padding values
- **Container detection**: Checks for container classes, child containers, and parent containers

## Prerequisites
- Test environment should be accessible
- Page should contain two fullwidth content divider components
- Components should have distinguishable container structures
- Browser should support CSS computed styles API

## Known Limitations
- Exact data-testid attributes may need adjustment based on actual page implementation
- Padding measurement accuracy depends on CSS box-model implementation
- Selector fallback may be needed for different page structures

## Environment Setup
- Uses `envUtils.getBaseUrl()` for dynamic environment handling
- Supports prod/dev/qa environments via TEST_ENV variable
- Component URL configured in `componentURL.ts`

## Logging and Debugging
- Comprehensive logging via BasePage.log() method
- Error logging via BasePage.logError() method
- Page structure inspection for troubleshooting
- Selector debugging and fallback mechanisms

## Last Updated
- Date: Current Implementation
- Author: AI Assistant
- Version: 1.0
