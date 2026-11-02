// Figma design tokens for Individual Teaser Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: 489:14587, LG: 489:14592, MD: 489:14595
// Last updated: 2025-09-22 - ACTUAL FIGMA VALUES FETCHED
// Component: Individual Teaser with image, headline, and CTA functionality

// NOTE: These values are fetched directly from Figma using the figma-generic-fetcher
// To update values, use: npx tsx figma-generic-fetcher.ts 489:14587 489:14592 489:14595 IndividualTeaserComponent_FigmaValues.ts

export const IndividualTeaserComponent_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 1080,
    },
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '36px',
    },
    ctaElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
    },
    componentContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      aspectRatio: '3/4',
      borderRadius: '0px',
    },
    imageElement: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      objectFit: 'cover',
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '36px',
    },
    ctaElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
    },
    componentContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      aspectRatio: '3/4',
      borderRadius: '0px',
    },
    imageElement: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      objectFit: 'cover',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    ctaElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
    },
    componentContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      aspectRatio: '3/4',
      borderRadius: '0px',
    },
    imageElement: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      objectFit: 'cover',
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    headlineElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '600',
      fontStyle: 'SemiBold',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '26px',
    },
    ctaElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
    },
    componentContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      aspectRatio: '3/4',
      borderRadius: '0px',
    },
    imageElement: {
      width: '100%',
      height: 'auto',
      aspectRatio: '1.5',
      objectFit: 'cover',
    },
  },

  // Design system tokens
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  colors: {
    primary: 'rgba(0, 123, 191, 1)',
    secondary: 'rgba(255, 255, 255, 1)',
    background: 'rgba(0, 0, 0, 0.6)',
    text: 'rgba(255, 255, 255, 1)',
  },

  transitions: {
    default: '200ms ease-out',
    hover: 'transform 200ms ease-out',
  },
};
