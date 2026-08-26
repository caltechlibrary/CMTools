---
id: "0012"
title: "`deno task test` runs the whole suite; a broken test file gets fixed, not routed around"
date: "2026-08-25"
status: accepted
kind: decision
trigger: plan-review
project: CMTools
phase: ""
supersedes: []
superseded_by: []
relates_to: ["0005", "0013"]
initiative: ""
session: agents/hand-off/2026-08-25T233000Z-cmtools-decision-records-pilot-and-hidden-test-suite-defects.spmd
decisions: ["`test` invokes `deno test` with the union permission set and lets Deno discover the files", "Per-file tasks are kept, and now exist for all six test files", "`;` chaining is removed so a failure propagates"]
tags: [testing, deno, tasks, tdd]
uuid: "01a03af1-e5cb-73c6-a794-9320fc9a4c15"
origin_host: "MACMINI-RD.local"
---

**Context.** Bringing CMTools onto the design/decide/plan process makes TDD the
implementation half, which only works if the test command is trustworthy. It
was not:

```json
"test": "deno task codemeta_test.ts ; deno task person_or_organization_test.ts ; deno task transform_test.ts"
```

Three of six test files, named individually. `test/config_test.ts` and
`test/deno_tasks_test.ts` were in no task at all; `test/editor_test.ts` had a
per-file task but was not in `test`. And POSIX `;` returns only the last
command's status, so a failure in either of the first two exited 0 — the same
failure-masking pattern CMTools itself generates into other projects
([DR-0005](0005-adddenotasks-takes-explicit-parameters-writes.md)).

Running the full suite explains the narrowing. `test/editor_test.ts` calls
`edit.setObjectFromString()`, which `src/editor.ts` does not export — the
function moved to `src/codemeta_editor.ts` in the 2025-07-30 "code re-org", and
the test's import was never updated. Deno type-checks the whole suite before
running any of it, so that one stale import aborts every other file. The `test`
task appears to have been narrowed to route around it.

What the narrowing then hid, for over a year:

| File | State |
|---|---|
| `config_test.ts` | 23 tests, never run by any task — all pass |
| `deno_tasks_test.ts` | 5 tests, never run by any task — 2 fail, see [DR-0013](0013-the-generated-gen-code-task-invokes-cmt-on-path.md) |
| `editor_test.ts` | does not type-check; blocks the suite |

**Decision.** `test` becomes `deno test --allow-import --allow-env --allow-run
--allow-read --allow-write`, letting Deno discover the files. Per-file tasks
stay for focused runs, and the two that were missing were added. No `;`
chaining.

**Rationale.** File discovery means a new test file is run the moment it
exists, rather than when someone remembers to add a task and a name to the
chain. The evidence that this matters is `config_test.ts`: 23 passing tests
that contributed nothing for months because they were never invoked.

Routing the task around a broken file trades a visible failure for an invisible
one. The failure was still there; it just stopped being reported, and took two
other files down with it.

**Rejected alternatives.**

- *Keep the explicit file list and add the three missing files.* Restores
  coverage today and leaves the same trap for the next test file added. The
  list is a second place to remember something the filesystem already knows.
- *Exclude `editor_test.ts` so the suite goes green now.* This is what the old
  task effectively did. A green suite that skips a known-broken file is the
  problem, not the fix.
- *Reuse the existing `test-all` task* (which does run everything). It carries
  `--reload` and `--coverage`, so it is a slow CI-shaped command, and
  `--allow-net`, which nothing in the suite needs.

**Consequences.**

- `deno task test` briefly exited 1, correctly reporting a state that already
  existed — three broken things, none caused by the rewiring. Exit-code
  propagation was verified against that failure before the fixes landed.
- `--allow-net` is deliberately not in the permission set; the suite passes
  without it. `--allow-import` is needed by `codemeta_test.ts`.
- Both follow-on fixes were made the same day: `editor_test.ts` gained a second
  import for `codemeta_editor.ts` — only `setObjectFromString` moved,
  `getEditorFromEnv` and `editTempData` are still in `editor.ts` — and the two
  assertions were corrected per DR-0013. The suite is green at **35 tests**,
  against dependency versions freshly raised by `deno update` in the same
  sitting.
