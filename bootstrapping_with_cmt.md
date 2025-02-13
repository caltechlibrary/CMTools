---
title: Bootstrapping with CodeMeta Tools
keywords:
  - codemeta
  - build
  - release
---

# Bootstrapping a TypeScript project with CodeMeta Tools

While Deno provides most tooling for bootstrapping a TypeScript project there are some things it doesn't handle directly.  In my Caltech Library project I like to include a CITATION.cff, about.md, Makefile and have a simple Pandoc template for generating the website for the project.  These can all be accomplished with CodeMeta Tools' `cmt` command.

## Typical Tasks

In the old days I'd so this for a TypeScript project setup.

1. create a directory to hold your project change into that directory
2. Run `git init` in the directory
3. Run `deno init` in the directory
4. Write a basic README.md, INSTALL.md, Makefile and copy in the appropriate LICENSE file
5. Create a codemeta.json file
6. Create an about.md page
7. Create a Pandoc template (e.g. page.tmpl and copy over the codemeta Pandoc templates)
8. Create a CITATION.cff file
9. Create a version.ts file for the project version, Git hash and license info
10. Start documenting and coding your project.

Here's the commands I'd run in my shell to accomplish these tasks.

~~~shell
mkdir myproject && cd myproject
git init
deno init
touch README.md INSTALL.md
cp ../<SOME_OTHER_PROJECT>/LICENSE ./
# Edit the three files.
micro README.md INSTALL.md LICENSE
firefox https://codemeta.github.io/codemeta-generator/
# paste the result into my codemeta.json file
micro codemeta.json
# create an about page from the codemeta.json contents
micro about.md
# copy then edit a Pandoc template for building website
cp ../<SOME_OTHER_PROJECT>/page.tmpl ./
cp ../<SOME_PTHER_PROJECT>/codmeta-*.tmpl ./
micro page.tmpl
codemeta2cff
# I usually write a Makefile to generate version.ts
# and other artifacts. NOTE: Makefile doesn't work on Windows
micro Makefile
make version.ts
~~~

Now I am ready to start code the project. The copy edit approach can be improved using GitHub repository templates but I've found editing often took as long as just writing the documents from scratch (exception is LICENSE file). Additionally relying on Makefile means to develop on Windows I must install a whole POSIX stack or limit myself to using the Linux Subsystem for Windows. While both Go and Deno both are good at cross compilation if the rest of your build environment requires POSIX then that forces you to POSIX for basic development. This is less than ideal.

## Simplifying the bootstrap using Deno tasks and CodeMeta Tools

Steps one through four remaining the same. Step five is easy as using the [CodeMeta Generator](https://codemeta.github.io/codemeta-generator/). Steps six through nine in the past have meant either copying and editing scripts to generate the content or manually creating the content. With `cmt` you just need to run a single command for each of the targeted files. Here's the steps adjusted to use cmt.

The basic steps.

~~~shell
mkdir myproject && cd myproject
git init
cp ../<SOME_OTHER_PROJECT>/LICENSE ./
firefox https://codemeta.github.io/codemeta-generator/
# paste the result into my codemeta.json file
micro codemeta.json
cmt codemeta.json --init typescript
micro README.md Makefile
~~~

That generates the following files for your project.

- version.ts
- README.md
- about.md
- INSTALL.md
- installer.ps1
- installer.sh
- CITATION.cff
- Makefile

`cmt` assume TypeScript and JavaScript are used with Deno. The `deno.json` file
be updated with a task to manage regenerating those files that are likely to update
with each release of your software, i.e. `deno task gen-code` will update those files.

You can manually regenerate the files by listing them on the command line explicitly.

~~~shell
cmt codemeta.json version.ts about.md CITATION.cff
~~~

The `--deno` is set automatically when you choose `--init typescript` or `--init javascript`.
This will cause the `deno.json` to be update to include the following tasks.

~~~json
{
    "tasks": {
        "gen-code": "deno task version.ts ; deno task about.md ; deno task CITATION.cff",
        "version.ts": "cmt codemeta.json version.ts",
        "about.md": "cmt codemeta.json about.ts",
        "CITATION.cff": "cmt codemeta.json CITATION.cff"
    }
}
~~~
