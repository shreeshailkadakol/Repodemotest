# Header Component Test Cases

## Overview
This document contains test cases for the Header component based on the implemented tests in header.spec.ts.

## Component Structure
The Header component tests verify three main elements:
1. Logo with proper loading and accessibility
2. Tagline text
3. Country text (UK)

## Test Cases

### TC-H001: Verify Header Logo
**Priority:** High  
**Type:** Functional/Accessibility  
**Component:** Header  
**User Story:** 108  

**Description:**  
Verify that the Bayer logo in the header is properly displayed and accessible.

**Prerequisites:**
- Application is running
- Test environment is accessible

**Test Steps:**
1. Navigate to the homepage
2. Wait for logo to be visible
3. Verify logo image has alt text
4. Verify image is properly loaded (complete and has natural height)

**Expected Results:**
- Logo is visible in header
- Logo image has proper alt text for accessibility
- Image is fully loaded and displayed correctly

---

### TC-H002: Verify Header Tagline
**Priority:** High  
**Type:** Content  
**Component:** Header  
**User Story:** 108  

**Description:**  
Verify that the header tagline displays the correct text.

**Test Steps:**
1. Wait for tagline element to be visible
2. Get tagline text content
3. Verify text is not empty
4. Verify text matches expected content: "Health for all, Hunger for none"

**Expected Results:**
- Tagline is visible
- Text matches exactly: "Health for all, Hunger for none"

---

### TC-H003: Verify Country Text
**Priority:** High  
**Type:** Content  
**Component:** Header  
**User Story:** 108  

**Description:**  
Verify that the country identifier (UK) is correctly displayed.

**Test Steps:**
1. Wait for country text element to be visible
2. Get country text content
3. Verify text is not empty
4. Verify text indicates UK region

**Expected Results:**
- Country text is visible
- Text indicates UK region correctly

## Test Execution Notes
- Tests use Page Object Model pattern
- Cookie banner is handled automatically
- Timeout is set to 100s for initial load
- Tests are tagged with '@tag' for filtering

## Traceability Matrix

| Test Case ID | Feature | User Story | Priority | Status |
|-------------|---------|------------|----------|--------|
| TC-H001 | Logo Display | 108 | High | Implemented |
| TC-H002 | Tagline | 108 | High | Implemented |
| TC-H003 | Country Text | 108 | High | Implemented |
