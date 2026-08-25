---
id: "0010"
title: "Every `cmt` invocation needs `--allow-env`, because config loading reads `$HOME`"
date: "2026-06-18"
status: accepted
kind: correction
trigger: implementation
project: CMTools
phase: "0.0.46"
supersedes: []
superseded_by: []
relates_to: ["0008"]
initiative: ""
session: ""
decisions: []
tags: [deno, permissions, config]
uuid: "01a03af1-e5cb-73c6-a794-931ec2578670"
origin_host: "MACMINI-RD.local"
---

**Context.** Adding the global configuration system gave `cmt.ts` a new
transitive dependency on the environment: it calls `loadConfig()`, which calls
`Deno.env.get("HOME")` to locate `.cmtoolsrc` and the
`~/.config/cmtools/config.yaml` fallback. Deno permissions are per-invocation,
so every `deno run` and `deno compile` of `cmt.ts` needed `--allow-env` added —
and a missing one does not fail at build time, it fails when a user runs the
command.

The affected invocations were spread across `deno.json` (the `version.ts`,
`cmt.1.md`, `CITATION.cff` and `cmt` compile tasks, plus all six `dist_*_cmt`
tasks) and the `deno run` lines in the `Makefile`.

**Decision.** Add `--allow-env` to every `deno run` and `deno compile`
invocation of `cmt.ts`, in `deno.json` and in the `Makefile`. `DENO_PERMS` in
`src/deno_tasks.ts` — the permission string CMTools writes into *other*
projects' generated tasks — is `--allow-read --allow-write --allow-run
--allow-env`, so generated projects get it too.

**Rationale.** No alternative was seriously in play: the permission is required
by the feature. The decision worth recording is that it had to be applied
*exhaustively*, and that the cost of missing one is a runtime failure in a
user's project rather than a build failure in CMTools.

**Rejected alternatives.**

- *Read `$HOME` lazily, only when a config file is actually wanted.* Would let
  invocations that never touch config run without the permission. Rejected
  because it makes the required permission set depend on runtime path — which
  is worse to document and worse to debug than one uniform rule.

**Consequences.**

- It took three commits on 2026-06-18 to finish: `fixed deno.json so cmt
  compiles`, `add --allow-env to cmt compile and run tasks`, then `add
  --allow-env to remaining deno run cmt.ts tasks in deno.json`. The third
  exists because the second was incomplete, which is the exhaustiveness point
  demonstrating itself.
- Any future capability that reaches outside the process — a network fetch, a
  subprocess — lands the same way: a permission that must be added to every
  invocation and to `DENO_PERMS`, with no compile-time check that it was.
