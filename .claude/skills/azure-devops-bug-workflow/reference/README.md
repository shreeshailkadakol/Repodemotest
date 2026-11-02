# Reference — per-task bug data

This folder holds **task-specific, throwaway data** for the Azure DevOps bug workflow: the story being worked,
the environment, and the list of bugs to log / re-verify. The **reusable rules + script usage** live in
`../SKILL.md` and load automatically — they are NOT repeated here.

⚠️ Never store the Azure DevOps PAT or any secret in these files. Scripts read it from `.env`.

## Files

| File | Purpose |
|------|---------|
| `_BUG-TASK-TEMPLATE.md` | Blank template. Copy → `bug-task-<short-name>.md` and fill in the variable data. |

## Per-task workflow

1. Copy `_BUG-TASK-TEMPLATE.md` → `bug-task-<short-name>.md`.
2. Fill in: parent story ID, environment, test URL, and the bug(s) to log.
3. In chat, tell the assistant to follow the `azure-devops-bug-workflow` skill and use that task file.

The scripts (`npm run fetch-requirements` / `log-bug` / `bug-helper`) and the re-verify steps come from the
skill; only the values in the task file change per run.
