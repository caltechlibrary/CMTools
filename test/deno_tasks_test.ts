import { assertEquals } from "@std/assert";
import { addDenoTasks } from "../src/deno_tasks.ts";

Deno.test("addDenoTasks creates deno.json from scratch", async () => {
  const tmp = await Deno.makeTempDir();
  const denoJsonPath = `${tmp}/deno.json`;

  const ok = await addDenoTasks(denoJsonPath, "codemeta.json", ["version.ts"]);
  assertEquals(ok, true);

  const src = await Deno.readTextFile(denoJsonPath);
  const result = JSON.parse(src);
  assertEquals(
    result.tasks["gen-code"],
    "deno run --allow-read --allow-write ./cmt.ts codemeta.json version.ts",
  );

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("addDenoTasks preserves existing tasks", async () => {
  const tmp = await Deno.makeTempDir();
  const denoJsonPath = `${tmp}/deno.json`;

  await Deno.writeTextFile(
    denoJsonPath,
    JSON.stringify({ tasks: { build: "deno task compile" } }, null, 2),
  );

  const ok = await addDenoTasks(denoJsonPath, "codemeta.json", ["version.ts", "about.md"]);
  assertEquals(ok, true);

  const src = await Deno.readTextFile(denoJsonPath);
  const result = JSON.parse(src);
  assertEquals(result.tasks["build"], "deno task compile");
  assertEquals(
    result.tasks["gen-code"],
    "deno run --allow-read --allow-write ./cmt.ts codemeta.json version.ts about.md",
  );

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("addDenoTasks creates backup of existing deno.json", async () => {
  const tmp = await Deno.makeTempDir();
  const denoJsonPath = `${tmp}/deno.json`;
  const original = JSON.stringify({ tasks: { build: "deno task compile" } }, null, 2);

  await Deno.writeTextFile(denoJsonPath, original);
  await addDenoTasks(denoJsonPath, "codemeta.json", ["version.ts"]);

  const backup = await Deno.readTextFile(`${denoJsonPath}.bak`);
  assertEquals(backup, original);

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("addDenoTasks returns false on invalid JSON", async () => {
  const tmp = await Deno.makeTempDir();
  const denoJsonPath = `${tmp}/deno.json`;

  await Deno.writeTextFile(denoJsonPath, "{ not valid json }");

  const ok = await addDenoTasks(denoJsonPath, "codemeta.json", ["version.ts"]);
  assertEquals(ok, false);

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("addDenoTasks gen-code task is a plain string", async () => {
  const tmp = await Deno.makeTempDir();
  const denoJsonPath = `${tmp}/deno.json`;

  await addDenoTasks(denoJsonPath, "codemeta.json", ["version.ts"]);

  const src = await Deno.readTextFile(denoJsonPath);
  const result = JSON.parse(src);
  assertEquals(typeof result.tasks["gen-code"], "string");

  await Deno.remove(tmp, { recursive: true });
});
