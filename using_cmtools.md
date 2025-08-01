---
title: Using CMTools
dateCreated: 2025-05-07
dateModified: 2025-07-30
keywords:
  - development
  - tooling
  - CodeMeta
---

# Using CMTools

What is CMTools? Two programs designed to work with a
[CodeMeta](https://codemeta.github.io) file. One manages curation the is a
text/code generator based on the contents of your CodeMeta file. The two save
you time and effort setting up or maintaining a GitHub based project. They were
developed for Caltech Library Digital Library Development Group as a alternative
to using GitHub template repositories.

The CodeMeta file is a JSON document that hold metadata about your project (e.g.
name, description, authorship, dates). When combined with the metadata available
from Git and your LICENSE file many files typically included in a project can be
generated automatically. This means many of the software artifacts can be
calculated as needed when your metadata changes.

Here's a brief list

- README.md
- about.md
- search.md
- INSTALL.md
  - INSTALL_NOTES_macOS.md
  - INSTALL_NOTES_Windows.md
- CITATION.cff
- Makefile, build.ps1
- website.mak, website.ps1
- installer.sh, installer.ps1
- release.bash, release.ps1
- publish.bash, publish.ps1
- page.tmpl, page.hbs
- version.py, version.go, version.js and version.ts

The editing tool, `cme`, runs in your favorite shell (e.g. Terminal, Bash,
PowerShell) and will use the default shell's text editor for editing CodeMeta
values.

To generate text or code you use `cmt`. All supported files contain some level
of the metadata captured in the [codemeta.json](codemeta.json). Some also
require information from the Git repository's `.git` directory and they need to
find a file called LICENSE that includes the text of your license.

## creating and maintaining your codemeta.json

The tool for creating and maintaining your codemeta.json file is called `cme`.
That stands for "CodeMeta Editor". It is an interactive tool that will prompt
for top level CodeMeta attributes and let you enter them. It includes a `-e`
option that will let you update the value in your chosen editor. This is nice
for longer fields like `description` and `releaseNotes` as well as complex
fields like `author`, `contributor`, `maintainer` and `softwareRequirements`.

Complex fields are entered using [YAML](https://en.wikipedia.org/wiki/YAML)
notation to describe the element and attributes defined by the CodeMeta
standard.

## generating project files and artifacts

Once you have a "codemeta.json" file you can use the tool named `cmt`, "CodeMeta
Transformer", to transform the CodeMeta contents into one or more files (see
previous list). The CodeMeta JSON file functions as the source of truth about
the project. That means you can generate initial versions of the files and
continue hand editing them or when are happy with the basics generate and
regenerated as needed when the CodeMeta JSON file changes.

## Example creating a Deno TypeScript project

In the following example I step through creating a "Hello World" Deno+TypeScript
project. A few things need to be in place before you can use CMTools and
generated files.

1. Create a Git repository directory
2. Change into that directory and initialize a new Git repository
3. Create a LICENSE (or just an empty placeholder)
4. Create the codemeta.json file using `cme`
5. Generate the files for the project

Steps one through three are the pre-CMTools setup. For steps four and five you
use CMTools' programs.

```shell
mkdir -p src/helloworld
cd src/helloworld
touch LICENSE .gitignore
git init -am 'Initial Setup'
```

Now you're ready to create your codemeta.json file. I'm using the `-e` option so
that I can edit the values in my preferred text editor.

```shell
export EDITOR="nano"
cme codemeta.json -e
```

Now we are ready to generate files. The first time you run this. You'll likely
get an error like

```error
"git log --pretty=format:%h -n 1" exited with 128
"git config --get remote.origin.url" exited with 1
```

This is because we haven't committed and pushed our repository before. There are
not any version numbers associated with the Git log.

```shell
cmt codemeta.json README.md
cmt codemeta.json about.md
cmt codemeta.json INSTALL.md
cmt codemeta.json CITATION.cff
cmt codemeta.json Makefile --lang=TypeScript
cmt codemeta.json website.mak
cmt codemeta.json installer.sh
cmt codemeta.json installer.ps1
cmt codemeta.json release.bash
cmt codemeta.json publish.bash
cmt codemeta.json page.tmpl
cmt codemeta.json version.ts
```

Add these files to the Git repository.

```shell
git add codemeta.json
git add README.md
git add about.md
git add INSTALL.md
git add CITATION.cff
git add Makefile
git add website.mak
git add installer.sh
git add installer.ps1
git add release.bash
git add publish.bash
git add page.tmpl
git add version.ts
git commit -am 'Initial Setup'
git push -u origin main
```

Now you're ready to start development. Remember you can always update these
generated files by updating the codemeta.json file with `cme` and then updating
the files using `cmt`.
