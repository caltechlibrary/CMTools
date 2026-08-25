# Decision Records — index

Generated file. Do not hand-edit.

```
DR-0013  2026-08-25  accepted     correction   plan-review      -     The generated `gen-code` task invokes `cmt` on `PATH`; the tests assert a form that cannot work in a consuming project
DR-0012  2026-08-25  accepted     decision     plan-review      -     `deno task test` runs the whole suite; a broken test file gets fixed, not routed around
DR-0011  2026-06-18  accepted     decision     implementation   -     Separate Caltech Library and personal page templates, and an A11y `<footer>` in the personal one
DR-0010  2026-06-18  accepted     correction   implementation   -     Every `cmt` invocation needs `--allow-env`, because config loading reads `$HOME`
DR-0009  2026-06-18  accepted     decision     implementation   -     Executable names persist to the project-level `.cmtoolsrc` so regeneration does not need them re-typed
DR-0008  2026-06-18  accepted     decision     implementation   -     Config resolution is YAML, and merges every `.cmtoolsrc` from the current directory up to `$HOME`
DR-0007  2026-06-18  accepted     decision     implementation   -     Format support becomes a registry: `FormatGenerator` and `registerGenerator()` replace the hardcoded format list
DR-0006  2026-05-12  accepted     decision     design           -     Four `deno-*` sub-types replace the undifferentiated `deno`/`typescript`/`javascript` init values
DR-0005  2026-05-12  accepted     decision     implementation   -     `addDenoTasks()` takes explicit parameters, writes plain-string tasks, and backs up before writing; no `--deno` flag
DR-0004  2026-05-12  accepted     decision     design           -     Non-programming projects extend `--init` rather than adding a `--type` flag
DR-0003  2026-05-12  accepted     decision     design           sup   Global configuration: profiles, licenses and person lists in `~/.cmtoolsrc`
DR-0002  2025-07-30  accepted     decision     implementation   -     Generated file content lives in `generate_text.ts`; `transform.ts` holds only the transforms and mappings
DR-0001  2025-01-09  accepted     decision     design           -     CMTools is a Deno + TypeScript CLI, and Pandoc leaves the compile path
```
