import * as path from "@std/path";
//import * as yaml from "@std/yaml";
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
        return "install.md";
      case "Makefile":
        return "Makefile";
      case "search.md":
        return "search.md";
      case "website.mak":
        return "website.mak";
      case "release.bash":
        return "release.bash"
      case "publish.bash":
        return "publish.bash";
    }
    switch (path.extname(filename)) {
      case ".cff":
        return "cff";
      case ".ts":
        return "ts";
      case ".js":
        return "js";
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
      case ".sh":
        return "sh";
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
  return [
    "cff",
    "ts",
    "js",
    "go",
    "py",
    "md",
    "hbs",
    "pdtmpl",
    "sh",
    "ps1",
    "readme.md",
    "install.md",
    "search.md",
    "website.mak",
    "Makefile",
    "release.bash",
    "publish.bash",
  ].indexOf(format) > -1;
}

// FIXME: need to handle the special case renderings for README.md,
// INSTALL.md and the installer scripts.

function getMakefileTemplate(lang: string, isDeno: boolean) : string | undefined {
  const prefix: {[key: string]: string} = {
    "golang": goMakefileText,
    "go": goMakefileText,
    "javascript": denoMakefileText,
    "typescript": denoMakefileText,
    "deno": denoMakefileText,
    //"python": pyMakefileText,
    //"bash": shMakefileText,
  }
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
  let obj: { [key: string]: any } = cm.toObject();
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

  switch (format) {
    case "readme.md":
      return renderTemplate(obj, readmeMdText);
    case "install.md":
      return renderTemplate(obj, installMdText);
    case "search.md":
      return renderTemplate(obj, searchMdText);
    case "Makefile":
      const makefileTemplate = getMakefileTemplate(lang, isDeno);
      if (makefileTemplate === undefined) {
        return undefined;
      }
      return renderTemplate(obj, makefileTemplate);
    case "website.mak":
      return renderTemplate(obj, websiteMakefileText);
    case "release.bash":
      return renderTemplate(obj, releaseBashText);
    case "publish.bash":
      return renderTemplate(obj, publishBashText);
    case "cff":
      return renderTemplate(obj, cffTemplateText);
    case "ts":
      return renderTemplate(obj, tsTemplateText);
    case "js":
      return renderTemplate(obj, jsTemplateText);
    case "go":
      return renderTemplate(obj, goTemplateText);
    case "py":
      return renderTemplate(obj, pyTemplateText);
    case "md":
      return renderTemplate(obj, mdTemplateText);
    case "sh":
      return renderTemplate(obj, shInstallerText);
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
  return undefined;
}

export function renderTemplate(
  obj: { [key: string]: any },
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

// TypeScript
const tsTemplateText = `// {{name}} version and license information.

export const version: string = '{{version}}',
releaseDate: string = '{{releaseDate}}',
releaseHash: string = '{{releaseHash}}'{{#if licenseText}},
licenseText: string = ` + "`" + `
{{{licenseText}}}
` + "`{{/if}};";

// JavaScript
const jsTemplateText = `// {{name}} version and license information.

export const version = '{{version}}',
releaseDate = '{{releaseDate}}',
releaseHash = '{{releaseHash}}'{{#if licenseText}},
licenseText = ` + "`" + `
{{{licenseText}}}
` + "`{{/if}};";

// Python
const pyTemplateText = `# {{name}} version and license information.

export const version = '{{version}}',
releaseDate = '{{releaseDate}}',
releaseHash = '{{releaseHash}}'{{#if licenseText}},
licenseText = '''
{{{licenseText}}}
'''{{/if}};
`;

// Go
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
{{{licenseText}}}
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

// Pandoc
const mdTemplateText = `---
{{#if name}}title: {{name}}{{/if}}
{{#if description}}abstract: "{{description}}"{{/if}}
{{#if author}}authors:
{{#each author}}
  - {{#if name}}name: {{name}}{{else}}family_name: {{familyName}}
    given_name: {{givenName}}{{/if}}{{#if id}}
    id: {{id}}{{/if}}
{{/each}}{{/if}}
{{#if contributor}}contributor:
{{#each contributor}}
  - {{#if name}}name: {{name}}{{else}}family_name: {{familyName}}
    given_name: {{givenName}}{{/if}}{{#if id}}
    id: {{id}}{{/if}}
{{/each}}{{/if}}
{{#if maintainer}}maintainer:
{{#each maintainer}}
  - {{#if name}}name: {{name}}{{else}}family_name: {{familyName}}
    given_name: {{givenName}}{{/if}}{{#if id}}
    id: {{id}}{{/if}}
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

{{#if releaseNotes}}{{releaseNotes}}{{/if}}

{{#if author}}
### Authors

{{#each author}}
- {{#if name}}{{ name }}{{else}}{{givenName}} {{familyName}}{{/if}}{{#if id}}, <{{id}}>{{/if}}
{{/each}}{{/if}}

{{#if contributor}}
### Contributors

{{#each contributor}}
- {{#if name}}{{ name }}{{else}}{{givenName}} {{familyName}}{{/if}}{{#if id}}, <{{id}}>{{/if}}
{{/each}}{{/if}}

{{#if maintainer}}
### Maintainers

{{#each maintainer}}
- {{#if name}}{{ name }}{{else}}{{givenName}} {{familyName}}{{/if}}{{#if id}}, <{{id}}>{{/if}}
{{/each}}{{/if}}

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

// HTML
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

// Bash
const shInstallerText = `#!/bin/sh

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

// Powershell
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

// Markdown
const readmeMdText = `

# {{name}} {{version}}

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

// Markdown
const searchMdText = `

# {{name}}

<link href="./pagefind/pagefind-ui.css" rel="stylesheet">
<script src="./pagefind/pagefind-ui.js" type="text/javascript"></script>
<div id="search"></div>
<script>
    const u = URL.parse(window.location.href);
    const basePath = u.pathname.replace(/search\.html$/g, '');
    
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ 
            element: "#search",
            baseUrl: basePath
        });
    });
