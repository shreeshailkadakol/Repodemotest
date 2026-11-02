/**
 * Consolidated Figma Design Values for Page Disclaimer Component
 * Extracted from Figma file: fiKrYZCKNM1OqXHQoGwrlX
 * Generated on: November 20, 2025
 *
 * This file contains all essential design specifications for Page Disclaimer component testing
 * across different viewports (XL, LG, MD, SM).
 */

export interface PageDisclaimerFigmaValues {
  viewport: {
    name: string;
    width: number;
    breakpoint: string;
  };
  modal: {
    width: number;
    height: number;
  };
  title: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
  };
  message: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
  };
  continueButton: {
    text: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    color: string;
  };
  cancelButton: {
    text: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    color: string;
  };
}

export const PageDisclaimerDesignTokens: PageDisclaimerFigmaValues[] = [
  // XL Viewport (1440x900)
  {
    viewport: {
      name: 'XL',
      width: 1440,
      breakpoint: '1440px+',
    },
    modal: {
      width: 690,
      height: 328,
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    message: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgba(64, 96, 114, 1)',
    },
    continueButton: {
      text: 'Yes',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(255, 255, 255, 1)',
    },
    cancelButton: {
      text: 'No',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(16, 56, 79, 1)',
    },
  },
  // LG Viewport (1024x768)
  {
    viewport: {
      name: 'LG',
      width: 1024,
      breakpoint: '1024px - 1439px',
    },
    modal: {
      width: 690,
      height: 328,
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    message: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgba(64, 96, 114, 1)',
    },
    continueButton: {
      text: 'Yes',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(255, 255, 255, 1)',
    },
    cancelButton: {
      text: 'No',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(16, 56, 79, 1)',
    },
  },
  // MD Viewport (768x1024)
  {
    viewport: {
      name: 'MD',
      width: 768,
      breakpoint: '768px - 1023px',
    },
    modal: {
      width: 335,
      height: 328,
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    message: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
    },
    continueButton: {
      text: 'Yes',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(255, 255, 255, 1)',
    },
    cancelButton: {
      text: 'No',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(16, 56, 79, 1)',
    },
  },
  // SM Viewport (375x667)
  {
    viewport: {
      name: 'SM',
      width: 375,
      breakpoint: '375px - 767px',
    },
    modal: {
      width: 335,
      height: 328,
    },
    title: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    message: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
    },
    continueButton: {
      text: 'Yes',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(255, 255, 255, 1)',
    },
    cancelButton: {
      text: 'No',
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: '0.4px',
      color: 'rgba(16, 56, 79, 1)',
    },
  },
];

/**
 * Helper class for accessing Page Disclaimer Figma values
 */
export class PageDisclaimerDesignHelper {
  /**
   * Get design tokens for specific viewport
   */
  static getTokens(viewport: string): PageDisclaimerFigmaValues | undefined {
    return PageDisclaimerDesignTokens.find(
      (token) => token.viewport.name.toLowerCase() === viewport.toLowerCase()
    );
  }

  /**
   * Get all available viewports
   */
  static getViewports(): string[] {
    return PageDisclaimerDesignTokens.map((token) => token.viewport.name);
  }

  /**
   * Get modal dimensions for viewport
   */
  static getModalDimensions(viewport: string): { width: number; height: number } | undefined {
    const token = this.getTokens(viewport);
    return token ? token.modal : undefined;
  }

  /**
   * Get title typography specifications for viewport
   */
  static getTitleSpecs(viewport: string): PageDisclaimerFigmaValues['title'] | undefined {
    const token = this.getTokens(viewport);
    return token ? token.title : undefined;
  }

  /**
   * Get message typography specifications for viewport
   */
  static getMessageSpecs(viewport: string): PageDisclaimerFigmaValues['message'] | undefined {
    const token = this.getTokens(viewport);
    return token ? token.message : undefined;
  }

  /**
   * Get continue button specifications for viewport
   */
  static getContinueButtonSpecs(
    viewport: string
  ): PageDisclaimerFigmaValues['continueButton'] | undefined {
    const token = this.getTokens(viewport);
    return token ? token.continueButton : undefined;
  }

  /**
   * Get cancel button specifications for viewport
   */
  static getCancelButtonSpecs(
    viewport: string
  ): PageDisclaimerFigmaValues['cancelButton'] | undefined {
    const token = this.getTokens(viewport);
    return token ? token.cancelButton : undefined;
  }
}

/**
 * Export for compatibility with existing framework patterns
 */
export const PageDisclaimer_FigmaValues = {
  XL: PageDisclaimerDesignTokens.find((t) => t.viewport.name === 'XL')!,
  LG: PageDisclaimerDesignTokens.find((t) => t.viewport.name === 'LG')!,
  MD: PageDisclaimerDesignTokens.find((t) => t.viewport.name === 'MD')!,
  SM: PageDisclaimerDesignTokens.find((t) => t.viewport.name === 'SM')!,
};
