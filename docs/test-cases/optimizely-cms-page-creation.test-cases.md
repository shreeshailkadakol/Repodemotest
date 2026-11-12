# Optimizely CMS Page Creation - Test Cases

**Component:** CMS page creation, block authoring, publish, frontend validation
**CMS URL:** https://localhost:5000/Optimizely/CMS/dashboard (editor: `/optimizely/cms`)
**Published base:** `CmsPageComponent.testData.publishedBase` in `data/componentURL.ts`
**Credentials:** `OPTIMIZELY_CMS_USERNAME` / `OPTIMIZELY_CMS_PASSWORD` from `.env` (never committed)
**User story:** none provided
**Automated spec:** `tests/specs/cmsPageComponent.spec.ts` (page object: `components/cmsPageComponent.ts`)
**DOM report:** `docs/dom-inspection-optimizely-cms-page.md`

> These tests create and publish real content. Run against a QA/sandbox CMS only.
> Created pages are retained in the CMS by default. Set `CMS_CLEANUP=delete` to move each test's own page to the CMS Trash afterwards.

## Implemented

| ID | Case | CMS check | Frontend check | Tags |
|---|---|---|---|---|
| TC-CP01 | Create Standard Page, add Editorial (text) block, publish | Header shows the page name; Teaser text and Main body read back; block listed in "Large content area"; toolbar Publish button disappears | URL returns 200; page name, body text and block text render | Functional |
| TC-CP02 | Create Standard Page, add Editorial (text) block and Teaser block (heading, text, `logotype.png`), publish | As TC-CP01, plus both blocks listed | As TC-CP01, plus Teaser heading and text render and the Teaser image loads (`src` contains `logotype`, `naturalWidth > 0`) | Functional |

Notes:
- Teaser text (page field) is checked in the CMS only; the Standard Page template does not render it.
- The Teaser logo is tied to its block on the frontend, because the site header uses the same logo.

## Not yet automated (proposed)

| ID | Case | Expected |
|---|---|---|
| TC-CP03 | Required field blank on a Teaser (Heading, Text, Image) | Create is blocked; validation shown |
| TC-CP04 | Draft only (do not publish) | Toolbar still shows Publish; URL does not return 200 |
| TC-CP05 | Create dialog cancel | No page is created |
| TC-CP06 | Other page types (Article, Landing Page) | Created under Start with the right type |

## Traceability

| Requirement | Covered by |
|---|---|
| Create a page from the dashboard/content tree | TC-CP01, TC-CP02 |
| Add a text component with content | TC-CP01, TC-CP02 |
| Add a Teaser with logo image and teaser text | TC-CP02 |
| Publish without errors | TC-CP01, TC-CP02 (CMS publish check) |
| Rendered correctly on the frontend | TC-CP01, TC-CP02 (HTTP 200, content, image) |
