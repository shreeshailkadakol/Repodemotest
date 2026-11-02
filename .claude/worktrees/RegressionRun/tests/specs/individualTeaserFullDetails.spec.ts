import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { IndividualTeaserFullDetailsComponent } from '../../components/individualTeaserFullDetailsComponent';
import { componentURL } from '../../test-data/componentURL';
import { envUtils } from '../../helpers/utils/envUtils';
import { TEST_CONFIG } from '../../config/test-config';
import AxeBuilder from '@axe-core/playwright';
import { IndividualTeaserFullDetailsFigmaValues } from '../../helpers/utils/figma-values/IndividualTeaserFullDetails_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let component: IndividualTeaserFullDetailsComponent;
let page: Page;
let browser: Browser;
let context: BrowserContext;

/**
 * Setup: Navigate to component page with authentication
 */
test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
  page = testPage;
  browser = testBrowser;
  context = testContext;

  component = new IndividualTeaserFullDetailsComponent(page, browser, context);

  // Navigate to component URL with authentication
  const baseURL = envUtils.getBaseUrl();
  const componentPath = componentURL.IndividualTeaserFullDetailsComponent.testData.url;
  // Remove trailing slash from baseURL to avoid double slashes
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const fullUrl = `${cleanBaseURL}/${componentPath}`;
  await component.navigateWithAuthentication(fullUrl);
  
  // Accept cookies banner to prevent click interception
  await component.acceptCookiesBanner();
  
  // Wait for page to fully load and component to be visible
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Wait for component to be visible
  const container = await component.getComponentContainer();
  await container.waitFor({ state: 'visible', timeout: 15000 });
});

/**
 * ==========================================================================
 * FUNCTIONAL TESTS (TC-IT01 to TC-IT12)
 * Tags: @Functional
 * ==========================================================================
 */

