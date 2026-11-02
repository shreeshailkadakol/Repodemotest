/**
 * Curated Events Teaser Group - Figma design tokens (story 1581).
 *
 * SOURCING NOTE (important): Story 1581 states the Curated Events Teaser Group "uses the same
 * compact teaser design as the automated variant". These tokens are therefore DERIVED from the
 * verified automated-variant file `EventsTeaserGroup_FigmaValues.ts` (story 3548), which was pulled
 * directly from Figma nodes. They are NOT re-fetched from the curated Figma nodes because the Figma
 * MCP was unavailable (403) at authoring time.
 *
 * Curated Figma reference (to confirm when MCP access is restored):
 *   file fiKrYZCKNM1OqXHQoGwrlX, "Curated Events Teaser Group"
 *   XL = 19519-47564 | LG = 19519-47598 | MD = 19519-47656 | SM = 19519-47632
 *
 * Layout difference vs automated variant: the curated items wrapper is a CSS grid
 * (`grid-cols-1 lg:grid-cols-2`, gap 32px), not a flex row. The `itemsGridGap` layout token below
 * reflects this. Per-event internal tokens (day/month/year, tag chip, titles, add-to-calendar) are
 * the shared compact-teaser tokens.
 *
 * Values treat undefined fields as "no Figma value -> do not assert". Colors use the framework
 * rgba() convention.
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
  framePadding?: string;
  containerGap?: string; // gap between group title and items wrapper
  itemsGridGap?: string; // gap between event items in the grid
  itemGap?: string; // gap inside an event-list-item (day-tag <-> content)
  contentGap?: string; // gap inside the content column (tags/title/actions)
  tagGap?: string; // gap between tag chips
  headlineGap?: string; // gap between title text and overview link in the header
  dayTagWidth?: string; // fixed width of the date/day-tag block
}

export interface FigmaViewportTokens {
  viewport: { width: number };
  groupTitle: FigmaTextTokens; // group "Title" headline (h2)
  overviewLink: FigmaTextTokens; // "OVERVIEW" link (when configured)
  eventTitle: FigmaTextTokens; // per-event title (h2)
  dayNumber: FigmaTextTokens; // day number e.g. "09"
  monthLabel: FigmaTextTokens; // month abbreviation e.g. "Jul"
  yearLabel: FigmaTextTokens; // year e.g. "2026"
  tagChip: FigmaTextTokens; // classification tag chip
  addToCalendar: FigmaTextTokens; // "Add to Calendar" label
  layout: FigmaLayoutTokens;
}

const BAYER_SANS = 'Bayer Sans';
const COLOR_DARK_BLUE = 'rgba(16,56,79,1)'; // #10384F
const COLOR_RED = 'rgba(211,15,75,1)'; // #D30F4B  month
const COLOR_SLATE = 'rgba(64,96,114,1)'; // #406072  year
const COLOR_TAG_TEXT = 'rgba(14,104,1,1)'; // #0E6801  tag text
const COLOR_TAG_BG = 'rgba(236,248,221,1)'; // #ECF8DD  tag background

// Tokens shared across all viewports (per-event item internals do not scale by breakpoint).
const dayNumber: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '30px',
  lineHeight: '36px',
  color: COLOR_DARK_BLUE,
};
const monthLabel: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '16px',
  color: COLOR_RED,
};
const yearLabel: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: COLOR_SLATE,
};
const tagChip: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.40px',
  color: COLOR_TAG_TEXT,
  backgroundColor: COLOR_TAG_BG,
};
const overviewLink: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.40px',
  color: COLOR_DARK_BLUE,
};
const addToCalendar: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.40px',
  color: COLOR_DARK_BLUE,
};

export const CuratedEventsTeaserGroup_FigmaValues: Record<ViewportName, FigmaViewportTokens> = {
  XL: {
    viewport: { width: 1440 },
    groupTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '56px',
      color: COLOR_DARK_BLUE,
    },
    overviewLink,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '30px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber,
    monthLabel,
    yearLabel,
    tagChip,
    addToCalendar,
    layout: {
      framePadding: '80px 96px',
      containerGap: '32px',
      itemsGridGap: '32px',
      itemGap: '16px',
      contentGap: '16px',
      tagGap: '10px',
      headlineGap: '14px',
      dayTagWidth: '64px',
    },
  },
  LG: {
    viewport: { width: 1024 },
    groupTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '56px',
      color: COLOR_DARK_BLUE,
    },
    overviewLink,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '30px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber,
    monthLabel,
    yearLabel,
    tagChip,
    addToCalendar,
    layout: {
      framePadding: '64px 40px',
      containerGap: '32px',
      itemsGridGap: '32px',
      itemGap: '16px',
      contentGap: '16px',
      tagGap: '10px',
      headlineGap: '14px',
      dayTagWidth: '64px',
    },
  },
  MD: {
    viewport: { width: 768 },
    groupTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '36px',
      color: COLOR_DARK_BLUE,
    },
    overviewLink,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: '30px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber,
    monthLabel,
    yearLabel,
    tagChip,
    addToCalendar,
    layout: {
      framePadding: '64px 32px',
      containerGap: '32px',
      itemsGridGap: '32px',
      itemGap: '16px',
      contentGap: '16px',
      tagGap: '10px',
      headlineGap: '14px',
      dayTagWidth: '64px',
    },
  },
  SM: {
    viewport: { width: 375 },
    groupTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '36px',
      color: COLOR_DARK_BLUE,
    },
    overviewLink,
    eventTitle: {
      fontFamily: BAYER_SANS,
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: '30px',
      color: COLOR_DARK_BLUE,
    },
    dayNumber,
    monthLabel,
    yearLabel,
    tagChip,
    addToCalendar,
    layout: {
      framePadding: '48px 20px',
      containerGap: '32px',
      itemsGridGap: '32px',
      itemGap: '16px',
      contentGap: '16px',
      tagGap: '10px',
      headlineGap: '14px',
      dayTagWidth: '64px',
    },
  },
};

/** Returns the Figma design tokens for a given viewport (case-insensitive). */
export function getValuesByViewport(viewport: string): FigmaViewportTokens {
  const key = viewport.toUpperCase() as ViewportName;
  const tokens = CuratedEventsTeaserGroup_FigmaValues[key];
  if (!tokens) {
    throw new Error(`No Figma values for viewport "${viewport}". Expected one of: XL, LG, MD, SM.`);
  }
  return tokens;
}
