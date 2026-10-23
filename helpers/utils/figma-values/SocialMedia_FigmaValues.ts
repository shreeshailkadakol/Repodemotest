// Figma design tokens for Social Media Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node ID: 5163:339844 (Follow us for Updates and Insights)
// Last updated: 2025-09-29 - EXTRACTED FROM FIGMA API
// Component: Social Media with "Follow us for Updates and Insights" header text and social media links

export const SocialMedia_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 720,
    },
    headerText: {
      // "Follow us for Updates and Insights" text styling from Figma
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '400', // Regular weight
      fontStyle: 'Regular',
      color: 'rgba(16, 56, 79, 1)', // Deep blue color from design system
      lineHeight: '44px', // 1.22 ratio
      textAlign: 'left',
      letterSpacing: 'normal',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px', // Gap between header text and social links
      padding: '0px',
    },
    socialLinksContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px', // Gap between social media icons
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    socialLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px', // Icon container size
      height: '24px',
      padding: '0px',
      border: '0px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    socialIcon: {
      width: '24px', // SVG icon size
      height: '24px',
      fill: 'currentColor', // Inherits color from parent
      color: 'rgba(96, 113, 139, 1)', // Default text color
    },
    hoverStates: {
      socialLink: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      },
      socialIcon: {
        color: 'rgba(16, 56, 79, 1)', // Darker color on hover
      },
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    headerText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // Slightly smaller for LG viewport
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '44px',
      textAlign: 'left',
      letterSpacing: 'normal',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '0px',
    },
    socialLinksContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '14px',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    socialLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      padding: '0px',
      border: '0px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    socialIcon: {
      width: '24px',
      height: '24px',
      fill: 'currentColor',
      color: 'rgba(96, 113, 139, 1)',
    },
    hoverStates: {
      socialLink: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      },
      socialIcon: {
        color: 'rgba(16, 56, 79, 1)',
      },
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    headerText: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // Smaller for MD viewport
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '30px',
      textAlign: 'left',
      letterSpacing: 'normal',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      padding: '0px',
    },
    socialLinksContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    socialLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      padding: '0px',
      border: '0px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    socialIcon: {
      width: '24px',
      height: '24px',
      fill: 'currentColor',
      color: 'rgba(96, 113, 139, 1)',
    },
    hoverStates: {
      socialLink: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      },
      socialIcon: {
        color: 'rgba(16, 56, 79, 1)',
      },
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    headerText: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // Smallest for mobile
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '30px',
      textAlign: 'left',
      letterSpacing: 'normal',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '0px',
    },
    socialLinksContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    socialLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px', // Larger touch targets for mobile
      height: '32px',
      padding: '4px',
      border: '0px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    socialIcon: {
      width: '24px',
      height: '24px',
      fill: 'currentColor',
      color: 'rgba(96, 113, 139, 1)',
    },
    hoverStates: {
      socialLink: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      },
      socialIcon: {
        color: 'rgba(16, 56, 79, 1)',
      },
    },
  },
  // Color palette for reference
  colors: {
    primary: 'rgba(16, 56, 79, 1)', // Deep blue for header text and hover states
    secondary: 'rgba(96, 113, 139, 1)', // Grey for default icon color
    white: 'rgba(255, 255, 255, 1)',
    transparent: 'transparent',
  },
  // Typography scale
  typography: {
    fontFamily: 'Bayer Sans',
    weights: {
      regular: '400',
      bold: '700',
    },
    sizes: {
      xl: '36px',
      lg: '32px',
      md: '28px',
      sm: '24px',
    },
    lineHeights: {
      xl: '44px',
      lg: '40px',
      md: '36px',
      sm: '32px',
    },
  },
  // Spacing system
  spacing: {
    container: {
      xl: '24px',
      lg: '20px',
      md: '18px',
      sm: '16px',
    },
    socialLinks: {
      xl: '16px',
      lg: '14px',
      md: '12px',
      sm: '12px',
    },
  },
};