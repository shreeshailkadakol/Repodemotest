# Component Mapper System

> **Automatically scan pages, discover components, and run comprehensive tests**

## 🚀 Quick Start (3 Steps)

### 1. Add Your URLs
Edit `config/pages-to-scan.csv`:
```csv
PageName,PageURL,Environment,RunTests
Homepage,https://example.com/en/,qa,true
About Page,https://example.com/en/about,qa,true
```

### 2. Scan Pages
```bash
npx tsx helpers/orchestrator/pageScanner.ts
```

### 3. Run Tests
```bash
# Option A: Quick presence check (~5 min)
npx playwright test tests/specs/dynamic/page-mapper.spec.ts

# Option B: Full test suite (~20 min) - Runs ALL test cases
npx tsx helpers/orchestrator/componentTestRunner.ts chromium
```

## 📊 What You Get

### Current Results (4 pages scanned):
- **Homepage**: 6 components → HeaderComponent, HomepageHero, TeaserGroup, IndividualTeaser, Banner, FooterBlocks
- **TeaserGrid Page**: 4 components → Header, TeaserGrid, IndividualTeaser, FooterBlocks
- **Early Careers**: 3 components → Header, FooterBlocks, Breadcrumb
- **Search Page**: 2 components → Header, FooterBlocks

### Files Generated:
- `config/page-component-mapping.json` - Machine-readable mapping
- `config/page-component-mapping.csv` - Spreadsheet export
- `reports/component-mapper-report.html` - HTML report (after full tests)

## 🎯 Two Testing Modes

### Mode 1: Component Presence Tests ⚡
**Fast validation** - Verifies components exist on pages

```bash
npx playwright test tests/specs/dynamic/page-mapper.spec.ts
```

- **Duration**: ~5 minutes
- **Use**: Smoke tests, daily CI
- **Tests per component**: 1 (existence check)

### Mode 2: Full Component Tests 🔬
**Comprehensive validation** - Runs ALL test cases for each component

```bash
npx tsx helpers/orchestrator/componentTestRunner.ts chromium
```

- **Duration**: ~20 minutes
- **Use**: Regression, pre-release
- **Tests per component**: ALL (e.g., 20+ for TeaserGrid, 15+ for IndividualTeaser)

**Example:**
```
TeaserGrid page has IndividualTeaser component
→ Runs tests/specs/individualTeaserComponent.spec.ts (ALL 15+ test cases)

TeaserGrid page has TeaserGridComponent
→ Runs tests/specs/teaserGrid.spec.ts (ALL 20+ test cases)
```

## 🛠️ Interactive Menu

Run the helper script:
```bash
.\component-mapper.ps1
```

**Menu Options:**
1. View pages in CSV
2. Validate CSV format
3. Scan pages
4. Run presence tests
5. Run FULL tests
6. View generated mapping
7. Open documentation
8. Fresh scan

## 📚 Documentation

- **[Quick Reference](docs/COMPONENT-MAPPER-QUICK-REFERENCE.md)** - Common commands and tips
- **[Full Guide](docs/COMPONENT-MAPPER-README.md)** - Complete documentation
- **[Pipeline Setup](docs/COMPONENT-MAPPER-PIPELINE-GUIDE.md)** - CI/CD integration
- **[Implementation Summary](docs/IMPLEMENTATION-SUMMARY.md)** - What was built

## 🏃 Running in Pipeline

### GitHub Actions (Automatic)
```bash
git add config/pages-to-scan.csv
git commit -m "Add pages to scan"
git push origin ComponentMapper
```

### Manual Trigger
1. Go to GitHub → **Actions** tab
2. Select **Component Mapper Tests**
3. Click **Run workflow**
4. Choose browser and options

### Pipeline Stages
```
1. Scan Pages (Read CSV → Discover components)
   ↓
2. Presence Tests (Quick validation)
   ↓
3. Full Tests (All test cases)
   ↓
4. Publish Reports (Allure + HTML)
```

## 📂 Project Structure

```
config/
  ├── pages-to-scan.csv              ← INPUT: Add your URLs here
  ├── page-component-mapping.json    ← OUTPUT: Component mapping
  ├── page-component-mapping.csv     ← OUTPUT: Spreadsheet
  └── component-registry.ts          ← 40+ component definitions

helpers/orchestrator/
  ├── csvInputReader.ts              ← Reads CSV input
  ├── pageScanner.ts                 ← Scans pages for components
  └── componentTestRunner.ts         ← Runs full test suites

tests/specs/dynamic/
  └── page-mapper.spec.ts            ← Dynamic presence tests

.github/workflows/
  └── component-mapper.yml           ← CI/CD pipeline

component-mapper.ps1                 ← Interactive menu helper
```

## ✅ Key Features

- ✅ **CSV Input** - Add unlimited pages easily
- ✅ **Component Discovery** - Automatically finds components on pages
- ✅ **Registry-Based** - Maps only actual test components (not sub-elements)
- ✅ **Dual Attribute Support** - Scans both `data-qa` and `data-testid`
- ✅ **Two Test Modes** - Quick presence check or full test suite
- ✅ **Full Test Execution** - Runs ALL test cases for discovered components
- ✅ **CSV Export** - Human-readable mapping spreadsheet
- ✅ **Pipeline Ready** - GitHub Actions, Jenkins, GitLab CI, Azure DevOps
- ✅ **HTML Reports** - Visual test results
- ✅ **Allure Integration** - Detailed test analytics

## 🎯 Example Workflow

**Scenario**: Add new Career page to tests

1. **Edit CSV:**
   ```csv
   Career Page,https://example.com/career,qa,true
   ```

2. **Scan:**
   ```bash
   npx tsx helpers/orchestrator/pageScanner.ts
   ```
   
   **Output:**
   ```
   ✅ Found 5 components on Career Page:
      - Header
      - Breadcrumb
      - JobSearchBanner
      - IndividualTeaser
      - Footer
   ```

3. **Run Full Tests:**
   ```bash
   npx tsx helpers/orchestrator/componentTestRunner.ts chromium
   ```
   
   **Result:**
   ```
   Career Page:
     ✅ HeaderComponent (tests/specs/header.spec.ts)
     ✅ BreadcrumbComponent (tests/specs/breadcrumbComponent.spec.ts)
     ✅ JobSearchBannerComponent (tests/specs/jobSearchBanner.spec.ts)
     ✅ IndividualTeaserComponent (tests/specs/individualTeaserComponent.spec.ts)
     ✅ FooterBlocksOfLinks (tests/specs/footerBlocksOfLinks.spec.ts)
   
   Total: 60+ test cases passed
   ```

## 🔍 Understanding Full Tests

### What "Full Tests" Means:

**Before (Dynamic Tests Only):**
- TeaserGrid page → Check if TeaserGrid component exists ✓
- 1 test per component

**Now (Full Test Suite):**
- TeaserGrid page → Run `tests/specs/teaserGrid.spec.ts` (ALL test cases)
  - Grid layout validation ✓
  - Column configuration ✓
  - Responsive behavior ✓
  - Image loading ✓
  - CTA buttons ✓
  - Pagination ✓
  - ... (20+ total tests)

**This is what you requested** - not just checking presence, but running ALL the test cases you've already written for each component!

## 📊 Current Test Coverage

**Pages**: 4
**Components**: 15 instances (across pages)
**Spec Files**: 8 unique components

### Full Test Execution Example:
```
Homepage (6 components):
  → 6 spec files × ~15 tests each = ~90 test cases

TeaserGrid Page (4 components):
  → 4 spec files × ~15 tests each = ~60 test cases

Early Careers (3 components):
  → 3 spec files × ~10 tests each = ~30 test cases

Search Page (2 components):
  → 2 spec files × ~10 tests each = ~20 test cases

Total: 200+ test cases executed!
```

## 🚨 Important Notes

1. **CSV Input**: All URLs must be in `config/pages-to-scan.csv`
2. **Component Registry**: Only registered components are detected (prevents mapping icons, images, etc.)
3. **Full Tests**: Takes longer but validates everything comprehensively
4. **Presence Tests**: Use for quick checks, full tests for thorough validation
5. **Pipeline**: Configured for GitHub Actions, easily adaptable to other CI/CD

## 💡 Pro Tips

- Use `RunTests=false` in CSV to temporarily skip pages
- Run presence tests daily, full tests weekly
- Check `page-component-mapping.csv` for easy reference
- Use `.\component-mapper.ps1` for interactive menu
- Review documentation in `docs/` folder

## 🎉 Success!

You now have a complete system that:
1. ✅ Reads URLs from CSV/Excel
2. ✅ Discovers components automatically
3. ✅ Runs FULL component test suites (not just presence checks)
4. ✅ Integrates with CI/CD pipelines
5. ✅ Generates comprehensive reports

**Ready to use in production!**

---

For detailed help, see: [`docs/COMPONENT-MAPPER-QUICK-REFERENCE.md`](docs/COMPONENT-MAPPER-QUICK-REFERENCE.md)
