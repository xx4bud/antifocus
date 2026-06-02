# AGENTS.md | Antifocus MVP

> **Single source of truth for all AI coding agents on Antifocus.**
> Read this file completely before creating, editing, or deleting any file.
> See [**README.md**](README.md) for project overview and tech stack guides.

---

<!-- intent-skills:start -->
## Critical: Pre-Code Workflow
- **Step 1**: Identify relevant skills from `.agents/skills/` first.
- **Step 2**: Or run `npx @tanstack/intent@latest list` from repo root for matching skill names and APIs.
- **Step 3**: Verify current library APIs via `context7` or package documentation.
- **Step 4**: Cross-check against this file.
- **Step 5**: **Brainstorm First**. Always do Q&A discussion first. NEVER write, edit, or execute code before the user explicitly commands it.
<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->
## Next.js: ALWAYS read docs before coding
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
<!-- END:nextjs-agent-rules -->

---

## Setup Commands

- **Install dependencies**: `pnpm install`
- **Clean project (removes caches & node_modules)**: `pnpm clean`

## Development Workflow

- **Start dev server**: `pnpm dev` (Runs with Turbopack and `.env` loaded via `dotenv-cli`).
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`

## Testing & Quality Control Instructions

Code quality is strictly enforced via Ultracite. Run these commands to verify changes:

- **Lint and Auto-fix**: `pnpm check:lint` (runs `ultracite fix --unsafe .`)
- **Type Checking**: `pnpm check:types` (runs `next typegen && tsc --noEmit`)
- **Run all checks**: `pnpm check:all`

*Note: Always ensure `pnpm check:all` passes before finalizing changes.*
