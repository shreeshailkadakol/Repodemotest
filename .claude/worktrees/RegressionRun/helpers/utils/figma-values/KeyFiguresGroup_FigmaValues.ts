// Key Figures Group Component Figma Design Values
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=6227-65662
// Component: Key Figures Group
// User Story: #2058
// Test Page: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint12/keyfiguregroup
// Generated: February 25, 2026
// XL Node ID: 6227-65727 | LG Node ID: 6227-65708 | MD Node ID: 6227-65687 | SM Node ID: 6227-65664

export const KeyFiguresGroupFigmaValues = {
  // XL Viewport Design Specifications (node-id: 6227-65727)
  XL: {
    viewport: {
      width: 1440,
      height: 900,
    },
    // Container for the entire Key Figures Group
    container: {
      element: 'section',
      dataQa: 'key-figures-group',
      dataTestId: 'key-figures-group',
      display: 'flex',
      width: '100%',
      nodeId: '6227-65727',
    },
    // Individual Key Figure Typography (same as Individual Key Figure component)
    // Number typography (e.g., "500", "95", "12")
    numberTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '72px', // 7xl
      fontWeight: '400',
      lineHeight: '72px',
      color: 'rgb(16, 56, 79)', // Primary text color
      textAlign: 'left',
      display: 'inline',
    },
    // Unit/suffix typography (e.g., "k+", "%", "Mio.")
    unitTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px', // 3xl
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgb(16, 56, 79)', // Primary text color
      textAlign: 'left',
      display: 'inline',
    },
    // Description/fact text typography
    descriptionTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgb(64, 96, 114)', // Secondary text color
      textAlign: 'left',
      display: 'block',
      marginTop: '8px',
    },
    // Layout and spacing for the group
    layout: {
      contentDivider: '100%', // Full-width column placement (AC3)
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '32px', // Spacing between individual key figures
      padding: {
        top: '80px',
        right: '80px',
        bottom: '80px',
        left: '80px',
      },
      margin: {
        top: '0px',
        bottom: '0px',
      },
    },
    // Individual key figure wrapper
    keyFigureWrapper: {
      dataTestId: 'key-figure-wrapper-{index}', // {index} = 0, 1, or 2
      flex: '1',
      minWidth: '0',
    },
    // Spacing
    spacing: {
      betweenKeyFigures: '32px',
      componentSpacing: '32px',
      textSpacing: '0px',
    },
  },

  // LG Viewport Design Specifications (node-id: 6227-65708)
  LG: {
    viewport: {
      width: 1024,
      height: 800,
    },
    // Container for the entire Key Figures Group
    container: {
      element: 'section',
      dataQa: 'key-figures-group',
      dataTestId: 'key-figures-group',
      display: 'flex',
      width: '100%',
      nodeId: '6227-65708',
    },
    // Individual Key Figure Typography (same as XL)
    numberTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '72px', // 7xl
      fontWeight: '400',
      lineHeight: '72px',
      color: 'rgba(16, 56, 79, 1)',
      textAlign: 'left',
      display: 'inline',
    },
    unitTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '400',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
      textAlign: 'left',
      display: 'inline',
    },
    descriptionTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
      textAlign: 'left',
      display: 'block',
      marginTop: '8px',
    },
    // Layout and spacing for the group (similar to XL with adjusted padding)
    layout: {
      contentDivider: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '24px', // Slightly reduced gap for smaller viewport
      padding: {
        top: '60px',
        right: '60px',
        bottom: '60px',
        left: '60px',
      },
      margin: {
        top: '0px',
        bottom: '0px',
      },
    },
    keyFigureWrapper: {
      dataTestId: 'key-figure-wrapper-{index}',
      flex: '1',
      minWidth: '0',
    },
    spacing: {
      betweenKeyFigures: '24px',
      componentSpacing: '24px',
      textSpacing: '0px',
    },
  },

  // MD Viewport Design Specifications (node-id: 6227-65687)
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    container: {
      element: 'section',
      dataQa: 'key-figures-group',
      dataTestId: 'key-figures-group',
      display: 'flex',
      width: '100%',
      nodeId: '6227-65687',
    },
    // Typography adjusted for MD viewport
    numberTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px', // 5xl (responsive reduction)
      fontWeight: '400',
      lineHeight: '60px',
      color: 'rgba(16, 56, 79, 1)',
      textAlign: 'left',
      display: 'inline',
    },
    unitTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: '24px',
      color: 'rgba(16, 56, 79, 1)',
      textAlign: 'left',
      display: 'inline',
    },
    descriptionTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      color: 'rgba(64, 96, 114, 1)',
      textAlign: 'left',
      display: 'block',
      marginTop: '6px',
    },
    // Layout may switch to column on MD viewport
    layout: {
      contentDivider: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack vertically on MD
      justifyContent: 'flex-start',
      gap: '32px',
      padding: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px',
      },
      margin: {
        top: '0px',
        bottom: '0px',
      },
    },
    keyFigureWrapper: {
      dataTestId: 'key-figure-wrapper-{index}',
      width: '100%',
    },
    spacing: {
      betweenKeyFigures: '32px',
      componentSpacing: '32px',
      textSpacing: '0px',
    },
  },

  // SM Viewport Design Specifications (node-id: 6227-65664)
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    container: {
      element: 'section',
      dataQa: 'key-figures-group',
      dataTestId: 'key-figures-group',
      display: 'flex',
      width: '100%',
      nodeId: '6227-65664',
    },
    // Typography adjusted for SM viewport
    numberTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px', // 5xl
      fontWeight: '400',
      lineHeight: '60px',
      color: 'rgba(16, 56, 79, 1)',
      textAlign: 'left',
      display: 'inline',
    },
    unitTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: '24px',
      color: 'rgba(16, 56, 79, 1)',
      textAlign: 'left',
      display: 'inline',
    },
    descriptionTypography: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      color: 'rgba(64, 96, 114, 1)',
      textAlign: 'left',
      display: 'block',
      marginTop: '6px',
    },
    // Layout stacked vertically on SM
    layout: {
      contentDivider: '100%',
      display: 'flex',
      flexDirection: 'column', // Stack vertically on SM
      justifyContent: 'flex-start',
      gap: '20px',
      padding: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      margin: {
        top: '0px',
        bottom: '0px',
      },
    },
    keyFigureWrapper: {
      dataTestId: 'key-figure-wrapper-{index}',
      width: '100%',
    },
    spacing: {
      betweenKeyFigures: '20px',
      componentSpacing: '20px',
      textSpacing: '0px',
    },
  },

  

  // Component Properties
  
};
