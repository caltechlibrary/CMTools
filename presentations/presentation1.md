---
title: "CMTools, CodeMeta driven builds"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
institute: |
  Caltech Library,
  Digital Library Development
description: Caltech Library Digital Development Group presentation
createDate: 2025-01-13
updateDate: 2025-01-13
pubDate: TBD
place: TBD
date: 2025-01-13
slidy-url: .
css: styles/coffee-and-cream.css
section-titles: false
toc: true
keywords: [ "CodeMeta", "projects", "build" ]
url: "https://caltechlibrary.github.io/CMTools/presentation"
---

# What is CMTools?

CMTools provides a means of generating and maintain various software artifacts based on the contents of your [CodeMeta](https://codemeta.github.io) file.

# What are Software Artifacts?

Software Artifacts
: Project related files that related to development, build and release processes

Example: about Markdown page, CITATION.cff, version files

# Why CodeMeta?

- CodeMeta is a maturing spec supporting metadata about projects
- We already use it when we import software to our [data repository](https://data.caltech.edu)
- It is a superset of CITATION.cff used for search and discovery on GitHub

# What problem does CMTools assist with?

- Initial projects setup
- Maintenance of CodeMeta driven software artifacts
- Avoid the challenges of hand editing GitHub template documents
- Avoid copy edit cycles

# So how exactly does this work?

In the old days ....

# Project setup, old way

1. go to GitHub
2. clone a template repository to get basic software artifacts
3. edit **all** the artifact (tedious, often not done)
4. start documenting and coding the project (the real work)

# Proposed setup

1. go to GitHub
2. clone template repository
3. edit **three** artifacts (e.g. codemeta.json, README, INSTALL)
4. generate artifacts with CMTools
5. start documenting and coding the project (the real work)

# Why is five steps better than four?

The generated artifacts can be maintained with the same command that generated them. 

The artifact are easy to keep up to date.

# Project maintenance, old way

> Go through each artifact and edit it

- very tedious
- often incomplete done
- lower quality -> higher maintenance

# Proposed maintenance cycle

One command for each supported language:

- Python
  - `cmt codemeta.json CITATION.cff about.md version.py`
- Go
  - `cmt codemeta.json CITATION.cff about.md version.go`
- JavaScript
  - `cmt codemeta.json CITATION.cff about.md version.js`
- TypeScript
  -  `cmt codemeta.json CITATION.cff about.md version.js`

> One command versus hand editing!

# What files does `cmt` currently manage?

- CITATION.cff
- about.md
- version.(ts|go|js|py)
- page.(tmpl|hbs)

# `cmt` and Deno tasks

- `cmt` can manage `cmt` Deno tasks
- Deno tasks can be used to build non-Deno projects
  - Deno works the same on Windows, macOS and Linux

# What could CodeMeta/CMTools also manage?

CodeMeta file could be used to generate 

- README.md
- INSTALL.md
- install scripts for Windows, macOS and Linux
- .gitignore

# What else?

CodeMeta `.otherRequiredSoftware` attribute could be used to check if your dev environment is setup correctly.

# CodeMeta as part of your build process

Many times it's easy to forget to update your CodeMeta file until you're trying to import it into the data repository.  A better approach is to have the codemeta file actually be part of your build and release process. That way version information is consistent and specific. It can also be easily reflected in the documentation of your project's website. Having/maintaining a project website becomes trivial for each new release.

# Template were a good start but ...

The overhead of manually editing files or maintaining complex scripts to editor those files is problematic.

Just generating the files and refreshing the generated files is easier and simpler.

# How do I install CMTools?

CMTools highly experimental. Build from source.

1. Install [deno](https://deno.com/)
2. Clone the [CMTools](https://github.com/caltechlibrary/CMTools)
3. Change into the cloned directory
4. Run `deno install npm:handlebars`
5. Run `deno task build`
6. Copy the resulting `bin/cmt` or `bin/cmt.exe` to you home "bin" directory

# Or quick install

For macOS and Linux

~~~shell
curl -L https://caltechlibrary.github.io/CMTools/installer.sh | sh
~~~

For Windows (using Powershell)

~~~ps1
irm https://caltechlibrary.github.io/CMTools/installer.ps1 | iex
~~~

# Something to consider

> Software lives longer than expected,
> long lived software requires maintenance

# Reference links

- CMTools: <https://caltechlibrary.github.io/CMTools>
- on GitHub: <https://github.com/caltechlibrary/CMTools>
- CodeMeta: <https://codemeta.github.io>
- Deno: <https://deno.com>

Thank you!