/**
 * Automated Events List - Figma design tokens (story 1582).
 *
 * Source: Figma file fiKrYZCKNM1OqXHQoGwrlX, "Events List" frames:
 *   XL = 26327-72089 (1440px)
 *   LG = 26327-72126 (1024px)
 *   MD = 26327-72162 (768px)
 *   SM = 26327-72196 (375px)
 *
 * Values are pulled DIRECTLY from the Figma nodes (Figma REST API, no guessing).
 * Tests treat undefined fields as "no Figma value -> do not assert". Colors use the
 * framework rgba() convention. Per-viewport variation captured where the design differs:
 * headline, event title, day-tag (day number + month) and meta row scale DOWN at MD/SM
 * (XL/LG use the larger sizing; MD/SM the smaller). Verified per frame via the Figma REST API.
 *
 * `dateBlockMaxWidth` is the requirement-specified constraint (story 1582:
 * "Simple date ... - max width=102px"), asserted as an upper bound in TC-VEL002.
 */
export type ViewportName = 'XL' | 'LG' | 'MD' | 'SM';

export interface FigmaTextTokens {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  color?: string;
  backgroundColor?: string;
}

export interface FigmaLayoutTokens {
  dateBlockMaxWidth?: string; // requirement: date/day-tag block max width
}

export interface FigmaViewportTokens {
  viewport: { width: number };
  componentTitle: FigmaTextTokens; // component headline "Our next Events" (h2)
  pastEventsButton: FigmaTextTokens; // "Past Events" / "Future Events" toggle label
  yearHeader: FigmaTextTokens; // year grouping header "2026"
  eventTitle: FigmaTextTokens; // per-event title (h2)
  dayNumber: FigmaTextTokens; // day number e.g. "04"
  monthLabel: FigmaTextTokens; // month abbreviation e.g. "JUN"
  yearLabel: FigmaTextTokens; // year inside the day-tag e.g. "2026"
  metaTag: FigmaTextTokens; // date/location meta row text
  tagChip: FigmaTextTokens; // classification tag chip
  addToCalendar: FigmaTextTokens; // "Add to Calendar" label
  paginationNumber: FigmaTextTokens; // pagination number (design shows it; may be absent per instance)
  layout: FigmaLayoutTokens;
}

const BAYER_SANS = 'Bayer Sans';
const COLOR_DARK_BLUE = 'rgba(16,56,79,1)'; // #10384F  title/day/button
const COLOR_RED = 'rgba(211,15,75,1)'; // #D30F4B  month
const COLOR_SLATE = 'rgba(64,96,114,1)'; // #406072  day-tag year
const COLOR_META = 'rgba(96,113,139,1)'; // #60718B  meta row (date/location) + year header
const COLOR_TAG_TEXT = 'rgba(14,104,1,1)'; // #0E6801  tag text

// Tokens shared across all viewports.
const pastEventsButton: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: COLOR_DARK_BLUE,
};
const yearHeader: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '20px',
  lineHeight: '30px',
  color: COLOR_META,
};
const yearLabel: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: COLOR_SLATE,
};
// Meta row (date/location) scales by breakpoint: XL/LG = 18px/28px, MD/SM = 14px/20px.
const metaTagLarge: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '28px',
  color: COLOR_META,
};
const metaTagSmall: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: COLOR_META,
};
const tagChip: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.40px',
  color: COLOR_TAG_TEXT,
};
const addToCalendar: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: COLOR_DARK_BLUE,
};
const paginationNumber: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '28px',
  color: COLOR_DARK_BLUE,
};
const layout: FigmaLayoutTokens = { dateBlockMaxWidth: '102px' };

// Day-tag scales by breakpoint: XL/LG use the large sizing, MD/SM the small sizing.
const dayNumberLarge: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '48px',
  lineHeight: '56px',
  color: COLOR_DARK_BLUE,
};
const dayNumberSmall: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '30px',
  lineHeight: '36px',
  color: COLOR_DARK_BLUE,
};
const monthLabelLarge: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: COLOR_RED,
};
const monthLabelSmall: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '16px',
  color: COLOR_RED,
};

export const EventList_FigmaValues: Record<ViewportName, FigmaViewportTokens> = {
  XL: {
    viewport: { width: 1440 },
    componentTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '56px',
      color: COLOR_DARK_BLUE,
    },
    pastEventsButton,
    yearHeader,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '36px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber: dayNumberLarge,
    monthLabel: monthLabelLarge,
    yearLabel,
    metaTag: metaTagLarge,
    tagChip,
    addToCalendar,
    paginationNumber,
    layout,
  },
  LG: {
    viewport: { width: 1024 },
    componentTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '56px',
      color: COLOR_DARK_BLUE,
    },
    pastEventsButton,
    yearHeader,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '36px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber: dayNumberLarge,
    monthLabel: monthLabelLarge,
    yearLabel,
    metaTag: metaTagLarge,
    tagChip,
    addToCalendar,
    paginationNumber,
    layout,
  },
  MD: {
    viewport: { width: 768 },
    componentTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '36px',
      color: COLOR_DARK_BLUE,
    },
    pastEventsButton,
    yearHeader,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: '30px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber: dayNumberSmall,
    monthLabel: monthLabelSmall,
    yearLabel,
    metaTag: metaTagSmall,
    tagChip,
    addToCalendar,
    paginationNumber,
    layout,
  },
  SM: {
    viewport: { width: 375 },
    componentTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '36px',
      color: COLOR_DARK_BLUE,
    },
    pastEventsButton,
    yearHeader,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: '30px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber: dayNumberSmall,
    monthLabel: monthLabelSmall,
    yearLabel,
    metaTag: metaTagSmall,
    tagChip,
    addToCalendar,
    paginationNumber,
    layout,
  },
};

export function getValuesByViewport(viewport: string): FigmaViewportTokens {
  const key = viewport.toUpperCase() as ViewportName;
  const tokens = EventList_FigmaValues[key];
  if (!tokens) {
    throw new Error(`No Figma values for viewport "${viewport}". Expected one of: XL, LG, MD, SM.`);
  }
  return tokens;
}
