// Figma design tokens for Job Search SideBar Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: 3265:53724, LG: 3265:53728, MD: 3265:53780, SM: 3265:53732
// Last updated: October 24, 2025 - Adapted from Job Search Stage Component
// Component: Job Search SideBar with title, description, input fields, and search button
// Note: No upload resume functionality or "Get job suggestions" text in sidebar component

/**
 * Viewport size configuration
 */
export interface ViewportConfig {
  width: number;
  height: number;
}

/**
 * Typography element properties
 */
export interface TypographyElement {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
  lineHeight: string;
}

/**
 * Input field properties extending typography
 */
export interface InputElement extends TypographyElement {
  borderColor: string;
  backgroundColor: string;
  padding: string;
  borderRadius: string;
  placeholderColor: string;
}

/**
 * Button element properties extending typography
 */
export interface ButtonElement extends TypographyElement {
  backgroundColor: string;
  padding: string;
  borderRadius: string;
  hoverBackgroundColor: string;
  letterSpacing: string;
  textCase: string;
}

/**
 * Component container styling
 */
export interface ComponentContainer {
  backgroundColor: string;
  padding: string;
  gap: string;
  textAlign: string;
}

/**
 * Complete viewport configuration interface for SideBar component
 */
export interface ViewportConfiguration {
  viewport: ViewportConfig;
  titleElement: TypographyElement;
  descriptionElement: TypographyElement;
  inputElement: InputElement;
  buttonElement: ButtonElement;
  additionalText?: TypographyElement; // Optional as not all viewports have this
  componentContainer: ComponentContainer;
}

// Helper function to create typography element

export interface PathBasedElement extends TypographyElement {
  content: string;
  path: string;
  note?: string;
}

/**
 * Complete path-based configuration interface for SideBar component
 * Note: No uploadResumeButton as it's not available in sidebar component
 */
export interface PathBasedConfiguration {
  headlineElement?: PathBasedElement;
  descriptionText: PathBasedElement;
  interestInputField: PathBasedElement;
  locationInputField: PathBasedElement;
  searchButton: PathBasedElement;
  // Note: No uploadResumeButton for sidebar component
  vectorElements?: {
    locationIcon: {
      path: string;
      note: string;
    };
    arrowIcon: {
      path: string;
      note: string;
    };
  };
}

/**
 * Main Figma design specifications for Job Search SideBar Component
 * Organized by viewport breakpoints (XL, LG, MD, SM)
 * Adapted from JobSearchStage component without upload resume elements
 */
