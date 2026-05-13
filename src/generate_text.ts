// siteCssText
export const siteCssText = `
/**
 * site.css - stylesheet for the Caltech Library's Digital Library Development Group's sandbox.
 *
 * orange: #FF6E1E;
 *
 * Secondary pallet:
 *
 * lightgrey: #C8C8C8
 * grey: #76777B
 * darkgrey: #616265
 * slategrey: #AAA99F
 *
 * Impact Pallete see: http://identity.caltech.edu/web/colors
 *
 * TODO: Need to make a small screen friendly version
 *
 *
 * ============================================
 * Customization & Theming Notes
 * ============================================
 *
 * This stylesheet uses CSS custom properties (variables)
 * to allow optional theming and customization.
 *
 * Default values are defined in the :root selector below.
 * These defaults will be used automatically if no overrides
 * are provided.
 *
 * To customize styles, create a separate CSS file and define
 * your own :root variables there. Then include that file
 * AFTER this stylesheet in your HTML.
 *
 * Example:
 *
 *   <link rel="stylesheet" href="site.css">
 *   <link rel="stylesheet" href="custom.css">
 *
 * In custom.css:
 *
 *   :root {
 *     --color-primary: #0055cc;
 *     --color-nav-bg: black;
 *   }
 *
 * Only override the variables you need—everything else will
 * fall back to the defaults defined here.
 *
 * This approach allows:
 *   - Zero configuration for most users
 *   - Simple overrides for advanced users
 *   - Safe fallback values if variables are missing
 *
 * Note: CSS applies the "cascade" rule, meaning later files
 * override earlier ones when selectors have equal specificity.
 */

/* Base values */
:root {
  /* Primary */
  --color-primary: #FF6E1E;

  /* Secondary palette */
  --color-lightgrey: #C8C8C8;
  --color-grey: #76777B;
  --color-darkgrey: #616265;
  --color-slategrey: #AAA99F;

  /* Base */
  --color-text: black;
  --color-bg: white;
  --color-link: #747267;
  --color-nav-bg: #333333;
  --color-footer-bg: #303030;
  --color-border: red;

  --font-family-base: Open Sans, Helvetica, Sans-Serif;
  --font-size-base: 14px;

  /* special cases */
  --color-announcement: white;
  --color-bg-announcement: orange;
}

body {
     margin: 0;
     border: 0;
     padding: 0;
     width: 100%;
     height: 100%;
     color: var(--color-text, black);
     background-color: var(--color-bg, white);
     font-family: var(--font-family-base, Open Sans, Helvetica, Sans-Serif);
     font-size: var(--font-size-base, 14px);
}

header {
     position: relative;
     display: block;
     color: var(--color-bg, white);
     background-color: var(--color-bg, white);
     z-index: 2;
     height: 105px;
     vertical-align: middle;
}

header img {
     position: relative;
     display: inline;
     padding-left: 20px;
     margin: 0;
     height: 42px;
     padding-top: 32px;
}

header h1 {
     position: relative;
     display: inline-block;
     margin: 0;
     border: 0;
     padding: 0;
     font-size: 3em;
     font-weight: normal;
     vertical-align: 0.78em;
     color: var(--color-primary, #FF6E1E);
}

header a, header a:link, header a:visited, header a:active, header a:hover, header a:focus {
    color: var(--color-primary, #FF6E1E);
    background-color: inherit;
}

a, a:link, a:visited {
    color: var(--color-link, #747267);
    background-color: inherit;
    text-decoration: none;
}

a:active, a:hover, a:focus {
  color: var(--color-primary, #FF6E1E);
  font-weight: bolder;
}

nav {
     position: relative;
     display: block;
     width: 100%;
     margin: 0;
     padding: 0;
     font-size: 0.78em;
     vertical-align: middle;
     color: var(--color-text, black);
     background-color: var(--color-nav-bg, #333333);
     text-align: left;
}

nav div {
     display: inline-block;
     /* padding-left: 10em; */
     margin-left: 10em;
     margin-right: 0;
}

nav a, nav a:link, nav a:visited, nav a:active {
    color: var(--color-bg, white);
    background-color: inherit;
    text-decoration: none;
}

nav a:hover, nav a:focus {
    color: var(--color-primary, #FF6E1E);
    background-color: inherit;
    text-decoration: none;
}

nav div h2 {
     position: relative;
     display: block;
     min-width: 20%;
     margin: 0;
     font-size: 1.24em;
     font-style: normal;
}

nav div > ul {
     display: none;
     padding-left: 0.24em;
     text-align: left;
}

nav ul {
     display: inline-block;
     padding-left: 0.24em;
     list-style-type: none;
     text-align: left;
     text-decoration: none;
}

nav ul li {
     display: inline;
     padding: 1em;
}

section {
     position: relative;
     display: inline-block;
     width: auto;
     max-width: 98%;
     height: 100%;
     color: var(--color-text, black);
     background-color: var(--color-bg, white);
     margin: 0;
     padding-top: 2em;
     padding-bottom: 2em;
     padding-left: 1em;
     padding-right: 2em;
}

section > menu {
	display: flex;
	list-style: none;
	padding: 0;
	margin: 0;
}

section > menu > li {
	flex-grow: 1;
}

section h1 {
    font-size: 1.32em;
}

section h2 {
    font-size: 1.12em;
    font-style: italic;
}

section h3 {
    font-size: 1em;
    /* text-transform: uppercase; */
}

section ul {
    list-style-type: disc;
}


section a, section a:link, section a:visited, section a:active {
    font-style: italic;
    font-weight: normal;
    text-decoration: underline;
}

section a:hover, section a:focus {
    color: var(--color-primary, #FF6E1E);
    text-decoration: none;
}

/*
 * We want the links in the output of the Builder widget to pop out
 * as links.
 */
section.widget a, section.widget a:link, section.widget a:visited, section.widget a:active {
    color: var(--color-widget-link, blue);
}

aside {
     margin: 0;
     border: 0;
     padding-left: 1em;
     position: relative;
     display: inline-block;
     text-align: right;
}

aside h2 {
     font-size: 1em;
     text-transform: uppercase;
}

aside h2 > a {
     font-style: normal;
}

aside ul {
     margin: 0;
     padding: 0;
     display: block;
     list-style-type: none;
}

aside ul li {
     font-size: 0.82em;
}

aside ul > ul {
     padding-left: 1em;
     font-size: 0.72em;
}

footer {
     position: fixed;
     bottom: 0;
     display: block;
     width: 100%;
     height: 2em;
     color: var(--color-bg, white);
     background-color: var(--color-footer-bg, #303030);
     font-size: 80%;
     text-align: left;
     vertical-align: middle;
     z-index: 2;
}

footer h1, footer span, footer address {
     position: relative;
     display: inline-block;
     margin: 0;
     padding-left: 0.24em;
     font-family: var(--font-family-base, Open Sans, Helvetica, Sans-Serif);
     font-size: 1m;
}

footer h1 {
     font-weight: normal;
}

footer a, footer a:link, footer a:visited, footer a:active, footer a:focus, footer a:hover {
     padding: 0;
     display: inline;
     margin: 0;
     color: var(--color-primary, #FF6E1E);
     text-decoration: none;
}

/* Form styling */
/*
form {
    display: block;
    padding: 1em;
    border-style: solid;
    border-radius: 0.82em;
    border-width: 0.18em;
    border-color: red;
}
*/

form div label {
    display: inline;
    margin: 0.72em;
    text-align: right;
    min-width: 5em;
}

form div input[type=button] {
    margin: 1em;
    border-radius: 82em;
}

/* Widget is the outer container for either a
 * BuilderWidget or SearchWidger */
.widget {
    display: block;
    flex-flow: row wrap;
    padding: 1em;
    border-style: solid;
    border-radius: 0.82em;
    border-width: 0.18em;
    border-color: var(--border-color, red);
}

.announcement {
    color: var(--color-announcement, white);
    background-color: var(--color-bg-announcement, orange);
    padding: 1em;
    margin-top: 2em;
    margin-bottom: 2em;
    margin-left: 0em;
    margin-right: 0em;
    text-overflow: ellipsis;
    border: 1px solid black;
}

/*
.article-result, .publication-result, .book_section-result {
    margin-bottom: 1.24em;
}
*/


/*
 * Search box and results layout
 */
.search-box {
    display: block;
}

.search-box div {
    display: block;
}

.search-box div label {
    vertical-align: top;
}

.search-go-button {
    display: block;
}

.search-go-button input {
    text-align: center;
    margin: 0.24em;
}

.search-result-pager {
    padding-top: 1.24em;
    padding-bottom: 1.24em;
}

.search-results {
    margin-top:0;
    margin-bottom:0;
    margin-left: 0;
    margin-right: 1.24em;
    padding: 0;
}
.search-result {
    padding-top: 0.24em;
    padding-bottom: 1.24em;
}

.search-result:nth-child(odd) {
    background-color: var(--color-lightgrey, lightgrey);
}

.field-name, .matched-name, .index-name {
    display: inline-block;
    width: 6%;
    margin-right: 1.24em;
    text-transform: lowercase;
    text-align: right;
    vertical-align: top;
}

.field-value, .matched-value, .index-value {
    display: inline-block;
    text-align: left;
    vertical-align: top;
}

.index-name, .index-value {
    font-style: italic;
    font-size: smaller;
}

a.visually-hidden:focus {
    position: static;
    display: block;
    width: 9rem;
    height: 1rem;
    margin: 5px;
    overflow: visible;
    clip: auto;
    white-space: normal;
    padding: 0.5rem 1rem;
    border: 2px solid var(--color-text, while);
    border-radius: 4px;
    background-color: var(--color-bg, while);
}

a.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
`;

