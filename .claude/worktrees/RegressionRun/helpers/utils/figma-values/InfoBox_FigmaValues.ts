/**
 * Consolidated Figma Design Values for InfoBox Component
 * Extracted from Figma file: fiKrYZCKNM1OqXHQoGwrlX
 * Generated on: November 17, 2025
 *
 * This file contains all essential design specifications for InfoBox component testing
 * across different viewports and contrast variants.
 */

export interface InfoBoxFigmaValues {
  viewport: {
    name: string;
    width: number;
    breakpoint: string;
  };
  contrast: 'low' | 'high';
  background: {
    color: string;
    description: string;
  };
  title: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
    sampleText: string;
  };
  description: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
    sampleText: string;
  };
  cta: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    color: string;
    sampleText: string;
  };
  divider: {
    color: string;
    height: string;
  };
}

export const InfoBoxDesignTokens: InfoBoxFigmaValues[] = [
  // XL Viewport (1440px+) - Low Contrast
  {
    viewport: {
      name: 'XL',
      width: 1440,
      breakpoint: '>=1440px',
    },
    contrast: 'low',
    background: {
      color: 'rgba(241, 245, 249, 1)',
      description: 'Light gray background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(161, 220, 84, 1)',
      height: '2px',
    },
  },
  // XL Viewport (1440px+) - High Contrast
  {
    viewport: {
      name: 'XL',
      width: 1440,
      breakpoint: '>=1440px',
    },
    contrast: 'high',
    background: {
      color: 'rgba(16, 56, 79, 1)',
      description: 'Dark blue background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(202, 213, 226, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(0, 153, 204, 1)',
      height: '2px',
    },
  },
  // LG Viewport (1024px-1439px) - High Contrast
  {
    viewport: {
      name: 'LG',
      width: 1024,
      breakpoint: '1024px-1439px',
    },
    contrast: 'low',
    background: {
      color: 'rgba(241, 245, 249, 1)',
      description: 'Light gray background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(161, 220, 84, 1)',
      height: '2px',
    },
  },
  // LG Viewport (1024px-1439px) - High Contrast
  {
    viewport: {
      name: 'LG',
      width: 1024,
      breakpoint: '1024px-1439px',
    },
    contrast: 'high',
    background: {
      color: 'rgba(16, 56, 79, 1)',
      description: 'Dark blue background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(202, 213, 226, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(0, 153, 204, 1)',
      height: '2px',
    },
  },
  // MD Viewport (768px-1023px) - Low Contrast
  {
    viewport: {
      name: 'MD',
      width: 768,
      breakpoint: '768px-1023px',
    },
    contrast: 'low',
    background: {
      color: 'rgba(241, 245, 249, 1)',
      description: 'Light gray background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(161, 220, 84, 1)',
      height: '2px',
    },
  },
  // MD Viewport (768px-1023px) - High Contrast
  {
    viewport: {
      name: 'MD',
      width: 768,
      breakpoint: '768px-1023px',
    },
    contrast: 'high',
    background: {
      color: 'rgba(16, 56, 79, 1)',
      description: 'Dark blue background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(202, 213, 226, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(0, 153, 204, 1)',
      height: '2px',
    },
  },
  // SM Viewport (<768px) - Low Contrast
  {
    viewport: {
      name: 'SM',
      width: 375,
      breakpoint: '<768px',
    },
    contrast: 'low',
    background: {
      color: 'rgba(241, 245, 249, 1)',
      description: 'Light gray background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(16, 56, 79, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(161, 220, 84, 1)',
      height: '2px',
    },
  },
  // SM Viewport (<768px) - High Contrast
  {
    viewport: {
      name: 'SM',
      width: 375,
      breakpoint: '<768px',
    },
    contrast: 'high',
    background: {
      color: 'rgba(16, 56, 79, 1)',
      description: 'Dark blue background',
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Over 15,000 new seasonal jobs created by Bayer in Kabwe',
    },
    description: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(202, 213, 226, 1)',
      sampleText:
        'With the new site, Bayer is bringing more opportunities — from jobs and healthcare to stronger communities.',
    },
    cta: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      color: 'rgba(255, 255, 255, 1)',
      sampleText: 'Read More',
    },
    divider: {
      color: 'rgba(0, 153, 204, 1)',
      height: '2px',
    },
  },
];

/**
 * Helper functions to retrieve specific design tokens
 */
export class InfoBoxDesignHelper {
  /**
   * Get design tokens for specific viewport and contrast combination
   */
  static getTokens(viewport: string, contrast: 'low' | 'high'): InfoBoxFigmaValues | undefined {
    return InfoBoxDesignTokens.find(
      (token) => token.viewport.name === viewport && token.contrast === contrast
    );
  }

  /**
   * Get all tokens for a specific viewport
   */
  static getTokensByViewport(viewport: string): InfoBoxFigmaValues[] {
    return InfoBoxDesignTokens.filter((token) => token.viewport.name === viewport);
  }

  /**
   * Get all tokens for a specific contrast type
   */
  static getTokensByContrast(contrast: 'low' | 'high'): InfoBoxFigmaValues[] {
    return InfoBoxDesignTokens.filter((token) => token.contrast === contrast);
  }

  /**
   * Get all available viewports
   */
  static getViewports(): string[] {
    return [...new Set(InfoBoxDesignTokens.map((token) => token.viewport.name))];
  }

  /**
   * Validate if current viewport matches expected design specifications
   */
  static validateViewport(currentWidth: number): string {
    if (currentWidth >= 1440) return 'XL';
    if (currentWidth >= 1024) return 'LG';
    if (currentWidth >= 768) return 'MD';
    return 'SM';
  }
}

export default InfoBoxDesignTokens;