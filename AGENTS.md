# Agent instructions — aceit-docs

`AGENTS.md` is canonical. `CLAUDE.md` is its byte-identical mirror. Edit this file, then run `npm run sync:agent-docs`; `npm run check:agent-docs` verifies the pair.

## Agent memory

At session start, read `.agent-memory/index.yaml` when it exists. Use each entry's title, type, and status to select memories relevant to the current task, then read those memory files before acting. Recheck the index when the task changes. An empty `[]` index means there are no entries to load yet; continue normally.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues for `t4sh/aceit-docs`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles use their default label names. See `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context layout with root `CONTEXT.md` and `docs/adr/` as needed. See `docs/agents/domain.md`.
