
%cme(1) user manual | version 0.0.5 55c011e
% R. S. Doiel
% 

# NAME

cme

# SYNOPSIS

cme [OPTIONS] CODEMETA_JSON
cme [OPTIONS] CODEMETA_JSON ATTRIBUTE_NAME [ATTRIBUTE_NAME ...]

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

# OPTIONS

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

-e, --editor
: use the editor specified by the EDITOR environment name.
If EDITOR is unset it will fallback to standard input.

-i, --interactive
: interactively create a CodeMeta file by stepping through
the top level variables.

-a, --attributes
: list the top level attribute names available for editing.

# EXAMPLES

Create a new CodeMeta file. In the following example the environment
variable EDITOR will be used to invoke your editor for editing multi line
CodeMeta attributes like author, contributor, maintainer, keywords,
required software, etc.  The "-i" means edit all top level attributes
sequentially.

~~~
cme -e -i codemeta.json
~~~

Set the version number in your codemeta.json file and add/replace the `.releaseNotes`.

~~~
cme -e codemeta.json version releaseNotes
~~~

Add authors to your codemeta.json using the "micro" editor.  NOTE: you enter authors as YAML.

~~~
cme -e codemeta.json authors
~~~

