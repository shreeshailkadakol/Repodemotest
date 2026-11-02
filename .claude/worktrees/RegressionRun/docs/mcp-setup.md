# MCP Server Setup (Copilot + Claude Code)

This project uses three MCP servers — **playwright**, **figma**, and **azure-devops** — from both
GitHub Copilot (VS Code) and Claude Code. There is **no single shared file** both tools read: each looks in
a fixed location with a different schema, so the config is intentionally duplicated across two committed files.

## The two files

| | Copilot (VS Code) | Claude Code |
|---|---|---|
| File | [`.vscode/mcp.json`](../.vscode/mcp.json) | [`.mcp.json`](../.mcp.json) (repo root) |
| Top-level key | `"servers"` | `"mcpServers"` |
| Env-var syntax | `${env:VAR}` | `${VAR}` |
| `"type": "stdio"` | required | optional (default) |

Both files are committed and must be kept **in sync** — when you add or change a server, update both,
applying the conversions in the table above.

## Secrets / environment variables

**No secrets are stored in either file.** Tokens are referenced as environment variables:

- `FIGMA_TOKEN` — for the figma server
- `AZURE_DEVOPS_PAT` — for the azure-devops server

⚠️ **These must be set in your real shell/system environment.** Neither tool auto-loads the project `.env`
file for MCP servers (only the repo's Node scripts do, via `dotenv`). If the variables are only in `.env`,
the MCP servers will fail to authenticate. Set them as user/system environment variables (or in the
environment from which you launch VS Code / Claude Code).

Use a least-privilege Azure DevOps PAT (Work Items Read & Write). If a token leaks, rotate it immediately.

## Activating in Claude Code

1. Ensure `FIGMA_TOKEN` and `AZURE_DEVOPS_PAT` are present in your environment.
2. **Restart Claude Code** — it reads `.mcp.json` at startup.
3. Approve the project's MCP servers when prompted (one-time security gate).

## Related

- `.claude/skills/azure-devops-bug-workflow/SKILL.md` — uses the azure-devops server (+ `fetch-requirements.js` / `log-bug.js`)
- `.claude/skills/playwright-figma-visual/SKILL.md` — uses the figma server for design-spec extraction
