# ef-comms-dxp-test â€” Framework Skeleton

This is a starter skeleton of the Playwright test framework.

## What's Included

- **tests/specs/** â€” 3 example test files (abstractText, accordionComponent, bannerLVariant)
- **components/** â€” Page Object Model (POM) classes for the 3 example specs
- **helpers/** â€” Shared utilities: basePage, envUtils, softAssertions, AI smart locator, orchestrator
- **data/** â€” componentURL.ts with all test URLs
- **config/** â€” Component registry, site mapping, test config, CSV mappings
- **docs/** â€” Full documentation, test case specs, environment setup guide
- **.github/workflows/** â€” 5 CI/CD pipeline definitions
- **package.json / playwright.config.ts / tsconfig.json** â€” Framework configuration

## Getting Started

1. Install dependencies:
   \\\
   npm install
   npx playwright install
   \\\

2. Copy \.env\ and fill in values:
   \\\
   cp .env .env.local  # or just edit .env directly
   \\\

3. Run the example specs:
   \\\
   npx playwright test tests/specs/abstractText.spec.ts
   npx playwright test tests/specs/accordionComponent.spec.ts
   npx playwright test tests/specs/bannerLVariant.spec.ts
   \\\

4. Run smoke tests:
   \\\
   npx playwright test --grep @Smoke
   \\\

## Adding More Tests

To add a new component test:
1. Create \components/<componentName>.ts\ extending BasePage
2. Create \	ests/specs/<componentName>.spec.ts\ importing your component
3. Add the URL to \data/componentURL.ts\
4. Register it in \config/component-registry.ts\
