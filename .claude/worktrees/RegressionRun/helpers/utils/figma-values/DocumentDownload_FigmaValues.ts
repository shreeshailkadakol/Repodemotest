// Document Download Component Figma Design Values
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=7070-42446&t=ZGtE91eX2nh2hAEY-4
// Component: Document Download (User Story 2049)
// Generated for visual testing validation
//
// This configuration provides design specifications for the Document Download component
// across multiple viewport sizes (XL, LG, MD, SM) for visual regression testing.
//
// User Story: 2049 (AC10-AC14)
// - AC10: Divider placement after headline
// - AC11: Browse, search, and filter functionality
// - AC12: Single document download
// - AC13: Multi-select and bulk download
// - AC14: Loading states
//
// DATA SOURCE: Extracted from Figma API using figma-extractor.ts
// - Complete component hierarchies with child node IDs for XL viewport
// - Total elements extracted: 2,968 across 9 component variants
// - Extraction date: 2026-02-27
// - Source files: ./figma-values/DocumentDownload_*_Values.json

export const DocumentDownloadFigmaValues = {
  // XL Viewport (≥1440px) Design Specifications
  XL: {
    viewport: {
      width: 1440,
      height: 900,
    },
    // Headline (AC10)
    headline: {
      figmaPath: 'Document Download>Headline',
      nodeId: '14263-185486', // Headline text node
      textContent: 'Headline Document Download Tool',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
      color: 'rgba(16, 56, 79, 1)', // Primary text
      visible: true,
    },
    // Divider (AC10)
    divider: {
      figmaPath: 'Document Download>Divider',
      nodeId: '14263-185480', // XL viewport - 100% divider (root frame)
      height: '1px',
      width: '100%',
      backgroundColor: 'rgb(203, 213, 225)', // border-border
      marginTop: '24px',
      marginBottom: '32px',
      display: 'block',
      childNodes: {
        reportList: '14263-185481', // Report List frame
        headlineFrame: '14263-185484', // Headline container frame
      },
    },
    // Search Input (AC11)
    searchInput: {
      figmaPath: 'Document Download>Search Input',
      nodeId: 'I14263:185488;13765:10104', // Input Text node
      textContent: 'Search Documents',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgba(96, 113, 139, 1)', // Placeholder text color
      backgroundColor: 'rgba(248, 250, 252, 1)', // Input container background
      width: '288px',
      height: '62px',
      childNodes: {
        textFieldInstance: '14263-185488', // Text Fields instance
        inputContainer: 'I14263:185488;13765:10102', // Input Container frame
        searchIcon: 'I14263:185488;13765:10103', // Search Icon instance
      },
    },
    // Filter Buttons (AC11)
    filterButtons: {
      figmaPath: 'Document Download>Filters',
      documentTypeFilter: {
        nodeId: '14263-185489', // First dropdown (Document Type)
        width: '288px',
        height: '62px',
        backgroundColor: 'rgba(248, 250, 252, 1)',
      },
      yearFilter: {
        nodeId: '14263-185490', // Second dropdown (Year)
        width: '288px',
        height: '62px',
        backgroundColor: 'rgba(248, 250, 252, 1)',
      },
      quarterFilter: {
        nodeId: '14263-185491', // Third dropdown (Quarter)
        width: '288px',
        height: '62px',
        backgroundColor: 'rgba(248, 250, 252, 1)',
      },
    },
    // Bulk Download Button & Selection Counter (AC13)
    bulkDownloadButton: {
      figmaPath: 'Document Download>Bulk Download',
      nodeId: '14263-185493', // download button frame
      width: '172px',
      height: '62px',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      childNodes: {
        contentFrame: '14263-185494', // Content frame
        selectionCounter: '14263-185495', // "0 Selected" text
        downloadIcon: '14263-185496', // Download icon instance
      },
      selectionCounter: {
        nodeId: '14263-185495',
        textContent: '0 Selected',
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '18px',
        fontWeight: '500',
        lineHeight: '18px',
        color: 'rgba(16, 56, 79, 1)',
      },
    },
    // Document Card (AC12)
    documentCard: {
      figmaPath: 'Document Download>Document Item',
      nodeId: '14263-185499', // DocumentDownloadToolItem instance
      width: '395px',
      height: '370px',
      backgroundColor: 'rgba(248, 250, 252, 1)',
      title: {
        nodeId: 'I14263:185499;14263:185290', // Product Name text
        textContent: 'Investment Case August 2025',
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '24px',
        fontWeight: '700',
        lineHeight: '30px',
        color: 'rgba(16, 56, 79, 1)',
        width: '295px',
        height: '60px',
      },
      checkbox: {
        nodeId: 'I14263:185499;14263:185292', // Checkbox instance
        width: '20px',
        height: '20px',
        color: 'rgba(255, 255, 255, 1)',
      },
      tag: {
        nodeId: 'I14263:185499;14263:185289', // Tag instance
        textContent: 'Document Type',
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: 'rgba(49, 65, 88, 1)',
        backgroundColor: 'rgba(226, 232, 240, 1)',
        width: '130px',
        height: '24px',
      },
      attributes: {
        nodeId: 'I14263:185499;14263:185293', // Document Attributes frame
        width: '331px',
        height: '98px',
      },
    },
    // Pagination (AC11)
    pagination: {
      figmaPath: 'Document Download>Pagination',
      nodeId: '14263-185510', // Pagination instance
      width: '1248px',
      height: '44px',
      childNodes: {
        navigationItem: 'I14263:185510;15141:31154', // CarouselNavigationItem
        paginationContainer: 'I14263:185510;15141:31701', // Pagination Container
        numberItem1: 'I14263:185510;15141:14241', // First number item
        numberItem2: 'I14263:185510;15141:14273', // Second number item
      },
      numberItem: {
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '18px',
        fontWeight: '700', // Active item
        lineHeight: '28px',
        color: 'rgba(16, 56, 79, 1)',
        activeBackground: 'rgba(241, 245, 249, 1)',
      },
    },
    // Empty State (AC11)
    emptyState: {
      figmaPath: 'Document Download>Empty State',
      nodeId: '14263-186295', // XL viewport empty state root
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '500',
      color: 'rgb(100, 116, 139)', // text-text-subtle
      lineHeight: '28px',
      textAlign: 'center',
      padding: '48px 24px',
      message: 'No documents found matching your criteria',
      childNodes: {
        reportList: '14263-186296', // Report List frame (empty state)
        headlineFrame: '14263-186299', // Headline frame (empty state)
        headlineText: '14263-186301', // Headline text (same as normal state)
      },
    },
    // Loading State (AC14)
    loadingState: {
      figmaPath: 'Document Download>Loading State',
      nodeId: '14263-186288', // Loading spinner (all viewports)
      spinner: {
        size: '40px',
        color: 'rgb(0, 112, 243)', // text-primary
        borderWidth: '4px',
      },
      text: {
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgb(100, 116, 139)', // text-text-subtle
        lineHeight: '24px',
        marginTop: '16px',
        message: 'Loading documents...',
      },
    },
  },

  // LG Viewport (≥1024px) Design Specifications
  // NOTE: Similar structure to XL viewport with different node IDs and dimensions
  // Full child node extraction available in ./figma-values/DocumentDownload_LG_Divider_Values.json (619 elements)
  // and DocumentDownload_LG_EmptyState_Values.json (196 elements)
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    // Divider (AC10)
    divider: {
      figmaPath: 'Document Download>Divider',
      nodeId: '14263-185570', // LG viewport - 100% divider (root frame)
      height: '1px',
      width: '100%',
      backgroundColor: 'rgb(203, 213, 225)', // border-border
      marginTop: '20px',
      marginBottom: '28px',
      display: 'block',
    },
    // Empty State (AC11)
    emptyState: {
      figmaPath: 'Document Download>Empty State',
      nodeId: '14263-186314', // LG viewport empty state root
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '500',
      color: 'rgb(100, 116, 139)', // text-text-subtle
      lineHeight: '28px',
      textAlign: 'center',
      padding: '48px 24px',
      message: 'No documents found matching your criteria',
    },
    // Loading State (AC14)
    loadingState: {
      figmaPath: 'Document Download>Loading State',
      nodeId: '14263-186288', // Loading spinner (all viewports)
      spinner: {
        size: '40px',
        color: 'rgb(0, 112, 243)', // text-primary
        borderWidth: '4px',
      },
      text: {
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        color: 'rgb(100, 116, 139)', // text-text-subtle
        lineHeight: '24px',
        marginTop: '16px',
        message: 'Loading documents...',
      },
    },
  },

  // MD Viewport (768px-1023px) Design Specifications - Tablet
  // NOTE: Most complex extraction with 626 elements across full divider hierarchy
  // Full child node extraction available in ./figma-values/DocumentDownload_MD_Divider_Values.json (626 elements)
  // and DocumentDownload_MD_EmptyState_Values.json (193 elements)
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    // Divider (AC10)
    divider: {
      figmaPath: 'Document Download>Divider',
      nodeId: '14263-185607', // MD viewport - 100% divider (root frame)
      height: '1px',
      width: '100%',
      backgroundColor: 'rgb(203, 213, 225)', // border-border
      marginTop: '16px',
      marginBottom: '24px',
      display: 'block',
    },
    // Empty State (AC11)
    emptyState: {
      figmaPath: 'Document Download>Empty State',
      nodeId: '14263-186354', // MD viewport
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px',
      fontWeight: '500',
      color: 'rgb(100, 116, 139)', // text-text-subtle
      lineHeight: '24px',
      textAlign: 'center',
      padding: '40px 20px',
      message: 'No documents found matching your criteria',
    },
    // Loading State (AC14)
    loadingState: {
      figmaPath: 'Document Download>Loading State',
      nodeId: '14263-186288', // Loading spinner (all viewports)
      spinner: {
        size: '36px',
        color: 'rgb(0, 112, 243)', // text-primary
        borderWidth: '3px',
      },
      text: {
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgb(100, 116, 139)', // text-text-subtle
        lineHeight: '20px',
        marginTop: '12px',
        message: 'Loading documents...',
      },
    },
  },

  // SM Viewport (≤767px) Design Specifications - Mobile
  // NOTE: Mobile-optimized layout with responsive dimensions
  // Full child node extraction available in ./figma-values/DocumentDownload_SM_Divider_Values.json (575 elements)
  // and DocumentDownload_SM_EmptyState_Values.json (193 elements)
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    // Divider (AC10)
    divider: {
      figmaPath: 'Document Download>Divider',
      nodeId: '14263-185543', // SM viewport - 100% divider (root frame)
      height: '1px',
      width: '100%',
      backgroundColor: 'rgb(203, 213, 225)', // border-border
      marginTop: '12px',
      marginBottom: '20px',
      display: 'block',
    },
    // Empty State (AC11)
    emptyState: {
      figmaPath: 'Document Download>Empty State',
      nodeId: '14263-186336', // SM viewport
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgb(100, 116, 139)', // text-text-subtle
      lineHeight: '20px',
      textAlign: 'center',
      padding: '32px 16px',
      message: 'No documents found',
    },
    // Loading State (AC14)
    loadingState: {
      figmaPath: 'Document Download>Loading State',
      nodeId: '14263-186288', // Loading spinner (all viewports)
      spinner: {
        size: '32px',
        color: 'rgb(0, 112, 243)', // text-primary
        borderWidth: '3px',
      },
      text: {
        fontFamily: '"Bayer Sans", sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        color: 'rgb(100, 116, 139)', // text-text-subtle
        lineHeight: '20px',
        marginTop: '12px',
        message: 'Loading...',
      },
    },
  },

  // Shared Accessibility Values (WCAG 2.1 AA Compliance)
  accessibility: {
    // Color Contrast Ratios
    colorContrast: {
      textOnWhite: '7:1', // Primary text on white background
      textOnPrimary: '4.5:1', // White text on primary blue
      subtleTextOnWhite: '4.5:1', // Subtle text on white background
    },
    // Focus Indicators
    focusIndicators: {
      style: 'solid',
      width: '2px',
      color: 'rgb(0, 112, 243)', // primary
      offset: '2px',
      visible: true,
    },
    // Interactive Element Sizing (Touch Targets)
    touchTargets: {
      minimumSize: '44px', // WCAG minimum touch target size
      checkbox: '44px',
      button: '44px',
      filterButton: '44px',
    },
    // Screen Reader Text
    ariaLabels: {
      searchInput: 'Search documents by title',
      documentTypeFilter: 'Filter documents by type',
      yearFilter: 'Filter documents by year',
      quarterFilter: 'Filter documents by quarter',
      documentCheckbox: 'Select document for bulk download',
      downloadButton: 'Download single document',
      bulkDownloadButton: 'Download all selected documents',
      previousPageButton: 'Go to previous page',
      nextPageButton: 'Go to next page',
    },
  },

  // Design System Summary (Extracted from Figma API)
  // This section documents the consistent design patterns found across all extracted components
  designSystem: {
    // Typography Scale (Bayer Sans font family)
    typography: {
      fontFamily: '"Bayer Sans", sans-serif',
      scale: {
        h1: { fontSize: '48px', fontWeight: '700', lineHeight: '56px' }, // "Discover" (hidden)
        h2: { fontSize: '36px', fontWeight: '700', lineHeight: '44px' }, // Primary headline
        h3: { fontSize: '24px', fontWeight: '700', lineHeight: '30px' }, // Document titles
        body: { fontSize: '18px', fontWeight: '400', lineHeight: '30px' }, // Input text
        bodyMedium: { fontSize: '18px', fontWeight: '500', lineHeight: '18px' }, // Selection counter
        small: { fontSize: '16px', fontWeight: '700', lineHeight: '24px' }, // Attribute values
        caption: { fontSize: '14px', fontWeight: '400', lineHeight: '20px' }, // Dropdown items
        tag: { fontSize: '12px', fontWeight: '500', lineHeight: '16px', letterSpacing: '0.4px' }, // Document tags
        hint: { fontSize: '12px', fontWeight: '400', lineHeight: '16px' }, // Hint text
        badge: { fontSize: '12px', fontWeight: '700', lineHeight: '16px' }, // Multiselect numbers
      },
    },
    // Color Palette (extracted RGBA values from Figma)
    colors: {
      // Primary Colors
      primaryText: 'rgba(16, 56, 79, 1)',        // #10384F - Headlines, primary text
      primaryBlue: 'rgba(0, 112, 243, 1)',       // #0070F3 - Primary action color
      primaryAccent: 'rgba(255, 49, 98, 1)',     // #FF3162 - Download icons, arrows
      
      // Background Colors
      white: 'rgba(255, 255, 255, 1)',           // #FFFFFF - White backgrounds
      lightGray: 'rgba(248, 250, 252, 1)',       // #F8FAFC - Input/card backgrounds
      border: 'rgba(203, 213, 225, 1)',          // #CBD5E1 - Dividers, borders
      activeBackground: 'rgba(241, 245, 249, 1)', // #F1F5F9 - Active pagination item
      tagBackground: 'rgba(226, 232, 240, 1)',   // #E2E8F0 - Tag backgrounds
      
      // Text Colors
      subtleText: 'rgba(96, 113, 139, 1)',       // #60718B - Placeholder, labels
      secondaryText: 'rgba(64, 96, 114, 1)',     // #406072 - Descriptions
      tagText: 'rgba(49, 65, 88, 1)',            // #314158 - Tag text
      scrollbar: 'rgba(144, 161, 185, 1)',       // #90A1B9 - Scrollbar thumb
      boundingBox: 'rgba(217, 217, 217, 1)',     // #D9D9D9 - Icon bounding boxes
    },
    // Spacing & Layout
    spacing: {
      containerWidth: {
        XL: '1248px',
        LG: '1024px',
        MD: '768px',
        SM: '375px',
      },
      cardDimensions: {
        width: '395px',
        height: '370px',
      },
      inputHeight: '62px',
      filterWidth: '288px',
      paginationHeight: '44px',
      checkboxSize: '20px',
      iconSize: '24px',
      smallIconSize: '16px',
    },
  },
};

// Export type for TypeScript support
export type ViewportSize = keyof Omit<typeof DocumentDownloadFigmaValues, 'accessibility' | 'designSystem'>;

// Helper function to get viewport-specific values
export function getDocumentDownloadFigmaValues(viewport: ViewportSize) {
  return DocumentDownloadFigmaValues[viewport];
}

// Helper function to get accessibility values
export function getDocumentDownloadAccessibilityValues() {
  return DocumentDownloadFigmaValues.accessibility;
}

// Helper function to get design system values
export function getDocumentDownloadDesignSystemValues() {
  return DocumentDownloadFigmaValues.designSystem;
}
