// Auto-generated from Enhanced Universal Figma Extractor
// Generated on: 2025-11-06T14:16:12.160Z
// Node IDs: 4526:83886 (XL), 4526:83934 (LG), 4526:83921 (MD), 4526:83904 (SM)
// Component: News List Component - Enhanced Extract
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=4526-83765&m=dev

export interface NewsListTypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle?: string;
  color: string;
  background?: string; // For gradient backgrounds
  lineHeight?: string;
  letterSpacing?: string;
  textCase?: string;
  elementPath: string;
}

export interface NewsListViewportValues {
  nodeId: string;
  nodeName: string;
  viewport: {
    width: number;
    height: number;
  };
  textElements: {
    // Main headline elements
    discover: NewsListTypographyStyle;
    our_latest_news: NewsListTypographyStyle;
    
    // Search and filter elements
    search_news: NewsListTypographyStyle;
    area: NewsListTypographyStyle;
    topic: NewsListTypographyStyle;
    
    // News item elements
    news_item_title: NewsListTypographyStyle;
    kicker_lorem_ipsum_dolor: NewsListTypographyStyle;
    topic_tag: NewsListTypographyStyle;
    cell_gene_therapy: NewsListTypographyStyle;
    september_15_2025: NewsListTypographyStyle;
    specialized_press?: NewsListTypographyStyle;
    
    // Pagination elements (if present)
    pagination_number?: NewsListTypographyStyle;
  };
  iconElements?: {
    arrow_forward_ios?: any;
    chevron_right?: any;
    search_icon?: any;
  };
}

