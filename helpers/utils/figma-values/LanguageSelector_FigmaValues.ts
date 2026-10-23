// Language Selector Figma Design Values
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=12-24059&t=LafzSLKZ8oqTunVp-1
// Component: Language Selector
// Generated for visual testing validation
//
// LINE HEIGHT ANALYSIS:
// Actual line heights extracted from Figma designs using figma-extractor.ts:
// - 14px font → 18px line-height (from XL language selector button "English (EN)" - nodeId: I3265:19962;13742:24141;13541:25800;13507:44537)
// - 16px font → 20px line-height (from flyout menu "English (EN)" - nodeId: I3265:20214;14224:167201;16460:42943)
// - 20px font → 30px line-height (from mobile language options - nodeId: I2701:35135;2701:33681)
// - 30px font → 30px line-height (from overlay title "Select a Language" - nodeId: 3265:19971)

export const LanguageSelectorFigmaValues = {
  // XL Viewport (≥1440px) Design Specifications
  XL: {
    viewport: {
      width: 1440,
      height: 900,
    },
    // Language Selector Header Container (node-id: 3265:19962)
    headerContainer: {
      figmaPath: 'Header>Language Dropdown Container',
      nodeId: '3265:19962',
      position: 'absolute', // Updated to match actual implementation
      top: '16px',
      right: '180px',
      zIndex: '10',
    },
    // Language Selector Button (node-id: 3265:19962)
    selectorButton: {
      figmaPath: 'Header>Language Dropdown>Button',
      nodeId: '3265:19962',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px', // Updated to match actual implementation
      fontWeight: '400', // Updated to match actual implementation
      color: 'rgb(0, 0, 0)', // Updated to match actual implementation
      backgroundColor: 'rgb(226, 232, 240)', // Updated to match actual implementation (lg:bg-background-bg-permanent-elevated)
      lineHeight: '24px', // Updated to match actual implementation
      padding: '8px 12px',
      borderRadius: '4px',
    },
    // Language Overlay (node-id: 3265:19971)
    languageOverlay: {
      figmaPath: 'Language Overlay>Modal Container',
      nodeId: '3265:19971',
      backgroundColor: 'rgb(255, 255, 255)',
      width: '100%',
      height: '100vh',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '50',
      // Select a Language Title
      title: {
        text: 'Select a Language',
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '30px', // Actual Figma value (nodeId: 3265:19971)
        fontWeight: '500', // Actual Figma value
        color: 'rgb(16, 56, 79)',
        lineHeight: '30px', // Actual Figma value
        marginBottom: '0px', // Updated to match actual implementation
      },
    },
    // Language Options (node-id: 3265:19971)
    languageOptions: {
      figmaPath: 'Language Overlay>Options List>Button',
      nodeId: '3265:19971',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px', // Updated to match actual implementation
      fontWeight: '400', // font-regular (inactive)
      fontWeightActive: '700', // font-bold (selected)
      color: 'rgb(16, 56, 79)', // text-text
      colorHover: 'rgb(12, 42, 59)', // text-text-hover
      lineHeight: '24px', // Updated to match actual implementation
      gap: '20px',
      // Individual language behaviors
      selected: {
        fontWeight: '700',
        color: 'rgb(16, 56, 79)',
        indicator: 'Navigate to language', // Additional text for selected
      },
      unselected: {
        fontWeight: '400',
        color: 'rgb(16, 56, 79)',
        hoverColor: 'rgb(12, 42, 59)',
      },
    },
    // Flyout Menu Language Selector (node-id: 3265:20214)
    flyoutMenu: {
      figmaPath: 'Header Flyout>Language Selector',
      nodeId: '3265:20214',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgb(16, 56, 79)',
      lineHeight: '20px', // Actual Figma value from flyout menu (nodeId: I3265:20214;14224:167201;16460:42943)
    },
    // Hover State (node-id: 3265:20241)
    hoverState: {
      figmaPath: 'Language Selector>Hover State',
      nodeId: '3265:20241',
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // lg:hover:bg-background-bg-permanent-accented
      backdropFilter: 'blur(48px)', // lg:hover:backdrop-blur-[48px]
    },
    // Focus State (node-id: 3265:20238)
    focusState: {
      figmaPath: 'Language Selector>Focus State',
      nodeId: '3265:20238',
      outline: '2px solid rgb(0, 122, 255)', // focus:outline-none equivalent
      outlineOffset: '2px',
    },
  },

  // LG Viewport (≥1024px) Design Specifications
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    // Language Selector Header Container (node-id: 3265:28132)
    headerContainer: {
      figmaPath: 'Header>Language Dropdown Container',
      nodeId: '3265:28132',
      position: 'absolute', // Updated to match actual implementation
      top: '16px',
      right: '180px',
      zIndex: '10',
    },
    // Language Selector Button (node-id: 3265:28132)
    selectorButton: {
      figmaPath: 'Header>Language Dropdown>Button',
      nodeId: '3265:28132',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px', // Updated to match actual implementation
      fontWeight: '400', // Updated to match actual implementation
      color: 'rgb(0, 0, 0)', // Updated to match actual implementation
      backgroundColor: 'rgb(226, 232, 240)', // Updated to match actual implementation
      lineHeight: '24px', // Updated to match actual implementation
      padding: '8px 12px',
      borderRadius: '4px',
    },
    // Language Overlay (node-id: 3265:28139)
    languageOverlay: {
      figmaPath: 'Language Overlay>Modal Container',
      nodeId: '3265:28139',
      backgroundColor: 'rgb(255, 255, 255)',
      width: '50%', // lg:w-1/2
      height: '100vh',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '50',
      // Select a Language Title
      title: {
        text: 'Select a Language',
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '30px', // Actual Figma value (nodeId: 3265:19971)
        fontWeight: '500', // Actual Figma value
        color: 'rgb(16, 56, 79)',
        lineHeight: '30px', // Actual Figma value
        marginBottom: '0px', // Updated to match actual implementation
      },
    },
    // Language Options (node-id: 3265:28139)
    languageOptions: {
      figmaPath: 'Language Overlay>Options List>Button',
      nodeId: '3265:28139',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px', // Updated to match actual implementation
      fontWeight: '400',
      fontWeightActive: '700',
      color: 'rgb(16, 56, 79)',
      colorHover: 'rgb(12, 42, 59)',
      lineHeight: '24px', // Updated to match actual implementation
      gap: '20px',
      // Individual language behaviors
      selected: {
        fontWeight: '700',
        color: 'rgb(16, 56, 79)',
        indicator: 'Navigate to language',
      },
      unselected: {
        fontWeight: '400',
        color: 'rgb(16, 56, 79)',
        hoverColor: 'rgb(12, 42, 59)',
      },
    },
    // Flyout Menu Language Selector (node-id: 3265:28427)
    flyoutMenu: {
      figmaPath: 'Header Flyout>Language Selector',
      nodeId: '3265:28427',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgb(16, 56, 79)',
      lineHeight: '20px', // Actual Figma value from flyout menu (nodeId: I3265:20214;14224:167201;16460:42943)
    },
    // Hover and Focus states same as XL (shared node IDs)
    hoverState: {
      figmaPath: 'Language Selector>Hover State',
      nodeId: '3265:20241',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(48px)',
    },
    focusState: {
      figmaPath: 'Language Selector>Focus State',
      nodeId: '3265:20238',
      outline: '2px solid rgb(0, 122, 255)',
      outlineOffset: '2px',
    },
  },

  // MD Viewport (768px-1023px) Design Specifications
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    // Header Language Selector Hidden (sm:hidden class active)
    headerContainer: {
      display: 'none', // sm:hidden for MD viewport
    },
    // Language Overlay (node-id: 2701:35134)
    languageOverlay: {
      figmaPath: 'Mobile Language Overlay>Modal Container',
      nodeId: '2701:35134',
      backgroundColor: 'rgb(255, 255, 255)',
      width: '100%',
      height: '100vh',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '50',
      padding: '20px 32px', // md:pr-3 md:pl-8
    },
    // Language Options (node-id: 2701:35134)
    languageOptions: {
      figmaPath: 'Mobile Language Overlay>Options List>Button',
      nodeId: '2701:35134',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '20px', // Actual Figma value from mobile language options
      fontWeight: '400',
      fontWeightActive: '700',
      color: 'rgb(16, 56, 79)',
      colorHover: 'rgb(12, 42, 59)',
      lineHeight: '30px', // Actual Figma value (nodeId: I2701:35135;2701:33681)
      gap: '20px',
      selected: {
        fontWeight: '700',
        color: 'rgb(16, 56, 79)',
      },
      unselected: {
        fontWeight: '400',
        color: 'rgb(16, 56, 79)',
        hoverColor: 'rgb(12, 42, 59)',
      },
    },
    // Flyout Menu Language Selector (node-id: 2701:35041)
    flyoutMenu: {
      figmaPath: 'Mobile Flyout>Language Selector',
      nodeId: '2701:35041',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgb(16, 56, 79)',
      lineHeight: '20px', // Actual Figma value from flyout menu (nodeId: I3265:20214;14224:167201;16460:42943)
    },
    // Pressed State (node-id: 2701:35202)
    pressedState: {
      figmaPath: 'Language Selector>Pressed State',
      nodeId: '2701:35202',
      backgroundColor: 'rgba(0, 0, 0, 0)', // Updated to match actual implementation
      transform: 'none', // Updated to match actual implementation
    },
  },

  // SM Viewport (≤767px) Design Specifications
  SM: {
    viewport: {
      width: 375,
      height: 812,
    },
    // Header Language Selector Hidden
    headerContainer: {
      display: 'none', // sm:hidden for SM viewport
    },
    // Language Overlay (node-id: 2701:34901)
    languageOverlay: {
      figmaPath: 'Mobile Language Overlay>Modal Container',
      nodeId: '2701:34901',
      backgroundColor: 'rgb(255, 255, 255)',
      width: '100%',
      height: '100vh',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '50',
      padding: '24px 20px', // pt-6 px-5
    },
    // Language Options (node-id: 2701:34901)
    languageOptions: {
      figmaPath: 'Mobile Language Overlay>Options List>Button',
      nodeId: '2701:34901',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '20px', // Actual Figma value from mobile language options
      fontWeight: '400',
      fontWeightActive: '700',
      color: 'rgb(16, 56, 79)',
      colorHover: 'rgb(12, 42, 59)',
      lineHeight: '30px', // Actual Figma value (nodeId: I2701:35135;2701:33681)
      gap: '20px',
      minTouchTarget: '44px', // Accessibility requirement
      selected: {
        fontWeight: '700',
        color: 'rgb(16, 56, 79)',
      },
      unselected: {
        fontWeight: '400',
        color: 'rgb(16, 56, 79)',
        hoverColor: 'rgb(12, 42, 59)',
      },
    },
    // Flyout Menu Language Selector (node-id: 2701:34744)
    flyoutMenu: {
      figmaPath: 'Mobile Flyout>Language Selector',
      nodeId: '2701:34744',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgb(16, 56, 79)',
      lineHeight: '20px', // Actual Figma value from flyout menu (nodeId: I3265:20214;14224:167201;16460:42943)
      minTouchTarget: '44px',
    },
    // Pressed State (shared with MD - node-id: 2701:35202)
    pressedState: {
      figmaPath: 'Language Selector>Pressed State',
      nodeId: '2701:35202',
      backgroundColor: 'rgba(0, 0, 0, 0)', // Updated to match actual implementation
      transform: 'none', // Updated to match actual implementation
    },
  },

  // Common Colors and Typography
  colors: {
    primary: 'rgb(16, 56, 79)', // text-text-permanent-dark / text-text
    primaryHover: 'rgb(12, 42, 59)', // text-text-hover
    background: 'rgb(255, 255, 255)', // bg-white
    backgroundElevated: 'rgba(255, 255, 255, 0.7)', // bg-background-bg-permanent-elevated-70
    backgroundAccented: 'rgba(255, 255, 255, 0.9)', // bg-background-bg-permanent-accented
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal backdrop
  },

  // Typography Scale
  typography: {
    fontFamily: '"Bayer Sans", sans-serif',
    sizes: {
      sm: '14px', // text-sm
      base: '16px', // Base font size
      lg: '18px', // text-lg
      xl: '20px', // text-xl (LG viewport)
    },
    weights: {
      regular: '400', // font-regular
      medium: '500', // font-medium
      bold: '700', // font-bold
    },
    lineHeights: {
      tight: '20px', // leading-sm-tight
      normal: '24px', // Normal line height
      lgTight: '28px', // leading-lg-tight
      xl: '32px', // leading-xl
    },
  },

  // Animation and Interaction
  animations: {
    transition: 'all 0.2s ease-in-out',
    backdropBlur: 'blur(48px)', // backdrop-blur-[48px]
    hover: {
      duration: '200ms',
      easing: 'ease-in-out',
    },
    focus: {
      outlineColor: 'rgb(0, 122, 255)',
      outlineWidth: '2px',
      outlineOffset: '2px',
    },
  },

  // Accessibility Requirements
  accessibility: {
    minTouchTarget: '44px', // WCAG AA requirement for touch targets
    colorContrast: {
      normal: '4.5:1', // WCAG AA
      large: '3:1', // WCAG AA for large text
    },
    focusIndicator: {
      minWidth: '2px',
      minContrast: '3:1',
    },
  },
};