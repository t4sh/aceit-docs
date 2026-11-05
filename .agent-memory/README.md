# Agent memory

Reviewable project memory that any file-reading agent can use across sessions. It uses memory format v2.1.

- `index.yaml` lists every memory. Read it first, then open only the entries relevant to the task.
- Each entry ID maps to a file, so `decisions/stay-on-eleventy` is `.agent-memory/decisions/stay-on-eleventy.md`.
- Files use YAML frontmatter: `id`, `type`, `title`, `description`, `tags`, `source`, `created`, `updated`, `status`, and optional `expires` and `supersedes`.

| Directory | Holds |
| --- | --- |
| `user/` | Role, goals, and collaboration preferences |
| `feedback/` | Corrections and confirmations |
| `project/` | What the project is and its status |
| `decisions/` | Why things are the way they are |
| `context/` | Current state; set an `expires` review date |
| `conventions/` | Patterns for working on this project |
| `references/` | External resources |
| `sessions/` | Lightweight session logs |

Keep one idea per file, edit in place when facts change, point to source docs instead of copying them, and use absolute dates. Keep every file in the index and every index entry pointing at a file. Never store secrets. `AGENTS.md` remains the source of shared instructions, and full architecture decisions live in `docs/adr/`.
