
# where FORMAT is either s5, slidy, slideous, dzslides, or revealjs.
WEB_FORMAT = slidy

build: .FORCE clean html

html: presentation1.md
	pandoc -V lang=en -s -t $(WEB_FORMAT) presentation1.md -o presentation1.html
	git add presentation1.html

pdf: .FORCE
	pandoc -V lang=en -s -t beamer presentation1.md -o presentation1.pdf

pptx: .FORCE
	pandoc -V lang=en -s presentation.md -o presentation.pptx

clean: .FORCE
	if [ -f index.html ]; then rm presentation/*.html; fi
	if [ -f CMTools-presentation.pdf ]; then rm presentation/*.pdf; fi
	if [ -f CMTools-presentation.pptx ]; then rm presentation/*.pptx; fi

.FORCE:
