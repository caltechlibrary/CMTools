# CMTools 0.0.45 Release Goals

## Overview

This document outlines the development plan for CMTools version 0.0.45, focusing on four features:

1. **Global Configuration with Person/Organization Profiles** (Priority 1 - High Impact)
2. **Support for Non-Programming Projects** (Priority 2 - Medium Impact)
3. **Clean Up deno_tasks.ts** (Priority 3 - Quick Win)
4. **Deno Project Sub-types** (Priority 4 - Replaces `--init deno/typescript/javascript`)

This plan is based on actual codebase analysis of CMTools (commit 8ad366b).

---

## Priority 1: Global Configuration System

### Objective

Create a global configuration file that stores person/organization profiles, pre-defined
person lists, and license templates. This reduces friction across three common `cme` tasks:
populating author/contributor/maintainer fields, applying a standard license, and building
team contributor lists.

**User Stories**:
- As a Caltech Library developer, I want to select my pre-configured profile when editing
  the `author` field instead of typing YAML by hand.
- As a developer with work and personal projects, I want to store a "caltech" and an
  "agpl3" license in my config and apply either with one command.
- As a team lead, I want a "dld-team" person list I can apply to `contributor` in one step.

### Current State Analysis

From `cme.ts`:
- Person/organization fields (author, contributor, maintainer) use `editCodeMetaTerm()` from
  `src/codemeta_editor.ts`; currently require manual YAML entry (lines 44–68)
- The `PersonOrOrganization` class in `src/person_or_organization.ts` already handles the
  data structure; `fromObject()` accepts both `id`/`@id` and `type`/`@type` forms

### Technical Design

#### Config File Location
- Primary: `~/.cmtoolsrc` (JSON format)
- Fallback: `~/.config/cmtools/config.json`
- Override: `--global-config PATH` flag on `cme`

#### Config File Schema

```json
{
  "default_profile": "rdoiel",
  "default_license": "caltech",
  "profiles": {
    "rdoiel": {
      "type": "Person",
      "givenName": "R. S.",
      "familyName": "Doiel",
      "email": "rdoiel@caltech.edu",
      "id": "https://orcid.org/0000-0003-0900-6903",
      "affiliation": { "type": "Organization", "name": "Caltech Library" }
    },
    "caltech-library": {
      "type": "Organization",
      "name": "Caltech Library",
      "email": "library@caltech.edu"
    }
  },
  "licenses": {
    "caltech": {
      "name": "Caltech License",
      "file": "~/.config/cmtools/licenses/caltech.txt"
    },
    "agpl3": {
      "name": "GNU Affero General Public License v3.0 or later",
      "url": "https://spdx.org/licenses/AGPL-3.0-or-later.html",
      "text": "GNU AFFERO GENERAL PUBLIC LICENSE\nVersion 3, 19 November 2007\n..."
    }
  },
  "person_lists": {
    "dld-team": [
      {
        "type": "Person", "givenName": "R. S.", "familyName": "Doiel",
        "id": "https://orcid.org/0000-0003-0900-6903"
      },
      {
        "type": "Person", "givenName": "Tom", "familyName": "Morrell",
        "id": "https://orcid.org/0000-0001-9266-5146"
      }
    ]
  }
}
```

**License storage rules** (both `file` and `text` are optional; at least one required):
- If `file` is present, read text from the path (`~` expanded). Takes precedence over `text`.
- If only `text` is present, use it directly.
- `url` is optional; when present it is written to the `license` field in codemeta.json.

**Person lists** store inline person data (not references to profile names), so they are
self-contained and don't break if a profile is renamed.

### Implementation Tasks

#### Task 1.1: Create `src/config.ts` Module (NEW FILE)

