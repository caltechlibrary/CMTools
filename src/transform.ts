import * as path from "@std/path";
import Handlebars from "npm:handlebars";
import { CodeMeta } from "./codemeta.ts";
import { gitOrgOrPerson, gitReleaseHash } from "./gitcmds.ts";
import * as gText from "./generate_text.ts";

// Indent each line 2 spaces for use in YAML literal block scalars.
// Blank lines are kept empty (not indented) to satisfy strict YAML parsers.
Handlebars.registerHelper("yaml_block", (text: string): string => {
  if (!text) return "";
  return text
    .split("\n")
    .map((line: string) => (line.length > 0 ? "  " + line : ""))
    .join("\n");
});

// ---------------------------------------------------------------------------
// Generator registry
// ---------------------------------------------------------------------------

/** Function that renders a format given the template context and project lang. */
export type RenderFn = (
  obj: { [key: string]: unknown },
  lang: string,
) => string | undefined;

/** A registered output format with its render function. */
export interface FormatGenerator {
  format: string;
  render: RenderFn;
}

const _generators = new Map<string, FormatGenerator>();

/**
 * Register a new output format.
 * Call this once per format — typically at the bottom of this file or in a
 * separate generator module.  Adding a new format only requires:
 *   1. Add template text to generate_text.ts (or a new module).
 *   2. Call registerGenerator() here (or import a self-registering module).
 */
export function registerGenerator(gen: FormatGenerator): void {
  _generators.set(gen.format, gen);
}

export function isSupportedFormat(format: string | undefined): boolean {
  if (format === undefined) return false;
  return _generators.has(format);
}

// ---------------------------------------------------------------------------
// Private helpers used by Makefile / make.ps1 generators
// ---------------------------------------------------------------------------

function getMakefileText(lang: string): string | undefined {
  const map: { [key: string]: string } = {
    "golang": gText.goMakefileText,
    "go": gText.goMakefileText,
    "deno-cli": gText.denoMakefileText,
    "deno-bundle": gText.denoBundleMakefileText,
    "deno-es-module": gText.denoEsModuleMakefileText,
    "deno-webcomponent": gText.denoWebComponentMakefileText,
    "javascript": gText.denoMakefileText,
    "typescript": gText.denoMakefileText,
    "deno": gText.denoMakefileText,
    "documentation": gText.documentationMakefileText,
    "presentation": gText.documentationMakefileText,
  };
  if (lang === "") return gText.denoMakefileText;
  return map[lang.toLowerCase()];
}

function getMakePs1Text(lang: string): string | undefined {
  const map: { [key: string]: string } = {
    "golang": gText.goMakePs1Text,
    "go": gText.goMakePs1Text,
    "documentation": gText.documentationMakePs1Text,
    "presentation": gText.documentationMakePs1Text,
  };
  if (lang === "") return gText.goMakePs1Text;
  return map[lang.toLowerCase()];
}

// ---------------------------------------------------------------------------
// Core transform function
// ---------------------------------------------------------------------------

export async function transform(
  cm: CodeMeta,
  format: string,
  lang: string,
  executables: string[] = [],
): Promise<string | undefined> {
  const gen = _generators.get(format);
  if (!gen) return undefined;

  // Build template context
  const obj: { [key: string]: unknown } = cm.toObject();
  obj["project_name"] = path.basename(Deno.cwd());
  obj["executables"] = executables.length > 0
    ? executables.join(" ")
    : "<PROGRAM_LIST_GOES_HERE>";
  obj["releaseHash"] = await gitReleaseHash();
  if (obj["dateModified"] === undefined || obj["dateModified"] === "") {
    const d = new Date();
    const year = `${d.getFullYear()}`;
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    obj["dateModified"] = `${year}-${month}-${day}`;
  }
  if (obj["releaseDate"] === undefined) {
    obj["releaseDate"] = obj["dateModified"];
  }
  obj["git_org_or_person"] = await gitOrgOrPerson();
  let licenseText = "";
  try {
    licenseText = await Deno.readTextFile("LICENSE");
  } catch (err) {
    console.log(`warning: missing license file, ${err}`);
  }
  if (licenseText !== "") {
    obj["licenseText"] = licenseText;
  }
  if (cm.codeRepository !== "") {
    obj["repositoryLink"] = cm.codeRepository.replace("git+https", "https");
  }

  return gen.render(obj, lang);
}

export function renderTemplate(
  obj: { [key: string]: unknown },
  tmpl: string,
): string | undefined {
  const template = Handlebars.compile(tmpl);
  if (template === undefined) {
    console.log(`templates failed to compile, ${tmpl}`);
    return undefined;
  }
  return template(obj);
}

