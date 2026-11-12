# CMS Page Creation Automation Prompt

Reusable prompt for automating **Optimizely CMS** page creation. It lets you add any CMS component, populate its input fields, publish the page, and validate both the CMS state and the published page.

It builds on the existing `/cms-page` command, the `playwright-*` skills, and the working implementation in `components/cmsPageComponent.ts` and `tests/specs/cmsPageComponent.spec.ts`.

> **Safety:** this flow changes CMS content. Use only a QA or sandbox instance. Use prod only if you say so explicitly. Credentials come from `.env` (`OPTIMIZELY_CMS_USERNAME` / `OPTIMIZELY_CMS_PASSWORD`) and are referenced by name only, never printed.

---

## 1. Inputs (fill in; missing items will be asked for, never invented)

```
CMS dashboard URL   : https://localhost:5000/Optimizely/CMS/dashboard
Published base URL  : https://localhost:5000/en/
TEST_ENV            : qa
Story ID (optional) : <ADO ID, or "none">
Parent location     : Start   (or a QA/sandbox folder)
Page type           : Standard Page   (or Article, Landing Page, News Page, Product, ...)
Page name           : QA-Auto-<timestamp>   (unique per run)
Components / blocks : <list: component type -> where it goes (content area / field)>
Field values        : <field label -> value, per page and per component>
Publish             : yes | no (draft only)
Cleanup             : keep | delete after run
```

### Data-driven spec (preferred)

Describe the page as data. The component then needs no new code per page, only a new entry.

```typescript
export interface CmsFieldValue {
  label: string;                                   // field label as shown in the editor
  kind: 'text' | 'textarea' | 'richtext' | 'image' | 'link' | 'contentArea' | 'select';
  value: string;                                   // text, or the name of the item to pick
}

export interface CmsComponentSpec {
  type: string;                                    // e.g. 'Teaser Block'
  target: string;                                  // content area / field it is added to
  fields: CmsFieldValue[];
}

export interface CmsPageSpec {
  pageType: string;
  namePrefix: string;
  parent: string;
  fields: CmsFieldValue[];
  components: CmsComponentSpec[];
  publish: boolean;
  cleanup: boolean;
}
```

---

## 2. The prompt (copy from here)

```
Automate CMS page creation for: <Page type> / <Page name>, in <TEST_ENV>.
Components to add: <list>. Field values: <list>. Publish: <yes/no>.

Follow the repo skills; they are the source of truth. Invoke each with the Skill tool
and do not restate their rules. Run the phases in order. Stop and report if a phase cannot complete.

PHASE 0 - Inputs and safety
- Confirm the target is a QA/sandbox instance and a designated test location.
- Ask for any missing input. Do not invent locations, content or credentials.
- Credentials: read only via OptimizelyLoginComponent.credentials (.env). Never print them.

PHASE 1 - Requirement (only if a story ID is given)  [skill: azure-devops-bug-workflow]
- Run `npm run fetch-requirements <id>`. Do NOT use the MCP ADO tool.
- Split the ACs into CMS-authoring ACs and frontend-rendering ACs.

PHASE 2 - DOM inspection of the editor  [skill: playwright-dom-inspection, MANDATORY]
- Log in with components/optimizelyLoginComponent.ts. Open the Edit view.
- Inspect, with a temporary spec that you delete afterwards:
  * Create (+) menu, Create dialog (name input, page-type tiles, Create button)
  * the editor form for the chosen page type: every field's label, element type
    (input / textarea / rich-text editor / dropdown / image picker / link picker)
  * content areas: how a component is added ("Select Content", drag-drop, "Add ..." buttons)
  * each component's own property form once added
  * the Publish control and the status text ("Not published yet" / "Published")
- Record id, role, label, title, scoped CSS and iframe boundaries. The editor is Dojo + React
  and has few data-qa attributes, so expect to rely on these.
- Take a screenshot at each step. Use a 1920x1080 viewport; the page tree and panels collapse at narrow widths.

PHASE 3 - Test cases  [skill: playwright-test-documentation]
- Write docs/test-cases/CmsPage<Name>.md with TC-IDs in two groups:
  * CMS: page created under the right parent, correct type, each field saved,
    each component added to the right area, required-field validation, status changes to Published.
  * Frontend: published URL returns 200, page title and each entered field value render,
    each added component renders.
- Show me the list and WAIT for confirmation before writing code.

PHASE 4 - Implement  [skills: playwright-test-authoring, playwright-smart-locators]
a) data/componentURL.ts: CmsPageComponent -> { url (dashboard), publishedBase }. No hardcoded base URL elsewhere.
b) Extend components/cmsPageComponent.ts. Keep what already works:
   openEditView, openCreatePageDialog, createPage(name, type), publish (two-step), publishedUrl.
   Add generic, spec-driven methods:
   - setField(field: CmsFieldValue)        -> dispatches on `kind` to the right fill strategy
   - addComponent(spec: CmsComponentSpec)  -> adds a block to a content area, then fills its fields
   - populatePage(spec: CmsPageSpec)       -> sets all page fields, then all components
   - verifyFieldSaved(field)               -> reads the value back from the editor
   - verifyComponentInArea(spec)           -> the block is listed in its content area
   - verifyPublishedOnFrontend(spec)       -> page and content are live (see rules below)
   Every element goes through findSmart with 3+ fallbacks and a description.
c) tests/specs/cmsPageComponent.spec.ts: one test per scenario (see 3). Build page names with
   CmsPageComponent.uniquePageName(). Log the created page name for cleanup.

PHASE 5 - Self-review  [skill: playwright-pre-pr-checklist]
- Fix the checklist findings. Run `npm run lint`. If lint fails on the repo config itself, say so and continue.

PHASE 6 - Execute  [skill: playwright-execution-reporting]
- CONFIRM with me before the first run that creates or publishes content.
- Run: TEST_ENV=<env> npx playwright test tests/specs/cmsPageComponent.spec.ts --project=chromium
- If I ask for Allure: `npm run allure:generate` then `npm run allure:open`.

PHASE 7 - Validate both layers
- CMS: page exists under the parent, correct type, field values saved, components listed, status Published.
- Frontend: published URL returns 200 and shows the title and every populated value and component.
- Cleanup: if "delete", remove only pages this run created and report any leftovers by name.

PHASE 8 - Analyse failures  [skill: playwright-test-failure-analysis]
- Group failures by step. Fix script and locator problems. Do not mask a real defect to make a test pass.

PHASE 9 - Bugs  [skill: azure-devops-bug-workflow]
- Only for real product defects. Show me the Bug title and description and WAIT for approval before creating it.

Finish with: pages created (name, type, parent), components and fields populated,
CMS validation result, frontend validation result, cleanup status, report location, any bug logged.
```

