---
title: Someday, maybe
keywords:
  - roadmap
---

# Someday, maybe

CMTools is currently just a working proof of concept.  It is intended to show the benefits could be pursuing the project to a stable and sustainable conclusion. What might the next steps look like?

What follows is a hypothetical roadmap, not a promise of implementation. That's why this document is called "Someday, maybe". 

## Files should be generator

### README.md, README.txt, README

Assuming the README is a basic brief document describing the document. This could be generated completely from the CodeMeta data.  It probably should be as the important parts of the README are covered by the following CodeMeta attributes

`.name`
: Name of the project

`.description`
: Provides a **short** high level view of the project

`.releaseNotes`
: Provides a brief summery of recent changes

`.version` and `.dateReleased`
: The version and date release info

`.relatedUrls`
: Provides links to more detail

`.operatingSystem`, `.runtimePlatform` and `.softwareRequirements`
: provide the important software context

`.license`
: Provides a URL to the Open Source license used

`.codeRepository` and `.issueTracker`
: Provide where to find the project and how to communicate with the project owner(s)

`.author`, `.contributor` and `.maintainer`
: Provide additional contact information as well as important citation information

All that data is recommended to be provided in a README. It can be reduced to boiler plate. Why don't we just generate the README document from the CodeMeta?

### INSTALL.md, INSTALL.txt, INSTALL

Installation documents tend to wind up being very similar like a well assembled README.  Also the practice of curating a simple net based install script (e.g. installer.sh, installer.ps1) has become a common practice for non-commercial software. It maybe possible to reduce much of the INSTALL file just as we did with the README. The installer scripts can be generated from the CodeMeta and the quick install via curl/sh (POSIX) or irm/iex (Windows) can easy be generated based on a stable practice.  The prologue to the build from source description similarly can be generated. If we can assume the steps work the same on Windows as well as POSIX then a simple formula can be generated for building the project from source.

```
deno task configure
deno task build
deno task test
deno task install
```

Since Deno tasks can be written similarly regardless of POSIX or Windows operating system it makes sense to include something similar as boiler plate.  If you do provide POSIX a Makefile then you could also include the recipe of

```
./configure --prefix=$HOME
make
make test
make install
```

### deno.json and using Deno to manage your build process

While Deno should create the `deno.json` file, CMTools can manage to tasks based on a predefined vocabulary, (e.g. "configure", "build", "test", "install").  Additional Deno tasks can be used to build projects that do not involve TypeScript or JavaScript. Deno tasks can also provide TypeScript support for more complex build operations that are maintained on a website like <https://caltechlibrary/CMTools>.

## How do you manage your "codemeta.json" file?

The CodeMeta file content is represented in JSON. JSON can be tedious to manually edit by hand.  I usually rely on the [CodeMeta Generator](https://codemeta.github.io/codemeta-generator/) for this chore. But even that isn't ideal. This is particularly true if you are using the description attribute to describe your project in more detail.  While links are easy enough to extract can check with cURL spell check is troublesome for the description attribute.  What you will want is to be able to review your CodeMeta file and easily edit it.

One approach would be to write and maintain your CodeMeta in equivalent YAML or TOML.  But that approach means on more layer of abstraction to manage and one more point of synchronization (at least until someone decides codemeta.yaml, codemeta.toml are equivalent to codemeta.json).

A better approach would be a for CMTools to provide something like a `cmedit` command. This would let you create or edit a CodeMeta file much as the CodeMeta generator does but it should also allow you to pop out specific elements into your favorite text editor (e.g. like cron edit does). This would allow for more comfortable editing as well as easier spell checking.  The advantage of a tool like this would be that you can always reading a older version of CodeMeta and then write out a normalized version you can rely on. It also means you can work completely off line and avoid a tedious copy/edit cycle.

Making it preferable to manage your project metadata in the CodeMeta file lowers the friction in maintaining your software.

