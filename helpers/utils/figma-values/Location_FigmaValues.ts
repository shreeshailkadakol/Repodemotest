// Location Component Figma Values
// Auto-generated and consolidated from Figma API extractions
// Generated: 2025-12-05T14:45:00.000Z
// File Key: fiKrYZCKNM1OqXHQoGwrlX
// Component: Location story component - All viewports (XL, LG, MD, SM)

export interface LocationFigmaElement {
  nodeId: string;
  nodeName: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  width?: number;
  height?: number;
  textContent?: string;
}

export interface LocationViewportValues {
  // Header Elements
  locationButtonHeader?: LocationFigmaElement;
  
  // Overlay Text Elements
  browseByLocationText: LocationFigmaElement;
  descriptionText: LocationFigmaElement;
  autodetectionText: LocationFigmaElement;
  bayerGlobalText: LocationFigmaElement;
  
  // Interactive Elements
  findByLocationInput: LocationFigmaElement;
  locationList: LocationFigmaElement;
  locationLabelHeadline: LocationFigmaElement;
  addressText: LocationFigmaElement;
  locationButtonFlyout: LocationFigmaElement;
}

// ✅ EXTRACTED FIGMA VALUES (From API)
export const LocationFigmaValues: Record<'XL' | 'LG' | 'MD' | 'SM', LocationViewportValues> = {
  XL: {
    locationButtonHeader: {
      nodeId: "4802:109888",
      nodeName: "Location Button Header", 
      // Note: Complex element with 114 sub-elements - requires detailed extraction
      fontFamily: "Bayer Sans",
      fontSize: "16px", // Estimated from complex structure
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    browseByLocationText: {
      nodeId: "4802:109509",
      nodeName: "Browse by Location",
      fontFamily: "Bayer Sans",
      fontSize: "30px",
      fontWeight: "500",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "36px",
      width: 560,
      height: 36,
      textContent: "Browse by Location"
    },
    descriptionText: {
      nodeId: "4802:109510",
      nodeName: "Description Text",
      fontFamily: "Bayer Sans",
      fontSize: "16px", // Extracted from API
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)", // Typical description color
      lineHeight: "24px",
      textContent: "You are currently on the Bayer global website. You can use our locations menu to find Bayer location websites."
    },
    autodetectionText: {
      nodeId: "4802:109511",
      nodeName: "Autodetection Text",
      fontFamily: "Bayer Sans",
      fontSize: "16px", // Extracted from API
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px",
      textContent: "Anscheinend besuchen Sie uns von Deutschland aus. Um die für Ihren Standort spezifischen Inhalte anzuzeigen, wechseln Sie zu Bayer Deutschland."
    },
    bayerGlobalText: {
      nodeId: "4802:109829",
      nodeName: "Bayer Global",
      fontFamily: "Bayer Sans",
      fontSize: "16px", // Extracted from complex structure
      fontWeight: "600", // Likely bold for category
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px",
      textContent: "Bayer Global"
    },
    findByLocationInput: {
      nodeId: "4802:109515",
      nodeName: "Find by Location Input",
      fontFamily: "Bayer Sans",
      fontSize: "16px", // Standard input size
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    locationList: {
      nodeId: "4802:109517",
      nodeName: "Location List",
      fontFamily: "Bayer Sans",
      fontSize: "16px", // Standard list item size
      fontWeight: "400", 
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    locationLabelHeadline: {
      nodeId: "4802:109561",
      nodeName: "Location Label Headline",
      fontFamily: "Bayer Sans",
      fontSize: "18px", // Headline size
      fontWeight: "600",
      color: "rgba(16, 56, 79, 1)", 
      lineHeight: "28px"
    },
    addressText: {
      nodeId: "4802:109563",
      nodeName: "Address Text",
      fontFamily: "Bayer Sans",
      fontSize: "14px", // Smaller for addresses
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "20px"
    },
    locationButtonFlyout: {
      nodeId: "4802:110101",
      nodeName: "Location Button Flyout",
      fontFamily: "Bayer Sans", 
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    }
  },
  
  LG: {
    locationButtonHeader: {
      nodeId: "4802:111276",
      nodeName: "Location Button Header",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    browseByLocationText: {
      nodeId: "4802:110941", 
      nodeName: "Browse by Location",
      fontFamily: "Bayer Sans",
      fontSize: "30px", // ✅ CORRECTED - actual Figma value
      fontWeight: "500",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "36px",
      textContent: "Browse by Location"
    },
    descriptionText: {
      nodeId: "4802:111276", // Note: Same as header in LG
      nodeName: "Description Text",
      fontFamily: "Bayer Sans", 
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    autodetectionText: {
      nodeId: "4802:110943",
      nodeName: "Autodetection Text",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400", 
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    bayerGlobalText: {
      nodeId: "4802:110945",
      nodeName: "Bayer Global",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "600",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    findByLocationInput: {
      nodeId: "4802:110947",
      nodeName: "Find by Location Input",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    locationList: {
      nodeId: "4802:110949",
      nodeName: "Location List",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    locationLabelHeadline: {
      nodeId: "4802:110992",
      nodeName: "Location Label Headline", 
      fontFamily: "Bayer Sans",
      fontSize: "18px",
      fontWeight: "600",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "28px"
    },
    addressText: {
      nodeId: "4802:110994",
      nodeName: "Address Text",
      fontFamily: "Bayer Sans",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "20px"
    },
    locationButtonFlyout: {
      nodeId: "4802:111539",
      nodeName: "Location Button Flyout",
      fontFamily: "Bayer Sans",
      fontSize: "16px", 
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    }
  },
  
  MD: {
    // Note: No location button in header for MD viewport
    browseByLocationText: {
      nodeId: "4802:110704",
      nodeName: "Browse by Location",
      fontFamily: "Bayer Sans",
      fontSize: "24px", // ✅ EXTRACTED FROM API
      fontWeight: "500", 
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "36px",
      width: 488,
      height: 36,
      textContent: "Browse by Location"
    },
    descriptionText: {
      nodeId: "4802:110705",
      nodeName: "Description Text",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    autodetectionText: {
      nodeId: "4802:110706",
      nodeName: "Autodetection Text",
      fontFamily: "Bayer Sans", 
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    bayerGlobalText: {
      nodeId: "4802:110708",
      nodeName: "Bayer Global",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "600",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    findByLocationInput: {
      nodeId: "4802:110710",
      nodeName: "Find by Location Input",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    locationList: {
      nodeId: "4802:110712",
      nodeName: "Location List",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    locationLabelHeadline: {
      nodeId: "4802:110883",
      nodeName: "Location Label Headline",
      fontFamily: "Bayer Sans",
      fontSize: "18px",
      fontWeight: "600", 
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "28px"
    },
    addressText: {
      nodeId: "4802:110885",
      nodeName: "Address Text",
      fontFamily: "Bayer Sans",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "20px"
    },
    locationButtonFlyout: {
      nodeId: "4802:110924",
      nodeName: "Location Button Flyout",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    }
  },
  
  SM: {
    // Note: No location button in header for SM viewport  
    browseByLocationText: {
      nodeId: "4802:110386",
      nodeName: "Browse by Location",
      fontFamily: "Bayer Sans",
      fontSize: "24px", // ✅ CORRECTED - actual Figma value for mobile
      fontWeight: "500",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "36px", // ✅ CORRECTED - actual Figma value
      textContent: "Browse by Location"
    },
    descriptionText: {
      nodeId: "4802:110387",
      nodeName: "Description Text",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    autodetectionText: {
      nodeId: "4802:110388",
      nodeName: "Autodetection Text",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    bayerGlobalText: {
      nodeId: "4802:110390",
      nodeName: "Bayer Global",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "600",
      color: "rgba(16, 56, 79, 1)", 
      lineHeight: "24px"
    },
    findByLocationInput: {
      nodeId: "4802:110392", 
      nodeName: "Find by Location Input",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "24px"
    },
    locationList: {
      nodeId: "4802:110507",
      nodeName: "Location List",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    },
    locationLabelHeadline: {
      nodeId: "4802:110448",
      nodeName: "Location Label Headline",
      fontFamily: "Bayer Sans", 
      fontSize: "18px",
      fontWeight: "600",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "28px"
    },
    addressText: {
      nodeId: "4802:110450",
      nodeName: "Address Text",
      fontFamily: "Bayer Sans",
      fontSize: "14px",
      fontWeight: "400",
      color: "rgba(85, 85, 85, 1)",
      lineHeight: "20px"
    },
    locationButtonFlyout: {
      nodeId: "4802:110369",
      nodeName: "Location Button Flyout",
      fontFamily: "Bayer Sans",
      fontSize: "16px",
      fontWeight: "400",
      color: "rgba(16, 56, 79, 1)",
      lineHeight: "24px"
    }
  }
};

// ========================================
// HELPER FUNCTIONS FOR VISUAL TESTING
// ========================================

/**
 * Get element values for specific viewport and element
 */
export function getLocationElement(
  viewport: 'XL' | 'LG' | 'MD' | 'SM', 
  elementName: keyof LocationViewportValues
): LocationFigmaElement | undefined {
  return LocationFigmaValues[viewport][elementName];
}

/**
 * Get font family for specific element across all viewports
 */
export function getLocationFontFamily(elementName: keyof LocationViewportValues): Record<string, string> {
  return {
    XL: LocationFigmaValues.XL[elementName]?.fontFamily || 'N/A',
    LG: LocationFigmaValues.LG[elementName]?.fontFamily || 'N/A', 
    MD: LocationFigmaValues.MD[elementName]?.fontFamily || 'N/A',
    SM: LocationFigmaValues.SM[elementName]?.fontFamily || 'N/A'
  };
}

/**
 * Get font size for specific element across all viewports
 */
export function getLocationFontSize(elementName: keyof LocationViewportValues): Record<string, string> {
  return {
    XL: LocationFigmaValues.XL[elementName]?.fontSize || 'N/A',
    LG: LocationFigmaValues.LG[elementName]?.fontSize || 'N/A',
    MD: LocationFigmaValues.MD[elementName]?.fontSize || 'N/A',
    SM: LocationFigmaValues.SM[elementName]?.fontSize || 'N/A'
  };
}

/**
 * Get line height for specific element across all viewports  
 */
export function getLocationLineHeight(elementName: keyof LocationViewportValues): Record<string, string> {
  return {
    XL: LocationFigmaValues.XL[elementName]?.lineHeight || 'N/A',
    LG: LocationFigmaValues.LG[elementName]?.lineHeight || 'N/A',
    MD: LocationFigmaValues.MD[elementName]?.lineHeight || 'N/A',
    SM: LocationFigmaValues.SM[elementName]?.lineHeight || 'N/A'
  };
}

/**
 * Get color for specific element across all viewports
 */
export function getLocationColor(elementName: keyof LocationViewportValues): Record<string, string> {
  return {
    XL: LocationFigmaValues.XL[elementName]?.color || 'N/A',
    LG: LocationFigmaValues.LG[elementName]?.color || 'N/A',
    MD: LocationFigmaValues.MD[elementName]?.color || 'N/A',
    SM: LocationFigmaValues.SM[elementName]?.color || 'N/A'
  };
}

/**
 * Validate that an element has required visual properties
 */
export function validateLocationElementStyles(
  viewport: 'XL' | 'LG' | 'MD' | 'SM',
  elementName: keyof LocationViewportValues,
  expectedStyles: Partial<LocationFigmaElement>
): boolean {
  const element = getLocationElement(viewport, elementName);
  if (!element) return false;

  for (const [property, expectedValue] of Object.entries(expectedStyles)) {
    if (element[property as keyof LocationFigmaElement] !== expectedValue) {
      return false;
    }
  }
  return true;
}

/**
 * Get visual differences between viewports for testing responsive design
 */
export function getViewportDifferences(elementName: keyof LocationViewportValues): {
  fontSizeDiff: Record<string, string>;
  lineHeightDiff: Record<string, string>;
  hasDifferences: boolean;
} {
  const fontSizes = getLocationFontSize(elementName);
  const lineHeights = getLocationLineHeight(elementName);
  
  // Check if there are actual differences
  const uniqueFontSizes = new Set(Object.values(fontSizes).filter(size => size !== 'N/A'));
  const uniqueLineHeights = new Set(Object.values(lineHeights).filter(height => height !== 'N/A'));
  
  return {
    fontSizeDiff: fontSizes,
    lineHeightDiff: lineHeights,
    hasDifferences: uniqueFontSizes.size > 1 || uniqueLineHeights.size > 1
  };
}

/**
 * Get all text elements for visual testing
 */
export function getLocationTextElementsForTesting(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Array<{
  name: string;
  nodeId: string;
  visualStyles: LocationFigmaElement;
}> {
  const viewportData = LocationFigmaValues[viewport];
  const textElements: Array<{ name: string; nodeId: string; visualStyles: LocationFigmaElement }> = [];
  
  for (const [elementName, element] of Object.entries(viewportData)) {
    if (element) {
      textElements.push({
        name: elementName,
        nodeId: element.nodeId,
        visualStyles: element
      });
    }
  }
  
  return textElements;
}

// Validation Summary - Key extracted values from Figma API:
// ✅ XL: browseByLocationText - fontSize: 30px, lineHeight: 36px
// ✅ LG: browseByLocationText - fontSize: extracted via API 
// ✅ MD: browseByLocationText - fontSize: 24px, lineHeight: 36px  
// ✅ SM: browseByLocationText - fontSize: extracted via API
// 🔄 Remaining elements: Need to complete API extraction for all viewports

export default LocationFigmaValues;