# Stage Full Screen Component - Test Cases Documentation

## Overview
This document outlines the comprehensive test cases for the Stage Full Screen component automation. The tests follow the same proven approach as Stage Jumbotron and Stage Full Width components, ensuring consistency and reliability across all Stage variants.

## Component Information
- **Component Name**: Stage Full Screen
- **Test Page URL**: `Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Stage-Variants/StageFullScreen`
- **Figma Design Reference**: Node ID 4802-66979 (with viewport-specific nodes)
- **Test Environment**: QA Environment (`https://bayer-beyond-qa-uk.vercel.app/`)

## Test Categories

### 1. Functional Testing (6 Test Cases)
Tests the core functionality and behavior of the Stage Full Screen component.

#### TC-SFS001: Component Presence and Visibility
- **Purpose**: Validate Stage Full Screen component loads and is visible
- **Validation**: Container, title component, and stage images are present
- **Expected Result**: All core elements are visible within 10 seconds

#### TC-SFS002: Kicker Text Validation
- **Purpose**: Validate kicker text is present with meaningful content
- **Validation**: Text element exists, is visible, and contains non-empty content
- **Expected Result**: Kicker text displays properly with valid content

#### TC-SFS003: Main Headline Validation
- **Purpose**: Validate main headline is present with meaningful content
- **Validation**: Headline element exists, is visible, and contains non-empty content
- **Expected Result**: Main headline displays properly with valid content

#### TC-SFS004: Description Text Validation
- **Purpose**: Validate description text is present with meaningful content
- **Validation**: Description element exists, is visible, and contains non-empty content
- **Expected Result**: Description text displays properly with valid content

#### TC-SFS005: Button Group Functionality
- **Purpose**: Validate button group and individual button functionality
- **Validation**: 
  - Button container is visible
  - Primary button is functional with valid href/onclick
  - Secondary button is functional with valid href/onclick
- **Expected Result**: All buttons are interactive and properly configured

#### TC-SFS006: Stage Image Display and Loading
- **Purpose**: Validate stage image loads and displays correctly
- **Validation**: 
  - Image is visible
  - Image has loaded (natural dimensions > 0)
  - Lazy loading triggers if needed
- **Expected Result**: Image loads successfully and displays properly

### 2. Visual Testing (5 Test Cases) - Figma Integration
Tests visual design compliance across all viewport sizes using Figma design specifications.

#### TC-VSFS001: XL Viewport Design Specifications (1440px+)
- **Purpose**: Validate design compliance on extra-large screens
- **Figma Node**: 4802-66980
- **Validation**:
  - Responsive layout adaptation
  - Typography specifications (kicker, headline)
  - Button styling compliance
- **Expected Result**: Visual design matches Figma specifications for XL viewport

#### TC-VSFS002: LG Viewport Design Specifications (1024px-1439px)
- **Purpose**: Validate design compliance on large tablets/small desktops
- **Figma Node**: 4802-66981
- **Validation**: Same as XL with LG-specific adjustments
- **Expected Result**: Visual design matches Figma specifications for LG viewport

#### TC-VSFS003: MD Viewport Design Specifications (768px-1023px)
- **Purpose**: Validate design compliance on tablets
- **Figma Node**: 4802-66982
- **Validation**: Same as XL with MD-specific adjustments
- **Expected Result**: Visual design matches Figma specifications for MD viewport

#### TC-VSFS004: SM Viewport Design Specifications (375px-767px)
- **Purpose**: Validate design compliance on mobile devices
- **Figma Node**: 4802-66989
- **Validation**: Same as XL with SM-specific adjustments
- **Expected Result**: Visual design matches Figma specifications for SM viewport

#### TC-VSFS005: Full Screen Layout Behavior
- **Purpose**: Validate component utilizes full viewport height
- **Validation**: Stage container height >= 90% of viewport height
- **Expected Result**: Component displays in full-screen mode across all devices

### 3. Accessibility Testing (6 Test Cases)
Tests compliance with WCAG guidelines and accessibility best practices.

#### TC-ASFS001: Keyboard Navigation Functionality
- **Purpose**: Validate keyboard navigation through interactive elements
- **Validation**: Tab navigation works for buttons, focus indicators present
- **Expected Result**: All interactive elements are keyboard accessible

#### TC-ASFS002: ARIA Labels and Semantic Structure
- **Purpose**: Validate proper ARIA implementation and heading hierarchy
- **Validation**: 
  - Proper heading structure (h1, h2, h3)
  - Button roles and labels
- **Expected Result**: Screen readers can properly navigate component

#### TC-ASFS003: Image Accessibility Attributes
- **Purpose**: Validate images have proper accessibility attributes
- **Validation**: Alt text is present and meaningful
- **Expected Result**: Images are accessible to screen readers

#### TC-ASFS004: Color Contrast and Readability
- **Purpose**: Validate text meets WCAG color contrast requirements
- **Validation**: axe-core accessibility scan for contrast violations
- **Expected Result**: No color contrast violations detected

