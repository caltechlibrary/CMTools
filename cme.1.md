%cme(1) user manual | version 0.0.44b 46e1583
% R. S. Doiel
% 2026-05-12

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

-p, --profiles
: list the person and organization profiles available in the global configuration file
(`~/.cmtoolsrc` or the path given by `--global-config`).

-P, --person-lists
: list the pre-defined person/organization lists available in the global configuration file.

-A, --apply-license
: select a license from the global configuration, write its text to `./LICENSE`,
and update the `license` field in the codemeta.json file with the license URL
(if one is configured).

-g, --global-config PATH
: load configuration from PATH, bypassing the directory walk-up search.

# GLOBAL CONFIGURATION

cme reads a configuration file that stores person/organization profiles, pre-defined
team lists, and license templates. When editing person fields such as author, contributor,
or maintainer, cme will offer to populate the field from a configured profile or list
rather than requiring manual YAML entry. When editing the license field, cme will
offer to apply a configured license and write `./LICENSE` automatically.

Configuration is found by walking up from the current directory to the home directory,
checking for `.cmtoolsrc` at each level (first found wins), then falling back to
`~/.config/cmtools/config.yaml`. For example, from `~/WorkLab/myproject`:

1. `~/WorkLab/myproject/.cmtoolsrc`
2. `~/WorkLab/.cmtoolsrc`
3. `~/.cmtoolsrc`
4. `~/.config/cmtools/config.yaml`

This lets you keep a work config in `~/WorkLab/.cmtoolsrc` and a personal config in
`~/.cmtoolsrc` and have the right one apply automatically based on where you are working.

Use `--global-config PATH` to bypass the walk and load a specific file instead.

Example `~/.cmtoolsrc`:

~~~yaml
default_profile: rdoiel
default_license: caltech

profiles:
  rdoiel:
    type: Person
    givenName: R. S.
    familyName: Doiel
    email: rdoiel@caltech.edu
    id: https://orcid.org/0000-0003-0900-6903
    affiliation:
      type: Organization
      name: Caltech Library
  caltech-library:
    type: Organization
    name: Caltech Library
    email: library@caltech.edu

licenses:
  caltech:
    name: Caltech License
    file: ~/.config/cmtools/licenses/caltech.txt
  agpl3:
    name: GNU Affero General Public License v3.0 or later
    url: https://spdx.org/licenses/AGPL-3.0-or-later.html
    text: |
      GNU AFFERO GENERAL PUBLIC LICENSE
      Version 3, 19 November 2007
      ...

person_lists:
  dld-team:
    - type: Person
      givenName: R. S.
      familyName: Doiel
      id: https://orcid.org/0000-0003-0900-6903
    - type: Person
      givenName: Tom
      familyName: Morrell
      id: https://orcid.org/0000-0001-9266-5146
~~~

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


