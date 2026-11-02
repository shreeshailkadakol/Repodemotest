---
description: Analyze an Azure DevOps user story / work item — summary, QA scope, and business gaps
argument-hint: "<work item ID>"
---

Analyze the requirement for work item **$ARGUMENTS** (ask for the ID if none is given).

Use the `requirement-analysis` skill for the how. It builds on `azure-devops-bug-workflow`
(which wraps `npm run fetch-requirements` and the Azure DevOps MCP to pull the story, its
acceptance criteria, comments, and linked items).

Deliver three things, in this order:

1. **Requirement summary** — title / type / state, description, and **acceptance criteria as a
   checklist**, plus notable attachments or linked items.
2. **QA scope** — what QA will and will not validate for this story: in-scope vs out-of-scope,
   test types (functional / visual / a11y / rollout / BE-authoring), and the sites / languages /
   environments this framework should cover.
3. **Business gaps** — ambiguities, missing or untestable acceptance criteria, unhandled edge
   cases, and open questions to raise with the PO/BA before test design. Flag each as a
   question, not an assumption.

Read-only — do not create or modify any work items. Raising gaps means listing them for the user,
not editing the story.
