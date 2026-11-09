import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("public metadata uses the hosted subfolder and an offline rebuild clears it", (t) => {
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
  assert.match(read("sitemap.xml"), /<loc>https:\/\/example\.com\/manual\/getting-started\/installation\/<\/loc>/);
  assert.match(read("robots.txt"), /Sitemap: https:\/\/example\.com\/manual\/sitemap\.xml/);

  build({
    SITE_BASE_URL: "",
    VERCEL_ENV: "preview",
    VERCEL_PROJECT_PRODUCTION_URL: "aceit-docs.vercel.app",
  });
  assert.doesNotMatch(read(page), /rel="canonical"|property="og:/);
  assert.doesNotMatch(read("sitemap.xml"), /<loc>/);
  assert.doesNotMatch(read("robots.txt"), /Sitemap:/);
  assert.match(read(page), /href="\.\.\/\.\.\/assets\/styles\.css"/);
});
