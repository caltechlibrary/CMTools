---
id: "0004"
title: "Non-programming projects extend `--init` rather than adding a `--type` flag"
date: "2026-05-12"
status: accepted
kind: decision
trigger: design
project: CMTools
phase: "0.0.45"
supersedes: []
superseded_by: []
relates_to: ["0006"]
initiative: ""
session: ""
decisions: []
tags: [cli, init, documentation, presentation]
uuid: "01a03af1-e5cb-73c6-a794-931834fb4f34"
origin_host: "MACMINI-RD.local"
---

**Context.** `cmt --init` accepted `python`, `go`, `deno`, `typescript` and
`javascript` — all programming languages, each pushing a `version.*` file and a
language-appropriate `Makefile`. Documentation and presentation projects want
most of what CMTools generates (README, `about.md`, `search.md`,
`CITATION.cff`, installers, page template, Lua filters, `website.mak`,
`Makefile`) and none of the language-specific parts.

**Decision.** Add `documentation` and `presentation` as new values of the
existing `--init` flag, both setting `lang = "documentation"`. No new flag. No
`version.*` file is generated for either. A generic documentation `Makefile`
template is added to `generate_text.ts`.

**Rationale.** A separate `--type` flag would sit alongside the existing
`--lang` flag and overlap with it confusingly — a user would have to work out
which of two flags describes their project and what happens when both are set.
`--init` already means "what kind of project is this," so extending its
vocabulary says the same thing without introducing a second axis.

The filename-based `lang` detection is left untouched: documentation and
presentation projects are reachable only via `--init`, because unlike `.go` or
`.ts` there is no file extension that implies them. That asymmetry is real and
accepted rather than papered over.

**Rejected alternatives.**

- *A `--type` flag* distinguishing programming from non-programming projects.
  Rejected for the `--lang` overlap above.
- *Treating documentation as a language value of `--lang`.* Would avoid a new
  flag too, but `--lang documentation` asserts that documentation is a
  programming language in the one place where that word already has a precise
  meaning.

**Consequences.**

- `documentation` and `presentation` produce an identical file set. They are
  kept as two spellings of one behaviour because the word a user reaches for
  differs, and collapsing them would mean telling presentation authors to type
  `documentation`.
- Recipe lines in the generated `Makefile` must use hard tab characters, not
  spaces — a constraint of Make itself that had to be carried explicitly into
  the template and into the acceptance criteria, since nothing in TypeScript
  makes a tab visibly different from spaces in a template literal.
