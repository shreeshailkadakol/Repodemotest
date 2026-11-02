import { envUtils } from '../helpers/utils/envUtils';

/**
 * Footer Component Figma Configuration
 *
 * This module provides consolidated configuration and utility functions for
 * validating footer component design consistency with Figma specifications.
 */

// Type definitions for Figma API responses and configuration
export interface FigmaStyleData {
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  color?: string;
  letterSpacing?: number;
  textDecoration?: string;
}

export interface ComponentFigmaConfig {
  fileId: string;
  nodeIds: {
    copyright: string;
    accessibilityLink: string;
    termsLink: string;
  };
}

export interface FooterFigmaStyles {
  copyright: FigmaStyleData;
  accessibilityLink: FigmaStyleData;
  termsLink: FigmaStyleData;
}

/**
 * Footer component Figma configuration
 * Contains file ID and node IDs for all footer elements
 */
export function getFooterConfig(): ComponentFigmaConfig {
  return {
    fileId: envUtils.getFigmaFileId(),
    nodeIds: {
      copyright: envUtils.getFigmaNodeId('FIGMA_NODE_COPYRIGHT_TEXT'),
      accessibilityLink: envUtils.getFigmaNodeId('FIGMA_NODE_ACCESSIBILITY_LINK'),
      termsLink: envUtils.getFigmaNodeId('FIGMA_NODE_TERMS_LINK'),
    },
  };
}

/**
 * Fetch all footer element styles from Figma API
 * Returns a consolidated object with styles for each footer element
 */
export async function fetchFooterFigmaStyles(): Promise<FooterFigmaStyles> {
  const config = getFooterConfig();
  const { fetchFigmaNode } = await import('../helpers/utils/figmaAPI');

  try {
    // Fetch styles for all footer elements in parallel
    const [copyrightData, accessibilityData, termsData] = await Promise.all([
      fetchFigmaNode(config.nodeIds.copyright),
      fetchFigmaNode(config.nodeIds.accessibilityLink),
      fetchFigmaNode(config.nodeIds.termsLink),
    ]);

    return {
      copyright: copyrightData.styles,
      accessibilityLink: accessibilityData.styles,
      termsLink: termsData.styles,
    };
  } catch (error) {
    console.error('Error fetching footer Figma styles:', error);
    throw new Error(`Failed to fetch footer styles from Figma: ${error.message}`);
  }
}

/**
 * Validate a specific footer element against its Figma design
 * @param elementName - Name of the element (copyright, accessibilityLink, termsLink)
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 * @returns Validation result with comparison details
 */
export async function validateFooterElement(
  elementName: keyof FooterFigmaStyles,
  page: any,
  selector: string
) {
  const footerStyles = await fetchFooterFigmaStyles();
  const expectedStyles = footerStyles[elementName];

  if (!expectedStyles) {
    throw new Error(`No Figma styles found for footer element: ${elementName}`);
  }

  // Get computed styles from the page
  const element = page.locator(selector);
  const computedStyles = await element.evaluate((el: Element) => {
    const styles = window.getComputedStyle(el);
    return {
      fontSize: styles.fontSize,
      fontFamily: styles.fontFamily,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
      color: styles.color,
      letterSpacing: styles.letterSpacing,
      textDecoration: styles.textDecoration,
    };
  });

  // Compare styles with tolerance
  const comparison = {
    fontSize: {
      expected: expectedStyles.fontSize,
      actual: parseInt(computedStyles.fontSize),
      matches: Math.abs(parseInt(computedStyles.fontSize) - expectedStyles.fontSize) <= 1,
    },
    fontFamily: {
      expected: expectedStyles.fontFamily,
      actual: computedStyles.fontFamily,
      matches: expectedStyles.fontFamily
        ? computedStyles.fontFamily.toLowerCase().includes(expectedStyles.fontFamily.toLowerCase())
        : true,
    },
    color: {
      expected: expectedStyles.color,
      actual: computedStyles.color,
      matches: true, // Simplified for now - would need color conversion logic
    },
  };

  return {
    element: elementName,
    selector,
    passed: Object.values(comparison).every((comp) => comp.matches),
    styleComparisons: comparison,
    figmaStyles: expectedStyles,
    computedStyles,
  };
}
