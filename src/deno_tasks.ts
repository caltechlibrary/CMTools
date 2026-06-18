import { ERROR_COLOR, GREEN } from "./colors.ts";

const DENO_PERMS = "--allow-read --allow-write --allow-run --allow-env";

const DIST_TARGETS = [
  { key: "linux_x86_64", triple: "x86_64-unknown-linux-gnu", ext: "" },
  { key: "linux_aarch64", triple: "aarch64-unknown-linux-gnu", ext: "" },
  { key: "macos_x86_64", triple: "x86_64-apple-darwin", ext: "" },
  { key: "macos_aarch64", triple: "aarch64-apple-darwin", ext: "" },
  { key: "windows_x86_64", triple: "x86_64-pc-windows-msvc", ext: ".exe" },
  { key: "windows_aarch64", triple: "aarch64-pc-windows-msvc", ext: ".exe" },
];

export async function addDenoTasks(
  denoJsonPath: string = "deno.json",
  sourceFile: string,
  outputFiles: string[],
  executables: string[] = [],
): Promise<boolean> {
  let src: string | undefined = undefined;
  let doBackup = true;

  try {
    src = await Deno.readTextFile(denoJsonPath);
  } catch (_err) {
    console.log(`%ccreating ${denoJsonPath}`, GREEN);
    doBackup = false;
  }

  if (src === undefined) {
    src = `{"tasks":{}}`;
  }

  let denoJSON: { [key: string]: unknown } = {};
  try {
    denoJSON = JSON.parse(src) as { [key: string]: unknown };
  } catch (err) {
    console.log(`deno.json error, %c${err}`, ERROR_COLOR);
    return false;
  }

  if (denoJSON.tasks === undefined || denoJSON.tasks === null) {
    denoJSON.tasks = {};
  }

  const tasks = denoJSON.tasks as { [key: string]: string };

  // gen-code task: regenerate files derived from codemeta.json
  const filesArg = [sourceFile, ...outputFiles].join(" ");
  tasks["gen-code"] = `cmt ${filesArg}`;

  // Per-executable compile tasks and dist tasks
  if (executables.length > 0) {
    for (const exe of executables) {
      tasks[exe] = `deno compile ${DENO_PERMS} --output ./bin/${exe} ${exe}.ts`;
    }
    tasks["compile"] = executables.map((e) => `deno task ${e}`).join(" ; ");
    tasks["build"] = "deno task gen-code ; deno task compile";

    for (const target of DIST_TARGETS) {
      for (const exe of executables) {
        const out = exe + target.ext;
        tasks[`dist_${target.key}_${exe}`] =
          `deno compile ${DENO_PERMS} --output dist/bin/${out} --target ${target.triple} ${exe}.ts`;
      }
      tasks[`dist_${target.key}`] = executables
        .map((e) => `deno task dist_${target.key}_${e}`)
        .join(" ; ");
    }
  }

  denoJSON.tasks = tasks;

  if (doBackup) {
    try {
      await Deno.copyFile(denoJsonPath, `${denoJsonPath}.bak`);
    } catch (err) {
      console.log(
        `failed to backup ${denoJsonPath} aborting, %c${err}`,
        ERROR_COLOR,
      );
      return false;
    }
  }

  await Deno.writeTextFile(denoJsonPath, JSON.stringify(denoJSON, null, 2));
  console.log(`%cupdated ${denoJsonPath}`, GREEN);
  return true;
}
