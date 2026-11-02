// Visual Asset Component – expected design values (verified against rendered implementation)
// Component: Visual Asset (masonry gallery with lightbox, captions and "Load More")
// Reference design: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
//
// Values below were captured from the actual rendered component on the QA
// environment (https://bayer-beyond-qa-uk.vercel.app/) across every design-system
// breakpoint (XL / LG / MD / SM) and match the Bayer Beyond design tokens.
// fontFamily is asserted with `toContain('Bayer Sans')` since the rendered value
// is the full Bayer Sans font stack with locale fallbacks.

export const VisualAsset_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 900,
    },
    heading: {
      fontFamily: 'Bayer Sans',
      fontSize: '60px',
      fontWeight: '700',
      lineHeight: '70px',
      color: 'rgb(16, 56, 79)',
    },
    lightboxCaption: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(255, 255, 255)',
    },
    loadMoreButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(16, 56, 79)',
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    heading: {
      fontFamily: 'Bayer Sans',
      fontSize: '60px',
      fontWeight: '700',
      lineHeight: '70px',
      color: 'rgb(16, 56, 79)',
    },
    lightboxCaption: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(255, 255, 255)',
    },
    loadMoreButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(16, 56, 79)',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    heading: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
      color: 'rgb(16, 56, 79)',
    },
    lightboxCaption: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(255, 255, 255)',
    },
    loadMoreButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(16, 56, 79)',
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 812,
    },
    heading: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
      color: 'rgb(16, 56, 79)',
    },
    lightboxCaption: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgb(255, 255, 255)',
    },
    loadMoreButton: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '20px',
      color: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(16, 56, 79)',
    },
  },
} as const;
