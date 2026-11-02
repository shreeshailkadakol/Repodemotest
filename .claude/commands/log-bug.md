---
description: Log an Azure DevOps bug (with confirmation) and link it to its story
argument-hint: "<short bug description or failing spec>"
---

Log a bug for: **$ARGUMENTS**

Use the `azure-devops-bug-workflow` skill for drafting and creating the bug (title, steps to reproduce, expected vs actual, environment, artifacts) — the skill defines the format and the `npm run log-bug` mechanics.

Two gates that always apply to this command:
1. **Show the drafted bug and get explicit user approval BEFORE creating it** — creating an Azure DevOps work item is outward-facing and hard to reverse.
2. **Never include credentials, tokens, or secrets** in the bug content.

On approval: create the Bug, attach screenshots, link it to the parent user story, and report the new Bug ID and its URL.
