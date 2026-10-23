// Figma design tokens for Teaser Group Component  
// Sourced from Figma file: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover
// Node IDs: XL: 2738:27842, LG: 2738:27886, MD: 2738:27930, SM: 2738:27991
// Component: Teaser Group with carousel navigation, highlight text, and individual teasers
// ✅ UPDATED WITH ACTUAL FIGMA API VALUES - 2025-10-06

export const TeaserGroup_NodeIds = {
  XL: {
    container: '2738:27842',
    highlightText: 'TeaserCollection > headline > Highlight text',
    headline: 'TeaserCollection > headline > headline',
    carouselNavigation:
      'TeaserCollection > TeaserCarouselNavigation > teaserList > CarouselNavigation',
  },
  LG: {
    container: '2738:27886',
    highlightText: 'TeaserCollection > headline > Highlight text',
    headline: 'TeaserCollection > headline > headline',
    carouselNavigation:
      'TeaserCollection > TeaserCarouselNavigation > teaserList > CarouselNavigation',
  },
  MD: {
    container: '2738:27930',
    highlightText: 'TeaserCollection > headline > Highlight text',
    headline: 'TeaserCollection > headline > headline',
    carouselNavigation:
      'TeaserCollection > TeaserCarouselNavigation > teaserList > CarouselNavigation',
    dotNavigationActive: 'TeaserCollection > TeaserCarouselNavigation > dotNavigation/active',
    dotNavigationNonActive:
      'TeaserCollection > TeaserCarouselNavigation > dotNavigation/non active',
  },
  SM: {
    container: '2738:27991',
    highlightText: 'TeaserCollection > headline > Highlight text',
    headline: 'TeaserCollection > headline > headline',
    carouselNavigation:
      'TeaserCollection > TeaserCarouselNavigation > teaserList > CarouselNavigation',
    dotNavigationActive: 'TeaserCollection > TeaserCarouselNavigation > dotNavigation/active',
    dotNavigationNonActive:
      'TeaserCollection > TeaserCarouselNavigation > dotNavigation/non active',
  },
};

export const TeaserGroup_FigmaValues = {
  XL: {
    viewport: { width: 1440, height: 900 },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px', // ✅ Confirmed with Figma API
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // ✅ Browser computed style format
      lineHeight: '56px', // ✅ Confirmed with Figma API
      semanticTag: 'h2',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'transparent',
      backgroundImage: 'linear-gradient(to right, #00B4A6, #0072CE)',
      lineHeight: '56px',
    },
    teaserHeadline: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px', // ❌ CORRECTED: Was 24px, actual is 30px per Figma API
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(255, 255, 255, 1)', // ✅ Exact Figma API value
      lineHeight: '36px', // ❌ CORRECTED: Was 32px, actual is 36px per Figma API
    },
    teaserDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px', // ❌ CORRECTED: Was 18px, actual is 24px per Figma API
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)', // ✅ Exact Figma API value
      lineHeight: '30px', // ❌ CORRECTED: Was 28px, actual is 30px per Figma API
    },
    navigation: {
      arrowSize: '24px',
      buttonSize: '48px',
      hoverState: {
        backgroundColor: 'rgba(249, 250, 251, 0.1)',
        color: 'rgb(16, 56, 79)',
      },
      disabledState: {
        color: 'rgba(16, 56, 79, 0.4)',
        cursor: 'default',
      },
    },
  },
  LG: {
    viewport: { width: 1024, height: 768 },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)',
      lineHeight: '56px', // ❌ CORRECTED: Was 48px, actual is 56px from Figma API
      semanticTag: 'h2',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'transparent',
      backgroundImage: 'linear-gradient(to right, #00B4A6, #0072CE)',
      lineHeight: '56px',
    },
    teaserHeadline: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(255, 255, 255)',
      lineHeight: '36px',
    },
    teaserDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(255, 255, 255)',
      lineHeight: '24px',
    },
    navigation: {
      arrowSize: '20px',
      buttonSize: '48px',
    },
  },
  MD: {
    viewport: { width: 768, height: 1024 },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // ❌ CORRECTED: Was 32px, actual is 36px per Figma API
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)',
      lineHeight: '44px', // ❌ CORRECTED: Was 40px, actual is 44px per Figma API
      semanticTag: 'h2',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // ❌ CORRECTED: Was 32px, actual is 36px per Figma API
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 0)', // ✅ Transparent for gradient text
      backgroundImage: 'linear-gradient(90deg, rgb(0, 181, 166) 0%, rgb(0, 114, 206) 100%)', // ✅ Figma gradient
      lineHeight: '44px', // ❌ CORRECTED: Was 40px, actual is 44px per Figma API
    },
    teaserHeadline: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(255, 255, 255)',
      lineHeight: '26px',
    },
    teaserDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(255, 255, 255)',
      lineHeight: '20px',
    },
    navigation: {
      arrowSize: '20px',
      buttonSize: '48px',
      dotNavigation: {
        dotSize: '8px',
        activeColor: 'rgb(16, 56, 79)',
        inactiveColor: 'rgba(16, 56, 79, 0.3)',
        spacing: '8px',
      },
    },
  },
  SM: {
    viewport: { width: 375, height: 667 },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px', // ❌ CORRECTED: Was 24px, actual is 30px per Figma API
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)',
      lineHeight: '36px', // ❌ CORRECTED: Was 32px, actual is 36px per Figma API
      semanticTag: 'h2',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px', // ❌ CORRECTED: Was 24px, actual is 30px per Figma API
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'transparent',
      backgroundImage: 'linear-gradient(to right, #00B4A6, #0072CE)',
      lineHeight: '36px', // ❌ CORRECTED: Was 32px, actual is 36px per Figma API
    },
    teaserHeadline: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(255, 255, 255)',
      lineHeight: '22px',
    },
    teaserDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(255, 255, 255)',
      lineHeight: '20px',
    },
    navigation: {
      arrowSize: '16px',
      buttonSize: '48px',
      dotNavigation: {
        dotSize: '6px',
        activeColor: 'rgb(16, 56, 79)',
        inactiveColor: 'rgba(16, 56, 79, 0.3)',
        spacing: '6px',
      },
    },
  },
};