**Interfaces and exports**:
```typescript
export interface Profile { /* PersonOrOrganization fields: type, givenName, familyName,
                              name, id, email, affiliation */ }
export interface License {
  name: string;
  url?: string;   // written to codemeta.json license field when present
  file?: string;  // path to license text file (~ expanded); takes precedence over text
  text?: string;  // inline license text
}
export interface Config {
  default_profile?: string;
  default_license?: string;
  profiles: { [key: string]: Profile };
  licenses: { [key: string]: License };
  person_lists: { [key: string]: Profile[] };
}

export function getConfigPath(override?: string): string
export async function loadConfig(configPath?: string): Promise<Config | null>
export async function saveConfig(config: Config, configPath?: string): Promise<boolean>
export function getProfileNames(config: Config): string[]
export function getProfile(config: Config, name: string): Profile | undefined
export function profileToPersonOrOrg(profile: Profile): PersonOrOrganization
export function formatProfile(profile: Profile): string
export function getLicenseNames(config: Config): string[]
export function getLicense(config: Config, name: string): License | undefined
export async function getLicenseText(license: License): Promise<string | null>
export function getPersonListNames(config: Config): string[]
export function getPersonList(config: Config, name: string): Profile[] | undefined
```

**Implementation Notes**:
- Use try/catch on `Deno.readTextFile` to detect missing file (not `Deno.statSync`)
- Expand `~` in `license.file` using `Deno.env.get("HOME")`
- `profileToPersonOrOrg` calls `new PersonOrOrganization(); p.fromObject(profile)`
- If `config.profiles`, `config.licenses`, or `config.person_lists` are absent on load,
  default them to `{}`

#### Task 1.2: Modify `cme.ts`

Add top-level import:
```typescript
import {
  formatProfile, getLicense, getLicenseNames, getLicenseText,
  getPersonList, getPersonListNames, getProfile, getProfileNames, loadConfig,
} from "./src/config.ts";
```

Add CLI flags:
```typescript
alias: {
  // ... existing ...
  profiles: "p",            // NEW: list available profiles
  'person-lists': "P",      // NEW: list available person lists
  'apply-license': "A",     // NEW: write ./LICENSE from config and update codemeta.json
  'global-config': "g",     // NEW: override config file path
},
default: {
  // ... existing ...
  profiles: false,
  'person-lists': false,
  'apply-license': false,
  'global-config': "",
},
```

Add handlers (before attribute editing loop):
```typescript
// --profiles: list configured profiles
if (app.profiles) {
  const config = await loadConfig(app['global-config'] || undefined);
  if (!config || getProfileNames(config).length === 0) {
    console.log("No profiles configured. Add them to ~/.cmtoolsrc");
  } else {
    for (const name of getProfileNames(config)) {
      console.log(`  ${name}: ${formatProfile(getProfile(config, name)!)}`);
    }
  }
  Deno.exit(0);
}

// --person-lists: list configured person lists
if (app['person-lists']) {
  const config = await loadConfig(app['global-config'] || undefined);
  if (!config || getPersonListNames(config).length === 0) {
    console.log("No person lists configured. Add them to ~/.cmtoolsrc");
  } else {
    for (const name of getPersonListNames(config)) {
      const list = getPersonList(config, name)!;
      console.log(`  ${name}: ${list.length} ${list.length === 1 ? "entry" : "entries"}`);
    }
  }
  Deno.exit(0);
}

// --apply-license: write ./LICENSE from config and update codemeta.json
if (app['apply-license']) {
  const config = await loadConfig(app['global-config'] || undefined);
  if (!config || getLicenseNames(config).length === 0) {
    console.log("No licenses configured. Add them to ~/.cmtoolsrc");
    Deno.exit(1);
  }
  // ... (selection menu + file write + codemeta update — see Task 1.3 helper)
  Deno.exit(0);
}
```

#### Task 1.3: Update `src/codemeta_editor.ts`

Update `editCodeMetaTerm()` signature to accept an optional config path:
```typescript
export async function editCodeMetaTerm(
  cm: CodeMeta, name: string, useEditor: boolean, configPath?: string,
): Promise<boolean>
```

**Person/organization fields** — inside the non-editor path, before the YAML prompt, show
a unified menu of individual profiles AND pre-defined lists:

