import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Azure DevOps Requirements Fetcher
 * 
 * This script fetches requirements from Azure DevOps work items including:
 * - Description field
 * - Acceptance Criteria field
 * - Other relevant fields for test automation
 */

interface AzureDevOpsConfig {
  organization: string;
  project: string;
  pat: string;
  baseUrl: string;
}

interface WorkItemField {
  field: string;
  value: string | null;
}

interface WorkItem {
  id: number;
  title: string;
  workItemType: string;
  state: string;
  description: string;
  acceptanceCriteria: string;
  fields: Record<string, any>;
}

export class AzureDevOpsRequirements {
  private config: AzureDevOpsConfig;
  private authHeader: string;

  constructor() {
    this.config = {
      organization: process.env.AZURE_DEVOPS_ORGANIZATION || 'Bayer-SMO-UniNetHub',
      project: process.env.AZURE_DEVOPS_PROJECT || 'BayCorpWeb',
      pat: process.env.AZURE_DEVOPS_PAT || '',
      baseUrl: process.env.AZURE_DEVOPS_BASE_URL || 'https://dev.azure.com/Bayer-SMO-UniNetHub/BayCorpWeb'
    };
    
    if (!this.config.pat) {
      throw new Error('AZURE_DEVOPS_PAT environment variable is required. Please set it in .env file.');
    }
    
    // Create base64 encoded auth header for PAT
    this.authHeader = 'Basic ' + Buffer.from(':' + this.config.pat).toString('base64');
  }

