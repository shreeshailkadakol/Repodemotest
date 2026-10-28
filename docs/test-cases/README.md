# Test Cases Documentation

This directory contains detailed test cases for each component based on requirements from playwright-prompt.md.

## Structure
- Each component has its own markdown file with test cases
- Test cases are linked to original requirements
- Includes traceability matrix for requirement coverage
- Documents test steps, expected results, and prerequisites

## Components

1. **[Hero Banner Component](./hero-banner.test-cases.md)** - **UPDATED**
   - Comprehensive functional validation (Primary/Secondary Text, Images, CTA)
   - WCAG 2.1 AA accessibility compliance testing
   - Modern Performance API testing with Web Vitals
   - Cross-browser compatibility (Chromium, Firefox, WebKit)
   - Part of User Story 109
   - **Status**: ✅ Fully Automated (3 test cases, 24 total tests)
   - **Tags**: @Functional, @Accessibility, @Performance, @HeroBanner

2. [Header Component](./header.test-cases.md)
   - Logo display and accessibility verification
   - Tagline text validation
   - Country text verification
   - Part of User Story 108
   
3. [Footer Component](./footer.test-cases.md)
   - Navigation links verification
   - Link behavior testing
   - Hover state validation
   - Copyright text verification

4. [Text With Image Component](./textWithImage.test-cases.md)
   - Component visibility and structure validation
   - Header text and semantic HTML verification
   - Image rendering and accessibility testing
   - Rich text body content validation
   - Tagged with @Functional and @Accessibility

5. [Sauce Demo Register](./saucedemo-register.test-cases.md)
   - Registration form structure, field types, and invalid-email validation
   - Responsive and page-load smoke checks
   - Accessibility coverage with current live-page findings documented
   - Account-creation flows marked blocked while Shopify sign-up is disabled

6. [Sauce Demo Search Product](./saucedemo-search-product.test-cases.md)
   - Dedicated Grey Jacket search coverage mapped to AC1-AC6
   - Product details/availability, relevance, navigation, errors, and response time
   - Keyboard, accessibility, mixed-case, and desktop/mobile checks
   - Test-case scope approved by user on 2026-10-28

7. [Sauce Demo Add To Cart](./saucedemo-add-to-cart.test-cases.md)
   - Grey Jacket single/repeated additions, pricing, quantity, and persistence
   - Reuses Search Product for search-to-cart integration
   - Keyboard, accessibility, performance, and desktop/mobile coverage
   - Test-case scope approved by user on 2026-10-28

## Best Practices
1. Keep test cases updated when requirements change
2. Maintain traceability between requirements and test cases
3. Include clear test steps and expected results
4. Document any special setup or prerequisites
5. Note any known limitations or special conditions

## Naming Convention
- Files: `{component-name}.test-cases.md`
- Test Case IDs: `TC-{Component Initial}{Number}` (e.g., TC-F001 for Footer)

## Status Tracking
Use the following status indicators in traceability matrices:
- Ready: Test case is ready for implementation
- Implemented: Test case has been automated
- Blocked: Test case cannot be implemented (document reason)
- Deprecated: Test case is no longer valid