```
Available profiles:
  1. rdoiel (R. S. Doiel, Caltech Library)
  2. caltech-library (Caltech Library)
Pre-defined lists:
  3. dld-team  (2 people)
  4. Enter manually
  q. Skip / keep existing
```

- Selecting a profile populates a single `PersonOrOrganization` (for `person_or_organization`)
  or starts a list that the user can extend entry by entry (for `person_or_organization_list`)
- Selecting a person list populates the full list at once (only valid for
  `person_or_organization_list`; prompt confirms before overwriting)
- "Enter manually" falls through to the existing YAML prompt

**License field** — when `name === "license"`, before the normal string prompt:
```typescript
const config = await loadConfig(configPath);
if (config && getLicenseNames(config).length > 0) {
  // Show license menu. On selection:
  //   1. Read license text via getLicenseText()
  //   2. Write text to ./LICENSE
  //   3. If license.url exists, set obj["license"] = license.url
  //   4. Return cm.patchObject(obj)
  // "Enter manually" falls through to existing prompt
}
```

Extract the license-apply logic into a shared helper
`applyLicenseFromConfig(config, licenseName, cm)` so both `--apply-license` in `cme.ts`
and the `editCodeMetaTerm` license path call the same function.

### Files to Create/Modify

| File | Action | Lines | Dependencies |
|------|--------|-------|--------------|
| `src/config.ts` | Create | ~220 | `person_or_organization.ts` |
| `cme.ts` | Modify | ~60 | `config.ts` |
| `src/codemeta_editor.ts` | Modify | ~80 | `config.ts` |
| `helptext.ts` | Modify | ~25 | None |

### Testing Strategy

1. Config load: missing file, valid file, file with missing optional sections
2. `getLicenseText`: `file` path (with `~` expansion), `text` inline, both present (file wins)
3. Profile selection: single pick, list build (add another loop), person list apply
4. License apply: writes `./LICENSE`, updates `license` URL in codemeta when `url` present
5. `--profiles`, `--person-lists`, `--apply-license` flags work standalone
6. Backward compatibility: all existing behaviour unchanged when no config file exists

---

## Priority 2: Non-Programming Project Support

### Objective
Allow `cmt` to initialize and support non-programming projects (documentation, presentations) as first-class citizens.

**User Story**: As a documentation author, I want to run `cmt --init documentation codemeta.json` and get appropriate files (README.md, about.md, Makefile) without JavaScript-specific files (version.ts, deno.json).

### Current State Analysis

From `cmt.ts`:
- `--init` flag (line 11) accepts: `python`, `go`, `deno`, `typescript`, `javascript`
- Language detection (lines 44-52): checks output filenames, defaults to `javascript`
- Each init type adds specific files: version.{ext}, Makefile (lines 64-95)

From `transform.ts`:
- `isSupportedFormat()` (line 11) lists all supported output formats
- `getMakefileText()` (line 26) maps lang to Makefile template
- Currently supports: `golang`/`go`, `javascript`/`typescript`/`deno`

### Technical Design

#### Approach: Extend `--init` with new case values

Add `documentation` and `presentation` as new valid values for the existing `--init` flag.
This avoids introducing a `--type` flag that would overlap confusingly with `--lang`.

**New `--init` values**: `documentation`, `presentation`

#### File Generation for Documentation Projects

When `--init documentation` or `--init presentation`:
- `lang = "documentation"`
- Output files: README.md, about.md, search.md, CITATION.cff, INSTALL.md,
  INSTALL_NOTES_macOS.md, INSTALL_NOTES_Windows.md, installer.ps1, installer.sh,
  page.tmpl, links-to-html.lua, add-col-scope.lua, website.mak, website.ps1,
  site.css, Makefile, make.ps1
- **Excludes**: version.ts, version.js, version.go, version.py
- Makefile uses generic documentation template (tabs required for recipe lines)

### Implementation Tasks

#### Task 2.1: Modify `cmt.ts`

No new flags needed. Add two new cases to the existing `--init` switch (lines 82–116):
```typescript
case "documentation":
case "presentation":
  lang = "documentation";
  outputNames.push("Makefile");
  outputNames.push("make.ps1");
  break;
```

