---
id: "0002"
title: "Generated file content lives in `generate_text.ts`; `transform.ts` holds only the transforms and mappings"
date: "2025-07-30"
status: accepted
kind: decision
trigger: implementation
project: CMTools
phase: ""
supersedes: []
superseded_by: []
relates_to: ["0001", "0007"]
initiative: ""
session: ""
decisions: []
tags: [architecture, modules, generate_text]
uuid: "01a03af1-e5cb-73c6-a794-9316accd1b2a"
origin_host: "MACMINI-RD.local"
---

**Context.** CMTools is deliberately built as a series of small
single-purpose TypeScript modules — `codemeta.ts` for the CodeMeta 3 object,
`gitcmds.ts` wrapping Git for hash retrieval, `person_or_organization.ts` for
the agent model, `editor.ts` for the external-editor integration,
`colors.ts` for CLI colourisation, `helptext.ts` for the help text that also
feeds the man pages and website docs, and `cmt.ts` / `cme.ts` as the two
command-line entry points.

`transform.ts` does the heavy lifting: turning a CodeMeta object into a target
file. As more artifacts became generatable, it accumulated both the transform
logic *and* the literal text of every generated file, and those two things grow
at very different rates and for different reasons.

**Decision.** The literal content of every generated file lives in
`generate_text.ts`. `transform.ts` keeps the transform functions and the
mapping of variables to text. Adding a new generated artifact is a content edit
in `generate_text.ts` plus a mapping entry, not a change to transform logic.

**Rationale.** The split follows how the two change. Artifact content changes
whenever a template is tuned — a nav tweak, a Makefile target, a new Pandoc
filter — which is often and low-risk. Transform logic changes rarely and is
where the real bugs live. Keeping them in one file meant every template tweak
touched the module holding the logic.

**Consequences.**

- Every later template followed this rule: the `documentation` Makefile
  template and the four `deno-*` Makefile templates were all added to
  `generate_text.ts` rather than to `transform.ts`.
- The split has no mechanism for retiring content when a generator goes away.
  As of v0.0.46, `generate_text.ts` still exports `denoTasksText` for a
  `deno-tasks.json` format, carrying `<deno-permissions>` and `<prog_name>`
  placeholders that are never resolved — they are not `{{...}}` expressions, so
  Handlebars does not see them. Actual `deno.json` generation moved to
  `addDenoTasks()` in `src/deno_tasks.ts` ([DR-0005](0005-adddenotasks-takes-explicit-parameters-writes.md)),
  leaving `denoTasksText` as dead code that still looks live.
