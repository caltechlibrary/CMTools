import { parseArgs } from "@std/cli";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { cmeHelpText, fmtHelp } from "./helptext.ts";
import { CodeMeta, CodeMetaTerms, type AttributeType } from "./src/codemeta.ts";
import { editCodeMetaTerm } from "./src/codemeta_editor.ts";


function getAttributeNames(terms: AttributeType[]): string[] {
  const names: string[] = [];
  for (const item of terms) {
    names.push(item.name);
  }
  return names;
}

async function main() {
  const appName = "cme";
  const app = parseArgs(Deno.args, {
    alias: {
      help: "h",
      license: "l",
      version: "v",
      format: "f",
      editor: "e",
    },
    default: {
      help: false,
      version: false,
      license: false,
      editor: false,
      attributes: false,
    },
  });
  const args = app._;

  if (app.help) {
    console.log(
      fmtHelp(cmeHelpText, appName, version, releaseDate, releaseHash),
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
  const codeMetaTermNames = getAttributeNames(CodeMetaTerms);
  if (app.attributes) {
    console.log("");
    for (const term of CodeMetaTerms) {
      console.log(`${term.name}
: ${term.help}
`);
    }
    Deno.exit(0);
  }
  if (args.length < 1) {
    console.log(`USAGE: ${appName} [OPTIONS] INPUT_NAME [OUTPUT_NAME]`);
    Deno.exit(1);
  }
  const inputName: string = (args.length > 0) ? `${args.shift()}` : "";
  let attributeNames: string[] = [];
  if (args.length === 0) {
    attributeNames = codeMetaTermNames;
  }
  const attrValues: { [key: string]: string } = {};
  for (const arg of args) {
    // NOTE: arg can be a number or value due to process_args, should always be string.
    let attr: string = `${arg}`;
    if (attr.indexOf("=") > -1) {
      const str = attr.substring(attr.indexOf("=") + 1);
      attr = attr.substring(0, attr.indexOf("="));
      attrValues[attr] = str;
    } else if (attributeNames.indexOf(attr) === -1) {
      // Make sure the attirubute name makes sense, if not exits without doing anything.
      if (codeMetaTermNames.indexOf(attr) === -1) {
        console.log(
          `ERROR: "${attr}" is not a supported CodeMeta attribute, aborting`,
        );
        Deno.exit(1);
      }
      attributeNames.push(`${attr}`);
    }
  }

  if (inputName === "") {
    console.log("error: missing filepath to codemeta.json");
    Deno.exit(1);
  }
  let src: string = "";
  try {
    src = await Deno.readTextFile(inputName);
  } catch (err) {
    console.log(`${err}`);
    if (confirm(`Create ${inputName}?`)) {
      src = "{}";
    } else {
      Deno.exit(1);
    }
  }
  let obj: { [key: string]: unknown } = {};
  try {
    obj = JSON.parse(src);
  } catch (err) {
    console.log(err);
    Deno.exit(1);
  }

  const cm = new CodeMeta();
  if (cm.fromObject(obj) === false) {
    console.log(`failed to process ${inputName} object`);
    Deno.exit(1);
  }
  if (Object.keys(attrValues).length > 0) {
    const obj: { [key: string]: string } = {};
    for (const key of Object.keys(attrValues)) {
      obj[key] = attrValues[key];
    }
    cm.patchObject(obj);
    src = JSON.stringify(cm.toObject(), null, 2);
    // Check if file exists then write out new version.
    try {
      await Deno.copyFile(inputName, `${inputName}.bak`);
    } catch (_err) {
      // No file exists, skip backup.
    }
    await Deno.writeTextFile(inputName, src);
  }
  if (attributeNames.length > 0) {
    for (const name of attributeNames) {
      if (!await editCodeMetaTerm(cm, name, app.editor)) {
        console.info(`INFO: using previous value for ${name}`);
      }
    }
    src = JSON.stringify(cm.toObject(), null, 2);
    console.log(src);
    if (confirm(`Write to ${inputName}`)) {
      // Check if file exists then write out new version.
      try {
        await Deno.copyFile(inputName, `${inputName}.bak`);
      } catch (_err) {
        // No file exists, skip backup.
      }
      await Deno.writeTextFile(inputName, src);
    }
    Deno.exit(0);
  }
}

if (import.meta.main) main();
