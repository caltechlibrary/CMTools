import { parseArgs } from "@std/cli";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { fmtHelp, cmtHelpText } from "./helptext.ts";
import { CodeMeta } from "./codemeta.ts";
import { getFormatFromExt, isSupportedFormat, transform } from "./transform.ts";

async function main() {
  const appName = "cmt";
  const app = parseArgs(Deno.args, {
    alias: {
      help: "h",
      license: "l",
      version: "v",
      format: "f",
      deno: "d",
    },
    default: {
      help: false,
      version: false,
      license: false,
      format: "",
      deno: false,
    },
  });
  const args = app._;

  if (app.help) {
    console.log(fmtHelp(cmtHelpText, appName, version, releaseDate, releaseHash));
    Deno.exit(0);
  }
  if (app.license) {
    console.log(licenseText);
    Deno.exit(0);
  }

  if (app.version) {
    console.log(`${appName} ${version} ${releaseDate} ${releaseHash}`);
    Deno.exit(0);
  }
  if (args.length < 1) {
    console.log(`USAGE: ${appName} [OPTIONS] INPUT_NAME [OUTPUT_NAME]`);
    Deno.exit(1);
  }
  let format = app.format;
  let inputName: string = (args.length > 0) ? `${args.shift()}` : "";
  let outputNames: string[] = [];
  for (let outputName of args) {
    outputNames.push(`${outputName}`);
  } 
  if (inputName === "") {
    console.log("error: missing filepath to codemeta.json");
    Deno.exit(1);
  }
  let src: string = await Deno.readTextFile(inputName);
  let obj: object = {};
  try {
    obj = JSON.parse(src);
  } catch (err) {
    console.log(err);
    Deno.exit(1);
  }

  let cm = new CodeMeta();
  if (cm.fromObject(obj) === false) {
    console.log(`failed to process ${inputName} object`);
    Deno.exit(1);
  }
  if (outputNames.length === 0) {
    if (!isSupportedFormat(format)) {
      console.log(`unsupported format, "${format}"`);
      Deno.exit(1);
    }
    let txt: string | undefined = await transform(cm, format);
    if (txt === undefined) {
      console.log(`unsupported transform, "${format}"`);
      Deno.exit(1);
    }
    console.log(txt);
    Deno.exit(0);
  }
  let denoTasks: {[ key: string]: string } = {};
  for (let outputName of outputNames) {
    format = getFormatFromExt(outputName, app.format);
    if (!isSupportedFormat(format)) {
      console.log(`unsupported format, "${format}"`);
      Deno.exit(1);
    }
    let txt: string | undefined = await transform(cm, format);
    if (txt === undefined) {
      console.log(`unsupported transform, "${format}"`);
      Deno.exit(1);
    }
    Deno.writeTextFile(outputName, txt);
    if (app.deno) {
      denoTasks[outputName] = `${appName} ${inputName} ${outputName}`;
    }
  }
  // Handle updating the deno.json file.
  if (app.deno) {
    let src: string | undefined = undefined;
    let doBackup: boolean = true;
    try {
      src = await Deno.readTextFile("deno.json");
    } catch (err) {
      console.warn(`creating deno.json`);
      doBackup = false;
    }
    if (src === undefined) {
      src = `{"tasks":{}}`;
    }
    let denoJSON = JSON.parse(src);
    let genCodeTasks: string[] = [];
    if (denoJSON.tasks === undefined) {
      denoJSON.tasks = {};
    }
    for (let taskName of Object.keys(denoTasks)) {
      denoJSON.tasks[taskName] = denoTasks[taskName];
      genCodeTasks.push(`deno task ${taskName}`);
    }
    if (genCodeTasks.length > 0) {
      denoJSON.tasks["gen-code"] = genCodeTasks.join(' ; ');
    }
    // Update deno.json file.
    if (doBackup) {
      try {
        await Deno.copyFile("deno.json", "deno.json.bak");
      } catch(err) {
        console.log(`failed to backup deno.json aborting, ${err}`);
        Deno.exit(1);
      }
    }
    src = JSON.stringify(denoJSON, null, 2);
    if (src !== undefined) {
        Deno.writeTextFile("deno.json", src);
    }
  }
}

if (import.meta.main) main();