// Enhanced Figma Values with accurate extraction
export const NewsListComponentEnhancedFigmaValues = {
  // XL viewport (1440px+) - Node: 4526:83886
  xl: {
    nodeId: '4526:83886',
    nodeName: 'News List',
    viewport: {
      width: 1440,
      height: 900,
    },
    textElements: {
      discover: {
        fontFamily: 'Bayer Sans',
        fontSize: '48px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'transparent', // Highlighted text: transparent with gradient background
        background: 'linear-gradient(90deg, var(--gradient-green, #108000) 0%, var(--gradient-blue, #0075A6) 98.08%)',
        lineHeight: '56px',
        elementPath: 'News List > headline & tags > headline & button > Headline > Discover',
      },
      
      our_latest_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '48px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)', // Main headline: solid color without gradient
        lineHeight: '56px',
        elementPath: 'News List > headline & tags > headline & button > Headline > our latest News',
      },
      
      search_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)', // Gray text
        lineHeight: '30px',
        elementPath: 'News List > filter > Text Fields > Input Container > Input Text',
      },
      
      area: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)', // Dark blue to match actual implementation
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      topic: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)', // Dark blue to match actual implementation
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      news_item_title: {
        fontFamily: 'Bayer Sans',
        fontSize: '30px', // Main news title
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)', // Dark blue
        lineHeight: '36px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Lorem ipsum dolor...',
      },
      
      kicker_lorem_ipsum_dolor: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px', // Kicker text
        fontWeight: '400',
        color: 'rgba(64, 96, 114, 1)', // Darker gray
        lineHeight: '28px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Kicker lorem ipsum dolor',
      },
      
      topic_tag: {
        fontFamily: 'Bayer Sans',
        fontSize: '12px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)', // Green
        lineHeight: '16px',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      cell_gene_therapy: {
        fontFamily: 'Bayer Sans',
        fontSize: '12px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)', // Green tag color
        lineHeight: '16px',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      september_15_2025: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)', // Gray text
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > subcontent > date',
      },
      
      specialized_press: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)', // Gray text
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > subcontent > specialized press',
      },
      
      pagination_number: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400', // Regular pagination numbers
        color: 'rgba(16, 56, 79, 1)', // Dark blue
        lineHeight: '28px',
        elementPath: 'News List > Pagination > Pagination Container > Number Item > 1',
      },
    },
    
    iconElements: {
      arrow_forward_ios: {
        elementType: 'ICON',
        color: 'rgba(16, 56, 79, 1)', // Dark blue arrows
        width: 9.8125,
        height: 16.666667938232422,
        elementPath: 'News List > Pagination > CarouselNaviagtionItem > icon > arrow_forward > arrow_forward_ios',
      },
    },
  } as NewsListViewportValues,

  // LG viewport (1024px+) - Node: 4526:83934  
  lg: {
    nodeId: '4526:83934',
    nodeName: 'News List',
    viewport: {
      width: 1024,
      height: 768,
    },
    textElements: {
      discover: {
        fontFamily: 'Bayer Sans',
        fontSize: '48px', // LG viewport size
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'transparent', // Highlighted text: transparent with gradient background
        background: 'linear-gradient(90deg, var(--gradient-green, #108000) 0%, var(--gradient-blue, #0075A6) 98.08%)',
        lineHeight: '56px',
        elementPath: 'News List > headline & tags > headline & button > Headline > Discover',
      },
      
      our_latest_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '48px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)', // Main headline: solid color without gradient
        lineHeight: '56px',
        elementPath: 'News List > headline & tags > headline & button > Headline > our latest News',
      },
      
      search_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '30px',
        elementPath: 'News List > filter > Text Fields > Input Container > Input Text',
      },
      
      area: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      topic: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      news_item_title: {
        fontFamily: 'Bayer Sans',
        fontSize: '24px', // Smaller news title for LG
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '30px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Lorem ipsum dolor...',
      },
      
      kicker_lorem_ipsum_dolor: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(64, 96, 114, 1)',
        lineHeight: '28px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Kicker lorem ipsum dolor',
      },
      
      topic_tag: {
        fontFamily: 'Bayer Sans',
        fontSize: '12px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)',
        lineHeight: '16px',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      cell_gene_therapy: {
        fontFamily: 'Bayer Sans',
        fontSize: '12px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)',
        lineHeight: '105.34979248046875%',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      september_15_2025: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > subcontent > date',
      },
      
      specialized_press: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '131.68724060058594%',
        elementPath: 'News List > news list > news list > container > content > subcontent > specialized press',
      },
      
      pagination_number: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '122.90808868408203%',
        elementPath: 'News List > Pagination > Pagination Container > Number Item > 1',
      },
    },
  } as NewsListViewportValues,

  // MD viewport (768px+) - Node: 4526:83921
  md: {
    nodeId: '4526:83921',
    nodeName: 'News List',
    viewport: {
      width: 768,
      height: 600,
    },
    textElements: {
      discover: {
        fontFamily: 'Bayer Sans',
        fontSize: '30px', // Medium size for tablet
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'transparent', // Highlighted text: transparent with gradient background
        background: 'linear-gradient(90deg, var(--gradient-green, #108000) 0%, var(--gradient-blue, #0075A6) 98.08%)',
        lineHeight: '36px',
        elementPath: 'News List > headline & tags > headline & button > Headline > Discover',
      },
      
      our_latest_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '30px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)', // Main headline: solid color without gradient
        lineHeight: '36px',
        elementPath: 'News List > headline & tags > headline & button > Headline > our latest News',
      },
      
      search_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '30px',
        elementPath: 'News List > filter > Text Fields > Input Container > Input Text',
      },
      
      area: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      topic: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      news_item_title: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // Medium news title
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Lorem ipsum dolor...',
      },
      
      kicker_lorem_ipsum_dolor: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(64, 96, 114, 1)',
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Kicker lorem ipsum dolor',
      },
      
      topic_tag: {
        fontFamily: 'Bayer Sans',
        fontSize: '12px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)',
        lineHeight: '16px',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      cell_gene_therapy: {
        fontFamily: 'Bayer Sans',
        fontSize: '11px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)',
        lineHeight: '105.34979248046875%',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      september_15_2025: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > subcontent > date',
      },
      
      specialized_press: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '131.68724060058594%',
        elementPath: 'News List > news list > news list > container > content > subcontent > specialized press',
      },
      
      pagination_number: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '122.90808868408203%',
        elementPath: 'News List > Pagination > Pagination Container > Number Item > 1',
      },
    },
  } as NewsListViewportValues,

  // SM viewport (640px+) - Node: 4526:83904
  sm: {
    nodeId: '4526:83904',
    nodeName: 'News List',
    viewport: {
      width: 375,
      height: 600,
    },
    textElements: {
      discover: {
        fontFamily: 'Bayer Sans',
        fontSize: '30px', // Smallest for mobile
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'transparent', // Highlighted text: transparent with gradient background
        background: 'linear-gradient(90deg, var(--gradient-green, #108000) 0%, var(--gradient-blue, #0075A6) 98.08%)',
        lineHeight: '36px',
        elementPath: 'News List > headline & tags > headline & button > Headline > Discover',
      },
      
      our_latest_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '30px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)', // Main headline: solid color without gradient
        lineHeight: '36px',
        elementPath: 'News List > headline & tags > headline & button > Headline > our latest News',
      },
      
      search_news: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > Text Fields > Input Container > Input Text',
      },
      
      area: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      topic: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '24px',
        elementPath: 'News List > filter > dropdown > Dropdown > Input Container > Input Text',
      },
      
      news_item_title: {
        fontFamily: 'Bayer Sans',
        fontSize: '20px', // Smallest news title
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '30px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Lorem ipsum dolor...',
      },
      
      kicker_lorem_ipsum_dolor: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(64, 96, 114, 1)',
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > maincontent > kicker-title > Kicker lorem ipsum dolor',
      },
      
      topic_tag: {
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)',
        lineHeight: '16px',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      cell_gene_therapy: {
        fontFamily: 'Bayer Sans',
        fontSize: '10px',
        fontWeight: '500',
        fontStyle: 'Medium Italic',
        color: 'rgba(14, 104, 1, 1)',
        lineHeight: '105.34979248046875%',
        letterSpacing: '0.4000000059604645px',
        textCase: 'UPPER',
        elementPath: 'News List > news list > news list > container > content > maincontent > tags > Tag > Topic Tag',
      },
      
      september_15_2025: {
        fontFamily: 'Bayer Sans',
        fontSize: '18px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '20px',
        elementPath: 'News List > news list > news list > container > content > subcontent > date',
      },
      
      specialized_press: {
        fontFamily: 'Bayer Sans',
        fontSize: '12px',
        fontWeight: '400',
        color: 'rgba(96, 113, 139, 1)',
        lineHeight: '131.68724060058594%',
        elementPath: 'News List > news list > news list > container > content > subcontent > specialized press',
      },
      
      pagination_number: {
        fontFamily: 'Bayer Sans',
        fontSize: '14px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '122.90808868408203%',
        elementPath: 'News List > Pagination > Pagination Container > Number Item > 1',
      },
    },
  } as NewsListViewportValues,
};

// Helper function to get values by viewport (similar to HomePageHero pattern)
export function getValuesByViewport(viewport: 'xl' | 'lg' | 'md' | 'sm'): NewsListViewportValues {
  return NewsListComponentEnhancedFigmaValues[viewport];
}

// Export viewport-specific getters for easy access
export const getXLValues = () => NewsListComponentEnhancedFigmaValues.xl;
export const getLGValues = () => NewsListComponentEnhancedFigmaValues.lg;  
export const getMDValues = () => NewsListComponentEnhancedFigmaValues.md;
export const getSMValues = () => NewsListComponentEnhancedFigmaValues.sm;