---

## 3. Scenario template (one test per scenario)

| TC | Scenario | CMS check | Frontend check |
|---|---|---|---|
| TC-CP01 | Create Page dialog opens | name input, page-type tiles and Create button visible | n/a |
| TC-CP02 | Create page with name and type | editor opens, header shows the name | n/a |
| TC-CP03 | Populate page fields | each value reads back from the editor | each value renders |
| TC-CP04 | Add component to a content area | block is listed in the area, its fields saved | block renders on the page |
| TC-CP05 | Publish | status changes from "Not published yet" to Published | URL returns 200 |
| TC-CP06 | Required field blank | validation message, publish blocked | n/a |
| TC-CP07 | Draft only (publish = no) | status stays Draft | URL does not return 200 |

---

## 4. Lessons from the working implementation (follow these)

- **`findSmart` does not wait.** `SmartLocator` calls `isVisible({timeout})`, and Playwright ignores that timeout. Wait for dynamic UI with `expect.poll` around the `findSmart` call. A fixed `waitForTimeout` is a last resort.
- **Publishing is two clicks.** The toolbar Publish button opens a panel (it shows "Not published yet"). The panel's own Publish button is the last `span[role="button"]` containing "Publish". Then poll the frontend, because publishing is asynchronous.
- **The page name lives in a `title` attribute.** Use `span.title[title="<name>"]`. A plain text locator matches nothing, or several nodes, because the preview iframe repeats the name.
- **Published URL** is `<publishedBase>/<name lower-cased, non-alphanumerics -> '-'>/`. Verify this pattern on a new site before relying on it.
- **Use 1920x1080.** At narrow widths the page tree and toolbar collapse and the Create (+) button disappears.
- **After login, go to the Edit view.** The dashboard has no Create (+) button.
- **Strict mode:** scope selectors so each strategy resolves to one node, or the locator fails.
- **Frontend validation:** assert on the data you entered (name, field values) and on structure. Do not assert on copy you did not write.

## 5. Cleanup and hygiene

- Every run creates real content. Name pages `QA-Auto-<timestamp>` so they are easy to find.
- With "keep", the run only logs the page name. With "delete", add an `afterEach` that removes only pages the run created.
- Remove temporary inspector specs when done.
- Never commit `.env`, tokens or screenshots that show credentials.

## 6. Deliverables

| File | Purpose |
|---|---|
| `components/cmsPageComponent.ts` | Page object with generic `setField`, `addComponent`, `populatePage` and verify methods |
| `data/componentURL.ts` | `CmsPageComponent` dashboard URL and published base |
| `tests/specs/cmsPageComponent.spec.ts` | One test per scenario |
| `docs/test-cases/CmsPage<Name>.md` | Test-case blueprint (after confirmation) |
| Allure / HTML report | On request |
