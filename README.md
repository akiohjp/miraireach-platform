# AI Company Core

Single monorepo for mirAIreach / LocalReach–related apps, shared **Claude skills**, and execution-squad prototypes.

## Layout

| Path | Role |
|------|------|
| [`Portal/`](Portal/) | Marketing / portal Next.js app (`miraireach-platform` lineage) |
| [`miraireach-admin/`](miraireach-admin/) | Admin dashboard Next.js app |
| [`02_execution_squad/review_app_nextjs/`](02_execution_squad/review_app_nextjs/) | Review collection flow (Next.js) |
| [`02_execution_squad/review_collection_app/`](02_execution_squad/review_collection_app/) | Review collection (Vite/React SPA) |
| [`.claude/skills/`](.claude/skills/) | **Canonical** cross-project skills (GBP diagnostic, review app admin, review collection) |

Sub-apps may keep their own `README.md` and `AGENTS.md` (e.g. Next.js guardrails). Repo-wide agent entry is [`AGENTS.md`](AGENTS.md); skills index is [`CLAUDE.md`](CLAUDE.md).

## Conventions (keep it one coherent tree)

1. **Do not** run `git init` inside `Portal/`, `miraireach-admin/`, or other subfolders; use this root only.
2. **New shared AI guidance**: add or extend Markdown under `.claude/skills/` and reference it from root [`CLAUDE.md`](CLAUDE.md).
3. **Secrets**: never commit `.env` or keys; use `.env.example` patterns per app.
4. **Ephemeral tooling**: `.claude/worktrees/`, caches, and `settings.local.json` are ignored.

## Historical Git remotes (pre-monorepo)

These folders used to be separate repos; history for them may still exist on GitHub:

- `Portal/` → `https://github.com/akiohjp/miraireach-platform.git`
- `miraireach-admin/` → `https://github.com/akiohjp/miraireach-admin.git`

New work should treat this repository as the source of truth. Sync or archive the old remotes as you prefer.

## First-time clone

Install dependencies per app (`npm install` / `pnpm` as documented in each package). No workspace-wide package manager is enforced at the root.