  /**
   * Fetch work item by ID from Azure DevOps
   */
  async fetchWorkItem(workItemId: number): Promise<WorkItem> {
    try {
      const apiUrl = `https://dev.azure.com/${this.config.organization}/${this.config.project}/_apis/wit/workitems/${workItemId}?api-version=6.0`;
      
      console.log(`Fetching work item ${workItemId} from Azure DevOps...`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch work item: ${response.status} ${response.statusText}`);
      }

      const workItemData = await response.json();
      
      // Extract relevant fields
      const workItem: WorkItem = {
        id: workItemData.id,
        title: workItemData.fields['System.Title'] || '',
        workItemType: workItemData.fields['System.WorkItemType'] || '',
        state: workItemData.fields['System.State'] || '',
        description: this.cleanHtml(workItemData.fields['System.Description'] || ''),
        acceptanceCriteria: this.cleanHtml(workItemData.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || ''),
        fields: workItemData.fields
      };

      console.log(`Successfully fetched work item: ${workItem.title}`);
      return workItem;

    } catch (error) {
      console.error('Error fetching work item:', error);
      throw error;
    }
  }

  /**
   * Fetch work item by URL
   */
  async fetchWorkItemByUrl(workItemUrl: string): Promise<WorkItem> {
    // Extract work item ID from URL
    const workItemIdMatch = workItemUrl.match(/workitems\/edit\/(\d+)/);
    if (!workItemIdMatch) {
      throw new Error('Invalid work item URL format. Expected format: https://dev.azure.com/org/project/_workitems/edit/123');
    }

    const workItemId = parseInt(workItemIdMatch[1]);
    return await this.fetchWorkItem(workItemId);
  }

  /**
   * Clean HTML content and convert to markdown-friendly format
   * Implements secure HTML sanitization to prevent XSS vulnerabilities
   */
  private cleanHtml(htmlContent: string): string {
    if (!htmlContent) return '';
    
    // First, normalize the input to prevent injection attacks
    let cleaned = String(htmlContent);
    
    // Remove potentially dangerous HTML elements and attributes
    cleaned = cleaned
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '') // Remove iframe tags
      .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '') // Remove object tags
      .replace(/<embed[^>]*>/gi, '') // Remove embed tags
      .replace(/<link[^>]*>/gi, '') // Remove link tags
      .replace(/<meta[^>]*>/gi, '') // Remove meta tags
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:/gi, ''); // Remove data: protocol
    
    // Convert HTML structure to markdown while preserving formatting
    cleaned = cleaned
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<div[^>]*>/gi, '\n')
      .replace(/<\/div>/gi, '')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<ul[^>]*>|<\/ul>/gi, '')
      .replace(/<ol[^>]*>|<\/ol>/gi, '')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags
    
    // Decode HTML entities in the correct order to prevent double-unescaping
    // Process specific entities first, then &amp; last to avoid creating new entities
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&'); // Process &amp; last to prevent double-decoding
    
    // Clean up excessive whitespace and normalize line breaks
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .trim();
    
    return cleaned;
  }

  /**
   * Save requirement to markdown file
   */
  async saveRequirementToFile(workItem: WorkItem, outputDir: string = './docs/requirements'): Promise<string> {
    try {
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileName = `requirement-${workItem.id}-${workItem.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.md`;
      const filePath = path.join(outputDir, fileName);

      const content = this.generateRequirementMarkdown(workItem);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Requirement saved to: ${filePath}`);
      
      return filePath;
    } catch (error) {
      console.error('Error saving requirement file:', error);
      throw error;
    }
  }

  /**
   * Generate markdown content for requirement
   */
  private generateRequirementMarkdown(workItem: WorkItem): string {
    const timestamp = new Date().toISOString();
    
    return `# Requirement Analysis - ${workItem.title}

## Work Item Details
- **Work Item ID**: ${workItem.id}
- **Title**: ${workItem.title}
- **Type**: ${workItem.workItemType}
- **State**: ${workItem.state}
- **Fetched On**: ${timestamp}

## Description
${workItem.description || 'No description provided'}

## Acceptance Criteria
${workItem.acceptanceCriteria || 'No acceptance criteria provided'}

## Additional Fields
${this.formatAdditionalFields(workItem.fields)}

---
*This requirement was automatically fetched from Azure DevOps*
`;
  }

  /**
   * Format additional relevant fields
   */
  private formatAdditionalFields(fields: Record<string, any>): string {
    const relevantFields = [
      'System.AssignedTo',
      'System.CreatedBy',
      'System.CreatedDate',
      'System.ChangedDate',
      'Microsoft.VSTS.Common.Priority',
      'Microsoft.VSTS.Common.Severity',
      'System.Tags'
    ];

    let output = '';
    for (const fieldName of relevantFields) {
      if (fields[fieldName]) {
        const displayName = fieldName.split('.').pop();
        const value = typeof fields[fieldName] === 'object' ? fields[fieldName].displayName || fields[fieldName].name : fields[fieldName];
        output += `- **${displayName}**: ${value}\n`;
      }
    }
    
    return output || 'No additional fields available';
  }

  /**
   * Fetch and analyze requirement for test automation
   */
  async analyzeRequirement(workItemUrlOrId: string | number): Promise<{
    workItem: WorkItem;
    testingRecommendations: string[];
    componentName: string;
  }> {
    let workItem: WorkItem;
    
    if (typeof workItemUrlOrId === 'string') {
      workItem = await this.fetchWorkItemByUrl(workItemUrlOrId);
    } else {
      workItem = await this.fetchWorkItem(workItemUrlOrId);
    }

    // Generate testing recommendations based on content analysis
    const testingRecommendations = this.generateTestingRecommendations(workItem);
    
    // Extract component name from title or description
    const componentName = this.extractComponentName(workItem);

    return {
      workItem,
      testingRecommendations,
      componentName
    };
  }

  /**
   * Generate testing recommendations based on requirement analysis
   */
  private generateTestingRecommendations(workItem: WorkItem): string[] {
    const recommendations: string[] = [];
    const content = `${workItem.title} ${workItem.description} ${workItem.acceptanceCriteria}`.toLowerCase();

    // Functional testing recommendations
    if (content.includes('click') || content.includes('button') || content.includes('interact')) {
      recommendations.push('Functional: Validate click interactions and button behaviors');
    }
    
    if (content.includes('overlay') || content.includes('modal') || content.includes('popup')) {
      recommendations.push('Functional: Test overlay/modal opening, closing, and content validation');
    }
    
    if (content.includes('dropdown') || content.includes('select') || content.includes('list')) {
      recommendations.push('Functional: Validate dropdown/selection functionality and options');
    }

    // Visual testing recommendations
    if (content.includes('color') || content.includes('font') || content.includes('style')) {
      recommendations.push('Visual: Validate visual design elements (colors, fonts, styling)');
    }
    
    // Accessibility recommendations
    recommendations.push('Accessibility: Validate keyboard navigation, screen reader support, and ARIA attributes');
    
    // Performance recommendations  
    if (content.includes('load') || content.includes('performance') || content.includes('speed')) {
      recommendations.push('Performance: Measure loading times and interaction response times');
    }

    // Cross-browser recommendations
    recommendations.push('Cross-browser: Test across different browsers and devices');

    return recommendations;
  }

  /**
   * Extract component name from work item
   */
  private extractComponentName(workItem: WorkItem): string {
    const title = workItem.title.toLowerCase();
    
    // Common component patterns
    const patterns = [
      /(\w+)\s+component/,
      /(\w+)\s+selector/,
      /(\w+)\s+overlay/,
      /(\w+)\s+modal/,
      /(\w+)\s+banner/,
      /(\w+)\s+header/,
      /(\w+)\s+footer/
    ];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1) + 'Component';
      }
    }

    // Fallback: use first word of title
    const firstWord = workItem.title.split(' ')[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1) + 'Component';
  }
}

// CLI usage example
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: 
  node azureDevOpsRequirements.js <work-item-id>
  node azureDevOpsRequirements.js <work-item-url>

Examples:
  node azureDevOpsRequirements.js 12345
  node azureDevOpsRequirements.js "https://dev.azure.com/Bayer-SMO-UniNetHub/BayCorpWeb/_workitems/edit/12345"
`);
    process.exit(1);
  }

  const fetcher = new AzureDevOpsRequirements();
  const workItemInput = isNaN(parseInt(args[0])) ? args[0] : parseInt(args[0]);
  
  fetcher.analyzeRequirement(workItemInput)
    .then(async (result) => {
      console.log('\n=== REQUIREMENT ANALYSIS ===');
      console.log(`Component: ${result.componentName}`);
      console.log(`Title: ${result.workItem.title}`);
      console.log(`Type: ${result.workItem.workItemType}`);
      console.log(`State: ${result.workItem.state}`);
      
      console.log('\n=== TESTING RECOMMENDATIONS ===');
      result.testingRecommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
      
      // Save to file
      const filePath = await fetcher.saveRequirementToFile(result.workItem);
      console.log(`\n=== SAVED TO FILE ===`);
      console.log(`File: ${filePath}`);
    })
    .catch(console.error);
}