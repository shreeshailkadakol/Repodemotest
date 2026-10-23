import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Essential Figma API Client for fetching node data
 *
 * Features:
 * - Basic node fetching with parseFigmaTextStyles()
 * - Debug color extraction with findTextNodesWithColors()
 * - Full analysis with debugFigmaColorExtraction()
 */

export interface FigmaNodeData {
  id: string;
  name: string;
  type: string;
  styles: any;
  document?: any; // Full document structure for traversal
}

/**
 * Figma API client for making authenticated requests
 */
class FigmaAPIClient {
  private readonly baseURL = 'https://api.figma.com/v1';
  private readonly token: string;

  constructor() {
    this.token = process.env.FIGMA_TOKEN || '';
    if (!this.token) {
      throw new Error('FIGMA_TOKEN environment variable is required');
    }
  }

  /**
   * Make authenticated request to Figma API
   */
  private async makeRequest(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'X-Figma-Token': this.token,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Figma API request failed: ${error.response?.status} ${error.response?.statusText}`
        );
      }
      throw error;
    }
  }

  /**
   * Fetch specific nodes from a Figma file
   */
  async getNodes(fileId: string, nodeIds: string[]): Promise<any> {
    const nodeIdsParam = nodeIds.join(',');
    return this.makeRequest(`/files/${fileId}/nodes?ids=${nodeIdsParam}`);
  }
}

/**
 * Parse Figma text styles to extract relevant CSS properties
 */
function parseFigmaTextStyles(node: any): any {
  const style = node.style || {};
  const fills = node.fills || [];

  // Extract color from fills
  let color;
  const solidFill = fills.find((fill: any) => fill.type === 'SOLID');
  if (solidFill) {
    const { r, g, b, a = 1 } = solidFill.color;
    color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }

  return {
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontFamily: style.fontFamily || undefined,
    fontWeight: style.fontWeight || undefined,
    lineHeight: style.lineHeightPx ? `${style.lineHeightPx}px` : undefined,
    color,
    letterSpacing: style.letterSpacing || undefined,
  };
}

/**
 * Debug method to find and extract text nodes with detailed color information
 * Useful for troubleshooting color extraction from complex Figma structures
 */
export function findTextNodesWithColors(
  node: any,
  path: string = ''
): Array<{ path: string; content: string; color: string; style: any }> {
  const textNodes: Array<{ path: string; content: string; color: string; style: any }> = [];

  if (!node) return textNodes;

  const currentPath = path ? `${path} > ${node.name}` : node.name;

  if (node.type === 'TEXT') {
    let color = 'unknown';

    // Extract color manually for debugging
    if (node.fills && node.fills.length > 0) {
      const solidFill = node.fills.find((fill: any) => fill.type === 'SOLID');
      if (solidFill && solidFill.color) {
        const { r, g, b, a = 1 } = solidFill.color;
        color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
      }
    }

    textNodes.push({
      path: currentPath,
      content: node.characters || '',
      color,
      style: node.style || {},
    });
  }

  if (node.children) {
    node.children.forEach((child: any) => {
      textNodes.push(...findTextNodesWithColors(child, currentPath));
    });
  }

  return textNodes;
}

/**
 * Debug and analyze Figma nodes to extract all text elements and their colors
 * This method provides detailed inspection capabilities for troubleshooting
 */
export async function debugFigmaColorExtraction(nodeIds: string[]): Promise<void> {
  try {
    console.log('🔍 Fetching raw Figma data for color extraction debug...');

    const response = await fetchFigmaNodes(nodeIds);

    console.log('📋 Raw Figma Response Summary:');
    response.forEach((nodeData) => {
      console.log(`\n🔍 Analyzing node: ${nodeData.name} (${nodeData.id})`);

      const textNodes = findTextNodesWithColors(nodeData.document);

      textNodes.forEach((textNode) => {
        console.log(`\n📝 TEXT NODE: ${textNode.path}`);
        console.log(`   Content: "${textNode.content}"`);
        console.log(`   🎨 Extracted Color: ${textNode.color}`);
        console.log(`   Style:`, textNode.style);
      });

      if (textNodes.length === 0) {
        console.log('   ⚠️ No text nodes found in this node');
      }
    });
  } catch (error) {
    console.error('❌ Error in debug color extraction:', error);
    throw error;
  }
}

/**
 * Fetch multiple nodes from Figma with full document structure
 */
export async function fetchFigmaNodes(nodeIds: string[]): Promise<FigmaNodeData[]> {
  const fileId = process.env.FIGMA_FILE_ID;
  if (!fileId) {
    throw new Error('FIGMA_FILE_ID environment variable is required');
  }

  const client = new FigmaAPIClient();

  try {
    const response = await client.getNodes(fileId, nodeIds);

    return nodeIds.map((nodeId) => {
      const nodeData = response.nodes[nodeId];
      if (!nodeData) {
        throw new Error(`Node ${nodeId} not found in Figma file`);
      }

      const document = nodeData.document;
      const styles = parseFigmaTextStyles(document);

      return {
        id: nodeId,
        name: document.name || 'Unknown',
        type: document.type || 'Unknown',
        styles,
        document: document, // Include full document for traversal
      };
    });
  } catch (error) {
    console.error('Error fetching Figma nodes:', error);
    throw error;
  }
}
