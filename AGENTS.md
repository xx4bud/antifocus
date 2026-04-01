# AGENTS.md | antifocus

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "Agent skills"
    load: ".agents/skills/[skill-name]/SKILL.md"
  - task: "Tanstack & tRPC agent skills"
    load: "node_modules/[package-name]/skills/[skill-name]/SKILL.md"
<!-- intent-skills:end -->
