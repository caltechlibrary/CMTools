---
id: "0003"
title: "Global configuration: profiles, licenses and person lists in `~/.cmtoolsrc`"
date: "2026-05-12"
status: accepted
kind: decision
trigger: design
project: CMTools
phase: "0.0.45"
supersedes: []
superseded_by: ["0008"]
relates_to: ["0008", "0009"]
initiative: ""
session: ""
decisions: ["Config lives at ~/.cmtoolsrc, with ~/.config/cmtools/ as fallback and --global-config as override", "A license may carry `file` or inline `text`; `file` wins when both are present", "`url`, when present, is what gets written to the codemeta `license` field", "Person lists store inline person data, not references to profile names", "One unified selection menu shows individual profiles and pre-defined lists together", "License-apply logic is one shared helper called by both --apply-license and the editor path"]
tags: [config, cme, profiles, licenses]
uuid: "01a03af1-e5cb-73c6-a794-9317965df3a0"
origin_host: "MACMINI-RD.local"
---

**Context.** Three common `cme` tasks all required typing YAML by hand:
populating `author` / `contributor` / `maintainer`, applying a standard
license, and building a team contributor list. The person/organization fields
went through `editCodeMetaTerm()` in `src/codemeta_editor.ts`, and the
`PersonOrOrganization` class already modelled the data — the friction was
entirely in data entry, repeated across every project, for values that are the
same every time.

**Decision.** A configuration file holding named profiles, named licenses and
named person lists, with `cme` gaining `--profiles`, `--person-lists`,
`--apply-license` and `--global-config`. Six decisions in this episode:

*Location.* `~/.cmtoolsrc` primary, `~/.config/cmtools/` as fallback,
`--global-config PATH` as override.

*License storage.* Both `file` and `text` are optional and at least one is
required. `file` is read from disk with `~` expanded and takes precedence when
both are present. `url` is separate and optional; when present it is what gets
written to the `license` field in `codemeta.json`.

*Person lists hold inline data, not profile references.* A list entry is a full
person object, duplicating what a profile may also hold.

*One unified menu.* Individual profiles and pre-defined lists appear in a
single numbered list, together with "enter manually" and "skip", rather than in
separate prompts.

*Selecting a list applies it whole* for `person_or_organization_list` fields,
with a confirmation before overwriting; selecting a single profile either fills
a `person_or_organization` field or seeds a list the user extends entry by
entry.

*One shared apply-license helper*, `applyLicenseFromConfig()`, called by both
the `--apply-license` flag and the `license` path inside `editCodeMetaTerm()`.

**Rationale.** Person lists store inline data specifically so they are
self-contained: a list does not break when a profile is renamed or removed. The
duplication is accepted deliberately in exchange for that.

`file`-over-`text` precedence follows from what the two are for — inline `text`
suits a short license pasted into config, a `file` path suits the real license
text kept once on disk. If someone has bothered to point at a file, that is the
more deliberate of the two.

The unified menu exists because the alternative — asking "profile or list?"
first — makes the user answer a question about CMTools' internal data model
before they can answer the question they actually have, which is who the author
is.

**Rejected alternatives.**

- *Person lists as arrays of profile names.* Less duplication and a single
  place to correct someone's ORCID. Rejected because it makes a list silently
  wrong, or silently short, when a profile is renamed — and a contributor list
  that quietly loses a person is worse than one with a stale affiliation.
- *Separate prompts for profiles and for lists.* Simpler to implement, but it
  surfaces a distinction the user does not care about at the moment of choosing.
- *Duplicating the license-apply logic* in the flag handler and the editor
  path. Rejected on the obvious grounds; extracting the helper was cheap.

**Consequences.**

- Backward compatibility was an explicit acceptance criterion: all existing
  behaviour is unchanged when no config file exists.
- The config **format and resolution rules stated in this episode did not
  survive implementation.** The design specified JSON and a single file with
  one fallback; what shipped is YAML with a merge-all walk from the current
  directory up to `$HOME`. See
  [DR-0008](0008-config-resolution-is-yaml-and-merges-every.md) — this record
  stays `accepted` rather than `superseded` because the four other decisions
  above are still in force. Partial supersession, per the format.
- Planned and tagged as v0.0.45; shipped in v0.0.46. `CHANGES.md` has no
  v0.0.45 entry even though the tag exists.
