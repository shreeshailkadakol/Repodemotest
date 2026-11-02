/**
 * Profile Card with Link Variant - Figma design tokens (user story 4317).
 *
 * Source: Figma file fiKrYZCKNM1OqXHQoGwrlX
 *   https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=25294-539
 *
 * Values were pulled DIRECTLY from the Figma REST API `profile-card` instances
 * inside the "Profil Card with link with background" frames (no guessing):
 *   XL = 25777:10919 (1440px)  Text Container padding 32/32/32/32
 *   LG = 25777:10880 (1024px)  Text Container padding 32/32/32/32
 *   MD = 25777:10853 (768px)   Text Container padding 24/32/24/32
 *   SM = 25777:10829 (375px)   Text Container padding 24/20/24/20
 *
 * Tests treat `undefined` fields as "no Figma value -> do not assert".
 * Colors use the framework rgba() convention.
 *
 * EXTRACTION NOTES (verify before treating derived bugs as valid):
 * - Card typography (title, designation, short description, link) is CONSTANT
 *   across all four breakpoints in Figma. In particular the card link is 14px at
 *   every viewport. Bug 5068 concerns the live site rendering 12px at SM/MD.
 * - imageTextGap (space between image and text block = Text Container paddingTop)
 *   is 32px at XL/LG but 24px at MD/SM per Figma. This CONTRADICTS Bug 5342, which
 *   assumed Figma expects 32px at MD; the Figma design itself specifies 24px at MD
 *   (matching the live with-background 24px). Recorded the real Figma value here.
 * - Lightbox horizontal padding (Bug 5343) was extracted from the Lightbox overlay
 *   frames XL=25451:6224, LG=25451:6603, MD=25451:6551, SM=25451:6436. Figma shows:
 *     header bar (Close/Download row): XL 96px, LG 40px, MD 32px, SM 20px
 *     image/caption content container: XL 48px, LG 40px, MD 32px, SM 20px
 *   Note: at XL the header (96px) and content (48px) padding differ; LG/MD/SM are
 *   uniform. This CONTRADICTS Bug 5343's claim of "40px at MD/LG": Figma MD is 32px
 *   (which matches the live flat 32px, so MD is NOT a deviation). Real deviations vs
 *   a live flat 32px would be at XL (48/96), LG (40), and SM (20).
 * - The task's node IDs 25711-18199 (LG) and 25711-18902 (SM) do NOT contain a
 *   profile-card (they hold a "Simple Image + LinkListItem" component) and were
 *   not used.
 */
export type ViewportName = 'XL' | 'LG' | 'MD' | 'SM';

export interface FigmaTextTokens {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textCase?: string;
  color?: string;
}

export interface FigmaLayoutTokens {
  textContainerPadding?: string; // padding of the card's "Text Container" (top/right/bottom/left)
  imageTextGap?: string; // vertical space between the card image and the title (Text Container paddingTop)
  titleToBodyGap?: string; // gap between title and the bottom text block (Text Container itemSpacing)
  bottomBlockGap?: string; // gap between designation/description/link (Text container bottom itemSpacing)
  designationGap?: string; // gap inside the designation block
  lightboxHorizontalPadding?: string; // Lightbox image/caption content container horizontal padding (Bug 5343)
  lightboxHeaderHorizontalPadding?: string; // Lightbox header row (Close/Download) horizontal padding
}

export interface FigmaViewportTokens {
  viewport: { width: number };
  cardTitle: FigmaTextTokens; // card headline (h2)
  designation: FigmaTextTokens; // profile-designation (full-fields only)
  shortDescription: FigmaTextTokens; // profile-short-description (full-fields only)
  cardLink: FigmaTextTokens; // profile-link label
  layout: FigmaLayoutTokens;
}

const BAYER_SANS = 'Bayer Sans';
const COLOR_DARK_BLUE = 'rgba(16,56,79,1)'; // #10384F  title, designation, link
const COLOR_SLATE = 'rgba(64,96,114,1)'; // #406072  short description

// Card typography is identical across all four breakpoints in Figma.
const cardTitle: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '30px',
  color: COLOR_DARK_BLUE,
};
const designation: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px',
  color: COLOR_DARK_BLUE,
};
const shortDescription: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px',
  color: COLOR_SLATE,
};
const cardLink: FigmaTextTokens = {
  fontFamily: BAYER_SANS,
  fontWeight: 500,
  fontSize: '14px', // Figma constant at every viewport (Bug 5068: live renders 12px at SM/MD)
  lineHeight: '20px',
  letterSpacing: '0.40px',
  textCase: 'UPPER',
  color: COLOR_DARK_BLUE,
};

export const ProfileCardLinkVariant_FigmaValues: Record<ViewportName, FigmaViewportTokens> = {
  XL: {
    viewport: { width: 1440 },
    cardTitle,
    designation,
    shortDescription,
    cardLink,
    layout: {
      textContainerPadding: '32px 32px 32px 32px',
      imageTextGap: '32px',
      titleToBodyGap: '24px',
      bottomBlockGap: '16px',
      designationGap: '12px',
      lightboxHorizontalPadding: '48px',
      lightboxHeaderHorizontalPadding: '96px',
    },
  },
  LG: {
    viewport: { width: 1024 },
    cardTitle,
    designation,
    shortDescription,
    cardLink,
    layout: {
      textContainerPadding: '32px 32px 32px 32px',
      imageTextGap: '32px',
      titleToBodyGap: '24px',
      bottomBlockGap: '16px',
      designationGap: '12px',
      lightboxHorizontalPadding: '40px',
      lightboxHeaderHorizontalPadding: '40px',
    },
  },
  MD: {
    viewport: { width: 768 },
    cardTitle,
    designation,
    shortDescription,
    cardLink,
    layout: {
      textContainerPadding: '24px 32px 24px 32px',
      imageTextGap: '24px', // real Figma value at MD (contradicts Bug 5342's assumed 32px)
      titleToBodyGap: '24px',
      bottomBlockGap: '16px',
      designationGap: '12px',
      lightboxHorizontalPadding: '32px', // Figma MD = 32px (contradicts Bug 5343's assumed 40px; matches live flat 32px)
      lightboxHeaderHorizontalPadding: '32px',
    },
  },
  SM: {
    viewport: { width: 375 },
    cardTitle,
    designation,
    shortDescription,
    cardLink,
    layout: {
      textContainerPadding: '24px 20px 24px 20px',
      imageTextGap: '24px',
      titleToBodyGap: '24px',
      bottomBlockGap: '16px',
      designationGap: '12px',
      lightboxHorizontalPadding: '20px',
      lightboxHeaderHorizontalPadding: '20px',
    },
  },
};

/** Returns the Figma design tokens for a given viewport (case-insensitive). */
export function getValuesByViewport(viewport: string): FigmaViewportTokens {
  const key = viewport.toUpperCase() as ViewportName;
  const tokens = ProfileCardLinkVariant_FigmaValues[key];
  if (!tokens) {
    throw new Error(`No Figma values for viewport "${viewport}". Expected one of: XL, LG, MD, SM.`);
  }
  return tokens;
}
