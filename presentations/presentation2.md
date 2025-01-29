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
updateDate: 2025-01-29
pubDate: TBD
place: TBD
date: 2025-01-29
section-titles: false
toc: true
keywords: [ "CodeMeta", "projects", "build" ]
url: "https://caltechlibrary.github.io/CMTools/presentation"
---

# What is CMTools?

CMTools provides a means of generating and maintain various software artifacts based on the contents of your [CodeMeta](https://codemeta.github.io) file.

CMTools includes

`cmt`
: A CodeMeta transformer tool

`cme`
: A proof of concept CodeMeta editor

# CodeMeta Editor, `cme`

- Create a CodeMeta 3 file
- Normalize a CodeMeta file to CodeMeta 3
- Edit the values in CodeMeta file

# Getting prepared for our project

- Install Deno (this will demonstration is for a TypeScript project)
- Install CMTools

# Install Deno

macOS, Linux

~~~shell
curl -fsSL https://deno.land/install.sh | sh
~~~

Windows

~~~shell
irm https://deno.land/install.ps1 | iex
~~~

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

Open your terminal or Powershell and try the following.

~~~shell
cme --help
cmt --help
~~~

# Create a new CMTools driven project

- Create a directory and change into it
- Initialize Git and Deno
- Create a "LICENSE" file
- Create a new `codemeta.json` file
- Create initial project files

# create a directory and change into it

Our project is going to be called "foo".

~~~shell
mkdir foo
cd foo
~~~

# initialize Git and Deno

~~~shell
git init
deno init
~~~

# Create a "LICENSE" file

Caltech Library's default software license.

~~~shell
curl -L -O https://raw.githubusercontent.com/caltechlibrary/template/refs/heads/main/LICENSE
~~~

or see <https://spdx.org/licenses/>

# Create a new `codemeta.json` file

This demo `cme`. Some attributes just
prompt for a value. Complex ones let you
type in YAML. Follow the prompts.

~~~shell
cme codemeta.json
~~~

# Complex attributes

Some attributes need to be entered as YAML.

- author, contributor, maintainer
- operatingSystem, softwareRequired
- keywords

# Create initial project files

"foo" is a TypeScript project so we can use `cmt` to
create "version.ts" file as well as the usual
"CITATION.cff" and "about.md".

~~~shell
cmt codemeta.json CITATION.cff about.md version.ts
~~~

# Now you're ready to build your own "foo"

From here developing your project is unique but you can keep the
generated files up to date by repeating the command.

~~~shell
cmt codemeta.json CITATION.cff about.md version.ts
~~~

# Updating version, dateModified, datePublished and releaseNotes

~~~shell
cme codemeta.json version dateModified datePublished releaseNotes
~~~

# Micro Editor option

- See <https://micro-editor.github.io>
- Use the "-e" option to use the editor
- Example editing the description

~~~shell
cme codemeta.json description -e
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