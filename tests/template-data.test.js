import test from "node:test";
import assert from "node:assert/strict";
import nunjucks from "nunjucks";
import { jsonScript } from "../lib/template-data.js";

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
