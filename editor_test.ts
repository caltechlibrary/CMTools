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

function testSetObjectFromString() {
    let expected: any = "one";
    let key: string = "a";
    let val: string = "one";
    let obj: { [key: string]: any } = {};
    let ok: boolean = edit.setObjectFromString(obj, key, val, "text");
    assertEquals(ok, true, `expected true for obj.a of type text`);
    assertNotEquals(obj['a'], undefined, `expect attribute "${key}" in obj -> ${JSON.stringify(obj, null, 2)}`);
    assertEquals(obj['a'], expected, `expected obj.a ${expected}, got ${obj['a']}`);
    expected = 2;
    key = "b";
    val = "2";
    ok = edit.setObjectFromString(obj, key, val, "number");
    assertEquals(ok, true, `expected true for obj.b of type number`);
    assertNotEquals(obj['b'], undefined, `expected attribute "${key}" in obj -> ${JSON.stringify(obj, null, 2)}`);
    assertEquals(obj['b'], expected, `expected obj.b ${expected}, got ${obj['b']}`);
    val = "2025-01-21";
    expected = new Date(val);
    key = "c";
    ok = edit.setObjectFromString(obj, key, val, "date");
    assertEquals(ok, true, `expected true for obj.c of type date`);
    assertNotEquals(obj['c'], undefined, `expected attribute "${key}" in obj -> ${JSON.stringify(obj, null, 2)}`);
    assertEquals(obj['c'], expected, `expected obj.c ${expected}, got ${obj['b']}`);
}

async function main() {
    testEditorFromEnv();
    await testEditTempData();
    testSetObjectFromString();
}

if (import.meta.main) {
    await main();
} else {
    Deno.test('test getEditorFromEnv', testEditorFromEnv);
    Deno.test('test editTempData', await testEditTempData);
    Deno.test('test testSetObjectFromString', testSetObjectFromString);
}