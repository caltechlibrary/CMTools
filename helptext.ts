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

{app_name} INPUT_NAME [OPTIONS]
{app_name} INPUT_NAME [OUTPUT_NAME] [OPTIONS]
{app_name} INPUT_NAME [OUTPUT_NAME OUTPUT_NAME ...] [OPTIONS]

# DESCRIPTION

{app_name} provides tooling for working with CodeMeta objects
targeting your Python, Go, JavaScript or TypeScript build process.

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

Here's an example of rendering ` + "`CITATION.cff`" + ` from a ` +
  "`codemeta.json`" + ` file. The second version
shows how to use the format option.

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

Here's an example of generating an "about.md" file from the CodeMeta file.

~~~
{app_name} codemeta.json about.md
~~~

You can also just stack the output files you need one after another.
This is an example of creating the files to bootstrap a TypeScript project.

~~~
{app_name} codemeta.json about.md CITATION.cff version.ts
~~~

The "--deno" option can trail the above command to update the deno.json file
with a set of tasks to update the files you have specified.

~~~
{app_name} codemeta.json about.md CITATION.cff version.ts --deno
~~~

This will create a "gen-code" task that will rebuild those files based on
the current contents of the CodeMeta file.

### Project Initialization

{app_name} supports four languages at this time. It will generated the
files needed to bootstrap the project based on the language chosen.

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
