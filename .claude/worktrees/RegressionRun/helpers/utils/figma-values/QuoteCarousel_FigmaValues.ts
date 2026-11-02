// Figma design tokens for Quote Carousel Component
// Sourced from Figma file: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover
// Node IDs: XL: 3276-7022, LG: 3276-7047, MD: 3276-7072, SM: 3276-7097
// Last updated: 2026-01-16 - EXTRACTED FROM ACTUAL FIGMA VALUES USING FIGMA EXTRACTOR
// Component: Quote Carousel Component with navigation controls, multiple quotes and responsive design

export interface ViewportSize {
  width: number;
  height: number;
}

export interface QuoteCarouselFigmaValues {
  viewport: ViewportSize;
  container: {
    width: string;
    maxWidth: string;
    padding: string;
    margin: string;
  };
  quoteSlide: {
    width: string;
    padding: string;
    borderRadius: string;
    backgroundColor: string;
    boxShadow: string;
  };
  quoteText: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
    textAlign: string;
    marginBottom: string;
  };
  authorSection: {
    display: string;
    alignItems: string;
    gap: string;
    marginTop: string;
  };
  authorImage: {
    width: string;
    height: string;
    borderRadius: string;
    objectFit: string;
  };
  authorInfo: {
    display: string;
    flexDirection: string;
    gap: string;
  };
  authorName: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  authorTitle: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    lineHeight: string;
  };
  navigationControls: {
    position: string;
    bottom: string;
    left: string;
    transform: string;
    display: string;
    gap: string;
  };
  navigationDot: {
    width: string;
    height: string;
    borderRadius: string;
    backgroundColor: string;
    cursor: string;
    transition: string;
  };
  navigationDotActive: {
    backgroundColor: string;
  };
  arrowButtons: {
    position: string;
    top: string;
    transform: string;
    width: string;
    height: string;
    borderRadius: string;
    backgroundColor: string;
    border: string;
    cursor: string;
    display: string;
    alignItems: string;
    justifyContent: string;
  };
  prevButton: {
    left: string;
  };
  nextButton: {
    right: string;
  };
}

export const QuoteCarousel_FigmaValues: Record<
  'XL' | 'LG' | 'MD' | 'SM',
  QuoteCarouselFigmaValues
