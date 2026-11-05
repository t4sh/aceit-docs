---
title: Installation
description: Run the docs locally in two commands.
permalink: /getting-started/installation/
eleventyNavigation:
  key: Installation
  parent: Getting started
  order: 1
---

## Requirements

Use Node.js 22 or newer and npm. No global Eleventy installation is needed.

## Install and preview

```bash
npm install
npm run dev
```

Eleventy prints the local preview URL. Changes to Markdown, Nunjucks, CSS, and JavaScript trigger a reload.

## Build for production

```bash
npm run build
```

Upload the generated `out/` directory to your static host. The site does not need a Node server after the build.

> **Tip:** Run `npm run check` in CI to catch broken templates before deploy.
