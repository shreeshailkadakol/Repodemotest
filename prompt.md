# CMS Page Creation Automation: prompt

Reusable prompt for automating **Optimizely CMS** page creation: add any CMS component, populate its fields, publish, and validate both the CMS state and the published page.

Run it with `/cms-page <type> <name> [parent] [env]` (see `.claude/commands/cms-page.md`), or paste section 2 into Claude Code.

> **Safety:** this flow creates and publishes real CMS content. Use a QA/sandbox instance only; use prod only if explicitly told to. Credentials come from `.env` (`OPTIMIZELY_CMS_USERNAME` / `OPTIMIZELY_CMS_PASSWORD`) via `OptimizelyLoginComponent`, referenced by name and never printed.

> **Current repo state:** `components/cmsPageComponent.ts` (create page, set fields, add Editorial/Teaser blocks, image picker, two-step publish, CMS + frontend validation, cleanup), `tests/specs/cmsPageComponent.spec.ts` (TC-CP01, TC-CP02) and `docs/dom-inspection-optimizely-cms-page.md` exist. Extend them rather than starting over. Created pages are retained by default; they are only moved to the CMS Trash when `CMS_CLEANUP=delete` is set explicitly.

---

## 1. Inputs (missing items are asked for, never invented)

```
CMS dashboard URL   : from data/componentURL.ts -> CmsPageComponent.url
Published base URL  : from data/componentURL.ts -> CmsPageComponent.publishedBase (add if missing)
TEST_ENV            : qa
Story ID (optional) : <ADO ID or "none">
Parent location     : Start (or a QA/sandbox folder)
Page type           : Standard Page | Article | Landing Page | ...
Page name           : QA-Auto-<timestamp>   (unique per run)
Components / blocks : <component type -> content area / field>
Field values        : <field label -> value, for the page and each component>
Publish             : yes | no (draft only)
Cleanup             : keep | delete (only pages this run created)
```

### Data-driven spec

Describe the page as data so adding a component needs a new entry, not new code.

```typescript
export interface CmsFieldValue {
  label: string;   // field label as shown in the editor
  kind: 'text' | 'textarea' | 'richtext' | 'image' | 'link' | 'contentArea' | 'select';
  value: string;   // text, or the name of the item to pick
}
export interface CmsComponentSpec {
  type: string;    // e.g. 'Teaser Block'
  target: string;  // content area / field it is added to
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

The repo skills are the source of truth. Invoke each with the Skill tool and do not
restate their rules. Run the phases in order. Stop and report if a phase cannot complete.

PHASE 0 - Inputs and safety
- Confirm the target is a QA/sandbox instance and a designated test location.
- Ask for any missing input. Do not invent locations, content or credentials.
- Credentials: only via OptimizelyLoginComponent (.env). Never print them.

PHASE 1 - Requirement (only if a story ID is given)  [skill: azure-devops-bug-workflow]
- Run `npm run fetch-requirements <id>`. Do NOT use the MCP ADO tool.
- Split the ACs into CMS-authoring ACs and frontend-rendering ACs.

PHASE 2 - DOM inspection of the editor  [skill: playwright-dom-inspection, MANDATORY]
- Log in with components/optimizelyLoginComponent.ts, go to the Edit view, viewport 1920x1080.
- With a temporary spec (deleted afterwards) inspect: the Create (+) menu and dialog (name input,
  page-type tiles, Create button); the editor form for the page type (each field's label and
  control type); how a component is added to a content area; each component's property form;
  the Publish control and status text.
- Record id, role, label, title, scoped CSS and iframe boundaries (the editor has few data-qa attributes).
- Screenshot each step. Save findings to docs/dom-inspection-optimizely-cms-page.md.

PHASE 3 - Test cases  [skill: playwright-test-documentation]
- Write docs/test-cases/CmsPage<Name>.md with TC-IDs in two groups:
  * CMS: page created under the parent with the right type, fields saved, components in the
    right area, required-field validation, status changes to Published.
  * Frontend: published URL returns 200; title, every entered value and every added component render.
- Show the list and WAIT for confirmation before writing code.

PHASE 4 - Implement  [skills: playwright-test-authoring, playwright-smart-locators]
a) data/componentURL.ts: CmsPageComponent -> { url, publishedBase }. No hardcoded URLs elsewhere.
b) Create components/cmsPageComponent.ts (follow components/optimizelyLoginComponent.ts for structure):
   - openEditView(), openCreatePageDialog(), createPage(name, type)
   - publish() (two-step, see section 4), publishedUrl(name), static uniquePageName(prefix)
   - setField(field)            -> dispatches on `kind` to the right fill strategy
   - addComponent(spec)         -> adds a block to a content area, then fills its fields
   - populatePage(spec)         -> page fields first, then components
   - verifyFieldSaved(field), verifyComponentInArea(spec)
   - verifyPublishedOnFrontend(spec) -> page and content are live
   Every element goes through findSmart with 3+ fallbacks and a description.
c) Create tests/specs/cmsPageComponent.spec.ts: one test per scenario (section 3). Log the created
   page name for cleanup.

PHASE 5 - Self-review  [skill: playwright-pre-pr-checklist]
- Fix findings, run `npm run lint`. If lint fails on repo config itself, say so and continue.

PHASE 6 - Execute  [skill: playwright-execution-reporting]
- CONFIRM with me before the first run that creates or publishes content.
- TEST_ENV=<env> npx playwright test tests/specs/cmsPageComponent.spec.ts --project=chromium
- Allure only if asked: `npm run allure:generate` then `npm run allure:open`.

PHASE 7 - Validate both layers
- CMS: page under the parent, correct type, field values read back, components listed, status Published.
- Frontend: published URL returns 200 and shows the title and every populated value and component.
- Cleanup: if "delete", remove only pages this run created; report leftovers by name.

PHASE 8 - Analyse failures  [skill: playwright-test-failure-analysis]
- Group failures by step. Fix script/locator problems. Never mask a real defect to get a pass.

PHASE 9 - Bugs  [skill: azure-devops-bug-workflow]
- Only for real product defects. Show the Bug title/description and WAIT for approval before creating it.

Finish with: pages created (name, type, parent), components and fields populated, CMS result,
frontend result, cleanup status, report location, any bug logged.
```

