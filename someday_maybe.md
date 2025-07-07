---
title: Someday, maybe
keywords:
  - roadmap
---

# Someday, maybe

CMTools is currently a working in progress.  It has proven useful in managing metadata driven artifacts in a number of Caltech Library projects. It is still rapidly evolving. What might the next steps look like?

What follows is a hypothetical roadmap, not a promise of implementation. That's why this document is called "Someday, maybe". 

## Files should be generator

- CITATION.cff
- version.(ts|js|py|go) (implemented)
- README.md (implemented)
- INSTALL.md (implemented)
- about.md (implemented)
- search.md (implemented)
- page.tmpl and/or page.hbs (implemeneted)
- installer.sh (implemented)
- installer.ps1 (implemented)
- release.bash (implemented)
- release.ps1 (implemented)
- publish.bash (implemented)
- publish.ps1 (implemented)
- Makefiles based on project language
  - Deno (imeplented)
  - Go (implemented)
- website.mak (implemented)
- website.ps1 (implemented)
- Add configuration file support with list which artifacts should be auto-regenerated
- A localhost web UI for editing codemeta.json (under consideration)

## Deno projects

### deno.json and using Deno to manage your build process

While Deno should create the `deno.json` file, CMTools can manage to tasks based on a predefined vocabulary, (e.g. "configure", "build", "test", "install").  Additional Deno tasks can be used to build projects that do not involve TypeScript or JavaScript. Deno tasks can also provide TypeScript support for more complex build operations that are maintained on a website like <https://caltechlibrary/CMTools>.

