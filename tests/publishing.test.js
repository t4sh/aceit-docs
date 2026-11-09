import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("public metadata and the preview repository link follow the build target", (t) => {
  const output = mkdtempSync(join(tmpdir(), "aceit-docs-publishing-"));
  t.after(() => rmSync(output, { recursive: true, force: true }));
  const root = fileURLToPath(new URL("../", import.meta.url));
  const build = (env) => execFileSync(process.execPath, [
    "./node_modules/@11ty/eleventy/cmd.cjs", "--quiet", `--output=${output}`,
  ], { cwd: root, env: { ...process.env, ...env } });
  const read = (file) => readFileSync(join(output, file), "utf8");

  build({ SITE_BASE_URL: "https://example.com/manual/", VERCEL_ENV: "production" });
  const page = "getting-started/installation/index.html";
  const hosted = read(page);
  assert.match(hosted, /rel="canonical" href="https:\/\/example\.com\/manual\/getting-started\/installation\/"/);
  assert.match(hosted, /property="og:image" content="https:\/\/example\.com\/manual\/assets\/social-preview\.png"/);
  assert.match(hosted, /href="\.\.\/\.\.\/assets\/styles\.css"/);
  assert.doesNotMatch(hosted, /View repository on GitHub/);
  assert.doesNotMatch(hosted, />Edit this page<\/a>/);
  assert.match(read("sitemap.xml"), /<loc>https:\/\/example\.com\/manual\/getting-started\/installation\/<\/loc>/);
  assert.match(read("robots.txt"), /Sitemap: https:\/\/example\.com\/manual\/sitemap\.xml/);

  build({
    SITE_BASE_URL: "",
    VERCEL_ENV: "preview",
    VERCEL_PROJECT_PRODUCTION_URL: "aceit-docs.vercel.app",
  });
  assert.doesNotMatch(read(page), /rel="canonical"|property="og:/);
  assert.doesNotMatch(read(page), /View repository on GitHub/);
  assert.doesNotMatch(read(page), />Edit this page<\/a>/);
  assert.doesNotMatch(read("sitemap.xml"), /<loc>/);
  assert.doesNotMatch(read("robots.txt"), /Sitemap:/);
  assert.match(read(page), /href="\.\.\/\.\.\/assets\/styles\.css"/);

  build({ SITE_BASE_URL: "", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "aceit-docs.vercel.app" });
  for (const file of ["index.html", page]) {
    assert.match(read(file), /href="https:\/\/github\.com\/t4sh\/aceit-docs" aria-label="View repository on GitHub"[^>]*>\s*<svg\b/);
  }
  assert.match(read("index.html"), /href="https:\/\/github\.com\/t4sh\/aceit-docs\/edit\/main\/src\/pages\/docs\/index\.md">Edit this page<\/a>/);
  assert.match(read(page), /href="https:\/\/github\.com\/t4sh\/aceit-docs\/edit\/main\/src\/pages\/docs\/getting-started\/installation\.md">Edit this page<\/a>/);
});
