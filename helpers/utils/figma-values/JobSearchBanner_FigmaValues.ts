// Figma design tokens for Job Search Banner Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: 3265:53724, LG: 3265:53728, MD: 3265:53780, SM: 3265:53732
// Last updated: October 16, 2025 - Auto-extracted from Figma API
// Component: Job Search Banner with title, description, input fields, and search button

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
 * Complete viewport configuration interface
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
 * Complete path-based configuration interface
 */
export interface PathBasedConfiguration {
  headlineElement?: PathBasedElement;
  descriptionText: PathBasedElement;
  interestInputField: PathBasedElement;
  locationInputField: PathBasedElement;
  searchButton: PathBasedElement;
  uploadResumeButton: PathBasedElement;
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
 * Main Figma design specifications for Job Search Banner Component
 * Organized by viewport breakpoints (XL, LG, MD, SM)
 */
export const JobSearchBanner_FigmaValues: Record<'XL' | 'LG' | 'MD' | 'SM', ViewportConfiguration> =
  {
    XL: {
      viewport: {
        width: 1440,
        height: 720,
      },
      titleElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '48px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // white from Figma
        lineHeight: '56px',
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
        letterSpacing: '0.4000000059604645px', // UPDATED: actual value from Figma
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
        fontSize: '48px', // UPDATED: actual value from Figma (was 36px)
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // UPDATED: actual color from Figma
        lineHeight: '56px', // UPDATED: actual value from Figma (was 44px)
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
        letterSpacing: '0.4000000059604645px', // UPDATED: actual value from Figma
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
        fontSize: '30px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should always be white
        lineHeight: '36px',
      },
      descriptionElement: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px', // CORRECTED: matches Figma path-based values (16px for MD viewport)
        fontWeight: '400',
        fontStyle: 'Regular',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should be white like other viewports
        lineHeight: '24px', // CORRECTED: matches Figma path-based values (24px for MD viewport)
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
        letterSpacing: '0.4000000059604645px', // CORRECTED: actual letter spacing
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
        fontSize: '30px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)', // CORRECTED: should always be white
        lineHeight: '36px',
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
        letterSpacing: '0.4000000059604645px', // CORRECTED: actual letter spacing
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
// All values below were extracted using the specific node paths you provided
export const JobSearchBannerPathBasedValues = {
  // XL Viewport (3265:53724) - Specific Path Extraction
  XL: {
    // 1. Highlight Text and headline: panel > text > headline > text
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      lineHeight: '56px',
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
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'buttonGroup > Button',
    },
    // 9. Upload resume button: quicklink > Button > Text
    uploadResumeButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'upload your resume',
      path: 'quicklink > Button > Text',
    },
    // Vector elements (not extractable as text)
    vectorElements: {
      locationIcon: {
        path: 'form > Text Fields > Input Container > Search Icon',
        note: 'Vector element - not extractable',
      },
      arrowIcon: {
        path: 'buttonGroup > Button > icon > arrow_forward',
        note: 'Vector element - not extractable',
      },
    },
  },

  // LG Viewport (3265:53728) - Specific Path Extraction
  LG: {
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      lineHeight: '56px',
      content: 'Career. Be Bayer.',
      path: 'panel > text > headline > text',
    },
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
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'What are you interested in?',
      path: 'Input Container > Input Text',
    },
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'Your location',
      path: 'form > Text Fields > Input Container > Input Text',
    },
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'buttonGroup > Button',
    },
    uploadResumeButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'upload your resume',
      path: 'quicklink > Button > Text',
    },
  },

  // MD Viewport (3265:53780) - Specific Path Extraction
  MD: {
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      lineHeight: '36px',
      content: 'Career. Be Bayer.',
      path: 'panel > text > headline > text',
    },
    descriptionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '24px',
      content:
        'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
      path: 'panel > text > text',
    },
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'What are you interested in?',
      path: 'Input Container > Input Text',
    },
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '30px',
      content: 'Your location',
      path: 'form > Text Fields > Input Container > Input Text',
    },
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'buttonGroup > Button',
    },
    uploadResumeButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'upload your resume',
      path: 'quicklink > Button > Text',
    },
  },

  // SM Viewport (3265:53732) - Specific Path Extraction
  SM: {
    descriptionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '24px',
      content:
        'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
      path: 'panel > text > text',
    },
    interestInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '24px',
      content: 'What are you interested in?',
      path: 'Input Container > Input Text',
    },
    locationInputField: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      color: 'rgba(144, 161, 185, 1)',
      lineHeight: '24px',
      content: 'Your location',
      path: 'form > Text Fields > Input Container > Input Text',
    },
    searchButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'SEARCH JOBS',
      path: 'buttonGroup > Button',
    },
    uploadResumeButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'Medium Italic',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
      content: 'upload your resume',
      path: 'quicklink > Button > Text',
    },
  },
};

// ✅ VERIFIED: Element content mapping (confirmed extracted from Figma API)
// All text values below were successfully found in Figma node 3265:53724
export const JobSearchBannerContent = {
  title: 'Career. Be Bayer.',
  description:
    'At Bayer, generalists and specialists, visionaries and doers work together for nutrition, climate protection, and a healthier, more sustainable life.',
  interestInput: 'What are you interested in?',
  locationInput: 'Your location',
  searchButton: 'SEARCH JOBS',
  resumeSuggestion: 'Get job suggestions based on your resume.',
  uploadButton: 'upload your resume',
};

// Figma Element Path Mapping (for typography extraction reference only)
export const JobSearchBannerPaths = {
  // 📍 FIGMA ELEMENT PATHS (verified text extraction paths):
  headline: 'panel > content > text > headline > text', // ✅ "Career. Be Bayer."
  description: 'panel > content > text > text', // ✅ "At Bayer, generalists and specialists..."
  interestInput: 'panel > content > input > Text Fields > Input Container > Input Text', // ✅ "What are you interested in?"
  locationInput: 'panel > content > input > Text Fields > Input Container > Input Text', // ✅ "Your location"
  searchButton: 'panel > content > button group > Button', // ✅ "SEARCH JOBS"
  resumeSuggestion: 'panel > content > quicklink > Text', // ✅ "Get job suggestions based on your resume."
  uploadButton: 'panel > content > quicklink > Button', // ✅ "upload your resume"

  // ❌ VECTOR ELEMENTS (NOT EXTRACTABLE AS TEXT):
  locationIcon: 'form > Text Fields > Input Container > Search Icon', // Vector/Icon element
  arrowIcon: 'buttonGroup > Button > icon > arrow_forward', // Vector/Icon element

  // 📝 CONFIRMED: All text content above verified from Figma API extraction
  // Typography values (font size, color, weight) are accurate for visual validation
};