</script>
`

// Markdown
const installMdText = `Installation for development of **{{name}}**
===========================================

**{{name}}** {{description}}

Quick install with curl or irm
------------------------------

There is an experimental installer.sh script that can be run with the following command to install latest table release. This may work for macOS, Linux and if you’re using Windows with the Unix subsystem. This would be run from your shell (e.g. Terminal on macOS).

~~~shell
curl https://{{git_org_or_person}}.github.io/{{name}}/installer.sh | sh
~~~

This will install the programs included in {{name}} in your ` + "`$HOME/bin`" +
  ` directory.

If you are running Windows 10 or 11 use the Powershell command below.

~~~ps1
irm https://{{git_org_or_person}}.github.io/{{name}}/installer.ps1 | iex
~~~

Installing from source
----------------------

### Required software

{{#each softwareRequirements}}
- {{.}}
{{/each}}

### Steps

1. git clone https://github.com/{{git_org_or_person}}/{{name}}
2. Change directory into the ` + "`" + `{{name}}` + "`" + ` directory
3. Make to build, test and install

~~~shell
git clone https://github.com/{{git_org_or_person}}/{{name}}
cd {{name}}
make
make test
make install
~~~

`;

// Makefile
export const denoMakefileText = `#
# Simple Makefile for Deno based Projects built under POSIX.
#
PROJECT = {{name}}

PACKAGE = {{name}}

PROGRAMS = <PROGRAM_LIST_GOES_HERE>

GIT_GROUP = {{git_org_or_person}}

VERSION = $(shell grep '"version":' codemeta.json | cut -d\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

PACKAGE = $(shell ls -1 *.ts | grep -v 'version.ts')

MAN_PAGES_1 = $(shell ls -1 *.1.md | sed -E 's/\.1.md/.1/g')

MAN_PAGES_3 = $(shell ls -1 *.3.md | sed -E 's/\.3.md/.3/g')

MAN_PAGES_7 = $(shell ls -1 *.7.md | sed -E 's/\.7.md/.7/g')

RELEASE_DATE=$(shell date +'%Y-%m-%d')

RELEASE_HASH=$(shell git log --pretty=format:%h -n 1)

HTML_PAGES = $(shell ls -1 *.html) # $(shell ls -1 *.md | grep -v 'nav.md' | sed -E 's/.md/.html/g')

DOCS = $(shell ls -1 *.?.md)

OS = $(shell uname)

EXT =
ifeq ($(OS), Windows)
	EXT = .exe
endif

PREFIX = $(HOME)

build: version.ts CITATION.cff about.md bin compile installer.sh installer.ps1

bin: .FORCE
	mkdir -p bin

compile: .FORCE
	deno task build

check: .FORCE
	deno task check

version.ts: codemeta.json
	deno task version.ts

format: $(shell ls -1 *.ts | grep -v version.ts | grep -v deps.ts)

$(shell ls -1 *.ts | grep -v version.ts): .FORCE
	deno fmt $@

man: $(MAN_PAGES_1) # $(MAN_PAGES_3) $(MAN_PAGES_7)

$(MAN_PAGES_1): .FORCE
	mkdir -p man/man1
	pandoc $@.md --from markdown --to man -s >man/man1/$@

CITATION.cff: codemeta.json
	deno task CITATION.cff

about.md: codemeta.json
	deno task about.md

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

website: $(HTML_PAGES) .FORCE
	make -f website.mak

#publish: website .FORCE
#	./publish.bash

htdocs: .FORCE
	deno task htdocs
	deno task transpile

test: .FORCE
	deno task test
	deno task editor_test.ts

install: build
	@echo "Installing programs in $(PREFIX)/bin"
	@for FNAME in $(PROGRAMS); do if [ -f "./bin/$\${FNAME}$(EXT)" ]; then mv -v "./bin/$\${FNAME}$(EXT)" "$(PREFIX)/bin/$\${FNAME}$(EXT)"; fi; done
	@echo ""
	@echo "Make sure $(PREFIX)/bin is in your PATH"
	@echo "Installing man page in $(PREFIX)/man"
	@mkdir -p $(PREFIX)/man/man1
	@for FNAME in $(MAN_PAGES_1); do if [ -f "./man/man1/$\${FNAME}" ]; then cp -v "./man/man1/$\${FNAME}" "$(PREFIX)/man/man1/$\${FNAME}"; fi; done
	@mkdir -p $(PREFIX)/man/man3
	@for FNAME in $(MAN_PAGES_3); do if [ -f "./man/man3/$\${FNAME}" ]; then cp -v "./man/man3/$\${FNAME}" "$(PREFIX)/man/man3/$\${FNAME}"; fi; done
	@mkdir -p $(PREFIX)/man/man7
	@for FNAME in $(MAN_PAGES_7); do if [ -f "./man/man7/$\${FNAME}" ]; then cp -v "./man/man7/$\${FNAME}" "$(PREFIX)/man/man7/$\${FNAME}"; fi; done
	@echo ""
	@echo "Make sure $(PREFIX)/man is in your MANPATH"

uninstall: .FORCE
	@echo "Removing programs in $(PREFIX)/bin"
	@for FNAME in $(PROGRAMS); do if [ -f "$(PREFIX)/bin/$\${FNAME}$(EXT)" ]; then rm -v "$(PREFIX)/bin/$\${FNAME}$(EXT)"; fi; done
	@echo "Removing man pages in $(PREFIX)/man"
	@for FNAME in $(MAN_PAGES_1); do if [ -f "$(PREFIX)/man/man1/$\${FNAME}" ]; then rm -v "$(PREFIX)/man/man1/$\${FNAME}"; fi; done
	@for FNAME in $(MAN_PAGES_3); do if [ -f "$(PREFIX)/man/man3/$\${FNAME}" ]; then rm -v "$(PREFIX)/man/man3/$\${FNAME}"; fi; done
	@for FNAME in $(MAN_PAGES_7); do if [ -f "$(PREFIX)/man/man7/$\${FNAME}" ]; then rm -v "$(PREFIX)/man/man7/$\${FNAME}"; fi; done

installer.sh: .FORCE
	cmt codemeta.json installer.sh
	chmod 775 installer.sh
	git add -f installer.sh

installer.ps1: .FORCE
	cmt codemeta.json installer.ps1
	chmod 775 installer.ps1
	git add -f installer.ps1

clean:
	if [ -d bin ]; then rm -fR bin/*; fi
	if [ -d dist ]; then rm -fR dist/*; fi

release: clean build man website distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64 dist/Windows-arm64
	echo "Ready to do ./release.bash"

setup_dist: .FORCE
	@rm -fR dist
	@mkdir -p dist

distribute_docs: website man setup_dist
	@cp README.md dist/
	@cp LICENSE dist/
	@cp codemeta.json dist/
	@cp CITATION.cff dist/
	@cp INSTALL.md dist/
	@cp -vR man dist/
	@for DNAME in $(DOCS); do cp -vR $$DNAME dist/; done

dist/Linux-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_linux_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/Linux-aarch64: .FORCE
	@mkdir -p dist/bin
	deno task dist_linux_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-aarch64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/macOS-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_macos_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/macOS-arm64: .FORCE
	@mkdir -p dist/bin
	deno task dist_macos_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/Windows-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/Windows-arm64: .FORCE
	@mkdir -p dist/bin
	#deno task dist_windows_aarch64 <-- switch to native when Rust/Deno supports Windows ARM64
	deno task dist_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

.FORCE:
`;

// Makefile
export const goMakefileText = `#
# Simple Makefile for Golang based Projects built under POSIX.
#
PROJECT = {{name}}

GIT_GROUP = {{git_org_or_person}}

PROGRAMS = <PROGRAM_LISTS_GOES_HERE>

RELEASE_DATE = $(shell date +%Y-%m-%d)

RELEASE_HASH=$(shell git log --pretty=format:'%h' -n 1)

MAN_PAGES_1 = $(shell ls -1 *.1.md | sed -E 's/\.1.md/.1/g')

MAN_PAGES_3 = $(shell ls -1 *.3.md | sed -E 's/\.3.md/.3/g')

MAN_PAGES_7 = $(shell ls -1 *.7.md | sed -E 's/\.7.md/.7/g')

HTML_PAGES = $(shell find . -type f | grep -E '\.html$')

DOCS = $(shell ls -1 *.?.md)

PACKAGE = $(shell ls -1 *.go)

VERSION = $(shell grep '"version":' codemeta.json | cut -d\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

OS = $(shell uname)

#PREFIX = /usr/local/bin
PREFIX = $(HOME)

ifneq ($(prefix),)
	PREFIX = $(prefix)
endif

EXT =
ifeq ($(OS), Windows)
	EXT = .exe
endif

build: version.go $(PROGRAMS) man CITATION.cff about.md installer.sh installer.ps1

version.go: .FORCE
	cmt codemeta.json version.go

hash: .FORCE
	git log --pretty=format:'%h' -n 1

man: $(MAN_PAGES_1) # $(MAN_PAGES_3) $(MAN_PAGES_7)

$(MAN_PAGES_1): .FORCE
	mkdir -p man/man1
	pandoc $@.md --from markdown --to man -s >man/man1/$@

$(MAN_PAGES_3): .FORCE
	mkdir -p man/man3
	pandoc $@.md --from markdown --to man -s >man/man3/$@

$(MAN_PAGES_7): .FORCE
	mkdir -p man/man7
	pandoc $@.md --from markdown --to man -s >man/man7/$@

$(PROGRAMS): $(PACKAGE)
	@mkdir -p bin
	go build -o "bin/$@$(EXT)" cmd/$@/*.go
	@./bin/$@ -help >$@.1.md

$(MAN_PAGES): .FORCE
	mkdir -p man/man1
	pandoc $@.md --from markdown --to man -s >man/man1/$@

CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

about.md: codemeta.json $(PROGRAMS)
	cmt codemeta.json about.md

installer.sh: .FORCE
	cmt codemeta.json installer.sh

installer.ps1: .FORCE
	cmt codemeta.json installer.ps1


test: $(PACKAGE)
	go test

website: clean-website .FORCE
	make -f website.mak

status:
	git status

save:
	@if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

refresh:
	git fetch origin
	git pull origin $(BRANCH)

#publish: build website .FORCE
#	./publish.bash

clean:
	@if [ -f version.go ]; then rm version.go; fi
	@if [ -d bin ]; then rm -fR bin; fi
	@if [ -d dist ]; then rm -fR dist; fi
	@if [ -d man ]; then rm -fR man; fi
	@if [ -d testout ]; then rm -fR testout; fi

clean-website:
	@for FNAME in $(HTML_PAGES); do if [ -f "$\${FNAME}" ]; then rm "$\${FNAME}"; fi; done

install: build
	@echo "Installing programs in $(PREFIX)/bin"
	@for FNAME in $(PROGRAMS); do if [ -f "./bin/$\${FNAME}$(EXT)" ]; then mv -v "./bin/$\${FNAME}$(EXT)" "$(PREFIX)/bin/$\${FNAME}$(EXT)"; fi; done
	@echo ""
	@echo "Make sure $(PREFIX)/bin is in your PATH"
	@echo "Installing man page in $(PREFIX)/man"
	@mkdir -p $(PREFIX)/man/man1
	@for FNAME in $(MAN_PAGES_1); do if [ -f "./man/man1/$\${FNAME}" ]; then cp -v "./man/man1/$\${FNAME}" "$(PREFIX)/man/man1/$\${FNAME}"; fi; done
	@mkdir -p $(PREFIX)/man/man3
	@for FNAME in $(MAN_PAGES_3); do if [ -f "./man/man3/$\${FNAME}" ]; then cp -v "./man/man3/$\${FNAME}" "$(PREFIX)/man/man3/$\${FNAME}"; fi; done
	@mkdir -p $(PREFIX)/man/man7
	@for FNAME in $(MAN_PAGES_7); do if [ -f "./man/man7/$\${FNAME}" ]; then cp -v "./man/man7/$\${FNAME}" "$(PREFIX)/man/man7/$\${FNAME}"; fi; done
	@echo ""
	@echo "Make sure $(PREFIX)/man is in your MANPATH"

uninstall: .FORCE
	@echo "Removing programs in $(PREFIX)/bin"
	@for FNAME in $(PROGRAMS); do if [ -f "$(PREFIX)/bin/$\${FNAME}$(EXT)" ]; then rm -v "$(PREFIX)/bin/$\${FNAME}$(EXT)"; fi; done
	@echo "Removing man pages in $(PREFIX)/man"
	@for FNAME in $(MAN_PAGES_1); do if [ -f "$(PREFIX)/man/man1/$\${FNAME}" ]; then rm -v "$(PREFIX)/man/man1/$\${FNAME}"; fi; done
	@for FNAME in $(MAN_PAGES_3); do if [ -f "$(PREFIX)/man/man3/$\${FNAME}" ]; then rm -v "$(PREFIX)/man/man3/$\${FNAME}"; fi; done
	@for FNAME in $(MAN_PAGES_7); do if [ -f "$(PREFIX)/man/man7/$\${FNAME}" ]; then rm -v "$(PREFIX)/man/man7/$\${FNAME}"; fi; done

setup_dist: .FORCE
	@mkdir -p dist
	@rm -fR dist/

dist/Linux-x86_64: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env  GOOS=linux GOARCH=amd64 go build -o "dist/bin/$\${FNAME}" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin

dist/Linux-aarch64: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env  GOOS=linux GOARCH=arm64 go build -o "dist/bin/$\${FNAME}" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-aarch64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin

dist/macOS-x86_64: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env GOOS=darwin GOARCH=amd64 go build -o "dist/bin/$\${FNAME}" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin


dist/macOS-arm64: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env GOOS=darwin GOARCH=arm64 go build -o "dist/bin/$\${FNAME}" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin


dist/Windows-x86_64: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env GOOS=windows GOARCH=amd64 go build -o "dist/bin/$\${FNAME}.exe" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin

dist/Windows-arm64: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env GOOS=windows GOARCH=arm64 go build -o "dist/bin/$\${FNAME}.exe" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin

# Raspberry Pi OS (32 bit) based on report from Raspberry Pi Model 3B+
dist/Linux-armv7l: $(PROGRAMS)
	@mkdir -p dist/bin
	@for FNAME in $(PROGRAMS); do env GOOS=linux GOARCH=arm GOARM=7 go build -o "dist/bin/$\${FNAME}" cmd/$\${FNAME}/*.go; done
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-armv7l.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/* $(DOCS)
	@rm -fR dist/bin

distribute_docs:
	@mkdir -p dist/
	@cp -v codemeta.json dist/
	@cp -v CITATION.cff dist/
	@cp -v README.md dist/
	@cp -v LICENSE dist/
	@cp -v INSTALL.md dist/
	@cp -vR man dist/
	@for DNAME in $(DOCS); do cp -vR $$DNAME dist/; done

release: build installer.sh save setup_dist distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64 dist/Windows-arm64 dist/Linux-armv7l


.FORCE:
`;

const websiteMakefileText = `#
# Makefile for running pandoc on all Markdown docs ending in .md
#
PROJECT = {{name}}

PANDOC = \$(shell which pandoc)

MD_PAGES = \$(shell ls -1 *.md | grep -v 'nav.md')

HTML_PAGES = \$(shell ls -1 *.md | grep -v 'nav.md' | sed -E 's/.md/.html/g')

build: \$(HTML_PAGES) \$(MD_PAGES) pagefind

\$(HTML_PAGES): \$(MD_PAGES) .FORCE
	if [ -f \$(PANDOC) ]; then \$(PANDOC) --metadata title=$(basename $@) -s --to html5 $(basename $@).md -o $(basename $@).html \\
		--lua-filter=links-to-html.lua \\
	    --template=page.tmpl; fi
	@if [ \$@ = "README.html" ]; then mv README.html index.html; fi

pagefind: .FORCE
	# NOTE: I am not including most of the archive in PageFind index since it doesn't make sense in this case.
	pagefind --verbose --glob="{*.html,docs/*.html}" --force-language en-US --exclude-selectors="nav,header,footer" --output-path ./pagefind --site .
	git add pagefind

clean:
	@rm *.html

.FORCE:
`

const publishBashText = `#!/bin/bash
#

#
# Publish script for {{name}} for GitHub pages. It expect the gh-pages
# branch to already exist.
#

WORKING_BRANCH=\$(git branch | grep -E "\\* " | cut -d \\  -f 2)
if [ "\${WORKING_BRANCH}" = "gh-pages" ]; then
	git commit -am "publishing to gh-pages branch"
	git push origin gh-pages
else
	echo "You're in \${WORKING_BRANCH} branch"
	echo "You need to pull in changes to the gh-pages branch to publish"
  # shellcheck disable=SC2162
	read -p "process Y/n " YES_NO
	if [ "\${YES_NO}" = "Y" ] || [ "\${YES_NO}" = "y" ]; then
		echo "Committing and pushing to \${WORKING_BRANCH}"
		git commit -am "commiting to \${WORKING_BRANCH}"
		git push origin "\${WORKING_BRANCH}"
		echo "Changing branchs from \${WORKING_BRANCH} to gh-pages"
		git checkout gh-pages
		echo "Merging changes from origin gh-pages"
		git pull origin gh-pages
		git commit -am "merging origin gh-pages"
		echo "Pulling changes from \${WORKING_BRANCH} info gh-pages"
		git pull origin "\${WORKING_BRANCH}"
		echo "Merging changes from \${WORKING_BRANCH}"
		git commit -am "merging \${WORKING_BRANCH} with gh-pages"
		echo "Pushing changes up and publishing"
		git push origin gh-pages
		echo "Changing back to your working branch \${WORKING_BRANCH}"
		git checkout "\${WORKING_BRANCH}"
	fi
fi
`

const releaseBashText = `#!/bin/bash

#
# Release script for {{name}} on GitHub using gh cli.
#
# shellcheck disable=SC2046
REPO_ID="\$(basename \$(pwd))"
# shellcheck disable=SC2046
GROUP_ID="\$(basename \$(dirname \$(pwd)))"
REPO_URL="https://github.com/\${GROUP_ID}/\${REPO_ID}"
echo "REPO_URL -> \${REPO_URL}"

#
# Generate a new draft release jq and gh
#
RELEASE_TAG="v$(jq -r .version codemeta.json)"
RELEASE_NOTES="$(jq -r .releaseNotes codemeta.json | tr '\\\`' "'" | tr '\\n' ' ')"
echo "tag: \${RELEASE_TAG}, notes:"
jq -r .releaseNotes codemeta.json >release_notes.tmp
cat release_notes.tmp

# Now we're ready to push things.
# shellcheck disable=SC2162
read -r -p "Push release to GitHub with gh? (y/N) " YES_NO
if [ "$YES_NO" = "y" ]; then
	make save msg="prep for \${RELEASE_TAG}, \${RELEASE_NOTES}"
	# Now generate a draft releas
	echo "Pushing release \${RELEASE_TAG} to GitHub"
	gh release create "\${RELEASE_TAG}" \\
 		--draft \\
		-F release_notes.tmp \\
		--generate-notes
	echo "Uploading distribution files"
    gh release upload "\${RELEASE_TAG}"	dist/*.zip 
	
	cat <<EOT

Now goto repo release and finalize draft.

	\${REPO_URL}/releases

EOT

fi
`
