/**
 * Product Group Test Data Configuration
 * Environment-specific product names and filters for testing
 */

export interface ProductTestData {
  validProducts: string[];
  partialSearchProducts: string[];
  invalidProducts: string[];
  fieldOfActivity: string[];
  applications: string[];
  combinedSearchFilters: {
    product: string;
    application: string;
  };
  tripleFilterCombination: {
    product: string;
    fieldOfActivity: string;
    application: string;
  };
}

/**
 * Product test data for different environments
 */
export const productGroupTestData: Record<string, ProductTestData> = {
  // Default test data (used for dev, qa, stg, prod, etc.)
  default: {
    validProducts: ['Bollgard3', 'Supradyn', 'TruFlex'],
    partialSearchProducts: ['Bollgard'],
    invalidProducts: ['NonExistentProduct', '12345', '@#$%'],
    fieldOfActivity: ['Cardiology', 'Consumer Health', 'Pharmaceuticals'],
    applications: ['Bacterial Infections', 'Pulmonal Hypertonia', 'Angiography'],
    combinedSearchFilters: {
      product: 'Ultravist',
      application: 'Angiography',
    },
    tripleFilterCombination: {
      product: 'Bollgard',
      fieldOfActivity: 'Consumer Health',
      application: 'Bacterial Infections',
    },
  },

  // India production site specific data (verified from https://www.bayer.in/en-in/products)
  prod_in: {
    validProducts: ['Alaspan', 'Admire', 'Antracol'], // Real products from India site
    partialSearchProducts: ['Ala'], // Matches Alaspan, Alaspan AG, Alaspan AM, etc.
    invalidProducts: ['NonExistentProduct', '12345', '@#$%'],
    fieldOfActivity: ['Crop Science', 'Pharmaceuticals', 'Consumer Health', 'Bayer Vapi', 'Radiology'], // Actual India site filters
    applications: ['Allergy', 'Crop Protection - Herbicides', 'General Medicine'], // Actual India site filters
    combinedSearchFilters: {
      product: 'Alaspan',
      application: 'Allergy',
    },
    tripleFilterCombination: {
      product: 'Admire',
      fieldOfActivity: 'Crop Science',
      application: 'Crop Protection - Herbicides',
    },
  },
};

/**
 * Get product test data based on current environment
 * @returns ProductTestData for the current environment
 */
export function getProductTestData(): ProductTestData {
  const env = process.env.TEST_ENV ?? 'qa';
  return productGroupTestData[env] || productGroupTestData.default;
}
