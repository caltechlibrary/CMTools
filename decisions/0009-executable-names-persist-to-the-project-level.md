---
id: "0009"
title: "Executable names persist to the project-level `.cmtoolsrc` so regeneration does not need them re-typed"
date: "2026-06-18"
status: accepted
kind: decision
trigger: implementation
project: CMTools
phase: "0.0.46"
supersedes: []
superseded_by: []
relates_to: ["0006", "0008"]
initiative: ""
session: ""
decisions: []
tags: [config, deno-cli, regeneration]
uuid: "01a03af1-e5cb-73c6-a794-931d19ccdbbb"
origin_host: "MACMINI-RD.local"
---

**Context.** [DR-0006](0006-four-deno-sub-types-replace-the-undifferentiated.md)
made executable names positional arguments to `cmt --init deno-cli`. That works
at init time, when the developer is typing the command anyway. It does not work
afterwards: the generated `Makefile` and `deno.json` carry per-executable
compile and `dist_*` targets, and regenerating either — which happens at every
release, when the version bumps — would need the same names supplied again,
identically, from memory. Get them wrong or omit them and the regenerated
`Makefile` silently loses build targets.

**Decision.** Executable names are written to the project-level `.cmtoolsrc` as
the `executables` field at init time, and read back on subsequent runs.
Regeneration needs only `cmt codemeta.json <files>`.

**Rationale.** The names are a property of the project, and the project already
has a place to record its properties. Writing them there turns a fact the
developer had to remember into a fact the repository states — and it is a fact
their collaborators and CI need too, neither of whom saw the original `--init`
command.

`executables` is a scalar field for merge purposes
([DR-0008](0008-config-resolution-is-yaml-and-merges-every.md)), so the
nearest `.cmtoolsrc` wins outright. That is the correct rule here: a project's
binaries are not extended by whatever a parent directory happens to declare.

**Rejected alternatives.**

- *Derive the executables from `codemeta.json`.* Attractive because CMTools'
  whole premise is that `codemeta.json` is the source of truth. Rejected
  because CodeMeta has no field for "this project builds these binaries" —
  `name` is a single project name, which is exactly the one-executable case
  already covered by the fallback. Overloading a CodeMeta field to carry a
  build detail would corrupt the metadata for its actual consumers, which
  include CaltechDATA.
- *Re-scan the existing `Makefile` or `deno.json` for compile targets.*
  Recovers the names without new state, but makes generated files an input to
  their own generator, so a hand-edit to a generated file becomes load-bearing.
- *Require the names on every invocation.* The status quo, and the failure is
  silent — a regenerated Makefile missing a target looks fine until a release
  build produces one binary instead of three.

**Consequences.**

- CMTools now writes a project-level `.cmtoolsrc` into projects it initialises,
  which is new state in the consuming repository and needs to be committed
  there for CI to see it.
- Written from the shipped behaviour rather than from a contemporaneous design
  note; `CHANGES.md` for v0.0.46 records the feature in one line.