// ---------------------------------------------------------------------------
// Built-in format registrations
// To add a new format:
//   1. Add its template text to generate_text.ts (or a new module).
//   2. Add a registerGenerator() call below.
// ---------------------------------------------------------------------------

registerGenerator({
  format: "README.md",
  render: (obj) => renderTemplate(obj, gText.readmeMdText),
});
registerGenerator({
  format: "INSTALL.md",
  render: (obj) => renderTemplate(obj, gText.installMdText),
});
registerGenerator({
  format: "INSTALL_NOTES_macOS.md",
  render: (obj) => renderTemplate(obj, gText.installNotesMacOSMdText),
});
registerGenerator({
  format: "INSTALL_NOTES_Windows.md",
  render: (obj) => renderTemplate(obj, gText.installNotesWindowsMdText),
});
registerGenerator({
  format: "CITATION.cff",
  render: (obj) => renderTemplate(obj, gText.citationCffText),
});
registerGenerator({
  format: "search.md",
  render: (obj) => renderTemplate(obj, gText.searchMdText),
});
registerGenerator({
  format: "about.md",
  render: (obj) => renderTemplate(obj, gText.aboutMdText),
});
registerGenerator({
  format: "Makefile",
  render: (obj, lang) => {
    const tmpl = getMakefileText(lang);
    if (tmpl === undefined) return undefined;
    return renderTemplate(obj, tmpl);
  },
});
registerGenerator({
  format: "make.ps1",
  render: (obj, lang) => {
    const tmpl = getMakePs1Text(lang);
    if (tmpl === undefined) return undefined;
    return renderTemplate(obj, tmpl);
  },
});
registerGenerator({
  format: "installer.sh",
  render: (obj) => renderTemplate(obj, gText.installerShText),
});
registerGenerator({
  format: "installer.ps1",
  render: (obj) => renderTemplate(obj, gText.installerPs1Text),
});
registerGenerator({
  format: "website.mak",
  render: (obj) => renderTemplate(obj, gText.websiteMakefileText),
});
registerGenerator({
  format: "website.ps1",
  render: (obj) => renderTemplate(obj, gText.websitePs1Text),
});
registerGenerator({
  format: "links-to-html.lua",
  render: (obj) => renderTemplate(obj, gText.linksToHtmlLuaText),
});
registerGenerator({
  format: "add-col-scope.lua",
  render: (obj) => renderTemplate(obj, gText.addColScopeLuaText),
});
registerGenerator({
  format: "publish.bash",
  render: (obj) => renderTemplate(obj, gText.publishBashText),
});
registerGenerator({
  format: "publish.ps1",
  render: (obj) => renderTemplate(obj, gText.publishPs1Text),
});
registerGenerator({
  format: "release.bash",
  render: (obj) => renderTemplate(obj, gText.releaseBashText),
});
registerGenerator({
  format: "release.ps1",
  render: (obj) => renderTemplate(obj, gText.releasePs1Text),
});
registerGenerator({
  format: "version.ts",
  render: (obj) => renderTemplate(obj, gText.versionTsText),
});
registerGenerator({
  format: "version.js",
  render: (obj) => renderTemplate(obj, gText.versionJsText),
});
registerGenerator({
  format: "version.go",
  render: (obj) => renderTemplate(obj, gText.versionGoText),
});
registerGenerator({
  format: "version.py",
  render: (obj) => renderTemplate(obj, gText.versionPyText),
});
registerGenerator({
  format: "deno-tasks.json",
  render: (obj) => renderTemplate(obj, gText.denoTasksText),
});
registerGenerator({
  format: "site.css",
  render: (obj) => renderTemplate(obj, gText.siteCssText),
});
registerGenerator({
  format: "page.hbs",
  render: (obj) => {
    const isCL =
      (obj["git_org_or_person"] as string | undefined)?.toLowerCase() ===
      "caltechlibrary";
    if (isCL) {
      return renderTemplate(obj, gText.clPageHbsText)?.replace(
        "$$content$$",
        "${body}",
      );
    }
    return renderTemplate(obj, gText.pageHbsText)?.replace(
      "$$content$$",
      "{{{content}}}",
    );
  },
});
registerGenerator({
  format: "page.tmpl",
  render: (obj) => {
    const isCL =
      (obj["git_org_or_person"] as string | undefined)?.toLowerCase() ===
      "caltechlibrary";
    if (isCL) {
      return renderTemplate(obj, gText.clPageHbsText)?.replace(
        "$$content$$",
        "${body}",
      );
    }
    return renderTemplate(obj, gText.pageHbsText)?.replace(
      "$$content$$",
      "${body}",
    );
  },
});