The existing filename-based `lang` detection (lines 44–62) is unchanged. Documentation/presentation
projects are only activated via `--init`; there is no filename extension that implies them.

#### Task 2.2: Modify `src/transform.ts`

Update `getMakefileText()` (line 26):
```typescript
function getMakefileText(lang: string): string | undefined {
  const prefix: { [key: string]: string } = {
    "golang": goMakefileText,
    "go": goMakefileText,
    "javascript": denoMakefileText,
    "typescript": denoMakefileText,
    "deno": denoMakefileText,
    "documentation": documentationMakefileText, // NEW
  };
  // ... rest of function
}
```

Add `documentationMakefileText` template. **Important**: recipe lines must use hard tab
characters, not spaces. The template also needs to be added to `generate_text.ts` (per
the completed TODO item requiring generated text to live there, not in `transform.ts`):

```
# Makefile for documentation projects
# Generated by cmt

.PHONY: all build website clean

all: build website

build: README.md about.md search.md CITATION.cff
<TAB>@echo "Build complete"

website:
<TAB>make -f website.mak

clean:
<TAB>rm -f *.html
<TAB>rm -rf _build

README.md: codemeta.json
<TAB>cmt codemeta.json README.md

about.md: codemeta.json
<TAB>cmt codemeta.json about.md

search.md: codemeta.json
<TAB>cmt codemeta.json search.md

CITATION.cff: codemeta.json
<TAB>cmt codemeta.json CITATION.cff
```

(Replace `<TAB>` with a literal tab character in the actual source.)

Also add `"documentation"` to the `isSupportedFormat()` format list in `transform.ts` for
`Makefile` (already there) and `make.ps1` (already there). No new format entries needed
since both Makefile and make.ps1 are already recognized formats.

#### Task 2.3: Update `helptext.ts`

Add documentation for the new `--init documentation` and `--init presentation` options
in `cmtHelpText`. No `--type` flag to document.

### Files to Create/Modify

| File | Action | Lines | Dependencies |
|------|--------|-------|--------------|
| `cmt.ts` | Modify | ~8 | None |
| `src/transform.ts` | Modify | ~40 | `generate_text.ts` |
| `src/generate_text.ts` | Modify | ~40 | None |
| `helptext.ts` | Modify | ~10 | None |

### Testing Strategy

1. `cmt --init documentation codemeta.json` generates correct files including Makefile and make.ps1
2. `cmt --init presentation codemeta.json` works and produces the same file set
3. Backward compatibility: `--init javascript` still works
4. No version.* files generated for documentation or presentation type
5. Generated Makefile uses hard tabs (not spaces) for recipe lines

---

## Priority 3: Clean Up deno_tasks.ts

### Objective
Complete the implementation of `src/deno_tasks.ts` which is currently fully commented out with partial code.

### Current State Analysis

**Actual code in `src/deno_tasks.ts`** (56 lines, fully commented):
```typescript
/*
const denoTasks: { [key: string]: string } = {};
// Handle updating the deno.json file.
if (isDeno) {
let src: string | undefined = undefined;
let doBackup: boolean = true;
try {
    src = await Deno.readTextFile("deno.json");
} catch (_err) {
    console.warn(`creating %cdeno.json`, GREEN);
    doBackup = false;
}
if (src === undefined) {
    src = `{"tasks":{}}`;
}
let denoJSON: { [key: string]: unknown } = {};
try {
    denoJSON = JSON.parse(src) as {[key: string]: {[key:string]: unknown}};
} catch (err) {
    console.log(`deno.json error, %c${err}`, ERROR_COLOR);
    Deno.exit(0);
}
const genCodeTasks: string[] = [];
if (denoJSON.tasks === undefined || denoJSON.tasks === null) {
    denoJSON.tasks = {} as {[key: string]: string};
}
const tasks: {[key:string]: string} = {};
for (const taskName of Object.keys(denoTasks)) {
    tasks[taskName] = denoTasks[taskName];
    genCodeTasks.push(`deno task ${taskName}`);
}
if (genCodeTasks.length > 0) {
    tasks["gen-code"] = (genCodeTasks as string[]).join(" ; ");
}
if (Object(tasks).keys().length > 0) {
    denoJSON.tasks = tasks;
}
// Update deno.json file.
if (doBackup) {
    try {
    await Deno.copyFile("deno.json", "deno.json.bak");
    } catch (err) {
    console.log(
        `failed to backup deno.json aborting, %c${err}`,
        ERROR_COLOR,
    );
    Deno.exit(1);
    }
}
src = JSON.stringify(denoJSON, null, 2);
if (src !== undefined) {
    Deno.writeTextFile("deno.json", src);
}
}
*/
```

