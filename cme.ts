import { parseArgs } from "@std/cli";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { fmtHelp, cmeHelpText } from "./helptext.ts";
import { CodeMeta, CodeMetaTerms } from "./codemeta.ts";
import type { AttributeType } from "./codemeta.ts";
import { editCodeMetaTerm } from "./editor.ts";

function getAttributeNames(terms: AttributeType[]): string[] {
  let names: string[] = [];
  for (let item of terms) {
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
      attributes: "a",
      interactive: "i",
    },
    default: {
      help: false,
      version: false,
      license: false,
      editor: false,
      attributes: false,
      interactive: false,
    },
  });
  const args = app._;

  if (app.help) {
    console.log(fmtHelp(cmeHelpText, appName, version, releaseDate, releaseHash));
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
    console.log('');
    for (const term of CodeMetaTerms) {
      console.log(`${term.name}
: ${term.help}
`);
    }
    Deno.exit(0);
  }
  console.log(`DEBUG checking arg count -> ${args.length}`);
  if (args.length < 1) {
    console.log(`USAGE: ${appName} [OPTIONS] INPUT_NAME [OUTPUT_NAME]`);
    Deno.exit(1);
  }
  let inputName: string = (args.length > 0) ? `${args.shift()}` : "";
  let attributeNames: string[] = [];
  if (app.interactive || args.length === 0) {
    attributeNames = codeMetaTermNames;
  }
  for (let val of args) {
    const attr: string = `${val}`;
    if (attributeNames.indexOf(attr) === -1) {
      // Make sure the attirubute name makes sense, if not exits without doing anything.
      if (codeMetaTermNames.indexOf(attr) === -1) {
        console.log(`ERROR: "${attr}" is not a supported CodeMeta 3 term, aborting`);
        Deno.exit(1);
      }
      attributeNames.push(`${attr}`);
    }
  }

  if (inputName === "") {
    console.log("error: missing filepath to codemeta.json");
    Deno.exit(1);
  }
  console.log(`DEBUG inputName -> ${inputName}, attributeNames -> ${attributeNames}`);
  let src: string = '';
  try {
    src = await Deno.readTextFile(inputName);
  } catch (err) {
    console.log(err.toString());
    if (confirm(`Create ${inputName}?`)) {
      src = '{}';
    } else {
      Deno.exit(1);
    }
  }
  let obj: {[key: string]: any} = {};
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
  if (attributeNames.length > 0) {
    for (let name of attributeNames) {
      console.log(`DEBUG editCodeMetaTerm(cm, ${name}, ${app.editor})`);
      if (! await editCodeMetaTerm(cm, name, app.editor)) {
          console.log(`WARNING: failed to update ${name}`)
      }
    }
    src = JSON.stringify(cm.toObject(), null, 2);
    console.log(src);
    if (confirm(`Write to ${inputName}`)) {
      // Check if file exists then write out new version.
      try {
        await Deno.copyFile(inputName, `${inputName}.bak`);
      } catch (err) {
        // No file exists, skip backup.
      }
      await Deno.writeTextFile(inputName, src);
    }
    Deno.exit(0);
  }
}

if (import.meta.main) main();
