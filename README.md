
# CodeMeta Tools

[CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called `cmt` that can be used to generate project files and artifacts. It also provides a tool called `cme` to edit and manage the CodeMeta file. The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and releasing software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library's Digital Development Group.

The tools are intended to be run from the project root directory. `cmt` expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file's extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. `cme` expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

`cme` is used to create and manage "codemeta.json". `cmt` can be used to generate the following.

- CITATION.cff
- version.ts, version.js, version.go or version.py
- README.md
- about.md
- INSTALL.md
- search.md
- page.hbs (handlebars template) or page.tmpl (Pandoc template)
- Makefile (based on supported language choice)
- webmake.mak
- installer.sh
- installer.ps1

These files provide a generalized scaffolding for a project.

## Create and manage your file

`cme` is for managing your "codemeta.json" file.  If only the "codemeta.json" file is provided then you'll be in an "interactive" mode. You will be prompted for each top level attribute. You either press enter and accept the current value or replace the value. For complex attributes like "author", and "keywords"[^1] you use YAML notation followed by a line containing only a period to indicate completion. If you enter only the line with a period then the current value remains. Here's an example of setting up to use `cme` to create and edit the "codemeta.json" file.

[^1]: For a full list of complex fields see the user manual for `cme`.

~~~shell
cme codemeta.json
~~~

The will let you iterate over the top level CodeMeta object attributes. For short fields this works well (e.g. version). For multi line or list attributes you can use the `-e`, the editor option, for handling the input from the prompts.

Here's an example of updating the version and `.releaseNotes` attributes but instead of the direct input you edit the value using a text editor like Nano or Micro Editor[^2].

[^2]: You need to have Nano or [Micro Editor](http://micro-editor.github.io) installed for this to work.

~~~shell
cme codemeta.json version releaseNotes -e
~~~

Since normally the version is short you'll just be prompted to type in a new version string. The releaseNotes is a multi line field. The `-e` indicates to use your editor to complete the values for all fields.

## Create a version file for TypeScript, Go and Python

The `cmt` command can render a version file suitable for TypeScript, JavaScript, Go and Python projects. The version file will contain version name, release hash, release date and license information. Here's an example of rendering a "version.ts" for the CMTools project.

~~~shell
cmt codemeta.json version.ts
~~~

For Go you would do,

~~~shell
cmt codemeta.json version.go
~~~

and for Python.

~~~shell
cmt codemeta.json version.py
~~~

## Creating an about.md

The codemeta file contains sufficient information to rendering an about page for your project. Rendering a Markdown document for that purpose can be done with the following.

~~~shell
cmt codemeta.json about.md
~~~

## Create a simple project handlebars template

A handlebars template can be generated from the codemeta.json as well.

~~~shell
cmt codemeta.json page.hbs
~~~

This Handlebars template then can be used along with a handlebars template script to build the website from your repository.

## Create a project Pandoc template

A Pandoc template can be generated from the codemeta.json as well.

~~~
cmt codemeta.json page.tmpl
~~~

## Additional Project Documentation

- [user manual](user_manual.md)
- [installation](INSTALL.md)
- [license](LICENSE)
