// Auto-generated from Figma API - Tabbed Content Component (Story 683)
// Figma file: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX
// Source nodes: XL=21949-7554 (tab-row spec), LG=21949-7566, MD=21949-7600, SM=21949-7641
// Component sets: tab-row (21949:6920), tab-item (21949:6793 - State=Active/Default, Theme=light)
// Tab typography (text-lg/regular) is consistent across XL/LG/MD/SM (confirmed via live DOM).
// Colors stored as rgba() because normalizeCssColor() does not convert hex.
// Last verified: 2026-07-22

export const TabbedComponent_FigmaValues = {
  colors: {
    // Inactive tab text + default navy
    textPrimary: 'rgba(16,56,79,1)', // #10384F
    // Active tab
    activeText: 'rgba(255,255,255,1)', // #FFFFFF
    activeBackground: 'rgba(16,56,79,1)', // #10384F (filled navy highlight)
    activeBorder: 'rgba(255,49,98,1)', // #FF3162 (red bottom border)
    // Inactive tab background
    inactiveBackground: 'rgba(248,250,252,1)', // #F8FAFC
  },

  // Tab label typography - text-lg/regular, same at all viewports
  tabText: {
    XL: { fontFamily: 'Bayer Sans', fontSize: '18px', fontWeight: '400', lineHeight: '28px' },
    LG: { fontFamily: 'Bayer Sans', fontSize: '18px', fontWeight: '400', lineHeight: '28px' },
    MD: { fontFamily: 'Bayer Sans', fontSize: '18px', fontWeight: '400', lineHeight: '28px' },
    SM: { fontFamily: 'Bayer Sans', fontSize: '18px', fontWeight: '400', lineHeight: '28px' },
  },

  tabItem: {
    // padding 16px 24px (py-4 px-6), gap between label and optional icon
    padding: '16px 24px',
    gap: '8px',
    // Active tab bottom border weight (Figma strokeWeight 0px 0px 2px)
    activeBorderBottomWidth: '2px',
  },

  tabList: {
    // gap between tabs, trailing right padding for scroll affordance
    gap: '2px',
    paddingRight: '80px',
  },

  layout: {
    // gap between tab row and content panel (tabbed-component flex gap-8)
    tabRowToContentGap: '32px',
  },

  nodeIds: {
    XL: '21949-7554',
    LG: '21949-7566',
    MD: '21949-7600',
    SM: '21949-7641',
  },
};
