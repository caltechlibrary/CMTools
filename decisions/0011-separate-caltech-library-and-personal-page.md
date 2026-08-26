---
id: "0011"
title: "Separate Caltech Library and personal page templates, and an A11y `<footer>` in the personal one"
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
decisions: ["page.tmpl is generated from one of two templates depending on whether the project is a Caltech Library project", "The personal template gains a <footer> element for A11y landmark compliance"]
tags: [templates, website, a11y]
uuid: "01a03af1-e5cb-73c6-a794-931ff5e70bd8"
origin_host: "MACMINI-RD.local"
---

**Context.** `page.tmpl` is the Pandoc template CMTools generates for a
project's website. A single template served every project, but Caltech Library
projects and personal projects genuinely need different chrome: institutional
branding, navigation and footer content that is wrong — or misleading about
affiliation — on a personal project, and absent where it is required.

**Decision.** Two page templates in `generate_text.ts`, selected by whether the
project is a Caltech Library project. The personal template carries a
`<footer>` element.

**Rationale.** The alternative to two templates is one template full of
conditionals on an organisation name, which puts institutional branding
decisions inside template logic and makes both variants harder to read than
either would be alone. Two templates duplicate structure, and that duplication
is the price of each one being legible.

The `<footer>` is an accessibility requirement, not styling: it establishes the
contentinfo landmark that assistive technology uses to navigate the page.
Caltech is a federally funded institution and its web output must be A11y
compliant, and CMTools generates the page template for a large number of
projects — so a missing landmark here is a missing landmark in every site
generated from it.

**Rejected alternatives.**

- *One template with conditionals.* Fewer files, one place to fix a shared
  bug. Rejected on legibility: the two variants differ in structure, not just
  in strings.
- *Treating the footer as presentational and leaving it to `site.css`.* CSS
  cannot supply a landmark. This is markup semantics.

**Consequences.**

- A change to shared page structure now has to be made twice, and nothing
  checks that the two templates stay in step.
- The A11y improvement applies to newly generated `page.tmpl` files only.
  Projects that generated theirs before v0.0.46 keep the old markup until they
  regenerate — CMTools has no mechanism to tell a project its generated files
  are out of date.
