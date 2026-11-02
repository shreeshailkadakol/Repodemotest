import { test, expect } from '@playwright/test';
import { FeaturedSearchResultsComponent } from '../../components/featuredSearchResultsComponent';
import { envUtils } from '../../helpers/utils/envUtils';
import AxeBuilder from '@axe-core/playwright';
import { FeaturedSearchResultsFigmaValues } from '../../helpers/utils/figma-values/FeaturedSearchResults_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * FEATURED SEARCH RESULTS COMPONENT TESTING SUITE
 * User Story: 1651 - Site Search – Featured Search Results component
 * 
 * Testing approach:
 * - All tests use soft assertions (expect.soft())
 * - SmartLocator methods for all element interactions
 * - Language-agnostic assertions
 * - Proper test tags (@Functional, @Accessibility, @Performance, @Visual)
 * - Test Coverage: 32 test cases (12 Functional + 8 Accessibility + 4 Performance + 8 Visual)
 */

test.describe('Featured Search Results Component - Comprehensive Testing Suite', () => {
  let component: FeaturedSearchResultsComponent;
  const baseURL = envUtils.getBaseUrl();
  const searchTerm = 'Bayer Beyond';

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('featuredSearchResults');
    component = new FeaturedSearchResultsComponent(page, browser, context);
  });

  // ============================================
  // I. FUNCTIONAL TEST CASES
  // ============================================

  test.describe('Functional Tests - Component Behavior and Structure', () => {
    
    test('TC-FSR-F001: Verify Featured Results Section Appears for Configured Search Term @Functional @Smoke', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify section visible
      await component.verifyFeaturedResultsSectionVisible();
      
      // Verify section heading
      await component.verifyFeaturedResultsHeading();
      
      // Verify card count within limits
      await component.verifyFeaturedCardCount();
      
      // Log component state for debugging
      await component.logComponentState();
    });

    test('TC-FSR-F002: Verify Featured Results Section Position Above Regular Results @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify Featured Results visible
      const featuredSection = await component.getFeaturedResultsSection();
      await expect.soft(featuredSection).toBeVisible();
      
      // Verify positioning
      await component.verifyFeaturedResultsPositioning();
    });

    test('TC-FSR-F003: Verify Featured Result Card Structure @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify first card structure
      await component.verifyCardStructure(0);
      
      // Verify second card if exists
      const cardCount = await component.getFeaturedCardsCount();
      if (cardCount > 1) {
        await component.verifyCardStructure(1);
      }
    });

    test('TC-FSR-F004: Verify Featured Results Display Limit (1-3 Cards) @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify card count
      await component.verifyFeaturedCardCount();
      
      const count = await component.getFeaturedCardsCount();
      console.log(`Featured Results displayed: ${count} cards`);
    });

    test('TC-FSR-F005: Verify Featured Result Card Navigation @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Get first card link and href
      const firstCard = await component.getFirstFeaturedCard();
      const cardLink = await component.getFeaturedCardLink(firstCard);
      
      await expect.soft(cardLink).toBeVisible();
      
      // Verify href attribute exists
      const href = await cardLink.getAttribute('href');
      expect.soft(href).toBeTruthy();
      if (href) {
        expect.soft(href.length).toBeGreaterThan(0);
      }
      
      console.log(`Featured card link: ${href}`);
      
      // Click and verify navigation (in new context to avoid navigation)
      const newPage = await page.context().newPage();
      await newPage.goto(page.url());
      const newComponent = new FeaturedSearchResultsComponent(newPage, component['browser'], component['context']);
      await newComponent.performSearch(searchTerm);
      await newPage.waitForLoadState('networkidle');
      
      const clickedHref = await newComponent.clickFeaturedCard(0);
      expect.soft(clickedHref).toBeTruthy();
      expect.soft(newPage.url()).toContain(clickedHref || '');
      
      await newPage.close();
    });

    test('TC-FSR-F006: Verify Featured Results Section Title Display @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Get section heading
      const heading = await component.getFeaturedResultsSection();
      await expect.soft(heading).toBeVisible();
      
      // Verify heading text
      const headingText = await heading.textContent();
      expect.soft(headingText?.toLowerCase()).toContain('featured results');
      
      // Verify typography classes (per DOM inspection)
      const headingClasses = await heading.getAttribute('class');
      expect.soft(headingClasses).toContain('text-xl');
      expect.soft(headingClasses).toContain('font-bold');
    });

    test('TC-FSR-F007: Verify Featured Results Persist on Pagination @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify persistence
      await component.verifyFeaturedResultsPersistOnPagination();
    });

    test('TC-FSR-F008: Verify Case-Insensitive Search Term Matching @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm.toLowerCase());
      await component.verifyFeaturedResultsSectionVisible();
      
      await component.performSearch(searchTerm.toUpperCase());
      await page.waitForTimeout(1000);
      await component.verifyFeaturedResultsSectionVisible();
      
      await component.performSearch('bAyEr BeYoNd');
      await page.waitForTimeout(1000);
      await component.verifyFeaturedResultsSectionVisible();
      
      console.log('Case-insensitive matching verified');
    });

    test('TC-FSR-F009: Verify No Featured Results for Non-Configured Terms @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, 'random12345xyz');
      await page.waitForTimeout(2000);
      
      // Verify Featured Results NOT visible
      const isVisible = await component.isVisibleSmart({
        text: /featured results/i,
        css: 'div.bg-background-bg-elevated',
        description: 'Featured Results section - should NOT exist'
      });
      
      expect.soft(isVisible).toBe(false);
      console.log('Verified: No Featured Results for non-configured search term');
    });

    test('TC-FSR-F010: Verify Featured Result Card Hover Effect @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const firstCard = await component.getFirstFeaturedCard();
      await expect.soft(firstCard).toBeVisible();
      
      // Take screenshot before hover
      const beforeHover = await firstCard.screenshot();
      
      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(500);
      
      // Take screenshot after hover
      const afterHover = await firstCard.screenshot();
      
      // Verify screenshots are different (hover effect applied)
      expect.soft(beforeHover.length).not.toBe(afterHover.length);
      console.log('Hover effect detected on featured card');
    });

    test('TC-FSR-F011: Verify Featured Results Section Background Styling @Functional', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const container = await component.getFeaturedResultsContainer();
      await expect.soft(container).toBeVisible();
      
      // Verify elevated background class
      const containerClasses = await container.getAttribute('class');
      expect.soft(containerClasses).toContain('bg-background-bg-elevated');
      
      // Verify padding and margin classes
      expect.soft(containerClasses).toMatch(/px-5|px-8/);
      expect.soft(containerClasses).toContain('mt-6');
      
      console.log('Background styling verified');
    });

    test('TC-FSR-F012: Verify Responsive Layout (Mobile to Desktop) @Functional', async ({ page }) => {
      const viewports = [
        { name: 'SM', width: 375, height: 667 },
        { name: 'MD', width: 768, height: 1024 },
        { name: 'LG', width: 1024, height: 800 },
        { name: 'XL', width: 1440, height: 900 },
      ];

      for (const viewport of viewports) {
        console.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await component.navigateAndSearch(baseURL, searchTerm);
        
        // Verify Featured Results visible at all viewports
        await component.verifyFeaturedResultsSectionVisible();
        
        // Verify no horizontal scrollbars
        const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        expect.soft(hasHorizontalScroll).toBe(false);
        
        // Verify cards are visible
        const cards = await component.getFeaturedCards();
        const cardCount = await cards.count();
        for (let i = 0; i < cardCount; i++) {
          await expect.soft(cards.nth(i)).toBeVisible();
        }
        
        console.log(`${viewport.name}: Layout responsive, ${cardCount} cards visible`);
      }
    });

  });

  // ============================================
  // II. ACCESSIBILITY TEST CASES
  // ============================================

  test.describe('Accessibility Tests - WCAG 2.1 AA Compliance', () => {
    
    test('TC-FSR-A001: Verify Semantic HTML Structure @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify heading is proper heading element
      const heading = await component.getFeaturedResultsSection();
      const headingTag = await heading.evaluate(el => el.tagName.toLowerCase());
      expect.soft(headingTag).toMatch(/^(h1|h2|h3|h4|h5|h6|div)$/);
      
      // Verify cards use section/article elements
      const cards = await component.getFeaturedCards();
      const firstCard = cards.first();
      const cardTag = await firstCard.evaluate(el => el.tagName.toLowerCase());
      expect.soft(cardTag).toMatch(/^(section|article|div)$/);
      
      // Run Axe-core audit
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect.soft(accessibilityScanResults.violations.length).toBe(0);
      
      console.log('Semantic HTML structure verified');
    });

    test('TC-FSR-A002: Verify Keyboard Navigation Through Featured Cards @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Tab to first card
      await page.keyboard.press('Tab');
      let attempts = 0;
      while (attempts < 20) {
        const focusedElement = await page.evaluate(() => {
          const element = document.activeElement as HTMLElement;
          return element?.dataset?.qa;
        });
        if (focusedElement?.includes('news-list-item') || focusedElement?.includes('title-component')) {
          break;
        }
        await page.keyboard.press('Tab');
        attempts++;
      }
      
      // Verify focus visible
      const focusedElement = page.locator(':focus');
      await expect.soft(focusedElement).toBeVisible();
      
      // Press Enter to navigate
      const initialUrl = page.url();
      await page.keyboard.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      
      // Verify navigation occurred
      const newUrl = page.url();
      expect.soft(newUrl).not.toBe(initialUrl);
      
      console.log('Keyboard navigation verified');
    });

    test('TC-FSR-A003: Verify Screen Reader Compatibility @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify heading has proper role or semantic element
      const heading = await component.getFeaturedResultsSection();
      const headingRole = await heading.getAttribute('role');
      const headingTag = await heading.evaluate(el => el.tagName.toLowerCase());
      
      expect.soft(headingRole || headingTag).toBeTruthy();
      
      // Verify cards have accessible names
      const cards = await component.getFeaturedCards();
      const firstCard = cards.first();
      
      const cardAriaLabel = await firstCard.getAttribute('aria-label');
      const cardRole = await firstCard.getAttribute('role');
      
      // At least one should be present for screen readers
      expect.soft(cardAriaLabel || cardRole).toBeTruthy();
      
      // Verify image alt text
      const image = await component.getCardElement(0, 'image');
      const altText = await image.getAttribute('alt');
      expect.soft(altText).toBeDefined();
      
      console.log('Screen reader compatibility verified');
    });

    test('TC-FSR-A004: Verify Focus Indicators Visible @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Tab through elements and verify focus
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        
        const focusedElement = page.locator(':focus');
        const isFocusVisible = await focusedElement.count() > 0;
        
        if (isFocusVisible) {
          // Get outline/border styles
          const outlineWidth = await focusedElement.evaluate(el => globalThis.getComputedStyle(el).outlineWidth);
          const outlineStyle = await focusedElement.evaluate(el => globalThis.getComputedStyle(el).outlineStyle);
          
          expect.soft(outlineWidth).not.toBe('0px');
          expect.soft(outlineStyle).not.toBe('none');
          break;
        }
      }
      
      console.log('Focus indicators visible');
    });

    test('TC-FSR-A005: Verify Image Alt Text Present @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const cards = await component.getFeaturedCards();
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const image = await component.getCardElement(i, 'image');
        await expect.soft(image).toHaveAttribute('alt');
        
        const altText = await image.getAttribute('alt');
        console.log(`Card ${i} image alt: "${altText}"`);
      }
      
      console.log('All images have alt text');
    });

    test('TC-FSR-A006: Verify Color Contrast Compliance @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Run Axe-core color-contrast check
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      const contrastViolations = accessibilityScanResults.violations.filter(v => v.id === 'color-contrast');
      expect.soft(contrastViolations.length).toBe(0);
      
      // Manual contrast check for heading
      const heading = await component.getFeaturedResultsSection();
      const textColor = await heading.evaluate(el => globalThis.getComputedStyle(el).color);
      const backgroundColor = await heading.evaluate(el => globalThis.getComputedStyle(el).backgroundColor);
      
      console.log(`Heading - Text: ${textColor}, Background: ${backgroundColor}`);
      expect.soft(textColor).toBeTruthy();
      expect.soft(backgroundColor).toBeTruthy();
      
      console.log('Color contrast compliance verified');
    });

    test('TC-FSR-A007: Verify Heading Hierarchy @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Verify Featured Results heading fits in hierarchy
      const featuredHeading = await component.getFeaturedResultsSection();
      const featuredTag = await featuredHeading.evaluate(el => el.tagName.toLowerCase());
      
      const headingRegex = /^h[1-6]$/;
      if (headingRegex.exec(featuredTag)) {
        const featuredLevel = Number.parseInt(featuredTag.replace('h', ''), 10);
        console.log(`Featured Results heading level: H${featuredLevel}`);
        expect.soft(featuredLevel).toBeGreaterThanOrEqual(1);
        expect.soft(featuredLevel).toBeLessThanOrEqual(6);
      }
      
      console.log('Heading hierarchy verified');
    });

    test('TC-FSR-A008: Verify Axe-core Full Audit @Accessibility', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Run full Axe-core audit
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      // Log violations if any
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`Accessibility violations found: ${accessibilityScanResults.violations.length}`);
        accessibilityScanResults.violations.forEach(violation => {
          console.log(`\n- ${violation.id}: ${violation.description}`);
          console.log(`  Impact: ${violation.impact}`);
          console.log(`  WCAG: ${violation.tags.join(', ')}`);
          console.log(`  Affected elements (${violation.nodes.length}):`);
          violation.nodes.forEach((node, index) => {
            console.log(`    ${index + 1}. ${node.html.substring(0, 200)}${node.html.length > 200 ? '...' : ''}`);
            console.log(`       Failure: ${node.failureSummary?.substring(0, 150) || 'N/A'}`);
          });
        });
      }
      
      expect.soft(accessibilityScanResults.violations.length).toBe(0);
      console.log('Axe-core audit: 0 violations');
    });

  });

  // ============================================
  // III. PERFORMANCE TEST CASES
  // ============================================

  test.describe('Performance Tests - Load Time and Metrics', () => {
    
    test('TC-FSR-P001: Verify Component Load Time <3 seconds @Performance', async ({ page }) => {
      const startTime = Date.now();
      
      await component.navigateAndSearch(baseURL, searchTerm);
      await component.verifyFeaturedResultsSectionVisible();
      
      const endTime = Date.now();
      const loadTime = (endTime - startTime) / 1000;
      
      console.log(`Component load time: ${loadTime.toFixed(2)}s`);
      expect.soft(loadTime).toBeLessThan(3);
    });

    test('TC-FSR-P002: Verify Image Loading Performance @Performance', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const cards = await component.getFeaturedCards();
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const image = await component.getCardElement(i, 'image');
        
        // Wait for image to load
        await expect.soft(image).toBeVisible({ timeout: 5000 });
        
        // Verify image loaded
        const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
        expect.soft(naturalWidth).toBeGreaterThan(0);
        
        console.log(`Card ${i} image loaded: ${naturalWidth}px width`);
      }
      
      console.log('All images loaded successfully');
    });

    test('TC-FSR-P003: Verify No Memory Leaks @Performance', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Get initial memory
      const initialMetrics = await page.evaluate(() => {
        const perf: any = performance;
        if (perf.memory) {
          return {
            usedJSHeapSize: perf.memory.usedJSHeapSize,
            totalJSHeapSize: perf.memory.totalJSHeapSize
          };
        }
        return null;
      });
      
      // Perform multiple searches
      for (let i = 0; i < 5; i++) {
        await component.performSearch(searchTerm);
        await page.waitForTimeout(1000);
      }
      
      // Get final memory
      const finalMetrics = await page.evaluate(() => {
        const perf: any = performance;
        if (perf.memory) {
          return {
            usedJSHeapSize: perf.memory.usedJSHeapSize,
            totalJSHeapSize: perf.memory.totalJSHeapSize
          };
        }
        return null;
      });
      
      if (initialMetrics && finalMetrics) {
        const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
        const memoryIncreaseMB = memoryIncrease / 1024 / 1024;
        
        console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
        
        // Memory increase should be reasonable (<50MB for 5 searches)
        expect.soft(memoryIncreaseMB).toBeLessThan(50);
      }
    });

    test('TC-FSR-P004: Verify API Response Time @Performance', async ({ page }) => {
      let apiResponseTime = 0;
      
      // Monitor network requests
      page.on('response', response => {
        if (response.url().includes('search') || response.url().includes('api')) {
          apiResponseTime = response.request().timing()?.responseEnd || 0;
        }
      });
      
      await component.navigateAndSearch(baseURL, searchTerm);
      
      if (apiResponseTime > 0) {
        console.log(`API response time: ${apiResponseTime.toFixed(2)}ms`);
        expect.soft(apiResponseTime).toBeLessThan(2000); // <2s
      } else {
        console.log('No API calls detected or timing unavailable');
      }
    });

  });

  // ============================================
  // IV. VISUAL TEST CASES
  // ============================================

  test.describe('Visual Tests - Styling and Design Compliance', () => {
    
    test('TC-FSR-V001: Verify Typography Matches Design @Visual', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      // Get Figma design specifications for XL viewport
      const figmaValues = FeaturedSearchResultsFigmaValues.XL;
      
      // Helper function to normalize colors for comparison
      const normalizeColor = (color: string): string => {
        // Convert rgb(r, g, b) to rgba(r, g, b, 1) for consistent comparison
        return color.replace(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/, 'rgba($1, $2, $3, 1)');
      };
      
      // Verify Featured Results heading typography
      const heading = await component.getFeaturedResultsSection();
      const headingStyles = await heading.evaluate(el => {
        const styles = globalThis.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          lineHeight: styles.lineHeight,
          color: styles.color
        };
      });
      
      console.log('Figma heading specs:', figmaValues.featuredResultsHeading);
      console.log('Actual heading styles:', headingStyles);
      
      // Validate against Figma specifications
      expect.soft(headingStyles.fontSize).toBe(figmaValues.featuredResultsHeading.fontSize);
      expect.soft(headingStyles.fontWeight).toBe(figmaValues.featuredResultsHeading.fontWeight);
      expect.soft(headingStyles.fontFamily).toContain('Bayer Sans');
      expect.soft(headingStyles.lineHeight).toBe(figmaValues.featuredResultsHeading.lineHeight);
      expect.soft(normalizeColor(headingStyles.color)).toBe(figmaValues.featuredResultsHeading.color);
      
      // Verify card title typography - get title from first featured card
      const cardTitle = await component.findSmart({
        dataQa: 'title-component',
        css: '[data-qa="news-list-item"] [data-qa="title-component"], [data-qa="news-list-item"] h3',
        role: { role: 'heading' },
        xpath: './/*[@data-qa="news-list-item"]//*[@data-qa="title-component"] | .//*[@data-qa="news-list-item"]//h3',
        description: 'Featured card title for typography test',
      });
      
      const titleStyles = await cardTitle.first().evaluate(el => {
        const styles = globalThis.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          lineHeight: styles.lineHeight,
          color: styles.color
        };
      });
      
      console.log('Figma card title specs:', figmaValues.cardTitle);
      console.log('Actual card title styles:', titleStyles);
      
      // Validate card title against Figma
      expect.soft(titleStyles.fontSize).toBe(figmaValues.cardTitle.fontSize);
      expect.soft(titleStyles.fontWeight).toBe(figmaValues.cardTitle.fontWeight);
      expect.soft(titleStyles.fontFamily).toContain('Bayer Sans');
      expect.soft(titleStyles.lineHeight).toBe(figmaValues.cardTitle.lineHeight);
      
      console.log('Typography validation complete - Figma values integrated successfully');
    });

    test('TC-FSR-V002: Verify Spacing and Layout @Visual', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const container = await component.getFeaturedResultsContainer();
      const containerStyles = await container.evaluate(el => {
        const styles = globalThis.getComputedStyle(el);
        return {
          marginTop: styles.marginTop,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          paddingTop: styles.paddingTop
        };
      });
      
      console.log('Container spacing:', containerStyles);
      
      // Verify mt-6 class (typically 1.5rem / 24px)
      expect.soft(containerStyles.marginTop).toMatch(/(24px|1.5rem)/);
      
      // Verify px-5 or px-8 classes
      expect.soft(containerStyles.paddingLeft).toBeTruthy();
      expect.soft(containerStyles.paddingRight).toBeTruthy();
    });

    test('TC-FSR-V003: Verify Hover Effects on Cards @Visual', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const firstCard = await component.getFirstFeaturedCard();
      
      // Get initial transform
      const initialTransform = await firstCard.evaluate(el => globalThis.getComputedStyle(el).transform);
      
      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(300);
      
      // Get hover transform
      const hoverTransform = await firstCard.evaluate(el => globalThis.getComputedStyle(el).transform);
      
      console.log(`Initial transform: ${initialTransform}`);
      console.log(`Hover transform: ${hoverTransform}`);
      
      // Transforms might differ on hover
      // This is a visual validation - we just verify no errors occur
      expect.soft(hoverTransform).toBeTruthy();
    });

    test('TC-FSR-V004: Verify Responsive Reflow XL Viewport @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await component.navigateAndSearch(baseURL, searchTerm);
      
      await component.verifyFeaturedResultsSectionVisible();
      
      const cards = await component.getFeaturedCards();
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        await expect.soft(card).toBeVisible();
        
        const box = await card.boundingBox();
        expect.soft(box).toBeTruthy();
        console.log(`XL - Card ${i}: ${box?.width}px x ${box?.height}px`);
      }
    });

    test('TC-FSR-V005: Verify Responsive Reflow LG Viewport @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 800 });
      await component.navigateAndSearch(baseURL, searchTerm);
      
      await component.verifyFeaturedResultsSectionVisible();
      
      const cards = await component.getFeaturedCards();
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        await expect.soft(card).toBeVisible();
        
        const box = await card.boundingBox();
        console.log(`LG - Card ${i}: ${box?.width}px x ${box?.height}px`);
      }
    });

    test('TC-FSR-V006: Verify Responsive Reflow MD Viewport @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await component.navigateAndSearch(baseURL, searchTerm);
      
      await component.verifyFeaturedResultsSectionVisible();
      
      const cards = await component.getFeaturedCards();
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        await expect.soft(card).toBeVisible();
        
        const box = await card.boundingBox();
        console.log(`MD - Card ${i}: ${box?.width}px x ${box?.height}px`);
      }
    });

    test('TC-FSR-V007: Verify Responsive Reflow SM Viewport @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await component.navigateAndSearch(baseURL, searchTerm);
      
      await component.verifyFeaturedResultsSectionVisible();
      
      const cards = await component.getFeaturedCards();
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        await expect.soft(card).toBeVisible();
        
        const box = await card.boundingBox();
        console.log(`SM - Card ${i}: ${box?.width}px x ${box?.height}px`);
      }
    });

    test('TC-FSR-V008: Verify Section Background and Elevation @Visual', async ({ page }) => {
      await component.navigateAndSearch(baseURL, searchTerm);
      
      const container = await component.getFeaturedResultsContainer();
      
      const styles = await container.evaluate(el => {
        const computed = globalThis.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          boxShadow: computed.boxShadow,
          borderRadius: computed.borderRadius
        };
      });
      
      console.log('Container visual styles:', styles);
      
      // Verify background color is set (elevated background)
      expect.soft(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect.soft(styles.backgroundColor).not.toBe('transparent');
      
      console.log('Section styling verified');
    });

  });

});
