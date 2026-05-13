%cmt(1) user manual | version 0.0.45b d00da22
% R. S. Doiel
% 2026-05-13

# NAME

cmt

# SYNOPSIS

cmt [OPTIONS] INPUT_NAME

cmt [OPTIONS] INPUT_NAME [OUTPUT_NAME]

cmt [OPTIONS] INPUT_NAME [OUTPUT_NAME OUTPUT_NAME ...]

cmt --init deno-cli INPUT_NAME [EXECUTABLE_NAME ...]

# DESCRIPTION

cmt provides tooling for working with CodeMeta objects
targeting your Python, Go, TypeScript, or documentation build process.

cmt can be used to generate various code artifacts including the following.

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
  Generates version.ts and a Makefile with one `deno compile` target per
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

Here's an example of rendering `CITATION.cff` from a `codemeta.json` file.

~~~
cmt codemeta.json CITATION.cff
~~~

Here's an example of rendering `version.ts`, `version.py`, and `version.go` from `codemeta.json` file.

~~~
cmt codemeta.json version.ts
cmt codemeta.json version.py
cmt codemeta.json version.go
~~~

You can stack output files to generate several at once.

~~~
cmt codemeta.json about.md CITATION.cff version.ts
~~~

### Project Initialization

Initialize a Go project:

~~~
cmt --init go codemeta.json
~~~

Initialize a Deno CLI project with a single executable named after the project:

~~~
cmt --init deno-cli codemeta.json
~~~

Initialize a Deno CLI project with two named executables:

~~~
cmt --init deno-cli codemeta.json mycmd myothercmd
~~~

Initialize a browser-side Deno project that bundles to a single JavaScript file:

~~~
cmt --init deno-bundle codemeta.json
~~~

Initialize a browser-side Deno project that ships as ES modules (no bundling):

~~~
cmt --init deno-es-module codemeta.json
~~~

Initialize a Deno web component library:

~~~
cmt --init deno-webcomponent codemeta.json
~~~

Initialize a documentation or presentation project (no version.* files):

~~~
cmt --init documentation codemeta.json
~~~


