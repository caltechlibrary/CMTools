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
      //NOTE: We need to handle special case files like README.md, INSTALL.md
      switch (filename) {
        case "README.md":
          return "readme.md";
        case "INSTALL.md":
          return "install.md"
      }
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
      case ".bash":
        return "bash";
      case ".ps1":
        return "ps1";
    }
  }
  return defaultFormat;
}

export function isSupportedFormat(format: string | undefined): boolean {
  if (format === undefined) {
    return false;
  }
  return ["cff", "ts", "js", "go", "py", "md", "hbs", "pdtmpl", "bash", "ps1", "readme.md", "install.md"].indexOf(format) > -1;
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
  if (obj['dateModified'] === undefined || obj['dateModified'] === '') {
    const d = new Date();
    const year = `${d.getFullYear()}`;
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate() + 1}`.padStart(2, '0');
    obj['dateModified'] = `${year}-${month}-${day}`;
  }
  (obj['releaseDate'] === undefined) ? obj['releaseDate'] = obj['dateModified'] : '';
  obj['git_org_or_person'] = await gitOrgOrPerson();
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
    case "readme.md":
      return renderTemplate(obj, readmeMdText);
    case "install.md":
      return renderTemplate(obj, installMdText);
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
    case "bash":
        return renderTemplate(obj, bashInstallerText);
    case "ps1":
      return renderTemplate(obj, ps1InstallerText);
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
    given-names: {{givenName}}{{#if id}}
    orcid: {{id}}{{/if}}{{#if email}}
    email: {{email}}{{/if}}
{{/each}}{{/if}}
{{#if maintainer}}contacts:
{{#each maintainer}}
  - family-names: {{familyName}}
    given-names: {{givenName}}{{#if id}}
    orcid: {{id}}{{/if}}{{#if email}}
    email: {{email}}{{/if}}
{{/each}}{{/if}}
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

const mdTemplateText = `---
{{#if name}}title: {{name}}{{/if}}
{{#if description}}abstract: "{{description}}"{{/if}}
{{#if author}}authors:
{{#each author}}
  - family_name: {{familyName}}
    given_name: {{givenName}}{{#if id}}
    orcid: {{id}}{{/if}}
{{/each}}{{/if}}
{{#if contributor}}contributor:
{{#each contributor}}
  - family_name: {{familyName}}
    given_name: {{givenName}}{{#if id}}
    orcid: {{id}}{{/if}}
{{/each}}{{/if}}
{{#if maintainer}}maintainer:
{{#each maintainer}}
  - family_name: {{familyName}}
    given_name: {{givenName}}{{#if id}}
    orcid: {{id}}{{/if}}
{{/each}}{{/if}}
{{#if codeRepository}}repository_code: {{codeRepository}}{{/if}}
{{#if version}}version: {{version}}{{/if}}
{{#if license}}license_url: {{license}}{{/if}}
{{#if operatingSystem}}operating_system:
{{#each operatingSystem}}
  - {{.}}
{{/each}}{{/if}}
{{#if programmingLanguage}}programming_language:
{{#each programmingLanguage}}
  - {{.}}
{{/each}}{{/if}}
{{#if keywords}}keywords:
{{#each keywords}}
  - {{.}}
{{/each}}{{/if}}
{{#if datePublished}}date_released: {{datePublished}}{{/if}}
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

const bashInstallerText = `#!/bin/sh

#
# Set the package name and version to install
#
PACKAGE="{{name}}"
VERSION="{{version}}"
GIT_GROUP="{{git_org_or_person}}"
RELEASE="https://github.com/$$GIT_GROUP/$$PACKAGE/releases/tag/v$$VERSION"
if [ "$$PKG_VERSION" != "" ]; then
   VERSION="$$\{PKG_VERSION\}"
   echo "$$\{PKG_VERSION} used for version v$$\{VERSION\}"
fi

#
# Get the name of this script.
#
INSTALLER="$$(basename "$$0")"

#
# Figure out what the zip file is named
#
OS_NAME="$$(uname)"
MACHINE="$$(uname -m)"
case "$$OS_NAME" in
   Darwin)
   OS_NAME="macOS"
   ;;
   GNU/Linux)
   OS_NAME="Linux"
   ;;
esac

if [ "$$1" != "" ]; then
   VERSION="$$1"
   echo "Version set to v$$\{VERSION\}"
fi

ZIPFILE="$$PACKAGE-v$$VERSION-$$OS_NAME-$$MACHINE.zip"

#
# Check to see if this zip file has been downloaded.
#
DOWNLOAD_URL="https://github.com/$$GIT_GROUP/$$PACKAGE/releases/download/v$$VERSION/$$ZIPFILE"
if ! curl -L -o "$$HOME/Downloads/$$ZIPFILE" "$$DOWNLOAD_URL"; then
	echo "Curl failed to get $$DOWNLOAD_URL"
fi
cat<<EOT

  Retrieved $$DOWNLOAD_URL
  Saved as $$HOME/Downloads/$$ZIPFILE

EOT

if [ ! -d "$$HOME/Downloads" ]; then
	mkdir -p "$$HOME/Downloads"
fi
if [ ! -f "$$HOME/Downloads/$$ZIPFILE" ]; then
	cat<<EOT

  To install $$PACKAGE you need to download

    $$ZIPFILE

  from

    $$RELEASE

  You can do that with your web browser. After
  that you should be able to re-run $$INSTALLER

EOT
	exit 1
fi

START="$$(pwd)"
mkdir -p "$$HOME/.$$PACKAGE/installer"
cd "$$HOME/.$$PACKAGE/installer" || exit 1
unzip "$$HOME/Downloads/$$ZIPFILE" "bin/*" "man/*"

#
# Copy the application into place
#
mkdir -p "$$HOME/bin"
EXPLAIN_OS_POLICY="yes"
find bin -type f >.binfiles.tmp
while read -r APP; do
	V=$$("./$$APP" --version)
	if [ "$$V" = ""  ]; then
		EXPLAIN_OS_POLICY="yes"
	fi
	mv "$$APP" "$$HOME/bin/"
done <.binfiles.tmp
rm .binfiles.tmp

#
# Make sure $$HOME/bin is in the path
#
case :$$PATH: in
	*:$$HOME/bin:*)
	;;
	*)
	# shellcheck disable=SC2016
	echo 'export PATH="$$HOME/bin:$$PATH"' >>"$$HOME/.bashrc"
	# shellcheck disable=SC2016
	echo 'export PATH="$$HOME/bin:$$PATH"' >>"$$HOME/.zshrc"
    ;;
esac

# shellcheck disable=SC2031
if [ "$$EXPLAIN_OS_POLICY" = "no" ]; then
	cat <<EOT

  You need to take additional steps to complete installation.

  Your operating system security policied needs to "allow"
  running programs from $$PACKAGE.

  Example: on macOS you can type open the programs in finder.

      open $$HOME/bin

  Find the program(s) and right click on the program(s)
  installed to enable them to run.

EOT

fi

#
# Copy the manual pages into place
#
EXPLAIN_MAN_PATH="no"
for SECTION in 1 2 3 4 5 6 7; do
    if [ -d "man/man$$\{SECTION\}" ]; then
        EXPLAIN_MAN_PATH="yes"
        mkdir -p "$$HOME/man/man$$\{SECTION\}"
        find "man/man$$\{SECTION\}" -type f | while read -r MAN; do
            cp -v "$$MAN" "$$HOME/man/man$$\{SECTION\}/"
        done
    fi
done

if [ "$$EXPLAIN_MAN_PATH" = "yes" ]; then
  cat <<EOT
  The man pages have been installed at '$$HOME/man'. You
  need to have that location in your MANPATH for man to
  find the pages. E.g. For the Bash shell add the
  following to your following to your '$$HOME/.bashrc' file.

      export MANPATH="$$HOME/man:$$MANPATH"

EOT

fi

rm -fR "$$HOME/.$$PACKAGE/installer"
cd "$$START" || exit 1

`;

const ps1InstallerText = `#!/usr/bin/env pwsh
# Generated with codemeta-ps1-installer.tmpl, see https://github.com/caltechlibrary/codemeta-pandoc-examples

#
# Set the package name and version to install
#
param(
  [Parameter()]
  [String]$$VERSION = "$version$"
)
[String]$$PKG_VERSION = [Environment]::GetEnvironmentVariable("PKG_VERSION")
if ($$PKG_VERSION) {
	$$VERSION = "$$\{PKG_VERSION\}"
	Write-Output "Using '$$\{PKG_VERSION\}' for version value '$$\{VERSION\}'"
}

$$PACKAGE = "{{name}}"
$$GIT_GROUP = "{{git_org_or_person}}"
$$RELEASE = "https://github.com/$$\{GIT_GROUP\}/$$\{PACKAGE\}/releases/tag/v$$\{VERSION\}"
$$SYSTEM_TYPE = Get-ComputerInfo -Property CsSystemType
if ($$SYSTEM_TYPE.CsSystemType.Contains("ARM64")) {
    $$MACHINE = "arm64"
} else {
    $$MACHINE = "x86_64"
}


# FIGURE OUT Install directory
$$BIN_DIR = "$$\{Home\}\\bin"
Write-Output "$$\{PACKAGE\} v$$\{VERSION\} will be installed in $$\{BIN_DIR\}"

#
# Figure out what the zip file is named
#
$$ZIPFILE = "$$\{PACKAGE\}-v$$\{VERSION\}-Windows-$$\{MACHINE\}.zip"
Write-Output "Fetching Zipfile $$\{ZIPFILE\}"

#
# Check to see if this zip file has been downloaded.
#
$$DOWNLOAD_URL = "https://github.com/$$\{GIT_GROUP\}/$$\{PACKAGE\}/releases/download/v$$\{VERSION\}/$$\{ZIPFILE\}"
Write-Output "Download URL $$\{DOWNLOAD_URL\}"

if (!(Test-Path $$BIN_DIR)) {
  New-Item $$BIN_DIR -ItemType Directory | Out-Null
}
curl.exe -Lo "$$\{ZIPFILE\}" "$$\{DOWNLOAD_URL\}"
#if ([System.IO.File]::Exists($$ZIPFILE)) {
if (!(Test-Path $$ZIPFILE)) {
    Write-Output "Failed to download $$\{ZIPFILE\} from $$\{DOWNLOAD_URL\}"
} else {
    tar.exe xf "$$\{ZIPFILE\}" -C "$$\{Home\}"
    #Remove-Item $$ZIPFILE

    $$User = [System.EnvironmentVariableTarget]::User
    $$Path = [System.Environment]::GetEnvironmentVariable('Path', $$User)
    if (!(";$$\{Path\};".ToLower() -like "*;$$\{BIN_DIR\};*".ToLower())) {
        [System.Environment]::SetEnvironmentVariable('Path', "$$\{Path\};$$\{BIN_DIR\}", $$User)
        $$Env:Path += ";$$\{BIN_DIR\}"
    }
    Write-Output "$$\{PACKAGE\} was installed successfully to $$\{BIN_DIR\}"
}
`;

const readmeMdText = `

# {{name}}

{{{description}}}

{{#if releaseNotes}}
## Release Notes

- version: {{version}}
{{#if developmentStatus}}- status: {{developmentStatus}}{{/if}}
{{#if datePublished}}- released: {{datePublished}}{{/if}}

{{releaseNotes}}
{{/if}}

{{#if author}}

### Authors

{{#each author}}
- {{#if familyName}}{{familyName}}, {{givenName}}{{else}}{{name}}{{/if}}
{{/each}}
{{/if}}

{{#if contributor}}

### Contributors

{{#each contributor}}
- {{#if familyName}}{{familyName}}, {{givenName}}{{else}}{{name}}{{/if}}
{{/each}}
{{/if}}

{{#if maintainer}}

### Maintainers

{{#each maintainer}}
- {{#if familyName}}{{familyName}}, {{givenName}}{{else}}{{name}}{{/if}}
{{/each}}
{{/if}}

{{#if softwareRequirements}}
## Software Requirements

{{#each softwareRequirements}}
- {{.}}
{{/each}}
{{/if}}

{{#if runtimePlatform}}Uses: {{runtimePlatform}}{{/if}}

## Related resources

{{#if installUrl}}-[Install]({{installUrl}}){{/if}}
{{#if downloadUrl}}- [Download]({{downloadUrl}}){{/if}}
{{#if issueTracker}}- [Getting Help, Reporting bugs]({{issueTracker}}){{/if}}
{{#if license}}- [LICENSE]({{license}}){{/if}}
- [Installation](INSTALL.md)
- [About](about.md)

`;

const installMdText = `Installation for development of **{{name}}**
===========================================

**{{name}}** {{description}}

Quick install with curl or irm
------------------------------

There is an experimental installer.sh script that can be run with the following command to install latest table release. This may work for macOS, Linux and if you’re using Windows with the Unix subsystem. This would be run from your shell (e.g. Terminal on macOS).

~~~shell
curl https://{{git_org_or_person}}.github.io/{{name}}/installer.sh | sh
~~~

This will install the programs included in {{name}} in your `+"`$HOME/bin`"+` directory.

If you are running Windows 10 or 11 use the Powershell command below.

~~~ps1
irm https://{{git_org_or_person}}.github.io/{{mame}}/installer.ps1 | iex
~~~

Installing from source
----------------------

### Required software

{{#each softwareRequirements}}
- {{.}}
{{/each}}

### Steps

1. git clone https://github.com/{{git_org_or_person}}/{{name}}
2. Change directory into the `+"`"+`{{name}}`+"`"+` directory
3. Make to build, test and install

~~~shell
git clone https://github.com/{{git_org_or_person}}/{{name}}
cd {{name}}
make
make test
make install
~~~

`;