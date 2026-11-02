// Figma design tokens for Teaser Grid Component
// Sourced from Figma file: fiKrYZCKNM1OqXHQoGwrlX
// Node IDs: XL: 6042:164548, LG: 6042:164538, MD: 6042:164532, SM: 6042:164609
// Last updated: 2026-01-17
// Component: Teaser Grid with title, headline, intro text and individual teaser cards

// NOTE: These values are fetched directly from Figma using the figma-extractor
// To update values, use: npx tsx figma-extractor.ts <fileKey> <nodeId> <token> <componentName>

export const TeaserGrid_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 900,
    },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgba(16, 56, 79, 1)',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
    },
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgba(16, 56, 79, 1)',
    },
    gridContainer: {
      width: 1248,
      gap: 32, // Calculated from layout
    },
    teaserCard: {
      width: 608,
      height: 716,
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgba(16, 56, 79, 1)',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
    },
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgba(16, 56, 79, 1)',
    },
    gridContainer: {
      width: 944,
      gap: 32, // Calculated from layout
    },
    teaserCard: {
      width: 456,
      height: 944,
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
      color: 'rgba(16, 56, 79, 1)',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
    },
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
      color: 'rgba(16, 56, 79, 1)',
    },
    gridContainer: {
      width: 704,
      gap: 32, // Calculated from layout
    },
    teaserCard: {
      width: 336,
      height: 928,
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    titleComponent: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
      color: 'rgba(16, 56, 79, 1)',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
    },
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
      color: 'rgba(16, 56, 79, 1)',
    },
    gridContainer: {
      width: 335,
      gap: 32, // Calculated from layout
    },
    teaserCard: {
      width: 335,
      height: 447,
    },
  },
};
