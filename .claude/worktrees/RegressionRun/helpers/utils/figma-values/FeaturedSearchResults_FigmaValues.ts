// Auto-generated from Figma API extraction
// Generated on: 2026-04-28
// Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=4528-158561
// Node IDs: XL: 4528:158564, LG: 4528:158570, MD: 4528:158566, SM: 4528:158568
// Component: Featured Search Results
// User Story: 1651

export interface FeaturedSearchResultsTypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
  letterSpacing?: string;
  textCase?: string;
}

export interface FeaturedSearchResultsViewportValues {
  nodeId: string;
  nodeName: string;
  viewport: {
    width: number;
    height: number;
  };
  resultsCount: FeaturedSearchResultsTypographyStyle;
  featuredResultsHeading: FeaturedSearchResultsTypographyStyle;
  filterResults: FeaturedSearchResultsTypographyStyle;
  sortByText: FeaturedSearchResultsTypographyStyle;
  topicTag: FeaturedSearchResultsTypographyStyle;
  teaserTitle: FeaturedSearchResultsTypographyStyle;
  teaserSubtitle: FeaturedSearchResultsTypographyStyle;
  paginationActive: FeaturedSearchResultsTypographyStyle;
  paginationInactive: FeaturedSearchResultsTypographyStyle;
  layout: {
    searchGroupGap: number;
    featuredResultPadding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    featuredResultGap: number;
    teaserItemGap: number;
    contentGap: number;
    tagsGap: number;
    paginationGap: number;
    paginationContainerGap: number;
  };
}

export const FeaturedSearchResultsFigmaValues: Record<string, FeaturedSearchResultsViewportValues> = {
  // XL viewport (1440px) - Node: 4528:158564
  XL: {
    nodeId: '4528:158564',
    nodeName: 'Search Group',
    viewport: {
      width: 1440,
      height: 900,
    },
    resultsCount: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
      color: 'rgba(16, 56, 79, 1)',
    },
    featuredResultsHeading: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    filterResults: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    sortByText: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    topicTag: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '16px',
      color: 'rgba(14, 104, 1, 1)',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
    },
    teaserTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    teaserSubtitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
    },
    paginationActive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    paginationInactive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    layout: {
      searchGroupGap: 32,
      featuredResultPadding: {
        top: 32,
        right: 32,
        bottom: 32,
        left: 32,
      },
      featuredResultGap: 32,
      teaserItemGap: 32,
      contentGap: 12,
      tagsGap: 10,
      paginationGap: 20,
      paginationContainerGap: 16,
    },
  },

  // LG viewport (1024px) - Node: 4528:158570
  LG: {
    nodeId: '4528:158570',
    nodeName: 'Search Group',
    viewport: {
      width: 1024,
      height: 800,
    },
    resultsCount: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
      color: 'rgba(16, 56, 79, 1)',
    },
    featuredResultsHeading: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    filterResults: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    sortByText: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    topicTag: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '16px',
      color: 'rgba(14, 104, 1, 1)',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
    },
    teaserTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    teaserSubtitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
    },
    paginationActive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    paginationInactive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    layout: {
      searchGroupGap: 32,
      featuredResultPadding: {
        top: 32,
        right: 32,
        bottom: 32,
        left: 32,
      },
      featuredResultGap: 32,
      teaserItemGap: 32,
      contentGap: 12,
      tagsGap: 10,
      paginationGap: 20,
      paginationContainerGap: 16,
    },
  },

  // MD viewport (768px) - Node: 4528:158566
  MD: {
    nodeId: '4528:158566',
    nodeName: 'Search Group',
    viewport: {
      width: 768,
      height: 1024,
    },
    resultsCount: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
      color: 'rgba(16, 56, 79, 1)',
    },
    featuredResultsHeading: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    filterResults: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)',
    },
    sortByText: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)',
    },
    topicTag: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '16px',
      color: 'rgba(14, 104, 1, 1)',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
    },
    teaserTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    teaserSubtitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
    },
    paginationActive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    paginationInactive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    layout: {
      searchGroupGap: 32,
      featuredResultPadding: {
        top: 32,
        right: 20,
        bottom: 32,
        left: 20,
      },
      featuredResultGap: 32,
      teaserItemGap: 16,
      contentGap: 20,
      tagsGap: 10,
      paginationGap: 20,
      paginationContainerGap: 12,
    },
  },

  // SM viewport (375px) - Node: 4528:158568
  SM: {
    nodeId: '4528:158568',
    nodeName: 'Search Group',
    viewport: {
      width: 375,
      height: 667,
    },
    resultsCount: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      lineHeight: '36px',
      color: 'rgba(16, 56, 79, 1)',
    },
    featuredResultsHeading: {
      fontFamily: 'Bayer Sans',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      color: 'rgba(16, 56, 79, 1)',
    },
    filterResults: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)',
    },
    sortByText: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      color: 'rgba(16, 56, 79, 1)',
    },
    topicTag: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '16px',
      color: 'rgba(14, 104, 1, 1)',
      letterSpacing: '0.4000000059604645px',
      textCase: 'UPPER',
    },
    teaserTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    teaserSubtitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(64, 96, 114, 1)',
    },
    paginationActive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    paginationInactive: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '28px',
      color: 'rgba(16, 56, 79, 1)',
    },
    layout: {
      searchGroupGap: 24,
      featuredResultPadding: {
        top: 32,
        right: 20,
        bottom: 32,
        left: 20,
      },
      featuredResultGap: 32,
      teaserItemGap: 16,
      contentGap: 20,
      tagsGap: 10,
      paginationGap: 20,
      paginationContainerGap: 12,
    },
  },
};