> = {
  XL: {
    viewport: {
      width: 1440,
      height: 900,
    },
    container: {
      width: '100%',
      maxWidth: '1248px', // From actual Figma: width: 1248
      padding: '0 24px',
      margin: '0 auto',
    },
    quoteSlide: {
      width: '1248px', // From actual Figma: width: 1248
      padding: '48px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    quoteText: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '48px', // From actual Figma: "48px"
      fontWeight: '700', // From actual Figma: "700"
      lineHeight: '56px', // From actual Figma: "56px"
      color: '#333333',
      textAlign: 'center',
      marginBottom: '32px',
    },
    authorSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginTop: '32px',
    },
    authorImage: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    authorInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    authorName: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '18px', // From actual Figma: "18px"
      fontWeight: '700', // From actual Figma: "700"
      color: 'rgba(96, 113, 139, 1)', // From actual Figma: "rgba(96, 113, 139, 1)"
      lineHeight: '28px', // From actual Figma: "28px"
    },
    authorTitle: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '18px', // From actual Figma: "18px"
      fontWeight: '400', // From actual Figma: "400"
      color: 'rgba(96, 113, 139, 1)', // From actual Figma: "rgba(96, 113, 139, 1)"
      lineHeight: '28px', // From actual Figma: "28px"
    },
    navigationControls: {
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
    },
    navigationDot: {
      width: '4px', // From actual Figma: width: 4, height: 4
      height: '4px',
      borderRadius: '50%',
      backgroundColor: 'rgba(96, 113, 139, 1)', // From actual Figma: "rgba(96, 113, 139, 1)"
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    navigationDotActive: {
      backgroundColor: '#d30f4b',
    },
    arrowButtons: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '44px', // From actual Figma: width: 44, height: 44
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #cccccc',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    prevButton: {
      left: '24px',
    },
    nextButton: {
      right: '24px',
    },
  },
  LG: {
    viewport: {
      width: 1024,
      height: 768,
    },
    container: {
      width: '100%',
      maxWidth: '944px', // From actual Figma: width: 944
      padding: '0 20px',
      margin: '0 auto',
    },
    quoteSlide: {
      width: '944px', // From actual Figma: width: 944
      padding: '40px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    quoteText: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '36px', // From actual Figma: "36px"
      fontWeight: '700', // From actual Figma: "700"
      lineHeight: '44px', // From actual Figma: "44px"
      color: '#333333',
      textAlign: 'center',
      marginBottom: '28px',
    },
    authorSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginTop: '28px',
    },
    authorImage: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    authorInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    authorName: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '18px', // From actual Figma: "18px"
      fontWeight: '700', // From actual Figma: "700"
      color: 'rgba(96, 113, 139, 1)', // From actual Figma: "rgba(96, 113, 139, 1)"
      lineHeight: '28px', // From actual Figma: "28px"
    },
    authorTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    navigationControls: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
    },
    navigationDot: {
      width: '4px', // From actual Figma: consistent across viewports
      height: '4px',
      borderRadius: '50%',
      backgroundColor: 'rgba(96, 113, 139, 1)',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    navigationDotActive: {
      backgroundColor: '#d30f4b',
    },
    arrowButtons: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '44px', // From actual Figma: consistent 44x44
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #cccccc',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    prevButton: {
      left: '20px',
    },
    nextButton: {
      right: '20px',
    },
  },
  MD: {
    viewport: {
      width: 768,
      height: 1024,
    },
    container: {
      width: '100%',
      maxWidth: '704px', // From actual Figma: width: 704
      padding: '0 16px',
      margin: '0 auto',
    },
    quoteSlide: {
      width: '704px', // From actual Figma: width: 704
      padding: '32px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    quoteText: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '30px', // From actual Figma: "30px"
      fontWeight: '700', // From actual Figma: "700"
      lineHeight: '36px', // From actual Figma: "36px"
      color: '#333333',
      textAlign: 'center',
      marginBottom: '24px',
    },
    authorSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '24px',
    },
    authorImage: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    authorInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
    },
    authorName: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '18px', // From actual Figma: "18px"
      fontWeight: '700', // From actual Figma: "700"
      color: 'rgba(96, 113, 139, 1)', // From actual Figma: "rgba(96, 113, 139, 1)"
      lineHeight: '28px', // From actual Figma: "28px"
    },
    authorTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    navigationControls: {
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px',
    },
    navigationDot: {
      width: '4px', // From actual Figma: consistent
      height: '4px',
      borderRadius: '50%',
      backgroundColor: 'rgba(96, 113, 139, 1)',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    navigationDotActive: {
      backgroundColor: '#d30f4b',
    },
    arrowButtons: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '44px', // From actual Figma: consistent 44x44
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #cccccc',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    prevButton: {
      left: '16px',
    },
    nextButton: {
      right: '16px',
    },
  },
  SM: {
    viewport: {
      width: 375,
      height: 667,
    },
    container: {
      width: '100%',
      maxWidth: '311px', // From actual Figma: width: 311
      padding: '0 16px',
      margin: '0 auto',
    },
    quoteSlide: {
      width: '311px', // From actual Figma: width: 311
      padding: '24px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    quoteText: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '24px', // From actual Figma: "24px" - CONFIRMED
      fontWeight: '700', // From actual Figma: "700" - CONFIRMED
      lineHeight: '30px', // From actual Figma: "30px" - CONFIRMED
      color: '#333333',
      textAlign: 'center',
      marginBottom: '20px',
    },
    authorSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px',
    },
    authorImage: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    authorInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    authorName: {
      fontFamily: 'Bayer Sans', // From actual Figma: "Bayer Sans"
      fontSize: '18px', // From actual Figma: "18px"
      fontWeight: '700', // From actual Figma: "700"
      color: 'rgba(96, 113, 139, 1)', // From actual Figma: "rgba(96, 113, 139, 1)"
      lineHeight: '28px', // From actual Figma: "28px"
    },
    authorTitle: {
      fontFamily: 'Bayer Sans',
      fontSize: '18px',
      fontWeight: '400',
      color: 'rgba(96, 113, 139, 1)',
      lineHeight: '28px',
    },
    navigationControls: {
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '6px',
    },
    navigationDot: {
      width: '4px', // From actual Figma: consistent 4x4
      height: '4px',
      borderRadius: '50%',
      backgroundColor: 'rgba(96, 113, 139, 1)', // From actual Figma
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    navigationDotActive: {
      backgroundColor: '#d30f4b',
    },
    arrowButtons: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '44px', // From actual Figma: consistent 44x44
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #cccccc',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    prevButton: {
      left: '12px',
    },
    nextButton: {
      right: '12px',
    },
  },
};
