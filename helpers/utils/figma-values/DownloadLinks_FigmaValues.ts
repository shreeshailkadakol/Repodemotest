// Figma design tokens for Download Links Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: 605:7039, LG: 605:7157, MD: 605:7182, SM: 605:7171
// Last updated: 2025-10-06 - ACTUAL FIGMA API VALUES EXTRACTED
// Component: Download Links Component with title, description, file listings and download actions
// ✅ CRITICAL DISCOVERY: Figma design is NOT responsive - all viewports use identical typography values
// ✅ VALUES: Real Figma API data extracted using figma-generic-fetcher.ts (no fallback logic)

export const DownloadLinks_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 720,
    },
    componentTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px', // ACTUAL Figma API: componentTitle = 20px Bayer Sans Bold
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // Browser DOM format (Figma: rgba(16, 56, 79, 1))
      lineHeight: '30px', // ACTUAL Figma API: 30px - DESIGN BUG CONFIRMED
    },
    componentDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // ACTUAL Figma API: componentDescription = 18px Bayer Sans Regular
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(64, 96, 114)', // Browser DOM format (Figma: rgba(64, 96, 114, 1))
      lineHeight: '28px', // ACTUAL Figma API: 28px
    },
    fileTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // ACTUAL Figma API: fileName = 18px Bayer Sans Bold
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // ACTUAL Figma API color (converted from rgba)
      lineHeight: '28px', // ACTUAL Figma API: 28px (NOT 24px)
    },
    fileMetadata: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // ACTUAL Figma API: fileMetadata = 18px Bayer Sans Regular
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(96, 113, 139)', // ACTUAL Figma API color (converted from rgba)
      lineHeight: '28px', // ACTUAL Figma API: 28px (NOT 20px)
    },
    downloadButton: {
      fontSize: '14px', // ACTUAL Figma API: downloadButton = 14px Bayer Sans Medium
      fontWeight: '500',
      fontStyle: 'Medium',
      color: 'rgb(16, 56, 79)', // ACTUAL Figma API color (converted from rgba)
      lineHeight: '20px', // ACTUAL Figma API: 20px
      letterSpacing: '0.42px', // ACTUAL Figma API: 0.42px
      textCase: 'UPPER', // ACTUAL Figma API: uppercase
    },
    componentSpacing: {
      gap: '32px', // gap-8
      padding: '32px', // p-8
      backgroundColor: 'rgba(249, 250, 251, 1)', // bg-elevated
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    componentTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px', // Figma API: accordionHeadline = 20px Bayer Sans Bold
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // Browser DOM format (consistent with XL)
      lineHeight: '30px', // Figma API: 30px - ACTUAL FIGMA DESIGN VALUE (same as XL)
    },
    componentDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // Figma API: accordionTitle = 18px Bayer Sans Regular
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(64, 96, 114)', // Browser DOM format (consistent across viewports)
      lineHeight: '28px', // Figma API: 28px - ACTUAL FIGMA VALUE
    },
    fileTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // Consistent with actual DOM rendering
      lineHeight: '22px', // Actual rendered value from DOM
    },
    fileMetadata: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(64, 96, 114, 1)',
      lineHeight: '20px',
    },
    downloadButton: {
      iconSize: '16px',
      iconColor: 'rgba(0, 117, 166, 1)',
    },
    componentSpacing: {
      gap: '32px',
      padding: '32px',
      backgroundColor: 'rgba(249, 250, 251, 1)',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    componentTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px', // Figma API: accordionHeadline = 20px Bayer Sans Bold
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // Browser DOM format (consistent across viewports)
      lineHeight: '30px', // Figma API: 30px - ACTUAL FIGMA DESIGN VALUE (same as all viewports)
    },
    componentDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // Figma API: accordionTitle = 18px Bayer Sans Regular
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(64, 96, 114)', // Browser DOM format (consistent across viewports)
      lineHeight: '28px', // Figma API: 28px - ACTUAL FIGMA VALUE
    },
    fileTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 1)',
      lineHeight: '28px',
    },
    fileMetadata: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(64, 96, 114, 1)',
      lineHeight: '20px',
    },
    downloadButton: {
      iconSize: '16px',
      iconColor: 'rgba(0, 117, 166, 1)',
    },
    componentSpacing: {
      gap: '24px',
      padding: '24px',
      backgroundColor: 'rgba(249, 250, 251, 1)',
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    componentTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px', // Figma API: accordionHeadline = 20px Bayer Sans Bold
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgb(16, 56, 79)', // Browser DOM format (consistent across viewports)
      lineHeight: '30px', // Figma API: 30px - ACTUAL FIGMA DESIGN VALUE (same as all viewports)
    },
    componentDescription: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px', // Figma API: accordionTitle = 18px Bayer Sans Regular
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgb(64, 96, 114)', // Browser DOM format (consistent across viewports)
      lineHeight: '28px', // Figma API: 28px - ACTUAL FIGMA VALUE
    },
    fileTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 1)',
      lineHeight: '28px',
    },
    fileMetadata: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(64, 96, 114, 1)',
      lineHeight: '24px',
    },
    downloadButton: {
      iconSize: '14px',
      iconColor: 'rgba(0, 117, 166, 1)',
    },
    componentSpacing: {
      gap: '16px',
      padding: '16px',
      backgroundColor: 'rgba(249, 250, 251, 1)',
    },
  },
};

