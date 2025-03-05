---
title: CMTools
abstract: "[CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called &#x60;cmt&#x60; that can be used to generate project files and software artifacts. It provides a tool called &#x60;cme&#x60; to edit and manage the CodeMeta file.

The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and release software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library&#x27;s Digital Development Group.

The tools are intended to be run from the project root directory. &#x60;cmt&#x60; expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file&#x27;s extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. &#x60;cme&#x60; expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

&#x60;cme&#x60; is used to create and manage &quot;codemeta.json&quot;. &#x60;cmt&#x60; is used to generate the following.

- README.md
- INSTALL.md
- installer.sh
- installer.ps1
- CITATION.cff
- version.ts, version.js, version.go or version.py
- about.md
- page.hbs (handlebars template) or page.tmpl (Pandoc template)"
authors:
  - family_name: Doiel
    given_name: R. S.
    orcid: https://orcid.org/0000-0003-0900-6903

contributor:
  - family_name: Morrell
    given_name: Tom
    orcid: https://orcid.org/0000-0001-9266-5146

maintainer:
  - family_name: Doiel
    given_name: R. S.
    orcid: https://orcid.org/0000-0003-0900-6903

repository_code: git+https://github.com/caltechlibrary/CMTools
version: 0.0.19
license_url: https://data.caltech.edu/LICENSE
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

date_released: 2025-03-04
---

About this software
===================

## CMTools 0.0.19

Fixes to generate about.md

### Authors

- R. S. Doiel, ORCID: <https://orcid.org/0000-0003-0900-6903>

### Contributors

- Tom Morrell, ORCID: <https://orcid.org/0000-0001-9266-5146>

### Maintainers

- R. S. Doiel, ORCID: <https://orcid.org/0000-0003-0900-6903>

[CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called &#x60;cmt&#x60; that can be used to generate project files and software artifacts. It provides a tool called &#x60;cme&#x60; to edit and manage the CodeMeta file.

The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and release software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library&#x27;s Digital Development Group.

The tools are intended to be run from the project root directory. &#x60;cmt&#x60; expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file&#x27;s extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. &#x60;cme&#x60; expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

&#x60;cme&#x60; is used to create and manage &quot;codemeta.json&quot;. &#x60;cmt&#x60; is used to generate the following.

- README.md
- INSTALL.md
- installer.sh
- installer.ps1
- CITATION.cff
- version.ts, version.js, version.go or version.py
- about.md
- page.hbs (handlebars template) or page.tmpl (Pandoc template)

- License: <https://data.caltech.edu/LICENSE>
- GitHub: <git+https://github.com/caltechlibrary/CMTools>
- Issues: <git+https://github.com/caltechlibrary/CMTools/issues>

### Programming languages

- TypeScript


### Operating Systems

- Linux
- Windows
- macOS


### Software Requirements

- Deno &gt;&#x3D; 2.1.9
- GNU Make &gt;&#x3D; 3.81
- Pandoc &gt;&#x3D; 3.1
- Git &gt;&#x3D; 2.39
- CMTools &gt;&#x3D; 0.0.16

