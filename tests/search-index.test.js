import test from "node:test";
import assert from "node:assert/strict";
import SearchIndex from "../src/pages/search-index.11ty.js";

test("search indexes complete visible content and decodes entities without changing code backslashes", () => {
  const templateContent = `<h2>R&amp;D</h2><p>&lt;widget&gt; &#x1f680; &#8212;</p><code>\\* literal</code><p>${"content ".repeat(400)}deep-term</p><template data-code-source>hidden-copy</template><script>hidden-script</script>`;
  const script = new SearchIndex().render({ collections: { docs: [
    { data: { title: "Reference" }, url: "/reference/", templateContent },
  ] } });
  const [page] = JSON.parse(script.replace(/^window\.docsSearchIndex = /, "").replace(/;\n$/, ""));
  assert.ok(page.text.includes("R&D"));
  assert.ok(page.text.includes("<widget> 🚀 —"));
  assert.ok(page.text.includes("\\* literal"));
  assert.ok(page.text.includes("deep-term"));
  assert.doesNotMatch(page.text, /hidden-copy|hidden-script/);
  assert.equal(page.description, "");
});
