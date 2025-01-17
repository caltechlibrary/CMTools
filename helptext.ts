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

- CITATION.cff
- about.md
- version.py, version.go, version.js or version.ts

# OPTIONS

Options come as the last parameter(s) on the command line.

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-f, --format
: output format to use when piping the output to another programming.

-d, --deno
: update the deno.json file tasks based on output files requested.

# ENVIRONMENT

{app_name} relies on the environment for the value of EDITOR. This holds for
POSIX shells as well as Powershell on Windows. If EDITOR is set and you use
the editor option then the value will be written to a temp file and saved to
your CodeMeta JSON file on update.

If the EDITOR value is empty the default editor is micro available from
<https://micro-editor.github.io/>.

# EXAMPLES

Here's an example of rendering ` + "`CITATION.cff`" + ` from a ` +
  "`codemeta.json`" + ` file. The second version
shows how to use the format option.

~~~
{app_name} codemeta.json CITATION.cff
{app_name} codemeta.json --format=cff >CITATION.cff
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
`;

export const cmeHelpText: string = `
%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] CODEMETA_JSON
{app_name} [OPTIONS] CODEMETA_JSON ATTRIBUTE_NAME [ATTRIBUTE_NAME ...]

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

# OPTIONS

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-e, --editor
: use the editor specified by the EDITOR environment name.
If EDITOR is unset it will fallback to standard input.

-i, --interactive
: interactively create a CodeMeta file by stepping through
the top level variables.

-a, --attributes
: list the top level attribute names available for editing.

# EXAMPLES

Create a new CodeMeta file. In the following example the environment
variable EDITOR will be used to invoke your editor for editing multi line
CodeMeta attributes like author, contributor, maintainer, keywords,
required software, etc.  The "-i" means edit all top level attributes
sequentially.

~~~
{app_name} -e -i codemeta.json
~~~

Set the version number in your codemeta.json file and add/replace the `+"`.releaseNotes`"+`.

~~~
{app_name} -e codemeta.json version releaseNotes
~~~

Add authors to your codemeta.json using the "micro" editor.  NOTE: you enter authors as YAML.

~~~
{app_name} -e codemeta.json authors
~~~
`;