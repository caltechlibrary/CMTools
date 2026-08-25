---
id: "0013"
title: "The generated `gen-code` task invokes `cmt` on `PATH`; the tests assert a form that cannot work in a consuming project"
date: "2026-08-25"
status: accepted
kind: correction
trigger: plan-review
project: CMTools
phase: ""
supersedes: []
superseded_by: []
relates_to: ["0005", "0012"]
initiative: ""
session: agents/hand-off/2026-08-25T233000Z-cmtools-decision-records-pilot-and-hidden-test-suite-defects.spmd
decisions: []
tags: [deno, tasks, codegen, testing]
uuid: "01a03af1-e5cb-73c6-a794-932181c93ef6"
origin_host: "MACMINI-RD.local"
---

**Context.** `release_0.0.45_goals.md` specified the generated `gen-code` task
as:

```
deno run --allow-read --allow-write ./cmt.ts codemeta.json version.ts
```

`test/deno_tasks_test.ts` asserts exactly that string, in two tests. What
`src/deno_tasks.ts` actually writes is:

```
cmt codemeta.json version.ts
```

Both tests fail. They have failed since they were written, and nobody saw it,
because the file was in no `deno task`
([DR-0012](0012-deno-task-test-runs-the-whole-suite-a-broken-test.md)).

**Decision.** The shipped form is correct and the tests are wrong. Update the
two assertions to expect `cmt <files>`.

**Rationale.** `addDenoTasks()` writes into a *consuming* project's
`deno.json` — some other repository that CMTools has just initialised. The
planned form references `./cmt.ts`, a file that exists only in the CMTools
repository itself. In every project the task is actually written into, `deno
run ./cmt.ts` would fail with a missing-module error.

Checked rather than assumed: no consuming project in the workspace has a
`cmt.ts` (`cold`, `clasm` and `CL-Web-Components` do not), and none of them has
a `gen-code` task carrying the planned form — the feature postdates their
setup, so the broken command was never actually distributed.

The plan looks like it was written from inside CMTools, where `./cmt.ts` is
right there and the command works when you try it. Requiring `cmt` on `PATH` is
a real constraint on consuming projects and their CI, but it is the constraint
that a generated task can actually satisfy.

**Rejected alternatives.**

- *Change the code to match the plan and the tests.* Would make three artifacts
  agree, on a command that cannot run anywhere it gets written.
- *Emit `deno run jsr:.../cmt.ts`* or another form that needs no prior install.
  Removes the `PATH` dependency, and worth considering on its own merits — but
  it is a new decision about distribution, not a resolution of this
  contradiction, and CMTools is currently distributed as a compiled binary via
  installer scripts.

**Consequences.**

- Both assertions in `test/deno_tasks_test.ts` updated to expect
  `cmt <files>`, with a comment citing this record so the next reader does not
  "correct" them back toward the plan. Suite green at 35 tests.
- Generated projects need `cmt` installed and on `PATH` for `deno task
  gen-code` to work. That is not stated in `bootstrapping_with_cmt.md`, which
  still documents the older `deno task version.ts ; deno task about.md ; deno
  task CITATION.cff` form of `gen-code` and a `--deno` flag that no longer
  exists.
- The general lesson is DR-0012's: a test asserting a plan, never executed, is
  indistinguishable from no test — and it stays that way until something forces
  the suite to run whole.