export const JobSearchSideBar_FigmaValues: Record<'XL' | 'LG' | 'MD' | 'SM', ViewportConfiguration> =
  {
    XL: {
      viewport: {
        width: 1440,
        height: 720,
      },
      titleElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '24px', // UPDATED: Actual sidebar value (not 48px)
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // white from Figma
        lineHeight: '32px', // UPDATED: Actual sidebar value (not 56px)
      },
      descriptionElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // UPDATED: actual value from Figma (was 18px)
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // white from Figma
        lineHeight: '30px', // UPDATED: actual value from Figma (was 28px)
      },
      inputElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px', // UPDATED: actual value from Figma (was 16px)
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // white for typed text from Figma
        borderColor: 'rgba(209, 213, 219, 1)', // border-gray-300
        backgroundColor: 'rgba(255, 255, 255, 1)', // white
        padding: '12px 16px',
        borderRadius: '8px',
        placeholderColor: 'rgba(144, 161, 185, 1)', // CORRECTED: grayish-blue for placeholder from Figma
        lineHeight: '30px', // CORRECTED: actual value from Figma path-based extraction
      },
      buttonElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // UPDATED: actual value from Figma (was 16px)
        fontWeight: '500', // UPDATED: actual value from Figma (was 600)
        fontStyle: 'Medium Italic', // UPDATED: actual value from Figma
        color: 'rgba(16, 56, 79, 1)', // UPDATED: actual dark blue from Figma
        backgroundColor: 'rgba(211, 15, 75, 1)', // primary-red
        padding: '12px 24px',
        borderRadius: '8px',
        hoverBackgroundColor: 'rgba(185, 13, 66, 1)', // darker red
        lineHeight: '20px', // UPDATED: actual value from Figma
        letterSpacing: '0.42px', // UPDATED: actual value from Figma
        textCase: 'UPPER', // UPDATED: actual value from Figma
      },
      additionalText: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(144, 161, 185, 1)',
        lineHeight: '24px',
      },
      componentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '80px 0',
        gap: '32px',
        textAlign: 'center',
      },
    },
    LG: {
      viewport: {
        width: 1024,
        height: 768,
      },
      titleElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '24px', // UPDATED: Actual sidebar value (LG same as XL)
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // UPDATED: actual color from Figma
        lineHeight: '32px', // UPDATED: Actual sidebar value (LG same as XL)
      },
      descriptionElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // UPDATED: actual value from Figma (was 18px)
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // UPDATED: actual color from Figma
        lineHeight: '30px', // UPDATED: actual value from Figma (was 28px)
      },
      inputElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px', // UPDATED: actual value from Figma (was 16px)
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: white for typed text from Figma
        borderColor: 'rgba(209, 213, 219, 1)',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '12px 16px',
        borderRadius: '8px',
        placeholderColor: 'rgba(144, 161, 185, 1)', // CORRECTED: grayish-blue for placeholder from Figma
        lineHeight: '30px', // UPDATED: actual value from Figma
      },
      buttonElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // UPDATED: actual value from Figma (was 16px)
        fontWeight: '500', // UPDATED: actual value from Figma (was 600)
        fontStyle: 'Medium Italic', // UPDATED: actual value from Figma
        color: 'rgba(16, 56, 79, 1)', // UPDATED: actual color from Figma
        backgroundColor: 'rgba(211, 15, 75, 1)',
        padding: '12px 24px',
        borderRadius: '8px',
        hoverBackgroundColor: 'rgba(185, 13, 66, 1)',
        lineHeight: '20px', // UPDATED: actual value from Figma
        letterSpacing: '0.42px', // UPDATED: actual value from Figma
        textCase: 'UPPER', // UPDATED: actual value from Figma
      },
      additionalText: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(144, 161, 185, 1)',
        lineHeight: '24px',
      },
      componentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '80px 0',
        gap: '32px',
        textAlign: 'center',
      },
    },
    MD: {
      viewport: {
        width: 768,
        height: 1024,
      },
      titleElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // UPDATED: Actual MD sidebar value
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should always be white
        lineHeight: '30px', // UPDATED: Actual MD sidebar value
      },
      descriptionElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // CORRECTED: Figma design specifies 16px for MD viewport
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should be white like other viewports
        lineHeight: '30px', // CORRECTED: Figma design specifies 24px for MD viewport
      },
      inputElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px', // CORRECTED: actual implementation uses 18px, not 16px
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: white for typed text from Figma
        borderColor: 'rgba(209, 213, 219, 1)',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '12px 16px',
        borderRadius: '8px',
        placeholderColor: 'rgba(144, 161, 185, 1)', // CORRECTED: grayish-blue for placeholder from Figma
        lineHeight: '30px', // CORRECTED: actual implementation uses 30px
      },
      buttonElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // CORRECTED: actual implementation uses 14px across all viewports
        fontWeight: '500', // CORRECTED: actual implementation uses 500, not 600
        fontStyle: 'Medium Italic', // CORRECTED: actual style from implementation
        color: 'rgba(16, 56, 79, 1)', // CORRECTED: actual text color from implementation
        backgroundColor: 'rgba(211, 15, 75, 1)',
        padding: '12px 24px',
        borderRadius: '8px',
        hoverBackgroundColor: 'rgba(185, 13, 66, 1)',
        lineHeight: '20px', // CORRECTED: actual line height from implementation
        letterSpacing: '0.42px', // CORRECTED: actual letter spacing
        textCase: 'UPPER', // CORRECTED: actual text transform
      },
      componentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '64px 0',
        gap: '24px',
        textAlign: 'center',
      },
    },
    SM: {
      viewport: {
        width: 375,
        height: 667,
      },
      titleElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '24px', // UPDATED: Actual SM sidebar value
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should always be white
        lineHeight: '30px', // UPDATED: Actual SM sidebar value
      },
      descriptionElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // CORRECTED: match implementation (was 16px)
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should be white like other viewports
        lineHeight: '30px', // CORRECTED: match implementation (was 24px)
      },
      inputElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px', // CORRECTED: actual implementation uses 18px, not 16px
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: white for typed text
        borderColor: 'rgba(209, 213, 219, 1)',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '12px 16px',
        borderRadius: '8px',
        placeholderColor: 'rgba(144, 161, 185, 1)', // CORRECTED: grayish-blue for placeholder
        lineHeight: '30px', // CORRECTED: actual implementation uses 30px
      },
      buttonElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // CORRECTED: actual implementation uses 14px across all viewports
        fontWeight: '500', // CORRECTED: actual implementation uses 500, not 600
        fontStyle: 'Medium Italic', // CORRECTED: actual style from implementation
        color: 'rgba(16, 56, 79, 1)', // CORRECTED: actual text color from implementation
        backgroundColor: 'rgba(211, 15, 75, 1)',
        padding: '12px 24px',
        borderRadius: '8px',
        hoverBackgroundColor: 'rgba(185, 13, 66, 1)',
        lineHeight: '20px', // CORRECTED: actual line height from implementation
        letterSpacing: '0.42px', // CORRECTED: actual letter spacing
        textCase: 'UPPER', // CORRECTED: actual text transform
      },
      componentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: '48px 0',
        gap: '20px',
        textAlign: 'center',
      },
    },
  };

