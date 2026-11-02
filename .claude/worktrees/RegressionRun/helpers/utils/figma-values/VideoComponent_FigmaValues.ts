// Figma design tokens for Video Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: 263:22871, LG: 263:22869, MD: 263:22867, SM: 263:22864
// Last updated: 2025-09-22 - ACTUAL FIGMA VALUES FETCHED
// Component: Video Component with thumbnail, title, duration and overlay functionality

// NOTE: These values are fetched directly from Figma using the figma-generic-fetcher
// To update values, use: npx tsx figma-generic-fetcher.ts [nodeId] VideoComponent_FigmaValues.ts

export const VideoComponent_FigmaValues = {
  XL: {
    viewport: {
      width: 1920,
      height: 1080,
    },
    titleElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    durationElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    thumbnailContainer: {
      width: '400px',
      height: '267px',
      borderRadius: '8px',
      aspectRatio: '1.5',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    playButton: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: 'rgba(16, 56, 79, 1)',
    },
    componentSpacing: {
      gap: '16px',
      padding: '0px',
    },
  },
  LG: {
    viewport: {
      width: 1200,
      height: 800,
    },
    titleElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    durationElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    thumbnailContainer: {
      width: '400px',
      height: '267px',
      borderRadius: '8px',
      aspectRatio: '1.5',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    playButton: {
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: 'rgba(16, 56, 79, 1)',
    },
    componentSpacing: {
      gap: '16px',
      padding: '0px',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    titleElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    durationElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '30px',
    },
    thumbnailContainer: {
      width: '400px',
      height: '267px',
      borderRadius: '6px',
      aspectRatio: '1.5',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    playButton: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: 'rgba(16, 56, 79, 1)',
    },
    componentSpacing: {
      gap: '12px',
      padding: '0px',
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    titleElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
    },
    durationElement: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(255, 255, 255, 1)',
      lineHeight: '20px',
    },
    thumbnailContainer: {
      width: '400px',
      height: '267px',
      borderRadius: '4px',
      aspectRatio: '1.5',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    playButton: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: 'rgba(16, 56, 79, 1)',
    },
    componentSpacing: {
      gap: '8px',
      padding: '0px',
    },
  },
};

// Alias for consistency with other components
export const Video_FigmaValues = VideoComponent_FigmaValues;
