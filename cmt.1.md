%cmt(1) user manual | version 0.0.40 966b541
% R. S. Doiel
% 2025-08-06

# NAME

cmt

# SYNOPSIS

cmt INPUT_NAME [OPTIONS]
cmt INPUT_NAME [OUTPUT_NAME] [OPTIONS]
cmt INPUT_NAME [OUTPUT_NAME OUTPUT_NAME ...] [OPTIONS]

# DESCRIPTION

cmt provides tooling for working with CodeMeta objects
targeting your Python, Go, JavaScript or TypeScript build process.

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

# OPTIONS

Options come as the last parameter(s) on the command line.

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-i, --init PROGRAMMING_LANGUAGE
: initialize the project based on a programming language name.
Supported languages/project types are "python", "go", "javascript",
"typescript" and "deno".

--lang LANGUAGE
: this sets the language to use when generating Makefile.

# EXAMPLES

Here's an example of rendering `CITATION.cff` from a `codemeta.json` file. The second version
shows how to use the format option.

~~~
cmt codemeta.json CITATION.cff
~~~

Here's an example of rendering `version.ts`, `version.py`, and `version.go` from `codemeta.json` file.

~~~
cmt codemeta.json version.ts
cmt codemeta.json version.py
cmt codemeta.json version.go
~~~

Here's an example of generating an "about.md" file from the CodeMeta file.

~~~
cmt codemeta.json about.md
~~~

You can also just stack the output files you need one after another.
This is an example of creating the files to bootstrap a TypeScript project.

~~~
cmt codemeta.json about.md CITATION.cff version.ts
~~~

The "--deno" option can trail the above command to update the deno.json file
with a set of tasks to update the files you have specified.

~~~
cmt codemeta.json about.md CITATION.cff version.ts --deno
~~~

This will create a "gen-code" task that will rebuild those files based on
the current contents of the CodeMeta file.

### Project Initialization

cmt supports four languages at this time. It will generated the
files needed to bootstrap the project based on the language chosen.