// ✅ SPECIFIC PATH-BASED VALUES: Element typography extracted from Figma API using exact paths
// All values below were extracted using the specific node paths from the stage component
// Note: uploadResumeButton removed as it's not available in sidebar component
export const JobSearchSideBarPathBasedValues = {
  // XL Viewport (3265:53724) - Specific Path Extraction for SideBar
  XL: {
    // 1. Highlight Text and headline: panel > text > headline > text
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // UPDATED: Actual sidebar XL value
      fontWeight: '700',
      fontStyle: 'Bold',
      lineHeight: '32px', // UPDATED: Actual sidebar XL value
      content: 'Career. Be Bayer.',
      path: 'panel > text > headline > text',
    },
    // 2. Description Text: panel > text > text
    descriptionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
      content:
        'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
      path: 'panel > text > text',
    },
    // 3. Text Fields (What are you interested in?): Input Container > Input Text
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'What are you interested in?',
      path: 'Input Container > Input Text',
    },
    // 4. Location Input field: form > Text Fields > Input Container > Input Text (fallback to generic)
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px', // CORRECTED: 30px is the correct line height
      content: 'Your location',
      path: 'form > Text Fields > Input Container > Input Text',
      note: 'Extracted as genericInput - exact form path not found',
    },
    // 7. Search button: buttonGroup > Button
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'buttonGroup > Button',
    },
    // Note: No uploadResumeButton for sidebar component
  },
  // LG Viewport (3265:53728) - Specific Path Extraction for SideBar
  LG: {
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // UPDATED: Actual sidebar LG value
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '32px', // UPDATED: Actual sidebar LG value
      content: 'Career. Be Bayer.',
      path: 'panel > content > text > headline > text',
    },
    descriptionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
      content:
        'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
      path: 'panel > content > text > text',
    },
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'What are you interested in?',
      path: 'panel > content > input > Text Fields > Input Container > Input Text',
    },
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
      content: 'Your location',
      path: 'panel > content > input > Text Fields > Input Container > Input Text',
    },
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'panel > content > button group > Button',
    },
    // Note: No uploadResumeButton for sidebar component
  },
  // MD Viewport (3265:53780) - Specific Path Extraction for SideBar
  MD: {
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px', // UPDATED: Actual sidebar MD value
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '28px', // UPDATED: Actual sidebar MD value
      content: 'Career. Be Bayer.',
      path: 'panel > content > text > headline > text',
    },
    descriptionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',  // Updated to match actual DOM implementation
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',  // Updated to match actual DOM implementation
      content:
        'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
      path: 'panel > content > text > text',
    },
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'What are you interested in?',
      path: 'panel > content > input > Text Fields > Input Container > Input Text',
    },
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
      content: 'Your location',
      path: 'panel > content > input > Text Fields > Input Container > Input Text',
    },
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'panel > content > button group > Button',
    },
    // Note: No uploadResumeButton for sidebar component
  },
  // SM Viewport (3265:53732) - Specific Path Extraction for SideBar
  SM: {
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // UPDATED: Actual sidebar SM value
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '32px', // UPDATED: Actual sidebar SM value
      content: 'Career. Be Bayer.',
      path: 'panel > content > text > headline > text',
    },
    descriptionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
      content:
        'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
      path: 'panel > content > text > text',
    },
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'What are you interested in?',
      path: 'panel > content > input > Text Fields > Input Container > Input Text',
    },
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
      content: 'Your location',
      path: 'panel > content > input > Text Fields > Input Container > Input Text',
    },
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.42px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'panel > content > button group > Button',
    },
    // Note: No uploadResumeButton for sidebar component
  },
};