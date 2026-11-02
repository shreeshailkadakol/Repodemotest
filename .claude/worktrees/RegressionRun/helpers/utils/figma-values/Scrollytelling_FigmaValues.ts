// Auto-generated from Figma API - Scrollytelling Component
// Figma file: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX
// Title node path: Scrollytelling > Canvas > panel > text > Title
// Description node path: Scrollytelling > Canvas > panel > text > Description
//
// Typography is shared across all layout/viewport permutations; only the image
// placement (full-width vs half) and text alignment (left/right) vary.
// Verified via figma-extractor.ts across all four layout variants:
//   - Title:       XL/LG/MD = 30px/700/36px, SM = 24px/700/30px, color rgba(16, 56, 79, 1)
//   - Description: 18px/400/28px, color rgba(16, 56, 79, 1) (all viewports)

const TITLE_DEFAULT = {
  fontFamily: 'Bayer Sans',
  fontSize: '30px',
  fontWeight: '700',
  color: 'rgba(16, 56, 79, 1)',
  lineHeight: '36px',
};

const TITLE_SM = {
  fontFamily: 'Bayer Sans',
  fontSize: '24px',
  fontWeight: '700',
  color: 'rgba(16, 56, 79, 1)',
  lineHeight: '30px',
};

const DESCRIPTION = {
  fontFamily: 'Bayer Sans',
  fontSize: '18px',
  fontWeight: '400',
  color: 'rgba(16, 56, 79, 1)',
  lineHeight: '28px',
};

const typographyByViewport = {
  XL: { title: TITLE_DEFAULT, description: DESCRIPTION },
  LG: { title: TITLE_DEFAULT, description: DESCRIPTION },
  MD: { title: TITLE_DEFAULT, description: DESCRIPTION },
  SM: { title: TITLE_SM, description: DESCRIPTION },
};

type Viewport = 'XL' | 'LG' | 'MD' | 'SM';

// Node IDs per layout variant (dash form as used in Figma URLs).
const variantNodeIds: Record<string, Record<Viewport, string>> = {
  // Text Container right + image FullScreen (default)
  textRightImageFullScreen: {
    XL: '7619-68075',
    LG: '7619-68077',
    MD: '7619-68083',
    SM: '7619-68069',
  },
  // Text Container left + image FullScreen
  textLeftImageFullScreen: {
    XL: '7619-68073',
    LG: '7619-68078',
    MD: '7619-68084',
    SM: '7619-68071',
  },
  // Text Container right + image Half
  textRightImageHalf: {
    XL: '7619-68076',
    LG: '7619-68079',
    MD: '7619-68081',
    SM: '7619-68070',
  },
  // Text Container left + image Half
  textLeftImageHalf: {
    XL: '7619-68074',
    LG: '7619-68080',
    MD: '7619-68082',
    SM: '7619-68072',
  },
};

function buildVariant(nodeIds: Record<Viewport, string>) {
  return {
    XL: { nodeId: nodeIds.XL, ...typographyByViewport.XL },
    LG: { nodeId: nodeIds.LG, ...typographyByViewport.LG },
    MD: { nodeId: nodeIds.MD, ...typographyByViewport.MD },
    SM: { nodeId: nodeIds.SM, ...typographyByViewport.SM },
  };
}

const defaultVariant = buildVariant(variantNodeIds.textRightImageFullScreen);

export const Scrollytelling_FigmaValues = {
  // Default variant (Text Container right + image FullScreen) exposed at the top
  // level for backward compatibility with existing specs.
  ...defaultVariant,

  // All layout variants — typography is identical; node IDs differ per variant.
  variants: {
    textRightImageFullScreen: defaultVariant,
    textLeftImageFullScreen: buildVariant(variantNodeIds.textLeftImageFullScreen),
    textRightImageHalf: buildVariant(variantNodeIds.textRightImageHalf),
    textLeftImageHalf: buildVariant(variantNodeIds.textLeftImageHalf),
  },
};
