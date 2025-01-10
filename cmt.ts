import { parseArgs } from "@std/cli";
import * as path from "@std/path";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { fmtHelp, helpText } from "./helptext.ts";
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
    console.log(fmtHelp(helpText, appName, version, releaseDate, releaseHash));
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
  let denoTasks = app.deno;
  let inputName: string = (args.length > 0) ? `${args.shift()}` : "";
  let outputName: string = (args.length > 0) ? `${args.shift()}` : "";
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
  if (outputName !== "") {
    format = getFormatFromExt(outputName, app.format);
    /*
    console.log(
      `DEBUG getFormatFromExt("${outputName}", "${app.format}") -> ${format}`,
    );
    */
  }
  if (!isSupportedFormat(format)) {
    console.log(`unsupported format, "${format}"`);
    Deno.exit(1);
  }
  //console.log(`DEBUG output format "${format}"`);
  let txt: string | undefined = await transform(cm, format);
  if (txt === undefined) {
    console.log(`unsupported transform, "${format}"`);
    Deno.exit(1);
  }
  if (outputName === "") {
    console.log(txt);
  } else {
    Deno.writeTextFile(outputName, txt);
  }
}

if (import.meta.main) main();
