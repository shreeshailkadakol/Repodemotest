# DOM Inspection Report - Optimizely CMS Editor (page, block, publish, delete)

**Site**: https://localhost:5000/optimizely/cms (Optimizely Alloy demo content)
**Viewport**: 1920x1080 (narrow widths collapse the toolbar and tree)
**data-qa / data-testid elements**: 0. The editor is Dojo + React, so locators use `title`, `name`, role, scoped CSS, text and nesting. Dojo ids (`uniqName_*`, `dijit_form_*`) are generated per session and are NOT used.

## Editor shell
| Element | Locator evidence |
|---|---|
| Toolbar Create (+) | `span[role="button"][title="Create content"]` -> menu `.dijitMenuItem` "Create Page" / "Create Shared Block" |
| Navigation pane toggle | `span[role="button"][title="Toggle navigation pane"]` |
| Page name in header | `span.title[title="<name>"]` (inside `.content-info-name`) |
| Page "..." menu next to title | `a[data-testid="btn-context-menu"]`; only Rename / Undo / Redo (no delete) |
| Preview | `iframe[name="sitePreview"]` |
| Tree row | `div.dijitTreeRow[title="<name>, Content Reference: <id> (Type: <type>)"]` |
| Tree row menu icon | `span.epi-iconContextMenu` inside the row; positioned off-screen until hover, so activate with a dispatched click |

Tree titles contain the page type, so a substring title match (`Standard Page`) also matches hidden rows. Use an exact regex for tiles and headers.

## Create Page dialog
| Element | Locator |
|---|---|
| Name input | `input[placeholder="Enter a name"]` (prefilled "New Page") |
| Type tiles | `[title="<Page type>"]` (Article, Container Page, Landing Page, News Page, Product, Search Page, Standard Page) |
| Buttons | `button.oui-button--highlight` "Create", "Cancel" |

## Standard Page property form (stable `name` attributes)
| Field | Control | Locator |
|---|---|---|
| Teaser image | image drop zone | `input[name="pageImage"]` |
| Teaser text | textarea | `textarea[name="teaserText"]` (not rendered on the page) |
| Main body | TinyMCE rich text | `iframe[title="Rich Text Area"]:visible` (page editor keeps a hidden frame behind the block view) |
| ContentAreaCssClass | text | `input[name="contentAreaCssClass"]` |
| SEO Title / Description | text / textarea | `input[name="metaTitle"]` / `textarea[name="metaDescription"]` |
| Large content area | content area | label text, then `span[role="button"]` "Select Content" |

Labels are not `<label>` elements, so `getByLabel` never matches.

## Adding a block ("Create Shared Block" view, full page)
1. "Select Content" menu: **Create a new Block** / **Select Content**.
2. Name textbox (default "Shared Block"), then a block card `li` with `h3` = block type: Button, Contact, Page List, Teaser, Editorial, Jumbotron, Testblock.
3. Block form, then the **Create** button (`span[role="button"]` "Create") returns to the page editor with the block listed.

| Block | Fields (all required for Teaser) |
|---|---|
| Editorial | Main body (TinyMCE) |
| Teaser | `input[name="heading"]`, `textarea[name="text"]`, Image |

## Image picker
- Open: visible `span[role="button"]` "Select Image" (the page editor has a hidden one too; use `:visible`).
- Dialog: `div[role="dialog"]`; search box `div[role="dialog"] input[role="textbox"]` (no placeholder attribute); results are rows by file name (e.g. `logotype.png`); **OK** is `span[role="button"]` "OK".

## Publish
- Toolbar **Publish** opens a panel; the panel shows "Last changed by ...", a Publish button, "Not published yet" and a "View on website" link (its `href` is the real published path).
- Panel Publish: `li span[role="button"]` containing "Publish" (a Dojo span, not a nested `<button>`).
- After publishing, the toolbar Publish button disappears and only Options remains.
- Published URL: `/en/<name lower-cased, non-alphanumerics -> '-'>/` (matches the "View on website" link).

## Delete (cleanup)
Navigation pane -> hover the tree row -> dispatch click on `span.epi-iconContextMenu` -> visible menu item **Move to Trash** -> dialog "Move Page to Trash" (`div[role="dialog"]`, names the page) -> `span[role="button"]` "Move to Trash". Pages go to the Wastebasket (recoverable).

## Published HTML (verified)
`h1` page name, page body, `div.block.editorialblock`, `div.block.teaserblock` with `div.img-wrapper img`, `h2`, `p`.
