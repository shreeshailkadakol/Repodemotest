// Figma design tokens for Media Gallery Component
// Sourced from Figma file: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover
// Node IDs: XL: 486:20428, LG: 486:20433, MD: 486:20435, SM: 486:20437
// Last updated: 2025-10-10 - EXTRACTED WITH ACTUAL FIGMA API VALUES
// Component: Media Gallery with carousel, mixed media support (images + video), navigation controls

export const MediaGallery_FigmaValues = {
  XL: {
    viewport: {
      width: 1440,
      height: 1080,
    },
    // Headline text: Media Collection > headlineCarousel > headline > headline
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 1)',
      lineHeight: '56px',
      // Based on Figma extraction: "headline for teaser collection"
      content: 'headline for teaser collection',
    },
    // Highlight text: Media Collection > headlineCarousel > headline > Highlight text
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(211, 15, 75, 1)', // Bayer brand red
      lineHeight: '56px',
      // Based on Figma extraction: "Highlight text"
      content: 'Highlight text',
    },
    // Media items (images and video)
    mediaItem: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      borderRadius: '8px',
    },
    // Caption text typography (for both image and video captions)
    captionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    // Carousel Navigation: CarouselNavigation > CarouselNavigationItem > arrow-forward
    navigationButton: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '2px solid rgba(211, 15, 75, 1)',
    },
    // Dot Navigation: CarouselNavigation > dotNavigation > dotNavigationItems
    dotNavigation: {
      dotSize: '12px',
      dotSpacing: '8px',
      activeDotColor: 'rgba(211, 15, 75, 1)',
      inactiveDotColor: 'rgba(96, 113, 139, 0.3)',
    },
  },
  
  LG: {
    viewport: {
      width: 1080,
      height: 800,
    },
    // Same structure for LG viewport (486:20433)
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 1)',
      lineHeight: '56px',
      // Based on Figma extraction: "Headline for" + "teaser collection"
      content: 'teaser collection',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '48px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(211, 15, 75, 1)',
      lineHeight: '56px',
      // Based on Figma extraction: "Headline for"
      content: 'Headline for',
    },
    mediaItem: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      borderRadius: '8px',
    },    // Caption text typography (for both image and video captions)
    captionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },    navigationButton: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '2px solid rgba(211, 15, 75, 1)',
    },
    dotNavigation: {
      dotSize: '10px',
      dotSpacing: '6px',
      activeDotColor: 'rgba(211, 15, 75, 1)',
      inactiveDotColor: 'rgba(96, 113, 139, 0.3)',
    },
  },
  
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    // Same structure for MD viewport (486:20435)
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 1)',
      lineHeight: '44px',
      // Based on Figma extraction: "Headline for" + "teaser collection"
      content: 'teaser collection',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '36px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(211, 15, 75, 1)',
      lineHeight: '44px',
      // Based on Figma extraction: "Headline for"
      content: 'Headline for',
    },
    mediaItem: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      borderRadius: '8px',
    },
    // Caption text typography (for both image and video captions)
    captionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '20px',
    },
    copyrightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '12px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '18px',
    },
    navigationButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '2px solid rgba(211, 15, 75, 1)',
    },
    dotNavigation: {
      dotSize: '8px',
      dotSpacing: '6px',
      activeDotColor: 'rgba(211, 15, 75, 1)',
      inactiveDotColor: 'rgba(96, 113, 139, 0.3)',
    },
  },
  
  SM: {
    viewport: {
      width: 375,
      height: 812,
    },
    // Same structure for SM viewport (486:20437)
    headlineText: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(0, 0, 0, 1)',
      lineHeight: '36px',
      // Based on Figma extraction: "Headline" + "collection"
      content: 'collection',
    },
    highlightText: {
      fontFamily: 'Bayer Sans',
      fontSize: '30px',
      fontWeight: '700',
      fontStyle: 'Bold',
      color: 'rgba(211, 15, 75, 1)',
      lineHeight: '36px',
      // Based on Figma extraction: "Headline"
      content: 'Headline',
    },
    mediaItem: {
      width: '400px',
      height: '267px',
      aspectRatio: '1.5',
      borderRadius: '8px',
    },
    // Caption text typography (for both image and video captions)
    captionText: {
      fontFamily: 'Bayer Sans',
      fontSize: '14px',
      fontWeight: '400',
      fontStyle: 'Regular',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '20px',
    },
    navigationButton: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '2px solid rgba(211, 15, 75, 1)',
    },
    dotNavigation: {
      dotSize: '6px',
      dotSpacing: '4px',
      activeDotColor: 'rgba(211, 15, 75, 1)',
      inactiveDotColor: 'rgba(96, 113, 139, 0.3)',
    },
  },
};

// Export individual viewport configurations for easy access
export const MediaGalleryXL = MediaGallery_FigmaValues.XL;
export const MediaGalleryLG = MediaGallery_FigmaValues.LG;
export const MediaGalleryMD = MediaGallery_FigmaValues.MD;
export const MediaGallerySM = MediaGallery_FigmaValues.SM;