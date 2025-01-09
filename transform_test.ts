import { assertEquals, assertNotEquals } from "@std/assert";
import { isSupportedFormat, transform } from "./transform.ts";
import { CodeMeta } from "./codemeta.ts";

Deno.test('test isSupportedFormat', async function() {
    const filename = "CITATION.cff";
    assertEquals(isSupportedFormat(filename), true, `for isSupportedFormat("${filename}")`);
});

Deno.test('test transform', async function() {
    const filename = "CITATION.cff";
    const cm = new CodeMeta();
    const src = await Deno.readTextFile("./codemeta.json");
    const obj = JSON.parse(src);
    cm.fromObject(obj);
    let txt: string | undefined = transform(cm, filename);
    console.log(`DEBUG txt -> ${txt} <-- obj ${JSON.stringify(obj)}`);
    assertNotEquals(txt, undefined, `transform(cm, "${filename}")`);
});