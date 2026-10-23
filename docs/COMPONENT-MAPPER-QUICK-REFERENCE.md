# Component Mapper - Quick Reference

## 🚀 Quick Start (3 Steps)

### Step 1: Add URLs to CSV
Edit `config/pages-to-scan.csv`:
```csv
PageName,PageURL,Environment,RunTests
Homepage,https://example.com/en/,qa,true
About Us,https://example.com/en/about,qa,true
```

### Step 2: Scan Pages
```bash
npx tsx helpers/orchestrator/pageScanner.ts
```
**Output**: Finds all components on each page

### Step 3: Run Tests

**Option A - Quick Check (Component Presence)**
```bash
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --project=chromium
```
Duration: ~3-5 minutes

**Option B - Full Tests (All Test Cases)**
```bash
npx tsx helpers/orchestrator/componentTestRunner.ts chromium
```
Duration: ~15-30 minutes

---

## 📊 What You Get

### After Scanning:
- `config/page-component-mapping.json` - Machine-readable mapping
- `config/page-component-mapping.csv` - Human-readable spreadsheet

### Example Output:
```
Homepage → 6 components found:
  ✅ Header → tests/specs/header.spec.ts
  ✅ TeaserGrid → tests/specs/teaserGrid.spec.ts
  ✅ Banner → tests/specs/bannerSVariant.spec.ts
  (etc.)
```

### After Running Tests:
- Test results in `test-results/`
- HTML report in `reports/component-mapper-report.html`
- Allure report in `allure-results/`

---

## 🔄 Two Types of Tests

### 1️⃣ Component Presence Tests (Fast)
```bash
npx playwright test tests/specs/dynamic/page-mapper.spec.ts
```
**What it does:**
- ✅ Verifies component exists on page
- ✅ Checks component is in DOM
- ✅ Captures screenshot
- ⏱️ ~10-15 seconds per component

**Use when:**
- Quick smoke test
- Component discovery
- Daily CI checks

### 2️⃣ Full Component Tests (Complete)
```bash
npx tsx helpers/orchestrator/componentTestRunner.ts chromium
```
**What it does:**
- ✅ Runs ENTIRE spec file for each component
- ✅ All test cases execute (not just presence)
- ✅ Full functional validation
- ⏱️ ~2-5 minutes per component

**Example:**
- Page has **TeaserGrid** → Runs `teaserGrid.spec.ts` (all 20+ test cases)
- Page has **IndividualTeaser** → Runs `individualTeaserComponent.spec.ts` (all 15+ test cases)

**Use when:**
- Full regression testing
- Pre-release validation
- Weekly/nightly runs

---

## 📝 CSV Format

```csv
PageName,PageURL,Environment,RunTests
Homepage,https://example.com,qa,true
"Page with, comma",https://example.com/page,prod,true
Skip This Page,https://example.com/skip,qa,false
```

**Columns:**
- `PageName` - Display name
- `PageURL` - Full URL to scan
- `Environment` - qa/staging/prod
- `RunTests` - true (scan) / false (skip)

---

## 🔧 Common Commands

### Validate CSV
```bash
npx tsx helpers/orchestrator/csvInputReader.ts validate
```

### View CSV Contents
```bash
npx tsx helpers/orchestrator/csvInputReader.ts
```

### Rescan (Clear Old Data)
```bash
# Delete old mapping
Remove-Item config/page-component-mapping.json

# Scan fresh
npx tsx helpers/orchestrator/pageScanner.ts
```

### Run Specific Page Tests
```bash
npx playwright test --grep "Homepage"
npx playwright test --grep "TeaserGrid"
```

### Run in Headed Mode (See Browser)
```bash
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --headed
```

---

## 🐛 Troubleshooting

### ❌ "Component not found"
**Fix:** Add component to `config/component-registry.ts`
```typescript
{
  dataQa: 'my-component',
  componentName: 'MyComponent',
  specFile: 'tests/specs/myComponent.spec.ts',
  testTags: ['@MyComponent', '@Functional']
}
```

### ❌ "Spec file not found"
**Fix:** Check spec file path in component registry matches actual file

### ❌ Authentication fails
**Fix:** Verify password in `helpers/utils/basePage.ts` (currently: "beyond2025")

### ❌ Duplicate pages in mapping
**Fix:** Delete `page-component-mapping.json` and rescan

---

## 🎯 Pipeline Usage

### GitHub Actions (Automatic)
```bash
git add config/pages-to-scan.csv
git commit -m "Add new pages to scan"
git push
```
**Result:** Pipeline auto-runs scan + tests

### Manual Trigger
1. Go to GitHub → Actions
2. Select "Component Mapper Tests"
3. Click "Run workflow"
4. Choose browser (chromium/firefox/webkit)

### View Results
- Artifacts → `component-mapping` (JSON/CSV files)
- Artifacts → `full-component-results` (HTML report)
- GitHub Pages → Allure report

---

## 📦 Files Created

```
config/
  ├── pages-to-scan.csv              ← INPUT: URLs to scan
  ├── page-component-mapping.json    ← OUTPUT: Component mapping
  └── page-component-mapping.csv     ← OUTPUT: Spreadsheet

helpers/orchestrator/
  ├── csvInputReader.ts              ← Reads CSV input
  ├── pageScanner.ts                 ← Scans pages
  └── componentTestRunner.ts         ← Runs full tests

tests/specs/dynamic/
  └── page-mapper.spec.ts            ← Presence tests

.github/workflows/
  └── component-mapper.yml           ← CI/CD pipeline
```

---

## 💡 Pro Tips

1. **Start Small**: Test with 1-2 pages first
2. **Use RunTests=false**: Temporarily skip pages without deleting
3. **Check CSV Export**: `page-component-mapping.csv` is great for documentation
4. **Headed Mode**: Use `--headed` flag to debug issues visually
5. **Parallel Tests**: Use `--workers=4` for faster execution (presence tests only)

---

## 📚 Full Documentation

- **Complete Guide**: `docs/COMPONENT-MAPPER-README.md`
- **Pipeline Guide**: `docs/COMPONENT-MAPPER-PIPELINE-GUIDE.md`
- **Component Registry**: `config/component-registry.ts`

---

## ⚡ One-Liner Examples

```bash
# Scan and test everything (quick)
npx tsx helpers/orchestrator/pageScanner.ts && npx playwright test tests/specs/dynamic/page-mapper.spec.ts

# Scan and test everything (full)
npx tsx helpers/orchestrator/pageScanner.ts && npx tsx helpers/orchestrator/componentTestRunner.ts chromium

# Just scan, no tests
npx tsx helpers/orchestrator/pageScanner.ts

# Just test (using existing mapping)
npx playwright test tests/specs/dynamic/page-mapper.spec.ts
```

---

## 🎉 Success Criteria

After running, you should see:

✅ CSV validated and read
✅ Pages scanned (X components found per page)
✅ Mapping files generated (JSON + CSV)
✅ Tests executed (presence or full)
✅ Reports generated (HTML + Allure)
✅ All components verified on all pages

**Total time**: 
- Scan: ~1-2 minutes per page
- Presence tests: ~3-5 minutes total
- Full tests: ~15-30 minutes total
