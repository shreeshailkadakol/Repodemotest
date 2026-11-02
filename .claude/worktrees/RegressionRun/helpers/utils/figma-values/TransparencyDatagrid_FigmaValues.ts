// Auto-generated from Figma API - Transparency Datagrid Component
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=19090-79362&m=dev
// Node IDs: 
//   XL: 19090-79097 (default), 19090-79104 (open dropdown), 19090-79359 (filled dropdown)
//   LG: 19090-79363 (default), 19090-79369 (open dropdown), 19090-79367 (filled dropdown)
//   MD: 19090-79373 (default), 19090-79379 (open dropdown), 19090-79378 (filled dropdown)
//   SM: 19090-79383 (default), 19090-79390 (open dropdown), 19090-79388 (filled dropdown)

export const TransparencyDatagridFigmaValues = {
  // XL Viewport (19090-79097) - Desktop view with full table
  XL: {
    viewport: {
      width: 1248,
      height: 800,
    },
    // Headline - "Disclosure details"
    headline: {
      text: 'Disclosure details',
      figmaPath: 'Container>Headline',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgb(16, 56, 79)', // #10384F
      textAlign: 'left',
    },
    // Search Input - Flexible input component
    searchInput: {
      placeholder: 'Search',
      figmaPath: 'Container>flexible-input>Input Container>Input Text',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)', // #60718B
      textAlign: 'left',
      width: '250px',
      borderColor: 'rgb(202, 213, 226)', // #CAD5E2
      borderWidth: '0px 0px 1px',
      padding: '16px',
    },
    // Dropdown - Page size selector (5, 10, 20)
    dropdown: {
      figmaPath: 'Container>dropdown',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)', // #60718B
      padding: '16px',
    },
    // Table Header Cells
    tableHeader: {
      figmaPath: 'Container>Table>Header Row>table cells',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '500', // Medium (corrected from Figma: typescale/text-lg/medium)
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)', // #10384F
      backgroundColor: 'rgb(241, 245, 249)', // #F1F5F9
      borderColor: 'rgb(255, 255, 255)', // #FFFFFF
      borderWidth: '0px 2px 2px 0px',
      padding: '16px 12px',
      gap: '12px',
      width: '250px',
      textAlign: 'left',
    },
    // Table Data Cells
    tableCell: {
      figmaPath: 'Container>Table>Data Row>table cells',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgb(64, 96, 114)', // #406072
      backgroundColor: 'rgb(255, 255, 255)', // #FFFFFF
      padding: '8px 12px',
      gap: '8px',
      width: '250px',
      textAlign: 'left',
    },
    // Filter Icon (on sortable columns)
    filterIcon: {
      figmaPath: 'table cells>filter_list',
      color: 'rgb(16, 56, 79)', // #10384F
      size: '24px',
    },
    // Pagination Numbers
    paginationNumber: {
      figmaPath: 'Pagination>Number Item',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)', // #10384F
      padding: '8px 12px',
      textAlign: 'right',
    },
    // Export Button (XLSX)
    exportButton: {
      figmaPath: 'Interactive Area>xlsx_document',
      size: '44px',
    },
    // Filter Badge (Multiselect Counter) - NEW
    // Appears on column headers when filters are applied (filled dropdown state)
    // Node: I19090:79360;29334:15732 (multiselect number)
    // Selector pattern: data-testid="filter-count-{columnKey}"
    // Example: data-testid="filter-count-Division", data-testid="filter-count-Partner_Country"
    filterBadge: {
      figmaPath: 'table cells>multiselect number>Input Text',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '12px', // typescale/text-xs/bold
      fontWeight: '700',
      lineHeight: '16px',
      color: 'rgb(255, 255, 255)', // #FFFFFF - White text
      backgroundColor: 'rgb(16, 56, 79)', // #10384F - Dark blue
      borderRadius: '8px',
      textAlign: 'left',
    },
    // Dropdown Panel (when filter is opened)
    // Component: _dropdown-panel (19090:74801)
    dropdownPanel: {
      figmaPath: 'Container>_dropdown-panel',
      backgroundColor: 'rgb(255, 255, 255)', // #FFFFFF
      // Additional properties would need inspection of panel borders/shadows
    },
    // Dropdown Item (individual filter option in panel)
    // Component: _dropdown-item (19090:74249)
    dropdownItem: {
      figmaPath: '_dropdown-panel>_dropdown-item',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px', // typescale/text-lg/regular
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgb(64, 96, 114)', // #406072
      textAlign: 'left',
    },
    // Checkbox (in dropdown filter panel)
    // Component: checkbox (19090:74173)
    // State: Unselected - Type=Unselected, State=Default, Size=sm
    checkboxUnselected: {
      figmaPath: '_dropdown-item>checkbox',
      size: '20px', // Small size
      // Additional properties would need detailed checkbox inspection
    },
    // Checkbox Selected State
    // State: Type=Selected, State=Default, Size=sm
    checkboxSelected: {
      figmaPath: '_dropdown-item>checkbox',
      size: '20px',
      // Additional properties would need detailed checkbox inspection
    },
  },

  // LG Viewport (19090-79363) - Large tablet/laptop view
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    headline: {
      text: 'Disclosure details',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgb(16, 56, 79)',
      textAlign: 'left',
    },
    searchInput: {
      placeholder: 'Search',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)',
      textAlign: 'left',
      width: '250px',
      borderColor: 'rgb(202, 213, 226)',
      borderWidth: '0px 0px 1px',
      padding: '16px',
    },
    dropdown: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)',
      padding: '16px',
    },
    tableHeader: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)',
      backgroundColor: 'rgb(241, 245, 249)',
      borderColor: 'rgb(255, 255, 255)',
      borderWidth: '0px 2px 2px 0px',
      padding: '16px 12px',
      gap: '12px',
      textAlign: 'left',
    },
    tableCell: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgb(64, 96, 114)',
      backgroundColor: 'rgb(255, 255, 255)',
      padding: '8px 12px',
      gap: '8px',
      textAlign: 'left',
    },
    paginationNumber: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)',
      padding: '8px 12px',
      textAlign: 'right',
    },
  },

  // MD Viewport (19090-79373) - Tablet view
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    headline: {
      text: 'Disclosure details',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '56px',
      color: 'rgb(16, 56, 79)',
      textAlign: 'left',
    },
    searchInput: {
      placeholder: 'Search',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)',
      textAlign: 'left',
      width: '250px',
      borderColor: 'rgb(202, 213, 226)',
      borderWidth: '0px 0px 1px',
      padding: '16px',
    },
    dropdown: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)',
      padding: '16px',
    },
    tableHeader: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)',
      backgroundColor: 'rgb(241, 245, 249)',
      padding: '16px 12px',
      textAlign: 'left',
    },
    tableCell: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgb(64, 96, 114)',
      padding: '8px 12px',
      textAlign: 'left',
    },
    paginationNumber: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)',
      padding: '8px 12px',
      textAlign: 'right',
    },
  },

  // SM Viewport (19090-79383) - Mobile view (cards instead of table)
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    headline: {
      text: 'Disclosure details',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '30px', // Smaller on mobile
      fontWeight: '700',
      lineHeight: '34.5px',
      color: 'rgb(16, 56, 79)',
      textAlign: 'left',
    },
    searchInput: {
      placeholder: 'Search',
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px', // Smaller on mobile
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)',
      textAlign: 'left',
      width: '100%', // Full width on mobile
      borderColor: 'rgb(202, 213, 226)',
      borderWidth: '0px 0px 1px',
      padding: '16px',
    },
    dropdown: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '16px', // Smaller on mobile
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(96, 113, 139)',
      padding: '16px',
    },
    // On mobile, table becomes card layout
    cardLabel: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '16px',
      color: 'rgb(96, 113, 139)',
      textAlign: 'left',
    },
    cardValue: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)',
      textAlign: 'left',
    },
    paginationNumber: {
      fontFamily: '"Bayer Sans", sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgb(16, 56, 79)',
      padding: '8px 12px',
      textAlign: 'right',
    },
  },
};

