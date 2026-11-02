---
name: requirement-analysis
description: Analyze an Azure DevOps requirement (user story / work item) and produce a QA-oriented analysis — a plain-language summary, the QA scope (what will and won't be validated, test types, sites/languages/environments), and the business gaps (ambiguities, missing or untestable acceptance criteria, edge cases, open questions). Use when a QA engineer asks to "analyze a requirement", "share the QA scope", "find gaps in a story", or before designing test cases. Backs the /analyze-requirement command. Builds on the azure-devops-bug-workflow skill for fetching the work item.
---

# Requirement Analysis (Summary → QA Scope → Business Gaps)

> Turns a raw Azure DevOps story into a QA-ready analysis. This is the **thinking step before test
> design** — it does not write tests. For fetching mechanics use `azure-devops-bug-workflow`; for
> turning the resulting scope into test cases use `ado-test-case-generation` (BE+FE sheet) or
> `playwright-test-documentation` (FE markdown blueprint).

## Scope of this skill

- **Frontend-focused framework**, but analysis covers both **BE (Sitecore authoring / roles / data)**
  and **FE (rendered output)** so nothing is missed — mark each item BE or FE.
- **Read-only.** Never create or modify work items. "Raising a gap" means listing it for the user
  to take to the PO/BA, not editing the story.
- Be direct and evidence-based (per `CLAUDE.md`): if an acceptance criterion is untestable, vague,
  or contradicts another, say so plainly — don't paper over it.

---

## Step 1 — Fetch the requirement (full context)

Pull the work item **and its context** — description, acceptance criteria, comments, attachments,
and linked items. Comments often contain the real intent and late-breaking decisions.

```bash
npm run fetch-requirements <work-item-id>
```

- Saves `docs/requirements/requirement-<id>-<slug>.md`.
- For **Comments / History / linked items** the script doesn't fully cover, use the **Azure DevOps
  MCP** (`wit_get_work_item`, `wit_list_work_item_comments`) — see `azure-devops-bug-workflow`.
- Read the whole story including the comment thread before analyzing. Do not analyze from the title.

---

## Step 2 — Requirement summary (plain language)

Restate the story so a non-author understands it:

- **Title / type / state / parent** and one-sentence "what this delivers and for whom".
- **Description** condensed to the actual behaviour change.
- **Acceptance criteria as a numbered checklist**, each rewritten as a *testable statement*
  (input → expected observable result). If an AC isn't testable as written, note it here and carry
  it into Step 4.
- **Notable attachments / linked items** (Figma, designs, dependent stories, prior bugs).

Keep it concise — this is orientation, not a transcript.

---

## Step 3 — QA scope

State exactly what QA will validate, so the effort is agreed before test design.

- **In scope** — the concrete behaviours QA will verify, mapped to ACs (AC1 → …, AC2 → …).
- **Out of scope** — what QA will *not* cover and why (e.g. backend infra, third-party service
  internals, content correctness, performance unless called out). Being explicit here prevents
  scope creep.
- **Test types** — pick the ones the story actually needs:
  functional · visual (Figma) · accessibility (WCAG 2.1 AA) · rollout / multi-site · BE authoring
  (Sitecore fields, roles/permissions, publishing) · SEO/meta · redirects.
- **Coverage matrix** — which **sites / languages / environments** to exercise. Pull sites &
  languages from `config/rollout-config.ts` and env keys from `helpers/utils/envUtils.ts`. Prefer
  **one language per scenario, different languages across scenarios** (team convention) so locales
  get coverage without redundant runs. Name the env(s): QA / staging / prod.
- **Prerequisites** — configuration or data the tester must set up first (CMS field values,
  published pages, feature flags, auth/session). List these as a checklist the user can action.
- **Entry / exit** — what state the story must be in to test (e.g. "Ready for QA", deployed to the
  target env) and what "done" looks like (all in-scope ACs PASS, bugs logged).

---

## Step 4 — Business gaps (raise, don't assume)

Surface everything that would block or weaken testing. For each gap give: **what's unclear / missing**,
**why it matters for QA**, and a **specific question** to ask the PO/BA. Never silently fill a gap
with an assumption — if you must assume to proceed, label it "ASSUMPTION" and flag it for confirmation.

Look for:

- **Ambiguous ACs** — "should work correctly", undefined states, missing expected values.
- **Missing ACs** — behaviours implied by the description but not covered (error states, empty/blank
  input, max length, invalid input, unauthorized user, concurrent edits).
- **Untestable ACs** — no observable/measurable outcome, or depends on something QA can't inspect.
- **Edge cases & negative paths** — what happens on failure, timeout, permission denied, or bad data.
- **Cross-cutting concerns** — multi-language / RTL, accessibility, SEO/meta, responsive breakpoints,
  caching (e.g. Vercel edge serving stale output), redirects, analytics.
- **Dependencies & sequencing** — other stories, backend readiness, third-party services, migration
  order — anything that gates when this can actually be validated.
- **Consistency** — ACs that contradict each other, the description, comments, or the linked design.
- **Definition of done / rollout** — which sites the story targets, and whether every targeted
  site/language is expected to behave identically.

---

## Output format

Deliver the three sections in order — **Summary**, **QA Scope**, **Business Gaps** — as concise
markdown the user can paste into a story comment or test plan. Use tables for the coverage matrix
and the gap list. End with a short **"Ready to proceed?"** note: if gaps are blocking, say test
design should wait on answers; if not, say what you'd generate next
(`/generate-be-fe-test-cases` or `/generate-test-cases`).

Do not post anything to Azure DevOps unless the user explicitly asks — this skill is read-only.
