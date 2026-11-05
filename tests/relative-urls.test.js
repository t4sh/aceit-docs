import test from "node:test";
import assert from "node:assert/strict";
import { relativeUrl } from "../lib/relative-urls.js";

test("site-root URLs become relative to the linking page", () => {
  assert.equal(relativeUrl("/", "/assets/app.js"), "assets/app.js");
  assert.equal(relativeUrl("/guides/theming/", "/assets/app.js"), "../../assets/app.js");
  assert.equal(relativeUrl("/guides/theming/", "/"), "../../");
  assert.equal(relativeUrl("/guides/", "/guides/theming/"), "theming/");
  assert.equal(relativeUrl("/", "/"), "./");
});

test("queries and fragments survive the rewrite", () => {
  assert.equal(relativeUrl("/release-notes/", "/guides/components/#code-blocks"), "../guides/components/#code-blocks");
  assert.equal(relativeUrl("/guides/", "/guides/#top"), "./#top");
  assert.equal(relativeUrl("/guides/", "/assets/app.js?v=1"), "../assets/app.js?v=1");
});

test("URLs outside the site root are left alone", () => {
  for (const url of ["https://www.11ty.dev/docs/", "//cdn.example.com/a.js", "#section", "../sibling/", "mailto:a@b.c", ""]) {
    assert.equal(relativeUrl("/guides/theming/", url), url);
  }
});
