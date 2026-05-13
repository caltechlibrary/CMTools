import { ERROR_COLOR, GREEN } from "./colors.ts";

export async function addDenoTasks(
  denoJsonPath: string = "deno.json",
  sourceFile: string,
  outputFiles: string[],
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
  const filesArg = [sourceFile, ...outputFiles].join(" ");
  tasks["gen-code"] = `deno run --allow-read --allow-write ./cmt.ts ${filesArg}`;
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
