export function fmtHelp(
  txt: string,
  appName: string,
  version: string,
  releaseDate: string,
  releaseHash: string,
): string {
  return txt.replaceAll("{app_name}", appName).replaceAll("{version}", version)
    .replaceAll("{release_date}", releaseDate).replaceAll(
      "{release_hash}",
      releaseHash,
    );
}

// Markdown
export const cmtHelpText =
  `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] INPUT_NAME

{app_name} [OPTIONS] INPUT_NAME [OUTPUT_NAME]

{app_name} [OPTIONS] INPUT_NAME [OUTPUT_NAME OUTPUT_NAME ...]

{app_name} --init deno-cli INPUT_NAME [EXECUTABLE_NAME ...]

# DESCRIPTION

{app_name} provides tooling for working with CodeMeta objects
targeting your Python, Go, TypeScript, or documentation build process.

{app_name} can be used to generate various code artifacts including the following.

- README.md
- CITATION.cff
- about.md
- search.md
- version.py, version.go, version.js or version.ts
- INSTALL.md (requires Git repository and LICENSE file)
- INSTALL_NOTES_macOS.md
- INSTALL_NOTES_Windows.md
- installer.sh (requires Git repository and LICENSE file)
- installer.ps1 (requires Git repository and LICENSE file)
- Makefile (requires Git repository and LICENSE file), make.ps1
- website.mak, website.ps1
- release.bash (requires gh is installed), release.ps1
- publish.bash (requires git), publish.ps1
- page.tmpl (Pandoc template), page.hbs (Handlebarsjs)
- site.css (a basic site.css based on Caltech Library Feeds site.css)

# OPTIONS

Options come as the last parameter(s) on the command line.

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-i, --init PROJECT_TYPE
: initialize the project based on a project type name.
Supported project types are:

  **go**
  : Go language CLI or service. Generates version.go and a Go-specific Makefile.

  **python**
  : Python project. Generates version.py.

  **deno-cli**
  : Deno/TypeScript project that compiles to one or more CLI executables.
  Generates version.ts and a Makefile with one ` + "`deno compile`" + ` target per
  executable. Any extra arguments after the codemeta.json path are treated as
  executable names; if none are given the project name from codemeta.json is used.
  Automatically adds a "gen-code" task to deno.json.

  **deno-bundle**
  : Deno/TypeScript compiled to a single browser-side JavaScript bundle.
  Generates a Makefile with a bundle build target. No version.ts is created.
  Automatically adds a "gen-code" task to deno.json.

  **deno-es-module**
  : Deno/TypeScript shipped as ES modules without bundling. Generates a minimal
  Makefile with lint and type-check targets only. No version.ts is created.
  Automatically adds a "gen-code" task to deno.json.

  **deno-webcomponent**
  : Deno/TypeScript web component library. Generates a Makefile with targets for
  running a custom elements manifest analyzer and building a demo page. No version.ts
  is created. Automatically adds a "gen-code" task to deno.json.

  **documentation** / **presentation**
  : Documentation or presentation project. Generates standard files and a generic
  Makefile but no version.* file. "presentation" is an alias for "documentation".

  The following values are deprecated aliases kept for backward compatibility:
  "deno" and "typescript" behave as "deno-cli"; "javascript" also behaves as "deno-cli".

-L, --lang LANGUAGE
: this sets the language to use when generating Makefile.

# EXAMPLES

Here's an example of rendering ` + "`CITATION.cff`" + ` from a ` +
  "`codemeta.json`" + ` file.

~~~
{app_name} codemeta.json CITATION.cff
~~~

Here's an example of rendering ` + "`version.ts`" + `, ` + "`version.py`" +
  `, and ` + "`version.go`" + ` from ` + "`codemeta.json`" + ` file.

~~~
{app_name} codemeta.json version.ts
{app_name} codemeta.json version.py
{app_name} codemeta.json version.go
~~~

You can stack output files to generate several at once.

~~~
{app_name} codemeta.json about.md CITATION.cff version.ts
~~~

### Project Initialization

Initialize a Go project:

~~~
{app_name} --init go codemeta.json
~~~

Initialize a Deno CLI project with a single executable named after the project:

~~~
{app_name} --init deno-cli codemeta.json
~~~

Initialize a Deno CLI project with two named executables:

~~~
{app_name} --init deno-cli codemeta.json mycmd myothercmd
~~~

Initialize a browser-side Deno project that bundles to a single JavaScript file:

~~~
{app_name} --init deno-bundle codemeta.json
~~~

Initialize a browser-side Deno project that ships as ES modules (no bundling):

~~~
{app_name} --init deno-es-module codemeta.json
~~~

Initialize a Deno web component library:

~~~
{app_name} --init deno-webcomponent codemeta.json
~~~

Initialize a documentation or presentation project (no version.* files):

~~~
{app_name} --init documentation codemeta.json
~~~

`;

