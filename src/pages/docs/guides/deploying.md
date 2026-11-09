---
title: Deploy your site
description: Publish the finished site to any static host.
permalink: /guides/deploying/
eleventyNavigation:
  key: Deploy your site
  parent: Guides
  order: 4
---

`npm run build` writes the finished site to `out/`. It contains plain HTML, CSS, fonts, and small scripts, and it needs no server code. Links are relative, so the site works in any folder, and you can open `out/index.html` straight from disk.

## Any static host

Copy the contents of `out/` to your host, at the root or in a subfolder. The host only has to do one thing: keep the trailing slash on folder pages, so `/guides/theming` becomes `/guides/theming/`. Relative links resolve from that slash.

Every host needs Node.js 22 or newer to run the build. If you build on your own computer and upload `out/`, the host needs no Node.js at all.

## Public URLs and sharing

Set `SITE_BASE_URL` to the final public address, including any subfolder. For example:

```bash
SITE_BASE_URL=https://example.com/docs npm run build
```

This sets the canonical and social URLs for each page and fills the sitemap. Links between pages and assets still work from disk. For a local copy, build without `SITE_BASE_URL`.

Set a short `title` and `description` in each page's front matter. The home page also uses `metaTitle` to give the browser tab and share preview a more descriptive title. Replace `src/assets/social-preview.png` with your own 1200 × 630 PNG and update `socialImageAlt` in `src/_data/site.json`.

## GitHub Pages

`out/` is not committed, so a workflow builds and publishes it. Add this file, then choose **GitHub Actions** as the source under **Settings → Pages**.

```yaml title=".github/workflows/pages.yml"
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: out
      - id: deployment
        uses: actions/deploy-pages@v5
```

Links work as-is for project sites at `username.github.io/repository/`. To generate public metadata, set `SITE_BASE_URL` on the build step to that full project URL. Crawlers look for `robots.txt` at the host root, so submit a project sitemap directly when the site lives in a subfolder.

## Cloudflare Pages

Connect the repository, then use these build settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variable | `NODE_VERSION` set to `22` |

## Vercel

Import the repository. The included `vercel.json` sets the build command and the `out` folder. It also turns on `trailingSlash`, because Vercel otherwise serves folder pages without the slash, which breaks relative links.

Production builds use Vercel's production domain when system environment variables are exposed. To choose a different canonical domain, set `SITE_BASE_URL` for the Production environment.

If you don't use Vercel, delete `vercel.json`.
