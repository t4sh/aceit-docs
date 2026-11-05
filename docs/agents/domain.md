# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repo root, when it exists.
- Relevant decisions under `docs/adr/`, when that directory exists.

If these files do not exist, proceed silently. Do not suggest creating them upfront. The domain-modeling skill creates them when terms or decisions are resolved.

## File structure

This is a single-context repo. The shared glossary and architectural decisions belong at the repo root:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

These paths describe where future domain docs belong; setup does not create empty files or directories.

## Use the glossary's vocabulary

When naming a domain concept in an issue, proposal, hypothesis, or test, use the term defined in `CONTEXT.md`. If a term is missing, reconsider whether it belongs to the project or note a real glossary gap for domain modeling.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, call out the conflict explicitly rather than silently overriding the decision.
