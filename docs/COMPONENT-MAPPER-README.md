# Component Mapper System

## Overview

The Component Mapper automatically scans production/QA pages, identifies components present on each page, and dynamically generates tests to verify component presence and integrity.

## Architecture

### Components

1. **Component Registry** (`config/component-registry.ts`)
   - Single source of truth mapping data-qa/data-testid attributes to component spec files
   - Currently registered: 40+ components
   - Prevents mapping sub-elements as components

2. **Page Scanner** (`helpers/orchestrator/pageScanner.ts`)
   - Scans pages for both `data-qa` and `data-testid` attributes
   - Uses BasePage authentication (Vercel password: "beyond2025")
   - Filters scanned attributes against component registry
   - Generates JSON and CSV mappings

3. **Component Mapper** (`helpers/utils/componentMapper.ts`)
   - Provides utility functions for component detection
   - Scans both data-qa and data-testid attributes
   - Filters results to only registered components

4. **Dynamic Test Spec** (`tests/specs/dynamic/page-mapper.spec.ts`)
   - Reads page-component-mapping.json
   - Generates tests dynamically for each page/component
   - Uses BasePage authentication
   - Captures screenshots for Allure reports
   - Tagged with `@PageMapper`

5. **Configuration Files**
   - `config/page-component-mapping.json` - Machine-readable mapping
   - `config/page-component-mapping.csv` - Human-readable export

## Usage

### Scanning Pages

```powershell
# Scan configured pages (Homepage, TeaserGrid)
npx tsx helpers/orchestrator/pageScanner.ts
```

Output:
- Updates `config/page-component-mapping.json`
- Generates `config/page-component-mapping.csv`
- Console summary of discovered components

### Running Dynamic Tests

```powershell
# Run all component mapper tests
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --project=chromium

# Run specific page tests
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --grep "Homepage"

# Run in headed mode
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --headed
```

### Adding New Components

1. **Update Component Registry**
   ```typescript
   // In config/component-registry.ts
   {
     dataQa: 'my-new-component',           // data-qa or data-testid value
     componentName: 'MyNewComponent',
     specFile: 'tests/specs/myNew.spec.ts',
     testTags: ['@MyNew', '@Functional'],
     description: 'My new component description'
   }
   ```

2. **Rescan Pages**
   ```powershell
   npx tsx helpers/orchestrator/pageScanner.ts
   ```

3. **Run Tests**
   ```powershell
   npx playwright test tests/specs/dynamic/page-mapper.spec.ts
   ```

### Adding New Pages

Edit `helpers/orchestrator/pageScanner.ts`:

```typescript
// Add to scanFromConfig() method
await scanner.generatePageMapping(
  'https://bayer-beyond-qa-uk.vercel.app/en/your-page',
  'Your Page Name',
  'qa'
);
```

Then run the scanner.

## Current Mapping

### Homepage (6 components)
- Header
- HomepageHero
- TeaserGroup
- IndividualTeaser
- Banner
- FooterBlocksOfLinks

### TeaserGrid Test Page (4 components)
- Header
- TeaserGrid
- IndividualTeaser
- FooterBlocksOfLinks

## Test Results

Each test verifies:
1. ✅ Component exists on page (count > 0)
2. ✅ Component is attached to DOM
3. ✅ Spec file exists
4. ✅ Screenshot captured for Allure
5. ✅ Metadata attached to test

## GitHub Actions Integration

Create workflow file `.github/workflows/component-mapper.yml`:

```yaml
name: Component Mapper Tests

on:
  push:
    branches: [ ComponentMapper ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Run Component Mapper Tests
        run: npx playwright test tests/specs/dynamic/page-mapper.spec.ts
      
      - name: Upload Allure Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: allure-results
          path: allure-results/
```

## Key Features

✅ **Automatic Component Discovery** - Scans pages and identifies registered components
✅ **Component Registry** - Prevents mapping sub-elements (icons, images, links)  
✅ **Dynamic Test Generation** - Creates tests automatically based on page-component mapping
✅ **Dual Attribute Support** - Scans both `data-qa` and `data-testid` attributes
✅ **BasePage Authentication** - Uses existing framework authentication infrastructure
✅ **Allure Integration** - Screenshots and metadata attached to each test
✅ **CSV Export** - Human-readable mapping for documentation
✅ **100% Test Coverage** - All discovered components verified on each page

## Troubleshooting

### Components Not Found
- Verify component is registered in `config/component-registry.ts`
- Check if component uses `data-qa` or `data-testid` attribute
- Ensure attribute value matches registry entry exactly (case-sensitive)

### Authentication Failures
- Verify Vercel password is current ("beyond2025")
- Check BasePage.navigateWithAuthentication() method
- Ensure HTTP credentials are set in playwright.config.ts

### False Positives
- Component mapper only detects registered components
- Sub-elements (icons, images, links) are filtered out
- Review `component-registry.ts` to ensure only actual test components are registered

## Maintenance

### Regular Tasks
1. **Weekly**: Rescan production pages to detect new components
2. **Per Sprint**: Update component registry with new components
3. **Monthly**: Review CSV mapping for documentation accuracy

### Best Practices
- Keep component registry up-to-date with spec files
- Use descriptive component names matching Page Objects
- Document component purpose in registry description field
- Run dynamic tests as part of CI/CD pipeline

## Performance

- **Scan Time**: ~30s per page (includes authentication + cookie acceptance)
- **Test Time**: ~10-40s per component (varies by component complexity)
- **Total Coverage**: 10 components across 2 pages = ~3.5 minutes

## Future Enhancements

- [ ] API endpoint scanning (REST/GraphQL)
- [ ] Visual regression testing integration
- [ ] Component dependency mapping
- [ ] Automated spec file generation for new components
- [ ] Multi-environment scanning (QA, Staging, Prod)
- [ ] Performance metrics per component
- [ ] Accessibility checks per component

## Support

For issues or questions:
- Review `docs/COMPONENT-MAPPER-README.md` (this file)
- Check `helpers/orchestrator/pageScanner.ts` for scanner logic
- Review `config/component-registry.ts` for registered components
- Inspect `tests/specs/dynamic/page-mapper.spec.ts` for test implementation
