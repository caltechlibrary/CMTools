import * as path from "@std/path";
import * as yaml from "@std/yaml";
import Handlebars from "npm:handlebars";
import { CodeMeta } from "./codemeta.ts";
import { gitOrgOrPerson, gitReleaseHash } from "./gitcmds.ts";

export function getFormatFromExt(
  filename: string | undefined,
  defaultFormat: string,
): string {
  if (filename !== undefined) {
    switch (path.extname(filename)) {
      case ".cff":
        return "cff";
      case ".ts":
        return "ts";
      case ".js":
        return "js"
      case ".go":
        return "go";
      case ".py":
        return "py";
      case ".md":
        return "md";
      case ".hbs":
        return "hbs";
      case ".tmpl":
        return "pdtmpl";
      case ".pdtmpl":
        return "pdtmpl";
    }
  }
  return defaultFormat;
}

export function isSupportedFormat(format: string | undefined): boolean {
  if (format === undefined) {
    return false;
  }
  return ["cff", "ts", "js", "go", "py", "md", "hbs", "pdtmpl"].indexOf(format) > -1;
}

// FIXME: need to handle the special case renderings for README.md,
// INSTALL.md and the installer scripts.

export async function transform(
  cm: CodeMeta,
  format: string,
): Promise<string | undefined> {
  if (!isSupportedFormat(format)) {
    return undefined;
  }
  let obj: { [key: string]: any } = cm.toObject();
  obj["project_name"] = path.basename(Deno.cwd());
  obj["releaseHash"] = await gitReleaseHash();
  //obj['git_org_or_person'] = await gitOrgOrPerson();
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

  switch (format) {
    case "cff":
      return renderTemplate(obj, cffTemplateText);
    case "ts":
      return renderTemplate(obj, tsTemplateText);
    case "js":
      return renderTemplate(obj, tsTemplateText);
    case "go":
      return renderTemplate(obj, goTemplateText);
    case "py":
      return renderTemplate(obj, pyTemplateText);
    case "md":
      return renderTemplate(obj, mdTemplateText);
    case "hbs":
      return renderTemplate(obj, hbsTemplateText)?.replace(
        "$$content$$",
        "{{{content}}}",
      );
    case "pdtmpl": // render as Pandoc template
      return renderTemplate(obj, hbsTemplateText)?.replace(
        "$$content$$",
        "${body}",
      );
    default:
      return undefined;
  }
}

export function renderTemplate(obj: {[key: string]: any}, tmpl: string): string | undefined {
  const template = Handlebars.compile(tmpl);
  if (template === undefined) {
    console.log(`templates failed to compile, ${tmpl}`);
    return undefined;
  }
  return template(obj);
}

const cffTemplateText = `
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
type: software
{{#if name}}title: {{name}}{{/if}}
{{#if description}}abstract: "{{description}}"{{/if}}
{{#if author}}authors:
{{#each author}}
  - family-names: {{familyName}}
    given-names: {{givenName}}
    orcid: "{{id}}"{{/each}}{{/if}}
{{#if maintainer}}contacts:
{{#each maintainer}}
  - family-names: {{familyName}}
    given-names: {{givenName}}
    orcid: "{{id}}"{{/each}}{{/if}}
{{#if codeRepository}}repository-code: "{{codeRepository}}"{{/if}}
{{#if version}}version: {{version}}{{/if}}
{{#if datePublished}}date-released: {{datePublished}}{{/if}}
{{#if identifier}}doi: {{identifier}}{{/if}}
{{#if license}}license-url: "{{license}}"{{/if}}{{#if keywords}}
keywords:
{{#each keywords}}
  - {{.}}
{{/each}}{{/if}}
`;

const tsTemplateText = `// {{name}} version and license information.

export const version = '{{version}}',
releaseDate = '{{releaseDate}}',
releaseHash = '{{releaseHash}}'{{#if licenseText}},
licenseText = ` + "`" + `
{{licenseText}}
` + "`{{/if}};";

const pyTemplateText = `# {{name}} version and license information.

export const version = '{{version}}',
releaseDate = '{{releaseDate}}',
releaseHash = '{{releaseHash}}'{{#if licenseText}},
licenseText = '''
{{licenseText}}
'''{{/if}};
`;

