---
status: accepted
date: 2026-11-06
---

# Stay on Eleventy rather than move to Astro

Aceit Docs stays on Eleventy 3, with Nunjucks layouts and plain Markdown pages. Astro was compared in November 2026, and for a brand-new site its built-in heading data, CSS bundling, and typed frontmatter would make it a strong option. We chose Eleventy because this is a template people adopt and then leave alone, so low upkeep and a simple build matter more than those features.

## Reasons

- **Plain HTML you can take anywhere.** This is the main reason. The output is static HTML, CSS, and two small vanilla scripts, with no React, client framework, or bundler, so it can be copied to any static host, in any folder, or opened straight from disk. The build rewrites links as relative paths, and search loads from a script because browsers block `fetch()` on `file://` pages. Packaging and deployment are ordinary file work that a coding agent can handle, so the framework does not need to own them.
- **Set and forget.** The aim is stability: few changes between versions, and no need to update unless a site needs a fix or a feature. Eleventy 3.0 shipped in October 2024 and 3.x is still the stable line. Astro shipped 6.0 on March 10, 2026 and 7.0 on June 22, 2026. That pace brings fixes and features sooner, but asks this repo and each site built from it to keep up.
- **No bundler.** `src/assets/app.js` and `src/assets/code-blocks.js` are copied to the output unchanged, and `src/pages/assets/styles.11ty.js` joins the CSS files in a fixed order. There is no Vite layer to configure or keep current.
- **Markdown stays Markdown.** Pages are ordinary `.md` files rendered by one `markdown-it` pipeline. `markdownTemplateEngine: false` keeps `{{ }}` and `{% %}` literal in documentation examples, and raw HTML covers small components.
- **Reusable sections, self-contained scripts.** Sections are Nunjucks macros and includes that render to static HTML. Behavior lives in plain script files with no framework or shared runtime. `src/assets/code-blocks.js` is the pattern to follow: one feature, one file, its own scope.

The last two reasons are preferences rather than Astro limitations. Astro's plain `.md` pages avoid MDX too, and its components handle scoped sections well. The first three reasons are what actually separate the options, although Astro can also ship static HTML with no client framework.

## MDX is out of scope

The repo has no MDX, and this decision does not claim Eleventy handles it better. MDX treats `{` and `<` as syntax, which works against documentation about templates. Eleventy's MDX support is opt-in, renders through React, and parses with Remark instead of `markdown-it`, so this repo's anchors, code groups, and Shiki setup would not apply to `.mdx` pages.

## Considered options

- **Astro.** Rejected for its major-version pace, its Vite toolchain, and a Node floor of `>=22.23.4` as of 7.4.7. Moving would also mean porting the `markdown-it` pipeline, layouts, nav, search index, and tests.
- **Astro with Starlight.** Rejected because it replaces the custom shell and theme presets, which are the point of this template.
- **Build Awesome v4 (the renamed Eleventy).** Deferred. It was still at `4.0.0-alpha.10` when this was written. Stay on 3.x until a stable release, then reassess.

## Consequences

- Hand-built pieces stay ours to maintain, including the `docHeadings` regex and the CSS concatenation.
- Frontmatter is not validated. Eleventy's `eleventyDataSchema` can add this without changing framework.
- `app.js` and `code-blocks.js` load on every page, and `app.js` runs in global script scope, so it does not yet follow the pattern above. Eleventy's built-in bundle plugin can add per-page scripts if that starts to matter.

## When to revisit

- Docs need stateful component demos, or MDX becomes the authoring format.
- The project needs server-rendered routes.
- Eleventy 3.x stops receiving fixes, or v4 breaks compatibility with this setup.
