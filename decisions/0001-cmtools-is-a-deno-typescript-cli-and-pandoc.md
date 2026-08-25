---
id: "0001"
title: "CMTools is a Deno + TypeScript CLI, and Pandoc leaves the compile path"
date: "2025-01-09"
status: accepted
kind: decision
trigger: design
project: CMTools
phase: ""
supersedes: []
superseded_by: []
relates_to: ["0002"]
initiative: ""
session: ""
decisions: []
tags: [architecture, language, deno, pandoc]
uuid: "01a03af1-e5cb-73c6-a794-9315d2d18880"
origin_host: "MACMINI-RD.local"
---

**Context.** CMTools grew out of `codemeta2cff`, a single-purpose tool that
generated `CITATION.cff` from `codemeta.json`. The same idea was reused to
generate version files for Go, Python, JavaScript and TypeScript projects, then
installer scripts, then `about.md`. By that point the work was carried by an
accumulation of per-project scripts and Pandoc templates that had become
unwieldy, which is what prompted a single holistic tool.

Two properties of the old arrangement were doing real damage. Every project's
build required Pandoc — not a dependency most developers expect in a build
toolchain — and the surrounding `Makefile` machinery meant that developing on
Windows required either a full POSIX stack or WSL. Both Go and Deno
cross-compile well, but if the rest of the build environment demands POSIX then
the whole project is pinned to POSIX regardless.

**Decision.** Implement CMTools in TypeScript, compiled with Deno to static
executables. `cmt` and `cme` install by copying a single file. Pandoc is
removed from the compile path — it is still used to render Markdown
documentation to HTML for the project website, but it is not required to build
from source.

**Rationale.** TypeScript is a superset of JavaScript, one of the most widely
used languages of the early 21st century, and CMTools is precisely the kind of
tool that benefits from community contribution — a large part of the library,
archives and museum developer community can read and modify it. Deno supplies
cross-platform compilation for the three supported operating systems, which
gives the same deployment story as the group's Go utilities while keeping that
wider contributor base.

**Rejected alternatives.**

- *Go.* The primary backend language for DLD and demonstrably a good fit for
  CLI work. Rejected here on contributor reach rather than on technical
  grounds: fewer people in the LAM developer community write Go than write
  JavaScript or TypeScript.
- *Keep the per-project scripts and Pandoc templates.* No new tool to
  maintain, but this is the arrangement that had already become unwieldy, and
  it is what forces the POSIX dependency onto every consuming project.
- *GitHub repository templates.* Considered for the bootstrap problem
  specifically. Rejected because editing a template's placeholder content
  usually took as long as writing the documents from scratch — the `LICENSE`
  file being the one real exception.

**Consequences.**

- Consuming projects can build from source without Pandoc; Windows development
  no longer implies a POSIX stack.
- Go has since become a live consideration for a *future* version of CMTools,
  prompted by `clasm`'s success and by Go's speed advantage for CLI work. That
  is a consideration and not a decision: CMTools is heavily used across both
  work and personal projects, so a re-platform needs planning around features,
  UI and migration of the consuming tooling before any design work starts. It
  is tracked in `someday_maybe.md`, and this record is not superseded by it.
