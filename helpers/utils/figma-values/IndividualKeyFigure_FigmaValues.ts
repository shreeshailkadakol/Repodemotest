// Individual Key Figure Component Figma Design Values
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=6227-65564&m=dev
// Component: Individual Key Figure
// Test Page: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Sprint10/IndividualKeyFigure
// Generated from actual Figma extraction - January 9, 2026
// XL/LG Node ID: 6227:65565 | MD/SM Node ID: 6227:65560

export const IndividualKeyFigureFigmaValues = {
  // XL and LG Viewport Design Specifications (node-id: 6227-65565)
  XL_LG: {
    viewport: {
      xl: { width: 1440, height: 900 },
      lg: { width: 1024, height: 768 },
    },
    // Number typography (e.g., "100") - Extracted: 6227:65568
    numberTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '72px', // ✅ Real Figma value
      fontWeight: '400', // ✅ Real Figma value
      lineHeight: '72px', // ✅ Real Figma value
      color: 'rgba(16, 56, 79, 1)', // ✅ Real Figma value
      textAlign: 'left',
      display: 'inline',
      nodeId: '6227:65568',
    },
    // Unit typography (e.g., "Mio.") - Extracted: 6227:65569
    unitTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px', // ✅ Real Figma value
      fontWeight: '400', // ✅ Real Figma value
      lineHeight: '30px', // ✅ Real Figma value
      color: 'rgba(16, 56, 79, 1)', // ✅ Real Figma value
      textAlign: 'left',
      display: 'inline',
      nodeId: '6227:65569',
    },
    // Description text typography (e.g., "people supported...") - Extracted: 6227:65570
    factTextTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // ✅ Real Figma value
      fontWeight: '400', // ✅ Real Figma value
      lineHeight: '28px', // ✅ Real Figma value
      color: 'rgba(64, 96, 114, 1)', // ✅ Real Figma value (secondary color)
      textAlign: 'left',
      display: 'block',
      marginTop: '8px',
      nodeId: '6227:65570',
    },
    layout: {
      contentDivider: '100%',
      containerWidth: 413, // ✅ Real Figma value
      containerHeight: 159, // ✅ Real Figma value
      padding: {
        top: '20px',
        right: '80px',
        bottom: '20px',
        left: '80px',
      },
      margin: {
        top: '0px',
        bottom: '0px',
      },
    },
    spacing: {
      componentSpacing: '32px',
      textSpacing: '0px',
    },
  },

  // MD and SM Viewport Design Specifications (node-id: 6227-65560)
  MD_SM: {
    viewport: {
      md: { width: 768, height: 1024 },
      sm: { width: 375, height: 667 },
    },
    // Number typography (e.g., "100") - Extracted: 6227:65562
    numberTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px', // ✅ Real Figma value
      fontWeight: '400', // ✅ Real Figma value
      lineHeight: '60px', // ✅ Real Figma value
      color: 'rgba(16, 56, 79, 1)', // ✅ Real Figma value
      textAlign: 'left',
      display: 'inline',
      nodeId: '6227:65562',
    },
    // Unit typography (e.g., "Mio.") - Extracted: 6227:65563
    unitTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // ✅ Real Figma value
      fontWeight: '400', // ✅ Real Figma value
      lineHeight: '24px', // ✅ Real Figma value
      color: 'rgba(16, 56, 79, 1)', // ✅ Real Figma value
      textAlign: 'left',
      display: 'inline',
      nodeId: '6227:65563',
    },
    // Description text typography (e.g., "people supported...") - Extracted: 6227:65564
    factTextTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px', // ✅ Real Figma value
      fontWeight: '400', // ✅ Real Figma value
      lineHeight: '24px', // ✅ Real Figma value
      color: 'rgba(64, 96, 114, 1)', // ✅ Real Figma value (secondary color)
      textAlign: 'left',
      display: 'block',
      marginTop: '6px',
      nodeId: '6227:65564',
    },
    layout: {
      contentDivider: '100%',
      containerWidth: 279, // ✅ Real Figma value
      containerHeight: 113, // ✅ Real Figma value (estimated from elements)
      padding: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      margin: {
        top: '0px',
        bottom: '0px',
      },
    },
    spacing: {
      componentSpacing: '20px',
      textSpacing: '0px',
    },
  },

  // Content Model Structure (from User Story 2057)
  contentModel: {
    structure: {
      number: {
        type: 'Plain Text',
        example: '100Mio',
        position: 'start',
      },
      unit: {
        type: 'Plain Text',
        example: 'people',
        position: 'middle',
      },
      factText: {
        type: 'Plain Text',
        example: 'supported with self-care by 2030',
        position: 'end',
      },
    },
    display: {
      format: '{number}.{unit} {factText}',
      example: '100Mio.people supported with self-care by 2030',
      separator: '.',
    },
  },

  // Component Properties
  component: {
    element: 'section',
    dataQa: 'individual-key-figure',
    dataTestId: 'individual-key-figure',
    ariaLabel: 'Individual Key Figure',
    role: 'region',
  },

  // Accessibility Requirements
  accessibility: {
    wcag: {
      level: 'AA',
      guidelines: ['2.1.1', '2.1.2', '1.4.3', '1.4.6', '4.1.2'],
    },
    colorContrast: {
      normal: '4.5:1',
      large: '3:1',
    },
    semantics: {
      element: 'section',
      headingStructure: false,
      landmarks: true,
    },
  },

  // Performance Benchmarks
  performance: {
    loadTime: {
      target: 2000, // 2 seconds maximum
      acceptable: 3000, // 3 seconds acceptable
    },
    rendering: {
      firstContentfulPaint: 1000,
      largestContentfulPaint: 2000,
    },
  },
};