// CITATION.cff
export const citationCffText = `
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
type: software
{{#if name}}title: {{{name}}}{{/if}}
{{#if description}}abstract: "{{{description}}}"{{/if}}
{{#if author}}authors:
{{#each author}}
  - family-names: {{{familyName}}}
    given-names: {{{givenName}}}{{#if id}}
    orcid: {{{id}}}{{/if}}{{#if email}}
    email: {{{email}}}{{/if}}
{{/each}}{{/if}}
{{#if maintainer}}contacts:
{{#each maintainer}}
  - family-names: {{{familyName}}}
    given-names: {{{givenName}}}{{#if id}}
    orcid: {{{id}}}{{/if}}{{#if email}}
    email: {{{email}}}{{/if}}
{{/each}}{{/if}}
{{#if codeRepository}}repository-code: "{{{codeRepository}}}"{{/if}}
{{#if version}}version: {{{version}}}{{/if}}
{{#if datePublished}}date-released: {{{datePublished}}}{{/if}}
{{#if identifier}}doi: {{{identifier}}}{{/if}}
{{#if license}}license-url: "{{{license}}}"{{/if}}{{#if keywords}}
keywords:
{{#each keywords}}
  - {{{.}}}
{{/each}}{{/if}}
`;

// TypeScript
export const versionTsText = `// {{{name}}} version and license information.

export const version: string = '{{{version}}}',
releaseDate: string = '{{{releaseDate}}}',
releaseHash: string = '{{{releaseHash}}}'{{#if licenseText}},
licenseText: string = ` + "`" + `
{{{licenseText}}}
` + "`{{/if}};";

// JavaScript
export const versionJsText = `// {{{name}}} version and license information.

export const version = '{{{version}}}',
releaseDate = '{{{releaseDate}}}',
releaseHash = '{{{releaseHash}}}'{{#if licenseText}},
licenseText = ` + "`" + `
{{{licenseText}}}
` + "`{{/if}};";

// Python
export const versionPyText = `# {{{name}}} version and license information.

version = '{{{version}}}'
releaseDate = '{{{releaseDate}}}'
releaseHash = '{{{releaseHash}}}'{{#if licenseText}}
licenseText = '''
{{{licenseText}}}
'''{{/if}};
`;

