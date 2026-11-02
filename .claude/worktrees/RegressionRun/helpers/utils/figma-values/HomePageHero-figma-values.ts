// Auto-generated from Universal Figma Typography Extractor
// Generated on: 2025-11-05T09:27:49.151Z
// Node IDs: 5347:3492, 5347:3493, 5347:3494, 5347:3495

export const HomePageHeroFigmaValues = {
  // XL viewport (1440x900) - Node: 5347:3492
  xl: {
    nodeId: '5347:3492',
    nodeName: 'Homepage Hero',
    viewport: {
      width: 1440,
      height: 900,
    },
    textElements: {
      health_for_all_hunger_for_no: {
        textContent: 'Health for all, \nHunger for none',
        fontFamily: 'Bayer Sans',
        fontSize: '96px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '112px',
        elementPath: 'Homepage Hero > Headline/Pillnavigation > Slogan Text',
      },
      scroll_down: {
        textContent: 'Scroll down',
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // Correct Figma design specification
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '21px', // Correct calculated value: 14px * 1.1852
        elementPath:
          'Homepage Hero > Headline/Pillnavigation > pillnavigation > scroll jumper > Scroll down',
      },
    },
  },

  // LG viewport (1024x782) - Node: 5347:3493
  lg: {
    nodeId: '5347:3493',
    nodeName: 'Homepage Hero',
    viewport: {
      width: 1024,
      height: 782,
    },
    textElements: {
      health_for_all_hunger_for_no: {
        textContent: 'Health for all, \nHunger for none',
        fontFamily: 'Bayer Sans',
        fontSize: '72px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '80px', // Your correct Figma-based value
        elementPath: 'Homepage Hero > Headline/Pillnavigation > Slogan Text',
      },
      scroll_down: {
        textContent: 'Scroll down',
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // Correct Figma design specification
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '21px', // Correct calculated value: 14px * 1.1852
        elementPath:
          'Homepage Hero > Headline/Pillnavigation > pillnavigation > scroll jumper > Scroll down',
      },
    },
  },

  // MD viewport (768x782) - Node: 5347:3494
  md: {
    nodeId: '5347:3494',
    nodeName: 'Homepage Hero',
    viewport: {
      width: 768,
      height: 782,
    },
    textElements: {
      health_for_all_hunger_for_no: {
        textContent: 'Health for all, \nHunger for none',
        fontFamily: 'Bayer Sans',
        fontSize: '60px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '70px', // Your correct Figma-based value
        elementPath: 'Homepage Hero > Headline/Pillnavigation > Slogan Text',
      },
      menu: {
        textContent: 'Menu',
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '400',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '15.80px', // Calculated: 16px * 0.9877 = 15.80px
        elementPath:
          'Homepage Hero > Headline/Pillnavigation > pillnavigation > main_menu > menuItem > mission statement > Science for a better life',
      },
      scroll_down: {
        textContent: 'Scroll down',
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // Correct Figma design specification
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '21px', // Correct calculated value: 14px * 1.1852
        elementPath:
          'Homepage Hero > Headline/Pillnavigation > pillnavigation > scroll jumper > Scroll down',
      },
    },
  },

  // SM viewport (375x782) - Node: 5347:3495
  sm: {
    nodeId: '5347:3495',
    nodeName: 'Homepage Hero',
    viewport: {
      width: 375,
      height: 782,
    },
    textElements: {
      health_for_all_hunger_for_no: {
        textContent: 'Health for all, \nHunger for none',
        fontFamily: 'Bayer Sans',
        fontSize: '48px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '56px', // Your correct Figma-based value
        elementPath: 'Homepage Hero > Slogan Text',
      },
      menu: {
        textContent: 'Menu',
        fontFamily: 'Bayer Sans',
        fontSize: '16px',
        fontWeight: '700',
        fontStyle: 'Bold',
        color: 'rgba(16, 56, 79, 1)',
        lineHeight: '15.80px', // Calculated: 16px * 0.9877 = 15.80px
        elementPath:
          'Homepage Hero > pillnavigation > main_menu > menuItem > menu > Science for a better life',
      },
      scroll_down: {
        textContent: 'Scroll down',
        fontFamily: 'Bayer Sans',
        fontSize: '14px', // Correct Figma design specification
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 1)',
        lineHeight: '21px', // Correct calculated value: 14px * 1.1852
        elementPath: 'Homepage Hero > pillnavigation > scroll jumper > Scroll down',
      },
    },
  },
};

export const xlValues = HomePageHeroFigmaValues.xl;
export const lgValues = HomePageHeroFigmaValues.lg;
export const mdValues = HomePageHeroFigmaValues.md;
export const smValues = HomePageHeroFigmaValues.sm;

export function getValuesByViewport(viewport: 'xl' | 'lg' | 'md' | 'sm') {
  return HomePageHeroFigmaValues[viewport];
}
