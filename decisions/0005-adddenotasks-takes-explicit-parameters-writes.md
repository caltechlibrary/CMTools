---
id: "0005"
title: "`addDenoTasks()` takes explicit parameters, writes plain-string tasks, and backs up before writing; no `--deno` flag"
date: "2026-05-12"
status: accepted
kind: decision
trigger: implementation
project: CMTools
phase: "0.0.45"
supersedes: []
superseded_by: []
relates_to: ["0002", "0006"]
initiative: ""
session: ""
decisions: ["One exported function with explicit parameters, replacing global state", "deno.json task values are plain strings, not { cmd, desc } objects", "deno.json is backed up to deno.json.bak before modification; existing tasks are preserved", "No --deno flag; the --init deno-* project type is the signal"]
tags: [deno, tasks, codegen]
uuid: "01a03af1-e5cb-73c6-a794-93194231d204"
origin_host: "MACMINI-RD.local"
---

**Context.** `src/deno_tasks.ts` was 56 lines of entirely commented-out code
that had never run. It referenced four identifiers that did not exist in its
scope (`isDeno`, `denoTasks`, `GREEN`, `ERROR_COLOR` — the latter two live in
`src/colors.ts`), read from a global `denoTasks` object that nothing ever
populated, and contained an outright syntax error, `Object(tasks).keys()` where
`Object.keys(tasks)` was meant. Meanwhile `cmt.ts` set `app.deno = true` for
`--init deno` and never read it, and the help text advertised a `--deno` option
that did nothing.

**Decision.** Rewrite the module as a single exported
`addDenoTasks(denoJsonPath, sourceFile, outputFiles)` taking explicit
parameters. Task values are plain strings. `deno.json` is copied to
`deno.json.bak` before modification and existing tasks are preserved. The
`--deno` flag is not added; `cmt.ts` checks `lang.startsWith("deno")` after the
`--init` switch and calls `addDenoTasks()` automatically. The dead
`app.deno = true` assignments are removed.

**Rationale.** Explicit parameters are what made the module testable at all —
the commented-out version could not run without a global that nothing set, so
there was nothing to write a test against.

Plain-string task values are not a style preference: the original plan
specified `{ cmd, desc }` objects, and Deno does not accept that shape in
`deno.json`. The description field would have been nice and there is nowhere to
put it.

No `--deno` flag because the project type already carries the information.
Having both would mean deciding what `--init deno-cli --no-deno` means, and the
flag it replaces was already vestigial — advertised in help, set in code, read
nowhere.

**Rejected alternatives.**

- *`{ cmd, desc }` task objects.* The original plan. Rejected by Deno's own
  `deno.json` schema, not by preference.
- *Keep and wire up the `--deno` flag.* Backward compatible with the help text,
  but the help text documented behaviour that never existed, so there was no
  working usage to preserve.
- *Repair the commented-out code in place.* It carried a syntax error, four
  undefined references and a global-state design; the parts worth keeping were
  the backup step and the create-if-missing handling, both a few lines.

**Consequences.**

- `test/deno_tasks_test.ts` exists because the rewrite made the module
  testable. It is one of two test files that no `deno task` currently runs.
- **What shipped differs from the plan in one respect worth noting:** the
  generated `gen-code` task is `cmt <files>`, invoking the installed binary,
  where the plan specified `deno run --allow-read --allow-write ./cmt.ts
  <files>`. The shipped form requires `cmt` on `PATH` in every consuming
  project; the planned form did not. No record was written when that changed.
- The function also generates `compile`, `build` and `dist_*` tasks that chain
  sub-tasks with `;`. POSIX `;` returns only the last command's status, so a
  failing `deno compile` in the middle of `deno task dist_linux_x86_64` exits
  0. CMTools therefore propagates that failure-masking pattern into every Deno
  project it initialises. Recorded here as a consequence; the fix is not part
  of this record.
