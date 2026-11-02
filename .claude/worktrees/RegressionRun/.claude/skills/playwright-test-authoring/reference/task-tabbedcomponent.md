# Task — Tabbed Content Component

## Variable data

**Component name:** TabbedComponent (Tabbed Content Component)

**User story number(s):**
- `683` — Tabbed Content component (State: QA in progress)

**Test Page URL(s):**
- Main: `https://bayer-beyond-qa-uk.vercel.app/en/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint24/tabbedcomponent`

**Figma file key:** `fiKrYZCKNM1OqXHQoGwrlX`

**Figma URL:** `https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=21949-7557&m=dev`

**Figma node IDs (per viewport):**
| Viewport | State | node-id |
|----------|-------|---------|
| XL | default | `21949-7554` |
| LG | default | `21949-7566` |
| MD | default | `21949-7600` |
| SM | default | `21949-7641` |

---

## Scope notes (frontend only)

Acceptance criteria that are FE-testable:
- **AC3:** Tab navigation displayed horizontally above content; first tab selected by default.
- **AC4:** Selecting a tab highlights it and swaps the content below; nav stays visible.
- **AC5:** When tabs exceed horizontal space, horizontal scroll is available.

Out of FE scope (CMS backend):
- **AC1:** Editor can create/name/reorder tabs.
- **AC2:** Only Text-Image components can be added per tab.

Technical note: implemented comparable to the regular accordion (not simple accordion).

## How to run

> Follow the playwright test-authoring skills. Use `reference/task-tabbedcomponent.md` for the story numbers, Test Page URL, and Figma node IDs. Execute Steps 1-8.
