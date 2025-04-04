%cme(1) user manual | version 0.0.22 03fba7e
% R. S. Doiel
% 2025-04-04

# NAME

cme

# SYNOPSIS

cme CODEMETA_JSON [OPTION ...] 

cme CODEMETA_JSON ATTRIBUTE_NAME [ATTRIBUTE_NAME ...] [OPTION ...]

cme CODEMETA_JSON ATTRIBUTE_NAME=ATTRIBUTE_VALUE [ATTRIBUTE_NAME=ATTRIBUTE_VALUE ...] [OPTION ...]

# DESCRIPTION

cme is a CodeMeta file editing tool.  When called with only the CODEMETA_JSON filename
it will read in the CodeMeta file, report any errors, extrapolate values if needed. It will
then display a pretty printed normalized version of your CodeMeta file.

cme will also let you modify specific attributes in a CodeMeta file. It does this by
reading the CodeMeta file and prompting you to type in the value. If you use the editor
option it'll launch your editor use it to set the value saving changes are saved back to
the CodeMeta file.

For attributes like author, contributor, maintainer and keyword should be typed in using
YAML syntax. The YAML will be converted to JSON and used to update your CodeMeta file.

If you provide one or more attribute names the attributes will be available to edit in the order
you've requested them to be edited.

Two date fields are set if they are not previously set, "dateCreated" and "dateModified". The 
"dateModified" is updated each time you change something in the CodeMeta file unless you explicitly
edit it.

For the simple fields like version, name, description, releaseNotes you can set their values
directly on the command line using an equal sign between the attribute name and the value. If
the value includes spaces you need to wrap them in quotes. See the EXAMPLE below.

# OPTION

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-e, --editor
: use the editor named in the EDITOR environment variable. If variable is unset then use 
the default text editor. On Windows that is notepad.exe. On Linux and macOS it is nano.

# EXAMPLES

Create a new CodeMeta file. If no attribute names are included then you will
be prompt for each attribute.

~~~
cme codemeta.json
~~~

Set the version number in your codemeta.json file and add/replace the `.releaseNotes`.

~~~
cme codemeta.json version releaseNotes
~~~

Set the version number to "0.0.1" and release notes to "Initial Concept"
without being prompted.

~~~shell
cme codemeta.json version=0.0.1 release='Initial Concept'
~~~

If Micro Editor is installed you can edit the description in micro using the
"-e" option.

~~~shell
cme codemeta.json description -e
~~~


