# Omni Creator MCP and Agent Skill

Omni Creator is an AI Photo Editor Online free to try. Sign in, check in for +10 credits daily, and edit photos by typing.

Website: https://omnicreator.art/

This repository is a **read-only** remote MCP server and an Agent Skill for that live product. It does not generate images, charge credits, or read user accounts.

## MCP

Streamable HTTP:

- Product domain: `https://omnicreator.art/mcp`
- Workers preview: `https://omnicreator-mcp.tian-wei.workers.dev/mcp`

Anonymous `initialize` and `tools/list` work. Tools:

1. `get_overview` — public facts, file types, credit rules, page URLs
2. `list_pages` — public pages from https://omnicreator.art/llms.txt
3. `fetch_public_page` — fetch a public page as markdown

Claude Desktop / Cursor example:

```json
{
  "mcpServers": {
    "omnicreator": {
      "url": "https://omnicreator.art/mcp"
    }
  }
}
```

## Agent Skill

`SKILL.md` tells an agent how to use the live editor at https://omnicreator.art (Google sign-in, daily check-in, uploads, use-case pages).

Install from GitHub:

```bash
npx skills add wangneo276-lgtm/omnicreator-mcp
```

Claude marketplace:

```bash
claude plugin marketplace add wangneo276-lgtm/omnicreator-mcp
```

## Facts from the live site

- New accounts signing in with Google receive 20 free credits, plus +10 credits for daily check-in.
- Credits are only deducted when the result is ready; failed tasks are free.
- JPG, PNG, WebP, AVIF, HEIC and HEIF up to 25 MB. BMP is not supported.
- Browse freely. Generating requires Google sign-in.
- Checkout is not live.
- Support: support@omnicreator.art

Not an official Anthropic, OpenAI, or Cloudflare SDK.

License: MIT.
