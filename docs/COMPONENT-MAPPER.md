# Component Mapper System

## Overview
Automated page-to-component mapping and dynamic test execution system.

## Features
- ✅ Automatic component detection on pages
- ✅ Dynamic test generation from JSON configuration
- ✅ Allure report integration
- ✅ CSV export for mapping data
- ✅ Non-breaking integration with existing tests

## Quick Start

### 1. Run Dynamic Tests
```bash
# Run all page mapper tests
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --grep @PageMapper

# Run tests for specific page
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --grep "@PageMapper.*Homepage"

# Run with headed mode
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --grep @PageMapper --headed --project=chromium
```

### 2. Scan New Pages
```bash
# Run the page scanner
npx ts-node helpers/orchestrator/pageScanner.ts
```

### 3. Update Mapping Configuration
Edit `config/page-component-mapping.json` to add/modify pages and components.

## File Structure
```
project/
├── config/
│   └── page-component-mapping.json    # Component mapping config
├── helpers/
│   ├── utils/
│   │   └── componentMapper.ts         # Mapper utility
│   └── orchestrator/
│       └── pageScanner.ts             # Page scanner
└── tests/
    └── specs/
        └── dynamic/
            └── page-mapper.spec.ts    # Dynamic tests
```

## Configuration Format

### JSON Structure
```json
{
  "pages": [
    {
      "url": "https://site.com/page",
      "pageName": "Page Name",
      "environment": "qa",
      "components": [
        {
          "dataQa": "component-name",
          "componentName": "ComponentName",
          "specFile": "tests/specs/component.spec.ts",
          "testTags": ["@Component", "@Functional"]
        }
      ]
    }
  ]
}
```

## Allure Integration
- Screenshots attached for each component
- Metadata JSON for traceability
- Page summary reports
- Test annotations with component info

## GitHub Actions
```yaml
- name: Run Component Mapper Tests
  run: npx playwright test --grep @PageMapper
  
- name: Generate Allure Report
  run: npm run allure:generate
```

## Backward Compatibility
- ✅ Existing tests unchanged
- ✅ Can run independently
- ✅ Same Allure reporter
- ✅ No breaking changes

## Export to CSV
```bash
# Automatically exports to config/page-component-mapping.csv
```

## Usage Examples

### Add New Page
1. Add to `config/page-component-mapping.json`
2. Run tests: `npx playwright test --grep @PageMapper`

### Scan Page Automatically
```typescript
const scanner = new PageScanner();
await scanner.initialize();
const components = await scanner.scanPage('https://your-url.com');
await scanner.close();
```

## Tags
- `@PageMapper` - All dynamic tests
- Component-specific tags (e.g., `@Header`, `@Footer`)
- `@Functional` - Functional tests
