# Bug Task — <Short Name>

> Copy this file to `reference/bug-task-<short-name>.md` and fill in ONLY the variable data below.
> The workflow rules + script usage live in the `azure-devops-bug-workflow` skill and load automatically —
> do NOT re-type the commands' full reference here.
>
> ⚠️ Never put the Azure DevOps PAT (or any secret) in this file. The scripts read it from `.env`.

---

## Context

**Parent user story:** `<storyId>`
**Requirement doc:** `docs/requirements/requirement-<storyId>-<slug>.md` (from `npm run fetch-requirements <storyId>`)
**Component / area:** `<component name>`
**Environment:** `<QA | Staging | Production>`
**Test Page URL:** `<https://...>`
**Figma URL (optional):** `<https://...>`

---

## Bugs to log

### Bug 1 — <short title>
- **Title:** `<title>`
- **Summary:** `<summary>`
- **Steps (pipe-separated):** `Step 1|Step 2|Step 3`
- **Expected:** `<expected>`
- **Actual:** `<actual>`
- **Priority:** `<1-4>`  **Severity:** `<e.g. 2 - High>`
- **Browser/Device:** `<e.g. Chrome 120>`
- **Screenshots:** `<path1.png,path2.png>`
- **Tags:** `<FE | BE>[,category e.g. visual/a11y/performance/functional]`  ← layer where the issue lives

**Command:**
```bash
npm run log-bug -- --title="<title>" --summary="<summary>" --steps="Step 1|Step 2|Step 3" --expected="<expected>" --actual="<actual>" --environment="<env>" --browser="<browser>" --url="<test page url>" --figma="<figma url>" --priority=<n> --severity="<sev>" --parent-story=<storyId> --screenshots="<paths>" --tags="<FE,visual>" --impact="<impact>"
```

---

## Logged bugs (fill in after creation)

| Bug ID | Title | State | Re-verified? | Notes |
|--------|-------|-------|--------------|-------|
| `#<id>` | <title> | New | ☐ | |

---

## How to run

In chat paste below comment

> Follow the azure-devops-bug-workflow skill. Use `reference/bug-task-<short-name>.md` for the story ID, environment, and bug details. Log the listed bugs, then re-verify.
