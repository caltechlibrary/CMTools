# Action Items

## Bugs

- [x] When using `--init` for presentation the add-col-scope.lua file isn't being generated

## Next Steps (coming features)

- [x] There is additional metadata outside the codemeta.json file like
      executable files basenames that would be helpful and are not captured,
      what's the right way to do this without adding another "project" file to a
      repository?
  - Decision: extend `.cmtoolsrc` with `executables: string[]`. No new file
    format — uses the existing per-project config mechanism already supported
    by `configSearchPaths()` (walks cwd → home; project-level file takes
    precedence).
  - `Config` interface now has `executables?: string[]`; `tryLoadPath` reads it.
  - `loadConfig()` changed from first-match to merge-all: all `.cmtoolsrc`
    files along the search path are merged so a project-level file with only
    `executables` does not shadow user-level `profiles`/`licenses` in `cme`.
    Higher-priority entries win on scalar fields and map key collisions.
  - `cmt --init deno-cli codemeta.json cmt cme`: saves `executables: [cmt, cme]`
    to `./.cmtoolsrc` after successful generation.
  - `cmt codemeta.json Makefile` (re-generation): reads `executables` from the
    merged config as fallback when no names appear on the CLI.
- [ ] For deno projects I have three general types, each have their own set of
      project artifacts. Use hyphenated sub-type labels for `--init`:
  1. [x] `--init deno-cli`: CLI executable(s). Extra CLI args after codemeta.json
     are the executable names (e.g. `cmt --init deno-cli codemeta.json cmt cme`).
     Makefile needs `deno compile` targets per executable. Already mostly works
     as `--init deno`; needs renaming and multi-executable support.
     Implemented: executable names from CLI args fill `PROGRAMS` in the Makefile
     and generate per-executable `compile` tasks, a `compile` chain, a `build`
     task, and per-platform dist tasks in `deno.json`. No executables → placeholder.
  2. [x] `--init deno-bundle`: Browser-side TypeScript bundled to a single .js file.
     Makefile has a bundle build target. No version.ts needed.
     Fixed: filters out INSTALL.md, INSTALL_NOTES_*.md, installer.* (native-binary
     artefacts not relevant to browser libraries).
  3. [x] `--init deno-es-module`: Browser-side TypeScript shipped as ES modules
     (no bundling). Minimal Makefile — mostly lint/type-check, no compile step.
     Same install-artefact filter applied.
  4. [x] `--init deno-webcomponent`: Web components (example: CL-Web-Components).
     Makefile generates custom-elements.json via @custom-elements-manifest/analyzer
     and includes a demo target. No version.ts needed.
     Same install-artefact filter applied.
- [x] With the advent of footer-global component in CL-web-components it makes
      sense to adjust the page templates to include web component elements for
      DLD projects. It's a little like generating the deno tasks knowing the
      executible names. I would like to be able to provide a simple standard
      HTML template but have it "just work" for Caltech Library purposes and
      have it useful outside where CL branding is not appropriate. Example, I'd
      like to use CMTools in my personal projects but they should not be branded
      as Caltech
  - `clPageHbsText` (caltechlibrary org): Caltech Library header/logo, CL site
    CSS, `footer-global` web component — already complete.
  - `pageHbsText` (personal/other org): removed CL-specific "All Library Apps"
    nav link; added a plain `<footer>` with project name for A11y symmetry.
  - Branching on `git_org_or_person === "caltechlibrary"` in `transform.ts`
    `page.hbs` and `page.tmpl` render lambdas (from task #6) selects the right
    template automatically.
- [x] Work with Twila to come up with some default vanilla CSS generation (using
      CSS variables for easy customization)
- [x] I need some sort of way of reducing the foot print of adding generated
      documents types
  - `FormatGenerator` interface and `RenderFn` type exported from `transform.ts`
  - `registerGenerator()` replaces both the `isSupportedFormat()` array and the
    `switch` statement in one call; all 27 formats registered at the bottom of
    `transform.ts` — two touches to add a new type: (1) template text in
    `generate_text.ts`, (2) `registerGenerator()` in `transform.ts`
  - Makefile / make.ps1 lang dispatch absorbed into the render lambdas
  - Page template CL-branding check moved into `page.hbs` / `page.tmpl` render
    lambdas; no top-level branching needed
  - `generate_text.ts` unchanged — still a plain barrel of template strings
- [x] Complete or remove the dead code in `src/deno_tasks.ts`; rewrote as `addDenoTasks()`;
      called automatically for all `--init deno-*` types; no separate `--deno` flag.
- [x] Move the generated text from transforms.ts to generated_text.ts

## Next session: cme interactive mode

- [x] **Funder organizations in config**: `funder` is `person_or_organization` type.
      Existing `profiles` in `.cmtoolsrc` already handle org entries (set `type: Organization`
      with `name` and optional `id`). No dedicated `funders` section needed.
- [x] **End-to-end review of interactive mode**: When `cme codemeta.json` is run with no
      attribute names it iterates all CodeMetaTerms. Verify that the config-aware menus
      (profiles, person lists, licenses) appear correctly for every relevant field in that
      full loop, not just when an individual attribute is named explicitly.
      Fixed: `operatingSystem` silently not saved in `patchObject`; added missing fields
      `installUrl`, `processorRequirements`, `publisher`, `referencePublication` to `CodeMeta`
      class (fromObject/toObject/patchObject); changed `funder` type to
      `person_or_organization_list` to match class array storage; changed `copyrightHolder`
      type to `text` to match class string storage; added `publisher` to `complexFieldList`.
- [x] **Skip / keep-existing UX in the full loop**: `.` now skips for all field types.
      Complex YAML fields prompt says "Enter '.' on an empty line to skip/keep existing."
      Simple fields prompt says "Enter or '.' to keep current." Config menus already use `q`.
- [x] **`--init` + `cme` handoff**: After `cmt --init deno-cli codemeta.json` generates the
      skeleton files, the natural next step is `cme codemeta.json` to fill in metadata.
      Make sure that flow works cleanly end-to-end with the config in place.
      Fixed: `cmt --init` now creates a minimal skeleton `codemeta.json` (name from cwd,
      version 0.0.1) when the file doesn't exist, enabling "init-first" bootstrapping.
      Fixed: generated `gen-code` deno task now uses `cmt` binary instead of
      `deno run --allow-read --allow-write ./cmt.ts`.
- [x] **Auto-derive `issueTracker` from `codeRepository`**: When `issueTracker` is empty
      and `cm.codeRepository` is set, `/issues` is appended and offered as the prompt
      default. Works across GitHub, GitLab, and Codeberg (all use the same path pattern).
- [x] **Default `codeRepository` from `.git/config` remote origin**: `getRemoteOriginURL()`
      is now exported from `src/gitcmds.ts` with SSH→HTTPS normalization and `.git` stripping
      via `normalizeRemoteURL()`. When `codeRepository` is empty the git remote is offered
      as the suggested default in the `cme` prompt.
