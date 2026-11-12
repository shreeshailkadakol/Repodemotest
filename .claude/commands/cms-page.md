---
description: Create a page in the Optimizely CMS, add components, publish, and validate CMS state + published frontend
argument-hint: "<page type> <page name> [parent] [TEST_ENV]"
---

Run the **CMS page creation automation** for: **$ARGUMENTS**.

Read `prompt.md` at the repo root and follow section 2 ("The prompt") phase by phase, using `$ARGUMENTS` as page type / name / parent / TEST_ENV. Treat the repo skills as the source of truth and invoke them via the Skill tool.

Non-negotiable:
- QA/sandbox only unless the user explicitly says prod. This flow creates and publishes real content.
- Credentials only via `OptimizelyLoginComponent` (`.env`); never print them.
- Ask for missing inputs (components, field values, parent, publish/cleanup); never invent them.
- WAIT for confirmation after the test-case list (Phase 3), before the first run that creates or publishes content (Phase 6), and before logging any ADO bug (Phase 9).
- Validate both layers: CMS state (created, fields saved, components listed, status Published) and the published frontend (URL returns 200, title and all entered values and components render).
