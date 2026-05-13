# Action Items

## Bugs

- [ ] Installation documentation does not need to be generated for projects of type documentation and presentation
- [ ] Makefile for documentation and presentation need to have save and status rules like those in Go Makefile

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

- [ ] **Funder organizations in config**: The `funder` codemeta field is a
      `person_or_organization_list` — funding bodies (NSF, NIH, Caltech, etc.) are a
      natural fit for the config. Decide whether to add a dedicated `funders` section to
      `.cmtoolsrc` alongside `profiles` and `person_lists`, or whether organization profiles
      and person lists already cover this adequately.
- [ ] **End-to-end review of interactive mode**: When `cme codemeta.json` is run with no
      attribute names it iterates all CodeMetaTerms. Verify that the config-aware menus
      (profiles, person lists, licenses) appear correctly for every relevant field in that
      full loop, not just when an individual attribute is named explicitly.
- [ ] **Skip / keep-existing UX in the full loop**: In the interactive loop, fields that
      already have a value show `Default: name: <value>`. The user needs a clear, consistent
      way to skip (keep existing) across all field types — simple fields, complex YAML fields,
      and the new config-menu fields — without the flow feeling inconsistent.
- [ ] **`--init` + `cme` handoff**: After `cmt --init deno-cli codemeta.json` generates the
      skeleton files, the natural next step is `cme codemeta.json` to fill in metadata.
      Make sure that flow works cleanly end-to-end with the config in place.
- [ ] **Auto-derive `issueTracker` from `codeRepository`**: When `codeRepository` is known
      and `issueTracker` is empty, calculate the issues URL automatically. For GitHub
      (`github.com/org/repo`) append `/issues`; same pattern applies to GitLab and Codeberg.
      Either auto-populate silently when `cme` writes the file, or prompt to confirm when
      the user edits the `issueTracker` field and the derived URL can be offered as a default.
- [ ] **Default `codeRepository` from `.git/config` remote origin**: When `cme` is run in
      a directory containing `.git/config` and `codeRepository` is empty, offer the remote
      origin URL as the default value. `src/gitcmds.ts` already has a private
      `getRemoteOriginURL()` that runs `git config --get remote.origin.url` — export it
      and normalise the result (convert `git@github.com:org/repo.git` SSH form to
      `https://github.com/org/repo`, strip trailing `.git`). This feeds naturally into the
      `issueTracker` auto-derive above.
