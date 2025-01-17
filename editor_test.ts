import { assertEquals, assertNotEquals } from "@std/assert";
import * as edit from "./editor.ts";

function testEditorFromEnv() {
    // Set a temporary environment value.
    let oldVal: string = Deno.env.has("EDITOR") ? Deno.env.get("EDITOR") + "" : "";
    Deno.env.set("EDITOR", "micro");
    const editor = edit.getEditorFromEnv();
    assertNotEquals(editor, '', "should have EDITOR env set");
    assertEquals(editor, "micro", `EDITOR should be 'micro', got ${editor}`);
    if (oldVal !== "") {
        Deno.env.set("EDITOR", oldVal);
    }
}

async function testEditTempData() {
    let editor = edit.getEditorFromEnv();
    assertNotEquals(editor, undefined, `aborting testEditTempData, EDITOR not defined`);
    const expectedTempData = "Hello World!!";
    let result: string | undefined = await edit.editTempData(expectedTempData);
    console.log("Save the file without changes to complete test.");
    assertNotEquals(result, undefined, `editTempData should not have returned undefined for "${expectedTempData}"`);
    assertEquals(expectedTempData, result, `expected "${expectedTempData}", got "${result}"`);
}

async function main() {
    testEditorFromEnv();
    await testEditTempData();
}

if (import.meta.main) {
    await main();
} else {
    Deno.test('test getEditorFromEnv', testEditorFromEnv);
    Deno.test('test editTempData', await testEditTempData);
}