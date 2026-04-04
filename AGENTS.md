# AGENTS.md | antifocus

**Read this entire file BEFORE writing a single line of code.**
> Every rule reflects an intentional architectural decision.
> When in doubt, check the relevant skill file first. When still in doubt, ask.

---

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This project uses **Next.js 16** with React 19 and the React Compiler — breaking changes from prior versions.

**Before writing any Next.js code:**
1. Read the relevant guide in `node_modules/next/dist/docs/`
2. Heed all deprecation notices and compiler warnings
3. Prefer Server Components by default — use `"use client"` only when strictly necessary
<!-- END:nextjs-agent-rules -->

---

## Commands

```bash
pnpm dev
pnpm build
pnpm start

pnpm check:lint
pnpm check:types
pnpm check:all
```
