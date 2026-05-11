# AI Company Core — agent entry

Use this monorepo as **one Git root**. Do not create nested `.git` directories under sub-apps.

## Canonical instructions

- Cross-cutting skills and links: [`CLAUDE.md`](CLAUDE.md)
- Human-readable map and rules: [`README.md`](README.md)

## Subprojects

Each Next.js app may define [`AGENTS.md`](Portal/AGENTS.md) (Next.js version guardrails). Prefer subdirectory `AGENTS.md` only for **stack-specific** rules; put reusable product logic in `.claude/skills/`.

When unsure where something lives, check [`README.md`](README.md) layout table first.
