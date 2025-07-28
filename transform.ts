import * as path from "@std/path";
//import * as yaml from "@std/yaml";
import Handlebars from "npm:handlebars";
import { CodeMeta } from "./codemeta.ts";
import { gitOrgOrPerson, gitReleaseHash } from "./gitcmds.ts";
//import { version, releaseDate, releaseHash } from "./version.ts";
import * as gText from "./generate_text.ts";

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
      case "INSTALL_NOTES_macOS.md":
        return "install_notes_macos.md";
      case "INSTALL_NOTES_WINDOWS.md":
        return "install_notes_windows.md";
      case "Makefile":
        return "Makefile";
      case "search.md":
        return "search.md";
      case "website.mak":
        return "website.mak";
      case "website.ps1":
        return "website.ps1";
      case "release.bash":
        return "release.bash";
      case "release.ps1":
        return "release.ps1";
      case "publish.bash":
        return "publish.bash";
      case "publish.ps1":
        return "publish.ps1";
      case "links-to-html.lua":
        return "links-to-html.lua";
      case "deno-tasks.json":
        return "deno-tasks.json";
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
    "install_notes_macos.md",
    "install_notes_windows.md",
    "search.md",
    "website.mak",
    "website.ps1",
    "Makefile",
    "release.bash",
    "release.ps1",
    "publish.bash",
    "publish.ps1",
    "links-to-html.lua",
    "deno-tasks.json",
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

  let makefileTemplate: string | undefined = "";
  switch (format) {
    case "readme.md":
      return renderTemplate(obj, readmeMdText);
    case "install.md":
      return renderTemplate(obj, installMdText);
    case "install_notes_macos.md":
      return renderTemplate(obj, installNotesMacOSMdText);
    case "install_notes_windows.md":
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
const cffTemplateText = gText.cffTemplateText;

// TypeScript
const tsTemplateText = gText.tsTemplateText;

// JavaScript
const jsTemplateText = gText.jsTemplateText;

// Python
const pyTemplateText = gText.pyTemplateText;

// Go
const goTemplateText = gText.goTemplateText;

// Pandoc
const mdTemplateText = gText.mdTemplateText;

// HTML
const hbsTemplateText = gText.hbsTemplateText;

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
export const denoMakefileText = gText.denoMakefileText;

// links-to-html.lua
const linksToHtmlLuaText = gText.linksToHtmlLuaText;

// deno-tasks
const denoTasksText = gText.denoTasksText;

// Makefile
export const goMakefileText = `
# generated with CMTools {{version}} {{releaseHash}}

#
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

VERSION = $(shell grep '"version":' codemeta.json | cut -d\\"  -f 4)

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
  @cp -v INSTALL_NOTES_*.md dist/
	@cp -vR man dist/
	@for DNAME in $(DOCS); do cp -vR $$DNAME dist/; done

release: build installer.sh save setup_dist distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64 dist/Windows-arm64 dist/Linux-armv7l


.FORCE:
`;

const websiteMakefileText = `
# generated with CMTools {{version}} {{releaseHash}}

#
# Makefile for running pandoc on all Markdown docs ending in .md
#
PROJECT = {{name}}

PANDOC = \$(shell which pandoc)

MD_PAGES = \$(shell ls -1 *.md)

HTML_PAGES = \$(shell ls -1 *.md | sed -E 's/\.md/\.html/g')

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
`;

const websitePs1Text = `<#
generated with CMTools {{version}} {{releaseHash}}

.SYNOPSIS
PowerShell script for running pandoc on all Markdown docs ending in .md
#>
$project = "CMTools"
Write-Output "Building website for $\{project\}"
$pandoc = Get-Command pandoc | Select-Object -ExpandProperty Source

# Get all markdown files except 'nav.md'
$mdPages = Get-ChildItem -Filter *.md | Where-Object { $_.Name -ne "nav.md" }

# Generate HTML page names from markdown files
$htmlPages = $mdPages | ForEach-Object { [System.IO.Path]::ChangeExtension($_.Name, ".html") }

function Build-HtmlPage {
    param($htmlPages, $mdPages)

    foreach ($htmlPage in $htmlPages) {
        $mdPage = [System.IO.Path]::ChangeExtension($htmlPage, ".md")
        if (Test-Path $pandoc) {
            & $pandoc "--metadata" "title=$($htmlPage.Replace('.html', ''))" "-s" "--to" "html5" $mdPage "-o" $htmlPage \`
                "--lua-filter=links-to-html.lua" \`
                "--template=page.tmpl"
        }

        if ($htmlPage -eq "README.html") {
            Move-Item -Path "README.html" -Destination "index.html" -Force
        }
    }
}

function Invoke-PageFind {
    # Run PageFind
    pagefind --verbose --glob="{*.html,docs/*.html}" --force-language en-US --exclude-selectors="nav,header,footer" --output-path ./pagefind --site .
    git add pagefind
}

# Build HTML page
Build-HtmlPage -htmlPages $htmlPages -mdPages $mdPages

# Invoke PageFind
Invoke-PageFind

`;

const publishBashText = `#!/bin/bash
# generated with CMTools {{version}} {{releaseHash}}
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
`;

const publishPs1Text = `<#
generated with CMTools {{version}} {{releaseHash}}

.SYNOPSIS
Publish script for GitHub pages. It expects the gh-pages branch to already exist.
#>

$workingBranch = git branch | Select-String -Pattern "\\* " | ForEach-Object { $_ -replace '\\* ', '' }
if ($workingBranch -eq "gh-pages") {
    git commit -am "publishing to gh-pages branch"
    git push origin gh-pages
} else {
    Write-Output "You're in $workingBranch branch"
    Write-Output "You need to pull in changes to the gh-pages branch to publish"
    $yesNo = Read-Host "Process Y/n"
    if ($yesNo -eq "Y" -or $yesNo -eq "y") {
        Write-Output "Committing and pushing to $workingBranch"
        git commit -am "committing to $workingBranch"
        git push origin $workingBranch
        Write-Output "Changing branches from $workingBranch to gh-pages"
        git checkout gh-pages
        Write-Output "Merging changes from origin gh-pages"
        git pull origin gh-pages
        git commit -am "merging origin gh-pages"
        Write-Output "Pulling changes from $workingBranch into gh-pages"
        git pull origin $workingBranch
        Write-Output "Merging changes from $workingBranch"
        git commit -am "merging $workingBranch with gh-pages"
        Write-Output "Pushing changes up and publishing"
        git push origin gh-pages
        Write-Output "Changing back to your working branch $workingBranch"
        git checkout $workingBranch
    }
}
`;

const releaseBashText = `#!/bin/bash
# generated with CMTools {{version}} {{releaseHash}}

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
	# Now generate a draft release
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
    rm release_notes.tmp

fi
`;

const releasePs1Text = `<#
generated with CMTools {{version}} {{releaseHash}}

.SYNOPSIS
Release script for {{name}} on GitHub using gh CLI.
#>

# Determine repository and group IDs
$repoId = Split-Path -Leaf -Path (Get-Location)
$groupId = Split-Path -Leaf -Path (Split-Path -Parent -Path (Get-Location))
$repoUrl = "https://github.com/$groupId/$repoId"
Write-Output "REPO_URL -> $repoUrl"

# Generate a new draft release using jq and gh
$releaseTag = "v$(jq -r .version codemeta.json)"
$releaseNotes = jq -r .releaseNotes codemeta.json | ForEach-Object { $_ -replace "\`n", " " -replace "\`'", "'" }
Write-Output "tag: $releaseTag, notes:"
jq -r .releaseNotes codemeta.json | Out-File -FilePath release_notes.tmp -Encoding utf8
Get-Content release_notes.tmp

# Prompt user to push release to GitHub
$yesNo = Read-Host -Prompt "Push release to GitHub with gh? (y/N)"
if ($yesNo -eq "y") {
    # Assuming 'make save' is a placeholder for a command you have
    # Replace 'make save' with the appropriate PowerShell command or function
    Write-Output "Preparing for $releaseTag, $releaseNotes"
    # Create a draft release
    Write-Output "Pushing release $releaseTag to GitHub"
    gh release create "$releaseTag" \`
        --draft \`
        --notes-file release_notes.tmp \`
        --generate-notes
    Write-Output "Uploading distribution files"
    gh release upload "$releaseTag" dist/*.zip

    @"
Now go to repo release and finalize draft.

    $repoUrl/releases

"@

    Remove-Item release_notes.tmp
}
`;