**Issues identified**:
- References undefined: `isDeno`, `denoTasks`, `GREEN`, `ERROR_COLOR`
- Syntax error: `Object(tasks).keys()` should be `Object.keys(tasks)`
- Uses global `denoTasks` object that's never populated
- `GREEN` and `ERROR_COLOR` are defined in `src/colors.ts`
- In `cmt.ts`: `app.deno = true` is set for `--init deno` but never used
- Help text mentions: "The --deno option can trail the above command to update the deno.json file"

### Technical Design

Simplify the approach: create a single `addDenoTasks()` function that takes explicit parameters rather than using global state.

### Implementation Tasks

#### Task 3.1: Rewrite `src/deno_tasks.ts`

**File**: `CMTools/src/deno_tasks.ts` (rewrite existing)

```typescript
import { ERROR_COLOR, GREEN } from "./colors.ts";

export async function addDenoTasks(
  denoJsonPath: string = "deno.json",
  sourceFile: string,
  outputFiles: string[],
): Promise<boolean> {
  let src: string | undefined = undefined;
  let doBackup: boolean = true;

  try {
    src = await Deno.readTextFile(denoJsonPath);
  } catch (_err) {
    console.log(`%ccreating ${denoJsonPath}`, GREEN);
    doBackup = false;
  }

  if (src === undefined) {
    src = `{"tasks":{}}`;
  }

  let denoJSON: { [key: string]: unknown } = {};
  try {
    denoJSON = JSON.parse(src) as { [key: string]: unknown };
  } catch (err) {
    console.log(`deno.json error, %c${err}`, ERROR_COLOR);
    return false;
  }

  if (denoJSON.tasks === undefined || denoJSON.tasks === null) {
    denoJSON.tasks = {};
  }

  // deno.json tasks are plain strings, not objects
  const tasks = denoJSON.tasks as { [key: string]: string };

  const filesArg = [sourceFile, ...outputFiles].join(" ");
  tasks["gen-code"] = `deno run --allow-read --allow-write ./cmt.ts ${filesArg}`;

  denoJSON.tasks = tasks;

  if (doBackup) {
    try {
      await Deno.copyFile(denoJsonPath, `${denoJsonPath}.bak`);
    } catch (err) {
      console.log(`failed to backup ${denoJsonPath} aborting, %c${err}`, ERROR_COLOR);
      return false;
    }
  }

  await Deno.writeTextFile(denoJsonPath, JSON.stringify(denoJSON, null, 2));
  console.log(`%cupdated ${denoJsonPath}`, GREEN);
  return true;
}
```

**Key Design Decisions**:
- Single exported function with explicit parameters (no global state)
- Task values are plain strings (matches deno.json format — the original plan used `{ cmd, desc }` objects which Deno does not accept)
- Fixes `Object.keys()` syntax error from original commented code
- Creates backup before modifying; existing tasks are preserved
- Caller is responsible for passing only the files that should be in gen-code (see Task 3.2)

#### Task 3.2: Integrate with `cmt.ts`

Remove the ad-hoc `app.deno = true` assignments from the `--init` switch cases. Replace
with an automatic check after the switch: if `lang` starts with `"deno"`, call
`addDenoTasks()`. No new CLI flag is needed — the project type already encodes this.

