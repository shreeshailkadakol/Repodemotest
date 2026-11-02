---
name: ado-test-case-generation
description: Generate a scope-driven BE + FE test-case sheet (real .xlsx, ADO-import 9-column layout) for a Sitecore/Bayer Beyond user story. Use when a QA engineer asks to "generate test cases" as a manual/exploratory backlog for Azure DevOps import - covering Sitecore authoring (CMS, page builder, Content Hub, content editor), role/permission behavior, AND frontend rendering. NOT for building Playwright automation or the docs/test-cases markdown blueprint (that is playwright-test-authoring + playwright-test-documentation).
---

# ADO Test-Case Sheet Generation (BE + FE)

Act as a QA architect. Produce a single `.xlsx` test-case sheet for a user story,
covering both **BE** (Sitecore authoring surfaces + roles) and **FE** (rendered
output) scope. The set of test cases is **driven by what the story actually
covers** - do not apply every condition to every story.

## When to use vs. not

- **Use this skill** when the deliverable is a flat, ADO-import test-case sheet
  (manual/exploratory backlog), BE and FE together.
- **Do NOT use this skill** for Playwright automation or the rich
  `docs/test-cases/*.md` blueprint - that is `playwright-test-authoring`
  (orchestration) + `playwright-test-documentation` (markdown format, TC-IDs,
  DOM tree, Figma tables). Those stay frontend-only by design.

## What "BE" means here

Sitecore **authoring** behavior and **role/permission** behavior - NOT API or
data-model testing:
- CMS authoring, page builder / Experience Editor, Content Hub, content editor.
- Role gates: webuser vs super user vs admin - what each can see and do.
The story's own frontend framework is FE; the CMS side that produces it is BE.

## Flow

**Step 1 - Get the story.** Fetch the requirement via the
`azure-devops-bug-workflow` skill (`npm run fetch-requirements`) when a story ID
is given; that is the standing process - the requirement is fetched by the
framework, not pasted in chat. If only a component name is given, work from the
existing requirement/task file. Read all ACs, assumptions, and technical notes.

**Step 2 - Classify scope (the core step).** Before writing any case:
1. Split each AC into **BE** (authoring/roles) vs **FE** (rendered output).
2. Detect which **conditional dimensions the story actually touches** (see
   "Conditional rules" below) - localization, RTL, roles, theming, etc.
3. For FE accuracy, inspect the live DOM per the `playwright-dom-inspection`
   skill when the story's rendered structure is not obvious. Optional but
   recommended when writing FE rendering cases.
4. **Share the scope classification with the user for review** before generating
   the full sheet - list which ACs are BE, which are FE, and which conditional
   dimensions you will include vs. exclude and why.

**Step 3 - Generate cases.** Apply the hard rules (always) and only the
conditional rules whose trigger the story meets. One test step per case.

**Step 4 - Self-review** every generated case against the ACs and the rules
below. Remove duplicates; confirm each case is a single, verifiable action.

**Step 5 - Produce the .xlsx.** Write the rows to a JSON file, then run:
```bash
npx tsx scripts/generate-testcase-sheet.ts --input <rows.json> --out docs/test-cases/<slug>-test-cases.xlsx
```
Each JSON row object uses the 9 column keys below, plus a `testLevel` of `"BE"`
or `"FE"` (used only to group BE cases before FE in the single tab - it is not
written as a column). The script writes a real `.xlsx` using the framework's
`xlsx` dependency.

**Step 6 - Report** the scope decisions: counts of BE vs FE cases, which
conditional dimensions were included/excluded and the AC that justified each.

## Output format (fixed - 9 columns, one tab)

Exactly these columns, in this order, ADO-import ready:

`ID` | `Work Item Type` | `Title` | `Test Step` | `Step Action` | `Step Expected` | `Area Path` | `Assigned To` | `State`

- Leave **`ID`, `Area Path`, `Assigned To`, `State` empty**.
- `Work Item Type` = `Test Case`; `Test Step` = `1` (one step per case).
- BE and FE cases live in the **same tab**, BE grouped first (the generator
  sorts by `testLevel`).

## Hard rules (apply to every story)

- **One test step per case.** If a scenario has multiple actions, split it into
  multiple single-step cases.
- **Step 1 carries a `Pre-condition:`** where applicable, e.g.
  `Pre-condition: Launch test page and add the '<Component>' component to a placeholder.`
- **Include negative and edge cases** for any input/interaction/validation.
- **Light/dark in one case** - do not create separate per-theme cases.
- **FE cases cover XL / L / M / S viewports**; state the viewport in the action.
  (BE authoring cases are not viewport-bound.)
- **Cross-browser in one case** - do not duplicate per browser.
- **Ignore Storybook-only features.**
- **Language-agnostic**: assert structure/attributes/behavior, not specific copy,
  so cases hold across locales.
- **No emojis** anywhere. **No secrets** (tokens, PATs, passwords) in any cell.
- **Self-review** all cases before producing the sheet.

## Conditional rules (include ONLY when the story triggers them)

For each, the trigger is what makes it in-scope; if the story does not touch it,
omit it and say so in the Step 6 report.

- **Localization** - trigger: story mentions multi-market / rollout /
  translation / locale-specific fields. Then add localization cases: one English
  and one non-English (a single pair is enough).
- **RTL** - trigger: an RTL market (e.g. Arabic/Hebrew) is in the story's scope,
  or an AC calls out RTL. Then add **one** RTL verification case. Do not add RTL
  for stories with no RTL market in scope.
- **Roles (webuser / super user / admin)** - trigger: the story has role-gated
  or permission-dependent behavior. Then add cases per relevant role. If the
  story is role-agnostic, use one representative role and note it.
- **Theming (light/dark)** - trigger: the design defines both themes for this
  component. One case covering both (per the hard rule).
- **Visual/design precision** - trigger: story has typography/spacing/color ACs.
  Reference the `playwright-figma-visual` skill for the source-of-truth values;
  keep the case language-agnostic.
- **Accessibility** - trigger: a11y/WCAG/keyboard/screen-reader ACs. Add the
  relevant cases (align with `playwright-accessibility`).

## Notes

- The requirement is fetched at runtime; do not expect it pasted in chat.
- Always confirm the scope classification with the user (Step 2.4) before the
  full generation - it is cheap and prevents a large mis-scoped sheet.
- This skill stops at the sheet. It does not write Playwright scripts.
