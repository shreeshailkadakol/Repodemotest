/**
 * Component Mapper - Redirect Global Teardown
 * What:
 *   Finalizes redirect runs by reporting output locations and basic execution
 *   summary details after tests complete.
 * Why:
 *   Created to provide clear end-of-run visibility for engineers and
 *   stakeholders reviewing redirect execution outcomes.
 */

import { getRedirectConfig } from './redirectConfig';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global teardown for URL redirect tests
 * Runs once after all tests complete
 */
async function globalTeardown() {
  console.log('\n' + '='.repeat(50));
  console.log('TEARDOWN: URL Redirect Test Framework Teardown...\n');
  
  try {
    const config = getRedirectConfig(process.env.NODE_ENV || 'development');
    
    // 1. Display final results location
    console.log('RESULTS: Test Results Locations:');
    console.log(`   Excel File: ${config.excelFilePath}`);
    console.log(`   Screenshots: ./reports/screenshots/`);
    console.log(`   HTML Report: ./reports/html-report/index.html`);
    console.log(`   JSON Results: ./reports/test-results.json`);
    
    // 2. Check if Excel file was updated
    if (fs.existsSync(config.excelFilePath)) {
      const stats = fs.statSync(config.excelFilePath);
      const now = new Date();
      const fileAge = (now.getTime() - stats.mtime.getTime()) / 1000; // seconds
      
      if (fileAge < 300) { // Updated within last 5 minutes
        console.log(`SUCCESS: Excel file was recently updated (${Math.round(fileAge)}s ago)`);
      } else {
        console.log(`WARNING: Excel file was not recently updated (${Math.round(fileAge)}s ago)`);
      }
    }
    
    // 3. Count screenshots taken
    const screenshotDir = './reports/screenshots';
    if (fs.existsSync(screenshotDir)) {
      const screenshots = fs.readdirSync(screenshotDir).filter(file => 
        file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
      );
      
      if (screenshots.length > 0) {
        console.log(`SCREENSHOTS: ${screenshots.length} screenshot(s) captured for failed tests`);
      } else {
        console.log(`SCREENSHOTS: No screenshots captured (all tests may have passed)`);
      }
    }
    
    // 4. Generate summary report link
    const htmlReportPath = './reports/html-report/index.html';
    if (fs.existsSync(htmlReportPath)) {
      const absolutePath = path.resolve(htmlReportPath);
      console.log(`\nREPORT: View detailed report at file://${absolutePath}`);
    }
    
    // 5. Cleanup temporary files if needed
    // (Add cleanup logic here if needed)
    
    console.log('\nSUMMARY:');
    console.log('   - Check Excel file for detailed results with timestamps');
    console.log('   - Review HTML report for test execution details');
    console.log('   - Screenshots available for failed test analysis');
    
    console.log('\nSUCCESS: Global teardown completed successfully');
    console.log('COMPLETED: URL Redirect Testing Framework execution finished!\n');
    
  } catch (error) {
    console.error('\n[ERROR] Global teardown error:', error);
    console.error('Some cleanup operations may not have completed properly.\n');
  }
}

export default globalTeardown;