Add top-level import:
```typescript
import { addDenoTasks } from "./src/deno_tasks.ts";
```

After the output file generation loop (around line 164), add:

```typescript
if (app.init !== "" && lang.startsWith("deno")) {
  // Automatically update deno.json for all deno-* project types.
  // Only pass source-derived files (version.*, about.md, CITATION.cff),
  // not installer scripts or templates.
  const genCodeFiles = outputNames.filter((n) =>
    n.startsWith("version.") || n === "about.md" || n === "CITATION.cff"
  );
  if (genCodeFiles.length > 0) {
    const ok = await addDenoTasks("deno.json", inputName, genCodeFiles);
    if (!ok) console.log("Warning: failed to update deno.json gen-code task");
  }
}
```

The `--deno/-D` flag is **not added**. The project type (`--init deno-*`) is sufficient
signal; a separate flag would be redundant and confusing alongside the new sub-types.

#### Task 3.3: Add Tests

Create `test/deno_tasks_test.ts` with tests for:
- Creating deno.json from scratch
- Merging with existing tasks  
- Backup file creation
- Error handling

### Files to Create/Modify

| File | Action | Lines | Dependencies |
|------|--------|-------|--------------|
| `src/deno_tasks.ts` | Rewrite | ~65 | `colors.ts` |
| `cmt.ts` | Modify | ~8 | `deno_tasks.ts` |
| `test/deno_tasks_test.ts` | Create | ~90 | `@std/testing`, `@std/fs` |

---

## Priority 4: Deno Project Sub-types

### Objective

Replace the undifferentiated `--init deno`, `--init typescript`, and `--init javascript`
values with explicit sub-type labels that reflect how the project's TypeScript is
delivered: as a compiled CLI, a bundled browser script, bare ES modules, or a web
component library.

### Current State Analysis

From `cmt.ts` switch (lines 82–116):
- `case "deno"` / `"typescript"` / `"javascript"`: all set `lang` to their literal value,
  push `version.ts` or `version.js`, push `Makefile`, and set `app.deno = true`
- All three produce the same `denoMakefileText` Makefile (via `getMakefileText`)
- They differ only in the version file extension
- The old values are kept as **deprecated aliases** mapping to `deno-cli` for backward
  compatibility

### Technical Design

#### New `--init` values

| Value | Replaces | Lang set to | version.* | Makefile template | deno.json gen-code |
|---|---|---|---|---|---|
| `deno-cli` | `deno`, `typescript` | `deno-cli` | `version.ts` | `denoCliMakefileText` | yes |
| `deno-bundle` | `javascript` (partially) | `deno-bundle` | none | `denoBundleMakefileText` | yes |
| `deno-es-module` | — | `deno-es-module` | none | `denoEsModuleMakefileText` | yes |
| `deno-webcomponent` | — | `deno-webcomponent` | none | `denoWebComponentMakefileText` | yes |

Deprecated aliases `deno`, `typescript`, `javascript` are kept in the switch but set
`lang = "deno-cli"` so behaviour is unchanged and `lang.startsWith("deno")` fires
for gen-code.

#### Executable names for `deno-cli`

Extra positional arguments after the codemeta.json path are treated as executable names:

```
cmt --init deno-cli codemeta.json mycmd myothercmd
```

If none are supplied, fall back to the `name` field from codemeta.json. The names are
passed into the Makefile template as a list so `deno compile` targets are generated per
executable.

### Implementation Tasks

#### Task 4.1: Modify `cmt.ts`

Replace the three old cases and add four new ones in the `--init` switch:

```typescript
// Deprecated aliases — keep for backward compatibility
case "deno":
case "typescript":
  lang = "deno-cli";
  outputNames.push("version.ts");
  outputNames.push("Makefile");
  break;
case "javascript":
  lang = "deno-cli";
  outputNames.push("version.js");
  outputNames.push("Makefile");
  break;

// New sub-types
case "deno-cli":
  lang = "deno-cli";
  outputNames.push("version.ts");
  outputNames.push("Makefile");
  // Remaining positional args after codemeta.json are executable names.
  // Collect them now before the general outputNames loop runs.
  break;
case "deno-bundle":
  lang = "deno-bundle";
  outputNames.push("Makefile");
  break;
case "deno-es-module":
  lang = "deno-es-module";
  outputNames.push("Makefile");
  break;
case "deno-webcomponent":
  lang = "deno-webcomponent";
  outputNames.push("Makefile");
  // custom-elements.json is generated by external tooling; CMTools provides the
  // Makefile target that calls it, not the file itself.
  break;
```

For `deno-cli`, parse executable names from the remaining positional args. These need
to be captured before the general args loop (around line 119) consumes them as output
file names. One approach: check `app.init === "deno-cli"` after the switch and pull
names that don't end in a known extension.

#### Task 4.2: Add Makefile templates to `src/generate_text.ts`

Four new templates (all with hard tab characters for recipe lines):

**`denoCliMakefileText`** — parameterised per executable. Targets: `build`, `compile`,
one `deno compile --output bin/{name}` target per executable, `test`, `clean`.
Use a placeholder like `{executables}` that `transform()` expands, or generate the
compile targets dynamically in `cmt.ts` before calling `transform()`.

**`denoBundleMakefileText`** — targets: `build` (calls `deno bundle` or equivalent),
`test`, `clean`. Uses a placeholder for the entry-point `.ts` and output `.js` filename.

**`denoEsModuleMakefileText`** — minimal: `lint` (`deno lint`), `check` (`deno check`),
`test` (`deno test`), `clean`. No compile or bundle step.

**`denoWebComponentMakefileText`** — targets: `build` (calls manifest analyzer to
generate `custom-elements.json`), `demo` (builds demo HTML), `test`, `clean`.

#### Task 4.3: Update `src/transform.ts`

Extend `getMakefileText()` to map the four new lang values:

```typescript
const prefix: { [key: string]: string } = {
  "golang": goMakefileText,
  "go": goMakefileText,
  "deno-cli": denoCliMakefileText,    // replaces javascript/typescript/deno
  "deno-bundle": denoBundleMakefileText,
  "deno-es-module": denoEsModuleMakefileText,
  "deno-webcomponent": denoWebComponentMakefileText,
  "documentation": documentationMakefileText,
  // Keep old keys as aliases during transition
  "javascript": denoCliMakefileText,
  "typescript": denoCliMakefileText,
  "deno": denoCliMakefileText,
};
```

#### Task 4.4: Update `helptext.ts`

Already done in an earlier update — `--init` lists all four `deno-*` sub-types with
descriptions. Verify deprecated values are noted as aliases.

### Files to Create/Modify

| File | Action | Lines | Dependencies |
|------|--------|-------|--------------|
| `cmt.ts` | Modify | ~30 | `deno_tasks.ts` |
| `src/generate_text.ts` | Modify | ~120 | None |
| `src/transform.ts` | Modify | ~15 | `generate_text.ts` |
| `helptext.ts` | Already updated | — | None |

### Testing Strategy

1. `cmt --init deno-cli codemeta.json mycmd` generates version.ts, Makefile with compile target for `mycmd`, and updates deno.json
2. `cmt --init deno-cli codemeta.json cmd1 cmd2` produces two compile targets
3. `cmt --init deno-bundle codemeta.json` generates Makefile with bundle target, no version.ts
4. `cmt --init deno-es-module codemeta.json` generates minimal Makefile, no version.ts
5. `cmt --init deno-webcomponent codemeta.json` generates Makefile with manifest and demo targets
6. Deprecated `--init deno` still works and produces same output as `--init deno-cli`
7. All deno-* types update deno.json gen-code task automatically

---

## Work Order Recommendation

1. **deno_tasks.ts cleanup** (Priority 3) - Quick win, ~1 day
   - Lowest risk, well-contained changes
   - Must land before Priority 4 since Priority 4 depends on `addDenoTasks()`

