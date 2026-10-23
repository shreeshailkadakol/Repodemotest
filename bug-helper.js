#!/usr/bin/env node

/**
 * Bug Logger Helper - Interactive Bug Creation
 * 
 * Provides templates and guided input for common bug scenarios
 */

const readline = require('readline');
const { execSync } = require('child_process');

class BugLoggerHelper {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async promptUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Interactive bug creation wizard
   */
  async createBugInteractively() {
    console.log('Interactive Bug Logger');
    console.log('=======================\n');

    try {
      // Basic Information
      const title = await this.promptUser('Bug Title (required): ');
      if (!title) {
        console.log('Title is required');
        return;
      }

      const summary = await this.promptUser('Brief Summary (optional): ');
      
      // Bug Type Selection
      console.log('\nSelect bug type:');
      console.log('1. Functional Bug');
      console.log('2. Visual/UI Bug');
      console.log('3. Performance Issue');
      console.log('4. Accessibility Issue');
      console.log('5. Custom');
      
      const bugType = await this.promptUser('Enter choice (1-5): ');
      
      let bugData = { title, summary };
      
      switch (bugType) {
        case '1':
          bugData = await this.getFunctionalBugData(bugData);
          break;
        case '2':
          bugData = await this.getVisualBugData(bugData);
          break;
        case '3':
          bugData = await this.getPerformanceBugData(bugData);
          break;
        case '4':
          bugData = await this.getAccessibilityBugData(bugData);
          break;
        default:
          bugData = await this.getCustomBugData(bugData);
      }

      // Common fields
      bugData = await this.getCommonFields(bugData);
      
      // Confirmation
      console.log('\nBug Summary:');
      console.log(`Title: ${bugData.title}`);
      console.log(`Summary: ${bugData.summary || 'None'}`);
      console.log(`Steps: ${bugData.steps ? bugData.steps.length + ' step(s)' : 'None'}`);
      console.log(`Environment: ${bugData.environment || 'None'}`);
      console.log(`Tags: ${bugData.tags || 'None'}`);
      
      const confirm = await this.promptUser('\nCreate this bug? (y/n): ');
      
      if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        await this.executeBugCreation(bugData);
      } else {
        console.log('Bug creation cancelled');
      }

    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Get functional bug specific data
   */
  async getFunctionalBugData(bugData) {
    console.log('\nFunctional Bug Details:');
    
    bugData.steps = [];
    let step;
    let stepNum = 1;
    
    console.log('Enter reproduction steps (press Enter on empty line to finish):');
    while (true) {
      step = await this.promptUser(`Step ${stepNum}: `);
      if (!step) break;
      bugData.steps.push(step);
      stepNum++;
    }
    
    bugData.expectedBehavior = await this.promptUser('Expected behavior: ');
    bugData.actualBehavior = await this.promptUser('Actual behavior: ');
    bugData.tags = 'functional,bug';
    
    return bugData;
  }

  /**
   * Get visual/UI bug specific data
   */
  async getVisualBugData(bugData) {
    console.log('\nVisual/UI Bug Details:');
    
    bugData.expectedBehavior = await this.promptUser('Expected visual appearance: ');
    bugData.actualBehavior = await this.promptUser('Actual visual issue: ');
    
    const screenshotsInput = await this.promptUser('Screenshot paths (comma-separated, optional): ');
    if (screenshotsInput) {
      bugData.screenshots = screenshotsInput.split(',').map(s => s.trim());
    }
    
    bugData.browser = await this.promptUser('Browser/Device (e.g., Chrome 120, iPhone 14): ');
    bugData.tags = 'visual,ui,bug';
    
    return bugData;
  }

  /**
   * Get performance bug specific data
   */
  async getPerformanceBugData(bugData) {
    console.log('\nPerformance Issue Details:');
    
    bugData.expectedBehavior = await this.promptUser('Expected performance (e.g., loads in 2s): ');
    bugData.actualBehavior = await this.promptUser('Actual performance issue: ');
    bugData.impact = await this.promptUser('Performance impact on user: ');
    
    bugData.steps = [
      'Navigate to the affected page/feature',
      'Perform the action that exhibits slow performance',
      'Observe the delay/performance issue'
    ];
    
    bugData.tags = 'performance,slow,bug';
    bugData.severity = '2 - High';
    
    return bugData;
  }

  /**
   * Get accessibility bug specific data
   */
  async getAccessibilityBugData(bugData) {
    console.log('\nAccessibility Issue Details:');
    
    console.log('\nAccessibility violation type:');
    console.log('1. Keyboard navigation');
    console.log('2. Screen reader compatibility');
    console.log('3. Color contrast');
    console.log('4. ARIA attributes');
    console.log('5. Focus management');
    console.log('6. Other');
    
    const a11yType = await this.promptUser('Select type (1-6): ');
    const typeMap = {
      '1': 'keyboard-navigation',
      '2': 'screen-reader',
      '3': 'color-contrast', 
      '4': 'aria-attributes',
      '5': 'focus-management',
      '6': 'other-a11y'
    };
    
    bugData.expectedBehavior = await this.promptUser('Expected accessible behavior: ');
    bugData.actualBehavior = await this.promptUser('Accessibility barrier encountered: ');
    bugData.impact = await this.promptUser('Impact on users with disabilities: ');
    
    bugData.tags = `accessibility,a11y,${typeMap[a11yType] || 'a11y'},bug`;
    bugData.severity = '2 - High';
    
    return bugData;
  }

  /**
   * Get custom bug data
   */
  async getCustomBugData(bugData) {
    console.log('\nCustom Bug Details:');
    
    bugData.steps = [];
    let step;
    let stepNum = 1;
    
    console.log('Enter reproduction steps (press Enter on empty line to finish):');
    while (true) {
      step = await this.promptUser(`Step ${stepNum}: `);
      if (!step) break;
      bugData.steps.push(step);
      stepNum++;
    }
    
    bugData.expectedBehavior = await this.promptUser('Expected behavior: ');
    bugData.actualBehavior = await this.promptUser('Actual behavior: ');
    bugData.tags = await this.promptUser('Tags (comma-separated): ') || 'bug';
    
    return bugData;
  }

  /**
   * Get common fields for all bug types
   */
  async getCommonFields(bugData) {
    console.log('\nEnvironment & Additional Details:');
    
    bugData.environment = await this.promptUser('Environment (QA/Staging/Production): ') || 'QA';
    bugData.url = await this.promptUser('URL where bug occurs (optional): ');
    
    console.log('\nPriority:');
    console.log('1 - Critical, 2 - High, 3 - Medium, 4 - Low');
    const priorityInput = await this.promptUser('Priority (1-4, default 2): ');
    bugData.priority = parseInt(priorityInput) || 2;
    
    bugData.impact = bugData.impact || await this.promptUser('Business impact (optional): ');
    bugData.notes = await this.promptUser('Additional notes (optional): ');
    
    return bugData;
  }

  /**
   * Execute bug creation command
   */
  async executeBugCreation(bugData) {
    console.log('\nCreating bug in Azure DevOps...');
    
    try {
      let command = `npm run log-bug --title="${bugData.title}"`;
      
      if (bugData.summary) command += ` --summary="${bugData.summary}"`;
      if (bugData.steps) command += ` --steps="${bugData.steps.join('|')}"`;
      if (bugData.expectedBehavior) command += ` --expected="${bugData.expectedBehavior}"`;
      if (bugData.actualBehavior) command += ` --actual="${bugData.actualBehavior}"`;
      if (bugData.environment) command += ` --environment="${bugData.environment}"`;
      if (bugData.browser) command += ` --browser="${bugData.browser}"`;
      if (bugData.url) command += ` --url="${bugData.url}"`;
      if (bugData.priority) command += ` --priority=${bugData.priority}`;
      if (bugData.tags) command += ` --tags="${bugData.tags}"`;
      if (bugData.impact) command += ` --impact="${bugData.impact}"`;
      if (bugData.notes) command += ` --notes="${bugData.notes}"`;
      if (bugData.screenshots) command += ` --screenshots="${bugData.screenshots.join(',')}"`;
      
      console.log('Executing:', command);
      execSync(command, { stdio: 'inherit' });
      
    } catch (error) {
      console.error('Error creating bug:', error.message);
    }
  }

  /**
   * Show quick templates
   */
  showQuickTemplates() {
    console.log(`
Quick Bug Templates

1. Functional Bug:
   npm run log-bug --title="Button not responding" --steps="Click login button|Wait 5 seconds|Nothing happens" --expected="User should be logged in" --actual="Nothing happens" --environment="QA" --tags="functional,ui,blocker"

2. Visual Bug:
   npm run log-bug --title="Header overlaps content" --summary="Navigation header covers main content on mobile" --expected="Header should not overlap content" --actual="Header covers first paragraph" --browser="iPhone 14 Safari" --tags="visual,mobile,css"

3. Performance Issue:
   npm run log-bug --title="Page loads slowly" --summary="Homepage takes over 10 seconds to load" --expected="Page loads in under 3 seconds" --actual="Takes 12+ seconds to fully load" --environment="Production" --priority=1 --tags="performance,slow,critical"

4. Accessibility Issue:
   npm run log-bug --title="Button not accessible via keyboard" --summary="Submit button cannot be reached using Tab key" --expected="All interactive elements accessible via keyboard" --actual="Tab skips the submit button" --severity="2 - High" --tags="accessibility,keyboard,a11y"

5. With Screenshots:
   npm run log-bug --title="Broken layout on tablet" --screenshots="tablet-bug1.png,tablet-bug2.png" --browser="iPad Pro" --environment="Staging" --tags="visual,responsive,tablet"

Run 'npm run bug-helper' for interactive mode.
`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--templates') || args.includes('-t')) {
    const helper = new BugLoggerHelper();
    helper.showQuickTemplates();
    return;
  }
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Bug Logger Helper

Usage:
  npm run bug-helper              Interactive bug creation wizard
  npm run bug-helper --templates  Show quick template examples
  npm run bug-helper --help       Show this help

Interactive Mode:
- Guided prompts for bug details
- Pre-configured templates for common scenarios
- Automatic tag and severity suggestions
- Built-in validation and confirmation

Template Types:
- Functional bugs (buttons, forms, interactions)
- Visual/UI bugs (layout, styling, responsive)
- Performance issues (slow loading, timeouts)  
- Accessibility violations (keyboard, screen reader)
- Custom bugs (flexible input)
`);
    return;
  }

  const helper = new BugLoggerHelper();
  await helper.createBugInteractively();
}

main();