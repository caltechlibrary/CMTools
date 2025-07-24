Installation for development of **CMTools**
===========================================

**CMTools** [CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called &#x60;cmt&#x60; that can be used to generate project files and software artifacts. It provides a tool called &#x60;cme&#x60; to edit and manage the CodeMeta file.

The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and release software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library&#x27;s Digital Development Group.

The tools are intended to be run from the project root directory. &#x60;cmt&#x60; expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file&#x27;s extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. &#x60;cme&#x60; expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

&#x60;cme&#x60; is used to create and manage &quot;codemeta.json&quot;. &#x60;cmt&#x60; is used to generate the following.

- README.md
- INSTALL.md
- INSTALL_NOTES_macOS.md
- INSTALL_NOTES_Windows.md
- installer.sh
- installer.ps1
- CITATION.cff
- version.ts, version.js, version.go or version.py
- about.md
- page.tmpl (Pandoc template) or page.hbs (handlebars template)
- Makefile (for Go or Deno based projects)
- website.mak
- release.bash
- publish.bash

Quick install with curl or irm
------------------------------

There is an experimental installer.sh script that can be run with the following command to install latest table release. This may work for macOS, Linux and if you’re using Windows with the Unix subsystem. This would be run from your shell (e.g. Terminal on macOS).

~~~shell
curl https://caltechlibrary.github.io/CMTools/installer.sh | sh
~~~

This will install the programs included in CMTools in your `$HOME/bin` directory.

If you are running Windows 10 or 11 use the Powershell command below.

~~~ps1
irm https://caltechlibrary.github.io/CMTools/installer.ps1 | iex
~~~

### If your are running macOS or Windows

You may get security warnings if you are using macOS or Windows. See the notes for the specific operating system you're using to fix issues.

- [INSTALL_NOTES_macOS.md](INSTALL_NOTES_macOS.md)
- [INSTALL_NOTES_Windows.md](INSTALL_NOTES_Windows.md)

Installing from source
----------------------

### Required software

- Deno &gt;&#x3D; 2.4
- CMTools &gt;&#x3D; 0.0.33

### Steps

1. git clone https://github.com/caltechlibrary/CMTools
2. Change directory into the `CMTools` directory
3. Make to build, test and install

~~~shell
git clone https://github.com/caltechlibrary/CMTools
cd CMTools
make
make test
make install
~~~

