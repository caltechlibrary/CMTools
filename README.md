

# CMTools

[CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called `cmt` that can be used to generate project files and software artifacts. It provides a tool called `cme` to edit and manage the CodeMeta file.

The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and release software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library's Digital Development Group.

The tools are intended to be run from the project root directory. `cmt` expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file's extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. `cme` expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

`cme` is used to create and manage "codemeta.json". `cmt` is used to generate the following.

- README.md
- INSTALL.md
- installer.sh
- installer.ps1
- CITATION.cff
- version.ts, version.js, version.go or version.py
- about.md
- page.tmpl (Pandoc template) or page.hbs (handlebars template)
- Makefile (for Go or Deno based projects)
- website.mak
- release.bash
- publish.bash

## Release Notes

- version: 0.0.39
- status: active
- released: 2025-08-06

Corrected CodeMeta version number, shoud have been v0.0.38 but was set to v0.0.34 (a prior release).

Bug fixes.

- Issue #33, Updates the code that generates search.md to include proper path handling and to process a &#x27;?q&#x3D;&lt;SEARCH_TERM&gt;&#x27; URL string.


### Authors

- Doiel, R. S.


### Contributors

- Morrell, Tom


### Maintainers

- Doiel, R. S.

## Software Requirements

- Deno >= 2.4.3
- CMTools >= 0.0.37

### Software Suggestions

- GNU Make >= 3.81
- Pandoc >= 3.1
- Git >= 2.39



## Related resources



- [Getting Help, Reporting bugs](git+https://github.com/caltechlibrary/CMTools/issues)
- [LICENSE](https://caltechlibrary.github.io/CMTools/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

