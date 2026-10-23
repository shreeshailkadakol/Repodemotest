// Figma design tokens for Quote Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: [TO_BE_FETCHED], LG: [TO_BE_FETCHED], MD: [TO_BE_FETCHED], SM: [TO_BE_FETCHED]
// Last updated: 2025-08-19 - UPDATED WITH ACTUAL COMPONENT VALUES
// Component: Quote Component with gradient text, author citation and semantic structure

export const Quote_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 720,
    },
    quoteText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(211,15,75, 1)', // transparent for gradient text
      lineHeight: '56px', // ACTUAL VALUE from component (was 52.8px)
      backgroundClip: 'text',
      background: 'linear-gradient(to right, #D30F4B, #FF6B35)', // gradient values
    },
    authorName: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)', // text-dark
      lineHeight: '28px', // 1.2 ratio
    },
    authorDesignation: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)', // text-dark
      lineHeight: '28px', // 1.2 ratio
    },
    componentSpacing: {
      gap: '32px', // gap-8 for md+
      padding: '0px',
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    quoteText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 0)', // transparent for gradient text
      lineHeight: '44px', // ACTUAL VALUE from component (was 39.6px)
      backgroundClip: 'text',
      background: 'linear-gradient(to right, #D30F4B, #FF6B35)',
    },
    authorName: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    authorDesignation: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)', // text-dark
      lineHeight: '28px',
    },
    componentSpacing: {
      gap: '32px', // gap-8 for md+
      padding: '0px',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    quoteText: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 0)', // transparent for gradient text
      lineHeight: '36px', // 1.1 ratio
      backgroundClip: 'text',
      background: 'linear-gradient(to right, #D30F4B, #FF6B35)',
    },
    authorName: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    authorDesignation: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    componentSpacing: {
      gap: '32px', // gap-8 for md+
      padding: '0px',
    },
  },
  SM: {
    viewport: {
      width: 640,
      height: 896,
    },
    quoteText: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 0)', // transparent for gradient text
      lineHeight: '30px', // 1.2 ratio for mobile
      backgroundClip: 'text',
      background: 'linear-gradient(to right, #D30F4B, #FF6B35)',
    },
    authorName: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    authorDesignation: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    componentSpacing: {
      gap: '24px', // gap-6 for mobile
      padding: '0px',
    },
  },
};

// Type definitions for better TypeScript support
export type ViewportSize = 'XL' | 'LG' | 'MD' | 'SM';

export interface QuoteComponentStyles {
  viewport: {
    width: number;
    height: number;
  };
  quoteText: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    lineHeight: string;
    backgroundClip: string;
    background: string;
  };
  authorName: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    lineHeight: string;
  };
  authorDesignation: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    lineHeight: string;
  };
  componentSpacing: {
    gap: string;
    padding: string;
  };
}
