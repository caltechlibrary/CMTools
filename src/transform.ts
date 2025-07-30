import * as path from "@std/path";
//import * as yaml from "@std/yaml";
import Handlebars from "npm:handlebars";
import { CodeMeta } from "./codemeta.ts";
import { gitOrgOrPerson, gitReleaseHash } from "./gitcmds.ts";
//import { version, releaseDate, releaseHash } from "./version.ts";
import * as gText from "./generate_text.ts";

export function isSupportedFormat(format: string | undefined): boolean {
  if (format === undefined) {
    return false;
  }
  return [
    "README.md",
    "INSTALL.md",
    "INSTALL_NOTES_macOS.md",
    "INSTALL_NOTES_WINDOWS.md",
    "CITATION.cff",
    "search.md",
    "about.md",
    "Makefile",
    "build.ps1",
    "installer.sh",
    "installer.ps1",
    "website.mak",
    "website.ps1",
    "links-to-html.lua",
    "publish.bash",
    "publish.ps1",
    "release.bash",
    "release.ps1",
    "version.ts",
    "version.js",
    "version.go",
    "version.py",
    "deno-tasks.json",
    "page.tmpl",
    "page.hbs",
  ].indexOf(format) > -1;
}

// FIXME: need to handle the special case renderings for README.md,
// INSTALL.md and the installer scripts.

function getMakefileTemplate(
  lang: string,
  isDeno: boolean,
): string | undefined {
  const prefix: { [key: string]: string } = {
    "golang": goMakefileText,
    "go": goMakefileText,
    "javascript": denoMakefileText,
    "typescript": denoMakefileText,
    "deno": denoMakefileText,
    //"python": pyMakefileText,
    //"bash": shMakefileText,
  };
  if (lang === "" && isDeno) {
    return denoMakefileText;
  }
  if (prefix[lang.toLowerCase()] === undefined) {
    return undefined;
  }
  return prefix[lang.toLowerCase()];
}