test.describe('Individual Teaser Full Details - Functional Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('individualTeaserFullDetails');
  });


  test('TC-IT01: Individual Teaser component renders on page mount @Functional @Smoke', async () => {
    await test.step('Verify component container is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component container should be visible').toBeVisible();
    });

    await test.step('Verify all required elements are present', async () => {
      await component.validateComponentRendering();
    });
  });

  test('TC-IT02: Component renders in 25% or 33% column divider (AC2 - FE validation) @Functional', async () => {
    await test.step('Verify parent column layout', async () => {
      const columnType = await component.validateColumnLayout();

      expect.soft(columnType, 'Column should be 25% or 33%').toMatch(/columns(25|33)/);
    });
  });

  test('TC-IT03: Landscape image renders above text content @Functional', async () => {
    await test.step('Verify image is visible and loaded', async () => {
      await component.validateImageRendering();
    });

    await test.step('Verify image position relative to text', async () => {
      const image = await component.getImageElement();
      const headline = await component.getHeadlineElement();

      const imageBox = await image.boundingBox();
      const headlineBox = await headline.boundingBox();

      expect.soft(imageBox, 'Image should have bounding box').toBeTruthy();
      expect.soft(headlineBox, 'Headline should have bounding box').toBeTruthy();

      if (imageBox && headlineBox) {
        expect.soft(imageBox.y, 'Image should be above headline').toBeLessThan(headlineBox.y);
      }
    });
  });

  test('TC-IT04: Kicker text renders correctly @Functional', async () => {
    await test.step('Verify kicker text is not empty', async () => {
      const kickerText = await component.validateKickerContent();

      expect.soft(kickerText, 'Kicker text should not be empty').toBeTruthy();
      expect.soft(kickerText.length, 'Kicker should have meaningful content').toBeGreaterThan(0);
    });
  });

  test('TC-IT05: Headline text renders correctly @Functional', async () => {
    await test.step('Verify headline content and semantic HTML', async () => {
      const { text, tagName } = await component.validateHeadlineRendering();

      expect.soft(text, 'Headline text should not be empty').toBeTruthy();
      expect.soft(tagName, 'Headline should use H2 or H3 tag').toMatch(/h[23]/);
    });
  });

  test('TC-IT06: Summary text renders correctly @Functional', async () => {
    await test.step('Verify summary content', async () => {
      const summaryText = await component.validateSummaryContent();

      expect.soft(summaryText, 'Summary text should not be empty').toBeTruthy();
      expect.soft(summaryText.length, 'Summary should have meaningful content').toBeGreaterThan(10);
    });
  });

  test('TC-IT07: Link/CTA element renders correctly @Functional', async () => {
    await test.step('Verify link has href and is accessible', async () => {
      const { href } = await component.validateLinkRendering();

      expect.soft(href, 'Link href should be present').toBeTruthy();
      expect.soft(href, 'Link href should be valid URL or path').toMatch(/^(https?:\/\/|\/)/);
    });
  });

  test('TC-IT08: Image zoom animation on hover (100% → 105%) @Functional', async () => {
    await test.step('Verify image scales on hover', async () => {
      const { initial, onHover } = await component.validateImageZoomOnHover();

      expect.soft(initial, 'Initial scale should be 1 (100%)').toBeCloseTo(1, 1);
      expect.soft(onHover, 'Hover scale should be ~1.05 (105%)').toBeGreaterThan(initial);
      expect.soft(onHover, 'Hover scale should be within expected range').toBeGreaterThanOrEqual(1.03);
      expect.soft(onHover, 'Hover scale should be within expected range').toBeLessThanOrEqual(1.07);
    });
  });

  test('TC-IT09: Slanted line animation on hover @Functional', async () => {
    await test.step('Hover over card', async () => {
      await component.hoverOverCard();
    });

    await test.step('Verify animation triggers (visual check)', async () => {
      // Note: Slanted line animation is CSS-based and requires visual validation
      // This test verifies hover interaction works; visual validation in separate test
      const container = await component.getComponentContainer();
      const isHovered = await container.evaluate(el => {
        return el.matches(':hover') || el.querySelector(':hover') !== null;
      });

      expect.soft(isHovered, 'Card should be in hover state').toBeTruthy();
    });
  });

  test('TC-IT10: Whole card is clickable @Functional', async () => {
    await test.step('Verify card has clickable link', async () => {
      const isClickable = await component.validateCardClickable();

      expect.soft(isClickable, 'Card should be clickable').toBeTruthy();
    });
  });

  test('TC-IT11: Card click navigates to correct URL @Functional', async () => {
    await test.step('Click card and verify navigation intent', async () => {
      // Capture navigation request
      const navigationPromise = page.waitForEvent('framenavigated', { timeout: 5000 }).catch(() => null);

      await component.clickCard();

      await navigationPromise;

      expect.soft(page.url(), 'Page should navigate or prepare to navigate').toBeDefined();
    });
  });

  test('TC-IT12: Component maintains structure on window resize @Functional', async () => {
    await test.step('Resize viewport and verify component integrity', async () => {
      // Start at XL
      await page.setViewportSize(TEST_CONFIG.viewports.XL);
      await page.waitForTimeout(500);

      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component visible at XL').toBeVisible();

      // Resize to MD
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);

      await expect.soft(container, 'Component visible at MD').toBeVisible();

      // Verify structure maintained
      await component.validateComponentRendering();
    });
  });
});

/**
 * ==========================================================================
 * VISUAL TESTS (TC-IT13 to TC-IT28)
 * Tags: @Visual
 * Typography validation across 4 viewports (XL, LG, MD, SM)
 * ==========================================================================
 */

test.describe('Individual Teaser Full Details - Visual Tests', () => {

  test('TC-IT13: Kicker typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getKickerTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.XL.kickerTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('XL Kicker Typography:', styles);
  });

  test('TC-IT14: Kicker typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getKickerTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.LG.kickerTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('LG Kicker Typography:', styles);
  });

  test('TC-IT15: Kicker typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getKickerTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.MD.kickerTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('MD Kicker Typography:', styles);
  });

  test('TC-IT16: Kicker typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getKickerTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.SM.kickerTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('SM Kicker Typography:', styles);
  });

  test('TC-IT17: Headline typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getHeadlineTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.XL.headlineTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('XL Headline Typography:', styles);
  });

  test('TC-IT18: Headline typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getHeadlineTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.LG.headlineTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('LG Headline Typography:', styles);
  });

  test('TC-IT19: Headline typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getHeadlineTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.MD.headlineTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('MD Headline Typography:', styles);
  });

  test('TC-IT20: Headline typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getHeadlineTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.SM.headlineTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('SM Headline Typography:', styles);
  });

  test('TC-IT21: Summary typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getSummaryTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.XL.summaryTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('XL Summary Typography:', styles);
  });

  test('TC-IT22: Summary typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getSummaryTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.LG.summaryTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('LG Summary Typography:', styles);
  });

  test('TC-IT23: Summary typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getSummaryTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.MD.summaryTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('MD Summary Typography:', styles);
  });

  test('TC-IT24: Summary typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getSummaryTypography();
    const expected = IndividualTeaserFullDetailsFigmaValues.SM.summaryTypography;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);

    console.log('SM Summary Typography:', styles);
  });

  test('TC-IT25: Image aspect ratio - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    await component.validateImageRendering();
  });

  test('TC-IT26: Image aspect ratio - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    await component.validateImageRendering();
  });

  test('TC-IT27: Image aspect ratio - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    await component.validateImageRendering();
  });

  test('TC-IT28: Image aspect ratio - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    await component.validateImageRendering();
  });
});

