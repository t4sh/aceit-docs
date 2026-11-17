import test from "node:test";
import assert from "node:assert/strict";
import SearchIndex from "../src/pages/search-index.11ty.js";

function indexPage(templateContent) {
  const script = new SearchIndex().render({ collections: { docs: [
    { data: { title: "Reference" }, url: "/reference/", templateContent },
  ] } });
  return JSON.parse(script.replace(/^window\.docsSearchIndex = /, "").replace(/;\n$/, ""))[0];
}

test("search indexes complete visible content and decodes entities without changing code backslashes", () => {
  const templateContent = `<h2>R&amp;D</h2><p>&lt;widget&gt; &#x1f680; &#8212;</p><code>\\* literal</code><p>${"content ".repeat(400)}deep-term</p><template data-code-source>hidden-copy</template><script>hidden-script</script>`;
  const page = indexPage(templateContent);
  assert.ok(page.text.includes("R&D"));
  assert.ok(page.text.includes("<widget> 🚀 —"));
  assert.ok(page.text.includes("\\* literal"));
  assert.ok(page.text.includes("deep-term"));
  assert.doesNotMatch(page.text, /hidden-copy|hidden-script/);
  assert.equal(page.description, "");
});

test("search indexes rendered headings with their own text and link targets", () => {
  const page = indexPage(`
    <p>Start here.</p>
    <h2 id="r&amp;d">R&amp;D <a class="header-anchor" href="#r&amp;d">Permalink</a></h2>
    <p>Section body.</p>
    <h3 data-example=" id='ignored'" id=options><code>Options</code></h3>
    <template><h3 id="fake">Hidden heading</h3></template>
    <p>Nested section body.</p>
    <p>Second paragraph.</p>
  `);
  assert.equal(page.text, "Start here.");
  assert.deepEqual(page.sections, [
    { id: "r&d", title: "R&D", text: "Section body." },
    { id: "options", title: "Options", text: "Nested section body.\nSecond paragraph." },
  ]);
});
