%cmt(1) user manual | version 0.0.0 f516ad2
% R. S. Doiel
% 2025-01-09

# NAME

cmt

# SYNOPSIS

cmt [OPTIONS] INPUT_NAME [OUTPUT_NAME]

# DESCRIPTION

cmt provides tooling for working with CodeMeta objects
targeting your Python, Go, JavaScript or TypeScript build process.

cmt can be used to generate various code artifacts including the following.

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

Here's an example of rendering `CITATION.cff` from a `codemeta.json` file. The second version
shows how to use the format option.

~~~
cmt codemeta.json CITATION.cff
cmt codemeta.json --format cff >CITATION.cff
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


