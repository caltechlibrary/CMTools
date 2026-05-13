# Action Items

## Bugs

- [x] Installation documentation does not need to be generated for projects of type documentation and presentation
- [x] Makefile for documentation and presentation need to have save and status rules like those in Go Makefile

## Next Steps (coming features)

- [x] CMTools should have a user global configuration (`~/.cmtoolsrc`) storing:
      person/org profiles (for author/contributor/maintainer fields), pre-defined person
      lists (e.g. a whole team applied at once), and license templates (inline text or path
      to file). `cme` flags: `--profiles`, `--person-lists`, `--apply-license`, `--global-config`.
      Config is YAML. Search walks up from cwd to home directory (first `.cmtoolsrc` found wins).
- [x] I need to support no-programming projects, like writing presentations and documentation projects
      I want to be able to pass an initialization label to generate the basic files include Makefile, webmake.mak
      so the usual things are in place.
- [ ] There is additional metadata outside the codemeta.json file like
      executable files basenames that would be helpful and are not captured,
      what's the right way to do this without adding another "project" file to a
      repository
- [ ] For deno projects I have three general types, each have their own set of
      project artifacts. Use hyphenated sub-type labels for `--init`:
  1. `--init deno-cli`: CLI executable(s). Extra CLI args after codemeta.json
     are the executable names (e.g. `cmt --init deno-cli codemeta.json cmt cme`).
     Makefile needs `deno compile` targets per executable. Already mostly works
     as `--init deno`; needs renaming and multi-executable support.
  2. `--init deno-bundle`: Browser-side TypeScript bundled to a single .js file.
     Makefile has a bundle build target. No version.ts needed.
  3. `--init deno-es-module`: Browser-side TypeScript shipped as ES modules
     (no bundling). Minimal Makefile — mostly lint/type-check, no compile step.
  4. `--init deno-webcomponent`: Web components (example: CL-Web-Components).
     Different Makefile targets and deno.json tasks. Generates custom-elements.json
     (via manifest analyzer) and demo/docs HTML. No version.ts needed.
- [ ] With the advent of footer-global component in CL-web-components it makes
      sense to adjust the page templates to include web component elements for
      DLD projects. It's a little like generating the deno tasks knowing the
      executible names. I would like to be able to provide a simple standard
      HTML template but have it "just work" for Caltech Library purposes and
      have it useful outside where CL branding is not appropriate. Example, I'd
      like to use CMTools in my personal projects but they should not be branded
      as Caltech
- [x] Work with Twila to come up with some default vanilla CSS generation (using
      CSS variables for easy customization)
- [ ] I need some sort of way of reducing the foot print of adding generated
      documents types
  - put each type in it's on module
  - use generated_text.ts as a means of re-exporting the types
  - create mechanism like `element.define()` in web component to "register" the
    supported types in transform.ts
  - think about types which could benefit from parameterrs (e.g. generate deno
    tasks for projects with multiple executables)
  - I want to be able to touch at most two plaves to add a new type (e.g. add
    the defined generated type and the type as module)
  - Do I need to have templates trigger based on file extension? I think I
    should always generate specific documents with with the `cmt` command, this
    would simplify the logic
- [x] Complete or remove the dead code in `src/deno_tasks.ts`; rewrote as `addDenoTasks()`;
      called automatically for all `--init deno-*` types; no separate `--deno` flag.
- [x] Move the generated text from transforms.ts to generated_text.ts

## Next session: cme interactive mode

- [x] **Funder organizations in config**: `funder` is `person_or_organization` type.
      Existing `profiles` in `.cmtoolsrc` already handle org entries (set `type: Organization`
      with `name` and optional `id`). No dedicated `funders` section needed.
- [ ] **End-to-end review of interactive mode**: When `cme codemeta.json` is run with no
      attribute names it iterates all CodeMetaTerms. Verify that the config-aware menus
      (profiles, person lists, licenses) appear correctly for every relevant field in that
      full loop, not just when an individual attribute is named explicitly.
- [x] **Skip / keep-existing UX in the full loop**: `.` now skips for all field types.
      Complex YAML fields prompt says "Enter '.' on an empty line to skip/keep existing."
      Simple fields prompt says "Enter or '.' to keep current." Config menus already use `q`.
- [ ] **`--init` + `cme` handoff**: After `cmt --init deno-cli codemeta.json` generates the
      skeleton files, the natural next step is `cme codemeta.json` to fill in metadata.
      Make sure that flow works cleanly end-to-end with the config in place.
- [x] **Auto-derive `issueTracker` from `codeRepository`**: When `issueTracker` is empty
      and `cm.codeRepository` is set, `/issues` is appended and offered as the prompt
      default. Works across GitHub, GitLab, and Codeberg (all use the same path pattern).
- [x] **Default `codeRepository` from `.git/config` remote origin**: `getRemoteOriginURL()`
      is now exported from `src/gitcmds.ts` with SSH→HTTPS normalization and `.git` stripping
      via `normalizeRemoteURL()`. When `codeRepository` is empty the git remote is offered
      as the suggested default in the `cme` prompt.
