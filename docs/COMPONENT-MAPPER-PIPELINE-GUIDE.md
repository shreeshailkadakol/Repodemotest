# Component Mapper - Pipeline Guide

## Overview

This guide explains how to run Component Mapper tests in CI/CD pipelines (GitHub Actions, Jenkins, Azure DevOps, GitLab CI).

## Quick Start

### 1. Add URLs to CSV

Edit `config/pages-to-scan.csv`:

```csv
PageName,PageURL,Environment,RunTests
Homepage,https://bayer-beyond-qa-uk.vercel.app/en/,qa,true
TeaserGrid,https://bayer-beyond-qa-uk.vercel.app/en/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Sprint-9/TeaserGrid,qa,true
Career Page,https://bayer-beyond-qa-uk.vercel.app/en/career/Early-Careers,qa,true
```

### 2. Scan Pages

```bash
npx tsx helpers/orchestrator/pageScanner.ts
```

### 3. Run Full Component Tests

```bash
# Run all component spec files for discovered components
npx tsx helpers/orchestrator/componentTestRunner.ts chromium
```

## Two Types of Tests

### Type 1: Component Presence Tests (Fast)
- **What**: Verifies components exist on pages
- **Duration**: ~3-5 minutes
- **Use Case**: Quick smoke tests, component discovery
- **Command**: `npx playwright test tests/specs/dynamic/page-mapper.spec.ts`

### Type 2: Full Component Tests (Complete)
- **What**: Runs actual component spec files with all test cases
- **Duration**: ~15-30 minutes (depends on components)
- **Use Case**: Comprehensive validation, regression testing
- **Command**: `npx tsx helpers/orchestrator/componentTestRunner.ts`

**Example:**
- TeaserGrid page has **TeaserGridComponent** → Runs `tests/specs/teaserGrid.spec.ts` (all test cases)
- TeaserGrid page has **IndividualTeaserComponent** → Runs `tests/specs/individualTeaserComponent.spec.ts` (all test cases)

## GitHub Actions Setup

### File Structure
```
.github/
  workflows/
    component-mapper.yml   ← Main workflow (created)
```

### Workflow Features

1. **3 Jobs**:
   - `scan-pages`: Scans URLs from CSV
   - `component-presence-tests`: Quick component detection
   - `full-component-tests`: Runs all component spec files

2. **Manual Triggers**:
   - Choose browser (chromium/firefox/webkit)
   - Scan-only mode (skip tests)

3. **Artifacts**:
   - Component mappings (JSON/CSV)
   - Test results
   - Allure reports
   - HTML reports

### Trigger Workflow

#### Automatic (on push)
```bash
git add .
git commit -m "Update pages to scan"
git push origin ComponentMapper
```

#### Manual (GitHub UI)
1. Go to **Actions** tab
2. Select **Component Mapper Tests**
3. Click **Run workflow**
4. Choose options:
   - Browser: `chromium`
   - Scan only: `false`

### View Results

1. **Playwright HTML Report**:
   - Actions → Workflow run → Artifacts → `component-presence-results`
   - Download and open `index.html`

2. **Component Test Report**:
   - Artifacts → `full-component-results`
   - Open `reports/component-mapper-report.html`

3. **Allure Report**:
   - Deployed to GitHub Pages
   - URL: `https://<your-username>.github.io/<repo-name>/`

## Local Development

### Scan Pages
```bash
# Read from CSV
npx tsx helpers/orchestrator/pageScanner.ts

# Validate CSV format
npx tsx helpers/orchestrator/csvInputReader.ts validate

# View CSV contents
npx tsx helpers/orchestrator/csvInputReader.ts
```

### Run Tests Locally

```bash
# Component presence tests (fast)
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --project=chromium

# Full component test suite (comprehensive)
npx tsx helpers/orchestrator/componentTestRunner.ts chromium

# Test specific components only
npx playwright test tests/specs/teaserGrid.spec.ts tests/specs/individualTeaserComponent.spec.ts --project=chromium
```

## CSV Input Format

### Required Columns
- `PageName`: Display name for the page
- `PageURL`: Full URL to scan
- `Environment`: qa/staging/prod
- `RunTests`: true/false (enable/disable scanning)

### Example
```csv
PageName,PageURL,Environment,RunTests
Homepage,https://example.com/en/,qa,true
About Us,https://example.com/en/about,qa,false
Contact,"https://example.com/en/contact?ref=test",prod,true
```

### Tips
- Quote URLs with special characters
- Use `RunTests=false` to temporarily skip pages
- Add as many pages as needed

## Pipeline Configuration

### Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }
        
        stage('Scan Pages') {
            steps {
                sh 'npx tsx helpers/orchestrator/pageScanner.ts'
            }
        }
        
        stage('Component Presence Tests') {
            steps {
                sh 'npx playwright test tests/specs/dynamic/page-mapper.spec.ts --project=chromium'
            }
        }
        
        stage('Full Component Tests') {
            steps {
                sh 'npx tsx helpers/orchestrator/componentTestRunner.ts chromium'
            }
        }
        
        stage('Generate Reports') {
            steps {
                publishHTML([
                    reportDir: 'reports',
                    reportFiles: 'component-mapper-report.html',
                    reportName: 'Component Mapper Report'
                ])
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'config/page-component-mapping.*,reports/**/*'
        }
    }
}
```

### Azure DevOps

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - ComponentMapper
      - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: |
    npm ci
    npx playwright install --with-deps chromium
  displayName: 'Install dependencies'

- script: npx tsx helpers/orchestrator/pageScanner.ts
  displayName: 'Scan pages'

- script: npx playwright test tests/specs/dynamic/page-mapper.spec.ts
  displayName: 'Component presence tests'

- script: npx tsx helpers/orchestrator/componentTestRunner.ts chromium
  displayName: 'Full component tests'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/test-results.xml'

- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: 'reports'
    artifactName: 'test-reports'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - scan
  - test-presence
  - test-full
  - report

scan_pages:
  stage: scan
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx tsx helpers/orchestrator/pageScanner.ts
  artifacts:
    paths:
      - config/page-component-mapping.json
      - config/page-component-mapping.csv
    expire_in: 1 week

component_presence_tests:
  stage: test-presence
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx playwright test tests/specs/dynamic/page-mapper.spec.ts
  artifacts:
    paths:
      - test-results/
      - reports/html-report/
    expire_in: 1 week

full_component_tests:
  stage: test-full
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx tsx helpers/orchestrator/componentTestRunner.ts chromium
  artifacts:
    paths:
      - reports/
    expire_in: 1 week

generate_report:
  stage: report
  script:
    - echo "Test reports available in artifacts"
  artifacts:
    reports:
      junit: test-results/*.xml
```

## Advanced Usage

### Environment Variables

```bash
# Set in pipeline
export PLAYWRIGHT_BASE_URL="https://bayer-beyond-qa-uk.vercel.app"
export PLAYWRIGHT_HEADED=false
export PLAYWRIGHT_WORKERS=2
```

### Scheduled Runs

**GitHub Actions** (cron):
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

**Jenkins** (cron):
```groovy
triggers {
    cron('H 2 * * *')  # Daily at 2 AM
}
```

### Parallel Execution

```bash
# Run tests in parallel (4 workers)
npx playwright test tests/specs/dynamic/page-mapper.spec.ts --workers=4
```

### Filtering Tests

```bash
# Run only specific page
npx playwright test --grep "Homepage"

# Run only specific component
npx playwright test --grep "TeaserGrid"

# Exclude specific tests
npx playwright test --grep-invert "flaky"
```

## Troubleshooting

### Pipeline Fails on Scan

**Issue**: CSV file not found
**Solution**: Ensure `config/pages-to-scan.csv` is committed to repo

### Authentication Fails

**Issue**: Cannot access Vercel-protected pages
**Solution**: 
1. Check `helpers/utils/basePage.ts` for auth credentials
2. Update password if changed
3. Ensure HTTP credentials are set in playwright.config.ts

### Tests Timeout

**Issue**: Tests take too long
**Solution**:
```typescript
// Increase timeout in playwright.config.ts
timeout: 60000,  // 60 seconds per test
```

### Component Not Found

**Issue**: Scanner finds component but test fails
**Solution**:
1. Verify component is registered in `config/component-registry.ts`
2. Check if component uses `data-qa` or `data-testid`
3. Ensure attribute value matches exactly (case-sensitive)

## Best Practices

1. **CSV Management**:
   - Keep CSV in version control
   - Review changes in PRs
   - Document page purposes

2. **Pipeline Strategy**:
   - Run presence tests on every PR
   - Run full tests nightly or pre-release
   - Use scan-only mode for mapping updates

3. **Test Execution**:
   - Use `--workers=1` for serial execution (safer)
   - Use `--workers=4` for parallel (faster but may have race conditions)
   - Run headed mode (`--headed`) for debugging

4. **Reporting**:
   - Archive mapping files as artifacts
   - Generate HTML reports for stakeholders
   - Use Allure for detailed test analytics

5. **Maintenance**:
   - Update CSV when pages change
   - Sync component registry with new components
   - Review failed tests weekly

## Support

- **Documentation**: `docs/COMPONENT-MAPPER-README.md`
- **Scanner**: `helpers/orchestrator/pageScanner.ts`
- **Test Runner**: `helpers/orchestrator/componentTestRunner.ts`
- **Dynamic Tests**: `tests/specs/dynamic/page-mapper.spec.ts`
