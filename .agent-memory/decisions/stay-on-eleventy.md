---
id: decisions/stay-on-eleventy
type: decision
title: Stay on Eleventy rather than Astro
description: >-
  Aceit Docs stays on Eleventy 3 with Nunjucks and plain Markdown, chosen for low
  upkeep and no bundler; do not propose Astro, Vite, or MDX without flagging ADR 0001.
tags: [eleventy, astro, framework, build]
source: claude-code
created: 2026-11-06
updated: 2026-11-06
status: active
---

The user decided on 2026-11-06 to keep Eleventy 3 after comparing it with Astro. Full reasoning, rejected options, and revisit triggers are in `docs/adr/0001-stay-on-eleventy.md`; the short version for new users is in the README's "Why Eleventy" section.

**Why:** This is a template people adopt and then leave alone. The main attraction is plain HTML output with no React or bundling that can be hosted anywhere, with packaging left to agents. The other priorities are set and forget (stability, few changes between versions, updating only when needed), no bundler, Markdown that stays plain, and reusable sections with self-contained scripts. Upkeep and the bundler are what actually separate the options; on features alone, Astro was assessed as the stronger choice for a brand-new site.

**How to apply:**

- Call out the ADR conflict before proposing Astro, Starlight, Vite or another bundler, MDX, or a client framework.
- Give a new interactive section its own plain script in `src/assets/` with its own scope, following `code-blocks.js`. `app.js` predates this and still runs in global script scope.
- Stay on Eleventy 3.x until Build Awesome v4 has a stable release, then reassess. Recheck that status before relying on it; it was `4.0.0-alpha.10` on 2026-11-06.
- Keep the output portable: paths must work from any folder and from `file://`. `lib/relative-urls.js` rewrites site-root links in HTML; CSS and scripts must not use site-root paths.
- Do not claim Eleventy handles MDX better. The repo has no MDX, and Eleventy's MDX path would bypass the `markdown-it` setup.