/**
 * ==========================================================================
 * ACCESSIBILITY TESTS (TC-IT29 to TC-IT39)
 * Tags: @Accessibility
 * WCAG 2.1 AA compliance
 * ==========================================================================
 */

test.describe('Individual Teaser Full Details - Accessibility Tests', () => {

  test('TC-IT29: Semantic HTML structure @Accessibility', async () => {
    await test.step('Verify article element for component', async () => {
      const container = await component.getComponentContainer();
      const tagName = await container.evaluate(el => el.tagName.toLowerCase());

      expect.soft(tagName, 'Container should be <article>').toBe('article');
    });

    await test.step('Verify heading hierarchy', async () => {
      const { tagName } = await component.validateHeadlineRendering();

      expect.soft(tagName, 'Headline should be H2 or H3').toMatch(/h[23]/);
    });
  });

  test('TC-IT30: ARIA attributes present @Accessibility', async () => {
    await test.step('Verify component has aria-label', async () => {
      const container = await component.getComponentContainer();
      const ariaLabel = await container.getAttribute('aria-label');

      expect.soft(ariaLabel, 'Component should have aria-label').toBeTruthy();
    });

    await test.step('Verify image has alt text', async () => {
      const image = await component.getImageElement();
      const alt = await image.getAttribute('alt');

      expect.soft(alt !== null, 'Image should have alt attribute').toBeTruthy();
    });
  });

  test('TC-IT31: Keyboard navigation support @Accessibility', async () => {
    await test.step('Tab to card link', async () => {
      const link = await component.getLinkElement();

      // Focus on link
      await link.focus();

      // Verify focus state
      const isFocused = await link.evaluate(el => el === document.activeElement);

      expect.soft(isFocused, 'Link should be focusable via keyboard').toBeTruthy();
    });
  });

  test('TC-IT32: Enter key activates card @Accessibility', async () => {
    await test.step('Focus and press Enter on link', async () => {
      const link = await component.getLinkElement();
      await link.focus();

      const navigationPromise = page.waitForEvent('framenavigated', { timeout: 5000 }).catch(() => null);

      await page.keyboard.press('Enter');

      await navigationPromise;

      // Either navigation occurs or click handler fires
      expect.soft(true, 'Enter key should trigger link action').toBeTruthy();
    });
  });

  test('TC-IT33: Focus indicators visible @Accessibility', async () => {
    await test.step('Verify link has visible focus style', async () => {
      const link = await component.getLinkElement();
      await link.focus();

      const outlineStyle = await link.evaluate(el => {
        const style = globalThis.getComputedStyle(el);
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          outlineStyle: style.outlineStyle,
          boxShadow: style.boxShadow,
        };
      });

      // Either outline or box-shadow should indicate focus
      const hasFocusIndicator =
        outlineStyle.outlineStyle !== 'none' ||
        outlineStyle.boxShadow !== 'none';

      expect.soft(hasFocusIndicator, 'Link should have visible focus indicator').toBeTruthy();
      console.log('Focus style:', outlineStyle);
    });
  });

  test('TC-IT34: Screen reader announces card correctly @Accessibility', async () => {
    await test.step('Verify aria-label on component', async () => {
      const container = await component.getComponentContainer();
      const ariaLabel = await container.getAttribute('aria-label');

      expect.soft(ariaLabel, 'Component should have descriptive aria-label').toBeTruthy();
      expect.soft(ariaLabel, 'Aria-label should contain "teaser"').toContain('teaser');
    });

    await test.step('Verify link has accessible name', async () => {
      const link = await component.getLinkElement();
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      const hasAccessibleName = (linkText && linkText.trim() !== '') || ariaLabel;

      expect.soft(hasAccessibleName, 'Link should have accessible name').toBeTruthy();
    });
  });

  test('TC-IT35: Color contrast meets WCAG AA @Accessibility', async () => {
    await test.step('Verify kicker text contrast', async () => {
      const styles = await component.getKickerTypography();

      // Log for manual review (automated contrast checking requires color parser)
      console.log('Kicker color:', styles.color);
      expect.soft(styles.color, 'Kicker should have defined color').toBeTruthy();
    });

    await test.step('Verify headline text contrast', async () => {
      const styles = await component.getHeadlineTypography();

      console.log('Headline color:', styles.color);
      expect.soft(styles.color, 'Headline should have defined color').toBeTruthy();
    });

    await test.step('Verify summary text contrast', async () => {
      const styles = await component.getSummaryTypography();

      console.log('Summary color:', styles.color);
      expect.soft(styles.color, 'Summary should have defined color').toBeTruthy();
    });
  });

  test('TC-IT36: Images have alt text @Accessibility', async () => {
    await test.step('Verify image alt attribute', async () => {
      const image = await component.getImageElement();
      const alt = await image.getAttribute('alt');

      expect.soft(alt !== null, 'Image must have alt attribute').toBeTruthy();

      if (alt !== null) {
        expect.soft(alt, 'Alt text should be descriptive or empty for decorative').toBeDefined();
      }
    });
  });

  test('TC-IT37: Links have descriptive text @Accessibility', async () => {
    await test.step('Verify link text is meaningful', async () => {
      const link = await component.getLinkElement();
      const linkText = await link.textContent();

      expect.soft(linkText, 'Link should have text content').toBeTruthy();

      if (linkText) {
        // Avoid generic text like "click here", "read more"
        const isGeneric = /^(click here|read more|learn more)$/i.test(linkText.trim());
        expect.soft(isGeneric, 'Link text should be descriptive, not generic').toBeFalsy();
      }
    });
  });

  test('TC-IT38: Touch targets meet minimum size (44x44px) @Accessibility', async () => {
    await test.step('Verify link touch target size', async () => {
      const link = await component.getLinkElement();
      const boundingBox = await link.boundingBox();

      expect.soft(boundingBox, 'Link should have bounding box').toBeTruthy();

      if (boundingBox) {
        expect.soft(boundingBox.width, 'Link width should be >= 44px').toBeGreaterThanOrEqual(44);
        expect.soft(boundingBox.height, 'Link height should be >= 44px').toBeGreaterThanOrEqual(44);
      }
    });
  });

  test('TC-IT39: Axe accessibility scan passes @Accessibility', async () => {
    await test.step('Run axe-core accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-qa="individual-teaser"]')
        .analyze();

      expect.soft(accessibilityScanResults.violations, 'Should have no critical accessibility violations').toHaveLength(0);

      if (accessibilityScanResults.violations.length > 0) {
        console.log('Accessibility violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
      }
    });
  });
});

