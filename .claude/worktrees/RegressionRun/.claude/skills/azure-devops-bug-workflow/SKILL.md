---
name: azure-devops-bug-workflow
description: Workflow for reading Azure DevOps requirements, logging bugs, and re-verifying bugs in this framework. Use when fetching a user story/work item, creating a Bug work item, attaching screenshots, linking a bug to its parent story, or re-checking a bug's state. Wraps the repo scripts fetch-requirements.js, log-bug.js, and bug-helper.js (npm run fetch-requirements / log-bug / bug-helper) and the Azure DevOps MCP server.
---

# Azure DevOps Bug Workflow (Requirements → Log → Re-verify)

> Reusable rules + script usage for the Azure DevOps work-item lifecycle. Per-task data (story IDs, bug IDs,
> environment) goes in `reference/` task files — see `reference/README.md`. Mirrors the `playwright-test-authoring`
> skill structure.

## ⚠️ Security & config (read first)

- All three scripts read config from **`.env`** (via `dotenv`):
  - `AZURE_DEVOPS_PAT` — **required** Personal Access Token. **Never** print it, paste it in chat, commit it, or hardcode it. If it leaks, rotate it in Azure DevOps immediately.
  - `AZURE_DEVOPS_ORGANIZATION` (default `Bayer-SMO-UniNetHub`)
  - `AZURE_DEVOPS_PROJECT` (default `BayCorpWeb`)
  - `AZURE_DEVOPS_BASE_URL` (default `https://dev.azure.com/Bayer-SMO-UniNetHub/BayCorpWeb`)
- Confirm `.env` is gitignored before running. Use least-privilege PAT scopes (Work Items Read & Write only).
- Bug creation is an **outward-facing write** to Azure DevOps. Confirm title/parent-story/severity with the user before creating, unless they've said to proceed.

> **Azure DevOps MCP server**: configured for both Copilot (`.vscode/mcp.json`) and Claude Code (root `.mcp.json`). Its `AZURE_DEVOPS_PAT` is read from your **environment** (not `.env`). Setup & sync details: [`docs/mcp-setup.md`](../../../docs/mcp-setup.md).

---

## Step 1 — Read the requirement

Fetch a work item (user story, etc.) and save a markdown analysis:

```bash
npm run fetch-requirements <work-item-id>
# e.g. npm run fetch-requirements 2602
```

What it does (`scripts/fetch-requirements.js`):
- GETs the work item via Azure DevOps REST API (`api-version=6.0`).
- Extracts Title, Type, State, Description, Acceptance Criteria (+ assignee/priority/severity/tags).
- Cleans HTML → markdown and saves to `docs/requirements/requirement-<id>-<slug>.md`.
- Prints testing recommendations and a derived component name.

