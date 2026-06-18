import { parseArgs } from "@std/cli";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { cmtHelpText, fmtHelp } from "./helptext.ts";
import { CodeMeta } from "./src/codemeta.ts";
import { isSupportedFormat, transform } from "./src/transform.ts";
import { ERROR_COLOR, GREEN } from "./src/colors.ts";
import { addDenoTasks } from "./src/deno_tasks.ts";
import { loadConfig, saveConfig } from "./src/config.ts";

async function main() {
  const appName = "cmt";
  const app = parseArgs(Deno.args, {
    alias: {
      help: "h",
      license: "l",
      version: "v",
      init: "i",
	  lang: "L",
    },
    default: {
      help: false,
      version: false,
      license: false,
      init: "",
      lang: "",
    },
  });
  const args = app._;
  const config = await loadConfig();

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
  const inputName: string = (args.length > 0) ? `${args.shift()}` : "";
  let lang = app.lang;
  if (app.lang === "") {
    //FIXME: should check the filenames to generate and see if a version.ts, version.js, version.py or version.go is referenced
	for (let i = 0; i < args.length; i++) {
		const name: string = args[i] as unknown as string;
		if (name.endsWith(".go")) {
			lang = "go";
		} else if (name.endsWith(".js")) {
			lang = "javascript"
		} else if (name.endsWith(".ts")) {
			lang = "typescript"
		} else if (name.endsWith(".py")) {
			lang = "python"
		}
	}
	if (lang === "") {
    	lang = "javascript";
	}
  }
  let outputNames: string[] = [];
  if (app.init !== "") {
    outputNames = [
      "README.md",
      "about.md",
      "search.md",
      "CITATION.cff",
      "INSTALL.md",
      "INSTALL_NOTES_macOS.md",
      "INSTALL_NOTES_Windows.md",
      "installer.ps1",
      "installer.sh",
      "page.tmpl",
      "links-to-html.lua",
      "add-col-scope.lua",
      "website.mak",
      "website.ps1",
	  "site.css",
    ];
    switch (app.init.toLowerCase()) {
      case "python":
        lang = app.init.toLowerCase();
        outputNames.push("version.py");
        break;
      case "go":
        lang = app.init.toLowerCase();
        outputNames.push("version.go");
        outputNames.push("Makefile");
        break;
      case "deno-cli":
        lang = "deno-cli";
        outputNames.push("version.ts");
        outputNames.push("Makefile");
        break;
      case "deno-bundle":
      case "deno-es-module":
      case "deno-webcomponent":
        lang = app.init.toLowerCase();
        outputNames = outputNames.filter((n) =>
          !["INSTALL.md", "INSTALL_NOTES_macOS.md", "INSTALL_NOTES_Windows.md",
            "installer.ps1", "installer.sh"].includes(n)
        );
        outputNames.push("Makefile");
        break;
      // deprecated aliases — kept for backward compatibility
      case "deno":
      case "typescript":
        lang = "deno-cli";
        outputNames.push("version.ts");
        outputNames.push("Makefile");
        break;
      case "javascript":
        lang = "deno-cli";
        outputNames.push("version.js");
        outputNames.push("Makefile");
        break;
      case "documentation":
      case "presentation":
        lang = "documentation";
        outputNames = outputNames.filter((n) =>
          !["INSTALL.md", "INSTALL_NOTES_macOS.md", "INSTALL_NOTES_Windows.md",
            "installer.ps1", "installer.sh"].includes(n)
        );
        outputNames.push("Makefile");
        outputNames.push("make.ps1");
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
  // For deno-cli init, remaining args are executable basenames, not output files.
  // For all other cases, remaining args are additional output filenames.
  const denoCliInits = ["deno-cli", "deno", "typescript", "javascript"];
  const executableNames: string[] = [];
  if (app.init !== "" && denoCliInits.includes(app.init.toLowerCase())) {
    for (const arg of args) {
      executableNames.push(`${arg}`);
    }
  } else {
    for (const outputName of args) {
      if (outputNames.indexOf(`${outputName}`) === -1) {
        outputNames.push(`${outputName}`);
      }
    }
  }
  // If no executable names were provided on the CLI, fall back to the
  // project-level .cmtoolsrc so regeneration (e.g. `cmt codemeta.json Makefile`)
  // uses the same executables that were set at --init time.
  if (executableNames.length === 0 && config?.executables && config.executables.length > 0) {
    executableNames.push(...config.executables);
  }

  // Now we can check to see if we have output names to work with.
  if (outputNames.length < 1) {
    console.log(
      `USAGE: %c${appName} [OPTIONS] INPUT_NAME [OUTPUT_NAME]`,
      ERROR_COLOR,
    );
    Deno.exit(1);
  }

  if (inputName === "") {
    console.log("error: %cmissing filepath to codemeta.json", ERROR_COLOR);
    Deno.exit(1);
  }
  let src: string = "";
  try {
    src = await Deno.readTextFile(inputName);
  } catch (_err) {
    if (app.init !== "") {
      const projectName = Deno.cwd().split("/").at(-1) ?? "";
      const skeleton = {
        "@context": "https://w3id.org/codemeta/3.0",
        "type": "SoftwareSourceCode",
        "name": projectName,
        "version": "0.0.1",
      };
      src = JSON.stringify(skeleton, null, 2);
      await Deno.writeTextFile(inputName, src);
      console.log(`created skeleton %c${inputName}`, GREEN);
    } else {
      console.log(`error: %ccould not read ${inputName}`, ERROR_COLOR);
      Deno.exit(1);
    }
  }
  let obj: object = {};
  try {
    obj = JSON.parse(src) as object;
  } catch (err) {
    console.log(`error parsing ${inputName}, %c${err}`, ERROR_COLOR);
    Deno.exit(1);
  }

  const cm = new CodeMeta();
  if (cm.fromObject(obj as { [key: string]: unknown }) === false) {
    console.log(`failed to process object, %c${inputName}`, ERROR_COLOR);
    Deno.exit(1);
  }
  for (const outputName of outputNames) {
    // NOTE: Formats are defined by outputName, e.g. README.md, INSTALL.md.
    const format = outputName;
    if (!isSupportedFormat(format)) {
      console.log(`unsupported format, %c"${format}"`, ERROR_COLOR);
      Deno.exit(1);
    }
    const txt: string | undefined = await transform(cm, format, lang, executableNames);
    if (txt === undefined) {
      console.log(`unsupported transform, %c"${format}"`, ERROR_COLOR);
      Deno.exit(1);
    }
    Deno.writeTextFile(outputName, txt);
  }

  if (app.init !== "" && lang.startsWith("deno")) {
    const genCodeFiles = outputNames.filter((n) =>
      n.startsWith("version.") || n === "about.md" || n === "CITATION.cff"
    );
    if (genCodeFiles.length > 0) {
      const ok = await addDenoTasks("deno.json", inputName, genCodeFiles, executableNames);
      if (!ok) {
        console.log("Warning: %cfailed to update deno.json gen-code task", ERROR_COLOR);
      }
    }
  }

  // Persist executable names from --init deno-cli to the project-level
  // .cmtoolsrc so subsequent regeneration runs (e.g. `cmt codemeta.json Makefile`)
  // use the correct names without requiring the user to repeat them on the CLI.
  if (
    app.init !== "" &&
    denoCliInits.includes(app.init.toLowerCase()) &&
    executableNames.length > 0
  ) {
    const projectConfigPath = `${Deno.cwd()}/.cmtoolsrc`;
    const projectConfig = await loadConfig(projectConfigPath) ??
      { profiles: {}, licenses: {}, person_lists: {} };
    if (JSON.stringify(projectConfig.executables) !== JSON.stringify(executableNames)) {
      projectConfig.executables = executableNames;
      await saveConfig(projectConfig, projectConfigPath);
    }
  }
}

if (import.meta.main) main();
