---
id: "0008"
title: "Config resolution is YAML, and merges every `.cmtoolsrc` from the current directory up to `$HOME`"
date: "2026-06-18"
status: accepted
kind: decision
trigger: implementation
project: CMTools
phase: "0.0.46"
supersedes: ["0003"]
superseded_by: []
relates_to: ["0003", "0009"]
initiative: ""
session: ""
decisions: ["YAML, not JSON, as the config file format", "Every .cmtoolsrc from cwd up to $HOME is collected and merged, not just the first one found", "Scalar fields take the first match; map fields merge lowest-to-highest so project-level keys win", "~/.config/cmtools/config.yaml is appended as a final fallback"]
tags: [config, yaml, precedence]
uuid: "01a03af1-e5cb-73c6-a794-931c837a1c2e"
origin_host: "MACMINI-RD.local"
---

**Context.** [DR-0003](0003-global-configuration-profiles-licenses-and.md)
specified `~/.cmtoolsrc` in JSON, with `~/.config/cmtools/config.json` as a
fallback and `--global-config` as an override — one file, first match wins. In
implementation both halves of that changed, and neither change was recorded at
the time.

The single-file rule broke on the case the config system exists to serve.
Profiles and licenses are genuinely user-level: the same author entry and the
same license apply across every project. But a project needs its own
overrides — its executable names, and a person list specific to that team. With
first-match-wins, a project-level `.cmtoolsrc` shadows the user-level one
entirely, so a project that wants to add one executable name loses every
profile and license the user has configured.

**Decision.** `src/config.ts` walks from the current directory up to `$HOME`,
collecting every `.cmtoolsrc` it finds, then merges them:

- **Scalar fields** — `default_profile`, `default_license`, `executables` —
  take the **first match**, so the nearest file wins outright.
- **Map fields** — `profiles`, `licenses`, `person_lists` — are merged
  lowest-to-highest with `Object.assign`, so project-level keys win on
  collision while user-level keys survive as fallbacks.
- `~/.config/cmtools/config.yaml` is appended as a final fallback.

The file format is YAML, parsed with `@std/yaml`.

**Rationale.** The scalar/map split is the whole point. A scalar is a choice —
which profile is the default — and the nearest declaration should win cleanly.
A map is a *collection* of available things, and a project adding one entry
should extend the set rather than replace it. Applying one rule to both would
be wrong in one direction or the other: first-match on maps loses user-level
profiles, and merging scalars is meaningless.

YAML over JSON because the file is hand-edited. It admits comments, which JSON
does not, and CMTools' neighbouring formats — `CITATION.cff`, and the YAML
blocks `cme` already prompts for when editing person fields — are YAML too.
Asking a user to hand-write JSON next to a tool that prints YAML at them is a
gratuitous inconsistency.

**Rejected alternatives.**

- *First match wins across a single file*, as designed in DR-0003. Rejected
  once project-level overrides met user-level profiles; see above.
- *Deep merge of map values*, so a project could override one field of a
  profile. Rejected as more machinery than the case needs — a project wanting a
  different affiliation can declare a whole profile under its own key, and
  partial-merge semantics are hard to predict when reading a config file.
- *JSON, as planned.* Would have matched `codemeta.json` and needed no parser
  dependency. The comment argument won.

**Consequences.**

- Partial supersession of DR-0003: two of its six decisions are replaced,
  four still stand, so that record stays `accepted` with a `superseded_by`
  link rather than being marked superseded wholesale.
- `release_0.0.45_goals.md` still documents the JSON schema and the
  `~/.config/cmtools/config.json` path. It is a planning document for a release
  that shipped as v0.0.46 and has not been corrected.
- `loadConfig()` calls `Deno.env.get("HOME")`, which is what makes
  `--allow-env` mandatory everywhere — see
  [DR-0010](0010-every-cmt-invocation-needs-allow-env.md).
- This record is written in 2026-08 from the shipped source, not at the time of
  the change. The reasoning above is reconstructed from the code and the case
  it handles; the date is the v0.0.46 release date.
