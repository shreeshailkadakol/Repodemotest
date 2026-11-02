// Auto-generated from Figma extractor (temp/extract-figma-storylist.ts)
// Source: temp/figma-storylist-raw.json
// Component: Stories List Component (US 3094)
// Figma File: fiKrYZCKNM1OqXHQoGwrlX (Bayer Beyond – Dev Handover)
// Node IDs: XL=20742:150983, LG=20742:151006, MD=20742:151033, SM=20742:151049
//           No-Result variants: XL=20742:151003, LG=20742:151026, MD=20742:151043, SM=20742:151063

export interface StoriesListTypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  background?: string;
  lineHeight?: string;
  elementPath: string;
}

export interface StoriesListViewportValues {
  nodeId: string;
  nodeName: string;
  viewport: { width: number; height: number };
  textElements: {
    discover: StoriesListTypographyStyle;          // Headline plain text "Discover"
    our_latest_stories: StoriesListTypographyStyle; // Highlight gradient span
    search_input: StoriesListTypographyStyle;      // Placeholder text
    search_label: StoriesListTypographyStyle;      // Search field label
    topic_filter: StoriesListTypographyStyle;      // Topic dropdown trigger text
    topic_option: StoriesListTypographyStyle;      // Listbox option text
    story_title: StoriesListTypographyStyle;       // h3 story headline
    tag_chip: StoriesListTypographyStyle;          // Topic Tag chip
    date_text: StoriesListTypographyStyle;         // Story date
  };
}

const xlValues: StoriesListViewportValues = {
  nodeId: '20742:150983',
  nodeName: 'XL / 100 divider',
  viewport: { width: 1440, height: 900 },
  textElements: {
    discover: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      color: 'transparent',
      background: 'linear-gradient(rgba(16, 128, 0, 1) 0%, rgba(0, 117, 166, 1) 100%)',
      lineHeight: '56px',
      elementPath: 'news-list > headline & tags > Headline > Discover',
    },
    our_latest_stories: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '56px',
      elementPath: 'news-list > headline & tags > Headline > our latest Stories',
    },
    search_input: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '30px',
      elementPath: 'news-list > filter > flexible-input > Input Container > Input Text',
    },
    search_label: {
      fontFamily: 'Bayer Sans',
      fontSize: '16px',
      fontWeight: '700',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '24px',
      elementPath: 'news-list > filter > flexible-input > Label',
    },
    topic_filter: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '30px',
      elementPath: 'news-list > filter > dropdown > Input Container > Input Text',
    },
    topic_option: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '20px',
      elementPath: 'news-list > filter > dropdown > _SelctionListOverlay > Selection item',
    },
    story_title: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '36px',
      elementPath: 'news-list > news list > content > maincontent > kicker-title (title)',
    },
    tag_chip: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '500',
      color: 'rgba(14, 104, 1, 1)',
      lineHeight: '16px',
      elementPath: 'news-list > news list > content > maincontent > tags > tag > Topic Tag',
    },
    date_text: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '20px',
      elementPath: 'news-list > news list > content > subcontent > date',
    },
  },
};

const lgValues: StoriesListViewportValues = {
  nodeId: '20742:151006',
  nodeName: 'LG / 100 divider',
  viewport: { width: 1024, height: 800 },
  textElements: {
    ...xlValues.textElements,
    story_title: {
      ...xlValues.textElements.story_title,
      fontSize: '24px',
      lineHeight: '30px',
    },
  },
};

const mdValues: StoriesListViewportValues = {
  nodeId: '20742:151033',
  nodeName: 'MD / default',
  viewport: { width: 768, height: 1024 },
  textElements: {
    discover: {
      ...xlValues.textElements.discover,
      fontSize: '30px',
      lineHeight: '36px',
    },
    our_latest_stories: {
      ...xlValues.textElements.our_latest_stories,
      fontSize: '30px',
      lineHeight: '36px',
    },
    search_input: {
      ...xlValues.textElements.search_input,
      fontSize: '16px',
      lineHeight: '24px',
    },
    search_label: { ...xlValues.textElements.search_label },
    topic_filter: { ...xlValues.textElements.topic_filter },
    topic_option: { ...xlValues.textElements.topic_option },
    story_title: {
      ...xlValues.textElements.story_title,
      fontSize: '20px',
      lineHeight: '30px',
    },
    tag_chip: { ...xlValues.textElements.tag_chip },
    date_text: {
      ...xlValues.textElements.date_text,
      fontSize: '16px',
      lineHeight: '20px',
    },
  },
};

const smValues: StoriesListViewportValues = {
  nodeId: '20742:151049',
  nodeName: 'SM / 100 divider',
  viewport: { width: 375, height: 667 },
  textElements: {
    ...mdValues.textElements,
    topic_filter: {
      ...mdValues.textElements.topic_filter,
      fontSize: '16px',
      color: 'rgba(16, 56, 79, 1)',
      lineHeight: '24px',
    },
  },
};

export const StoriesListComponentFigmaValues: Record<'xl' | 'lg' | 'md' | 'sm', StoriesListViewportValues> = {
  xl: xlValues,
  lg: lgValues,
  md: mdValues,
  sm: smValues,
};

// No-result state typography reference (same family/weight as story_title in each viewport).
// Currently the FE message text/data-qa is unconfirmed; tests use a tolerant locator.
export const StoriesListNoResultFigmaNodes = {
  xl: '20742:151003',
  lg: '20742:151026',
  md: '20742:151043',
  sm: '20742:151063',
};
