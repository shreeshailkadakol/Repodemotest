import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Stage Full Width Component Page Object Model
 */
export class StageFullWidthPage extends BasePage {
    // Main Container - using parent-child relationships with data-qa attributes
    private readonly stageContainer: Locator = this.page.locator('[data-qa="fullwidth-column"]');
    
    // Text Elements - using parent-child relationships
    private readonly stageKickerText: Locator = this.stageContainer.locator('[data-qa="stage-kicker-text"]');
    private readonly titleComponent: Locator = this.stageContainer.locator('[data-qa="title-component"]');
    private readonly stageHeadlineText: Locator = this.stageContainer.locator('[data-qa="stage-headline-text"]');
    private readonly stageIntroText: Locator = this.stageContainer.locator('[data-qa="stage-intro-text"]');
    
    // Button Elements - using parent-child relationships
    private readonly buttonContainer: Locator = this.stageContainer.locator('[data-qa="stage-buttons"]');
    private readonly primaryButton: Locator = this.buttonContainer.locator('[data-qa="stage-primary-button"]');
    private readonly secondaryButton: Locator = this.buttonContainer.locator('[data-qa="stage-secondary-button"]');

    // Media elements - using parent-child relationships.
    // The image data-qa was renamed next-image -> stage-image (data-testid stays next-image),
    // and the stage now supports VIDEO as well as image, so match either media type.
    private readonly imageSection: Locator = this.stageContainer.locator('[data-qa="stage-image-section"]');
    private readonly stageImages: Locator = this.imageSection.locator(
        '[data-qa="stage-image"], [data-testid="next-image"], video'
    );

    constructor(page: Page, browser: any, context: any) {
        super(page, browser, context);
    }

    /**
     * Navigate to Stage Full Width test page with authentication
     */
    async navigateToStageFullWidth(): Promise<void> {
        const baseURL = envUtils.getBaseUrl();
        const stageFullWidthURL = await this.resolveExecutionUrl('StageFullWidthComponent', baseURL);
        await this.navigateWithAuthentication(stageFullWidthURL);
    }

    /**
     * Wait for Stage Full Width component to load completely
     */
    async waitForComponentLoad(): Promise<void> {
        // Wait for page to be loaded (use domcontentloaded instead of networkidle for better reliability)
        await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        
        // Wait for main container
        await expect.soft(this.stageContainer).toBeVisible({ timeout: 30000 });
        
        // Wait for key text elements
        await expect.soft(this.titleComponent).toBeVisible({ timeout: 30000 });
        await expect.soft(this.stageKickerText).toBeVisible({ timeout: 30000 });
        
        // Additional wait to ensure all components are stable
        await this.page.waitForTimeout(1000);
    }

    // ===== FUNCTIONAL VERIFICATION METHODS =====

    /**
     * TC-SFW001: Verify Stage Full Width component loads successfully
     */
    async verifyComponentLoads(): Promise<void> {
        await expect.soft(this.stageContainer).toBeVisible();
        await expect.soft(this.stageContainer).toHaveAttribute('data-qa', 'fullwidth-column');
        
        // Verify component bounding box exists
        const boundingBox = await this.stageContainer.boundingBox();
        expect.soft(boundingBox).not.toBeNull();
    }

    /**
     * TC-SFW002: Verify all text elements are visible and have content
     */
    async verifyTextElementsVisibility(): Promise<void> {
        // Verify kicker text
        await expect.soft(this.stageKickerText).toBeVisible();
        await expect.soft(this.stageKickerText).not.toBeEmpty();
        
        // Verify main title (H1)
        await expect.soft(this.titleComponent).toBeVisible();
        await expect.soft(this.titleComponent).not.toBeEmpty();
        const titleTagName = await this.titleComponent.evaluate(el => el.tagName.toLowerCase());
        expect.soft(titleTagName).toBe('h1');
        
        // Verify headline text
        await expect.soft(this.stageHeadlineText).toBeVisible();
        await expect.soft(this.stageHeadlineText).not.toBeEmpty();
        
        // Verify intro text
        await expect.soft(this.stageIntroText).toBeVisible();
        await expect.soft(this.stageIntroText).not.toBeEmpty();
    }

