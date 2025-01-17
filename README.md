
# CodeMeta Tools

[CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called `cmt` that can be used to generate project files and artifacts. It also provides a tool called `cme` to edit and manage the CodeMeta file. The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and release software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library's Digital Development Group.

The tools are intended to be run from the project root directory. `cmt` expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file's extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. `cme` expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

`cme` is used to create manage "codemeta.json". `cmt` is used to generate the following.

- CITATION.cff
- version.ts, version.js, version.go or version.py
- about.md
- page.hbs (handlebars template) or page.tmpl (Pandoc template)

## Create and manage your file

`cme` is for managing your "codemeta.json" file.  Using the "interactive" option it will prompt for the various top level attributes and allow you to set them. For complex list attributes like "author", "contributor", "maintainer" you can enter those using YAML notation. Here's an example of setting up to use `cme` to create and edit the "codemeta.json" file.

~~~shell
# Set our EDITOR environment variable
export EDITOR=micro
cme -e -i codemeta.json
~~~

The will let you iterate over the top level CodeMeta object attributes. For multi line or list attributes your favorate editor will be used to create or update the values.

Here's an example of updating the version and `.releaseNotes` attributes (I assume you have the
EDITOR environment variable already set).

~~~shell
cme -e codemeta.json version releaseNotes
~~~

Since the version is short you'll just be prompted to type in a new version string. You release notes maybe longer so for that you'll drop into your editor.


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

