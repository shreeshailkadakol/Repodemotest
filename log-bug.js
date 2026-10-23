#!/usr/bin/env node

/**
 * Azure DevOps Bug Logger
 * 
 * Creates bug work items in Azure DevOps with proper formatting
 * Supports title, reproduction steps, screenshots, and tagging
 * 
 * Usage:
 *   npm run log-bug --title="Bug Title" --steps="Step 1|Step 2|Step 3" --screenshots="path1,path2" --tags="bug,ui"
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

class AzureDevOpsBugLogger {
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
   * Create a new bug work item in Azure DevOps
   */
  async createBug(bugData) {
    try {
      const apiUrl = `https://dev.azure.com/${this.config.organization}/${this.config.project}/_apis/wit/workitems/$Bug?api-version=6.0`;
      
      console.log('Creating bug in Azure DevOps...');
      
      // Format the bug fields for Azure DevOps
      const workItemFields = this.formatBugFields(bugData);
      
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json-patch+json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(workItemFields)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create bug: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const createdBug = await response.json();
      
      console.log(`Bug created successfully: #${createdBug.id}`);
      console.log(`URL: ${this.config.baseUrl}/_workitems/edit/${createdBug.id}`);
      
      // Upload screenshots if provided
      if (bugData.screenshots && bugData.screenshots.length > 0) {
        await this.attachScreenshots(createdBug.id, bugData.screenshots);
      }
      
      // Link to parent story if provided
      if (bugData.parentStory) {
        await this.linkToParentStory(createdBug.id, bugData.parentStory);
      }
      
      return createdBug;

    } catch (error) {
      console.error('Error creating bug:', error.message);
      throw error;
    }
  }

  /**
   * Format bug data into Azure DevOps patch format
   */
  formatBugFields(bugData) {
    const fields = [];
    
    // Title (required)
    fields.push({
      op: 'add',
      path: '/fields/System.Title',
      value: bugData.title || 'Untitled Bug'
    });
    
    // Work Item Type
    fields.push({
      op: 'add',
      path: '/fields/System.WorkItemType',
      value: 'Bug'
    });
    
    // Description with formatted reproduction steps
    const description = this.formatDescription(bugData);
    fields.push({
      op: 'add',
      path: '/fields/System.Description',
      value: description
    });
    
    // Reproduction Steps (specific field for bugs)
    if (bugData.reproSteps) {
      const formattedSteps = this.formatReproductionSteps(bugData.reproSteps);
      fields.push({
        op: 'add',
        path: '/fields/Microsoft.VSTS.TCM.ReproSteps',
        value: formattedSteps
      });
    }
    
    // Priority (default to 2 if not specified)
    fields.push({
      op: 'add',
      path: '/fields/Microsoft.VSTS.Common.Priority',
      value: bugData.priority || 2
    });
    
    // Severity (default to 3 if not specified)
    fields.push({
      op: 'add',
      path: '/fields/Microsoft.VSTS.Common.Severity',
      value: bugData.severity || '3 - Medium'
    });
    
    // Tags - REMOVED: No longer adding tags to bugs
    // if (bugData.tags) {
    //   const tagsString = Array.isArray(bugData.tags) ? bugData.tags.join('; ') : bugData.tags;
    //   fields.push({
    //     op: 'add',
    //     path: '/fields/System.Tags',
    //     value: tagsString
    //   });
    // }
    
    // Area Path (if specified)
    if (bugData.areaPath) {
      fields.push({
        op: 'add',
        path: '/fields/System.AreaPath',
        value: bugData.areaPath
      });
    }
    
    // Iteration Path (if specified)
    if (bugData.iterationPath) {
      fields.push({
        op: 'add',
        path: '/fields/System.IterationPath',
        value: bugData.iterationPath
      });
    }
    
    // Environment (where bug was found)
    if (bugData.environment) {
      fields.push({
        op: 'add',
        path: '/fields/Microsoft.VSTS.TCM.SystemInfo',
        value: bugData.environment
      });
    }
    
    // Browser/Device info is included in description, no separate field needed
    
    return fields;
  }

  /**
   * Format the main description with structured sections
   */
  formatDescription(bugData) {
    let description = '<div>';
    
    // Bug Summary
    description += '<h3>🐛 Bug Summary</h3>';
    description += `<p>${bugData.summary || 'Brief description of the issue'}</p>`;
    
    // Expected vs Actual Behavior
    if (bugData.expectedBehavior || bugData.actualBehavior) {
      description += '<h3>📋 Expected vs Actual Behavior</h3>';
      description += '<table border="1" style="border-collapse: collapse; width: 100%;">';
      description += '<tr><th style="padding: 8px; background-color: #f0f0f0;">Expected Behavior</th><th style="padding: 8px; background-color: #f0f0f0;">Actual Behavior</th></tr>';
      description += `<tr><td style="padding: 8px;">${bugData.expectedBehavior || 'Not specified'}</td><td style="padding: 8px;">${bugData.actualBehavior || 'Not specified'}</td></tr>`;
      description += '</table>';
    }
    
    // Test Environment
    if (bugData.environment || bugData.browserInfo) {
      description += '<h3>🖥️ Test Environment</h3>';
      description += '<ul>';
      if (bugData.environment) {
        description += `<li><strong>Environment:</strong> ${bugData.environment}</li>`;
      }
      if (bugData.browserInfo) {
        description += `<li><strong>Browser/Device:</strong> ${bugData.browserInfo}</li>`;
      }
      if (bugData.url) {
        description += `<li><strong>Test Page URL:</strong> <a href="${bugData.url}">${bugData.url}</a></li>`;
      }
      if (bugData.figmaUrl) {
        description += `<li><strong>Figma Design:</strong> <a href="${bugData.figmaUrl}">${bugData.figmaUrl}</a></li>`;
      }
      description += '</ul>';
    }
    
    // Impact/Business Effect
    if (bugData.impact) {
      description += '<h3>⚠️ Impact</h3>';
      description += `<p>${bugData.impact}</p>`;
    }
    
    // Additional Notes
    if (bugData.additionalNotes) {
      description += '<h3>📝 Additional Notes</h3>';
      description += `<p>${bugData.additionalNotes}</p>`;
    }
    
    description += '</div>';
    return description;
  }

  /**
   * Format reproduction steps into numbered HTML list
   */
  formatReproductionSteps(steps) {
    let formattedSteps = '<div><h3>🔄 Steps to Reproduce</h3><ol>';
    
    // Handle different input formats
    let stepArray;
    if (Array.isArray(steps)) {
      stepArray = steps;
    } else if (typeof steps === 'string') {
      // Split by pipe, newline, or numbered format
      stepArray = steps.split(/\||\n|(?=\d+\.)/g)
        .map(step => step.trim())
        .filter(step => step.length > 0)
        .map(step => step.replace(/^\d+\.\s*/, ''));
    } else {
      stepArray = ['Step not provided'];
    }
    
    stepArray.forEach(step => {
      formattedSteps += `<li>${step}</li>`;
    });
    
    formattedSteps += '</ol></div>';
    return formattedSteps;
  }

  /**
   * Attach screenshots to the bug work item
   */
  async attachScreenshots(workItemId, screenshots) {
    try {
      console.log(`Attaching ${screenshots.length} screenshot(s) to bug #${workItemId}...`);
      
      for (let i = 0; i < screenshots.length; i++) {
        const screenshotPath = screenshots[i].trim();
        
        if (!fs.existsSync(screenshotPath)) {
          console.warn(`Screenshot not found: ${screenshotPath}`);
          continue;
        }
        
        // Upload attachment
        const attachmentUrl = await this.uploadAttachment(screenshotPath);
        
        // Link attachment to work item
        await this.linkAttachmentToWorkItem(workItemId, attachmentUrl, path.basename(screenshotPath));
        
        console.log(`Attached: ${path.basename(screenshotPath)}`);
      }
      
    } catch (error) {
      console.error('Error attaching screenshots:', error.message);
    }
  }

  /**
   * Upload file as attachment to Azure DevOps
   */
  async uploadAttachment(filePath) {
    const apiUrl = `https://dev.azure.com/${this.config.organization}/${this.config.project}/_apis/wit/attachments?fileName=${encodeURIComponent(path.basename(filePath))}&api-version=6.0`;
    
    const fileBuffer = fs.readFileSync(filePath);
    
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/octet-stream'
      },
      body: fileBuffer
    });

    if (!response.ok) {
      throw new Error(`Failed to upload attachment: ${response.status} ${response.statusText}`);
    }

    const attachment = await response.json();
    return attachment.url;
  }

  /**
   * Link uploaded attachment to work item
   */
  async linkAttachmentToWorkItem(workItemId, attachmentUrl, fileName) {
    const apiUrl = `https://dev.azure.dev/${this.config.organization}/${this.config.project}/_apis/wit/workitems/${workItemId}?api-version=6.0`;
    
    const patchDocument = [
      {
        op: 'add',
        path: '/relations/-',
        value: {
          rel: 'AttachedFile',
          url: attachmentUrl,
          attributes: {
            comment: `Screenshot: ${fileName}`
          }
        }
      }
    ];

    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json-patch+json'
      },
      body: JSON.stringify(patchDocument)
    });

    if (!response.ok) {
      throw new Error(`Failed to link attachment: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Link bug to parent user story
   */
  async linkToParentStory(bugWorkItemId, parentStoryId) {
    try {
      console.log(`Linking bug #${bugWorkItemId} to User Story #${parentStoryId}...`);
      
      // Get parent story URL
      const storyUrl = `https://dev.azure.com/${this.config.organization}/${this.config.project}/_apis/wit/workitems/${parentStoryId}?api-version=6.0`;
      
      const fetch = (await import('node-fetch')).default;
      const storyResponse = await fetch(storyUrl, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Accept': 'application/json'
        }
      });

      if (!storyResponse.ok) {
        console.warn(`Warning: Could not fetch User Story #${parentStoryId}`);
        return;
      }

      const storyData = await storyResponse.json();
      
      // Link bug to parent story
      const bugUrl = `https://dev.azure.com/${this.config.organization}/${this.config.project}/_apis/wit/workitems/${bugWorkItemId}?api-version=6.0`;
      
      const linkOperations = [
        {
          op: 'add',
          path: '/relations/-',
          value: {
            rel: 'System.LinkTypes.Related',
            url: storyData.url,
            attributes: {
              comment: 'Parent User Story'
            }
          }
        }
      ];

      const linkResponse = await fetch(bugUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json-patch+json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(linkOperations)
      });

      if (!linkResponse.ok) {
        console.warn(`Warning: Failed to link to User Story #${parentStoryId}`);
      } else {
        console.log(`Linked to User Story #${parentStoryId}`);
      }
      
    } catch (error) {
      console.error('Error linking to parent story:', error.message);
    }
  }

  /**
   * Save bug data locally before creating in Azure DevOps
   */
  async saveBugDataLocally(bugData, workItemId = null) {
    try {
      const bugsDir = './docs/bugs';
      if (!fs.existsSync(bugsDir)) {
        fs.mkdirSync(bugsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `bug-${workItemId || timestamp}-${bugData.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.md`;
      const filePath = path.join(bugsDir, fileName);

      const content = this.generateBugMarkdown(bugData, workItemId);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Bug data saved locally: ${filePath}`);
      
      return filePath;
    } catch (error) {
      console.error('Error saving bug data locally:', error);
      throw error;
    }
  }

  /**
   * Generate markdown documentation for the bug
   */
  generateBugMarkdown(bugData, workItemId = null) {
    const timestamp = new Date().toISOString();
    
    return `# Bug Report${workItemId ? ` #${workItemId}` : ''}

## Bug Details
- **Title**: ${bugData.title}
- **Priority**: ${bugData.priority || 2}
- **Severity**: ${bugData.severity || '3 - Medium'}
- **Environment**: ${bugData.environment || 'Not specified'}
- **Created**: ${timestamp}
${workItemId ? `- **Azure DevOps ID**: ${workItemId}` : ''}
${workItemId ? `- **URL**: ${this.config.baseUrl}/_workitems/edit/${workItemId}` : ''}

## Summary
${bugData.summary || 'No summary provided'}

## Expected vs Actual Behavior
| Expected | Actual |
|----------|--------|
| ${bugData.expectedBehavior || 'Not specified'} | ${bugData.actualBehavior || 'Not specified'} |

## Reproduction Steps
${this.formatMarkdownSteps(bugData.reproSteps)}

## Test Environment
- **Environment**: ${bugData.environment || 'Not specified'}
- **Browser/Device**: ${bugData.browserInfo || 'Not specified'}
- **Test Page URL**: ${bugData.url || 'Not specified'}
${bugData.figmaUrl ? `- **Figma Design**: ${bugData.figmaUrl}` : ''}

## Impact
${bugData.impact || 'Not specified'}

## Screenshots
${bugData.screenshots ? bugData.screenshots.map(screenshot => `- ${screenshot}`).join('\n') : 'No screenshots provided'}

## Parent Story
${bugData.parentStory ? `User Story #${bugData.parentStory}` : 'None'}

## Additional Notes
${bugData.additionalNotes || 'None'}

---
*Bug report generated automatically*
`;
  }

  /**
   * Format steps for markdown
   */
  formatMarkdownSteps(steps) {
    if (!steps) return '1. No steps provided';
    
    let stepArray;
    if (Array.isArray(steps)) {
      stepArray = steps;
    } else if (typeof steps === 'string') {
      stepArray = steps.split(/\||\n|(?=\d+\.)/g)
        .map(step => step.trim())
        .filter(step => step.length > 0)
        .map(step => step.replace(/^\d+\.\s*/, ''));
    } else {
      stepArray = ['Step not provided'];
    }
    
    return stepArray.map((step, index) => `${index + 1}. ${step}`).join('\n');
  }
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const bugData = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--title=')) {
      bugData.title = arg.substring(8).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--summary=')) {
      bugData.summary = arg.substring(10).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--steps=')) {
      const stepsStr = arg.substring(8).replace(/^"|"$/g, '');
      bugData.reproSteps = stepsStr.split('|');
    } else if (arg.startsWith('--expected=')) {
      bugData.expectedBehavior = arg.substring(11).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--actual=')) {
      bugData.actualBehavior = arg.substring(9).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--screenshots=')) {
      const screenshotsStr = arg.substring(14).replace(/^"|"$/g, '');
      bugData.screenshots = screenshotsStr.split(',').map(s => s.trim());
    } else if (arg.startsWith('--environment=')) {
      bugData.environment = arg.substring(14).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--browser=')) {
      bugData.browserInfo = arg.substring(10).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--url=')) {
      bugData.url = arg.substring(6).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--priority=')) {
      bugData.priority = parseInt(arg.substring(11));
    } else if (arg.startsWith('--severity=')) {
      bugData.severity = arg.substring(11).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--parent-story=')) {
      bugData.parentStory = arg.substring(15).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--figma=')) {
      bugData.figmaUrl = arg.substring(8).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--impact=')) {
      bugData.impact = arg.substring(9).replace(/^"|"$/g, '');
    } else if (arg.startsWith('--notes=')) {
      bugData.additionalNotes = arg.substring(8).replace(/^"|"$/g, '');
    }
  });
  
  return bugData;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Azure DevOps Bug Logger

Usage: 
  npm run log-bug --title="Bug Title" --summary="Brief description" --steps="Step 1|Step 2|Step 3"

Required Arguments:
  --title="Bug Title"                 Title of the bug

Optional Arguments:
  --summary="Brief description"       Short summary of the issue
  --steps="Step 1|Step 2|Step 3"    Reproduction steps (pipe-separated)
  --expected="Expected behavior"      What should happen
  --actual="Actual behavior"         What actually happens
  --screenshots="path1,path2"        Comma-separated screenshot paths
  --environment="QA/Staging/Prod"   Environment where bug was found
  --browser="Chrome 120"             Browser/device information
  --url="https://example.com"        Test page URL where bug occurs
  --priority=2                       Priority (1-4, default: 2)
  --severity="3 - Medium"            Severity level
  --parent-story=2058                Parent User Story ID to link
  --figma="https://figma.com/..."   Figma design URL
  --impact="User cannot complete"     Business impact description
  --notes="Additional information"    Any additional notes

Examples:
  npm run log-bug --title="Login button not working" --steps="Go to login|Click login button|Nothing happens" --environment="QA" --parent-story=1234
  
  npm run log-bug --title="Accessibility violation" --summary="Non-unique aria-labels" --parent-story=2058 --figma="https://figma.com/..." --url="https://test-page.com"

This will:
- Create a properly formatted bug in Azure DevOps
- Upload screenshots as attachments
- Link to parent User Story (if provided)
- Include Figma design URL (if provided)
- Save local backup in docs/bugs/

Note: Tags are no longer automatically added to bugs
`);
    process.exit(1);
  }

  try {
    const bugData = parseArguments();
    
    if (!bugData.title) {
      console.error('Error: --title is required');
      process.exit(1);
    }
    
    console.log('Creating bug report in Azure DevOps...\n');
    console.log(`Title: ${bugData.title}`);
    if (bugData.summary) console.log(`Summary: ${bugData.summary}`);
    if (bugData.reproSteps) console.log(`Steps: ${bugData.reproSteps.length} step(s)`);
    if (bugData.screenshots) console.log(`Screenshots: ${bugData.screenshots.length} file(s)`);
    if (bugData.parentStory) console.log(`Parent Story: #${bugData.parentStory}`);
    if (bugData.figmaUrl) console.log(`Figma URL: ${bugData.figmaUrl}`);
    console.log('');
    
    const logger = new AzureDevOpsBugLogger();
    const createdBug = await logger.createBug(bugData);
    
    // Save local backup
    await logger.saveBugDataLocally(bugData, createdBug.id);
    
    console.log('\nBUG CREATED SUCCESSFULLY');
    console.log(`Azure DevOps: ${logger.config.baseUrl}/_workitems/edit/${createdBug.id}`);
    console.log(`Local backup: docs/bugs/bug-${createdBug.id}-*.md`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();