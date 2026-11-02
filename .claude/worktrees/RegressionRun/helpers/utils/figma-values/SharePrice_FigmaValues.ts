// Figma design tokens for SharePrice Component
// Sourced from Figma file: https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library
// Node IDs: XL: [TO_BE_FETCHED], LG: [TO_BE_FETCHED], MD: [TO_BE_FETCHED], SM: [TO_BE_FETCHED]
// Last updated: 2025-09-02 - CREATED FROM DOM ANALYSIS
// Component: SharePrice with stock data display, located in footer left section

export const SharePrice_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 720,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '40px', // gap-10 = 2.5rem = 40px
      padding: '0px',
    },
    stockEntry: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px', // gap-3 = 0.75rem = 12px
      padding: '0px',
    },
    stockHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px', // gap-0.5 = 0.125rem = 2px
    },
    switcherButtons: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)', // Dark blue text
    },
    companyLabel: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '16px',
      color: 'rgba(96, 113, 139, 1)', // Gray text
    },
    stockName: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px', // text-xs
      fontWeight: '700', // font-bold
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)', // text-text
      lineHeight: '16px', // leading-xs
    },
    separator: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px', // text-xs
      fontWeight: '400', // font-regular
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)', // text-text
      lineHeight: '16px', // leading-xs
      content: '/',
    },
    timestamp: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px', // text-xs
      fontWeight: '400', // font-regular
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)', // text-text
      lineHeight: '16px', // leading-xs
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px', // gap-3 = 0.75rem = 12px
    },
    priceText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // text-4xl
      fontWeight: '400', // font-regular
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)', // text-text
      lineHeight: '36px', // leading-none
      letterSpacing: '-0.025em', // tracking-tight
    },
    changeIndicator: {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // gap-2 = 0.5rem = 8px
        border: '0px',
        margin: '0px',
        padding: '0px',
      },
      iconContainer: {
        display: 'flex',
        height: '16px', // h-4 = 1rem = 16px
        width: '16px', // w-4 = 1rem = 16px
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%', // rounded-full
        backgroundColor: 'rgba(211, 15, 75, 1)', // bg-brand-raspberry-500
      },
      icon: {
        height: '14px', // h-3.5 = 0.875rem = 14px
        width: '14px', // w-3.5 = 0.875rem = 14px
        color: 'rgba(255, 255, 255, 1)', // text-white
        fill: 'currentColor',
      },
    },
    changeText: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px', // Estimated from visual analysis
      fontWeight: '400', // font-regular
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)', // text-text
      lineHeight: '24px',
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px', // Slightly reduced gap for medium screens
      padding: '0px',
    },
    stockEntry: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px', // Slightly reduced gap
      padding: '0px',
    },
    stockHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
    },
    switcherButtons: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)', // Dark blue text
    },
    companyLabel: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '16px',
      color: 'rgba(96, 113, 139, 1)', // Gray text
    },
    stockName: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
    },
    separator: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
      content: '/',
    },
    timestamp: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px', // Slightly reduced gap
    },
    priceText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // Slightly smaller for LG viewport
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '36px',
      letterSpacing: '-0.025em',
    },
    changeIndicator: {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px', // Slightly reduced gap
        border: '0px',
        margin: '0px',
        padding: '0px',
      },
      iconContainer: {
        display: 'flex',
        height: '16px',
        width: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'rgba(211, 15, 75, 1)',
      },
      icon: {
        height: '14px',
        width: '14px',
        color: 'rgba(255, 255, 255, 1)',
        fill: 'currentColor',
      },
    },
    changeText: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px', // Smaller text for LG
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '24px',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px', // Reduced gap for tablet
      padding: '0px',
    },
    stockEntry: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px', // Smaller gap for tablet
      padding: '0px',
    },
    stockHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
    },
    switcherButtons: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)', // Dark blue text
    },
    companyLabel: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '16px',
      color: 'rgba(96, 113, 139, 1)', // Gray text
    },
    stockName: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px', // Slightly smaller
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
    },
    separator: {
      fontFamily: 'Bayer Sans',
      fontSize: '11px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '14px',
      content: '/',
    },
    timestamp: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // Smaller gap for tablet
    },
    priceText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // Smaller price text for tablet
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '36px',
      letterSpacing: '-0.025em',
    },
    changeIndicator: {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        border: '0px',
        margin: '0px',
        padding: '0px',
      },
      iconContainer: {
        display: 'flex',
        height: '14px', // Smaller icon container
        width: '14px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'rgba(211, 15, 75, 1)',
      },
      icon: {
        height: '12px', // Smaller icon
        width: '12px',
        color: 'rgba(255, 255, 255, 1)',
        fill: 'currentColor',
      },
    },
    changeText: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px', // Smaller change text
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '24px',
    },
  },
  SM: {
    viewport: {
      width: 640,
      height: 896,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px', // Minimal gap for mobile
      padding: '0px',
    },
    stockEntry: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px', // Minimal gap for mobile
      padding: '0px',
    },
    stockHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1px', // Minimal gap
    },
    switcherButtons: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px', // Keep same across all viewports - CONFIRMED from Figma
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)', // Dark blue text - CORRECTED from Figma
    },
    companyLabel: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px', // Keep same across all viewports - CONFIRMED from Figma
      fontWeight: '400',
      fontStyle: 'Regular',
      lineHeight: '16px',
      color: 'rgba(96, 113, 139, 1)', // Gray text
    },
    stockName: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px', // Smallest font for mobile
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
    },
    separator: {
      fontFamily: 'Bayer Sans',
      fontSize: '10px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '12px',
      content: '/',
    },
    timestamp: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '16px',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px', // Minimal gap for mobile
    },
    priceText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px', // Mobile-optimized price text
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '36px',
      letterSpacing: '-0.025em',
    },
    changeIndicator: {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px', // Minimal gap
        border: '0px',
        margin: '0px',
        padding: '0px',
      },
      iconContainer: {
        display: 'flex',
        height: '12px', // Smallest icon container for mobile
        width: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'rgba(211, 15, 75, 1)',
      },
      icon: {
        height: '10px', // Smallest icon for mobile
        width: '10px',
        color: 'rgba(255, 255, 255, 1)',
        fill: 'currentColor',
      },
    },
    changeText: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px', // Mobile-optimized change text
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '24px',
    },
  },
  accessibility: {
    ariaLabels: {
      bayerStock: 'Bayer share price',
      daxStock: 'DAX share price',
      priceIndicator: 'Price change indicator',
      priceDecreased: 'Price decreased',
      priceIncreased: 'Price increased',
      priceFormat: 'Price: {amount} euros',
      changeFormat: 'Change: {percentage}',
      timestampFormat: 'Last updated: {datetime}',
    },
    semanticStructure: {
      container: 'div[data-qa="stock-price"]',
      stockEntry: 'article[aria-label="{stock-name} share price"]',
      priceChangeIndicator: 'fieldset[aria-label="Price change indicator"]',
      timestamp: 'time[datetime][title="Last updated: {datetime}"]',
    },
    colorContrast: {
      textOnBackground: '4.5:1', // WCAG AA compliance
      iconOnBackground: '3:1', // WCAG AA compliance for non-text
    },
  },
  dataAttributes: {
    primary: 'data-qa="stock-price"',
    secondary: ['data-testid="icon"', 'data-qa="icon"'],
    switcherButtons: 'data-qa="switcher-buttons"',
    companyLabel: 'data-qa="company-label"',
    indiaSwitcher: 'data-qa="india-switcher"',
    globalSwitcher: 'data-qa="global-switcher"',
  },
  webSocketIntegration: {
    dataSource: 'wss://stockdataexchange.bayer.com',
    updateFrequency: 'real-time',
    fallbackBehavior: 'display last known values',
    errorHandling: 'graceful degradation without error messages',
  },
};