---

## 3. Scenarios (one test each)

| TC | Scenario | CMS check | Frontend check |
|---|---|---|---|
| TC-CP01 | Create Page dialog opens | name input, type tiles, Create button visible | n/a |
| TC-CP02 | Create page with name and type | editor opens, header shows the name | n/a |
| TC-CP03 | Populate page fields | each value reads back from the editor | each value renders |
| TC-CP04 | Add component to a content area | block listed in the area, fields saved | block renders |
| TC-CP05 | Publish | status changes from "Not published yet" to Published | URL returns 200 |
| TC-CP06 | Required field blank | validation message, publish blocked | n/a |
| TC-CP07 | Draft only (publish = no) | status stays Draft | URL does not return 200 |

---

## 4. Rules to follow

Verified against the local Alloy site and the working component. Re-verify on a different site or Optimizely version (details in `docs/dom-inspection-optimizely-cms-page.md`).

- **`findSmart` does not wait.** Wait for dynamic UI with `expect.poll` around the `findSmart` call; use fixed `waitForTimeout` only as a last resort.
- **Publishing is two clicks:** the toolbar Publish opens a panel; the panel's Publish is `li span[role="button"]` containing "Publish". After it, the toolbar Publish button disappears. Then poll the frontend, because publishing is asynchronous.
- **The page name lives in a `title` attribute** (`span.title[title="<name>"]`). Tree rows also carry `title="<name>, Content Reference ... (Type: Standard Page)"`, so match titles with an exact regex, not a substring.
- **Published URL** is `<publishedBase>/<name lower-cased, non-alphanumerics -> '-'>/`; it matches the panel's "View on website" link.
- **Hidden duplicates:** the page editor stays in the DOM behind the block view (hidden "Select Image", hidden rich-text iframe, hidden menus). Use `:visible` for those.
- **Image fields:** open the visible "Select Image", search by file name in the dialog (`div[role="dialog"] input[role="textbox"]`), click the result, then OK. On the frontend, tie the image to its block; the site header reuses the logo.
- **Fields the template does not render** (e.g. Teaser text on a Standard Page): set `rendersOnFrontend: false` and verify them in the CMS only.
- **Use 1920x1080.** At narrow widths the page tree and toolbar collapse and the Create (+) button can disappear.
- **Go to the Edit view after login.** The dashboard has no Create (+) button.
- **Frontend validation:** assert on data you entered and on structure, not on copy you did not write.

## 5. Hygiene

- Name pages `QA-Auto-<timestamp>` so they are easy to find.
- Pages are retained by default: `afterEach` calls `cleanupCreatedPages()`, which only logs the retained page names. With `CMS_CLEANUP=delete` it moves only the pages that test created to the CMS Trash (recoverable) and refuses any name not starting with `QA-Auto`. Deleting pages from earlier runs is never automatic.
- Delete temporary inspector specs when done.
- Never commit `.env`, tokens, or screenshots showing credentials.

## 6. Deliverables

| File | Purpose |
|---|---|
| `components/cmsPageComponent.ts` | Page object with `setField`, `addComponent`, `populatePage`, verify methods |
| `data/componentURL.ts` | `CmsPageComponent` dashboard URL and published base |
| `tests/specs/cmsPageComponent.spec.ts` | One test per scenario |
| `docs/dom-inspection-optimizely-cms-page.md` | Editor DOM findings |
| `docs/test-cases/CmsPage<Name>.md` | Test-case blueprint (after confirmation) |
