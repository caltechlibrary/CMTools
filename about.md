---
title: CMTools
abstract: |-
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
authors:
  - family_name: Doiel
    given_name: R. S.
    id: https://orcid.org/0000-0003-0900-6903

contributor:
  - family_name: Morrell
    given_name: Tom
    id: https://orcid.org/0000-0001-9266-5146

maintainer:
  - family_name: Doiel
    given_name: R. S.
    id: https://orcid.org/0000-0003-0900-6903

repository_code: git+https://github.com/caltechlibrary/CMTools
version: 0.0.46
license_url: https://caltechlibrary.github.io/CMTools/LICENSE
operating_system:
  - Linux
  - Windows
  - macOS

programming_language:
  - TypeScript

keywords:
  - codemeta
  - cff
  - software
  - code generation
  - markdown generation

date_released: 2026-06-18
---

About this software
===================

## CMTools 0.0.46

- Added global configuration system (~/.cmtoolsrc): profiles, licenses, person lists
- New `cme` flags: --profiles, --person-lists, --apply-license, --global-config
- New `--init` sub-types for Deno projects: deno-cli, deno-bundle, deno-es-module, deno-webcomponent
- Added non-programming project types: --init documentation, --init presentation
- Executable names now persisted to project-level .cmtoolsrc for seamless re-generation
- Refactored format registration: FormatGenerator/registerGenerator pattern in transform.ts
- Separate page templates for Caltech Library org vs personal/other projects
- Added <footer> to personal page template for A11y compliance
- Fixed Makefile generation for Go programs
- Fixed Makefile and make.ps1 generation for deno-cli projects

## Authors

- [R. S. Doiel](https://orcid.org/0000-0003-0900-6903)


## Contributors

- [Tom Morrell](https://orcid.org/0000-0001-9266-5146)


## Maintainers

- [R. S. Doiel](https://orcid.org/0000-0003-0900-6903)


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

- [License](https://caltechlibrary.github.io/CMTools/LICENSE)
- [Code Repository](git+https://github.com/caltechlibrary/CMTools)
  - [Issue Tracker](git+https://github.com/caltechlibrary/CMTools/issues)

## Programming languages

- TypeScript


## Operating Systems

- Linux
- Windows
- macOS


## Software Requirements

- Deno >= 2.8
- CMTools >= 0.0.46


## Software Suggestions

- GNU Make >= 3.81
- Pandoc >= 3.9
- Git >= 2.39