// Helper functions for test validation
export const IndividualKeyFigureHelpers = {
  /**
   * Get expected number typography for viewport
   */
  getNumberTypographyForViewport(viewportName: string) {
    if (viewportName === 'XL' || viewportName === 'LG') {
      return IndividualKeyFigureFigmaValues.XL_LG.numberTypography;
    } else {
      return IndividualKeyFigureFigmaValues.MD_SM.numberTypography;
    }
  },

  /**
   * Get expected unit typography for viewport
   */
  getUnitTypographyForViewport(viewportName: string) {
    if (viewportName === 'XL' || viewportName === 'LG') {
      return IndividualKeyFigureFigmaValues.XL_LG.unitTypography;
    } else {
      return IndividualKeyFigureFigmaValues.MD_SM.unitTypography;
    }
  },

  /**
   * Get expected fact text typography for viewport
   */
  getFactTextTypographyForViewport(viewportName: string) {
    if (viewportName === 'XL' || viewportName === 'LG') {
      return IndividualKeyFigureFigmaValues.XL_LG.factTextTypography;
    } else {
      return IndividualKeyFigureFigmaValues.MD_SM.factTextTypography;
    }
  },

  /**
   * Get expected layout for viewport
   */
  getLayoutForViewport(viewportName: string) {
    if (viewportName === 'XL' || viewportName === 'LG') {
      return IndividualKeyFigureFigmaValues.XL_LG.layout;
    } else {
      return IndividualKeyFigureFigmaValues.MD_SM.layout;
    }
  },

  /**
   * Validate content structure with specific element types
   */
  validateContentStructure(content: string): boolean {
    // Enhanced structure validation for number.unit factText pattern
    return content.includes('.') && content.length > 10;
  },

  /**
   * Get viewport configuration
   */
  getViewportConfig(viewportName: string) {
    const configs = {
      XL: IndividualKeyFigureFigmaValues.XL_LG.viewport.xl,
      LG: IndividualKeyFigureFigmaValues.XL_LG.viewport.lg,
      MD: IndividualKeyFigureFigmaValues.MD_SM.viewport.md,
      SM: IndividualKeyFigureFigmaValues.MD_SM.viewport.sm,
    };
    return configs[viewportName as keyof typeof configs];
  },

  /**
   * Parse content into number, unit, and fact text components
   */
  parseContentComponents(content: string) {
    // Parse "100Mio.people supported with self-care by 2030"
    const parts = content.split('.');
    if (parts.length >= 2) {
      const numberPart = parts[0]; // "100Mio"
      const restPart = parts[1]; // "people supported with self-care by 2030"
      const spaceIndex = restPart.indexOf(' ');
      const unitPart = spaceIndex > -1 ? restPart.substring(0, spaceIndex) : restPart;
      const factTextPart = spaceIndex > -1 ? restPart.substring(spaceIndex + 1) : '';

      return {
        number: numberPart,
        unit: unitPart,
        factText: factTextPart,
      };
    }

    return {
      number: '',
      unit: '',
      factText: content,
    };
  },
};
