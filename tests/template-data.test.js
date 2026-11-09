import test from "node:test";
import assert from "node:assert/strict";
import nunjucks from "nunjucks";
import { githubEditUrl, jsonScript } from "../lib/template-data.js";

test("theme IDs survive script serialization without creating HTML or script boundaries", () => {
  const values = ["paper&ink", "reader's", 'a"b', "</script><script>alert(1)</script>", "line\u2028break\u2029"];
  const environment = new nunjucks.Environment(null, { autoescape: true });
  environment.addFilter("jsonScript", jsonScript);
  const rendered = environment.renderString('{{ presets | jsonScript | safe }}', {
    presets: values.map((id) => ({ id })),
  });
  assert.deepEqual(JSON.parse(rendered).map((item) => item.id), values);
  assert.doesNotMatch(rendered, /[<>&\u2028\u2029]/);
});

test("GitHub edit URLs require both settings and point to the encoded source path", () => {
  const inputPath = "./src/pages/docs/quick start #1.md";
  assert.equal(githubEditUrl(inputPath, "", ""), "");
  assert.equal(githubEditUrl(inputPath, "example/handbook", " "), "");
  assert.equal(githubEditUrl(inputPath, undefined, "main"), "");
  assert.equal(githubEditUrl(inputPath, "https://example.com/handbook", "main"), "");
  assert.equal(
    githubEditUrl(inputPath, "example/handbook", "release/docs"),
    "https://github.com/example/handbook/edit/release/docs/src/pages/docs/quick%20start%20%231.md",
  );
});
