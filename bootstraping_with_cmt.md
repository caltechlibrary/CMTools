---
title: Bootstrapping with CodeMeta Tools
---

# Bootstraping a TypeScript project with CodeMeta Tools

While Deno provides most tooling for bootstraping a TypeScript project there are some things it doesn't handle directly.  In my Caltech Library project I like to include a CITATION.cff, about.md and have a simple Pandoc template for generating the website for the project.  These can all be accomplished with CodeMeta Tools' `cmt` command.

## Typical Tasks

1. create a directory to hold your project change into that directory
2. Run `git init` in the directory
3. Run `deno init` in the directory
4. Write a basic README.md, INSTALL.md and copy in the appropriate LICENSE file
5. Create a codemeta.json file
6. Create an about.md page
7. Create a Pandoc template (e.g. page.tmpl)
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
# copy then edit a pandoc template for building website
cp ../<SOME_OTHER_PROJECT>/page.tmpl ./
micro page.tmpl
codemeta2cff
# I usually write a Makefile to generate version.ts
# and other artifacts. NOTE: Makefile doesn't work on Windows
micro Makefile
make version.ts
~~~

Now I am ready to start code the project. The copy edit approach can be improved using GitHub repository templates but I've found those to be more work then just grinding through the project setup.  Relying on Make means I can't develop on a Windows machine without resorting to the Linux Subsytem for Windows. Do while Go and Deno make it easy to cross compile the build process isn't cross platform.

## Simplifying the bootstrap using Deno tasks and CodeMeta Tools

Steps one through four remaining the same. Step five is easy as using the [CodeMeta Generator](https://codemeta.github.io/codemeta-generator/). Steps six through nine in the past have meant either copying and editing scripts to generate the content or manually creating the content. With `cmt` you just need to run a single command for each of the targeted files. Here's the steps adjusted to use cmt.

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
~~~

Now you can generate the rest using `cmt` and the `--gen-project` option. For TypeScript
that would look like.

~~~shell
cmt codemeta.json about.md page.tmpl CITATION.cff version.ts
~~~

NOTE: You can invidual create the files using `cmt` like this.

~~~shell
cmt codemeta.json about.md
cmt codemeta.json page.tmpl
cmt codemeta.json CITATION.cff
cmt codemeta.json version.ts
~~~

For deno projects you can also generate tasks to manage your project with the `--gen-tasks`
option.

~~~shell
cmt codemeta.json deno.json
~~~

~~~json
{
    "tasks": {
        "build": "deno task gen-code ; deno task compile",
        "compile": "deno compile --allow-read --allow-write -o bin/app app.ts",
        "gen-code": "deno task version.ts ; deno task about.md ; deno task CITATION.cff",
        "version.ts": "cmt codemeta.json version.ts",
        "about.md": "cmt codemeta.json about.ts",
        "CITATION.cff": "cmt codemeta.json CITATION.cff"
    }
}
~~~

This means I can skip Makefile to build the app completely and gain the ability to build the project in Windows command prompt or Powershell too. The build command becomes `deno task build`.

Automating the addition adding tasks to your deno.json is possible. Only the executable name and specific TypeScript filename holding your main function is needed.