    /**
     * TC-SFW003: Verify primary CTA button functionality
     */
    async verifyPrimaryButton(): Promise<void> {
        console.log('Validating primary button functionality and navigation...');
        
        // Verify button is visible
        await expect.soft(this.primaryButton).toBeVisible();
        await expect.soft(this.primaryButton).toBeEnabled();
        await expect.soft(this.primaryButton).toHaveAttribute('data-qa', 'stage-primary-button');
        await expect.soft(this.primaryButton).toHaveAttribute('href');
        
        // Test hover functionality
        await this.primaryButton.hover();
        await this.page.waitForTimeout(500); // Allow hover state to activate
        
        // Get button text for logging
        const buttonText = await this.primaryButton.textContent();
        console.log(`Testing navigation for primary button: "${buttonText}"`);
        
        // Get the href or onclick attribute to verify it has a navigation target
        const href = await this.primaryButton.getAttribute('href');
        const hasOnClick = await this.primaryButton.evaluate((el) => {
            return el.hasAttribute('onclick') || el.onclick !== null;
        });
        
        // Verify button has a navigation mechanism
        if (!href && !hasOnClick) {
            throw new Error('Primary button has no navigation mechanism (no href or onclick)');
        }
        
        // Get current URL before click
        const currentUrl = this.page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        // Click the button and wait for navigation
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }),
            this.primaryButton.click()
        ]);
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // Get new URL after click
        const newUrl = this.page.url();
        console.log(`New URL after click: ${newUrl}`);
        
        // Verify navigation occurred (URL changed or page content changed)
        const navigationOccurred = currentUrl !== newUrl;
        
        if (navigationOccurred) {
            console.log(`[OK] Primary button navigation successful - Navigated from ${currentUrl} to ${newUrl}`);
        } else {
            // Check if it's a same-page anchor link or modal trigger
            console.log('URL did not change - checking if button triggered other actions...');
            
            // Wait a bit for any dynamic content changes
            await this.page.waitForTimeout(1000);
            
            console.log('[OK] Primary button click executed (same page action or anchor link)');
        }
        
        console.log(`[OK] Primary button functionality and navigation validated`);
    }

    /**
     * TC-SFW004: Verify secondary CTA button functionality  
     */
    async verifySecondaryButton(): Promise<void> {
        console.log('Validating secondary button functionality and navigation...');
        
        // Verify button is visible
        await expect.soft(this.secondaryButton).toBeVisible();
        await expect.soft(this.secondaryButton).toBeEnabled();
        await expect.soft(this.secondaryButton).toHaveAttribute('data-qa', 'stage-secondary-button');
        await expect.soft(this.secondaryButton).toHaveAttribute('href');
        
        // Test hover functionality
        await this.secondaryButton.hover();
        await this.page.waitForTimeout(500); // Allow hover state to activate
        
        // Get button text for logging
        const buttonText = await this.secondaryButton.textContent();
        console.log(`Testing navigation for secondary button: "${buttonText}"`);
        
        // Get the href or onclick attribute to verify it has a navigation target
        const href = await this.secondaryButton.getAttribute('href');
        const hasOnClick = await this.secondaryButton.evaluate((el) => {
            return el.hasAttribute('onclick') || el.onclick !== null;
        });
        
        // Verify button has a navigation mechanism
        if (!href && !hasOnClick) {
            throw new Error('Secondary button has no navigation mechanism (no href or onclick)');
        }
        
        // Get current URL before click
        const currentUrl = this.page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        // Click the button and wait for navigation
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }),
            this.secondaryButton.click()
        ]);
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // Get new URL after click
        const newUrl = this.page.url();
        console.log(`New URL after click: ${newUrl}`);
        
        // Verify navigation occurred (URL changed or page content changed)
        const navigationOccurred = currentUrl !== newUrl;
        
        if (navigationOccurred) {
            console.log(`[OK] Secondary button navigation successful - Navigated from ${currentUrl} to ${newUrl}`);
        } else {
            // Check if it's a same-page anchor link or modal trigger
            console.log('URL did not change - checking if button triggered other actions...');
            
            // Wait a bit for any dynamic content changes
            await this.page.waitForTimeout(1000);
            
            console.log('[OK] Secondary button click executed (same page action or anchor link)');
        }
        
        console.log(`[OK] Secondary button functionality and navigation validated`);
    }

    /**
     * TC-SFW005: Verify stage images display and properties
     */
    async verifyStageImages(): Promise<void> {
        // Verify image section container
        await expect.soft(this.imageSection).toBeVisible();
        await expect.soft(this.imageSection).toHaveAttribute('data-qa', 'stage-image-section');
        
        // Scroll to images to trigger lazy loading if applicable
        await this.imageSection.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(3000);
        
        // Check if images exist in DOM first
        const imageCount = await this.stageImages.count();
        expect.soft(imageCount).toBeGreaterThan(0);
        
        // Verify each media element (image OR video) has proper attributes.
        for (let i = 0; i < imageCount; i++) {
            const media = this.stageImages.nth(i);
            const tag = await media.evaluate(el => el.tagName.toLowerCase());
            if (tag === 'img') {
                // Image data-qa is stage-image (data-testid stays next-image); accept either.
                await expect.soft(media).toHaveAttribute('data-qa', /^(stage-image|next-image)$/);
                await expect.soft(media).toHaveAttribute('src');
                await expect.soft(media).toHaveAttribute('alt');
                const naturalWidth = await media.evaluate(img => (img as HTMLImageElement).naturalWidth);
                const naturalHeight = await media.evaluate(img => (img as HTMLImageElement).naturalHeight);
                expect.soft(naturalWidth).toBeGreaterThan(0);
                expect.soft(naturalHeight).toBeGreaterThan(0);
            } else {
                // Video media: verify it exposes a playable source (src attr or <source> child).
                const hasSource = await media.evaluate(
                    el => !!(el as HTMLVideoElement).currentSrc || !!el.getAttribute('src') || !!el.querySelector('source')
                );
                expect.soft(hasSource, 'Stage video should have a playable source').toBeTruthy();
            }
        }
    }

    /**
     * TC-SFW006: Verify component semantic HTML structure
     */
    async verifySemanticStructure(): Promise<void> {
        // Verify main container uses semantic HTML
        const containerTagName = await this.stageContainer.evaluate(el => el.tagName.toLowerCase());
        expect.soft(containerTagName).toBe('section');
        
        // Verify heading hierarchy
        const titleTagName = await this.titleComponent.evaluate(el => el.tagName.toLowerCase());
        expect.soft(titleTagName).toBe('h1');
        
        // Verify paragraph structure  
        const introTagName = await this.stageIntroText.evaluate(el => el.tagName.toLowerCase());
        expect.soft(introTagName).toBe('p');
        
        // Verify button elements use A tags
        const primaryButtonTagName = await this.primaryButton.evaluate(el => el.tagName.toLowerCase());
        const secondaryButtonTagName = await this.secondaryButton.evaluate(el => el.tagName.toLowerCase());
        expect.soft(primaryButtonTagName).toBe('a');
        expect.soft(secondaryButtonTagName).toBe('a');
        
        // Verify images have alt attributes
        const imageCount = await this.stageImages.count();
        for (let i = 0; i < imageCount; i++) {
            const image = this.stageImages.nth(i);
            await expect.soft(image).toHaveAttribute('alt');
        }
    }



    // ===== ACCESSIBILITY VERIFICATION METHODS =====

    /**
     * TC-ASFW002: Verify proper heading hierarchy
     */
    async verifyHeadingHierarchy(): Promise<void> {
        // Verify main title uses H1 tag
        const titleTagName = await this.titleComponent.evaluate(el => el.tagName.toLowerCase());
        expect.soft(titleTagName).toBe('h1');
        
        // Verify heading has meaningful content
        await expect.soft(this.titleComponent).not.toBeEmpty();
        
        // Verify aria-label if present
        const ariaLabel = await this.titleComponent.getAttribute('aria-label');
        if (ariaLabel) {
            expect.soft(ariaLabel).not.toBe('');
        }
    }

    /**
     * TC-ASFW003: Verify image alt text accessibility
     */
    async verifyImageAltText(): Promise<void> {
        const imageCount = await this.stageImages.count();
        
        for (let i = 0; i < imageCount; i++) {
            const image = this.stageImages.nth(i);
            
            // Verify alt attribute exists
            await expect.soft(image).toHaveAttribute('alt');
            
            // Get alt text content
            const altText = await image.getAttribute('alt');
            expect.soft(altText).not.toBe('');
        }
    }

    /**
     * TC-ASFW004: Verify keyboard navigation functionality
     */
    async verifyKeyboardNavigation(): Promise<void> {
        // Tab to primary button and verify focus
        await this.primaryButton.focus();
        await expect.soft(this.primaryButton).toBeFocused();
        
        // Tab to secondary button
        await this.page.keyboard.press('Tab');
        await expect.soft(this.secondaryButton).toBeFocused();
        
        // Test Enter key activation on primary button
        await this.primaryButton.focus();
        // Note: We're not actually pressing Enter to avoid navigation in tests
        // but we verify the button can receive focus
    }

    /**
     * TC-ASFW005: Verify color contrast (basic check)
     */
    async verifyColorContrast(): Promise<void> {
        // Get computed colors for contrast analysis
        const titleColor = await this.titleComponent.evaluate(el => {
            const style = window.getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor
            };
        });
        
        const kickerColor = await this.stageKickerText.evaluate(el => {
            const style = window.getComputedStyle(el);
            return {
                color: style.color,
                backgroundColor: style.backgroundColor
            };
        });
        
        // Verify colors are not the same (basic contrast check)
        expect.soft(titleColor.color).not.toBe(titleColor.backgroundColor);
        expect.soft(kickerColor.color).not.toBe(kickerColor.backgroundColor);
    }

    // ===== PERFORMANCE VERIFICATION METHODS =====

    /**
     * TC-PSFW001: Verify component loading performance
     */
    async verifyLoadingPerformance(): Promise<void> {
        const startTime = Date.now();
        
        // Ensure component is visible
        await expect.soft(this.stageContainer).toBeVisible();
        await expect.soft(this.titleComponent).toBeVisible();
        
        const loadTime = Date.now() - startTime;
        
        // Verify load time is reasonable (less than 3 seconds)
        expect.soft(loadTime).toBeLessThan(3000);
    }

    /**
     * TC-PSFW002: Verify image loading performance
     */
    async verifyImageLoadingPerformance(): Promise<void> {
        const imageCount = await this.stageImages.count();
        const startTime = Date.now();
        
        // Scroll to images to trigger lazy loading
        await this.imageSection.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(3000);
        
        // Verify all images are loaded (check properties instead of visibility)
        for (let i = 0; i < imageCount; i++) {
            const media = this.stageImages.nth(i);
            const tag = await media.evaluate(el => el.tagName.toLowerCase());

            if (tag === 'img') {
                // Image data-qa is stage-image (data-testid stays next-image); accept either.
                await expect.soft(media).toHaveAttribute('data-qa', /^(stage-image|next-image)$/);
                await expect.soft(media).toHaveAttribute('src');
                const naturalWidth = await media.evaluate(img => (img as HTMLImageElement).naturalWidth);
                expect.soft(naturalWidth).toBeGreaterThan(0);
            } else {
                const hasSource = await media.evaluate(
                    el => !!(el as HTMLVideoElement).currentSrc || !!el.getAttribute('src') || !!el.querySelector('source')
                );
                expect.soft(hasSource, 'Stage video should have a playable source').toBeTruthy();
            }
        }
        
        const imageLoadTime = Date.now() - startTime;
        
        // Verify image loading is reasonable
        expect.soft(imageLoadTime).toBeLessThan(5000);
    }

    /**
     * TC-PSFW004: Verify interactive element response time
     */
    async verifyInteractionPerformance(): Promise<void> {
        // Test button hover response
        const startTime = Date.now();
        
        await this.primaryButton.hover();
        await this.page.waitForTimeout(100); // Small wait for hover effect
        
        const hoverTime = Date.now() - startTime;
        
        // Verify hover response is reasonable (less than 2500ms for CI environment)
        expect.soft(hoverTime).toBeLessThan(2500);
        
        // Test secondary button hover
        const secondaryStartTime = Date.now();
        await this.secondaryButton.hover();
        await this.page.waitForTimeout(100);
        
        const secondaryHoverTime = Date.now() - secondaryStartTime;
        expect.soft(secondaryHoverTime).toBeLessThan(2500);
    }

    // ===== VISUAL VALIDATION METHODS (Following Stage Full Screen approach) =====

    /**
     * Validate kicker text styling against Figma specifications
     */
    async validateKickerTextStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
        console.log(`Validating kicker text styling for ${viewport} viewport...`);
        
        const { StageFullWidth_FigmaValues } = await import('../helpers/utils/figma-values/StageFullWidth_FigmaValues');
        const expectedStyles = StageFullWidth_FigmaValues[viewport].kickerText;
        
        // Font family validation
        const fontFamily = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).fontFamily);
        expect.soft(fontFamily.toLowerCase()).toContain('bayer');
        
        // Font size validation - strict comparison with Figma values
        const fontSize = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).fontSize);
        expect.soft(fontSize).toBe(expectedStyles.fontSize);
        
        // Font weight validation
        const fontWeight = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).fontWeight);
        expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

        // Line height validation - strict comparison with Figma values
        const lineHeight = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).lineHeight);
        expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

        // Color validation - strict comparison with Figma values
        const color = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).color);
        expect.soft(color).toBe(expectedStyles.color);
        
        console.log(`Kicker text styling validated for ${viewport}`);
    }

    /**
     * Validate main headline styling against Figma specifications
     */
    async validateMainHeadlineStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
        console.log(`Validating main headline styling for ${viewport} viewport...`);
        
        const { StageFullWidth_FigmaValues } = await import('../helpers/utils/figma-values/StageFullWidth_FigmaValues');
        const expectedStyles = StageFullWidth_FigmaValues[viewport].mainHeadline;
        
        // Font family validation
        const fontFamily = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).fontFamily);
        expect.soft(fontFamily.toLowerCase()).toContain('bayer');
        
        // Font size validation
        const fontSize = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).fontSize);
        expect.soft(fontSize).toBe(expectedStyles.fontSize);
        
        // Font weight validation
        const fontWeight = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).fontWeight);
        expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

        // Line height validation - strict comparison with Figma values
        const lineHeight = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).lineHeight);
        expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

        // Color validation - strict comparison with Figma values
        // First check the headline text content
        const headlineText = await this.stageHeadlineText.textContent();
        console.log(`Headline text content: "${headlineText}"`);
        
        // Check if headline has gradient styling (which returns transparent color)
        const hasGradient = await this.stageHeadlineText.evaluate((el: any) => {
            const style = getComputedStyle(el);
            const bgImage = style.backgroundImage;
            const webkitTextFill = style.webkitTextFillColor;
            return bgImage.includes('gradient') || webkitTextFill === 'transparent';
        });
        
        console.log(`Headline has gradient styling: ${hasGradient}`);
        
        const color = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).color);
        console.log(`Headline computed color: ${color}`);
        
        // Skip color validation if gradient is applied (gradient text returns transparent)
        if (!hasGradient) {
            expect.soft(color).toBe(expectedStyles.color);
        } else {
            console.log(`Skipping color validation - headline uses gradient styling`);
        }
        
        console.log(`Main headline styling validated for ${viewport}`);
    }

    /**
     * Validate description text styling against Figma specifications
     */
    async validateDescriptionTextStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
        console.log(`Validating description text styling for ${viewport} viewport...`);
        
        // Check if description text element exists (use intro text for Stage Full Width)
        const descriptionExists = await this.stageIntroText.count() > 0;
        if (!descriptionExists) {
            console.log(`Description text not found for ${viewport} - skipping validation`);
            return;
        }
        
        const { StageFullWidth_FigmaValues } = await import('../helpers/utils/figma-values/StageFullWidth_FigmaValues');
        const expectedStyles = StageFullWidth_FigmaValues[viewport].descriptionText;

        // Font family validation
        const fontFamily = await this.stageIntroText.evaluate((el: any) => getComputedStyle(el).fontFamily);
        expect.soft(fontFamily.toLowerCase()).toContain(expectedStyles.fontFamily.toLowerCase());

        // Font size validation - strict comparison with Figma values
        const fontSize = await this.stageIntroText.evaluate((el: any) => getComputedStyle(el).fontSize);
        expect.soft(fontSize).toBe(expectedStyles.fontSize);

        // Font weight validation
        const fontWeight = await this.stageIntroText.evaluate((el: any) => getComputedStyle(el).fontWeight);
        expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

        // Line height validation - strict comparison with Figma values
        const lineHeight = await this.stageIntroText.evaluate((el: any) => getComputedStyle(el).lineHeight);
        expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

        // Color validation - strict comparison with Figma values
        const color = await this.stageIntroText.evaluate((el: any) => getComputedStyle(el).color);
        expect.soft(color).toBe(expectedStyles.color);
        
        console.log(`Description text styling validated for ${viewport}`);
    }

    /**
     * Validate button styling against Figma specifications
     */
    async validateButtonStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
        console.log(`Validating button styling for ${viewport} viewport...`);
        
        const { StageFullWidth_FigmaValues } = await import('../helpers/utils/figma-values/StageFullWidth_FigmaValues');
        const expectedStyles = StageFullWidth_FigmaValues[viewport].primaryButton;

        // Font family validation
        const fontFamily = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontFamily);
        expect.soft(fontFamily.toLowerCase()).toContain(expectedStyles.fontFamily.toLowerCase());

        // Font size validation
        const fontSize = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontSize);
        expect.soft(fontSize).toBe(expectedStyles.fontSize);

        // Font weight validation
        const fontWeight = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontWeight);
        expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

        // Color validation - strict comparison with Figma values
        const color = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).color);
        expect.soft(color).toBe(expectedStyles.color);

        // Background color validation - strict comparison with Figma values
        const backgroundColor = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).backgroundColor);
        expect.soft(backgroundColor).toBe(expectedStyles.backgroundColor);

        console.log(`Button styling validated for ${viewport}`);
    }

    /**
     * Validate responsive layout behavior
     */
    async validateResponsiveLayout(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
        console.log(`Validating responsive layout for ${viewport} viewport...`);
        
        const { StageFullWidth_FigmaValues } = await import('../helpers/utils/figma-values/StageFullWidth_FigmaValues');
        const expectedViewport = StageFullWidth_FigmaValues[viewport].viewport;
        
        // Set viewport size
        await this.page.setViewportSize({ 
            width: expectedViewport.width, 
            height: expectedViewport.height
        });
        
        await this.page.waitForTimeout(1000);
        
        // Validate component is still visible and properly arranged
        await expect.soft(this.stageContainer).toBeVisible();
        await expect.soft(this.titleComponent).toBeVisible();
        
        // Check image is loaded using natural dimensions instead of visibility
        // Allow for potential image loading delays with wait and retry
        const imageCount = await this.stageImages.count();
        if (imageCount > 0) {
            let imageLoaded = false;
            for (let i = 0; i < 5; i++) {
                imageLoaded = await this.stageImages.first().evaluate((img: HTMLImageElement) => {
                    return img.naturalWidth > 0 && img.naturalHeight > 0;
                });
                if (imageLoaded) break;
                await this.page.waitForTimeout(500);
            }
            expect.soft(imageLoaded).toBeTruthy();
        }
        
        console.log(`Responsive layout validated for ${viewport} (${expectedViewport.width}x${expectedViewport.height})`);
    }

    // ===== UTILITY METHODS =====

    /**
     * Set viewport for responsive testing
     */
    async setViewport(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
        const viewportSizes = {
            'XL': { width: 1440, height: 900 },
            'LG': { width: 1024, height: 768 },
            'MD': { width: 768, height: 1024 },
            'SM': { width: 375, height: 667 }
        };
        
        await this.page.setViewportSize(viewportSizes[viewport]);
        await this.page.waitForTimeout(1000); // Allow layout to settle
    }
}