// Go
export const versionGoText = `package {{{name}}}

import (
	"strings"
)

const (
    // Version number of release
    Version = "{{{version}}}"

    // ReleaseDate, the date version.go was generated
    ReleaseDate = "{{{releaseDate}}}"

    // ReleaseHash, the Git hash when version.go was generated
    ReleaseHash = "{{{releaseHash}}}"
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
export const aboutMdText = `---
{{#if name}}title: {{{name}}}{{/if}}
{{#if description}}abstract: "{{{description}}}"{{/if}}
{{#if author}}authors:
{{#each author}}
  - {{#if name}}name: {{{name}}}{{else}}family_name: {{{familyName}}}
    given_name: {{{givenName}}}{{/if}}{{#if id}}
    id: {{{id}}}{{/if}}
{{/each}}{{/if}}
{{#if contributor}}contributor:
{{#each contributor}}
  - {{#if name}}name: {{{name}}}{{else}}family_name: {{{familyName}}}
    given_name: {{{givenName}}}{{/if}}{{#if id}}
    id: {{{id}}}{{/if}}
{{/each}}{{/if}}
{{#if maintainer}}maintainer:
{{#each maintainer}}
  - {{#if name}}name: {{{name}}}{{else}}family_name: {{{familyName}}}
    given_name: {{{givenName}}}{{/if}}{{#if id}}
    id: {{{id}}}{{/if}}
{{/each}}{{/if}}
{{#if codeRepository}}repository_code: {{{codeRepository}}}{{/if}}
{{#if version}}version: {{{version}}}{{/if}}
{{#if license}}license_url: {{{license}}}{{/if}}
{{#if operatingSystem}}operating_system:
{{#each operatingSystem}}
  - {{{.}}}
{{/each}}{{/if}}
{{#if programmingLanguage}}programming_language:
{{#each programmingLanguage}}
  - {{{.}}}
{{/each}}{{/if}}
{{#if keywords}}keywords:
{{#each keywords}}
  - {{{.}}}
{{/each}}{{/if}}
{{#if datePublished}}date_released: {{{datePublished}}}{{/if}}
---

About this software
===================

## {{{name}}} {{{version}}}

{{#if releaseNotes}}{{{releaseNotes}}}{{/if}}

{{#if author}}
## Authors

{{#each author}}
- {{#if id}}[{{#if name}}{{{ name }}}{{else}}{{{givenName}}} {{{familyName}}}{{/if}}]({{{id}}}){{else}}{{#if name}}{{{ name }}}{{else}}{{{givenName}}} {{{familyName}}}{{/if}}{{/if}}
{{/each}}{{/if}}

{{#if contributor}}
## Contributors

{{#each contributor}}
- {{#if id}}[{{#if name}}{{{ name }}}{{else}}{{{givenName}}} {{{familyName}}}{{/if}}]({{{id}}}){{else}}{{#if name}}{{{ name }}}{{else}}{{{givenName}}} {{{familyName}}}{{/if}}{{/if}}
{{/each}}{{/if}}

{{#if maintainer}}
## Maintainers

{{#each maintainer}}
- {{#if id}}[{{#if name}}{{{ name }}}{{else}}{{{givenName}}} {{{familyName}}}{{/if}}]({{{id}}}){{else}}{{#if name}}{{{ name }}}{{else}}{{{givenName}}} {{{familyName}}}{{/if}}{{/if}}
{{/each}}{{/if}}

{{#if description}}{{{description}}}{{/if}}

{{#if license}}- [License]({{{license}}}){{/if}}
{{#if codeRepository}}- [Code Repository]({{{codeRepository}}}){{/if}}
{{#if issueTracker}}  - [Issue Tracker]({{{issueTracker}}}){{/if}}

{{#if programmingLanguage}}
## Programming languages

{{#each programmingLanguage}}
- {{{.}}}
{{/each}}{{/if}}

{{#if operatingSystem}}
## Operating Systems

{{#each operatingSystem}}
- {{{.}}}
{{/each}}{{/if}}

{{#if softwareRequirements}}
## Software Requirements

{{#each softwareRequirements}}
- {{{.}}}
{{/each}}{{/if}}

{{#if softwareSuggestions}}
## Software Suggestions

{{#each softwareSuggestions}}
- {{{.}}}
{{/each}}{{/if}}

`;

// HTML
export const pageHbsText = `<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>{{project_name}}</title>
    <link rel="stylesheet" href="/css/site.css">
</head>
<body>
<a href="#main-content" class="visually-hidden">skip to main content</a>
<nav>
<ul>
    <li><a href="/">All Library Apps</a></li>
    <li><a href="index.html">Home</a></li>
    <li><a href="LICENSE">LICENSE</a></li>
    <li><a href="INSTALL.html">INSTALL</a></li>
    <li><a href="user_manual.html">User Manual</a></li>
    <li><a href="about.html">About</a></li>
    <!-- <li><a href="search.html">Search</a></li> -->
{{#if repositoryLink}}    <li><a href="{{repositoryLink}}">Code Repository</a></li>{{/if}}
</ul>
</nav>
<section id="main-content">
$$content$$
</section>
</body>
</html>`;

// HTML
export const clPageHbsText = `<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>{{project_name}}</title>
    <link rel="stylesheet" href="https://caltechlibrary.github.io/css/site.css">
    <link rel="stylesheet" href="https://media.library.caltech.edu/cl-webcomponents/css/code-blocks.css">
    <script type="module" src="https://media.library.caltech.edu/cl-webcomponents/copyToClipboard.js"></script>
    <script type="module" src="https://media.library.caltech.edu/cl-webcomponents/footer-global.js"></script>
</head>
<body>
<header>
<a href="https://library.caltech.edu"><img src="https://media.library.caltech.edu/assets/caltechlibrary-logo.png" alt="Caltech Library logo"></a>
</header>
<a href="#main-content" class="visually-hidden">skip to main content</a>
<nav>
<ul>
    <li><a href="/">All Library Apps</a></li>
    <li><a href="index.html">Home</a></li>
    <li><a href="LICENSE">LICENSE</a></li>
    <li><a href="INSTALL.html">INSTALL</a></li>
    <li><a href="user_manual.html">User Manual</a></li>
    <li><a href="about.html">About</a></li>
    <!-- <li><a href="search.html">Search</a></li> -->
{{#if repositoryLink}}    <li><a href="{{repositoryLink}}">Code Repository</a></li>{{/if}}
</ul>
</nav>
<section id="main-content">
$$content$$
</section>
<footer-global></footer-global>
</body>
</html>`;

// Bash
export const installerShText = `#!/bin/sh
# generated with CMTools {{{version}}} {{{releaseHash}}}

#
# Set the package name and version to install
#
PACKAGE="{{{name}}}"
VERSION="{{{version}}}"
GIT_GROUP="{{{git_org_or_person}}}"
RELEASE="https://github.com/$GIT_GROUP/$PACKAGE/releases/tag/v$VERSION"
if [ "$PKG_VERSION" != "" ]; then
   VERSION="$\{PKG_VERSION\}"
   echo "$\{PKG_VERSION\} used for version v$\{VERSION\}"
fi

#
# Get the name of this script.
#
INSTALLER="$(basename "$0")"

#
# Figure out what the zip file is named
#
OS_NAME="$(uname)"
MACHINE="$(uname -m)"
case "$OS_NAME" in
   Darwin)
   OS_NAME="macOS"
   ;;
   GNU/Linux)
   OS_NAME="Linux"
   ;;
esac

if [ "$1" != "" ]; then
   VERSION="$1"
   echo "Version set to v$\{VERSION\}"
fi

ZIPFILE="$PACKAGE-v$VERSION-$OS_NAME-$MACHINE.zip"
CHECKSUM_FILE="$PACKAGE-v$VERSION-checksums.txt"

#
# Check to see if this zip file has been downloaded.
#
mkdir -p "$HOME/Downloads"
DOWNLOAD_URL="https://github.com/$GIT_GROUP/$PACKAGE/releases/download/v$VERSION/$ZIPFILE"
if ! curl -L -o "$HOME/Downloads/$ZIPFILE" "$DOWNLOAD_URL"; then
	echo "Curl failed to get $DOWNLOAD_URL"
fi
cat<<EOT

  Retrieved $DOWNLOAD_URL
  Saved as $HOME/Downloads/$ZIPFILE

EOT

if [ ! -f "$HOME/Downloads/$ZIPFILE" ]; then
	cat<<EOT

  To install $PACKAGE you need to download

    $ZIPFILE

  from

    $RELEASE

  You can do that with your web browser. After
  that you should be able to re-run $INSTALLER

EOT
	exit 1
fi

#
# Verify checksum if tools are available
#
CHECKSUM_URL="https://github.com/$GIT_GROUP/$PACKAGE/releases/download/v$VERSION/$CHECKSUM_FILE"
if command -v sha256sum >/dev/null 2>&1 || command -v shasum >/dev/null 2>&1; then
    if curl -L -s -o "$HOME/Downloads/$CHECKSUM_FILE" "$CHECKSUM_URL"; then
        EXPECTED=$(grep "$ZIPFILE" "$HOME/Downloads/$CHECKSUM_FILE" | awk '{print $1}')
        if command -v sha256sum >/dev/null 2>&1; then
            ACTUAL=$(sha256sum "$HOME/Downloads/$ZIPFILE" | awk '{print $1}')
        else
            ACTUAL=$(shasum -a 256 "$HOME/Downloads/$ZIPFILE" | awk '{print $1}')
        fi
        if [ -n "$EXPECTED" ] && [ "$EXPECTED" = "$ACTUAL" ]; then
            echo "Checksum verified: $ZIPFILE"
        elif [ -z "$EXPECTED" ]; then
            echo "WARNING: $ZIPFILE not found in checksum file, skipping verification"
        else
            echo "WARNING: Checksum mismatch for $ZIPFILE"
            echo "  Expected: $EXPECTED"
            echo "  Actual:   $ACTUAL"
            echo "  Proceeding anyway — verify the download manually if concerned"
        fi
    else
        echo "WARNING: Could not download $CHECKSUM_FILE, skipping verification"
    fi
fi

START="$(pwd)"
mkdir -p "$HOME/.$PACKAGE/installer"
cd "$HOME/.$PACKAGE/installer" || exit 1
unzip "$HOME/Downloads/$ZIPFILE" "bin/*" "man/*"

#
# Copy the application into place
#
mkdir -p "$HOME/bin"
EXPLAIN_OS_POLICY="no"
find bin -type f >.binfiles.tmp
while read -r APP; do
	V=$("./$APP" --version)
	if [ "$V" = ""  ]; then
		EXPLAIN_OS_POLICY="yes"
	fi
	mv "$APP" "$HOME/bin/"
done <.binfiles.tmp
rm .binfiles.tmp

#
# Make sure $HOME/bin is in the path
#
case :$PATH: in
	*:$HOME/bin:*)
	;;
	*)
	# shellcheck disable=SC2016
	echo 'export PATH="$HOME/bin:$PATH"' >>"$HOME/.bashrc"
	# shellcheck disable=SC2016
	echo 'export PATH="$HOME/bin:$PATH"' >>"$HOME/.zshrc"
    ;;
esac

# shellcheck disable=SC2031
if [ "$EXPLAIN_OS_POLICY" = "yes" ]; then
	cat <<EOT

  You need to take additional steps to complete installation.

  Your operating system security policies needs to "allow"
  running programs from $PACKAGE.

  Example: on macOS you can type open the programs in finder.

      open $HOME/bin

  Find the program(s) and right click on the program(s)
  installed to enable them to run.

  More information about security policies see INSTALL_NOTES_macOS.md

EOT

fi

#
# Copy the manual pages into place
#
EXPLAIN_MAN_PATH="no"
for SECTION in 1 2 3 4 5 6 7; do
    if [ -d "man/man$\{SECTION\}" ]; then
        EXPLAIN_MAN_PATH="yes"
        mkdir -p "$HOME/man/man$\{SECTION\}"
        find "man/man$\{SECTION\}" -type f | while read -r MAN; do
            cp -v "$MAN" "$HOME/man/man$\{SECTION\}/"
        done
    fi
done

if [ "$EXPLAIN_MAN_PATH" = "yes" ]; then
  cat <<EOT
  The man pages have been installed at '$HOME/man'. You
  need to have that location in your MANPATH for man to
  find the pages. E.g. For the Bash shell add the
  following to your following to your '$HOME/.bashrc' file.

      export MANPATH="$HOME/man:$MANPATH"

EOT

fi

rm -fR "$HOME/.$PACKAGE/installer"
cd "$START" || exit 1

`;

// Powershell
export const installerPs1Text = `#!/usr/bin/env pwsh
# generated with CMTools {{{version}}} {{{releaseHash}}}

#
# Set the package name and version to install
#
param(
  [Parameter()]
  [String]$VERSION = "{{{version}}}"
)
[String]$PKG_VERSION = [Environment]::GetEnvironmentVariable("PKG_VERSION")
if ($PKG_VERSION) {
	$VERSION = "$\{PKG_VERSION\}"
	Write-Output "Using '$\{PKG_VERSION\}' for version value '$\{VERSION\}'"
}

$PACKAGE = "{{{name}}}"
$GIT_GROUP = "{{{git_org_or_person}}}"
$RELEASE = "https://github.com/$\{GIT_GROUP\}/$\{PACKAGE\}/releases/tag/v$\{VERSION\}"
$SYSTEM_TYPE = Get-ComputerInfo -Property CsSystemType
if ($SYSTEM_TYPE.CsSystemType.Contains("ARM64")) {
    $MACHINE = "arm64"
} else {
    $MACHINE = "x86_64"
}

Write-Output "Using release $\{RELEASE\}"

# FIGURE OUT Install directory
$BIN_DIR = "$\{Home\}\\bin"
Write-Output "$\{PACKAGE\} v$\{VERSION\} will be installed in $\{BIN_DIR\}"

#
# Figure out what the zip file is named
#
$ZIPFILE = "$\{PACKAGE\}-v$\{VERSION\}-Windows-$\{MACHINE\}.zip"
$CHECKSUM_FILE = "$\{PACKAGE\}-v$\{VERSION\}-checksums.txt"
Write-Output "Fetching Zipfile $\{ZIPFILE\}"

#
# Check to see if this zip file has been downloaded.
#
$DOWNLOAD_URL = "https://github.com/$\{GIT_GROUP\}/$\{PACKAGE\}/releases/download/v$\{VERSION\}/$\{ZIPFILE\}"
Write-Output "Download URL $\{DOWNLOAD_URL\}"

if (!(Test-Path $BIN_DIR)) {
  New-Item $BIN_DIR -ItemType Directory | Out-Null
}
curl.exe -Lo "$\{ZIPFILE\}" "$\{DOWNLOAD_URL\}"
if (!(Test-Path $ZIPFILE)) {
    Write-Output "Failed to download $\{ZIPFILE\} from $\{DOWNLOAD_URL\}"
} else {
    # Verify checksum
    $CHECKSUM_URL = "https://github.com/$\{GIT_GROUP\}/$\{PACKAGE\}/releases/download/v$\{VERSION\}/$\{CHECKSUM_FILE\}"
    try {
        curl.exe -Lo "$\{CHECKSUM_FILE\}" "$\{CHECKSUM_URL\}"
        if (Test-Path $CHECKSUM_FILE) {
            $expectedLine = Get-Content $CHECKSUM_FILE | Where-Object { $_ -match [regex]::Escape($ZIPFILE) }
            if ($expectedLine) {
                $expectedHash = ($expectedLine -split '\s+')[0].ToLower()
                $actualHash = (Get-FileHash -Path $ZIPFILE -Algorithm SHA256).Hash.ToLower()
                if ($expectedHash -eq $actualHash) {
                    Write-Output "Checksum verified: $\{ZIPFILE\}"
                } else {
                    Write-Warning "Checksum mismatch for $\{ZIPFILE\}"
                    Write-Warning "  Expected: $\{expectedHash\}"
                    Write-Warning "  Actual:   $\{actualHash\}"
                    Write-Warning "  Proceeding anyway — verify the download manually if concerned"
                }
            } else {
                Write-Warning "$\{ZIPFILE\} not found in checksum file, skipping verification"
            }
            Remove-Item $CHECKSUM_FILE -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Warning "Could not download $\{CHECKSUM_FILE\}, skipping verification"
    }
    # Do we have a zip file or tar.gz file?
    $fileInfo = Get-Item "$\{ZIPFILE\}"

    # Handle zip or tar.gz files
    switch ($fileInfo.Extension) {
        ".zip" {
            Expand-Archive -Force -Path "$\{ZIPFILE\}" "$\{Home\}"
            break
        }
        ".gz" {
            tar.exe xf "$\{ZIPFILE\}" -C "$\{Home\}"
            break
        }
        ".tgz" {
            tar.exe xf "$\{ZIPFILE\}" -C "$\{Home\}"
            break
        }
        default {
            Write-Output "The $\{ZIPFILE\} from $\{DOWNLOAD_URL\} is neither a ZIP file nor a gzipped tar file."
            exit 1
        }
    }

    #Remove-Item $ZIPFILE

    $User = [System.EnvironmentVariableTarget]::User
    $Path = [System.Environment]::GetEnvironmentVariable('Path', $User)
    if (!(";$\{Path\};".ToLower() -like "*;$\{BIN_DIR\};*".ToLower())) {
        [System.Environment]::SetEnvironmentVariable('Path', "$\{Path\};$\{BIN_DIR\}", $User)
        $Env:Path += ";$\{BIN_DIR\}"
    }
    Write-Output "$\{PACKAGE\} was installed successfully to $\{BIN_DIR\}"
	Write-Output "If you get a security warning on Windows or macOS please see INSTALL_NOTES_Windows.md or INSTALL_NOTES_macOS.md"
}
`;

// Markdown
export const readmeMdText = `

# {{{name}}}

{{{description}}}

{{#if releaseNotes}}
## Release Notes

- version: {{{version}}}
{{#if developmentStatus}}- status: {{{developmentStatus}}}{{/if}}
{{#if datePublished}}- released: {{{datePublished}}}{{/if}}

{{{releaseNotes}}}
{{/if}}

{{#if author}}

### Authors

{{#each author}}
- {{#if familyName}}{{{familyName}}}, {{{givenName}}}{{else}}{{{name}}}{{/if}}
{{/each}}
{{/if}}

{{#if contributor}}

### Contributors

{{#each contributor}}
- {{#if familyName}}{{{familyName}}}, {{{givenName}}}{{else}}{{{name}}}{{/if}}
{{/each}}
{{/if}}

{{#if maintainer}}

### Maintainers

{{#each maintainer}}
- {{#if familyName}}{{{familyName}}}, {{{givenName}}}{{else}}{{{name}}}{{/if}}
{{/each}}
{{/if}}

{{#if softwareRequirements}}
## Software Requirements

{{#each softwareRequirements}}
- {{{.}}}
{{/each}}
{{/if}}

{{#if softwareSuggestions}}
### Software Suggestions

{{#each softwareSuggestions}}
- {{{.}}}
{{/each}}
{{/if}}

{{#if runtimePlatform}}
#### Runtime platform

**{{{runtimePlatform}}}**{{/if}}

## Related resources

{{#if installUrl}}-[Install]({{{installUrl}}}){{/if}}
{{#if downloadUrl}}- [Download]({{{downloadUrl}}}){{/if}}
{{#if issueTracker}}- [Getting Help, Reporting bugs]({{{issueTracker}}}){{/if}}
{{#if license}}- [LICENSE]({{{license}}}){{/if}}
- [Installation](INSTALL.md)
- [About](about.md)

`;

// Markdown
export const searchMdText = `

# {{{name}}}

<link href="./pagefind/pagefind-ui.css" rel="stylesheet">
<script src="./pagefind/pagefind-ui.js" type="text/javascript"></script>
<div id="search"></div>
<script>
const u = URL.parse(window.location.href);
const basePath = u.pathname.replace(/search.html$/g, '');

// Function to extract query parameters from the URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Extract the query parameter
const searchQuery = getQueryParam('q');

window.addEventListener('DOMContentLoaded', (event) => {
    const searchUI = new PagefindUI({
            element: "#search",
            baseUrl: basePath
    });
    if (searchQuery) {
        searchUI.triggerSearch(searchQuery);
    }
});
</script>
`;

// Markdown
export const installMdText = `Installation **{{{name}}}**
============================

**{{{name}}}** {{{description}}}

Quick install with curl or irm
------------------------------

There is an experimental installer.sh script that can be run with the following command to install latest table release. This may work for macOS, Linux and if you’re using Windows with the Unix subsystem. This would be run from your shell (e.g. Terminal on macOS).

~~~shell
curl https://{{{git_org_or_person}}}.github.io/{{{name}}}/installer.sh | sh
~~~

This will install the programs included in {{{name}}} in your ` + "`$HOME/bin`" +
  ` directory.

If you are running Windows 10 or 11 use the Powershell command below.

~~~ps1
irm https://{{{git_org_or_person}}}.github.io/{{{name}}}/installer.ps1 | iex
~~~

### If your are running macOS or Windows

You may get security warnings if you are using macOS or Windows. See the notes for the specific operating system you’re using to fix issues.

- [INSTALL_NOTES_macOS.md](INSTALL_NOTES_macOS.md)
- [INSTALL_NOTES_Windows.md](INSTALL_NOTES_Windows.md)

Installing from source
----------------------

### Required software

{{#each softwareRequirements}}
- {{{.}}}
{{/each}}

### Steps

1. git clone https://github.com/{{{git_org_or_person}}}/{{{name}}}
2. Change directory into the ` + "`" + `{{{name}}}` + "`" + ` directory
3. Make to build, test and install

~~~shell
git clone https://github.com/{{{git_org_or_person}}}/{{{name}}}
cd {{{name}}}
make
make test
make install
~~~

`;

// Makefile
export const denoMakefileText = `
# generated with CMTools {{{version}}} {{{releaseHash}}}

#
# Simple Makefile for Deno based Projects built under POSIX.
#

PROJECT = {{{name}}}

PACKAGE = {{{name}}}

PROGRAMS = <PROGRAM_LIST_GOES_HERE>

GIT_GROUP = {{{git_org_or_person}}}

VERSION = $(shell grep '"version":' codemeta.json | cut -d\\"  -f 4)

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

release: clean build man website installer.bash installer.ps1 distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64 dist/Windows-arm64
	@printf "\nready to run\n\n\trelease.bash\n\n"

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
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/*
	@rm -fR dist/bin

dist/Linux-aarch64: .FORCE
	@mkdir -p dist/bin
	deno task dist_linux_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-aarch64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/*
	@rm -fR dist/bin

dist/macOS-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_macos_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/*
	@rm -fR dist/bin

dist/macOS-arm64: .FORCE
	@mkdir -p dist/bin
	deno task dist_macos_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/*
	@rm -fR dist/bin

dist/Windows-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/*
	@rm -fR dist/bin

dist/Windows-arm64: .FORCE
	@mkdir -p dist/bin
	#deno task dist_windows_aarch64 <-- switch to native when Rust/Deno supports Windows ARM64
	deno task dist_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/* man/*
	@rm -fR dist/bin

.FORCE:
`;

// Makefile
export const goMakefileText = `
# generated with CMTools {{{version}}} {{{releaseHash}}}

#
# Simple Makefile for Golang based Projects built under POSIX.
#
PROJECT = {{{name}}}

GIT_GROUP = {{{git_org_or_person}}}

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
	@cp -vR man dist/
	@for DNAME in $(DOCS); do cp -vR $$DNAME dist/; done

release: build installer.sh installer.ps1 save setup_dist distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64 dist/Windows-arm64 dist/Linux-armv7l
	@printf "\nready to run\n\n\trelease.bash\n\n"


.FORCE:
`;

export const websiteMakefileText = `
# generated with CMTools {{{version}}} {{{releaseHash}}}

#
# Makefile for running pandoc on all Markdown docs ending in .md
#
PROJECT = {{{name}}}

PANDOC = \$(shell which pandoc)

MD_PAGES = \$(shell ls -1 *.md)

HTML_PAGES = \$(shell ls -1 *.md | sed -E 's/\\.md/\\.html/g')

build: \$(HTML_PAGES) \$(MD_PAGES) # pagefind

\$(HTML_PAGES): \$(MD_PAGES) .FORCE
	if [ -f \$(PANDOC) ]; then \$(PANDOC) --metadata title=$(basename $@) -s --to html5 $(basename $@).md -o $(basename $@).html \\
		--lua-filter=links-to-html.lua \\
		--lua-filter=add-col-scope.lua \\
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

export const websitePs1Text = `<#
generated with CMTools {{{version}}} {{{releaseHash}}}

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
                "--lua-filter=add-col-scope.lua" \`
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
# Invoke-PageFind

`;

export const publishBashText = `#!/bin/bash
# generated with CMTools {{{version}}} {{{releaseHash}}}
#

#
# Publish script for {{{name}}} for GitHub pages. It expect the gh-pages
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

export const publishPs1Text = `<#
generated with CMTools {{{version}}} {{{releaseHash}}}

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

export const releaseBashText = `#!/bin/bash
# generated with CMTools {{{version}}} {{{releaseHash}}}

#
# Release script for {{{name}}} on GitHub using gh cli.
#
REPO_ID="\${PWD##*/}"
GROUP_ID="\$(git config --get remote.origin.url | sed -E 's#.*github\\.com[:/]([^/]+)/.*#\\1#')"
REPO_URL="https://github.com/\${GROUP_ID}/\${REPO_ID}"
echo "REPO_URL -> \${REPO_URL}"

#
# Generate a new draft release using jq and gh
#
RELEASE_TAG="v\$(jq -r .version codemeta.json)"
if ! printf '%s' "\${RELEASE_TAG}" | grep -qE '^v[0-9a-zA-Z._-]+\$'; then
    echo "error: version contains unexpected characters: \${RELEASE_TAG}"
    exit 1
fi
echo "tag: \${RELEASE_TAG}, notes:"
jq -r .releaseNotes codemeta.json >release_notes.tmp
cat release_notes.tmp

#
# Generate checksums for distribution zip files
#
CHECKSUM_FILE="\${REPO_ID}-\${RELEASE_TAG}-checksums.txt"
if command -v sha256sum >/dev/null 2>&1; then
    sha256sum dist/*.zip | sed 's|dist/||' > "dist/\${CHECKSUM_FILE}"
else
    shasum -a 256 dist/*.zip | sed 's|dist/||' > "dist/\${CHECKSUM_FILE}"
fi
echo "Checksums written to dist/\${CHECKSUM_FILE}"

# Now we're ready to push things.
# shellcheck disable=SC2162
read -r -p "Push release to GitHub with gh? (y/N) " YES_NO
if [ "\${YES_NO}" = "y" ]; then
	make save msg="prep for \${RELEASE_TAG}"
	# Now generate a draft release
	echo "Pushing release \${RELEASE_TAG} to GitHub"
	gh release create "\${RELEASE_TAG}" \\
		--draft \\
		-F release_notes.tmp \\
		--generate-notes
	echo "Uploading distribution files and checksums"
	gh release upload "\${RELEASE_TAG}" dist/*.zip "dist/\${CHECKSUM_FILE}"

	cat <<EOT

Now goto repo release and finalize draft.

	\${REPO_URL}/releases

EOT
	rm release_notes.tmp

fi
`;

export const releasePs1Text = `<#
generated with CMTools {{{version}}} {{{releaseHash}}}

.SYNOPSIS
Release script for {{{name}}} on GitHub using gh CLI.
#>

# Determine repository and group IDs
$repoId = Split-Path -Leaf -Path (Get-Location)
$groupId = (git config --get remote.origin.url) -replace '.*github\\.com[:/]([^/]+)/.*', '$1'
$repoUrl = "https://github.com/\$\{groupId\}/\$\{repoId\}"
Write-Output "REPO_URL -> \$\{repoUrl\}"

# Generate release tag and notes
$releaseTag = "v\$(jq -r .version codemeta.json)"
if ($releaseTag -notmatch '^v[0-9a-zA-Z._-]+$') {
    Write-Error "error: version contains unexpected characters: \$\{releaseTag\}"
    exit 1
}
Write-Output "tag: \$\{releaseTag\}, notes:"
jq -r .releaseNotes codemeta.json | Out-File -FilePath release_notes.tmp -Encoding utf8
Get-Content release_notes.tmp

# Generate checksums for distribution zip files
$checksumFile = "\$\{repoId\}-\$\{releaseTag\}-checksums.txt"
$hashes = Get-ChildItem -Path dist -Filter *.zip | ForEach-Object {
    $hash = (Get-FileHash -Path \$_.FullName -Algorithm SHA256).Hash.ToLower()
    "\$hash  \$(\$_.Name)"
}
$hashes | Out-File -FilePath "dist/\$\{checksumFile\}" -Encoding utf8
Write-Output "Checksums written to dist/\$\{checksumFile\}"

# Prompt user to push release to GitHub
$yesNo = Read-Host -Prompt "Push release to GitHub with gh? (y/N)"
if ($yesNo -eq "y") {
    Write-Output "Saving working state for \$\{releaseTag\}"
    git commit -am "prep for \$\{releaseTag\}"
    git push
    Write-Output "Pushing release \$\{releaseTag\} to GitHub"
    gh release create "\$\{releaseTag\}" \`
        --draft \`
        --notes-file release_notes.tmp \`
        --generate-notes
    Write-Output "Uploading distribution files and checksums"
    gh release upload "\$\{releaseTag\}" (Get-ChildItem dist/*.zip) "dist/\$\{checksumFile\}"

    Write-Output @"

Now go to repo release and finalize draft.

    \$\{repoUrl\}/releases

"@

    Remove-Item release_notes.tmp
}
`;

export const installNotesMacOSMdText = `
Installing an unsigned executable on macOS can be a bit tricky due to macOS's security features designed to protect users from potentially harmful software. Here's a general guide on how to do it:

1. **Download the Executable**: First, download the unsigned executable file you want to install.

2. **Locate the File**: Use Finder to locate the downloaded file. It's often in the \`Downloads\` folder unless you specified a different location.

3. **Attempt to Open the File**: Double-click the file to open it. macOS will likely show a warning that the file cannot be opened because it is from an unidentified developer.

4. **Override Security Settings**:
   - **Option 1: Open via Context Menu**
     - Right-click (or Control-click) the file.
     - Select \`Open\` from the context menu.
     - You'll see another warning, but this time there will be an option to \`Open\` the file anyway. Click \`Open\`.

   - **Option 2: Allow Apps from Anywhere (Temporarily)**
     - Open \`System Preferences\` and go to \`Security & Privacy\`.
     - Click the lock icon in the bottom left corner and enter your password to make changes.
     - Under the \`General\` tab, you might see a message about the app being blocked. Click \`Open Anyway\`.
     - If you don't see this option, you can temporarily change the setting to allow apps downloaded from \`Anywhere\`. However, this option is not available in the latest versions of macOS by default. You may need to use the Terminal to do this:
       - Open Terminal and type: \`sudo spctl --master-disable\`
       - Press Enter and provide your password.
       - This will allow you to run apps from anywhere, but it's recommended to re-enable security by typing \`sudo spctl --master-enable\` after installing your app.

5. **Use Terminal (Advanced Users)**: If the above methods don't work, you can use the Terminal to run the executable directly:
   - Open Terminal.
   - Navigate to the directory where the file is located using the \`cd\` command.
   - Make the file executable by typing: \`chmod +x filename\`
   - Run the file by typing: \`./filename\`

6. **Check for Updates**: Sometimes, developers will sign their apps later. Check if there's a signed version available to avoid these steps in the future.

### Important Considerations

- **Security Risks**: Running unsigned executables can expose your system to malware and other security risks. Only proceed if you trust the source of the software.
- **System Integrity Protection (SIP)**: Some steps might be restricted by SIP, which is designed to protect your system. Disabling SIP is not recommended unless absolutely necessary.

If you're unsure about any of these steps or the safety of the file, it's best to consult with someone who has more experience with macOS or to contact the software developer for support.
`;

export const installNotesWindowsMdText = `
Installing an unsigned executable on Windows can also pose security risks, as Windows has built-in mechanisms to protect users from potentially harmful software. Here's a general guide on how to do it:

### Steps to Install an Unsigned Executable on Windows

1. **Download the Executable**: Download the unsigned executable file you want to install from a trusted source.

2. **Locate the File**: Use File Explorer to locate the downloaded file, which is often in the \`Downloads\` folder unless you specified a different location.

3. **Attempt to Open the File**: Double-click the file to open it. Windows may show a warning that the file is not commonly downloaded and could harm your computer.

4. **Override Security Settings**:
   - **Option 1: Run Anyway**
     - When you see the warning, click on \`More info\` in the dialog box.
     - A new option will appear to \`Run anyway\`. Click this to proceed with the installation.

   - **Option 2: Disable Windows Defender SmartScreen (Temporarily)**
     - Open the Start menu and go to \`Settings\`.
     - Navigate to \`Update & Security\` > \`Windows Security\` > \`App & browser control\`.
     - Under \`Check apps and files\`, select \`Off\`. This will disable SmartScreen temporarily.
     - Try running the executable again.
     - Remember to turn SmartScreen back on after installation for continued protection.

5. **Use Command Prompt (Advanced Users)**: If the above methods don't work, you can use the Command Prompt to run the executable directly:
   - Open Command Prompt as an administrator.
   - Navigate to the directory where the file is located using the \`cd\` command.
   - Run the file by typing its name and pressing Enter.

### Important Considerations

- **Security Risks**: Running unsigned executables can expose your system to malware and other security risks. Only proceed if you trust the source of the software.
- **User Account Control (UAC)**: UAC might prompt you for permission to run the executable. Ensure you have administrative rights to proceed.
- **Antivirus Software**: Your antivirus software might also block unsigned executables. You may need to temporarily disable it or add an exception for the file.

If you're unsure about any of these steps or the safety of the file, it's best to consult with someone who has more experience with Windows or to contact the software developer for support.
`;

export const addColScopeLuaText = `-- add-col-scope.lua adds a scope="col" to table header elements
function Table(tbl)
  for _, head in ipairs(tbl.head.rows) do
    for _, cell in ipairs(head.cells) do
      cell.attr.attributes["scope"] = "col"
    end
  end
  return tbl
end
`;

export const linksToHtmlLuaText =
  `-- links-to-html.lua converts links to local Markdown documents to
-- there respective .html counterparts.
function Link(el)
  el.target = string.gsub(el.target, "%.md", ".html")
  return el
end
`;

export const denoTasksText = `
{
  "tasks": {
    "dist_linux_x86_64": "deno task dist_linux_x86_64_<prog_name>",
    "dist_linux_x86_64_<prog_name>": "deno compile   <deno-permissions> --output dist/bin/<prog_name> --target x86_64-unknown-linux-gnu <source_name>.ts",
    "dist_linux_aarch64": "deno task dist_linux_aarch64_<prog_name> ",
    "dist_linux_aarch64_<prog_name>": "deno compile  <deno-permissions> --output dist/bin/<prog_name> --target aarch64-unknown-linux-gnu <source_name>.ts",
    "dist_macos_x86_64": "deno task dist_macos_x86_64_<prog_name> ",
    "dist_macos_x86_64_<prog_name>": "deno compile   <deno-permissions> --output dist/bin/<prog_name> --target x86_64-apple-darwin <source_name>.ts",
    "dist_macos_aarch64": "deno task dist_macos_aarch64_<prog_name> ",
    "dist_macos_aarch64_<prog_name>": "deno compile  <deno-permissions> --output dist/bin/<prog_name> --target aarch64-apple-darwin <source_name>.ts",
    "dist_windows_x86_64": "deno task dist_windows_x86_64_<prog_name> ",
    "dist_windows_x86_64_<prog_name>": "deno compile <deno-permissions> --output dist/bin/<prog_name>.exe --target x86_64-pc-windows-msvc <source_name>.ts",
    "dist_windows_aarch64": "deno task dist_windows_aarch64_<prog_name> ",
    "dist_windows_aarch64_<prog_name>": "deno compile <deno-permissions> --output dist/bin/<prog_name>.exe --target aarch64-pc-windows-msvc <source_name>.ts"
  }
}
`;

export const goMakePs1Text = `param (
    [string]$action = "build"
)

$jsonContent = Get-Content -Raw -Path "codemeta.json" | ConvertFrom-Json
$projectName = $jsonContent.name
$versionNo = $jsonContent.version

function Make-Man {
    $markdownFiles = Get-ChildItem -File *.1.md
    foreach ($file in $markdownFiles) {
        $manName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)

        if (-not (Test-Path -Path man\man1)) {
            New-Item -ItemType Directory -Path man\man1 | Out-Null
        }

        Write-Host "Rending $file as man\man1\$manName"
        pandoc -f Markdown -t man -o man\man1\$manName -s $file
    }
}

function Build-It {
    param (
        [string]$OutPath,
        [string]$SourcePath,
        [string]$TargetOS,
        [string]$TargetArch
    )
    if ([string]::IsNullOrEmpty($OutPath)) {
        throw "missing required output path"
    }
    if ([string]::IsNullOrEmpty($SourcePath)) {
        throw "missing required go source path"
    }

    # Default to host OS if not specified
    if ([string]::IsNullOrEmpty($TargetOS)) {
        if ($IsWindows) {
            $TargetOS = "windows"
        }
        elseif ($IsMacOS) {
            $TargetOS = "darwin"
        }
        elseif ($IsLinux) {
            $TargetOS = "linux"
        }
        else {
            throw "Unsupported host OS."
        }
    }

    # Default to host architecture if not specified
    if ([string]::IsNullOrEmpty($TargetArch)) {
        $arch = $env:PROCESSOR_ARCHITECTURE
        $archMap = @{
            "AMD64"  = "amd64"
            "x86_64" = "amd64"
            "ARM64"  = "arm64"
            "aarch64" = "arm64"
        }
        if ($archMap.ContainsKey($arch)) {
            $TargetArch = $archMap[$arch]
        }
        else {
            # Fallback for Unix-like systems
            $uname = uname -m
            if ($uname -eq "x86_64") { $TargetArch = "amd64" }
            elseif ($uname -eq "aarch64") { $TargetArch = "arm64" }
            else { throw "Unsupported host architecture: $arch" }
        }
    }

    # Validate supported OS and architecture
    $supportedOS = @("windows", "darwin", "linux")
    $supportedArch = @("amd64", "arm64")

    if ($TargetOS -notin $supportedOS) {
        Write-Error "Unsupported OS: $TargetOS. Use windows, darwin, or linux."
        exit 1
    }
    if ($TargetArch -notin $supportedArch) {
        Write-Error "Unsupported architecture: $TargetArch. Use amd64 or arm64."
        exit 1
    }

    Write-Host "Building $OutPath from $SourcePath for OS: $TargetOS, Architecture: $TargetArch"

    # Set GOOS and GOARCH for cross-compilation
    $env:GOOS = $TargetOS
    $env:GOARCH = $TargetArch
    # Run the Go build command
    go build -o "$OutPath" "$SourcePath"
    if (-not $?) {
        throw "Build failed for $TargetOS/$TargetArch."
    }
}

# Make the man pages
if ($action -eq "man") {
    Make-Man
}

# Default build action
if ($action -eq "build") {
    Write-Host "Building antenna..."
    Build-It -OutPath bin/antenna.exe -SourcePath cmd\antenna\antenna.go
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed"
        exit $LASTEXITCODE
    }

    Write-Host "Generating help documentation..."
    .\bin\antenna.exe --help > antenna.1.md
    Write-Host "Build and documentation generation complete."
}

# Install action
if ($action -eq "install") {
    $binDir = Join-Path $HOME "bin"
    $exePath = Join-Path $PSScriptRoot "bin\antenna.exe"
    $destPath = Join-Path $binDir "antenna.exe"
    Build-It -OutPath $exePath -SourcePath cmd\antenna\antenna.go

    # Create bin directory if it doesn't exist
    if (-not (Test-Path $binDir)) {
        Write-Host "Creating $binDir directory..."
        New-Item -ItemType Directory -Path $binDir | Out-Null
    }

    # Copy executable
    Write-Host "Copying antenna.exe to $binDir..."
    Copy-Item -Path $exePath -Destination $destPath -Force

    # Check if $HOME\bin is in PATH
    $pathEnv = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($pathEnv -notlike "*$binDir*") {
        Write-Host "\`n$binDir is not in your PATH. To add it, run the following command:"
        Write-Host "[Environment]::SetEnvironmentVariable('PATH', \`'$pathEnv;$binDir\`' + ';', 'User')"
        Write-Host "After running the above command, restart your terminal or run:"
        Write-Host "refreshenv"
    } else {
        Write-Host "\`n$binDir is already in your PATH."
    }
}

if ($action -eq "release") {
    $releasePath = "dist"
    if (Test-Path -Path $releasePath) {
        Write-Host "Removing stale $releasePath"
        Remove-Item -Path "$releasePath" -Recurse -Force
    }
    New-Item -ItemType Directory -Path $releasePath | Out-Null
    Write-Host "Created directory: $releasePath"

    # Copy in the documentation files
    copy README.md dist\
    copy INSTALL.md dist\
    copy codemeta.json dist\
    copy LICENSE dist\
    copy *.?.md dist\
    copy -Recurse man dist\

    # Build Windows on x86_64
    New-Item -ItemType Directory -Path "$releasePath\bin"
    Build-It -OutPath dist\bin\antenna.exe \`
      -SourcePath cmd\antenna\antenna.go \`
      -TargetOS windows \`
      -TargetArch amd64
    cd dist
    # Get all items (files and directories) in the current directory
    $filesToZip = @(
        "bin\",
        "man\",
        "*.md",
        "codemeta.json",
        "INSTALL.md",
        "LICENSE",
        "README.md"
    )
    $targetZip = "$projectName-v$versionNo-Windows-x86_64.zip"
    if (Test-Path -Path $targetZip) {
        Remove-Item -Path "$targetZip" -Force
    }
    # Zip everything, preserving paths
    Compress-Archive -Path $filesToZip -DestinationPath  $targetZip -CompressionLevel Optimal
    cd ..
    Remove-Item -Path "dist\bin" -Recurse -Force

    # Build Windows on arm64
    New-Item -ItemType Directory -Path "$releasePath\bin"
    Build-It -OutPath dist\bin\antenna.exe \`
      -SourcePath cmd\antenna\antenna.go \`
      -TargetOS windows \`
      -TargetArch arm64
    cd dist
    $filesToZip = @(
        "bin\",
        "man\",
        "*.md",
        "codemeta.json",
        "INSTALL.md",
        "LICENSE",
        "README.md"
    )
    $targetZip = "$projectName-v$versionNo-Windows-arm64.zip"
    if (Test-Path -Path $targetZip) {
        Remove-Item -Path "$targetZip" -Force
    }
    Compress-Archive -Path $filesToZip -DestinationPath  $targetZip -CompressionLevel Optimal
    cd ..
    Remove-Item -Path "dist\bin" -Recurse -Force

    # Build macOS on x86_64
    New-Item -ItemType Directory -Path "$releasePath\bin"
    Build-It -OutPath dist\bin\antenna \`
      -SourcePath cmd\antenna\antenna.go \`
      -TargetOS darwin \`
      -TargetArch amd64
    cd dist
    $filesToZip = @(
        "bin\",
        "man\",
        "*.md",
        "codemeta.json",
        "INSTALL.md",
        "LICENSE",
        "README.md"
    )
    $targetZip = "$projectName-v$versionNo-macOS-x86_64.zip"
    if (Test-Path -Path $targetZip) {
        Remove-Item -Path "$targetZip" -Force
    }
    Compress-Archive -Path $filesToZip -DestinationPath  $targetZip -CompressionLevel Optimal
    cd ..
    Remove-Item -Path "dist\bin" -Recurse -Force

    # Build macOS on arm64
    New-Item -ItemType Directory -Path "$releasePath\bin"
    Build-It -OutPath dist\bin\antenna \`
      -SourcePath cmd\antenna\antenna.go \`
      -TargetOS darwin \`
      -TargetArch arm64
    cd dist
    $filesToZip = @(
        "bin\",
        "man\",
        "*.md",
        "codemeta.json",
        "INSTALL.md",
        "LICENSE",
        "README.md"
    )
    $targetZip = "$projectName-v$versionNo-macOS-arm64.zip"
    if (Test-Path -Path $targetZip) {
        Remove-Item -Path "$targetZip" -Force
    }
    Compress-Archive -Path $filesToZip -DestinationPath  $targetZip -CompressionLevel Optimal
    cd ..
    Remove-Item -Path "dist\bin" -Recurse -Force

    # Build Linux on x86_64
    New-Item -ItemType Directory -Path "$releasePath\bin"
    Build-It -OutPath dist\bin\antenna \`
      -SourcePath cmd\antenna\antenna.go \`
      -TargetOS linux \`
      -TargetArch amd64
    cd dist
    $filesToZip = @(
        "bin\",
        "man\",
        "*.md",
        "codemeta.json",
        "INSTALL.md",
        "LICENSE",
        "README.md"
    )
    $targetZip = "$projectName-v$versionNo-Linux-x86_64.zip"
    if (Test-Path -Path $targetZip) {
        Remove-Item -Path "$targetZip" -Force
    }
    Compress-Archive -Path $filesToZip -DestinationPath  $targetZip -CompressionLevel Optimal
    cd ..
    Remove-Item -Path "dist\bin" -Recurse -Force

    # Build Linux on arm64
    New-Item -ItemType Directory -Path "$releasePath\bin"
    Build-It -OutPath dist\bin\antenna \`
      -SourcePath cmd\antenna\antenna.go \`
      -TargetOS linux \`
      -TargetArch arm64
    cd dist
    $filesToZip = @(
        "bin\",
        "man\",
        "*.md",
        "codemeta.json",
        "INSTALL.md",
        "LICENSE",
        "README.md"
    )
    $targetZip = "$projectName-v$versionNo-Linux-arm64.zip"
    if (Test-Path -Path $targetZip) {
        Remove-Item -Path "$targetZip" -Force
    }
    Compress-Archive -Path $filesToZip -DestinationPath  $targetZip -CompressionLevel Optimal
    cd ..
    Remove-Item -Path "dist\bin" -Recurse -Force
    Write-Host "Check the zip files, then do release.ps1 if all is OK"
}
`;

// Makefile for documentation/presentation projects
export const documentationMakefileText = `# generated with CMTools {{{version}}} {{{releaseHash}}}
#
# Makefile for {{{name}}} documentation project
#
PROJECT = {{{name}}}

build: README.md about.md search.md CITATION.cff
	@echo "$(PROJECT) documentation build complete"

website:
	make -f website.mak

CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

README.md: codemeta.json
	cmt codemeta.json README.md

about.md: codemeta.json
	cmt codemeta.json about.md

search.md: codemeta.json
	cmt codemeta.json search.md

clean:
	rm -f *.html

.PHONY: build website clean
`;

// make.ps1 for documentation/presentation projects
export const documentationMakePs1Text = `param (
    [string]$action = "build"
)

$jsonContent = Get-Content -Raw -Path "codemeta.json" | ConvertFrom-Json
$projectName = $jsonContent.name

function Build-Docs {
    Write-Host "Building $projectName documentation..."
    cmt codemeta.json CITATION.cff
    cmt codemeta.json README.md
    cmt codemeta.json about.md
    cmt codemeta.json search.md
    Write-Host "Build complete"
}

function Build-Website {
    if (Test-Path "website.ps1") {
        ./website.ps1
    } else {
        Write-Host "No website.ps1 found, skipping website build"
    }
}

function Clean-Docs {
    Get-ChildItem -Filter "*.html" | Remove-Item -Force
}

switch ($action) {
    "build"   { Build-Docs }
    "website" { Build-Website }
    "clean"   { Clean-Docs }
    default   { Build-Docs }
}
`;

// Makefile for deno-bundle projects (TypeScript → single browser-side JS bundle)
export const denoBundleMakefileText = `# generated with CMTools {{{version}}} {{{releaseHash}}}
#
# Makefile for {{{name}}} browser-side bundle project
#
PROJECT = {{{name}}}

GIT_GROUP = {{{git_org_or_person}}}

VERSION = $(shell grep '"version":' codemeta.json | cut -d\\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

RELEASE_DATE=$(shell date +'%Y-%m-%d')

RELEASE_HASH=$(shell git log --pretty=format:%h -n 1)

# Entry point TypeScript module (update to match your project)
ENTRY = mod.ts

# Output bundle filename
BUNDLE = $(PROJECT).js

build: CITATION.cff about.md $(BUNDLE)

# NOTE: deno bundle was removed in Deno 2.x.
# Replace this target with your preferred bundler (e.g. esbuild via Deno).
$(BUNDLE): $(ENTRY)
	deno run --allow-read --allow-write npm:esbuild $(ENTRY) --bundle --outfile=$(BUNDLE)

CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

about.md: codemeta.json
	cmt codemeta.json about.md

check: .FORCE
	deno check $(ENTRY)

lint: .FORCE
	deno lint

test: .FORCE
	deno task test

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

clean:
	rm -f $(BUNDLE)

.FORCE:
`;

// Makefile for deno-es-module projects (TypeScript shipped as ES modules, no bundling)
export const denoEsModuleMakefileText = `# generated with CMTools {{{version}}} {{{releaseHash}}}
#
# Makefile for {{{name}}} ES module project
#
PROJECT = {{{name}}}

GIT_GROUP = {{{git_org_or_person}}}

VERSION = $(shell grep '"version":' codemeta.json | cut -d\\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

RELEASE_DATE=$(shell date +'%Y-%m-%d')

RELEASE_HASH=$(shell git log --pretty=format:%h -n 1)

build: CITATION.cff about.md check

CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

about.md: codemeta.json
	cmt codemeta.json about.md

check: .FORCE
	deno check mod.ts

lint: .FORCE
	deno lint

test: .FORCE
	deno task test

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

clean:
	@echo "Nothing to clean for ES module project"

.FORCE:
`;

// Makefile for deno-webcomponent projects
export const denoWebComponentMakefileText = `# generated with CMTools {{{version}}} {{{releaseHash}}}
#
# Makefile for {{{name}}} web component project
#
PROJECT = {{{name}}}

GIT_GROUP = {{{git_org_or_person}}}

VERSION = $(shell grep '"version":' codemeta.json | cut -d\\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

RELEASE_DATE=$(shell date +'%Y-%m-%d')

RELEASE_HASH=$(shell git log --pretty=format:%h -n 1)

build: CITATION.cff about.md custom-elements.json check

# Generates the custom elements manifest using @custom-elements-manifest/analyzer.
# Requires: npm install -g @custom-elements-manifest/analyzer
custom-elements.json: .FORCE
	npx @custom-elements-manifest/analyzer analyze --globs "*.ts"

CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

about.md: codemeta.json
	cmt codemeta.json about.md

check: .FORCE
	deno check mod.ts

lint: .FORCE
	deno lint

test: .FORCE
	deno task test

demo: .FORCE
	@echo "Open demo/index.html in a browser to view component demos"

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

clean:
	rm -f custom-elements.json

.FORCE:
`;
