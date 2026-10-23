/**
 * Shared Test Configuration for all Component Tests
 * This file contains common configuration values used across all test scripts
 * to maintain consistency and avoid duplication.
 */

export const TEST_CONFIG = {
  /**
   * Standard viewport sizes for responsive testing
   * These breakpoints align with the design system
   */
  viewports: {
    XL: { width: 1440, height: 900 },
    LG: { width: 1024, height: 800 },
    MD: { width: 768, height: 1024 },
    SM: { width: 375, height: 667 },
  },

  /**
   * Authentication configuration
   * Used for components that require Vercel authentication
   */
  authentication: {
    password: 'beyond2025',
  },

  /**
   * Performance testing thresholds
   * These values define acceptable performance limits based on testing environment realities
   */
  performanceThresholds: {
    loadTime: 1000, // Maximum component load time in milliseconds
    renderTime: 200, // Maximum individual element render time in milliseconds
    domContentLoaded: 2000, // Maximum DOM content loaded time
    loadComplete: 4000, // Maximum complete page load time

    // Interactive performance thresholds (environment-aware)
    interactionDelay: {
      optimal: 1000, // Optimal for production (< 100ms)
      acceptable: 500, // Acceptable for test environment (< 500ms)
      maximum: 1000, // Maximum tolerable (< 1s)
    },

    animationDuration: {
      optimal: 300, // Optimal CSS transition duration (< 300ms)
      acceptable: 800, // Acceptable including browser processing (< 800ms)
      maximum: 2000, // Maximum including slow environments (< 2s)
    },
  },

  /**
   * Test timeouts and delays
   */
  timeouts: {
    standard: 60000, // Standard test timeout (60 seconds)
    extended: 100000, // Extended timeout for complex operations (100 seconds)
    focus: 100, // Focus settling time (100ms)
  },

  /**
   * Common test data
   */
  common: {
    minLinkCount: 1, // Minimum expected number of links
    minTextLength: 1, // Minimum text content length
    maxTestInstances: 3, // Maximum number of component instances to test
  },
} as const;

/**
 * Type definitions for better TypeScript support
 */
export type ViewportName = keyof typeof TEST_CONFIG.viewports;
export type ViewportConfig = (typeof TEST_CONFIG.viewports)[ViewportName];

/**
 * Utility functions for working with test configuration
 */
export const TestConfigUtils = {
  /**
   * Get viewport configuration by name
   */
  getViewport(name: ViewportName): ViewportConfig {
    return TEST_CONFIG.viewports[name];
  },

  /**
   * Get all viewport names as array
   */
  getAllViewportNames(): ViewportName[] {
    return Object.keys(TEST_CONFIG.viewports) as ViewportName[];
  },

  /**
   * Check if a viewport name is valid
   */
  isValidViewport(name: string): name is ViewportName {
    return name in TEST_CONFIG.viewports;
  },
};
