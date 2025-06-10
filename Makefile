#
# A Deno project makefile
#
PROJECT = CMTools

PACKAGE = CMTools

PROGRAMS = cmt cme

TS_MODS = cmt.ts cme.ts codemeta.ts gitcmds.ts helptext.ts person_or_organization.ts transform.ts

GIT_GROUP = caltechlibrary

VERSION = $(shell grep '"version":' codemeta.json | cut -d\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

PACKAGE = $(shell ls -1 *.ts | grep -v 'version.ts')

MAN_PAGES_1 = $(shell ls -1 *.1.md | sed -E 's/\.1.md/.1/g')

MAN_PAGES_3 = $(shell ls -1 *.3.md | sed -E 's/\.3.md/.3/g')

MAN_PAGES_7 = $(shell ls -1 *.7.md | sed -E 's/\.7.md/.7/g')

RELEASE_DATE=$(shell date +'%Y-%m-%d')

RELEASE_HASH=$(shell git log --pretty=format:%h -n 1)

HTML_PAGES = $(shell ls -1 *.html) # $(shell ls -1 *.md | grep -v 'nav.md' | sed -E 's/.md/.html/g')

OS = $(shell uname)

EXT =
ifeq ($(OS), Windows)
        EXT = .exe
endif

PREFIX = $(HOME)

TS_MODS = $(shell ls -1 *.ts | grep -v _test.ts | grep -v deps.ts | grep -v version.ts)

build: version.ts CITATION.cff INSTALL.md about.md bin compile installer.sh installer.ps1

bin: .FORCE
	mkdir -p bin

compile: .FORCE
	deno task build

check: .FORCE
	deno task check

version.ts: codemeta.json
	deno task version.ts

INSTALL.md: .FORCE
	cmt codemeta.json INSTALL.md

format: $(shell ls -1 *.ts | grep -v version.ts | grep -v deps.ts)

$(shell ls -1 *.ts | grep -v version.ts): .FORCE
	deno fmt $@

man: $(MAN_PAGES_1) # $(MAN_PAGES_3) $(MAN_PAGES_7)

$(MAN_PAGES_1): .FORCE
	mkdir -p man/man1
	pandoc $@.md --from markdown --to man -s >man/man1/$@

CITATION.cff: codemeta.json
	deno task CITATION.cff

about.md: codemeta.json
	deno task about.md

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

website: $(HTML_PAGES) .FORCE
	make -f website.mak
	cd presentations && make || exit 1

presentations: .FORCE
	cd presentations && make || exit 1

publish: website .FORCE
	./publish.bash

htdocs: .FORCE
	deno task htdocs
	deno task transpile

test: .FORCE
	deno task test

install: build man .FORCE
	mkdir -p "${HOME}/bin"
	cp -v "./bin/cmt$(EXT)" "${HOME}/bin"
	cp -v "./bin/cme$(EXT)" "${HOME}/bin"
	cp -vR "./man" "${HOME}/"

uninstall: .FORCE
	rm "${HOME}/bin/cmt$(EXT)"
	rm man/man1/cmt.1

installer.sh: .FORCE
	cmt codemeta.json installer.sh
	chmod 775 installer.sh
	git add -f installer.sh

installer.ps1: .FORCE
	cmt codemeta.json installer.ps1
	chmod 775 installer.ps1
	git add -f installer.ps1

clean:
	if [ -d bin ]; then rm -fR bin/*; fi
	if [ -d dist ]; then rm -fR dist/*; fi

installers: INSTALL.md installer.sh installer.ps1

INSTALL.md: .FORCE
	deno run --allow-read --allow-write --allow-run cmt.ts codemeta.json INSTALL.md

installer.sh: .FORCE
	deno run --allow-read --allow-write --allow-run cmt.ts codemeta.json installer.sh

installer.ps1: .FORCE
	deno run --allow-read --allow-write --allow-run cmt.ts codemeta.json installer.ps1

project_scripts: website.mak website.ps1 release.bash release.ps1 publish.bash publish.ps1
	deno run --allow-read --allow-write --allow-run cmt.ts codemeta.json website.mak release.bash publish.bash
	deno run --allow-read --allow-write --allow-run cmt.ts codemeta.json website.ps1 release.ps1 publish.ps1

release: clean build man website project_scripts distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64 dist/Windows-arm64
	printf "\n\tReady to do ./release.bash\n"

setup_dist: .FORCE
	@rm -fR dist
	@mkdir -p dist

distribute_docs: website man setup_dist
	@cp README.md dist/
	@cp LICENSE dist/
	@cp codemeta.json dist/
	@cp CITATION.cff dist/
	@cp *.1.md dist/
	@cp INSTALL.md dist/
	@cp approach_and_implementation.md dist/
	@cp bootstrapping_with_cmt.md dist/
	@cp -vR man dist/

dist/Linux-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_linux_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-x86_64.zip LICENSE codemeta.json CITATION.cff *.md man/* bin/*
	@rm -fR dist/bin

dist/Linux-aarch64: .FORCE
	@mkdir -p dist/bin
	deno task dist_linux_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-aarch64.zip LICENSE codemeta.json CITATION.cff *.md man/* bin/*
	@rm -fR dist/bin

dist/macOS-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_macos_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-x86_64.zip LICENSE codemeta.json CITATION.cff *.md man/* bin/*
	@rm -fR dist/bin

dist/macOS-arm64: .FORCE
	@mkdir -p dist/bin
	deno task dist_macos_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-arm64.zip LICENSE codemeta.json CITATION.cff *.md man/* bin/*
	@rm -fR dist/bin

dist/Windows-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task dist_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-x86_64.zip LICENSE codemeta.json CITATION.cff *.md man/* bin/*
	@rm -fR dist/bin

dist/Windows-arm64: .FORCE
	@mkdir -p dist/bin
	#deno task dist_windows_aarch64 <-- switch to native when Rust/Deno supports Windows ARM64
	deno task dist_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-arm64.zip LICENSE codemeta.json CITATION.cff *.md man/* bin/*
	@rm -fR dist/bin

.FORCE:
