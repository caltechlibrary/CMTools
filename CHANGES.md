# CHANGES

## v0.0.46 (2026-06-18)

- Added global configuration system (`~/.cmtoolsrc`): profiles, licenses, person lists
- New `cme` flags: `--profiles`, `--person-lists`, `--apply-license`, `--global-config`
- New `--init` sub-types for Deno projects: `deno-cli`, `deno-bundle`, `deno-es-module`, `deno-webcomponent`
- Added non-programming project types: `--init documentation`, `--init presentation`
- Executable names now persisted to project-level `.cmtoolsrc` for seamless re-generation
- Refactored format registration: `FormatGenerator`/`registerGenerator` pattern in `transform.ts`
- Separate page templates for Caltech Library org vs personal/other projects
- Added `<footer>` to personal page template for A11y compliance
- Fixed Makefile generation for Go programs
- Fixed Makefile and `make.ps1` generation for deno-cli projects

## v0.0.44 (2026-05-12)

- Added generator for `add-col-scope.lua`
- Updated `website.mak` to include `add-col-scope.lua` filter
- Init now adds `site.css` and `add-col-scope.lua` to the list of files generated automatically
- Commented out pagefind from `website.mak` and `website.ps1`
- Commented out `search.md` from nav generation in `page.tmpl`
- Fixed rendering of suggested software versions in `about.md`
- Fixed bug in `website.mak` where the leading `.` of `.md` wasn't escaped when replacing with `.html`
- Added `-L` option to set the language
- Fixed bug where `--lang` wasn't setting the project language
- Fixed how `GROUP_ID` is calculated when generating `release.bash` and `release.ps1`
- Fixed Handlebars escaping and shell injection risks
- Added checksum support
- Fixed logic bugs across `generate_text.ts` and `transform.ts`

## v0.0.43c (2026-05-12)

- Added generator for `add-col-scope.lua`
- Updated `website.mak` to include `add-col-scope.lua` filter
- Init now adds `site.css` and `add-col-scope.lua` to the list of files generated automatically
- Commented out pagefind from `website.mak` and `website.ps1`
- Commented out `search.md` from nav generation in `page.tmpl`
- Fixed rendering of suggested software versions in `about.md`
- Fixed bug in `website.mak` where the leading `.` of `.md` wasn't escaped when replacing with `.html`
- Added `-L` option to set the language
- Fixed bug where `--lang` wasn't setting the project language

## v0.0.43 (2026-05-07)

- Added generator for `add-col-scope.lua`
- Updated `website.mak` to include `add-col-scope.lua` filter
- Init now adds `site.css` and `add-col-scope.lua` to the list of files generated automatically
- Commented out pagefind from `website.mak` and `website.ps1`
- Commented out `search.md` from nav generation in `page.tmpl`
- Fixed rendering of suggested software versions in `about.md`

## v0.0.42 (2026-05-07)

- Improved `page.tmpl` generation
- Added support for `site.css` generation

## v0.0.41 (2026-05-07)

- Improved `about.md` layout

## v0.0.40 (2025-08-06)

- Updated page templates generated for Caltech Library

## v0.0.39 (2025-08-06)

- Corrected CodeMeta version number (was incorrectly set to v0.0.34)
- Fixed issue #33: updated `search.md` generator to include proper path handling and process `?q=<SEARCH_TERM>` URL strings

## v0.0.38 (2025-08-01)