2. **Deno sub-types** (Priority 4) - ~2-3 days
   - Builds directly on Priority 3
   - Replaces/deprecates old init values; no other priorities depend on it

3. **Non-Programming Project Support** (Priority 2) - ~1-2 days
   - Independent of Priorities 3 and 4; can proceed in parallel if needed
   - Straightforward: two new switch cases and one new Makefile template

4. **Global Configuration** (Priority 1) - Highest impact, ~3-4 days
   - Most complex; can be done last without blocking other work
   - Requires careful profile selection UI design

---

## Acceptance Criteria

### Global Configuration (Priority 1)
- [ ] `src/config.ts` created with `Profile`, `License`, `Config` interfaces and all I/O functions
- [ ] `getLicenseText()` reads from `file` path (with `~` expansion) or inline `text`; `file` wins when both present
- [ ] `cme --profiles` lists configured profiles
- [ ] `cme --person-lists` lists configured person lists
- [ ] `cme --apply-license codemeta.json` writes `./LICENSE` and updates `license` URL in codemeta
- [ ] Editing author/contributor/maintainer shows unified menu of profiles and person lists
- [ ] Single profile selection works for `person_or_organization` fields
- [ ] Person list selection works for `person_or_organization_list` fields (applies whole list at once)
- [ ] List build (add-another loop) works for `person_or_organization_list` fields
- [ ] Editing `license` field prompts to apply from config; writes `./LICENSE` on selection
- [ ] Manual entry fallback works for all field types
- [ ] All behaviour unchanged when no config file exists
- [ ] `helptext.ts` updated for new flags

### Non-Programming Projects (Priority 2)
- [ ] `--init documentation` generates correct files including Makefile and make.ps1
- [ ] `--init presentation` generates the same file set as documentation
- [ ] Generic Makefile template added with hard tabs (not spaces)
- [ ] No version.* files generated for documentation or presentation type
- [ ] Backward compatibility maintained (`--init javascript` etc. unchanged)
- [ ] Help text updated

### deno_tasks.ts (Priority 3)
- [ ] `src/deno_tasks.ts` rewritten with working `addDenoTasks()` function
- [ ] Ad-hoc `app.deno = true` assignments removed from `cmt.ts`; replaced with automatic `lang.startsWith("deno")` check
- [ ] No `--deno` flag added (project type encodes this implicitly)
- [ ] `cmt.ts` calls `addDenoTasks()` automatically for all `--init deno-*` types, passing only regeneratable files
- [ ] deno.json tasks are plain strings (not objects)
- [ ] Creates/updates deno.json with gen-code task
- [ ] Backup file created before modification
- [ ] Existing tasks preserved
- [ ] `helptext.ts` updated: `--deno` example removed; `--init` lists all deno-* types with note about automatic gen-code task
- [ ] Tests pass

---

### Deno Sub-types (Priority 4)
- [ ] `--init deno-cli` generates version.ts, Makefile with per-executable compile targets, and updates deno.json
- [ ] `--init deno-bundle` generates Makefile with bundle target; no version.ts
- [ ] `--init deno-es-module` generates minimal Makefile; no version.ts
- [ ] `--init deno-webcomponent` generates Makefile with manifest and demo targets; no version.ts
- [ ] Deprecated `--init deno`, `--init typescript`, `--init javascript` still work (alias to `deno-cli`)
- [ ] All `deno-*` types automatically update deno.json gen-code task
- [ ] `helptext.ts` documents all four sub-types and notes deprecated aliases

---

## Success Metrics

- User can pre-configure profiles, person lists, and licenses in `~/.cmtoolsrc` and apply
  them from `cme` without typing YAML by hand
- `cme --apply-license codemeta.json` writes `./LICENSE` and updates the codemeta `license` URL
- User can initialize documentation/presentation projects with `cmt --init documentation`
- User can initialize any of four Deno project sub-types and get the appropriate Makefile
  and deno.json tasks automatically
- Deprecated `--init deno/typescript/javascript` values continue to work unchanged
- No breaking changes to existing functionality
- All existing tests still pass
