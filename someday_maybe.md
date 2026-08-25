---
title: Someday, maybe
keywords:
  - roadmap
---

# Someday, maybe

CMTools is currently a working in progress. It has proven useful in managing
metadata driven artifacts in a number of Caltech Library projects. It is still
rapidly evolving. What might the next steps look like?

What follows is a hypothetical roadmap, not a promise of implementation. That's
why this document is called "Someday, maybe".

## Files should be generator

- CITATION.cff (implemented)
- version.(ts|js|py|go) (implemented)
- README.md (implemented) (implemented, needs improvement)
- INSTALL.md (implemented)
- about.md (implemented)
- search.md (implemented)
- page.tmpl and/or page.hbs (implemented)
- link-to-html.lua (implemented)
- installer.sh (implemented)
- installer.ps1 (implemented)
- release.bash (implemented)
- release.ps1 (implemented)
- publish.bash (implemented)
- publish.ps1 (implemented)
- Makefiles based on project language
  - Deno (implemented)
  - Go (implemented)
- make.ps1 as a PowerShell alternative to GNU Make files (under consideration)
- website.mak (implemented)
- website.ps1 (implemented)
- Add configuration file support with list which artifacts should be
  auto-regenerated (prototype, see `--init` option)
- A localhost web UI for editing codemeta.json (under consideration)
- helptext.ts, helptext.js, helptext.py and helptext.go (planned but not implemented)
- Deno task setup (exploring)

## Re-implementing CMTools in Go

Under consideration, not decided, and not yet designed around.

As a CLI, Go is substantially faster than Deno, and `clasm` has made the case
that Go works well for this class of tool at Caltech Library. CMTools was
written in TypeScript deliberately — for cross-platform compilation and for the
size of the library, archives and museum developer community that can
contribute to it (see `decisions/` DR-0001) — and neither of those reasons has
gone away.

What makes this a large piece of work rather than a port is adoption. CMTools
is now used in almost all of my work and personal projects, so a transition has
to be planned around three things at once: feature parity, the command-line
interface those projects already script against, and migration of the tooling
each project has generated. Nothing here should be designed until that planning
happens.

## Deno task setup

The `deno.json` tasks work across Windows, macOS and Linux. The Deno tasks
can easily be combined and driven from PowerShell, e.g. an eventual `make.ps1`
and `make.sh` like Go uses.

While Deno creates the `deno.json` file CMTools could manage to tasks based
on a predefined vocabulary, (e.g. "configure", "build", "test", "install").
Additional Deno tasks can be used to build projects that do not involve
TypeScript or JavaScript. Deno tasks can also provide TypeScript support for
more complex build operations that are maintained on a website like
<https://caltechlibrary/CMTools>.
