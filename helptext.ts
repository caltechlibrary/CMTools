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

export const helpText = `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] INPUT_NAME [OUTPUT_NAME]

# DESCRIPTION

{app_name} provides tooling for working with CodeMeta objects
targeting your Python, Go, JavaScript or TypeScript build process.

{app_name} can be used to generate various code artifacts including the following.

- CITATION.cff
- about.md
- version.py, version.go, version.js or version.ts

# OPTIONS

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-f, --format
: output format to use when piping the output to another programming.

# EXAMPLES

Here's an example of rendering ` + "`CITATION.cff`" + ` from a ` +
  "`codemeta.json`" + ` file. The second version
shows how to use the format option.

~~~
{app_name} codemeta.json CITATION.cff
{app_name} codemeta.json --format cff >CITATION.cff
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

`;