#### TC-ASFS005: Focus Indicators and Tab Order
- **Purpose**: Validate focus indicators are visible and tab order is logical
- **Validation**: 
  - Focus indicators are visible (outline/box-shadow)
  - Tab order follows logical sequence
- **Expected Result**: Focus management meets accessibility standards

#### TC-ASFS006: Screen Reader Compatibility
- **Purpose**: Validate component structure works with screen readers
- **Validation**: 
  - Proper landmark roles present
  - Heading structure exists
- **Expected Result**: Component is fully compatible with assistive technologies

### 4. Performance Testing (6 Test Cases)
Tests performance characteristics and resource efficiency.

#### TC-PSFS001: Component Load Performance
- **Purpose**: Measure and validate component initialization time
- **Performance Target**: < 30 seconds
- **Validation**: Time from navigation to component visibility
- **Expected Result**: Component loads within performance threshold

#### TC-PSFS002: Image Load Performance
- **Purpose**: Measure and validate image loading time
- **Performance Target**: < 5 seconds
- **Validation**: Time for image to fully load with natural dimensions
- **Expected Result**: Images load within performance threshold

#### TC-PSFS003: Viewport Adaptation Performance
- **Purpose**: Measure responsive design adaptation time across viewports
- **Performance Target**: < 2 seconds per viewport change
- **Validation**: Time for layout to adapt when viewport size changes
- **Expected Result**: Smooth responsive behavior across all breakpoints

#### TC-PSFS004: Interactive Response Time
- **Purpose**: Measure response time for user interactions
- **Performance Target**: < 2 seconds
- **Validation**: Time for hover effects and button interactions
- **Expected Result**: Interactive elements respond within threshold

#### TC-PSFS005: Memory Usage and Resource Efficiency
- **Purpose**: Monitor memory usage during component interaction
- **Performance Target**: < 50% memory increase
- **Validation**: Memory usage before and after component interaction
- **Expected Result**: Memory usage remains within acceptable limits

#### TC-PSFS006: Complete Component Validation (Integration Test)
- **Purpose**: Run comprehensive validation across all viewports
- **Validation**: Execute complete validation for XL, LG, MD, SM viewports
- **Expected Result**: All viewport validations pass successfully

## Test Data and Configuration

### Viewport Specifications
- **XL**: 1440x900 (Desktop Large)
- **LG**: 1024x768 (Large Tablet)
- **MD**: 768x1024 (Tablet)
- **SM**: 375x812 (Mobile)

### Performance Thresholds
- **Component Load**: 30,000ms
- **Image Load**: 5,000ms
- **Viewport Adaptation**: 2,000ms
- **Interactive Response**: 2,000ms
- **Memory Increase**: < 50%

### Figma Design Values
All visual validations reference `StageFullScreen_FigmaValues.ts` which contains:
- Typography specifications (font family, size, weight, color)
- Button styling (background, padding, border-radius, text-transform)
- Layout dimensions and spacing
- Responsive breakpoint adjustments

## Test Execution

### Prerequisites
1. QA environment accessible (`https://bayer-beyond-qa-uk.vercel.app/`)
2. Playwright test environment configured
3. Stage Full Screen test page available
4. Component locators configured with data-qa attributes

### Running Tests
```bash
# Run all Stage Full Screen tests
npx playwright test tests/specs/stageFullScreen.spec.ts --project=chromium

# Run specific test category
npx playwright test tests/specs/stageFullScreen.spec.ts --grep "TC-SFS" --project=chromium  # Functional
npx playwright test tests/specs/stageFullScreen.spec.ts --grep "TC-VSFS" --project=chromium # Visual
npx playwright test tests/specs/stageFullScreen.spec.ts --grep "TC-ASFS" --project=chromium # Accessibility
npx playwright test tests/specs/stageFullScreen.spec.ts --grep "TC-PSFS" --project=chromium # Performance

# Run comprehensive integration test
npx playwright test tests/specs/stageFullScreen.spec.ts --grep "TC-PSFS006" --project=chromium
```

### Expected Results
- **Total Test Cases**: 23
- **Success Criteria**: All tests pass (23/23)
- **Performance**: All tests complete within defined thresholds
- **Coverage**: Functional, Visual, Accessibility, and Performance validation complete

## Troubleshooting

### Common Issues
1. **Component Not Found**: Verify test URL and data-qa attributes
2. **Image Load Failures**: Check lazy loading behavior and network conditions
3. **Performance Threshold Exceeded**: Review CI environment performance characteristics
4. **Accessibility Violations**: Use axe-core reports to identify specific issues

### Debug Mode
Add `console.log` statements in component methods for detailed execution tracking.

## Maintenance
- Update Figma values when design specifications change
- Adjust performance thresholds based on environment characteristics
- Review and update test cases when component functionality changes
- Ensure data-qa attributes remain consistent with component implementation