// Markdown
export const cmeHelpText: string =
  `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} CODEMETA_JSON [OPTION ...] 

{app_name} CODEMETA_JSON ATTRIBUTE_NAME [ATTRIBUTE_NAME ...] [OPTION ...]

{app_name} CODEMETA_JSON ATTRIBUTE_NAME=ATTRIBUTE_VALUE [ATTRIBUTE_NAME=ATTRIBUTE_VALUE ...] [OPTION ...]

# DESCRIPTION

{app_name} is a CodeMeta file editing tool.  When called with only the CODEMETA_JSON filename
it will read in the CodeMeta file, report any errors, extrapolate values if needed. It will
then display a pretty printed normalized version of your CodeMeta file.

{app_name} will also let you modify specific attributes in a CodeMeta file. It does this by
reading the CodeMeta file and prompting you to type in the value. If you use the editor
option it'll launch your editor use it to set the value saving changes are saved back to
the CodeMeta file.

For attributes like author, contributor, maintainer and keyword should be typed in using
YAML syntax. The YAML will be converted to JSON and used to update your CodeMeta file.

If you provide one or more attribute names the attributes will be available to edit in the order
you've requested them to be edited.

Two date fields are set if they are not previously set, "dateCreated" and "dateModified". The 
"dateModified" is updated each time you change something in the CodeMeta file unless you explicitly
edit it.

For the simple fields like version, name, description, releaseNotes you can set their values
directly on the command line using an equal sign between the attribute name and the value. If
the value includes spaces you need to wrap them in quotes. See the EXAMPLE below.

# OPTION

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-e, --editor
: use the editor named in the EDITOR environment variable. If variable is unset then use
the default text editor. On Windows that is notepad.exe. On Linux and macOS it is nano.

-p, --profiles
: list the person and organization profiles available in the global configuration file
(` + "`~/.cmtoolsrc`" + ` or the path given by ` + "`--global-config`" + `).

-P, --person-lists
: list the pre-defined person/organization lists available in the global configuration file.

-A, --apply-license
: select a license from the global configuration, write its text to ` + "`./LICENSE`" + `,
and update the ` + "`license`" + ` field in the codemeta.json file with the license URL
(if one is configured).

-g, --global-config PATH
: load configuration from PATH, bypassing the directory walk-up search.

# GLOBAL CONFIGURATION

{app_name} reads a configuration file that stores person/organization profiles, pre-defined
team lists, and license templates. When editing person fields such as author, contributor,
or maintainer, {app_name} will offer to populate the field from a configured profile or list
rather than requiring manual YAML entry. When editing the license field, {app_name} will
offer to apply a configured license and write ` + "`./LICENSE`" + ` automatically.

Configuration is found by walking up from the current directory to the home directory,
checking for ` + "`.cmtoolsrc`" + ` at each level (first found wins), then falling back to
` + "`~/.config/cmtools/config.yaml`" + `. For example, from ` + "`~/WorkLab/myproject`" + `:

1. ` + "`~/WorkLab/myproject/.cmtoolsrc`" + `
2. ` + "`~/WorkLab/.cmtoolsrc`" + `
3. ` + "`~/.cmtoolsrc`" + `
4. ` + "`~/.config/cmtools/config.yaml`" + `

This lets you keep a work config in ` + "`~/WorkLab/.cmtoolsrc`" + ` and a personal config in
` + "`~/.cmtoolsrc`" + ` and have the right one apply automatically based on where you are working.

Use ` + "`--global-config PATH`" + ` to bypass the walk and load a specific file instead.

Example ` + "`~/.cmtoolsrc`" + `:

~~~yaml
default_profile: rdoiel
default_license: caltech

profiles:
  rdoiel:
    type: Person
    givenName: R. S.
    familyName: Doiel
    email: rdoiel@caltech.edu
    id: https://orcid.org/0000-0003-0900-6903
    affiliation:
      type: Organization
      name: Caltech Library
  caltech-library:
    type: Organization
    name: Caltech Library
    email: library@caltech.edu

licenses:
  caltech:
    name: Caltech License
    file: ~/.config/cmtools/licenses/caltech.txt
  agpl3:
    name: GNU Affero General Public License v3.0 or later
    url: https://spdx.org/licenses/AGPL-3.0-or-later.html
    text: |
      GNU AFFERO GENERAL PUBLIC LICENSE
      Version 3, 19 November 2007
      ...

person_lists:
  dld-team:
    - type: Person
      givenName: R. S.
      familyName: Doiel
      id: https://orcid.org/0000-0003-0900-6903
    - type: Person
      givenName: Tom
      familyName: Morrell
      id: https://orcid.org/0000-0001-9266-5146
~~~

# EXAMPLES

Create a new CodeMeta file. If no attribute names are included then you will
be prompt for each attribute.

~~~
{app_name} codemeta.json
~~~

Set the version number in your codemeta.json file and add/replace the ` +
  "`.releaseNotes`" + `.

~~~
{app_name} codemeta.json version releaseNotes
~~~

Set the version number to "0.0.1" and release notes to "Initial Concept"
without being prompted.

~~~shell
{app_name} codemeta.json version=0.0.1 release='Initial Concept'
~~~

If Micro Editor is installed you can edit the description in micro using the
"-e" option.

~~~shell
{app_name} codemeta.json description -e
~~~

`;