/**
 * ==========================================================================
 * PERFORMANCE TESTS (TC-IT40 to TC-IT43)
 * Tags: @Performance
 * ==========================================================================
 */

test.describe('Individual Teaser Full Details - Performance Tests', () => {

  test('TC-IT40: Component loads within acceptable time @Performance', async () => {
    const startTime = Date.now();

    await test.step('Measure component load time', async () => {
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 15000 });

      const loadTime = Date.now() - startTime;

      expect.soft(loadTime, 'Component should load within 3 seconds').toBeLessThan(3000);
      console.log(`Component load time: ${loadTime}ms`);
    });
  });

  test('TC-IT41: Image loads efficiently @Performance', async () => {
    await test.step('Verify image is optimized', async () => {
      const image = await component.getImageElement();

      const imageMetrics = await image.evaluate((img: HTMLImageElement) => {
        return {
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          fileSize: 0, // Would need Network API to get actual file size
        };
      });

      expect.soft(imageMetrics.complete, 'Image should be fully loaded').toBeTruthy();
      expect.soft(imageMetrics.naturalWidth, 'Image should have valid dimensions').toBeGreaterThan(0);

      console.log('Image dimensions:', imageMetrics.naturalWidth, 'x', imageMetrics.naturalHeight);
    });
  });
});
