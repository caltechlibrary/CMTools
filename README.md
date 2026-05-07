

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
- site.css
- Makefile (for Go or Deno based projects)
- website.mak
- release.bash
- publish.bash

## Release Notes

- version: 0.0.43
- status: active
- released: 2025-05-07

- Added generator for add-col-scope.lua
- Update website.mak file to include add-col-scope.lua filter
- Init will now add a site.css and add-col-scope.lua to list files generated automatically
- Commented out pagefind from website.mak and website.ps1
- Commented out search.md from nav generation in page.tmpl
- Fixed rendering of suggested software versions in about.md


### Authors

- Doiel, R. S.


### Contributors

- Morrell, Tom


### Maintainers

- Doiel, R. S.

## Software Requirements

- Deno >= 2.7
- CMTools >= 0.0.43

### Software Suggestions

- GNU Make >= 3.81
- Pandoc >= 3.9
- Git >= 2.39



## Related resources


- [Download](https://github.com/caltechlibrary/CMTools/releases/latest)
- [Getting Help, Reporting bugs](git+https://github.com/caltechlibrary/CMTools/issues)
- [LICENSE](https://caltechlibrary.github.io/CMTools/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

