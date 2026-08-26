# Action Items

## Bugs

Found 2026-08-25 while bringing CMTools onto the decision-record process. None
are fixed yet; each names the record carrying the reasoning.

- [x] `test/editor_test.ts` imported `setObjectFromString` from
      `src/editor.ts`, but it moved to `src/codemeta_editor.ts` in the
      2025-07-30 code re-org, so the file had not type-checked since — and
      because Deno type-checks the whole suite before running any of it, that
      one stale import aborted every other test file. Fixed 2026-08-25 with a
      second import. See `decisions/` DR-0012.
- [x] `test/deno_tasks_test.ts` — two assertions expected the `gen-code` task
      to be `deno run --allow-read --allow-write ./cmt.ts <files>`; the code
      writes `cmt <files>`. The code was right and the tests were wrong:
      `./cmt.ts` does not exist in a consuming project. Assertions corrected
      2026-08-25. See DR-0013.
- [ ] `addDenoTasks()` generates `compile`, `build` and `dist_*` tasks that
      chain sub-tasks with `;`. POSIX `;` returns only the last command's
      status, so a failing `deno compile` mid-chain exits 0. CMTools propagates
      this failure-masking into every Deno project it initialises. See DR-0005.
- [ ] `generate_text.ts` still exports `denoTasksText` for a `deno-tasks.json`
      format. Its `<deno-permissions>` and `<prog_name>` placeholders are not
      Handlebars expressions, so they are never resolved. Dead since
      `addDenoTasks()` took over. See DR-0002.
- [x] `CHANGES.md` v0.0.44's "Fixed Handlebars escaping and shell injection
      risks" has no corresponding commit or code change because it did not come
      from one — the fix arrived in the dependencies via `deno update`.
      Resolved 2026-08-25, no action needed. Worth knowing generally: a
      dependency refresh is periodic maintenance here, so a `CHANGES.md` entry
      is not always traceable to a CMTools commit. Where a changelog line
      records a *security* fix that came in this way, naming the dependency
      would make it verifiable.

## Documentation drift

- [ ] `release_0.0.45_goals.md` documents the config file as JSON at
      `~/.config/cmtools/config.json`. What shipped is YAML with a merge-all
      walk from cwd to `$HOME`. See DR-0008.
- [ ] `bootstrapping_with_cmt.md` documents a `--deno` flag that no longer
      exists and an older `gen-code` shape (`deno task version.ts ; deno task
      about.md ; ...`). It also does not mention that generated projects need
      `cmt` on `PATH`. See DR-0013.
- [ ] `someday_maybe.md` lists `make.ps1` as "under consideration" and
      configuration file support as "prototype"; both shipped in v0.0.46.
- [ ] `CHANGES.md` has no v0.0.45 entry although `v0.0.45` is tagged. The
      v0.0.43, v0.0.43c, v0.0.43d and v0.0.44 entries are cumulative restatements
      of each other rather than per-release deltas.

## Next Steps (coming features)

- [ ] **A `cmt`-written file's header does not say which lifecycle it belongs
      to.** `cmt` has two kinds of output: files regenerated on demand from
      `codemeta.json` (`version.go`, `README.md`, `about.md`, `CITATION.cff`),
      where any edit is overwritten and that is the point; and files scaffolded
      once at project initialisation (`Makefile`, `website.mak`, `publish.*`,
      `release.*`, `page.tmpl`), which the project owns from then on and is
      expected to edit.

      Both get the same `# generated with CMTools <version> <hash>` header, so
      the file itself does not say which it is. A reader — or an agent — can
      reasonably read "generated" as "safe to regenerate" and destroy work.
      This happened on 2026-08-26 in `~/Laboratory/knowledge`, whose `Makefile`
      carries a hand-added `KB_TOPICS` variable and `kb-topics-help` target
      that generate one man page per CLI verb. It was nearly regenerated on the
      strength of the header alone, and the loss would have been quiet twice
      over: `MAN_PAGES_1` is a shell glob over the `.1.md` files that already
      exist, so `make man` would then have stopped producing verb pages and
      still reported success.

      Small fix: make the scaffolded-once header say so — something like
      `# scaffolded by CMTools <version> <hash>; owned by this project, not
      regenerated` — so the distinction travels with the file rather than
      living only in a workspace `CLAUDE.md`.

      (An earlier draft of this item asked for protected regions and a
      codemeta-driven extension point. Both were premature: they solve
      clobbering during repeated regeneration, which is not something `cmt`
      does to these files. The header wording is the real gap.)

## Next session: cme interactive mode