export async function transform(
  cm: CodeMeta,
  format: string,
  lang: string,
  isDeno: boolean,
): Promise<string | undefined> {
  if (!isSupportedFormat(format)) {
    return undefined;
  }
  const obj: { [key: string]: unknown } = cm.toObject();
  obj["project_name"] = path.basename(Deno.cwd());
  obj["releaseHash"] = await gitReleaseHash();
  if (obj["dateModified"] === undefined || obj["dateModified"] === "") {
    const d = new Date();
    const year = `${d.getFullYear()}`;
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate() + 1}`.padStart(2, "0");
    obj["dateModified"] = `${year}-${month}-${day}`;
  }
  (obj["releaseDate"] === undefined)
    ? obj["releaseDate"] = obj["dateModified"]
    : "";
  obj["git_org_or_person"] = await gitOrgOrPerson();
  let licenseText: string = "";
  try {
    licenseText = await Deno.readTextFile("LICENSE");
  } catch (err) {
    console.log(`warning: missing license file, ${err}`);
    licenseText = "";
  }
  if (licenseText !== undefined && licenseText !== "") {
    obj["licenseText"] = licenseText;
  }
  if (cm.codeRepository !== "") {
    obj["repositoryLink"] = cm.codeRepository.replace("git+https", "https");
  }
  //FIXME: If generating deno tasks or page templates I need to 
  // prompt for choices.
  // deno tasks I need to know the name(s) of the executables and the source module for compile statement
  // for page templates I need to know if I'm pulling CaltechLibrary defaults or the generic version.

  let makefileTemplate: string | undefined = "";
  switch (format) {
    case "README.md":
      return renderTemplate(obj, readmeMdText);
    case "INSTALL.md":
      return renderTemplate(obj, installMdText);
    case "INSTALL_NOTES_macOS.md":
      return renderTemplate(obj, installNotesMacOSMdText);
    case "INSTALL_NOTES_Windows.md":
      return renderTemplate(obj, installNotesWindowsMdText);
    case "search.md":
      return renderTemplate(obj, searchMdText);
    case "Makefile":
      makefileTemplate = getMakefileTemplate(lang, isDeno);
      if (makefileTemplate === undefined) {
        return undefined;
      }
      return renderTemplate(obj, makefileTemplate);
    case "website.mak":
      return renderTemplate(obj, websiteMakefileText);
    case "website.ps1":
      return renderTemplate(obj, websitePs1Text);
    case "release.bash":
      return renderTemplate(obj, releaseBashText);
    case "release.ps1":
      return renderTemplate(obj, releasePs1Text);
    case "publish.bash":
      return renderTemplate(obj, publishBashText);
    case "publish.ps1":
      return renderTemplate(obj, publishPs1Text);
    case "links-to-html.lua":
      return renderTemplate(obj, linksToHtmlLuaText);
    case "deno-tasks.json":
      return renderTemplate(obj, denoTasksText);
    case "CITATION.cff":
      return renderTemplate(obj, citationCffText);
    case "version.ts":
      return renderTemplate(obj, versionTsText);
    case "version.js":
      return renderTemplate(obj, versionJsText);
    case "version.go":
      return renderTemplate(obj, versionGoText);
    case "version.py":
      return renderTemplate(obj, versionPyText);
    case "about.md":
      return renderTemplate(obj, aboutMdText);
    case "installer.sh":
      return renderTemplate(obj, shInstallerText);
    case "installer.ps1":
      return renderTemplate(obj, ps1InstallerText);
    case "page.hbs":
      if (obj['git_org_or_person'] !== undefined && obj['git_org_or_person'] !== null && (obj['git_org_or_person'] as string).toLowerCase() === 'caltechlibrary' ) {
        return renderTemplate(obj, pageHbsCaltechLibraryText)?.replace(
          "$$content$$",
          "${body}",
        );
      }
      return renderTemplate(obj, pageHbsText)?.replace(
        "$$content$$",
        "{{{content}}}",
      );
    case "page.tmpl": // render as Pandoc template
      if (obj['git_org_or_person'] !== undefined && obj['git_org_or_person'] !== null && (obj['git_org_or_person'] as string).toLowerCase() === 'caltechlibrary' ) {
        return renderTemplate(obj, pageHbsCaltechLibraryText)?.replace(
          "$$content$$",
          "${body}",
        );
      }
      return renderTemplate(obj, pageHbsText)?.replace(
        "$$content$$",
        "${body}",
      );
    default:
      return undefined;
  }
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

// CITATION.cff
const citationCffText = gText.citationCffText;

// TypeScript
const versionTsText = gText.versionTsText;

// JavaScript
const versionJsText = gText.versionJsText;

// Python
const versionPyText = gText.versionPyText;

// Go
const versionGoText = gText.versionGoText;

// Pandoc
const aboutMdText = gText.aboutMdText;

// HTML
const pageHbsText = gText.pageHbsText;

// HTML
const pageHbsCaltechLibraryText = gText.pageHbsCaltechLibraryText;

// Bash
const shInstallerText = gText.shInstallerText;

// Powershell
const ps1InstallerText = gText.ps1InstallerText;

// Markdown
const readmeMdText = gText.readmeMdText;

// Markdown
const searchMdText = gText.searchMdText;

// Markdown
const installMdText = gText.installMdText;

// Markdown
const installNotesMacOSMdText = gText.installNotesMacOSMdText;

// Markdown
const installNotesWindowsMdText = gText.installNotesWindowsMdText;

// Makefile
const denoMakefileText = gText.denoMakefileText;

// Makefile
const goMakefileText = gText.goMakefileText;

// Makefile
const websiteMakefileText = gText.websiteMakefileText;

// PowerShell script 
const websitePs1Text = gText.websitePs1Text;

// links-to-html.lua
const linksToHtmlLuaText = gText.linksToHtmlLuaText;

// deno-tasks
const denoTasksText = gText.denoTasksText;

// Bash script
const publishBashText = gText.publishBashText;

// PowerShell script
const publishPs1Text = gText.publishPs1Text;

// Bash script
const releaseBashText = gText.releaseBashText;

// PowerShell script
const releasePs1Text = gText.releasePs1Text;
