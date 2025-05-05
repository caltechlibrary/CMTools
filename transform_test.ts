import { assertEquals, assertNotEquals } from "@std/assert";
import { getFormatFromExt, isSupportedFormat, transform } from "./transform.ts";
import { CodeMeta } from "./codemeta.ts";

Deno.test('test isSupportedFormat', async function() {
    const filename = "CITATION.cff";
    const fmt = getFormatFromExt(filename, "");
    assertEquals(isSupportedFormat(fmt), true, `for isSupportedFormat(getFormatFromExt("${filename}"))`);
});

Deno.test('test transform', async function() {
    const filename = "CITATION.cff";
    const cm = new CodeMeta();
    const src = await Deno.readTextFile("./codemeta.json");
    const obj = JSON.parse(src);
    cm.fromObject(obj);
    let txt: string | undefined = await transform(cm, getFormatFromExt(filename, ""), false);
    assertNotEquals(txt, undefined, `transform(cm, "${filename}")`);
});
