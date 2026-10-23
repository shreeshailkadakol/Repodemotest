/**
 * Figma Values Extractor
 * 
 * Extracts design values from Figma components and generates TypeScript/JSON files
 * for automated testing and design-to-code validation.
 * 
 * Usage: npx tsx figma-extractor.ts <fileKey> <nodeId> <token> [componentName]
 */

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

interface FigmaElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  nodePath: string;
  textContent?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  backgroundColor?: string;
  visible: boolean;
}

interface FigmaApiResponse {
  nodes: {
    [key: string]: {
      document: any;
    };
  };
}

class FigmaExtractor {
  private accessToken: string;
  private fileKey: string;

  constructor(accessToken: string, fileKey: string) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
  }

  /**
   * Fetch nodes from Figma API
   */
  private async fetchNodes(nodeIds: string[]): Promise<FigmaApiResponse> {
    const url = `https://api.figma.com/v1/files/${this.fileKey}/nodes?ids=${nodeIds.join(',')}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-Figma-Token': this.accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch Figma data: ${errorMessage}`);
    }
  }

  /**
   * Extract styling information from a Figma node
   */
  private extractStyles(node: any): Partial<FigmaElement> {
    const styles: Partial<FigmaElement> = {};

    // Text styling
    if (node.style) {
      styles.fontFamily = node.style.fontFamily;
      styles.fontSize = node.style.fontSize ? `${node.style.fontSize}px` : undefined;
      styles.fontWeight = node.style.fontWeight?.toString();
      
      // Line height calculation
      if (node.style.lineHeightPx) {
        styles.lineHeight = `${node.style.lineHeightPx}px`;
      } else if (node.style.lineHeightPercent) {
        const calculated = (node.style.fontSize || 16) * (node.style.lineHeightPercent / 100);
        styles.lineHeight = `${Math.round(calculated)}px`;
      }

      styles.letterSpacing = node.style.letterSpacing ? `${node.style.letterSpacing}px` : undefined;
    }

    // Color extraction from fills
    if (node.fills?.length > 0) {
      const solidFill = node.fills.find((fill: any) => fill.type === 'SOLID');
      if (solidFill?.color) {
        const { r, g, b } = solidFill.color;
        const a = solidFill.opacity || 1;
        styles.color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }

    // Dimensions and position
    if (node.absoluteBoundingBox) {
      const box = node.absoluteBoundingBox;
      styles.width = Math.round(box.width);
      styles.height = Math.round(box.height);
      styles.x = Math.round(box.x);
      styles.y = Math.round(box.y);
    }

    return styles;
  }

  /**
   * Recursively traverse node tree and extract all elements
   */
  private traverseNode(
    node: any, 
    pathComponents: string[] = [], 
    allElements: FigmaElement[] = []
  ): FigmaElement[] {
    const currentPath = [...pathComponents, `${node.type}:${node.name}`];
    const nodePath = currentPath.join(' > ');

    // Create element data
    const element: FigmaElement = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      nodePath: nodePath,
      textContent: node.type === 'TEXT' ? node.characters : undefined,
      visible: node.visible !== false,
      ...this.extractStyles(node),
    };

    // Include meaningful elements
    const meaningfulTypes = ['TEXT', 'FRAME', 'COMPONENT', 'INSTANCE', 'VECTOR', 'RECTANGLE', 'ELLIPSE'];
    if (meaningfulTypes.includes(node.type)) {
      allElements.push(element);
    }

    // Traverse children recursively
    if (node.children) {
      for (const child of node.children) {
        this.traverseNode(child, currentPath, allElements);
      }
    }

    return allElements;
  }

  /**
   * Extract all elements from a viewport/component node
   */
  async extractElements(nodeId: string): Promise<FigmaElement[]> {
    const figmaData = await this.fetchNodes([nodeId]);
    const nodeData = figmaData.nodes[nodeId];

    if (!nodeData?.document) {
      throw new Error(`Node ${nodeId} not found in Figma file ${this.fileKey}`);
    }

    return this.traverseNode(nodeData.document);
  }

  /**
   * Generate TypeScript output file
   */
  generateTypeScriptFile(
    elements: FigmaElement[], 
    componentName: string, 
    outputFile: string
  ): void {
    const content = `// Auto-generated Figma Values
// Generated: ${new Date().toISOString()}
// Component: ${componentName}
// Elements: ${elements.length}

export interface FigmaElement {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  nodePath: string;
  textContent?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  backgroundColor?: string;
  visible: boolean;
}

export const ${componentName}Elements: FigmaElement[] = ${JSON.stringify(elements, null, 2)};

// Helper Functions
export function getElementByNodeId(nodeId: string): FigmaElement | undefined {
  return ${componentName}Elements.find(el => el.nodeId === nodeId);
}

export function getElementByName(name: string): FigmaElement | undefined {
  return ${componentName}Elements.find(el => 
    el.nodeName.toLowerCase().includes(name.toLowerCase())
  );
}

export function getTextElements(): FigmaElement[] {
  return ${componentName}Elements.filter(el => el.nodeType === 'TEXT');
}

export function getElementsByType(type: string): FigmaElement[] {
  return ${componentName}Elements.filter(el => el.nodeType === type.toUpperCase());
}

export function generatePlaywrightSelectors(): Array<{
  nodeId: string;
  selector: string;
  name: string;
  type: string;
}> {
  return ${componentName}Elements.map(el => ({
    nodeId: el.nodeId,
    selector: \`[data-figma-node-id="\${el.nodeId}"]\`,
    name: el.nodeName,
    type: el.nodeType
  }));
}

export default ${componentName}Elements;
`;

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, content);
  }

  /**
   * Generate JSON output file
   */
  generateJsonFile(
    elements: FigmaElement[], 
    componentName: string, 
    outputFile: string,
    metadata: Record<string, any> = {}
  ): void {
    const data = {
      timestamp: new Date().toISOString(),
      fileKey: this.fileKey,
      componentName: componentName,
      totalElements: elements.length,
      metadata: metadata,
      elements: elements
    };

    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log(`
🎯 Figma Values Extractor

USAGE:
  npx tsx figma-extractor.ts <fileKey> <nodeId> <token> [componentName]

PARAMETERS:
  fileKey        Figma file key (from URL)
  nodeId         Component/viewport node ID  
  token          Your Figma access token
  componentName  Component name (optional, default: "Component")

EXAMPLES:
  # Extract Search component
  npx tsx figma-extractor.ts fiKrYZCKNM1OqXHQoGwrlX 4528:158908 figd_xxxxx SearchComponent
  
  # Extract Header component
  npx tsx figma-extractor.ts myFileKey 123:456789 figd_xxxxx HeaderComponent

OUTPUTS:
  ./figma-values/ComponentName_Values.ts   - TypeScript with helpers
  ./figma-values/ComponentName_Values.json - Raw JSON data

HOW TO GET NODE ID:
  1. Open Figma file
  2. Select component/viewport  
  3. Copy node ID from URL: ?node-id=4528-158908 → 4528:158908
`);
    process.exit(1);
  }

  const [fileKey, nodeId, token, componentName = 'Component'] = args;

  console.log('🚀 Figma Values Extractor');
  console.log(`📁 File: ${fileKey}`);
  console.log(`🎯 Node: ${nodeId}`);
  console.log(`📦 Component: ${componentName}`);

  try {
    // Initialize extractor
    const extractor = new FigmaExtractor(token, fileKey);

    // Extract elements
    console.log('\n📡 Fetching Figma data...');
    const elements = await extractor.extractElements(nodeId);
    console.log(`✅ Extracted ${elements.length} elements`);

    if (elements.length === 0) {
      console.log('⚠️ No elements found in node');
      return;
    }

    // Generate element type breakdown
    const typeBreakdown = elements.reduce((acc, el) => {
      acc[el.nodeType] = (acc[el.nodeType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Element Types:');
    for (const [type, count] of Object.entries(typeBreakdown)) {
      console.log(`   ${type}: ${count}`);
    }

    // Generate output files
    const outputDir = './figma-values';
    const tsFile = `${outputDir}/${componentName}_Values.ts`;
    const jsonFile = `${outputDir}/${componentName}_Values.json`;

    console.log('\n📝 Generating files...');
    extractor.generateTypeScriptFile(elements, componentName, tsFile);
    extractor.generateJsonFile(elements, componentName, jsonFile, {
      nodeId: nodeId,
      extractedAt: new Date().toISOString(),
      typeBreakdown: typeBreakdown
    });

    console.log('\n✅ EXTRACTION COMPLETED!');
    console.log(`📄 TypeScript: ${tsFile}`);
    console.log(`📄 JSON: ${jsonFile}`);
    console.log(`📊 Elements: ${elements.length}`);

    // Show preview of key elements
    const textElements = elements.filter(el => el.nodeType === 'TEXT');
    if (textElements.length > 0) {
      console.log(`\n📝 Text Elements (${textElements.length}):`);
      for (let i = 0; i < Math.min(3, textElements.length); i++) {
        const el = textElements[i];
        console.log(`   "${el.textContent}" (${el.nodeId})`);
      }
      if (textElements.length > 3) {
        console.log(`   ... and ${textElements.length - 3} more`);
      }
    }

  } catch (error: any) {
    console.error('\n❌ EXTRACTION FAILED');
    console.error(`Error: ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('• Check your Figma access token');
    console.error('• Verify the file key and node ID');  
    console.error('• Ensure node exists in the Figma file');
    process.exit(1);
  }
}

// Execute main function
main().catch(console.error);