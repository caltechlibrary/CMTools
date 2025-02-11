---
title: "CMTools: cme and cmt"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
institute: |
  Caltech Library,
  Digital Library Development
description: Caltech Library Digital Development Group presentation
urlcolor: blue
linkstyle: bold
aspectratio: 169
createDate: 2025-01-29
updateDate: 2025-02-11
pubDate: TBD
place: TBD
date: 2025-02-11
section-titles: false
toc: true
keywords: [ "CodeMeta", "projects", "build" ]
url: "https://caltechlibrary.github.io/CMTools/presentations/presentation2.html"
---

# What is CMTools?

CMTools provides a means of generating and maintain various software artifacts based on the contents of your [CodeMeta](https://codemeta.github.io) file.

`cme`
: A proof of concept CodeMeta editor

`cmt`
: A CodeMeta transformer tool

# Quick tutorial

You can follow along using Terminal (macOS, Linux) or Powershell (Windows).

# Getting prepared

- Install CMTools 

NOTE: requires curl or irm.

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

# Create a new CMTools driven project

- Create a directory and change into it
- Create a "LICENSE" file
- Create a new `codemeta.json` file
- Generate project files

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

NOTE: license is required to create "version.ts".

# Create a new `codemeta.json` file

Use `cme`. 

~~~shell
cme codemeta.json
~~~

Follow the prompts. Complex attributes will require YAML notation.

# Complex attributes

Some attributes need to be entered as YAML.

- author, contributor, maintainer
- operatingSystem, softwareRequired
- keywords

# Create initial project files

`cmt` supports an `--init` option identifying projects
by their primary programming language. Currently supported
are Python, Go, JavaScript and TypeScript. In our example
we're setting up for a Deno+TypeScript project.

~~~shell
cmt codemeta.json --init typescript
~~~

# Create initial project files

`cmt codemeta.json --init typescript` yields the following
files.

- README.md, about.md and CITATION.cff
- INSTALL.md, installer.ps1 and installer.sh
- version.ts and Makefile

# Updating CodeMeta attributes

version, dateModified, datePublished and releaseNotes

~~~shell
cme codemeta.json version dateModified datePublished releaseNotes
~~~

# Update a CodeMeta attributes without prompts.

Set version to "1.0.1"  and releaseNotes to "Bug fixes".

~~~shell
cme codemeta.json version=1.0.1 releaseNotes='Bug fixes'
~~~

# Updating other files

Update the artifacts by explicitly passing their
names on the command line.

~~~shell
cmt codemeta.json version.ts CITATION.cff \\
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
- Deno: <https://deno.com>

Thank you!