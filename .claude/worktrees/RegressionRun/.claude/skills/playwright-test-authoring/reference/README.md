# Reference — per-component task data

This folder holds **task-specific, throwaway data** for Playwright component test runs: component name,
user-story numbers, Test Page URLs, and Figma node IDs. The **reusable rules** (Steps 1–8, SmartLocator,
DOM inspection, Figma extraction, accessibility, Pre-PR) live in the skills under `.claude/skills/` and load
automatically — they are NOT repeated here.

## Files

| File | Purpose |
|------|---------|
| `_TASK-TEMPLATE.md` | Blank template. Copy → `task-<component-name>.md` and fill in the variable data. |
| `sample-task-invocation.md` | Fully worked example (Visual Asset / Transparency datagrid) — verbatim from `playwright-prompt.md` lines 1213–1372. |
| `example-requirement-document-download.md` | Worked requirement block example — verbatim from lines 973–1140. |

## Per-component workflow (Option B)

1. Copy `_TASK-TEMPLATE.md` to `task-<component-name>.md`.
2. Fill in ONLY: component name, story number(s), Test Page URL(s), Figma URL + per-viewport node IDs.
3. In chat, tell the assistant to follow the playwright test-authoring skills and use that task file.

This keeps `playwright-prompt.md` untouched and avoids stale per-component blocks piling up in one file.