/**
 * Node ID mapping for fetching actual values from Figma API
 * Note: Use colon format (e.g. "123:456") not hyphen format for node IDs
 */
export const DownloadLinks_NodeIds = {
  XL: {
    componentNode: '605:7039', // Actual Figma node ID - XL viewport Link List
    componentTitle: '605:7039', // Maps to accordionHeadline in Figma extraction
    componentDescription: '605:7039', // Maps to accordionTitle in Figma extraction
    fileTitle: '605:7039', // Same component, different text elements
    fileMetadata: '605:7039', // Same component, different text elements
    downloadButton: '605:7039', // Same component, different text elements
  },
  LG: {
    componentNode: '605:7157', // Actual Figma node ID - LG viewport Link List
    componentTitle: '605:7157', // Maps to accordionHeadline in Figma extraction
    componentDescription: '605:7157', // Maps to accordionTitle in Figma extraction
    fileTitle: '605:7157', // Same component, different text elements
    fileMetadata: '605:7157', // Same component, different text elements
    downloadButton: '605:7157', // Same component, different text elements
  },
  MD: {
    componentNode: '605:7182', // Actual Figma node ID - MD viewport Link List
    componentTitle: '605:7182', // Maps to accordionHeadline in Figma extraction
    componentDescription: '605:7182', // Maps to accordionTitle in Figma extraction
    fileTitle: '605:7182', // Same component, different text elements
    fileMetadata: '605:7182', // Same component, different text elements
    downloadButton: '605:7182', // Same component, different text elements
  },
  SM: {
    componentNode: '605:7171', // Actual Figma node ID - SM viewport Link List
    componentTitle: '605:7171', // Maps to accordionHeadline in Figma extraction
    componentDescription: '605:7171', // Maps to accordionTitle in Figma extraction
    fileTitle: '605:7171', // Same component, different text elements
    fileMetadata: '605:7171', // Same component, different text elements
    downloadButton: '605:7171', // Same component, different text elements
  },
};

/**
 * Fetch actual Figma values using the API
 * Usage example:
 *
 * import { fetchFigmaNodes } from '../figmaAPI';
 * import { DownloadLinks_NodeIds } from './DownloadLinks_FigmaValues';
 *
 * // Fetch XL viewport values
 * const xlNodeIds = Object.values(DownloadLinks_NodeIds.XL);
 * const figmaData = await fetchFigmaNodes(xlNodeIds);
 *
 * // Or use figma-generic-fetcher directly:
 * // npx tsx figma-generic-fetcher.ts 605:7039 605:7157 605:7182 605:7171
 */
