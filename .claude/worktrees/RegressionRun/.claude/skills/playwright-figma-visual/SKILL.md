---
name: playwright-figma-visual
description: MANDATORY Figma design-spec extraction and visual-test rules for @visual Playwright tests. Use when creating visual/typography/spacing tests, extracting Figma values via the Figma MCP, creating helpers/utils/figma-values/<Component>_FigmaValues.ts files, or validating CSS (font-family, font-size, line-height, color, spacing) against design. Enforces "never hardcode design values".
---

# Figma Design Extraction & Visual Validation

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map.

## Visual Tests (Tag: @visual)

**⚠️ PREREQUISITE**: Visual tests REQUIRE Figma design specifications extracted in Step 3.5. Do NOT create visual tests without Figma values file.

**Visual Test Implementation Pattern**:
```typescript
// Import Figma values (MANDATORY)
import { getValuesByViewport } from '../helpers/utils/figma-values/<Component>_FigmaValues';

// Use in test
const expectedStyles = getValuesByViewport('xl'); // or 'lg', 'md', 'sm'
await expect(element).toHaveCSS('font-size', expectedStyles.headline.fontSize);
await expect(element).toHaveCSS('color', expectedStyles.headline.color);
```

---

## Step 3.5: Extract Figma Design Specifications (MANDATORY BEFORE STEP 4)

**⚠️ CRITICAL**: You MUST extract Figma design values BEFORE generating test cases. Visual validation tests require Figma specifications.

**Required Actions**:
1. **Fetch Figma Data**:
   ```typescript
   // Use Figma MCP tool to extract design specifications
   mcp_figma_get_figma_data({
     fileKey: "fiKrYZCKNM1OqXHQoGwrlX",
     nodeId: "<component-node-id>" // From Figma URL or user story
   })
   ```

2. **Create Figma Values File**:
   - Path: `helpers/utils/figma-values/<ComponentName>_FigmaValues.ts`
   - Follow existing pattern from `NewsListComponent_Enhanced_FigmaValues.ts`
   - Extract by viewport (XL, LG, MD, SM):
     - Typography (font-family, font-size, font-weight, line-height, color)
     - Spacing (padding, margin, gap)
     - Layout (width, height, flex properties)
     - Colors (text, background, border)

3. **Import in Component File**:
   ```typescript
   import { getValuesByViewport } from '../helpers/utils/figma-values/<ComponentName>_FigmaValues';
   ```

**⚠️ CRITICAL RULE: ALWAYS import and use FigmaValues files in visual tests. NEVER hardcode design values (font-size, colors, spacing).**
**All visual validations MUST use imported Figma specifications - guessing or hardcoding values defeats automated design validation.**

4. **Document Figma Extraction**:
   - Create section in DOM inspection doc listing all Figma values
   - Map Figma design tokens to CSS properties
   - Note any viewport-specific variations

**Why This Is Mandatory**:
- Visual tests (@Visual tag) REQUIRE Figma specs to validate design compliance
- Typography/spacing validation depends on design system values
- Without Figma values, visual tests will be incomplete/incorrect
- Framework pattern: ALL component files import Figma values (see newsListComponent.ts example)

**If Figma MCP Fails**:
- Check environment variables are set (`FIGMA_TOKEN`) — must be in your real shell/system environment, not just `.env`
- Verify VS Code / Claude Code was restarted after setting env vars
- The figma MCP server is configured for both Copilot (`.vscode/mcp.json`) and Claude Code (root `.mcp.json`) — see [`docs/mcp-setup.md`](../../../docs/mcp-setup.md)
- Fall back to manual Figma inspection and document values in comments

**Deliverable**: Figma values file created and imported in component BEFORE proceeding to Step 4.

---

## Visual Validation (during Step 5 test-script generation)

**Visual Validation**:
- To verify font color, font family, line height, color for an element, fetch the values from Figma using Figma MCP server and also understand the requirement by reviewing the Figma
- Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19090-79362&m=dev

> Component-specific Figma node IDs (e.g. the Transparency datagrid node list) are task-specific and preserved in
> `.claude/skills/playwright-test-authoring/reference/sample-task-invocation.md`.
