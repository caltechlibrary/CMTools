---
id: "0007"
title: "Format support becomes a registry: `FormatGenerator` and `registerGenerator()` replace the hardcoded format list"
date: "2026-06-18"
status: accepted
kind: decision
trigger: implementation
project: CMTools
phase: "0.0.46"
supersedes: []
superseded_by: []
relates_to: ["0002"]
initiative: ""
session: ""
decisions: []
tags: [architecture, transform, extensibility]
uuid: "01a03af1-e5cb-73c6-a794-931bf911f601"
origin_host: "MACMINI-RD.local"
---

**Context.** Whether CMTools could generate a given file was answered by
`isSupportedFormat()`, which tested the format name against a hardcoded array
in `transform.ts`. Adding an artifact meant editing that array, editing
`getMakefileText()` or an equivalent dispatch, and adding the content to
`generate_text.ts` — three edits in two files, with nothing tying them
together. Miss the array entry and the generator exists but is unreachable;
miss the dispatch entry and the format is advertised but produces nothing.

The set of generatable artifacts is the thing about CMTools that grows most —
`CITATION.cff`, version files in four languages, `about.md`, `search.md`,
`page.tmpl`, `site.css`, two Lua filters, installers, release and publish
scripts for two shells, `website.mak`, `website.ps1`, `make.ps1`, and a
Makefile per project type.

**Decision.** A `FormatGenerator` interface and a `registerGenerator()`
function backed by a `Map`, both in `transform.ts`. Each format registers
itself; `isSupportedFormat()` is kept as the public predicate but now answers
from the registry rather than from a literal array.

**Rationale.** It makes registration the single act that adds a format,
so the "advertised but does nothing" and "implemented but unreachable" failure
modes both become impossible by construction rather than by discipline. Keeping
`isSupportedFormat()` as the name means callers did not have to change.

**Rejected alternatives.**

- *Keep the array and add a test asserting it matches the dispatch table.* Would
  catch the drift rather than prevent it, and still leaves an author editing two
  structures that must agree.
- *Rename `isSupportedFormat()` to something registry-flavoured.* Churn at every
  call site for no gain; the question it answers did not change.

**Consequences.**

- Adding a format is now a `registerGenerator()` call plus its content in
  `generate_text.ts`.
- The registry is populated by a run of `registerGenerator()` calls at module
  scope in `transform.ts`, so it is still one file that must be edited — the
  win is that it is one edit, not that it is zero.
- Nothing removes a generator from the registry when its content is retired,
  which is the other half of the `denoTasksText` dead-code situation described
  in [DR-0002](0002-generated-file-content-lives-in-generate-text-ts.md).
