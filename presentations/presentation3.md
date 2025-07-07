---
title: "CMTools: cme and cmt (Python)"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
institute: |
  Caltech Library,
  Digital Library Development
description: Caltech Library Digital Development Group presentation
createDate: 2025-07-07
updateDate: 2025-07-07
pubDate: TBD
place: TBD
date: 2025-07-07
slidy-url: .
css: styles/sea-and-shore.css
section-titles: false
toc: true
keywords: [ "CodeMeta", "projects", "build" ]
url: "https://caltechlibrary.github.io/CMTools/presentations/presentation3.html"
---

# What is CMTools?

CMTools provides tools to scaffold and maintain a project using a [CodeMeta](https://codemeta.github.io) file and the metadata provided by the Git repository.

`cme`
: As a CodeMeta editor and generator

`cmt`
: A CodeMeta transformer tool. This will generate project artifacts drawn form the CodeMeta file and the metadata embedded in your Git repository.

# Quick tutorial

- You can follow along using Terminal (macOS, Linux) or Powershell (Windows).
- We will create a basic Python project using `cme` and `cmt`

# Getting prepared

- Install or Upgrade CMTools 

# Installing CMTools

macOS, Linux

~~~shell
curl -L https://caltechlibrary.github.io/CMTools/installer.sh | sh
~~~

Windows

~~~shell
irm https://caltechlibrary.github.io/CMTools/installer.ps1 | iex
~~~

# After install

In your Terminal or Powershell session skim the docs.

~~~shell
cme --help | more
cmt --help | more
~~~

# Creating a project

Steps

1. Create a directory and change into it
2. Create a "LICENSE" file
3. Create a new `codemeta.json` using `cme`
4. Generate project files using `cmt`

# create a directory and change into it

Our project is going to be called "foo".

~~~shell
mkdir foo
cd foo
~~~

# Create a "LICENSE" file

Example uses Caltech Library's software license.

macOS and Linux

~~~shell
curl -L -O https://raw.githubusercontent.com/caltechlibrary/template/refs/heads/main/LICENSE
~~~

Windows

~~~shell
irm https://raw.githubusercontent.com/caltechlibrary/template/refs/heads/main/LICENSE -OutFile LICENSE
~~~

NOTE: license is required to create "version.py".

# Create a new `codemeta.json` file

Use `cme`. 

~~~shell
cme codemeta.json -e
~~~

Follow the prompts.

NOTE: Complex fields require YAML notation. The `-e` option says to invoke a text editor for complex fields like authors and contributors. It is much easier to type YAML in a text editor.

# Complex fields

Some attributes need to be entered as YAML.

- author, contributor, maintainer
- operatingSystem, softwareRequired
- keywords

# Complex fields

- example YAML is generated when you use the `-e` option

# Create initial project files

`cmt` supports an `--init` option identifying projects
by their primary programming language. Currently supported
are Python, Go, JavaScript and TypeScript. In our example
we're setting up for a Python project.

~~~shell
cmt codemeta.json --init python
~~~

# Create initial project files

`cmt codemeta.json --init python` yields the following
files.

- README.md, about.md and CITATION.cff
- INSTALL.md, installer.ps1 and installer.sh
- version.py and Makefile

# Updating CodeMeta attributes

version, dateModified, datePublished and releaseNotes

~~~shell
cme codemeta.json version dateModified datePublished releaseNotes -e
~~~

# Update a CodeMeta attributes without prompts.

Set version to "1.0.1"  and releaseNotes to "Bug fixes".

~~~shell
cme codemeta.json version=1.0.1 releaseNotes='Bug fixes'
~~~

# Updating other files

Update the artifacts by explicitly passing their names on the command line.

macOS and Linux 

~~~shell
cmt codemeta.json version.ts CITATION.cff \\
  INSTALL.md installer.sh installer.ps1 about.md
~~~

On Windows

~~~pwsh
cmt codemeta.json version.ts CITATION.cff `
  INSTALL.md installer.sh installer.ps1 about.md
~~~

# Something to consider

> Software lives longer than expected,
> long lived software requires maintenance.

CMTools helps with maintenance.

# Reference links

- CMTools: <https://caltechlibrary.github.io/CMTools>
- on GitHub: <https://github.com/caltechlibrary/CMTools>
- CodeMeta: <https://codemeta.github.io>
- Python: <https://python.org>

Thank you!