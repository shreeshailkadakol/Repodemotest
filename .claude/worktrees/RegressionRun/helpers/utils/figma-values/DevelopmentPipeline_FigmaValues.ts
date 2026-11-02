// Development Pipeline component — Figma design tokens (US 2600)
//
// Values verified against the Figma source (file fiKrYZCKNM1OqXHQoGwrlX) on
// 2025: XL 15415-827208, LG 15415-827433, MD 15415-827617, SM 15415-828109.
// Extracted via figma-extractor.ts and reconciled per-viewport.
// Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover

const FONT_FAMILY = '"Bayer Sans", sans-serif';
const NAVY = 'rgba(16, 56, 79, 1)'; // #10384F
const GREY = 'rgba(96, 113, 139, 1)'; // #60718B
const WHITE = 'rgba(255, 255, 255, 1)';
const DESC_GREY = 'rgba(64, 96, 114, 1)'; // intro description
const BANNER_PHASE_GREY = 'rgba(202, 213, 226, 1)'; // banner phase axis labels
const MODALITY_GREY = 'rgba(49, 65, 88, 1)'; // #314158 modality/filter chips

export type DevelopmentPipelineTypographyStyle = {
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  lineHeight: string;
  color: string;
  letterSpacing: string;
};

export type DevelopmentPipelineViewport = 'xl' | 'lg' | 'md' | 'sm';

export type DevelopmentPipelineTokens = {
  title: DevelopmentPipelineTypographyStyle;
  description: DevelopmentPipelineTypographyStyle;
  asOfDate: DevelopmentPipelineTypographyStyle;
  bannerCounterValue: DevelopmentPipelineTypographyStyle;
  bannerCounterUnit: DevelopmentPipelineTypographyStyle;
  bannerCounterLabel: DevelopmentPipelineTypographyStyle;
  bannerPhaseLabel: DevelopmentPipelineTypographyStyle;
  searchLabel: DevelopmentPipelineTypographyStyle;
  searchPlaceholder: DevelopmentPipelineTypographyStyle;
  filterGroupHeading: DevelopmentPipelineTypographyStyle;
  filterChip: DevelopmentPipelineTypographyStyle;
  productCardTitle: DevelopmentPipelineTypographyStyle;
  productCardSubtitle: DevelopmentPipelineTypographyStyle;
  productAreaTag: DevelopmentPipelineTypographyStyle;
  detailFieldLabel: DevelopmentPipelineTypographyStyle;
  detailFieldValue: DevelopmentPipelineTypographyStyle;
  projectsPerPageLabel: DevelopmentPipelineTypographyStyle;
  projectsPerPageValue: DevelopmentPipelineTypographyStyle;
  filterToggleLabel: DevelopmentPipelineTypographyStyle;
  resetAllLabel: DevelopmentPipelineTypographyStyle;
  typeRadioLabel: DevelopmentPipelineTypographyStyle;
};

const style = (
  fontSize: string,
  fontWeight: string,
  lineHeight: string,
  color: string,
  letterSpacing = 'normal',
): DevelopmentPipelineTypographyStyle => ({
  fontSize,
  fontWeight,
  fontFamily: FONT_FAMILY,
  lineHeight,
  color,
  letterSpacing,
});

// The component design title ("Pipeline Overview") and the (mobile) Filter toggle
// are the tokens that vary across viewports.
const TITLE_BY_VIEWPORT: Record<DevelopmentPipelineViewport, DevelopmentPipelineTypographyStyle> = {
  xl: style('48px', '700', '56px', NAVY),
  lg: style('48px', '700', '56px', NAVY),
  md: style('30px', '700', '36px', NAVY),
  sm: style('30px', '700', '36px', NAVY),
};

// The "Filter" toggle is a 14px table-header label at desktop widths, but the
// compact/mobile filter button renders it at 18px (MD/SM).
const FILTER_TOGGLE_BY_VIEWPORT: Record<DevelopmentPipelineViewport, DevelopmentPipelineTypographyStyle> = {
  xl: style('14px', '400', '20px', NAVY),
  lg: style('14px', '400', '20px', NAVY),
  md: style('18px', '400', '28px', NAVY),
  sm: style('18px', '400', '28px', NAVY),
};

const buildTokens = (viewport: DevelopmentPipelineViewport): DevelopmentPipelineTokens => ({
  title: TITLE_BY_VIEWPORT[viewport],
  // Intro / meta text
  description: style('20px', '400', '30px', DESC_GREY),
  asOfDate: style('20px', '700', '30px', GREY),
  // Banner counters (white on the dark banner)
  bannerCounterValue: style('60px', '700', '70px', WHITE),
  bannerCounterUnit: style('30px', '400', '36px', WHITE),
  bannerCounterLabel: style('20px', '700', '30px', WHITE),
  bannerPhaseLabel: style('18px', '400', '28px', BANNER_PHASE_GREY),
  // Search region
  searchLabel: style('16px', '700', '24px', NAVY),
  searchPlaceholder: style('16px', '400', '24px', GREY),
  // Sidebar filters
  filterGroupHeading: style('16px', '700', '24px', NAVY),
  filterChip: style('12px', '500', '16px', MODALITY_GREY, '0.4px'),
  // Product cards
  productCardTitle: style('18px', '700', '28px', NAVY),
  // Card indication subtitle uses the same blue-grey as the intro description
  // (Figma "Prostate Cancer with Biochemical Recurrence..." = rgba(64,96,114,1)).
  productCardSubtitle: style('16px', '400', '24px', DESC_GREY),
  productAreaTag: style('18px', '400', '28px', NAVY),
  // Expanded detail fields
  detailFieldLabel: style('12px', '400', '16px', GREY),
  detailFieldValue: style('16px', '400', '24px', NAVY),
  // Page-size selector
  projectsPerPageLabel: style('16px', '700', '24px', NAVY),
  projectsPerPageValue: style('16px', '400', '24px', GREY),
  // Compact / mobile controls
  filterToggleLabel: FILTER_TOGGLE_BY_VIEWPORT[viewport],
  resetAllLabel: style('14px', '400', '20px', NAVY),
  // Program-type radio options
  typeRadioLabel: style('16px', '400', '24px', NAVY),
});

export const getValuesByViewport = (
  viewport: DevelopmentPipelineViewport,
): DevelopmentPipelineTokens => buildTokens(viewport);

// Therapeutic-area "Topic Tag" brand colours (12px/500, letter-spacing 0.4px),
// normalised rgba for comparison. Verified from the Figma sidebar legend tags.
export const DevelopmentPipelineTherapeuticAreaColors = {
  oncology: 'rgba(0, 85, 115, 1)', // ONC
  cardiovascular: 'rgba(211, 15, 75, 1)', // CVD
  neurology: 'rgba(14, 104, 1, 1)', // NRD (Neurology & Rare Diseases)
  immunology: 'rgba(59, 44, 59, 1)', // IMM
} as const;
