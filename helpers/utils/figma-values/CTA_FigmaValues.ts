// Figma design tokens for CTA Component
// Auto-generated from Figma API with enhanced structure
// Figma File ID: fiKrYZCKNM1OqXHQoGwrlX

export const CTA_FigmaValues = {
  // Primary CTA Button States
  Primary: {
    Default: {
      nodeId: '2:8952',
      typography: {
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgb(255, 255, 255)', // White text
        background: 'rgb(16, 56, 79)', // Dark blue background
        border: 'transparent',
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
      },
    },
    Hover: {
      nodeId: '2:8956',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(255, 255, 255, 1)',
        background: 'rgba(16, 56, 79, 1)', // Hover state - lighter blue
        border: 'transparent',
      },
      spacing: {
        padding: '10px 24px',
        gap: '3px',
      },
    },
    Pressed: {
      nodeId: '2:8960',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(255, 255, 255, 1)',
        background: 'rgba(8, 28, 40, 1)', // Pressed state - darker blue
        border: 'transparent',
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
      },
    },
    Focus: {
      nodeId: '2:8964',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(255, 255, 255, 1)',
        background: 'rgba(16, 56, 79, 1)',
        border: 'transparent',
        focusRing: 'rgba(16, 56, 79, 1)',
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
        focusRingWidth: '2px',
        focusRingOffset: '2px',
      },
    },
    Disabled: {
      nodeId: '2:8968',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(144, 161, 185, 1)', // Muted gray text
        background: 'rgba(226, 232, 240, 1)', // Light gray background
        border: 'transparent',
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
      },
      interaction: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
  },

  // Secondary CTA Button States
  Secondary: {
    Default: {
      nodeId: '2:8982',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(16, 56, 79, 1)', // Dark blue text
        background: 'transparent',
        border: 'rgba(16, 56, 79, 1)', // Dark blue border
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
        borderWidth: '1px',
      },
    },
    Hover: {
      nodeId: '2:8986',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(0, 74, 131, 1)', // Hover text color
        background: 'transparent',
        border: 'rgba(0, 74, 131, 1)', // Hover border color
      },
      spacing: {
        padding: '10px 24px',
        gap: '3px',
        borderWidth: '1px',
      },
    },
    Pressed: {
      nodeId: '2:8990',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(8, 28, 40, 1)', // Pressed text color
        background: 'transparent',
        border: 'rgba(8, 28, 40, 1)', // Pressed border color
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
        borderWidth: '1px',
      },
    },
    Focus: {
      nodeId: '2:8994',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(16, 56, 79, 1)',
        background: 'transparent',
        border: 'rgba(16, 56, 79, 1)',
        focusRing: 'rgba(16, 56, 79, 1)',
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
        borderWidth: '1px',
        focusRingWidth: '2px',
        focusRingOffset: '2px',
      },
    },
    Disabled: {
      nodeId: '2:8998',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(144, 161, 185, 1)', // Muted gray text
        background: 'transparent',
        border: 'rgba(209, 213, 219, 1)', // Muted gray border
      },
      spacing: {
        padding: '10px 24px',
        gap: '1px',
        borderWidth: '1px',
      },
      interaction: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
  },

  // Text Link CTA States
  TextLink: {
    Default: {
      nodeId: '2:9012',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(16, 56, 79, 1)', // Dark blue text
        background: 'transparent',
        border: 'transparent',
      },
      spacing: {
        padding: '4px 0px',
        gap: '1px',
      },
    },
    Hover: {
      nodeId: '2:9016',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(16, 56, 79, 1)', // Hover color
        background: 'transparent',
        border: 'transparent',
      },
      spacing: {
        padding: '4px 0px',
        gap: '3px',
      },
      textDecoration: {
        underline: true,
        underlineOffset: '2px',
      },
    },
    Pressed: {
      nodeId: '2:9020',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(8, 28, 40, 1)', // Pressed color
        background: 'transparent',
        border: 'transparent',
      },
      spacing: {
        padding: '4px 0px',
        gap: '1px',
      },
    },
    Focus: {
      nodeId: '2:9024',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(16, 56, 79, 1)',
        background: 'transparent',
        border: 'transparent',
        focusRing: 'rgba(16, 56, 79, 1)',
      },
      spacing: {
        padding: '4px 0px',
        gap: '1px',
        focusRingWidth: '2px',
        focusRingOffset: '2px',
      },
    },
    Disabled: {
      nodeId: '2:9028',
      typography: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        lineHeight: '20px',
        letterSpacing: '0.42px',
        textCase: 'UPPER',
      },
      colors: {
        text: 'rgba(156, 163, 175, 1)', // Muted gray text
        background: 'transparent',
        border: 'transparent',
      },
      spacing: {
        padding: '4px 0px',
        gap: '1px',
      },
      interaction: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
  },

  // Common Properties Across All CTAs
  Common: {
    viewport: {
      width: 1200,
      height: 800,
    },
    transitions: {
      duration: '200ms',
      easing: 'ease-in-out',
      properties: ['all', 'gap', 'padding', 'color', 'background-color', 'border-color'],
    },
    accessibility: {
      minContrastRatio: 4.5, // WCAG AA standard
      focusRingMinContrast: 3.0, // WCAG AA for focus indicators
      minTouchTarget: '44px', // Minimum touch target size
    },
  },
};

// Export individual state configurations for easy access
export const PrimaryCTAStates = CTA_FigmaValues.Primary;
export const SecondaryCTAStates = CTA_FigmaValues.Secondary;
export const TextLinkCTAStates = CTA_FigmaValues.TextLink;
export const CTACommonProps = CTA_FigmaValues.Common;