**Alternative:** the **Azure DevOps MCP server** can fetch the same work item interactively (useful for Comments/History, linked items, or batch queries the script doesn't cover).

---

## Step 2 — Log a bug

Two ways:

### A) Direct (scripted, repeatable) — `scripts/log-bug.js`
```bash
npm run log-bug -- --title="<title>" --summary="<summary>" \
  --steps="Step 1|Step 2|Step 3" \
  --expected="<expected>" --actual="<actual>" \
  --environment="QA" --browser="Chrome 120" \
  --url="<test page url>" --figma="<figma url>" \
  --priority=2 --severity="2 - High" \
  --parent-story=<storyId> --screenshots="path1.png,path2.png" \
  --impact="<business impact>" --notes="<notes>"
```

Argument reference (parsed by `parseArguments()`):

| Arg | Required | Default | Notes |
|-----|----------|---------|-------|
| `--title` | ✅ | — | Bug title |
| `--summary` | | — | Short summary |
| `--steps` | | — | **Pipe-separated** repro steps (`a\|b\|c`) |
| `--expected` / `--actual` | | "Not specified" | Expected vs Actual table |
| `--screenshots` | | — | **Comma-separated** file paths; uploaded as attachments |
| `--environment` | | — | Also written to `SystemInfo` field |
| `--browser` | | — | Browser/device (goes in description) |
| `--url` | | — | Test page URL |
| `--figma` | | — | Figma design URL |
| `--priority` | | `2` | 1–4 |
| `--severity` | | `3 - Medium` | e.g. `2 - High` |
| `--parent-story` | | — | Links bug to story as **Related** |
| `--impact` / `--notes` | | — | Extra description sections |
| `--tags` | | — | **Comma-separated** tags → `System.Tags` (e.g. `FE`, `BE`, `visual`, `a11y`) |

On success it: creates a `Bug` work item, uploads screenshots, links the parent story, and saves a local backup to `docs/bugs/bug-<id>-<slug>.md`.

### B) Interactive wizard — `scripts/bug-helper.js`
```bash
npm run bug-helper              # guided prompts (functional/visual/perf/a11y/custom)
npm run bug-helper --templates  # copy-paste command examples
```
The wizard collects answers and then runs `npm run log-bug ...` for you.

---

## Screenshot evidence — always annotate before attaching

`log-bug.js` only **attaches** the PNG paths passed via `--screenshots`; it does **not** annotate. So annotation is a manual pre-step: mark the issue on the screenshot **before** logging, then pass the annotated file. A plain landing-page screenshot that doesn't show the defect is not acceptable evidence.

**Convention (pick by bug type):**
- **Visual / UI / layout / styling / a11y bugs → element highlight.** Draw a red outline (and a short label) around the offending element, then capture. Use when the defect is visible on the page.
- **All other bugs (functional, SEO/meta, `<head>`, console/network, data) → callout overlay.** Inject a red-bordered callout box showing **Page URL**, the **actual** value (with the problem part highlighted), and the **expected** value — because the defect isn't visible on the rendered page.

**How (Playwright MCP):** navigate to the page, inject the annotation with `playwright_evaluate`, then `playwright_screenshot` (`savePng:true`, `downloadsDir` = `docs/verification/<storyId>/`). Give the file a descriptive name and pass it to `--screenshots`.

Element-highlight snippet:
```js
// highlight a specific element before screenshot
const el = document.querySelector('<selector>');
if (el) { el.style.outline = '3px solid #d40000'; el.style.outlineOffset = '2px'; el.scrollIntoView({block:'center'}); }
```

Callout-overlay snippet (for non-visual issues, e.g. an insecure canonical):
```js
const box = document.createElement('div');
box.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;'
  + 'background:#fff;border:3px solid #d40000;border-radius:8px;padding:14px 18px;max-width:900px;width:92%;'
  + 'font-family:Consolas,monospace;font-size:14px;line-height:1.5;box-shadow:0 6px 24px rgba(0,0,0,.35)';
box.innerHTML = '<div style="font-weight:700;color:#d40000;">BUG - short title</div>'
  + '<div><strong>Page:</strong> ' + location.href + '</div>'
  + '<div><span style="color:#a00000;font-weight:700;">Actual:</span> ...</div>'
  + '<div><span style="color:#0a7d00;font-weight:700;">Expected:</span> ...</div>';
document.body.appendChild(box);
```

**Replacing a screenshot on an existing work item:** find the `AttachedFile` relation by `attributes.name`, `PATCH` `op:"remove"` `/relations/<index>`, then upload the new file (`POST _apis/wit/attachments`) and `PATCH` `op:"add"` a new `AttachedFile` relation.

---

## Step 3 — Re-verify a bug

There is **no dedicated reverify script.** To re-verify:

1. **Re-run the failing test** (the Playwright spec / scenario that found it).
2. **Check the bug's current state** in Azure DevOps, either:
   - `npm run fetch-requirements <bugId>` — works on any work-item ID, including a Bug (shows State: New/Active/Resolved/Closed), **or**
   - the **Azure DevOps MCP server** — better for reading Comments/History, changing State, or adding a verification comment.
3. **Update the bug**: if the fix works, move it to Done state (via MCP or the Azure DevOps UI) and add a verification note; if it still repros, reopen and add fresh evidence (screenshots, new repro steps) — re-running `log-bug` is for *new* bugs, not updates.

---

## Tagging convention (decide tags per bug)

Tags are now applied via `--tags` and should reflect **where the issue lives**, chosen per bug:

- **`FE`** — frontend/rendering/UI/client-side issue (what the script-tested page shows or does).
- **`BE`** — backend/API/data issue (wrong data, failed request, server error).
- Add a **category** tag where useful: `visual`, `a11y`, `performance`, `functional`, `content`.
- Combine when relevant, e.g. `--tags="FE,visual"` or `--tags="BE,functional"`.

Default rule of thumb: a bug found purely from rendered output / styling / interaction → `FE`; a bug rooted in the API response or data → `BE`. When the layer is genuinely ambiguous, tag both and note the uncertainty in `--notes`.

---

## Logging a bug I (the assistant) discover — with approval

Yes — when a test run or review surfaces a real defect, I can log it for you using the template:

1. **Draft** the bug into a `reference/bug-task-<name>.md` (title, summary, repro steps, expected/actual, severity, screenshots, parent story, and **tags** per the convention above).
2. **Show you the exact `npm run log-bug ...` command** and the chosen tags for review.
3. **Wait for your approval** — bug creation is an outward-facing write to Azure DevOps, so I will not create it without a clear go-ahead.
4. On approval, run the command, then report the new bug ID/URL and the local backup path.

I will not invent repro steps or evidence — if I can't reproduce or screenshot it, I'll say so and ask how to proceed.

## Other notes

- Both API scripts pin `api-version=6.0`.
- Severity strings must match Azure DevOps options exactly (e.g. `2 - High`, `3 - Medium`).

---

## Reference (per-task data)
- `reference/_BUG-TASK-TEMPLATE.md` — blank template; copy to `reference/bug-task-<name>.md`
- `reference/README.md` — per-task workflow
