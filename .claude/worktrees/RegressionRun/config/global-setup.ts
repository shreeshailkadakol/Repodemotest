/**
 * Component Mapper - Redirect Global Setup
 * What:
 *   Prepares redirect test execution by validating configuration, ensuring
 *   required folders exist, and verifying input Excel structure.
 * Why:
 *   Created to fail early on setup issues and make redirect runs consistent
 *   across local and CI environments.
 */

import { getRedirectConfig, validateConfig } from './redirectConfig';
import { ExcelUtil } from '../utils/excelUtil';
import * as fs from 'fs';

/**
 * Global setup for URL redirect tests
 * Runs once before all tests
 */
async function globalSetup() {
  console.info('SETUP: Starting URL Redirect Test Framework Setup...\n');
  
  try {
    // 1. Get and validate configuration
    const environment = process.env.NODE_ENV || 'development';
    const config = getRedirectConfig(environment);
    
    console.info(`ENVIRONMENT: ${environment.toUpperCase()}`);
    console.info(`EXCEL FILE: ${config.excelFilePath}`);
    console.info(`TEST LIMIT: ${config.testLimit || 'All URLs'}`);
    console.info(`TIMEOUT: ${config.timeout}ms\n`);
    
    // 2. Validate configuration
    const configValidation = validateConfig(config);
    if (!configValidation.isValid) {
      console.error('Configuration validation failed:');
      configValidation.errors.forEach(error => console.error(`   - ${error}`));
      throw new Error('Invalid configuration');
    }
    
    // 3. Ensure directories exist
    const screenshotDir = './reports/screenshots';
    const reportDir = './reports';
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
      console.info(`CREATED: Reports directory - ${reportDir}`);
    }
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
      console.info(`CREATED: Screenshots directory - ${screenshotDir}`);
    }
    
    // 4. Validate Excel file
    if (fs.existsSync(config.excelFilePath)) {
      const excelUtil = new ExcelUtil(config.excelFilePath, config.sheetName);
      
      const isValidStructure = excelUtil.validateFileStructure();
      if (!isValidStructure) {
        throw new Error('Excel file structure validation failed.');
      }
      
      const dataCount = excelUtil.getDataRowCount();
      const testCount = config.testLimit > 0 ? Math.min(dataCount, config.testLimit) : dataCount;
      
      console.info(`Excel file validated - ${dataCount} total URLs found`);
      console.info(`Will test ${testCount} URLs\n`);
      
    } else {
      throw new Error(`Excel file not found: ${config.excelFilePath}`);
    }
    
    // 5. Log test execution plan
    console.info('SUCCESS: Global setup completed successfully');
    console.info('Starting redirect tests...\n');
    console.info('='.repeat(50));
    
  } catch (error) {
    console.error('\nGlobal setup failed:', error);
    console.error('\nPlease check the configuration and try again.\n');
    process.exit(1);
  }
}

export default globalSetup;