const goTemplateText = `package {{name}}

import (
	"strings"
)

const (
    // Version number of release
    Version = "{{version}}"

    // ReleaseDate, the date version.go was generated
    ReleaseDate = "{{releaseDate}}"

    // ReleaseHash, the Git hash when version.go was generated
    ReleaseHash = "{{releaseHash}}"
{{#if licenseText}}
    LicenseText = ` + "`" + `
{{licenseText}}
` + "`" + `{{/if}}
)

// FmtHelp lets you process a text block with simple curly brace markup.
func FmtHelp(src string, appName string, version string, releaseDate string, releaseHash string) string {
	m := map[string]string {
		"{app_name}": appName,
		"{version}": version,
		"{release_date}": releaseDate,
		"{release_hash}": releaseHash,
	}
	for k, v := range m {
		if strings.Contains(src, k) {
			src = strings.ReplaceAll(src, k, v)
		}
	}
	return src
}

`;

const mdTemplateText = `
---
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
type: software
{{#if name}}title: "{{name}}"{{/if}}
{{#if description}}abstract: "{{description}}"{{/if}}
{{#if author}}authors:
{{#each author}}
  - family-names: {{familyName}}
    given-names: {{givenName}}
    {{#if id}}orcid: "{{id}}"{{/if}}{{/each}}{{/if}}
{{#if contributor}}contributor:
{{#each contributor}}
  - family-names: {{familyName}}
    given-names: {{givenName}}
    {{#if id}}orcid: "{{id}}"{{/if}}{{/each}}{{/if}}
{{#if maintainer}}maintainer:
{{#each maintainer}}
  - family-names: {{familyName}}
    given-names: {{givenName}}
    {{#if id}}orcid: "{{id}}"{{/if}}{{/each}}{{/if}}
{{#if codeRepository}}repository-code: "{{codeRepository}}"{{/if}}
{{#if version}}version: {{version}}{{/if}}
{{#if license}}license-url: {{license}}{{/if}}
{{#if operatingSystem}}operating-system:{{#each operatingSystem}}
  - {{.}}{{/each}}{{/if}}
{{#if programmingLanguage}}programming-language:{{#each programmingLanguage}}
  - {{.}}{{/each}}{{/if}}
{{#if keywords}}keywords:
{{#each keywords}}
  - {{.}}{{/each}}{{/if}}
{{#if datePublished}}date-released: {{datePublished}}{{/if}}
---

About this software
===================

## {{name}} {{version}}

{{#if author}}
### Authors

{{#each author}}
- {{givenName}} {{familyName}} {{id}}{{/each}}{{/if}}

{{#if contributor}}
### Contributors

{{#each contributor}}
- {{givenName}} {{familyName}} {{id}}{{/each}}{{/if}}

{{#if maintainer}}
### Maintainers

{{#each maintainer}}
- {{givenName}} {{familyName}} {{id}}{{/each}}{{/if}}

{{#if description}}{{description}}{{/if}}

{{#if license}}- License: <{{license}}>{{/if}}
{{#if codeRepository}}- GitHub: <{{codeRepository}}>{{/if}}
{{#if issueTracker}}- Issues: <{{issueTracker}}>{{/if}}

{{#if programmingLanguage}}
### Programming languages

{{#each programmingLanguage}}
- {{.}}
{{/each}}{{/if}}

{{#if operatingSystem}}
### Operating Systems

{{#each operatingSystem}}
- {{.}}
{{/each}}{{/if}}

{{#if softwareRequirements}}
### Software Requirements

{{#each softwareRequirements}}
- {{.}}
{{/each}}{{/if}}
`;

const hbsTemplateText = `<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>{{project_name}}</title>
    <link rel="stylesheet" href="/css/site.css">
</head>
<body>
<nav>
<ul>
    <li><a href="/">Home</a></li>
    <li><a href="index.html">README</a></li>
    <li><a href="LICENSE">LICENSE</a></li>
    <li><a href="INSTALL.html">INSTALL</a></li>
    <li><a href="user_manual.html">User Manual</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="search.html">Search</a></li>
{{#if repositoryLink}}    <li><a href="{{repositoryLink}}">GitHub</a></li>{{/if}}
</ul>
</nav>
<section>
$$content$$
</section>
</body>
</html>`;