/**
 * Helper function to get Figma values by viewport
 * @param viewport - 'xl' | 'lg' | 'md' | 'sm'
 * @returns Figma design values for the specified viewport
 */
export function getValuesByViewport(viewport: 'xl' | 'lg' | 'md' | 'sm') {
  const viewportMap = {
    xl: TransparencyDatagridFigmaValues.XL,
    lg: TransparencyDatagridFigmaValues.LG,
    md: TransparencyDatagridFigmaValues.MD,
    sm: TransparencyDatagridFigmaValues.SM,
  };

  return viewportMap[viewport.toLowerCase() as keyof typeof viewportMap];
}

/**
 * Color palette extracted from Figma
 */
export const TransparencyDatagridColors = {
  primaryText: 'rgb(16, 56, 79)', // #10384F - Headlines, table headers
  secondaryText: 'rgb(96, 113, 139)', // #60718B - Placeholders, input text
  bodyText: 'rgb(64, 96, 114)', // #406072 - Table cell data
  borderColor: 'rgb(202, 213, 226)', // #CAD5E2 - Input borders
  tableBorder: 'rgb(255, 255, 255)', // #FFFFFF - Table cell borders
  tableHeaderBg: 'rgb(241, 245, 249)', // #F1F5F9 - Table header background
  tableCellBg: 'rgb(255, 255, 255)', // #FFFFFF - Table cell background
  iconColor: 'rgb(16, 56, 79)', // #10384F - Filter icons
  scrollbarColor: 'rgb(144, 161, 185)', // #90A1B9 - Scrollbar
};

/**
 * Typography scale extracted from Figma
 */
export const TransparencyDatagridTypography = {
  headlineXL: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '56px',
  },
  headlineSM: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '30px',
    fontWeight: '700',
    lineHeight: '34.5px',
  },
  body: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '28px',
  },
  bodyBold: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '28px',
  },
  input: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '30px',
  },
  inputSM: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '30px',
  },
  label: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
  },
  // Badge typography (filter count indicator) - NEW
  // typescale/text-xs/bold from Figma
  badge: {
    fontFamily: '"Bayer Sans", sans-serif',
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '16px',
  },
};
