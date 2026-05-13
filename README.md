

# CMTools

[CodeMeta](https://codemeta.github.io) Tools provides a simple command line tool called `cmt` that can be used to generate project files and software artifacts. It provides a tool called `cme` to edit and manage the CodeMeta file.

The project focuses on leveraging CodeMeta data, directory name and Git repo information for building and release software written in Python, Go, JavaScript or TypeScript. It was motivated by the practices in Caltech Library's Digital Development Group.

The tools are intended to be run from the project root directory. `cmt` expects the file path of your codemeta.json file as well as one or more target files to be generated. The target file's extension determines the generated content. The tool can generate the following project files based on the contents of the codemeta.json file. `cme` expects the file path of your codemeta.json file and optionally the attributes of the CodeMeta object you wish to manage.

`cme` is used to create and manage "codemeta.json". `cmt` is used to generate the following.

- README.md
- INSTALL.md
- installer.sh
- installer.ps1
- CITATION.cff
- version.ts, version.js, version.go or version.py
- about.md
- page.tmpl (Pandoc template) or page.hbs (handlebars template)
- site.css
- Makefile (for Go or Deno based projects)
- website.mak
- release.bash
- publish.bash

## Release Notes

- version: 0.0.45
- status: active
- released: 2025-05-13

- Added generator for add-col-scope.lua
- Update website.mak file to include add-col-scope.lua filter
- Init will now add a site.css and add-col-scope.lua to list files generated automatically
- Commented out pagefind from website.mak and website.ps1
- Commented out search.md from nav generation in page.tmpl
- Fixed rendering of suggested software versions in about.md
- Fixed bug in render website.mak where is didn't escape the learing period of ".md" when replacing with ".html".
- Added `-L` option to set the language
- Fixed bug where -lang wasn't setting the project language
- Fixed our GROUP_ID is calculated when generating release.bash and release.ps1
- Fixing Handlebars escaping, shell injection risks
- Added checksum support
- Fixed logic bugs across generate_text.ts and transform.ts
- Updated documentation and presentation Makefile template to include status, save, website, clean-website rules and BRANCH variable, matching the Go project Makefile pattern
- Updated release.bash template to upload GitHub release assets one at a time with per-file progress messages instead of a single bulk upload
- Updated release.ps1 template with the same one-at-a-time upload approach using a foreach loop
- Changed upload order in both release scripts to upload the checksum file first as an early network connectivity check, followed by the distribution zip files


### Authors

- Doiel, R. S.


### Contributors

- Morrell, Tom


### Maintainers

- Doiel, R. S.

## Software Requirements

- Deno >= 2.7
- CMTools >= 0.0.43

### Software Suggestions

- GNU Make >= 3.81
- Pandoc >= 3.9
- Git >= 2.39



## Related resources


- [Download](https://github.com/caltechlibrary/CMTools/releases/latest)
- [Getting Help, Reporting bugs](git+https://github.com/caltechlibrary/CMTools/issues)
- [LICENSE](https://caltechlibrary.github.io/CMTools/LICENSE)
- [Installation](INSTALL.md)
- [About](about.md)

