/**
 * Component Mapper - Redirect Configuration
 * What:
 *   Centralized environment-aware settings for redirect testing behavior,
 *   execution limits, timeouts, and reporting options.
 * Why:
 *   Created to avoid scattered constants and make redirect execution tunable
 *   without changing test implementation code.
 */

export interface RedirectTestConfig {
  // File paths
  excelFilePath: string;
  sheetName: string;
  screenshotDir: string;
  
  // Test execution settings
  testLimit: number;
  testStartRow?: number; // Starting row (1-based, excluding header)
  testEndRow?: number; // Ending row (1-based, inclusive)
  timeout: number;
  navigationTimeout: number;
  
  // Browser settings
  headless: boolean;
  slowMo: number;
  
  // Test behavior
  screenshotOnFailure: boolean;
  continueOnError: boolean;
  delayBetweenTests: number;
  
  // Performance settings
  maxConcurrentWorkers: number;
  enableParallelExecution: boolean;
  
  // URL normalization
  normalizeUrls: boolean;
  ignoreTrailingSlash: boolean;
  ignoreProtocol: boolean;
  
  // Reporting
  generateDetailedReport: boolean;
  logLevel: 'minimal' | 'standard' | 'verbose';
}

/**
 * Environment-specific configurations
 */
export const REDIRECT_CONFIGS: Record<string, RedirectTestConfig> = {
  development: {
    excelFilePath: './test-data/UK-Redirects.xlsx',
    sheetName: 'Sheet1',
    screenshotDir: './reports/screenshots',
    testLimit: 50,
    timeout: 45000, // Increased for authentication
    navigationTimeout: 35000, // Increased for authentication
    headless: false,
    slowMo: 100,
    screenshotOnFailure: true,
    continueOnError: true,
    delayBetweenTests: 2000, // Increased delay between tests
    maxConcurrentWorkers: 1, // Single worker for development debugging
    enableParallelExecution: false,
    normalizeUrls: true,
    ignoreTrailingSlash: true,
    ignoreProtocol: false,
    generateDetailedReport: true,
    logLevel: 'verbose'
  },
  
  testing: {
    excelFilePath: './test-data/UK-Redirects.xlsx',
    sheetName: 'Sheet1',
    screenshotDir: './reports/screenshots',
    testLimit: 50,
    timeout: 45000, // Increased for authentication
    navigationTimeout: 35000, // Increased for authentication
    headless: true,
    slowMo: 50,
    screenshotOnFailure: true,
    continueOnError: true,
    delayBetweenTests: 1500, // Moderate delay for testing
    maxConcurrentWorkers: 2, // Allow 2 workers for better throughput
    enableParallelExecution: true,
    normalizeUrls: true,
    ignoreTrailingSlash: true,
    ignoreProtocol: false,
    generateDetailedReport: true,
    logLevel: 'standard'
  },
  
  production: {
    excelFilePath: './test-data/UK-Redirects.xlsx',
    sheetName: 'Sheet1',
    screenshotDir: './reports/screenshots',
    testLimit: 0, // No limit - test all URLs
    timeout: 10000,
    navigationTimeout: 7000,
    headless: true,
    slowMo: 0,
    screenshotOnFailure: false,
    continueOnError: true,
    delayBetweenTests: 200,
    maxConcurrentWorkers: 3, // Max workers for production speed
    enableParallelExecution: true,
    normalizeUrls: true,
    ignoreTrailingSlash: true,
    ignoreProtocol: false,
    generateDetailedReport: true,
    logLevel: 'minimal'
  },

  // Custom configuration for row range testing
  range: {
    excelFilePath: './test-data/UK-Redirects.xlsx',
    sheetName: 'Sheet1',
    screenshotDir: './reports/screenshots',
    testLimit: 54, // Will be overridden by row range
    testStartRow: 169, // Start from row 169 (1-based)
    testEndRow: 222, // End at row 222 (inclusive)
    timeout: 30000,
    navigationTimeout: 25000,
    headless: false, // Visible for monitoring progress
    slowMo: 50,
    screenshotOnFailure: true,
    continueOnError: true,
    delayBetweenTests: 1000, // 1 second delay
    maxConcurrentWorkers: 2, // Exactly 2 workers as requested
    enableParallelExecution: true,
    normalizeUrls: true,
    ignoreTrailingSlash: true,
    ignoreProtocol: false,
    generateDetailedReport: true,
    logLevel: 'standard'
  }
};

/**
 * Get configuration for current environment
 * @param environment Environment name (development, testing, production)
 * @returns Configuration object
 */
export function getRedirectConfig(environment: string = 'development'): RedirectTestConfig {
  const config = REDIRECT_CONFIGS[environment.toLowerCase()];
  
  if (!config) {
    console.warn(`Unknown environment: ${environment}. Using development config.`);
    return REDIRECT_CONFIGS.development;
  }
  
  return config;
}

/**
 * Validate configuration settings
 * @param config Configuration object to validate
 * @returns Validation result
 */
export function validateConfig(config: RedirectTestConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate required fields
  if (!config.excelFilePath) {
    errors.push('Excel file path is required');
  }
  
  if (!config.sheetName) {
    errors.push('Sheet name is required');
  }
  
  // Validate numeric values
  if (config.timeout <= 0) {
    errors.push('Timeout must be greater than 0');
  }
  
  if (config.testLimit < 0) {
    errors.push('Test limit cannot be negative');
  }
  
  // Validate log level
  const validLogLevels = ['minimal', 'standard', 'verbose'];
  if (!validLogLevels.includes(config.logLevel)) {
    errors.push(`Invalid log level. Must be one of: ${validLogLevels.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Default configuration - used as fallback
 */
export const DEFAULT_CONFIG: RedirectTestConfig = REDIRECT_CONFIGS.development;