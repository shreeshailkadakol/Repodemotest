/**
 * Component Mapper - Form Environment Verifier
 * What:
 *   Validates constructed form URLs for each configured environment and region.
 * Why:
 *   Created as a quick validation step to catch environment mapping mistakes
 *   before running form submission automation.
 *
 * This script verifies that all form URLs are correctly constructed for each environment.
 * Run with: npx ts-node config/verify-form-environments.ts
 * 
 * Or set environment first:
 * $env:FORM_ENV='production'; npx ts-node config/verify-form-environments.ts
 */

import { FORM_ENVIRONMENTS, getCurrentEnvironment, buildFormUrl } from './formConfigs';

console.info('Form Environment Configuration Verification\n');
console.info('='.repeat(80));

// Show current environment
const currentEnv = getCurrentEnvironment();
console.info(`\nCurrent Environment: ${currentEnv.name}`);
console.info(`  Base URL: ${currentEnv.baseUrl}`);
console.info(`  Set via: FORM_ENV=${process.env.FORM_ENV || '(not set - using default: staging)'}\n`);

// Show all configured environments
console.info('Available Environments:\n');
Object.entries(FORM_ENVIRONMENTS).forEach(([key, config]) => {
  const isCurrent = config.name === currentEnv.name;
  console.info(`${isCurrent ? '>' : ' '} ${key.toUpperCase()}`);
  console.info(`  Name: ${config.name}`);
  console.info(`  Base URL: ${config.baseUrl}`);
  console.info(`  Regions: ${Object.keys(config.formPaths).join(', ')}`);
  console.info('');
});

// Test URL construction for all regions in current environment
console.info('='.repeat(80));
console.info(`\nGenerated URLs for ${currentEnv.name} Environment:\n`);

const regions = ['AU', 'NZ', 'TR'];
regions.forEach(region => {
  try {
    const url = buildFormUrl(region);
    console.info(`${region}: ${url}`);
  } catch (error) {
    console.warn(`${region}: ERROR - ${error instanceof Error ? error.message : String(error)}`);
  }
});

// Show example commands
// Note: These console.info statements display example commands for users to copy and run.
// They are NOT executing the commands - just showing usage instructions.
console.info('\n' + '='.repeat(80));
console.info('\nExample Commands:\n');

console.info('# Test all regions in staging (default) :');

console.info('# Test all regions in production:');
console.info('$env:FORM_ENV=\'production\'; npx playwright test tests/specs/contactFormSubmission.spec.ts\n');

console.info('# Test specific region in specific environment:');
console.info('$env:FORM_ENV=\'qa\'; $env:FORM_REGION=\'AU\'; npx playwright test tests/specs/contactFormSubmission.spec.ts\n');

console.info('='.repeat(80));
console.info('\nConfiguration verification complete!\n');