- Removed deprecated `--deno` option (issue #30)
- Added `links-to-html.lua`, `website.mak`, and `website.ps1` to defaults when using `cmt --init`
- Removed `--format` option; output format is now determined by filename
- Fixed issue #32: problem generating `INSTALL_NOTES_Windows.md`
- Fixed issue #28: problem with `-d` and generating `links-to-html.lua`
- Resolved issue #26: untangled code in `src/transform.ts` and `src/generate_text.ts`

## v0.0.37 (2025-07-28)

- Fixed formatting when generating `README.md` with runtime platform information
- Added support for generating `links-to-html.lua` for use with Pandoc website generation

## v0.0.36 (2025-07-24)

- Added generation of `INSTALL_NOTES_macOS.md` and `INSTALL_NOTES_Windows.md` to guide users through unsigned executable handling

## v0.0.35 (2025-07-09)

- Fixed issue #27: generated `version.go` and `version.py` had TypeScript syntax for the version string

## v0.0.34 (2025-07-07)

- Updated generated `README.md`
- Copyedits in documentation
- Bumped minimum required Deno version to 2.4

## v0.0.33 (2025-06-10)

- Added generators for `website.ps1`, `release.ps1`, `publish.ps1`
- Fixed typo in generated `installer.ps1`
- Fixed issue #25 with `installer.ps1`

## v0.0.32 (2025-06-06)

- Added generators for `website.ps1`, `release.ps1`, `publish.ps1`
- Fixed typo in generated `installer.ps1`

## v0.0.31 (2025-06-06)

- Improved `installer.ps1` to support both `.tar.gz` and `.zip` files by checking file extensions

## v0.0.30 (2025-06-05)

- Fixed bug in generating `installer.ps1`

## v0.0.29 (2025-05-27)

- Fixed bug where `softwareSuggestions` attribute was not being propagated
- Added example text for complex fields

## v0.0.28 (2025-05-25)

- Fixed bug where `softwareSuggestions` attribute was not being propagated

## v0.0.27 (2025-05-08)

- Fixed support for rendering `website.mak`
- Improved `release.bash` output: split release creation from file upload
- Fixed handling of embedded backticks in description

## v0.0.26 (2025-05-07)

- Added `--lang` option to specify the language for Makefile flavor (Go and Deno supported)
- Added support for generating `search.md`, a search page using PageFind indexes

## v0.0.25 (2025-05-05)

- Fixed bug in generating `installer.ps1` where path was wrong
- Improved test code
- Updated `metadatatools` dependency to v0.0.5
- Minimum Deno version is now 2.3

## v0.0.24 (2025-04-21)

- Fixed duplicate `copyrightYear` and `copyrightHolder` handling

## v0.0.23 (2025-04-10)

- Fixed missing `copyrightYear` and `copyrightHolder` handling

## v0.0.22 (2025-04-04)

- Fixed release rule in Makefile to include man pages

## v0.0.21 (2025-04-03)

- Fixed bug in rendering Markdown about document

## v0.0.20 (2025-03-31)

- Fixed bug where HTML entities were unnecessarily encoded when rendering `LICENSE` into `version.ts`

## v0.0.19 (2025-03-04)

- Fixes to generating `about.md`

## v0.0.18 (2025-02-12)

- Fixed Makefile for Go and Deno which required extra documents
- Added `DOCS` variable to generated Makefiles to control what is included in the release rule

## v0.0.17 (2025-02-11)

- Fixed formatting in `about.md` generation
- Improved Deno Makefile output
- Colorized error output
- Added `--init` option to simplify bootstrapping Python, Go, TypeScript, and JavaScript projects

## v0.0.16 (2025-02-11)

- Fixed typo in editor setup for `softwareRequirements` (issue #6)
- Added experimental generation of Makefile for Go and Deno projects

## v0.0.15 (2025-02-10)

- Fixed handling of generating `installer.sh`

## v0.0.14 (2025-02-03)

- The `--editor` option now uses the editor named in the `EDITOR` environment variable

## v0.0.13 (2025-02-03)

- Added support for rendering `README.md`, `INSTALL.md`, `installer.sh`, `installer.ps1`

## v0.0.11 (2025-01-29)

- Fixed editing `operatingSystem` attribute in `cme`

## v0.0.10 (2025-01-29)

- Simplified command line options in `cme`

## v0.0.9 (2025-01-28)

- Improved output formats
- Minor bug fixes

## v0.0.8 (2025-01-28)

- Improved text prompts
- Minor bug fixes

## v0.0.7 (2025-01-27)

- Improved `CITATION.cff` generation (issue #4)

## v0.0.6 (2025-01-27)

- Proof-of-concept CodeMeta tooling: edit `codemeta.json` and build code artifacts

## v0.0.4 (2025-01-15)

- Proof of concept: use `codemeta.json` in your build process
- Added missing `version.js` support

## v0.0.3 (2025-01-13)

- Proof of concept: use `codemeta.json` in your build process
- Added missing `version.js` support

## v0.0.2 (2025-01-10)

- Proof of concept: use `codemeta.json` in your build process
- Added people list normalization

## v0.0.1 (2025-01-10)

- Initial proof of concept: use `codemeta.json` in your build process
