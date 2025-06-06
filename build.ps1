#!/usr/bin/env pwsh

#
# Will build cme and cmt using deno if the Makefile is not an option (e.g. on Windows 10 or 11)
#
deno task version.ts
deno task build
