---
title: Project structure
description: Find the right file without learning a large framework.
permalink: /getting-started/project-structure/
eleventyNavigation:
  key: Project structure
  parent: Getting started
  order: 2
---

## Files at a glance

| Path | Purpose |
| --- | --- |
| `src/pages/docs/` | Markdown documentation pages |
| `src/_includes/layouts/base.njk` | Shared HTML shell |
| `src/_includes/layouts/docs.njk` | Shared page shell |
| `src/_includes/macros/nav.njk` | Recursive sidebar markup |
| `src/_data/site.json` | Site name, description, and external link |
| `src/assets/css/tokens.css` | Light and dark semantic tokens |
| `src/assets/css/docs.css` | Docs components and responsive layout |
| `src/pages/assets/styles.11ty.js` | Combines CSS into one output file |
| `src/assets/app.js` | Theme, search, menu, and outline |
| `eleventy.config.js` | Plugins, collection, Markdown setup |

## How a page renders

Eleventy reads front matter and renders Markdown, then places the HTML inside the Nunjucks layouts `docs.njk` and `base.njk`. Markdown files do not run through Nunjucks, so template syntax in examples stays literal. Use a `.njk` page when you need template loops or macros. The `docs` collection supplies the search index. The navigation plugin turns each page's `eleventyNavigation` data into the sidebar tree.

## Change the brand

Update `src/_data/site.json` for the name and links. Shared Hugeicons are defined in `lib/icons.js`; `src/pages/assets/favicon.11ty.js` generates the matching favicon. Color roles live in `src/assets/css/tokens.css`; page styling lives in `src/assets/css/docs.css`.
