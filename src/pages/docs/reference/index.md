---
title: Reference
description: The small set of conventions behind this starter.
permalink: /reference/
eleventyNavigation:
  key: Reference
  order: 4
---

## Scripts

| Command | Result |
| --- | --- |
| `npm run dev` | Local preview with live reload |
| `npm run build` | Production output in `out/` |
| `npm run check` | Quiet build for verification |

## Page data

Every page in `src/pages/docs/` inherits the docs layout and collection tag. Give each page a `title`, `description`, `permalink`, and `eleventyNavigation` entry.

## Deployment

The build output is static HTML, CSS, JavaScript, and a JSON search index. Configure your host to publish `out/`. For a host that serves under a subpath, update the root-relative asset and page links before deploying.
