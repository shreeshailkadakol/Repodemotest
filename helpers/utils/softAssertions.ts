/**
 * Soft Assertions Utility
 * 
 * This utility provides soft assertion capabilities for Playwright tests,
 * allowing multiple validations to run even if some fail, collecting all
 * errors and reporting them at the end.
 */

export class SoftAssertions {
  private errors: string[] = [];
  private testName: string;

  constructor(testName: string) {
    this.testName = testName;
  }

  /**
   * Perform a soft assertion that doesn't stop test execution on failure
   * @param assertionFn - Function containing the assertion logic
   * @param description - Description of what is being validated
   */
  async softAssert(assertionFn: () => Promise<void> | void, description: string): Promise<void> {
    try {
      await assertionFn();
      console.log(`✅ ${description}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const fullError = `❌ ${description}: ${errorMessage}`;
      this.errors.push(fullError);
      console.log(fullError);
    }
  }

  /**
   * Perform a soft assertion with a boolean condition
   * @param condition - The condition to check
   * @param description - Description of what is being validated
   * @param expectedValue - Expected value for better error messages
   * @param actualValue - Actual value for better error messages
   */
  async softAssertCondition(
    condition: boolean, 
    description: string, 
    expectedValue?: any, 
    actualValue?: any
  ): Promise<void> {
    if (condition) {
      console.log(`✅ ${description}`);
    } else {
      const errorDetails = expectedValue !== undefined && actualValue !== undefined
        ? ` (Expected: ${expectedValue}, Actual: ${actualValue})`
        : '';
      const errorMessage = `❌ ${description}${errorDetails}`;
      this.errors.push(errorMessage);
      console.log(errorMessage);
    }
  }

  /**
   * Assert all collected soft assertions at the end of the test
   * This should be called at the end of each test to report any failures
   */
  assertAll(): void {
    if (this.errors.length > 0) {
      console.log(`\n📋 ${this.testName} - Summary of failures:`);
      for (let i = 0; i < this.errors.length; i++) {
        console.log(`${i + 1}. ${this.errors[i]}`);
      }
      
      const errorSummary = `${this.errors.length} validation(s) failed in ${this.testName}:\n${this.errors.join('\n')}`;
      throw new Error(errorSummary);
    } else {
      console.log(`✅ ${this.testName} - All validations passed successfully`);
    }
  }

  /**
   * Get the count of collected errors
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Clear all collected errors (useful for test cleanup)
   */
  clearErrors(): void {
    this.errors = [];
  }
}