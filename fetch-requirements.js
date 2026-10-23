#!/usr/bin/env node

/**
 * Azure DevOps Requirements Fetcher CLI
 * 
 * Usage:
 *   npm run fetch-requirements <work-item-id>
 *   npm run fetch-requirements <work-item-url>
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Azure DevOps Requirements Fetcher (JavaScript Version)
 */
class AzureDevOpsRequirements {
  constructor() {
    this.config = {
      organization: process.env.AZURE_DEVOPS_ORGANIZATION || 'Bayer-SMO-UniNetHub',
      project: process.env.AZURE_DEVOPS_PROJECT || 'BayCorpWeb',
      pat: process.env.AZURE_DEVOPS_PAT,
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
  async fetchWorkItem(workItemId) {
    try {
      const apiUrl = `https://dev.azure.com/${this.config.organization}/${this.config.project}/_apis/wit/workitems/${workItemId}?api-version=6.0`;
      
      console.log(`Fetching work item ${workItemId} from Azure DevOps...`);
      
      const fetch = (await import('node-fetch')).default;
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
      const workItem = {
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
   * Clean HTML content and convert to markdown-friendly format
   * Implements secure HTML sanitization to prevent XSS vulnerabilities
   */
  cleanHtml(htmlContent) {
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
  async saveRequirementToFile(workItem, outputDir = './docs/requirements') {
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
  generateRequirementMarkdown(workItem) {
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
  formatAdditionalFields(fields) {
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
   * Generate testing recommendations based on requirement analysis
   */
  generateTestingRecommendations(workItem) {
    const recommendations = [];
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
    
    // Always include these standard recommendations
    recommendations.push('Accessibility: Validate keyboard navigation, screen reader support, and ARIA attributes');
    recommendations.push('Performance: Measure loading times and interaction response times');
    recommendations.push('Cross-browser: Test across different browsers and devices');

    return recommendations;
  }

  /**
   * Extract component name from work item
   */
  extractComponentName(workItem) {
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

  /**
   * Analyze requirement for test automation
   */
  async analyzeRequirement(workItemId) {
    const workItem = await this.fetchWorkItem(workItemId);
    const testingRecommendations = this.generateTestingRecommendations(workItem);
    const componentName = this.extractComponentName(workItem);

    return {
      workItem,
      testingRecommendations,
      componentName
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Azure DevOps Requirements Fetcher

Usage: 
  npm run fetch-requirements <work-item-id>
  npm run fetch-requirements "<work-item-url>"

Examples:
  npm run fetch-requirements 12345
  npm run fetch-requirements "https://dev.azure.com/Bayer-SMO-UniNetHub/BayCorpWeb/_workitems/edit/12345"

This will:
- Fetch Description and Acceptance Criteria from Azure DevOps
- Generate testing recommendations based on content analysis
- Save requirement as markdown file in docs/requirements/
- Extract component name for test automation
`);
    process.exit(1);
  }

  try {
    const fetcher = new AzureDevOpsRequirements();
    const workItemId = parseInt(args[0]);
    
    console.log('Fetching requirement from Azure DevOps...\n');
    
    const result = await fetcher.analyzeRequirement(workItemId);
    
    console.log('REQUIREMENT ANALYSIS COMPLETE\n');
    console.log(`Component: ${result.componentName}`);
    console.log(`Title: ${result.workItem.title}`);
    console.log(`Type: ${result.workItem.workItemType}`);
    console.log(`State: ${result.workItem.state}\n`);
    
    console.log('TESTING RECOMMENDATIONS:');
    result.testingRecommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    
    // Save to file
    const filePath = await fetcher.saveRequirementToFile(result.workItem);
    console.log(`\nSAVED TO FILE: ${filePath}`);
    
    console.log(`\nNext Steps:`);
    console.log(`   1. Review the generated requirement file`);
    console.log(`   2. Update componentURL.ts with the component URL`);
    console.log(`   3. Follow the playwright-prompt.md process for test creation`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();