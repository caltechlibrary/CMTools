import { parseArgs } from "@std/cli";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { cmtHelpText, fmtHelp } from "./helptext.ts";
import { CodeMeta } from "./codemeta.ts";
import { getFormatFromExt, isSupportedFormat, transform } from "./transform.ts";
import { ERROR_COLOR, GREEN } from "./colors.ts";

async function main() {
  const appName = "cmt";
  const app = parseArgs(Deno.args, {
    alias: {
      help: "h",
      license: "l",
      version: "v",
      format: "f",
      deno: "d",
      init: "i",
    },
    default: {
      help: false,
      version: false,
      license: false,
      format: "",
      deno: false,
      init: "",
    },
  });
  const args = app._;

  if (app.help) {
    console.log(
      fmtHelp(cmtHelpText, appName, version, releaseDate, releaseHash),
    );
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
    console.log(
      `USAGE: %c${appName} [OPTIONS] INPUT_NAME [OUTPUT_NAME]`,
      ERROR_COLOR,
    );
    Deno.exit(1);
  }
  let format = app.format;
  const isDeno = app.deno;
  let inputName: string = (args.length > 0) ? `${args.shift()}` : "";
  let outputNames: string[] = [];
  if (app.init !== "") {
    outputNames = [
      "README.md",
      "about.md",
      "CITATION.cff",
      "INSTALL.md",
      "installer.ps1",
      "installer.sh",
    ];
    switch (app.init.toLowerCase()) {
      case "python":
        outputNames.push("version.py");
        break;
      case "go":
        outputNames.push("version.go");
        outputNames.push("Makefile");
        break;
      case "typescript":
        outputNames.push("version.ts");
        outputNames.push("Makefile");
        app.deno = true;
        break;
      case "javascript":
        outputNames.push("version.js");
        outputNames.push("Makefile");
        app.deno = true;
        break;
      default:
        console.log(
          `languaged not supported by init option, %c${app.init}`,
          ERROR_COLOR,
        );
        Deno.exit(1);
        break;
    }
  }
  for (const outputName of args) {
    if (outputNames.indexOf(`${outputName}`) === -1) {
      outputNames.push(`${outputName}`);
    }
  }
  if (inputName === "") {
    console.log("error: %cmissing filepath to codemeta.json", ERROR_COLOR);
    Deno.exit(1);
  }
  let src: string = await Deno.readTextFile(inputName);
  let obj: object = {};
  try {
    obj = JSON.parse(src);
  } catch (err) {
    console.log(`error parsing ${inputName}, %c${err}`, ERROR_COLOR);
    Deno.exit(1);
  }

  let cm = new CodeMeta();
  if (cm.fromObject(obj) === false) {
    console.log(`failed to process object, %c${inputName}`, ERROR_COLOR);
    Deno.exit(1);
  }
  if (outputNames.length === 0) {
    if (!isSupportedFormat(format)) {
      console.log(`unsupported format, %c"${format}"`, ERROR_COLOR);
      Deno.exit(1);
    }
    let txt: string | undefined = await transform(cm, format, isDeno);
    if (txt === undefined) {
      console.log(`unsupported transform, %c"${format}"`, ERROR_COLOR);
      Deno.exit(1);
    }
    console.log(txt);
    Deno.exit(0);
  }
  let denoTasks: { [key: string]: string } = {};
  for (let outputName of outputNames) {
    // FIXME: Handle case of specific filenames, e.g. README.md, INSTALL.md
    format = getFormatFromExt(outputName, format);
    if (!isSupportedFormat(format)) {
      console.log(`unsupported format, %c"${format}"`, ERROR_COLOR);
      Deno.exit(1);
    }
    let txt: string | undefined = await transform(cm, format, isDeno);
    if (txt === undefined) {
      console.log(`unsupported transform, %c"${format}"`, ERROR_COLOR);
      Deno.exit(1);
    }
    Deno.writeTextFile(outputName, txt);
    if (app.deno) {
      denoTasks[outputName] = `${appName} ${inputName} ${outputName}`;
    }
  }
  // Handle updating the deno.json file.
  if (isDeno) {
    let src: string | undefined = undefined;
    let doBackup: boolean = true;
    try {
      src = await Deno.readTextFile("deno.json");
    } catch (err) {
      console.warn(`creating %cdeno.json`, GREEN);
      doBackup = false;
    }
    if (src === undefined) {
      src = `{"tasks":{}}`;
    }

    let denoJSON: { [key: string]: any } = {};
    try {
      denoJSON = JSON.parse(src);
    } catch (err) {
      console.log(`deno.json error, %c${err}`, ERROR_COLOR);
      Deno.exit(0);
    }
    let genCodeTasks: string[] = [];
    if (denoJSON.tasks === undefined) {
      denoJSON.tasks = {};
    }
    for (let taskName of Object.keys(denoTasks)) {
      denoJSON.tasks[taskName] = denoTasks[taskName];
      genCodeTasks.push(`deno task ${taskName}`);
    }
    if (genCodeTasks.length > 0) {
      denoJSON.tasks["gen-code"] = genCodeTasks.join(" ; ");
    }
    // Update deno.json file.
    if (doBackup) {
      try {
        await Deno.copyFile("deno.json", "deno.json.bak");
      } catch (err) {
        console.log(
          `failed to backup deno.json aborting, %c${err}`,
          ERROR_COLOR,
        );
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
